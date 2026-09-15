import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'assets';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products.json`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories.json`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users.json`);
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders.json`);
  }
}
