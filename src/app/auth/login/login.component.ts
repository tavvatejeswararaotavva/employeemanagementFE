import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../auth.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ Form with 'username' and 'password' fields
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9]*$/)
        ]
      ]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  passwordLengthError(): boolean {
    return this.loginForm.get('password')?.hasError('minlength') ?? false;
  }

  passwordAlphanumericError(): boolean {
    return this.loginForm.get('password')?.hasError('pattern') ?? false;
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.authService.saveToken(res.token);
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid credentials';
      }
    });
  }

  ForgotPassword(): void {
    alert('Forgot Password clicked');
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
