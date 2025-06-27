import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  displayedColumns = ['id', 'firstName', 'email', 'department', 'salary', 'actions'];
  page = 0;
  size = 5;
  totalItems = 0;
  keyword = '';

  sortField = 'firstName';
  sortDirection = 'asc';

  departmentFilter = '';

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployees(this.page, this.size, this.sortField, this.sortDirection).subscribe(data => {
      this.employees = data.content;
      this.totalItems = data.totalElements;
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.getEmployees();
  }

  searchEmployees(): void {
    if (this.keyword.trim() === '') {
      this.getEmployees();
    } else {
      this.employeeService.searchEmployees(this.keyword, this.page, this.size, this.sortField, this.sortDirection).subscribe(data => {
        this.employees = data.content;
        this.totalItems = data.totalElements;
      });
    }
  }

  filterEmployees(): void {
    if (this.departmentFilter.trim() === '') {
      this.getEmployees();
    } else {
      this.employeeService.filterByDepartment(this.departmentFilter, this.page, this.size, this.sortField, this.sortDirection).subscribe(data => {
        this.employees = data.content;
        this.totalItems = data.totalElements;
      });
    }
  }

  applySorting(): void {
    this.getEmployees();
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.getEmployees();
      });
    }
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  createEmployee(): void {
    this.router.navigate(['/employees/new']);
  }
}
