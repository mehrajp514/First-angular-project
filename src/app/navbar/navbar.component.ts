import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  wishlistCount = 0;
  isDark = false;
  mobileMenuOpen = false;
  searchQuery = '';

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
    this.wishlistService.wishlistItems$.subscribe(() => {
      this.wishlistCount = this.wishlistService.getCount();
    });
    this.themeService.darkMode$.subscribe(isDark => this.isDark = isDark);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  onSearch() {
    const query = this.searchQuery.trim();
    this.router.navigate(['/products'], { queryParams: query ? { search: query } : {} });
    this.closeMobileMenu();
  }

  logout() {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }
}
