import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserResponse, User, Roles } from '../../shared/models/user.interface';
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
  private role = new BehaviorSubject<Roles>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get IsAdmin$(): Observable<string> {
    return this.role.asObservable();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http
      .post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
      .pipe(
        map((res: UserResponse) => {
          this.saveStorage(res);
          this.loggedIn.next(true);
          this.role.next(res.role);
          return res;
        }), catchError((err) => this.handlerError(err))
      );

  }
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['login']);
  }
  private checkToken() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user) {
      const isExpired = helper.isTokenExpired(user.token);
      console.log('isExpired ', isExpired);

      if (isExpired) {
        this.logout();
      } else {
        this.loggedIn.next(true);
        this.role.next(user.role);
      }

    }
    //isExpired ? this.logout : this.loggedIn.next(true);
  }


  private saveStorage(user: UserResponse) {
    //localStorage.setItem('token',token);
    const { userId, message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));
    console.log(user);



  }
  private handlerError(err: any): Observable<never> {
    let errorMensage = 'An error ocurred retrienving data';
    if (err) {
      errorMensage = `Error: code ${err.message}`;
    }
    window.alert(errorMensage);
    return throwError(errorMensage);
  }
}
