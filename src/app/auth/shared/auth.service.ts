import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupRequestPayload } from '../signup/signup-request.payload';
import { Observable, throwError } from 'rxjs';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor( private httpClient : HttpClient,private localStorage: LocalStorageService) { }
  
  signUpAPI : string = 'https://redditcloneapp.herokuapp.com/api/auth/signup';
  loginAPI : string = 'https://redditcloneapp.herokuapp.com/api/auth/login';

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
       
       this.loggedIn.emit(true);
       this.username.emit(data.username);
        
        return true;
      }));
  }

  googleLogin(token:String) : Observable<boolean>{
    return this.httpClient.post<LoginResponse>("https://redditcloneapp.herokuapp.com/api/auth/getGoogleJwt/",{"token":token}).pipe(map(data =>{
      this.localStorage.store('authenticationToken',data.authenticationToken);
      this.localStorage.store('expiresAt',data.expireAt);
      this.localStorage.store('refreshToken',data.refreshToken);
      this.localStorage.store('username',data.username);
      this.loggedIn.emit(true);
      this.username.emit(data.username);
      return true;
    }
    
    ))
    
  
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>('https://redditcloneapp.herokuapp.com/api/auth/refresh/token',this.refreshTokenPayload)
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

  logout() {
    this.httpClient.post('https://redditcloneapp.herokuapp.com/api/auth/logout', this.refreshTokenPayload,{ responseType: 'text' })
      .subscribe(data => {
      console.log(data);
    }, error => {
      throwError(error);
    })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('image')
    }
  
}
