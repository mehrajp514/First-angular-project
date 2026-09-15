import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  };

  errorMessage = '';
  submitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.registerForm.name || !this.registerForm.email || !this.registerForm.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.registerForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.submitting = true;
    this.authService.register({
      name: this.registerForm.name,
      email: this.registerForm.email,
      password: this.registerForm.password,
      phone: this.registerForm.phone,
      address: this.registerForm.address
    }).subscribe(result => {
      this.submitting = false;
      if (result.success) {
        this.toast.success(`Welcome to ShopHub, ${this.registerForm.name.split(' ')[0]}!`);
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = result.error || 'Registration failed. Please try again.';
      }
    });
  }
}
