import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  activeFilter = 'All';
  statusFilters = ['All', 'Processing', 'Shipped', 'Delivered'];
  loading = true;

  constructor(
    private dataService: DataService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.dataService.getOrders().subscribe((data: any) => {
      const user = this.authService.getCurrentUser();
      const remoteOrders = data.orders.filter((order: any) => order.userId === user?.id);

      const saved = localStorage.getItem('localOrders');
      const localOrders = saved ? JSON.parse(saved).filter((o: any) => o.userId === user?.id) : [];

      this.orders = [...localOrders, ...remoteOrders].sort((a, b) => b.id - a.id);
      this.loading = false;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredOrders = this.activeFilter === 'All'
      ? this.orders
      : this.orders.filter(o => o.status === this.activeFilter);
  }

  setFilter(status: string) {
    this.activeFilter = status;
    this.applyFilter();
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
