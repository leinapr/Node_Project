import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true, // Mark this component as standalone
})
export class MainPageComponent implements OnInit {
  products: any[] = [];

  constructor(private renderer: Renderer2) { } // Inject Renderer2

  ngOnInit(): void {
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    const productTop = this.renderer.selectRootElement('.pro-container', true);

    if (!productTop) {
      console.error('.pro-container not found in the HTML.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const products = await response.json();
      this.products = this.getTopProducts(products);
      this.displayTopProducts(productTop, this.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  getTopProducts(products: any[]): any[] {
    return products
      .filter(product => product.score) // Ensure product has a score
      .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort by score in descending order
      .slice(0, 4); // Get the top 4
  }

  displayTopProducts(container: Element, topProducts: any[]): void {
    // Clear previous products
    while (container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }

    if (topProducts.length === 0) {
      const noProductsMessage = this.renderer.createText('No products found.');
      this.renderer.appendChild(container, noProductsMessage);
      return;
    }

    topProducts.forEach(product => {
      const productItem = this.renderer.createElement('div');
      this.renderer.addClass(productItem, 'pro');

      const productHTML = `
        <h3>${product.name}</h3>
        <p>$${parseFloat(product.price).toFixed(2)}</p>
        <p>Score: ${product.score || 'not scored yet'}</p>
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <a href="sproduct.html?id=${product.id}" class="btn">View Product</a>
      `;
      productItem.innerHTML = productHTML; // Safely add HTML content
      this.renderer.appendChild(container, productItem);
    });
  }
}
