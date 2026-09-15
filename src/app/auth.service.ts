import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private dataService: DataService) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser.next(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUser.next(null);
      }
    }
  }

  private getRegisteredUsers(): any[] {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [];
  }

  login(email: string, password: string): Observable<boolean> {
    return this.dataService.getUsers().pipe(
      map((data: any) => {
        const allUsers = [...(data.users || []), ...this.getRegisteredUsers()];
        const match = allUsers.find(u =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!match) {
          return false;
        }

        const { password: _pw, ...safeUser } = match;
        this.currentUser.next(safeUser);
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        return true;
      })
    );
  }

  register(userData: any): Observable<{ success: boolean; error?: string }> {
    return this.dataService.getUsers().pipe(
      map((data: any) => {
        const allUsers = [...(data.users || []), ...this.getRegisteredUsers()];
        const exists = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());

        if (exists) {
          return { success: false, error: 'An account with this email already exists.' };
        }

        const user = { id: Date.now(), ...userData, isAdmin: false };
        const registered = this.getRegisteredUsers();
        registered.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(registered));

        const { password: _pw, ...safeUser } = user;
        this.currentUser.next(safeUser);
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        return { success: true };
      })
    );
  }

  updateProfile(updates: any) {
    const current = this.currentUser.value;
    if (!current) { return; }
    const updated = { ...current, ...updates };
    this.currentUser.next(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));

    const registered = this.getRegisteredUsers();
    const idx = registered.findIndex(u => u.id === current.id);
    if (idx > -1) {
      registered[idx] = { ...registered[idx], ...updates };
      localStorage.setItem('registeredUsers', JSON.stringify(registered));
    }
  }

  logout() {
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUser.value?.isAdmin || false;
  }

  getCurrentUser() {
    return this.currentUser.value;
  }
}
