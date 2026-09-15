import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<any[]>([]);
  wishlistItems$ = this.wishlistItems.asObservable();

  constructor() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlistItems.next(JSON.parse(saved));
    }
  }

  toggle(product: any) {
    if (this.isInWishlist(product.id)) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  add(product: any) {
    if (this.isInWishlist(product.id)) { return; }
    this.wishlistItems.next([...this.wishlistItems.value, product]);
    this.save();
  }

  remove(productId: number) {
    this.wishlistItems.next(this.wishlistItems.value.filter(item => item.id !== productId));
    this.save();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.value.some(item => item.id === productId);
  }

  getCount(): number {
    return this.wishlistItems.value.length;
  }

  private save() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems.value));
  }
}
