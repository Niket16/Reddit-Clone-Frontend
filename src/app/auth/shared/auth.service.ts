import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor( private httpClient : HttpClient,private localStorage: LocalStorageService) { }
  
  signUpAPI : string = 'http://localhost:8080/api/auth/signup';
  loginAPI : string = 'http://localhost:8080/api/auth/login';

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(this.signUpAPI, signupRequestPayload);
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(this.loginAPI, loginRequestPayload)
      .pipe(map(data => {
        console.log(data);
        
       this.localStorage.store("authenticationToken", data.authenticationToken);
       this.localStorage.store("username", data.username);
       this.localStorage.store("refreshToken", data.refreshToken);       
       this.localStorage.store("expiresAt", data.expiresAt);       
        
        return true;
      }));
  }
  
}
