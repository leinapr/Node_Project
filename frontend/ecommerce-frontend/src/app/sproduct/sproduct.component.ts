import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sproduct',
  templateUrl: './sproduct.component.html',
  styleUrls: ['./sproduct.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class SproductComponent implements OnInit {
  product: any = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.queryParamMap.get('id');
    if (productId) {
      this.fetchProduct(productId);
    } else {
      console.error('Product ID is missing in the query parameters.');
    }
  }

  async fetchProduct(productId: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3030/api/product/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const productData = await response.json();

      // Parse price as a float
      if (productData.price) {
        productData.price = parseFloat(productData.price);
      }

      this.product = productData;
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }

  addToCart(): void {
    if (this.product) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const productInCart = cart.find((item: any) => item.id === this.product.id);

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.push({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.product.image,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Product added to cart:', this.product.name);
    }
  }

  buyNow(): void {
    this.addToCart();
    window.location.href = '/cart';
  }
}
