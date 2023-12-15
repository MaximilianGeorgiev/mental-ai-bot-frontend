import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HomepageComponent } from './modules/homepage/components/homepage.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomepageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mental-ai-bot';

  constructor(private router: Router) {
  }

  isVisible() {
    return this.router.url === "/";
  }
}
