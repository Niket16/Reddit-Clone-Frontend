import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor( private httpClient : HttpClient,private localStorage: LocalStorageService) { }
  
  signUpAPI : string = 'http://localhost:8080/api/auth/signup';
  loginAPI : string = 'http://localhost:8080/api/auth/login';

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    
    return this.httpClient.post(this.signUpAPI, signupRequestPayload,{responseType: 'text'});
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(this.loginAPI, loginRequestPayload)
      .pipe(map(data => {
        console.log(data);

       this.localStorage.store("authenticationToken", data.authenticationToken);
       this.localStorage.store("username", data.username);
       this.localStorage.store("refreshToken", data.refreshToken);       
       this.localStorage.store("expiresAt" , data.expireAt);      
        
        return true;
      }));
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.store('authenticationToken',response.authenticationToken);
        this.localStorage.store('expiresAt', response.expireAt);
      }));
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }
  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
  
}
