import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy  {

  hide = true;

  private isValidEmail = /\S+@\S+\.\S+/;
  private subscripcion: Subscription = new Subscription();

  loginForm = this.fb.group({
    username:['', [Validators.required, Validators.pattern(this.isValidEmail)]],
    password:['', [Validators.required, Validators.minLength(5)]]
  })

  constructor(private authSvc: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  /*   const userData = {
      username: 'lauta66@gmail.com',
      password: '123456'
    };
    this.authSvc.login(userData).subscribe( res => console.log('login')); */
  }

  ngOnDestroy():void {

    this.subscripcion.unsubscribe();

  }

  onLogin(){
    const formValue = this.loginForm.value;

    if(this.loginForm.invalid){
      return;
    }

    this.subscripcion.add(
    this.authSvc.login(formValue).subscribe(res=>{
      if(res){
        this.router.navigate(['']);
      }
    })
    );
  }

  getErrorMessage(field: string): string{
    let message;
    if(this.loginForm.get(field).errors.required){
      message = 'You must enter a value';
    }else if(this.loginForm.get(field).hasError('pattern')){
      message = 'Not a valid email';
    }else if(this.loginForm.get(field).hasError('minlength')){
      const minLenth = this.loginForm.get(field).errors?.minlength.requiredLength;
      message = `This field must be longer than ${minLenth} characters`;
    }
    return message;

  }

  isValidField(field: string): boolean{

    return ( 
      (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) 
    && !this.loginForm.get(field).valid
    );

  }

}
