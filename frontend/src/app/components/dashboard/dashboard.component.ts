import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h1>Dashboard</h1>
        <span class="date">{{ today | date:'fullDate' }}</span>
      </div>

      <div class="stat-cards">
        <div class="stat-card blue">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.totalStudents || 0 }}</span>
            <span class="stat-label">Total Students</span>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.activeStudents || 0 }}</span>
            <span class="stat-label">Active Students</span>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.avgCgpa || 0 }}</span>
            <span class="stat-label">Average CGPA</span>
          </div>
        </div>
        <div class="stat-card red">
          <div class="stat-icon">⚠️</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.inactiveStudents || 0 }}</span>
            <span class="stat-label">Inactive Students</span>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-card">
          <h3>Students by Department</h3>
          <div class="bar-item" *ngFor="let d of stats?.departmentStats || []">
            <span class="bar-label">{{ d._id }}</span>
            <div class="bar-track">
              <div class="bar-fill" [style.width.%]="getPercent(d.count, stats?.totalStudents)">
                <span>{{ d.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-card">
          <h3>Students by Semester</h3>
          <div class="semester-grid">
            <div class="sem-card" *ngFor="let s of stats?.semesterStats || []">
              <span class="sem-num">Sem {{ s._id }}</span>
              <span class="sem-count">{{ s.count }}</span>
              <span class="sem-label">students</span>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-card">
        <div class="card-header">
          <h3>Recent Students</h3>
          <a routerLink="/students" class="view-all">View All →</a>
        </div>
        <table class="data-table" *ngIf="recentStudents.length > 0">
          <thead>
            <tr>
              <th>Student ID</th><th>Name</th><th>Department</th>
              <th>Semester</th><th>CGPA</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of recentStudents">
              <td><strong>{{ s.studentId }}</strong></td>
              <td>{{ s.firstName }} {{ s.lastName }}</td>
              <td>{{ s.department }}</td>
              <td>Semester {{ s.semester }}</td>
              <td><span class="cgpa">{{ s.cgpa || 'N/A' }}</span></td>
              <td><span class="badge" [ngClass]="s.status?.toLowerCase()">{{ s.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="recentStudents.length === 0" class="empty-state">
          No students yet. <a routerLink="/students/new">Add one now →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .page-header h1 { font-size: 1.8rem; font-weight: 700; color: #1a237e; margin: 0; }
    .date { color: #666; font-size: 0.9rem; }
    .stat-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 28px; }
    .stat-card { background: white; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border-left: 4px solid; }
    .stat-card.blue { border-color: #1565c0; }
    .stat-card.green { border-color: #2e7d32; }
    .stat-card.orange { border-color: #e65100; }
    .stat-card.red { border-color: #c62828; }
    .stat-icon { font-size: 2rem; }
    .stat-value { display: block; font-size: 2rem; font-weight: 700; color: #1a237e; }
    .stat-label { display: block; font-size: 0.85rem; color: #666; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .chart-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .chart-card h3 { margin: 0 0 20px; font-size: 1rem; color: #333; font-weight: 600; }
    .bar-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .bar-label { width: 120px; font-size: 0.82rem; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .bar-track { flex: 1; background: #e8eaf6; border-radius: 4px; height: 28px; }
    .bar-fill { background: linear-gradient(90deg, #1a237e, #1565c0); height: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; min-width: 30px; }
    .bar-fill span { color: white; font-size: 0.78rem; font-weight: 600; }
    .semester-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
    .sem-card { background: #e8eaf6; border-radius: 8px; padding: 12px; text-align: center; }
    .sem-num { display: block; font-size: 0.75rem; color: #666; }
    .sem-count { display: block; font-size: 1.6rem; font-weight: 700; color: #1a237e; }
    .sem-label { display: block; font-size: 0.7rem; color: #888; }
    .recent-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-header h3 { margin: 0; font-size: 1rem; color: #333; font-weight: 600; }
    .view-all { color: #1565c0; font-size: 0.85rem; text-decoration: none; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f5f5f5; padding: 10px 14px; text-align: left; font-size: 0.82rem; color: #555; font-weight: 600; }
    .data-table td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; font-size: 0.88rem; }
    .data-table tr:last-child td { border-bottom: none; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge.active { background: #e8f5e9; color: #2e7d32; }
    .badge.inactive { background: #fce4ec; color: #c62828; }
    .badge.graduated { background: #e3f2fd; color: #1565c0; }
    .cgpa { font-weight: 700; color: #1a237e; }
    .empty-state { text-align: center; padding: 40px; color: #888; }
    .empty-state a { color: #1565c0; }
    @media (max-width: 1024px) { .stat-cards { grid-template-columns: repeat(2,1fr); } .charts-row { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  recentStudents: any[] = [];
  today = new Date();

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/students/stats/dashboard').then(r => r.json()),
        fetch('http://localhost:5000/api/students?limit=5&page=1').then(r => r.json())
      ]);
      this.stats = statsRes.data;
      this.recentStudents = studentsRes.data || [];
      this.cdr.detectChanges();
    } catch(err) {
      console.error(err);
    }
  }

  getPercent(count: number, total: number): number {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
}