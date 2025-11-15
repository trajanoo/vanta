import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './signup-form.html',
  styleUrls: ['./signup-form.css'],
})
export class SignupForm {
  username = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private supabase: Supabase) {}

  async handleSignup() {
    this.loading = true;
    this.error = '';
    this.success = '';

    const { error } = await this.supabase.signUp(this.username, this.email, this.password);

    this.loading = false;

    if(error) {
     this.error = error.message
     return;
    }

    this.success = 'Account created! Check your email to confirm.';
  }
}
