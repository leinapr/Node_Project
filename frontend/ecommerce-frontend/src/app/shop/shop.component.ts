import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class ShopComponent implements OnInit {
  products: any[] = []; // All fetched products
  displayedProducts: any[] = []; // Products currently displayed
  pageSize = 100; // Maximum number of products to display
  container!: HTMLElement; // Container for product items

  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

  async ngOnInit(): Promise<void> {
    this.container = this.elRef.nativeElement.querySelector('.product-list');
    await this.fetchProducts(); // Fetch and initialize products
  }

  async fetchProducts(): Promise<void> {
    try {
      // Fetch all products from the backend
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      this.products = Array.isArray(data.products) ? data.products : [];
      this.updateDisplayedProducts(); // Initialize the displayed products
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }

  updateDisplayedProducts(): void {
    // Show only the first 20 products in the UI
    this.displayedProducts = this.products.slice(0, this.pageSize);
    this.clearContainer();
    this.displayProducts(this.displayedProducts);
  }

  updateProductsDisplay(): void {
    // Filter and sort the products, then limit the displayed items
    this.clearContainer();

    const query = (document.getElementById('search-input') as HTMLInputElement).value.toLowerCase();
    const criteria = (document.getElementById('filter-criteria') as HTMLSelectElement).value;
    const genre = (document.getElementById('filter-genre') as HTMLSelectElement).value;
    const category = (document.getElementById('filter-category') as HTMLSelectElement).value;
    const type = (document.getElementById('filter-type') as HTMLSelectElement).value;
    const sortBy = (document.getElementById('sort-by') as HTMLSelectElement).value;

    let filteredProducts = this.filterProducts(query, criteria, genre, category, type);
    filteredProducts = this.sortProducts(filteredProducts, sortBy);

    // Update the displayed products with the filtered/sorted list, limited to `pageSize`
    this.displayedProducts = filteredProducts.slice(0, this.pageSize);
    this.displayProducts(this.displayedProducts); // Re-render filtered products
  }

  filterProducts(query: string, criteria: string, genre: string, category: string, type: string): any[] {
    return this.products.filter(product => {
      let isMatch = true;

      // Text search based on criteria
      if (criteria === 'all') {
        isMatch = (
          product.name.toLowerCase().includes(query) ||
          (product.authors && product.authors.some((author: string) => author.toLowerCase().includes(query))) ||
          (product.genres && product.genres.some((g: string) => g.toLowerCase().includes(query))) ||
          product.price.toString().includes(query)
        );
      } else if (criteria === 'name') {
        isMatch = product.name.toLowerCase().includes(query);
      } else if (criteria === 'author') {
        isMatch = product.authors?.some((author: string) => author.toLowerCase().includes(query));
      }

      // Genre filter (Action, Adventure, etc.)
      if (genre && genre !== 'all') {
        isMatch = isMatch && product.genres?.some((g: string) => g.toLowerCase() === genre.toLowerCase());
      }

      // Category filter (Seinen, Shounen, etc.)
      if (category && category !== 'all') {
        isMatch = isMatch && product.demographics?.some((d: string) => d.toLowerCase() === category.toLowerCase());
      }

      // Type filter (e.g., manga, anime)
      if (type && type !== 'all') {
        isMatch = isMatch && product.type.toLowerCase() === type.toLowerCase();
      }

      return isMatch;
    });
  }

  sortProducts(filteredProducts: any[], criteria: string): any[] {
    return filteredProducts.sort((a, b) => {
      switch (criteria) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'score':
          return parseFloat(b.score || 0) - parseFloat(a.score || 0);
        default:
          return 0;
      }
    });
  }

  displayProducts(products: any[]): void {
    // Render the products in the container
    products.forEach(product => {
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
      this.renderer.appendChild(this.container, productItem);
    });
  }

  clearContainer(): void {
    while (this.container.firstChild) {
      this.renderer.removeChild(this.container, this.container.firstChild);
    }
  }
}
