import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  pagedProducts: any[] = [];
  categories: any[] = [];

  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  minRating: number = 0;
  searchQuery: string = '';
  sortBy: string = 'default';

  pageSize = 8;
  currentPage = 1;
  loading = true;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.searchQuery = params['search'] || '';
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  loadProducts() {
    this.dataService.getProducts().subscribe((data: any) => {
      this.products = data.products;
      this.loading = false;
      this.applyFilters();
    });
  }

  loadCategories() {
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data.categories;
    });
  }

  applyFilters() {
    let result = this.products.filter(product => {
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
      const priceMatch = product.price >= this.minPrice && product.price <= this.maxPrice;
      const ratingMatch = product.rating >= this.minRating;
      const searchMatch = !this.searchQuery ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      return categoryMatch && priceMatch && ratingMatch && searchMatch;
    });

    result = this.sortProducts(result);
    this.filteredProducts = result;
    this.currentPage = 1;
    this.updatePagedProducts();
  }

  sortProducts(list: any[]): any[] {
    const sorted = [...list];
    switch (this.sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }

  updatePagedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
    this.updatePagedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters() {
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.minRating = 0;
    this.searchQuery = '';
    this.sortBy = 'default';
    this.router.navigate(['/products']);
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
