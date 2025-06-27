import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../shared/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8087/api/employees';

  constructor(private http: HttpClient) {}

  /**
   * Get paginated employees with optional sorting
   */
  getEmployees(page: number, size: number, sort: string = 'id', direction: string = 'asc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction);
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new employee
   */
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}`, employee);
  }

  /**
   * Update employee
   */
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search employees by keyword with pagination and sorting
   */
  searchEmployees(keyword: string, page: number, size: number, sort: string = 'firstName', direction: string = 'asc'): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction);
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Filter employees by department with pagination and sorting
   */
  filterByDepartment(department: string, page: number, size: number, sort: string = 'firstName', direction: string = 'asc'): Observable<any> {
    const params = new HttpParams()
      .set('department', department)
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction);
    return this.http.get<any>(`${this.apiUrl}/filter`, { params });
  }
}
