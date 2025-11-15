import { Component } from '@angular/core';
import { SignupForm } from '../../../components/not-logged/signup-form/signup-form';
import { LoginForm } from '../../../components/not-logged/login-form/login-form';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [SignupForm, LoginForm, NgIf],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
isFlipped = false;
textState = 'final';

toggleFlip() {
  this.textState = 'hide';

  setTimeout(() => {
    this.isFlipped = !this.isFlipped;
  }, 200);

  setTimeout(() => {
    this.textState = 'final';
  }, 900);
}

handleParallax(event: MouseEvent) {
  const x = (event.clientX / window.innerWidth - 0.5) * 20;
  const y = (event.clientY / window.innerHeight - 0.5) * 20;

  const container = document.getElementById("container");

  if (container) {
    container.style.setProperty("--px", `${x}px`);
    container.style.setProperty("--py", `${y}px`);
  }
}

}
