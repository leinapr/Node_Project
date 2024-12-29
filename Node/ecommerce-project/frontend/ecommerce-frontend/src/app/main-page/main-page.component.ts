import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
  imports: [RouterModule], // Import RouterModule here
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
      this.products = this.getTopProducts(products.products || []); // Access the nested "products" array
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

      const productName = this.renderer.createElement('h3');
      const nameText = this.renderer.createText(product.name);
      this.renderer.appendChild(productName, nameText);

      const productPrice = this.renderer.createElement('p');
      const priceText = this.renderer.createText(`$${parseFloat(product.price).toFixed(2)}`);
      this.renderer.appendChild(productPrice, priceText);

      const productScore = this.renderer.createElement('p');
      const scoreText = this.renderer.createText(`Score: ${product.score || 'not scored yet'}`);
      this.renderer.appendChild(productScore, scoreText);

      const productImage = this.renderer.createElement('img');
      this.renderer.setAttribute(productImage, 'src', product.image);
      this.renderer.setAttribute(productImage, 'alt', product.name);
      this.renderer.addClass(productImage, 'product-image');

      const viewProductButton = this.renderer.createElement('a');
      this.renderer.addClass(viewProductButton, 'btn');
      const buttonText = this.renderer.createText('View Product');
      this.renderer.appendChild(viewProductButton, buttonText);

      // Set Angular routing dynamically
      this.renderer.listen(viewProductButton, 'click', () => {
        window.location.href = `/sproduct?id=${product.id}`;
      });

      // Append all elements to the product item
      this.renderer.appendChild(productItem, productName);
      this.renderer.appendChild(productItem, productPrice);
      this.renderer.appendChild(productItem, productScore);
      this.renderer.appendChild(productItem, productImage);
      this.renderer.appendChild(productItem, viewProductButton);

      // Add product item to the container
      this.renderer.appendChild(container, productItem);
    });
  }
}
