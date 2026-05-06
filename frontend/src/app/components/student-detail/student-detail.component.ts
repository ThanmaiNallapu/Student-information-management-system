import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-page" *ngIf="student">
      <div class="page-header">
        <button class="btn-back" routerLink="/students">← Back</button>
        <div class="header-actions">
          <button class="btn-edit" (click)="editStudent()">✏️ Edit</button>
          <button class="btn-delete" (click)="showDeleteModal=true">🗑 Delete</button>
        </div>
      </div>

      <div class="profile-card">
        <div class="avatar-large">{{ student.firstName[0] }}{{ student.lastName[0] }}</div>
        <div class="profile-info">
          <h1>{{ student.firstName }} {{ student.lastName }}</h1>
          <p>{{ student.studentId }} | {{ student.department }} - Sem {{ student.semester }}</p>
          <span class="badge" [ngClass]="student.status?.toLowerCase()">{{ student.status }}</span>
        </div>
        <div class="cgpa-display">
          <span class="cgpa-value">{{ student.cgpa || '0.00' }}</span>
          <span class="cgpa-label">CGPA</span>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <h3>Personal Info</h3>
          <div class="info-row"><span>Email</span><strong>{{ student.email }}</strong></div>
          <div class="info-row"><span>Phone</span><strong>{{ student.phone || '—' }}</strong></div>
          <div class="info-row"><span>Gender</span><strong>{{ student.gender || '—' }}</strong></div>
          <div class="info-row"><span>Date of Birth</span><strong>{{ student.dateOfBirth ? (student.dateOfBirth | date) : '—' }}</strong></div>
          <div class="info-row"><span>Address</span><strong>{{ student.address || '—' }}</strong></div>
        </div>
        <div class="info-card">
          <h3>Academic Info</h3>
          <div class="info-row"><span>Department</span><strong>{{ student.department }}</strong></div>
          <div class="info-row"><span>Semester</span><strong>{{ student.semester }}</strong></div>
          <div class="info-row"><span>Section</span><strong>{{ student.section || '—' }}</strong></div>
          <div class="info-row"><span>Enrolled</span><strong>{{ student.enrollmentDate ? (student.enrollmentDate | date) : '—' }}</strong></div>
          <div class="info-row"><span>CGPA</span><strong>{{ student.cgpa || '0.00' }}</strong></div>
        </div>
      </div>

      <div class="marks-card" *ngIf="student.marks?.length > 0">
        <h3>Marks & Grades</h3>
        <table class="marks-table">
          <thead>
            <tr><th>Subject</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of student.marks">
              <td>{{ m.subject }}</td>
              <td>{{ m.internal }}/30</td>
              <td>{{ m.external }}/70</td>
              <td><strong>{{ m.total }}/100</strong></td>
              <td><span class="grade-badge">{{ m.grade }}</span></td>
              <td><span [class]="m.total >= 40 ? 'pass' : 'fail'">{{ m.total >= 40 ? 'PASS' : 'FAIL' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="marks-card" *ngIf="!student.marks?.length">
        <h3>Marks & Grades</h3>
        <p style="color:#888; text-align:center; padding: 20px;">No marks added yet.</p>
      </div>
    </div>

    <div *ngIf="!student && !error" style="padding:40px; text-align:center;">Loading...</div>
    <div *ngIf="error" style="padding:40px; text-align:center; color:red;">{{ error }}</div>

    <!-- Delete Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete <strong>{{ student?.firstName }} {{ student?.lastName }}</strong>? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-secondary" (click)="showDeleteModal=false">Cancel</button>
          <button class="btn-delete" (click)="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-page { max-width: 1000px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .btn-back { background: none; border: 1px solid #ddd; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #555; font-size: 0.9rem; }
    .header-actions { display: flex; gap: 10px; }
    .btn-edit { background: #1a237e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
    .btn-delete { background: #c62828; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
    .profile-card { background: white; border-radius: 12px; padding: 28px; display: flex; align-items: center; gap: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; }
    .avatar-large { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #1a237e, #1565c0); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 700; flex-shrink: 0; }
    .profile-info { flex: 1; }
    .profile-info h1 { margin: 0 0 4px; font-size: 1.5rem; color: #1a237e; }
    .profile-info p { margin: 0 0 8px; color: #666; font-size: 0.9rem; }
    .cgpa-display { text-align: center; }
    .cgpa-value { display: block; font-size: 2.5rem; font-weight: 700; color: #1a237e; }
    .cgpa-label { display: block; font-size: 0.8rem; color: #888; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .badge.active { background: #e8f5e9; color: #2e7d32; }
    .badge.inactive { background: #fce4ec; color: #c62828; }
    .badge.graduated { background: #e3f2fd; color: #1565c0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .info-card h3 { margin: 0 0 16px; font-size: 1rem; color: #1a237e; font-weight: 600; border-bottom: 2px solid #e8eaf6; padding-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 0.88rem; }
    .info-row span { color: #666; }
    .info-row strong { color: #333; }
    .marks-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .marks-card h3 { margin: 0 0 16px; font-size: 1rem; color: #1a237e; font-weight: 600; border-bottom: 2px solid #e8eaf6; padding-bottom: 10px; }
    .marks-table { width: 100%; border-collapse: collapse; }
    .marks-table th { background: #1a237e; color: white; padding: 10px 14px; text-align: left; font-size: 0.82rem; }
    .marks-table td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; font-size: 0.88rem; }
    .grade-badge { background: #e8eaf6; color: #1a237e; padding: 3px 10px; border-radius: 4px; font-weight: 700; }
    .pass { color: #2e7d32; font-weight: 700; }
    .fail { color: #c62828; font-weight: 700; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 999; }
    .modal { background: white; border-radius: 12px; padding: 32px; max-width: 420px; width: 90%; }
    .modal h3 { margin: 0 0 12px; color: #c62828; }
    .modal p { color: #555; margin-bottom: 24px; line-height: 1.6; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn-secondary { background: #f5f5f5; color: #333; border: 1px solid #ddd; padding: 10px 16px; border-radius: 8px; cursor: pointer; }
  `]
})
export class StudentDetailComponent implements OnInit {
  student: any = null;
  error = '';
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`).then(r => r.json());
      this.student = res.data;
      this.cdr.detectChanges();
    } catch(err: any) {
      this.error = err.message;
      this.cdr.detectChanges();
    }
  }

  editStudent() {
    this.router.navigate(['/students/edit', this.student._id]);
  }

  async confirmDelete() {
    try {
      await fetch(`http://localhost:5000/api/students/${this.student._id}`, { method: 'DELETE' });
      this.router.navigate(['/students']);
    } catch(err) {
      console.error(err);
    }
  }
}