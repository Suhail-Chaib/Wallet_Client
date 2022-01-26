import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ValidationService } from '../../services/validation.service';
import { UserService } from '../../services/user.service';
import { PublicKeyService } from '../../services/public-key.service';
import * as bc from 'bigint-conversion';
import { PrivateKey, PublicKey } from "../../../../../RSA-Module";


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  resultado:any;

  constructor(
    private formBuilder: FormBuilder,
    public publicKeyService: PublicKeyService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validator: ValidationService.MatchPassword // Inject the provider method
    });
  }

  // convenience getter for easy access to form fields
  get formControls() { return this.registerForm.controls; }

  submitRegister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    const password = this.registerForm.value.password;
    let user = {'password': password};
    localStorage.setItem('password', password);

    this.userService.registerUser(user).pipe(first()).subscribe(() => {

      this.publicKeyService.getUser(password).subscribe((response) => {
        this.resultado = response;
  
        let d = bc.base64ToBigint(this.resultado[0].privateKey[0].d);
        localStorage.setItem('d', this.resultado[0].privateKey[0].d);
        console.log(this.resultado[0].privateKey[0].d);
  
        let n = bc.base64ToBigint(this.resultado[0].publicKey[0].n);
        localStorage.setItem('n', this.resultado[0].publicKey[0].n);
        console.log(this.resultado[0].publicKey[0].n);
  
        let e = bc.base64ToBigint("AQAB");
  
        const publicKey = new PublicKey(e, n);
        const privateKey = new PrivateKey(d, publicKey);
        
      }); 

      this.router.navigate(['/log-in']);

    });

    










  }



}
