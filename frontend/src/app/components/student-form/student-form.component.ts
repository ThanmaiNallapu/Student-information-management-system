import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-page">
      <div class="page-header">
        <button class="btn-back" routerLink="/students">← Back</button>
        <h1>{{ isEdit ? 'Edit Student' : 'Add New Student' }}</h1>
      </div>

      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
        <div class="form-grid">

          <div class="form-card">
            <h3 class="section-title">👤 Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Student ID *</label>
                <input formControlName="studentId" placeholder="e.g. CS2024001" [class.error]="isInvalid('studentId')"/>
                <span class="error-msg" *ngIf="isInvalid('studentId')">Student ID is required</span>
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select formControlName="gender">
                  <option value="">Select Gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>First Name *</label>
                <input formControlName="firstName" placeholder="First Name" [class.error]="isInvalid('firstName')"/>
                <span class="error-msg" *ngIf="isInvalid('firstName')">First name is required</span>
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input formControlName="lastName" placeholder="Last Name" [class.error]="isInvalid('lastName')"/>
                <span class="error-msg" *ngIf="isInvalid('lastName')">Last name is required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email *</label>
                <input formControlName="email" type="email" placeholder="student@college.edu" [class.error]="isInvalid('email')"/>
                <span class="error-msg" *ngIf="isInvalid('email')">Valid email required</span>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input formControlName="phone" placeholder="+91 9876543210"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Date of Birth</label>
                <input formControlName="dateOfBirth" type="date"/>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select formControlName="status">
                  <option>Active</option><option>Inactive</option><option>Graduated</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea formControlName="address" rows="2" placeholder="Full address..."></textarea>
            </div>
          </div>

          <div class="form-card">
            <h3 class="section-title">🎓 Academic Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Department *</label>
                <select formControlName="department" [class.error]="isInvalid('department')">
                  <option value="">Select Department</option>
                  <option *ngFor="let d of departments">{{ d }}</option>
                </select>
                <span class="error-msg" *ngIf="isInvalid('department')">Department is required</span>
              </div>
              <div class="form-group">
                <label>Semester *</label>
                <select formControlName="semester" [class.error]="isInvalid('semester')">
                  <option value="">Select Semester</option>
                  <option *ngFor="let s of semesters" [value]="s">Semester {{ s }}</option>
                </select>
                <span class="error-msg" *ngIf="isInvalid('semester')">Semester is required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Section</label>
                <input formControlName="section" placeholder="e.g. A, B, C"/>
              </div>
              <div class="form-group">
                <label>Enrollment Date</label>
                <input formControlName="enrollmentDate" type="date"/>
              </div>
            </div>
          </div>

          <div class="form-card full-width">
            <div class="section-header">
              <h3 class="section-title">📝 Marks & Grades</h3>
              <button type="button" class="btn-add-subject" (click)="addMark()">+ Add Subject</button>
            </div>
            <div formArrayName="marks">
              <div *ngIf="marksArray.length === 0" class="no-marks">No subjects added. Click "Add Subject" to begin.</div>
              <div class="marks-grid">
                <div class="mark-row" *ngFor="let mark of marksArray.controls; let i=index" [formGroupName]="i">
                  <div class="form-group">
                    <label>Subject Name</label>
                    <input formControlName="subject" placeholder="e.g. Mathematics"/>
                  </div>
                  <div class="form-group small">
                    <label>Internal (max 30)</label>
                    <input formControlName="internal" type="number" min="0" max="30"/>
                  </div>
                  <div class="form-group small">
                    <label>External (max 70)</label>
                    <input formControlName="external" type="number" min="0" max="70"/>
                  </div>
                  <div class="form-group small">
                    <label>Total</label>
                    <input [value]="getTotal(i)" readonly class="readonly"/>
                  </div>
                  <div class="form-group small">
                    <label>Grade</label>
                    <input [value]="getGrade(i)" readonly class="readonly"
                      [ngClass]="'grade-' + getGrade(i).replace('+','p')"/>
                  </div>
                  <button type="button" class="btn-remove" (click)="removeMark(i)">✕</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" routerLink="/students">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student') }}
          </button>
        </div>

        <div class="alert error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="alert success" *ngIf="successMsg">{{ successMsg }}</div>
      </form>
    </div>
  `,
  styles: [`
    .form-page { max-width: 1100px; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
    .page-header h1 { font-size: 1.8rem; font-weight: 700; color: #1a237e; margin: 0; }
    .btn-back { background: none; border: 1px solid #ddd; padding: 8px 14px; border-radius: 8px; cursor: pointer; color: #555; font-size: 0.9rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .form-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .full-width { grid-column: 1 / -1; }
    .section-title { margin: 0 0 20px; font-size: 1rem; color: #1a237e; font-weight: 600; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header .section-title { margin: 0; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
    label { font-size: 0.82rem; font-weight: 600; color: #555; }
    input, select, textarea { padding: 10px 12px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 0.9rem; outline: none; transition: border-color 0.2s; font-family: inherit; }
    input:focus, select:focus, textarea:focus { border-color: #1565c0; box-shadow: 0 0 0 3px rgba(21,101,192,0.1); }
    input.error, select.error { border-color: #c62828; }
    input.readonly { background: #f5f5f5; color: #555; cursor: not-allowed; }
    .error-msg { color: #c62828; font-size: 0.78rem; }
    .marks-grid { display: flex; flex-direction: column; gap: 12px; }
    .mark-row { display: grid; grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr auto; gap: 12px; align-items: end; padding: 16px; background: #f8f9ff; border-radius: 10px; border: 1px solid #e8eaf6; }
    .btn-add-subject { background: #e8eaf6; color: #1a237e; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
    .btn-remove { background: #fce4ec; color: #c62828; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; margin-bottom: 2px; }
    .no-marks { text-align: center; padding: 30px; color: #aaa; font-size: 0.9rem; }
    .grade-O, .grade-Ap { background: #e8f5e9 !important; color: #2e7d32; font-weight: 700; }
    .grade-A { background: #e3f2fd !important; color: #1565c0; font-weight: 700; }
    .grade-Bp, .grade-B { background: #fff3e0 !important; color: #e65100; font-weight: 700; }
    .grade-C { background: #fce4ec !important; color: #c62828; font-weight: 700; }
    .grade-F { background: #f3e5f5 !important; color: #6a1b9a; font-weight: 700; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn-primary { background: #1a237e; color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 600; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: white; color: #555; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 0.95rem; }
    .alert { margin-top: 16px; padding: 12px 16px; border-radius: 8px; font-size: 0.9rem; }
    .alert.error { background: #fce4ec; color: #c62828; }
    .alert.success { background: #e8f5e9; color: #2e7d32; }
  `]
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEdit = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  studentId = '';
  departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'IT', 'MBA'];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, private studentService: StudentService) {}

  ngOnInit() {
    this.initForm();
    this.studentId = this.route.snapshot.params['id'];
    if (this.studentId) { this.isEdit = true; this.loadStudent(); }
  }

  initForm() {
    this.studentForm = this.fb.group({
      studentId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], dateOfBirth: [''], gender: [''],
      department: ['', Validators.required],
      semester: ['', Validators.required],
      section: [''], address: [''], enrollmentDate: [''],
      status: ['Active'],
      marks: this.fb.array([]),
    });
  }

  loadStudent() {
    this.studentService.getStudent(this.studentId).subscribe({
      next: (res) => {
        const s = res.data;
        this.studentForm.patchValue(s);
        s.marks?.forEach((m: any) => this.addMark(m));
      }
    });
  }

  get marksArray(): FormArray { return this.studentForm.get('marks') as FormArray; }

  addMark(data?: any) {
    this.marksArray.push(this.fb.group({
      subject: [data?.subject || ''],
      internal: [data?.internal || 0],
      external: [data?.external || 0],
    }));
  }

  removeMark(i: number) { this.marksArray.removeAt(i); }

  getTotal(i: number): number {
    const mark = this.marksArray.at(i).value;
    return (mark.internal || 0) + (mark.external || 0);
  }

  getGrade(i: number): string {
    const total = this.getTotal(i);
    if (total >= 90) return 'O';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    if (total >= 60) return 'B+';
    if (total >= 50) return 'B';
    if (total >= 40) return 'C';
    return 'F';
  }

  isInvalid(field: string): boolean {
    const ctrl = this.studentForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit() {
  if (this.studentForm.invalid) { this.studentForm.markAllAsTouched(); return; }
  this.loading = true;
  this.errorMsg = '';
  const data = { ...this.studentForm.value };
  
  data.semester = parseInt(data.semester);
  
  // Clear empty dates so MongoDB doesn't reject them
  if (!data.dateOfBirth) delete data.dateOfBirth;
  if (!data.enrollmentDate) delete data.enrollmentDate;
  if (!data.phone) delete data.phone;
  if (!data.section) delete data.section;
  if (!data.address) delete data.address;
  if (!data.gender) delete data.gender;

  const obs = this.isEdit
    ? this.studentService.updateStudent(this.studentId, data)
    : this.studentService.createStudent(data);

  obs.subscribe({
    next: (res) => {
      this.successMsg = res.message || 'Saved successfully!';
      this.loading = false;
      setTimeout(() => this.router.navigate(['/students']), 1200);
    },
    error: (err) => {
      this.errorMsg = err.error?.message || 'Something went wrong';
      this.loading = false;
    }
  });
}}