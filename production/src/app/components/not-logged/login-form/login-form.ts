import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, NgIf],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private supabase: Supabase) {}

  async handleLogin() {
    this.loading = true;
    this.error = '';

    const { error } = await this.supabase.login(this.email, this.password);

    this.loading = false;

    if(error) {
      this.error = error.message
      return 
    }

    window.location.href = '/home'
  }
  
}
