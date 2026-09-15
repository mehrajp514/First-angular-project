import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab: 'dashboard' | 'products' | 'users' = 'dashboard';

  stats = {
    totalUsers: 0,
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0
  };
  recentOrders: any[] = [];
  products: any[] = [];
  users: any[] = [];

  constructor(
    private dataService: DataService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentOrders();
    this.loadProducts();
    this.loadUsers();
  }

  private getAllOrders(): Promise<any[]> {
    return new Promise(resolve => {
      this.dataService.getOrders().subscribe((data: any) => {
        const saved = localStorage.getItem('localOrders');
        const localOrders = saved ? JSON.parse(saved) : [];
        resolve([...localOrders, ...data.orders]);
      });
    });
  }

  private getAllUsers(): Promise<any[]> {
    return new Promise(resolve => {
      this.dataService.getUsers().subscribe((data: any) => {
        const saved = localStorage.getItem('registeredUsers');
        const registered = saved ? JSON.parse(saved) : [];
        resolve([...data.users, ...registered]);
      });
    });
  }

  loadStats() {
    this.getAllUsers().then(users => this.stats.totalUsers = users.length);
    this.dataService.getProducts().subscribe((data: any) => {
      this.stats.totalProducts = data.products.length;
    });
    this.getAllOrders().then(orders => {
      this.stats.totalOrders = orders.length;
      this.stats.totalSales = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    });
  }

  loadRecentOrders() {
    this.getAllOrders().then(orders => {
      this.recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);
    });
  }

  loadProducts() {
    this.dataService.getProducts().subscribe((data: any) => {
      this.products = data.products;
    });
  }

  loadUsers() {
    this.getAllUsers().then(users => this.users = users);
  }

  setTab(tab: 'dashboard' | 'products' | 'users') {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-pending';
    }
  }
}
