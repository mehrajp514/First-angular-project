import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../wishlist.service';
import { CartService } from '../cart.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  items: any[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wishlistService.wishlistItems$.subscribe(items => this.items = items);
  }

  remove(productId: number) {
    this.wishlistService.remove(productId);
    this.toast.info('Removed from wishlist.');
  }

  moveToCart(product: any) {
    this.cartService.addToCart(product);
    this.wishlistService.remove(product.id);
    this.toast.success(`${product.name} moved to cart.`);
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
