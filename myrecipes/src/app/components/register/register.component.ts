import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private supaService: SupabaseService, private formBuilder: FormBuilder,private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Ahora validamos correctamente el email
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator(8)]],
        password2: ['', [Validators.required, Validators.minLength(6), this.passwordValidator(8)]],
      }, {
        validators: this.passwordCrossValidator
      })
    });
  }

  // Validaciones de password
  get password1NotValid() {
    return this.registerForm.get('passwords.password')?.invalid && this.registerForm.get('passwords.password')?.touched;
  }

  get password2NotValid() {
    return this.registerForm.get('passwords.password2')?.invalid && this.registerForm.get('passwords.password2')?.touched;
  }

  get crossPasswordsNotValid() {
    return this.registerForm.get('passwords')?.invalid;
  }
  get passwordValid() {
    return this.registerForm.get('passwords.password')?.valid && this.registerForm.get('passwords.password2')?.valid;
  }
  get emailNotValid() {
    return this.registerForm.get('email')?.invalid && this.registerForm.get('email')?.touched;
  }
  get emailValid() {
    const control = this.registerForm.get('email');
    return control?.valid && control?.touched;
  }

  passwordValidator(minlength: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c.value) {
        let valid = c.value.length >= minlength && c.value.includes('5'); // Debe tener al menos un "5"
        return valid ? null : { password: 'Debe tener al menos ' + minlength + ' caracteres y un número 5' };
      }
      return null;
    };
  }

  passwordCrossValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const ps = control.get('passwords.password');
    const ps2 = control.get('passwords.password2');
    return ps && ps2 && ps.value === ps2.value ? null : { passwordCrossValidator: true };
  };

  // Nueva función para registrar usuario
  sendRegister() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('passwords.password')?.value;
      this.supaService.register(email, password).subscribe({
        next: logindata => console.log(logindata),
        complete: () => {
          console.log("complete");
          this.router.navigate(['/home']); 
        },
        error: error => this.error = error.message
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  email: string = '';
  password: string = '';
  error: string | undefined;
}