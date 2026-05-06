import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="max-width:1200px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h1 style="color:#1a237e; margin:0;">All Students ({{ students.length }})</h1>
        <button routerLink="/students/new" style="background:#1a237e; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-size:0.9rem; font-weight:600;">+ Add Student</button>
      </div>

      <div *ngIf="loading" style="padding:40px; text-align:center; color:#666;">Loading students...</div>

      <div *ngIf="!loading && students.length === 0" style="padding:40px; text-align:center; color:#888;">
        No students found. <a routerLink="/students/new" style="color:#1565c0;">Add one now →</a>
      </div>

      <div *ngFor="let s of students" style="background:white; padding:16px 20px; margin-bottom:10px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.06); display:flex; align-items:center; gap:16px;">
        <div style="width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,#1a237e,#1565c0); color:white; display:flex; align-items:center; justify-content:center; font-size:0.9rem; font-weight:700; flex-shrink:0;">
          {{ s.firstName[0] }}{{ s.lastName[0] }}
        </div>
        <div style="flex:1;">
          <div style="font-weight:600; color:#1a237e;">{{ s.firstName }} {{ s.lastName }}</div>
          <div style="font-size:0.82rem; color:#666;">{{ s.studentId }} • {{ s.email }}</div>
        </div>
        <div style="text-align:center; min-width:100px;">
          <div style="font-size:0.78rem; color:#888;">Department</div>
          <div style="font-size:0.88rem; font-weight:600;">{{ s.department }}</div>
        </div>
        <div style="text-align:center; min-width:80px;">
          <div style="font-size:0.78rem; color:#888;">Semester</div>
          <div style="font-size:0.88rem; font-weight:600;">Sem {{ s.semester }}</div>
        </div>
        <div style="text-align:center; min-width:60px;">
          <div style="font-size:0.78rem; color:#888;">CGPA</div>
          <div style="font-size:1rem; font-weight:700; color:#1a237e;">{{ s.cgpa || '—' }}</div>
        </div>
        <span style="padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:600;"
          [style.background]="s.status==='Active' ? '#e8f5e9' : '#fce4ec'"
          [style.color]="s.status==='Active' ? '#2e7d32' : '#c62828'">
          {{ s.status }}
        </span>
        <div style="display:flex; gap:8px;">
          <button (click)="go('/students/'+s._id)" style="background:#e3f2fd; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.85rem;">👁 View</button>
          <button (click)="go('/students/edit/'+s._id)" style="background:#fff3e0; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.85rem;">✏️ Edit</button>
          <button (click)="deleteTarget=s" style="background:#fce4ec; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.85rem;">🗑 Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div *ngIf="deleteTarget" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:999;" (click)="deleteTarget=null">
      <div style="background:white; border-radius:12px; padding:32px; max-width:400px; width:90%;" (click)="$event.stopPropagation()">
        <h3 style="color:#c62828; margin:0 0 12px;">Confirm Delete</h3>
        <p style="color:#555; margin-bottom:24px;">Delete <strong>{{ deleteTarget.firstName }} {{ deleteTarget.lastName }}</strong>? This cannot be undone.</p>
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button (click)="deleteTarget=null" style="background:#f5f5f5; border:1px solid #ddd; padding:10px 16px; border-radius:8px; cursor:pointer;">Cancel</button>
          <button (click)="confirmDelete()" style="background:#c62828; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:600;">Delete</button>
        </div>
      </div>
    </div>
  `
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  loading = true;
  deleteTarget: any = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadStudents();
  }

  async loadStudents() {
    this.loading = true;
    this.cdr.detectChanges();
    try {
      const res = await fetch('http://localhost:5000/api/students?page=1&limit=50').then(r => r.json());
      this.students = res.data || [];
    } catch(err) {
      console.error(err);
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }

  async confirmDelete() {
    try {
      await fetch(`http://localhost:5000/api/students/${this.deleteTarget._id}`, { method: 'DELETE' });
      this.deleteTarget = null;
      await this.loadStudents();
    } catch(err) {
      console.error(err);
    }
  }
}