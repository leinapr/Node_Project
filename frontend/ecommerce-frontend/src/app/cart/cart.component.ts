import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Holds the cart items
  subtotal: number = 0;
  total: number = 0;
  discount: number = 0;

  ngOnInit(): void {
    this.loadCart();
  }

  /**
   * Load cart items from localStorage
   */
  loadCart(): void {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      this.cart = storedCart ? JSON.parse(storedCart) : [];
      this.updateTotals();
    } else {
      console.warn('localStorage is not available in the current environment.');
      this.cart = [];
    }
  }


  /**
   * Update cart subtotal, discount, and total
   */
  updateTotals(): void {
    this.subtotal = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.total = this.subtotal - this.discount;
  }

  /**
   * Remove an item from the cart
   * @param productId - ID of the product to remove
   */
  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateTotals();
  }

  /**
   * Update the quantity of a product in the cart
   * @param productId - ID of the product
   * @param event - Input event for quantity change
   */
  updateQuantity(productId: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    if (newQuantity >= 1) {
      const product = this.cart.find(item => item.id === productId);
      if (product) {
        product.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateTotals();
      }
    } else {
      inputElement.value = '1'; // Reset invalid input to 1
    }
  }

  /**
   * Apply a discount coupon
   * @param coupon - Coupon code entered by the user
   */
  applyCoupon(coupon: string): void {
    if (coupon === 'DISCOUNT10') {
      this.discount = this.subtotal * 0.1; // Apply 10% discount
      alert('Coupon applied: 10% off');
    } else {
      alert('Invalid coupon');
      this.discount = 0;
    }
    this.updateTotals();
  }

  /**
   * Clear the cart completely
   */
  clearCart(): void {
    localStorage.removeItem('cart');
    this.cart = [];
    this.updateTotals();
  }
}
