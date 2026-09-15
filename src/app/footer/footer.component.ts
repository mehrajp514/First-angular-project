import { Component } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year = 2024;
  newsletterEmail = '';

  constructor(private toast: ToastService) {
    this.year = new Date().getFullYear();
  }

  subscribe() {
    if (!this.newsletterEmail) { return; }
    this.toast.success('Thanks for subscribing! Watch your inbox for deals.');
    this.newsletterEmail = '';
  }
}
