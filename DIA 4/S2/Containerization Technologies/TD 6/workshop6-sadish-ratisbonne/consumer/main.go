package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// =============================================================================
// CLI flags
// =============================================================================

var (
	cpuBurn    = flag.Bool("cpu-burn", false, "Whether to use CPU while processing messages")
	httpAddr   = flag.String("http", ":8080", "Address to listen for requests on")
	redisAddr  = flag.String("redis-server", "redis:6379", "Redis server to consume messages from")
	redisQueue = flag.String("redis-queue", "esilv", "Redis queue to consume messages from")
	logToFile  = flag.Bool("log-to-file", false, "Whether to log everything in file instead of stdout")
	timePerMsg = flag.Duration("per-msg", time.Second, "The amount of time the consumer spends on each message")
)

// =============================================================================
// Main logic
// =============================================================================

func main() {
	// log to files
	if *logToFile {
		f, err := os.OpenFile("/consumer.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0o666)
		if err != nil {
			log.Fatalf("error opening log file: %v", err)
		}
		defer f.Close()
		if *logToFile {
			f, err := os.OpenFile("/consumer.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0o666)
			if err != nil {
				log.Fatalf("error opening log file: %v", err)
			}
			defer f.Close()
			log.SetOutput(f) // ✅ Redirect logs to file
		}
	}

	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	flag.Parse()

	// This context will get canceled upon receiving a SIGINT signal from the
	// operating system. We use this to shut the consumer down gracefully.
	ctx, shutdown := signal.NotifyContext(context.Background(), os.Interrupt)

	var wg sync.WaitGroup

	// Start consuming messages from Redis.
	client := redis.NewClient(&redis.Options{Addr: *redisAddr})
	c := newConsumer(client, *redisQueue, *timePerMsg, *cpuBurn)
	wg.Add(1)
	go func() {
		defer wg.Done()
		c.consumeMessages(ctx)
	}()

	// Start serving HTTP requests.
	srv := http.Server{Addr: *httpAddr, Handler: c.router}
	wg.Add(1)
	go func() {
		defer wg.Done()
		log.Printf("Listening on %s...", *httpAddr)
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			log.Printf("Error: unable to listen for requests: %s", err)
			shutdown()
		}
	}()
	// Shut the HTTP server down when the context is cancelled.
	go func() {
		<-ctx.Done()
		shutdownCtx, _ := context.WithTimeout(context.Background(), 5*time.Second)
		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Printf("Error: failed to shut down HTTP server gracefully: %s", err.Error())
		}
	}()

	<-ctx.Done()
	log.Println("Shutting down...")
	wg.Wait()

	return nil
}

// =============================================================================
// Consumer
// =============================================================================

type consumer struct {
	wg sync.WaitGroup

	router *mux.Router

	client *redis.Client
	queue  string

	perMsg  time.Duration
	cpuBurn bool

	healthy bool

	consumed prometheus.Counter
}

func newConsumer(client *redis.Client, queue string, perMsg time.Duration, cpuBurn bool) *consumer {
	c := consumer{
		router:  mux.NewRouter(),
		client:  client,
		queue:   queue,
		perMsg:  perMsg,
		cpuBurn: cpuBurn,
		healthy: true,
		consumed: promauto.NewCounter(prometheus.CounterOpts{
			Name: "consumer_messages_consumed_total",
			Help: "The total number of consumed messages",
		}),
	}

	c.router.HandleFunc("/healthz", c.handleHealthcheck).Methods("GET")
	c.router.Handle("/metrics", promhttp.Handler())

	return &c
}

// =============================================================================
// HTTP handlers
// =============================================================================

func (p *consumer) handleHealthcheck(w http.ResponseWriter, r *http.Request) {
	switch p.healthy {
	case true:
		fmt.Fprintf(w, "The server is healthy")
	case false:
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "The server is unhealthy: the last attempt to publish a message failed")
	}
}

// =============================================================================
// Message consumption
// =============================================================================

func (c *consumer) consumeMessages(ctx context.Context) {
	log.Printf("Starting to consume messages in %s...\n", c.queue)
	rand.Seed(time.Now().UnixNano())

	for {
		select {
		case <-ctx.Done():
			log.Println("Consumer shutting down...")
			return
		default:
			// Read message WITHOUT deleting it
			msg, err := c.client.LIndex(ctx, c.queue, 0).Result()
			if err == redis.Nil {
				// No messages in queue, wait before retrying
				time.Sleep(1 * time.Second)
				continue
			} else if err != nil {
				log.Printf("❌ Error getting message from queue: %s", err.Error())
				continue
			}

			log.Printf("📩 Received a message: %q.", msg)
			log.Println("⏳ Processing message...")

			// Simulate message processing
			if c.cpuBurn {
				done := time.After(c.perMsg)
				finished := false

				for !finished {
					select {
					case <-done:
						finished = true
					default:
					}
				}
			} else {
				time.Sleep(c.perMsg)
			}

			// Mark message as processed
			c.consumed.Inc()
			log.Println("✅ Message processed (but not deleted).")
		}
	}
}

func min(a, b time.Duration) time.Duration {
	if a < b {
		return a
	}
	return b
}