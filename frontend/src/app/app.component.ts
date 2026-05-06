import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-content {
      margin-left: 250px;
      padding: 24px;
      min-height: 100vh;
      background: #f0f2f5;
    }
  `]
})
export class AppComponent {}