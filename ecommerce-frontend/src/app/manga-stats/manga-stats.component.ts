import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manga-stats',
  templateUrl: './manga-stats.component.html',
  standalone: true,
  imports: [RouterLink],
  styleUrls: ['./manga-stats.component.scss']
})
export class MangaStatsComponent implements OnInit {
  genreChartOptions: any;
  categoryChartOptions: any;
  typeChartOptions: any;
  mangaData: any[] = [];
  pageSize = 50;
  currentOffset = 0;
  isLoading = false;
  hasMoreProducts = true;

  constructor() { }

  ngOnInit(): void {
    this.fetchMangaData();
  }

  async fetchMangaData(): Promise<void> {
    this.isLoading = true;

    try {
      let hasMore = true;
      let offset = 0;

      while (hasMore) {
        const response = await fetch(`http://localhost:3000/products?offset=${offset}&limit=${this.pageSize}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        const newProducts = Array.isArray(data.products) ? data.products : [];
        console.log('Fetched products batch:', newProducts);

        if (newProducts.length === 0) {
          hasMore = false;
        } else {
          this.mangaData.push(...newProducts);
          offset += this.pageSize;
        }
      }

      console.log('All products fetched:', this.mangaData);
      this.updateCharts();
    } catch (error) {
      console.error('Failed to fetch all products:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateCharts(): void {
    this.genreChartOptions = this.generateChartOptions(
      'Manga Genre Popularity (Based on Score)',
      'Genres',
      this.groupByAttribute(this.mangaData, 'genres')
    );

    this.categoryChartOptions = this.generateChartOptions(
      'Manga Demographics Popularity (Based on Score)',
      'Demographics',
      this.groupByAttribute(this.mangaData, 'demographics') // Mise à jour ici
    );

    this.typeChartOptions = this.generateChartOptions(
      'Manga Type Popularity (Based on Score)',
      'Types',
      this.groupByAttribute(this.mangaData, 'type')
    );

    // Afficher les graphiques
    Highcharts.chart('genre-chart-container', this.genreChartOptions);
    Highcharts.chart('category-chart-container', this.categoryChartOptions);
    Highcharts.chart('type-chart-container', this.typeChartOptions);
  }

  generateChartOptions(title: string, xAxisTitle: string, data: { [key: string]: number }): Highcharts.Options {
    return {
      chart: { type: 'column' },
      title: { text: title },
      xAxis: {
        categories: Object.keys(data),
        title: { text: xAxisTitle }
      },
      yAxis: {
        min: 0,
        title: { text: 'Average Score' },
        max: 10
      },
      series: [{
        type: 'column',
        name: 'Average Score',
        data: Object.values(data),
        color: '#007BFF'
      }],
      credits: { enabled: false }
    };
  }

  groupByAttribute(products: any[], attribute: string): { [key: string]: number } {
    const map: { [key: string]: { totalScore: number; count: number } } = {};

    products.forEach(product => {
      if (!product[attribute] || !product.score) {
        console.warn(`Product with missing ${attribute} or score:`, product);
        return;
      }

      const values = Array.isArray(product[attribute]) ? product[attribute] : [product[attribute]];
      const score = parseFloat(product.score);

      values.forEach((value: string) => {
        if (!map[value]) {
          map[value] = { totalScore: 0, count: 0 };
        }
        map[value].totalScore += score;
        map[value].count += 1;
      });
    });

    const averages: { [key: string]: number } = {};
    Object.keys(map).forEach(key => {
      const { totalScore, count } = map[key];
      averages[key] = count > 0 ? totalScore / count : 0; // Inclure même avec une moyenne de 0
    });

    console.log(`Calculated ${attribute} map:`, averages);
    return averages;
  }
}
