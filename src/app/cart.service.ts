import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  addToCart(product: any, quantity: number = 1) {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ ...product, quantity });
    }

    this.cartItems.next(currentCart);
    this.saveCart();
  }

  removeFromCart(productId: number) {
    const currentCart = this.cartItems.value.filter(item => item.id !== productId);
    this.cartItems.next(currentCart);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentCart = this.cartItems.value.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItems.next(currentCart);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCart();
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }
}
