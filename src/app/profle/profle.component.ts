import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profle',
  templateUrl: './profle.component.html',
  styleUrls: ['./profle.component.css']
})
export class ProfleComponent implements OnInit {
  user: any;
  editing = false;
  form = { name: '', phone: '', address: '' };

  orderCount = 0;
  wishlistCount = 0;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.form = {
      name: this.user?.name || '',
      phone: this.user?.phone || '',
      address: this.user?.address || ''
    };

    this.dataService.getOrders().subscribe((data: any) => {
      const saved = localStorage.getItem('localOrders');
      const localOrders = saved ? JSON.parse(saved) : [];
      const all = [...localOrders, ...data.orders];
      this.orderCount = all.filter((o: any) => o.userId === this.user?.id).length;
    });

    this.wishlistService.wishlistItems$.subscribe(() => {
      this.wishlistCount = this.wishlistService.getCount();
    });

    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  startEditing() {
    this.editing = true;
  }

  cancelEditing() {
    this.editing = false;
    this.form = {
      name: this.user?.name || '',
      phone: this.user?.phone || '',
      address: this.user?.address || ''
    };
  }

  saveProfile() {
    if (!this.form.name) {
      this.toast.error('Name cannot be empty.');
      return;
    }
    this.authService.updateProfile(this.form);
    this.user = this.authService.getCurrentUser();
    this.editing = false;
    this.toast.success('Profile updated.');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
