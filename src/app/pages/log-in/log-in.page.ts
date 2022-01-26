import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  
  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],});
  }

  get formControls() { return this.loginForm.controls; }

  submitLogin(): void {

    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }

    const pass = this.loginForm.value.password;
    let password = localStorage.getItem('password');

    if (pass === password){
      this.router.navigateByUrl('/home');
    }else{
      alert("No se puedo iniciar sesion");
    }

  }

}
