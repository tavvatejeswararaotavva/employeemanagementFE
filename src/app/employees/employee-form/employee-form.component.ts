import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  employeeId?: number;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]]
    });

    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isEdit = true;
        this.employeeId = +params['id'];
        this.loadEmployee();
      }
    });
  }

  loadEmployee() {
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (employee) => this.form.patchValue(employee),
      error: () => this.errorMessage = 'Failed to load employee'
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
   const employee: Employee = this.form.value;
    if (this.isEdit) {
      this.employeeService.updateEmployee(this.employeeId!, employee).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => this.errorMessage = 'Failed to update employee'
      });
    } else {
      this.employeeService.createEmployee(employee).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => this.errorMessage = 'Failed to create employee'
      });
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
