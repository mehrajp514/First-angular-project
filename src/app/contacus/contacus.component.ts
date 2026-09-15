import { Component } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-contacus',
  templateUrl: './contacus.component.html',
  styleUrls: ['./contacus.component.css']
})
export class ContacusComponent {
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;
  errorMessage = '';

  faqs = [
    { question: 'How long does shipping take?', answer: 'Most orders arrive within 3-5 business days. Expedited options are shown at checkout.', open: false },
    { question: 'What is your return policy?', answer: 'We accept returns within 30 days of delivery for any unused item in its original packaging.', open: false },
    { question: 'Do you ship internationally?', answer: 'Yes! We currently ship to over 35 countries. Shipping costs are calculated at checkout.', open: false }
  ];

  constructor(private toast: ToastService) { }

  toggleFaq(faq: any) {
    faq.open = !faq.open;
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.form.name || !this.form.email || !this.form.message) {
      this.errorMessage = 'Please fill in your name, email, and message.';
      return;
    }

    this.submitted = true;
    this.toast.success("Message sent! We'll get back to you within 24 hours.");
    this.form = { name: '', email: '', subject: '', message: '' };

    setTimeout(() => this.submitted = false, 4000);
  }
}
