import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '1,200+', label: 'Products Listed' },
    { value: '35+', label: 'Countries Served' },
    { value: '4.7★', label: 'Average Rating' }
  ];

  values = [
    { icon: '🎯', title: 'Quality First', text: 'Every product is vetted for durability, performance, and value before it reaches our catalog.' },
    { icon: '⚡', title: 'Fast & Reliable', text: 'Quick fulfillment and honest delivery estimates, every single order.' },
    { icon: '🤝', title: 'Customer Obsessed', text: 'Real support from real people — we treat every question like it matters, because it does.' },
    { icon: '🌱', title: 'Sustainable Choices', text: 'We favor suppliers and packaging that keep our footprint small.' }
  ];

  team = [
    { name: 'Ava Thompson', role: 'Founder & CEO', avatar: '👩‍💼' },
    { name: 'Daniel Cho', role: 'Head of Product', avatar: '👨‍💻' },
    { name: 'Priya Nair', role: 'Customer Experience Lead', avatar: '👩‍🎓' }
  ];
}
