import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getStudents(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params = params.set(key, filters[key]);
      });
    }
    return this.http.get<any>(`${this.apiUrl}/students`, { params });
  }

  getStudent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${id}`);
  }

  createStudent(student: Student): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/students`, student);
  }

  updateStudent(id: string, student: Student): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/students/${id}`, student);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/students/${id}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/stats/dashboard`);
  }
}
