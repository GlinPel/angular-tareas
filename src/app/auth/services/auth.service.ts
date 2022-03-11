import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { formLoginUser, formRegisterUser, LoggedUser } from '../interfaces/AuthInterfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  private url: string = environment.apiUrl;
  private _loggedUser: LoggedUser = <LoggedUser>{};
  constructor(private httpClient: HttpClient, private router: Router) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('TOKEN');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  setLoggedUser(user: LoggedUser){
    this._loggedUser = user;
  }
  getLoggedUser(): LoggedUser{
    return this._loggedUser;
  }
  login(user: formLoginUser){
    return this.httpClient.post<LoggedUser>(`${this.url}/login`, user)
            .pipe(
              tap(auth => localStorage.setItem("TOKEN", auth.token))
            );
  }

  register(user: formRegisterUser){
    return this.httpClient.post<LoggedUser>(`${this.url}/register`, user)
            .pipe(
              tap(auth => localStorage.setItem("TOKEN", auth.token))
            );
  }
  verificarToken(): Observable<boolean>{
    if(!localStorage.getItem("TOKEN")){
      return of(false);
    }
    const formData = new FormData();
    formData.append('token', localStorage.getItem("TOKEN"));
    return this.httpClient.post<LoggedUser>(`${this.url}/verificar`, formData)
            .pipe(
              map( auth => {
                this._loggedUser = auth;
                return true
              }),
              catchError(err => {
                this.router.navigate(['/auth/login']);
                localStorage.removeItem("TOKEN");
                return of(false)
              }),
            );
  }
}
