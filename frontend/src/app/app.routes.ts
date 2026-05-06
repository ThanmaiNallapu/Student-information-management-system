import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { MarksComponent } from './components/marks/marks.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },
  { path: 'students/edit/:id', component: StudentFormComponent },
  { path: 'students/:id', component: StudentDetailComponent },
  { path: 'marks', component: MarksComponent },
];
