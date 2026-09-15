import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  loading = true;

  features = [
    { icon: '🚚', title: 'Free Shipping', text: 'On all orders over $50' },
    { icon: '🔒', title: 'Secure Payment', text: '100% protected checkout' },
    { icon: '↩️', title: 'Easy Returns', text: '30-day return policy' },
    { icon: '💬', title: '24/7 Support', text: "We're here to help anytime" }
  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    public authService: AuthService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data.categories;
    });
  }

  loadProducts() {
    this.dataService.getProducts().subscribe((data: any) => {
      this.products = data.products.slice(0, 8);
      this.loading = false;
    });
  }

  viewCategory(categoryName: string) {
    this.router.navigate(['/products'], { queryParams: { category: categoryName } });
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.toast.success(`${product.name} added to cart.`);
  }

  toggleWishlist(event: Event, product: any) {
    event.stopPropagation();
    this.wishlistService.toggle(product);
    this.toast.info(
      this.wishlistService.isInWishlist(product.id) ? `${product.name} added to wishlist.` : `${product.name} removed from wishlist.`
    );
  }
}
