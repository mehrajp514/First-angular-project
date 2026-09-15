import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = {
    email: '',
    password: ''
  };

  errorMessage = '';
  submitting = false;
  private returnUrl = '/home';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  fillDemo(email: string, password: string) {
    this.loginForm.email = email;
    this.loginForm.password = password;
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.submitting = true;
    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe(success => {
      this.submitting = false;
      if (success) {
        this.toast.success('Welcome back!');
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
