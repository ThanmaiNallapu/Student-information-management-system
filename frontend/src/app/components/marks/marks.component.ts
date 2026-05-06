import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-marks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="marks-page">
      <div class="page-header">
        <h1>Marks & Grades Overview</h1>
      </div>

      <div class="filter-bar">
        <input type="text" placeholder="🔍 Search student..." [(ngModel)]="searchTerm" (input)="onSearch()" class="search-input"/>
        <select [(ngModel)]="filterDept" (change)="loadStudents()">
          <option value="">All Departments</option>
          <option *ngFor="let d of departments">{{ d }}</option>
        </select>
        <select [(ngModel)]="filterSem" (change)="loadStudents()">
          <option value="">All Semesters</option>
          <option *ngFor="let s of semesters" [value]="s">Semester {{ s }}</option>
        </select>
      </div>

      <div class="grade-summary">
        <div class="grade-card" *ngFor="let g of gradeDistribution">
          <span class="grade-label" [ngClass]="'g-' + g.grade.replace('+','p')">{{ g.grade }}</span>
          <span class="grade-count">{{ g.count }}</span>
          <span class="grade-desc">{{ g.desc }}</span>
        </div>
      </div>

      <div class="table-card">
        <div *ngIf="loading" class="loading">Loading...</div>
        <div *ngFor="let student of students" class="student-marks-section">
          <div class="student-header">
            <div class="student-info">
              <div class="avatar">{{ student.firstName[0] }}{{ student.lastName[0] }}</div>
              <div>
                <strong>{{ student.firstName }} {{ student.lastName }}</strong>
                <span class="sid">{{ student.studentId }} | {{ student.department }} - Sem {{ student.semester }}</span>
              </div>
            </div>
            <div class="student-cgpa">
              <span class="cgpa-val">{{ student.cgpa || '—' }}</span>
              <span class="cgpa-lbl">CGPA</span>
            </div>
          </div>
          <div *ngIf="student.marks && student.marks.length > 0">
            <table class="marks-table">
              <thead>
                <tr>
                  <th>Subject</th><th>Internal</th><th>External</th>
                  <th>Total</th><th>Grade</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of student.marks">
                  <td>{{ m.subject }}</td>
                  <td>{{ m.internal }}/30</td>
                  <td>{{ m.external }}/70</td>
                  <td><strong>{{ m.total }}/100</strong></td>
                  <td><span class="grade-badge" [ngClass]="'g-' + m.grade?.replace('+','p')">{{ m.grade }}</span></td>
                  <td><span [ngClass]="m.grade === 'F' ? 'fail' : 'pass'">{{ m.grade === 'F' ? 'FAIL' : 'PASS' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="!student.marks || student.marks.length === 0" class="no-marks">No marks recorded.</div>
        </div>
        <div *ngIf="!loading && students.length === 0" class="empty-state">No students found.</div>
      </div>
    </div>
  `,
  styles: [`
    .marks-page { max-width: 1200px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.8rem; font-weight: 700; color: #1a237e; margin: 0; }
    .filter-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 200px; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; outline: none; }
    select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; outline: none; background: white; cursor: pointer; }
    .grade-summary { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; margin-bottom: 24px; }
    .grade-card { background: white; border-radius: 10px; padding: 16px 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .grade-label { display: block; font-size: 1.4rem; font-weight: 700; }
    .grade-count { display: block; font-size: 1.1rem; font-weight: 700; color: #333; margin: 4px 0; }
    .grade-desc { display: block; font-size: 0.7rem; color: #888; }
    .g-O { color: #2e7d32; } .g-Ap { color: #1b5e20; } .g-A { color: #1565c0; }
    .g-Bp { color: #e65100; } .g-B { color: #bf360c; } .g-C { color: #c62828; } .g-F { color: #6a1b9a; }
    .table-card { background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
    .student-marks-section { border-bottom: 8px solid #f0f2f5; }
    .student-marks-section:last-child { border-bottom: none; }
    .student-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #f8f9ff; border-bottom: 1px solid #e8eaf6; }
    .student-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #1a237e, #1565c0); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; }
    .student-info strong { display: block; font-size: 0.95rem; color: #1a237e; }
    .sid { display: block; font-size: 0.78rem; color: #777; }
    .student-cgpa { text-align: center; }
    .cgpa-val { display: block; font-size: 1.5rem; font-weight: 700; color: #1a237e; }
    .cgpa-lbl { display: block; font-size: 0.72rem; color: #888; }
    .marks-table { width: 100%; border-collapse: collapse; }
    .marks-table th { background: #e8eaf6; color: #1a237e; padding: 10px 20px; font-size: 0.8rem; font-weight: 600; text-align: left; }
    .marks-table td { padding: 10px 20px; border-bottom: 1px solid #f5f5f5; font-size: 0.87rem; }
    .marks-table tr:last-child td { border-bottom: none; }
    .grade-badge { padding: 3px 10px; border-radius: 4px; font-weight: 700; font-size: 0.8rem; }
    .grade-badge.g-O, .grade-badge.g-Ap { background: #e8f5e9; color: #2e7d32; }
    .grade-badge.g-A { background: #e3f2fd; color: #1565c0; }
    .grade-badge.g-Bp, .grade-badge.g-B { background: #fff3e0; color: #e65100; }
    .grade-badge.g-C { background: #fce4ec; color: #c62828; }
    .grade-badge.g-F { background: #f3e5f5; color: #6a1b9a; }
    .pass { color: #2e7d32; font-weight: 700; font-size: 0.8rem; }
    .fail { color: #c62828; font-weight: 700; font-size: 0.8rem; }
    .no-marks { padding: 20px; color: #aaa; font-size: 0.85rem; text-align: center; }
    .empty-state { padding: 60px; text-align: center; color: #888; }
    .loading { padding: 40px; text-align: center; color: #666; }
    @media (max-width: 900px) { .grade-summary { grid-template-columns: repeat(4, 1fr); } }
  `]
})
export class MarksComponent implements OnInit {
  students: any[] = [];
  loading = false;
  searchTerm = '';
  filterDept = '';
  filterSem = '';
  departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'IT', 'MBA'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  gradeDistribution = [
    { grade: 'O', count: 0, desc: '≥ 90 marks' },
    { grade: 'A+', count: 0, desc: '80–89 marks' },
    { grade: 'A', count: 0, desc: '70–79 marks' },
    { grade: 'B+', count: 0, desc: '60–69 marks' },
    { grade: 'B', count: 0, desc: '50–59 marks' },
    { grade: 'C', count: 0, desc: '40–49 marks' },
    { grade: 'F', count: 0, desc: '< 40 marks' },
  ];
  private searchTimer: any;

  constructor(private studentService: StudentService) {}
  ngOnInit() { this.loadStudents(); }

  loadStudents() {
    this.loading = true;
    const filters: any = { limit: 50 };
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.filterDept) filters.department = this.filterDept;
    if (this.filterSem) filters.semester = this.filterSem;
    this.studentService.getStudents(filters).subscribe({
      next: (res) => { this.students = res.data; this.computeGradeDistribution(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadStudents(), 400);
  }

  computeGradeDistribution() {
    const counts: any = { O: 0, 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, F: 0 };
    this.students.forEach(s => s.marks?.forEach((m: any) => { if (counts[m.grade] !== undefined) counts[m.grade]++; }));
    this.gradeDistribution.forEach(g => g.count = counts[g.grade] || 0);
  }
}