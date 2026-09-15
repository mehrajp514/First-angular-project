import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  cartTotal = 0;

  shippingForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  };

  paymentMethod = 'card';
  orderPlaced = false;
  submitted = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    public authService: AuthService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();

      if (items.length === 0 && !this.orderPlaced) {
        this.router.navigate(['/cart']);
      }
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.shippingForm.email = user.email;
      this.shippingForm.fullName = user.name;
      this.shippingForm.phone = user.phone || '';
      this.shippingForm.address = user.address || '';
    }
  }

  isFormValid(): boolean {
    const f = this.shippingForm;
    return !!(f.fullName && f.email && f.phone && f.address && f.city && f.zipCode && f.country);
  }

  placeOrder() {
    this.submitted = true;

    if (!this.isFormValid()) {
      this.toast.error('Please fill in all shipping details.');
      return;
    }

    if (this.cartItems.length === 0) { return; }

    const order = {
      id: Date.now(),
      userId: this.authService.getCurrentUser()?.id,
      items: this.cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: this.cartTotal,
      status: 'Processing',
      date: new Date().toISOString().split('T')[0],
      shippingAddress: `${this.shippingForm.address}, ${this.shippingForm.city}, ${this.shippingForm.zipCode}, ${this.shippingForm.country}`
    };

    const savedOrders = localStorage.getItem('localOrders');
    const localOrders = savedOrders ? JSON.parse(savedOrders) : [];
    localOrders.push(order);
    localStorage.setItem('localOrders', JSON.stringify(localOrders));

    this.cartService.clearCart();
    this.orderPlaced = true;
    this.toast.success('Order placed successfully!');

    setTimeout(() => {
      this.router.navigate(['/orders']);
    }, 2500);
  }
}
