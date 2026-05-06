import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="brand">
        <div class="brand-icon">🎓</div>
        <div class="brand-text">
          <span class="brand-title">SIMS</span>
          <span class="brand-sub">Student Info System</span>
        </div>
      </div>
      <ul class="nav-links">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active">
            <span class="icon">📊</span> Dashboard
          </a>
        </li>
        <li>
          <a routerLink="/students" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <span class="icon">👥</span> Students
          </a>
        </li>
        <li>
          <a routerLink="/students/new" routerLinkActive="active">
            <span class="icon">➕</span> Add Student
          </a>
        </li>
        <li>
          <a routerLink="/marks" routerLinkActive="active">
            <span class="icon">📝</span> Marks & Grades
          </a>
        </li>
      </ul>
      <div class="sidebar-footer">
        <span>© 2024 SIMS v1.0</span>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: 0;
      width: 250px; height: 100vh;
      background: linear-gradient(180deg, #1a237e 0%, #283593 60%, #1565c0 100%);
      color: white; display: flex; flex-direction: column;
      z-index: 100; box-shadow: 4px 0 20px rgba(0,0,0,0.2);
    }
    .brand { display: flex; align-items: center; padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.15); gap: 12px; }
    .brand-icon { font-size: 2rem; }
    .brand-title { display: block; font-size: 1.3rem; font-weight: 700; letter-spacing: 1px; }
    .brand-sub { display: block; font-size: 0.7rem; opacity: 0.7; }
    .nav-links { list-style: none; padding: 16px 0; flex: 1; margin: 0; }
    .nav-links li a {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 24px; color: rgba(255,255,255,0.8);
      text-decoration: none; font-size: 0.95rem; font-weight: 500;
      transition: all 0.2s; border-left: 3px solid transparent;
    }
    .nav-links li a:hover, .nav-links li a.active {
      background: rgba(255,255,255,0.12); color: white; border-left-color: #64b5f6;
    }
    .icon { font-size: 1.1rem; }
    .sidebar-footer { padding: 16px 24px; font-size: 0.75rem; opacity: 0.5; border-top: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class NavbarComponent {}