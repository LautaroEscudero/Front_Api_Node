import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserResponse, User } from '../../shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http:HttpClient, private router: Router) { 
    this.checkToken();
  }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  login(authData: User): Observable<UserResponse | void>{
    return this.http
    .post<UserResponse>(`${environment.API_URL}/auth/login`,authData)
    .pipe(
      map((res:UserResponse)=>{
        this.saveToken(res.token);
        this.loggedIn.next(true);
        return res;
      }), catchError((err)=> this.handlerError(err))
    );

  }
  logout(){
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }
  private checkToken(){
    const userToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken);
    console.log('isExpired ', isExpired);
    isExpired ? this.logout : this.loggedIn.next(true);
   /*  if(isExpired){
      this.logout();
    }else{
      this.loggedIn.next(true);
    } */


    
  }
  private saveToken(token: string){
    localStorage.setItem('token',token);


  }
  private handlerError(err: any): Observable<never>{
    let errorMensage = 'An error ocurred retrienving data';
    if(err){
      errorMensage = `Error: code ${err.message}`;
    }
    window.alert(errorMensage);
    return throwError(errorMensage);
  }
}
