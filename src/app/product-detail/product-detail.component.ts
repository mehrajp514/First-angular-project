import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { ToastService } from '../toast.service';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  quantity: number = 1;
  relatedProducts: any[] = [];
  reviews: Review[] = [];

  newReview = { name: '', rating: 5, comment: '' };

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.quantity = 1;
        this.loadProduct(+productId);
      }
    });
  }

  loadProduct(id: number) {
    this.dataService.getProducts().subscribe((data: any) => {
      this.product = data.products.find(p => p.id === id);
      if (!this.product) {
        this.router.navigate(['/products']);
        return;
      }
      this.relatedProducts = data.products
        .filter(p => p.category === this.product.category && p.id !== this.product.id)
        .slice(0, 4);
      this.loadReviews();

      const user = this.authService.getCurrentUser();
      this.newReview.name = user ? user.name : '';
    });
  }

  private reviewsKey(): string {
    return `reviews_${this.product.id}`;
  }

  loadReviews() {
    const saved = localStorage.getItem(this.reviewsKey());
    this.reviews = saved ? JSON.parse(saved) : [];
  }

  get averageRating(): number {
    if (this.reviews.length === 0) { return this.product?.rating || 0; }
    const sum = this.reviews.reduce((total, r) => total + r.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  submitReview() {
    if (!this.newReview.name || !this.newReview.comment) {
      this.toast.error('Please add your name and a comment.');
      return;
    }

    const review: Review = {
      name: this.newReview.name,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    this.reviews = [review, ...this.reviews];
    localStorage.setItem(this.reviewsKey(), JSON.stringify(this.reviews));
    this.newReview.comment = '';
    this.toast.success('Thanks for your review!');
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  filterByCategory() {
    this.router.navigate(['/products'], { queryParams: { category: this.product.category } });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.toast.success(`${this.product.name} added to cart.`);
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  toggleWishlist() {
    this.wishlistService.toggle(this.product);
    this.toast.info(
      this.wishlistService.isInWishlist(this.product.id) ? 'Added to wishlist.' : 'Removed from wishlist.'
    );
  }

  increaseQuantity() {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
