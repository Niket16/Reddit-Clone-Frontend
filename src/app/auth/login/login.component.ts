import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login-request.payload';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService, SocialUser, AmazonLoginProvider } from 'angularx-social-login';
import {  GoogleLoginProvider } from "angularx-social-login";
import { throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { faComment } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequestPayload: LoginRequestPayload;
  isError: boolean;
  registerSuccessMessage: string;
  userSocial: SocialUser;
  success : boolean;
  
  



  constructor(private authService: AuthService,private localStorage:LocalStorageService,private socialAuthService: SocialAuthService, private activatedRoute: ActivatedRoute,private router: Router,private toastr: ToastrService) { 
    this.loginRequestPayload = {
      username: '',
      password: ''
    };
   }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
      this.socialAuthService.authState.subscribe((user) => {
        this.userSocial = user;
        // console.log(user);
      });
  }

  login(){
    this.loginRequestPayload.username = this.loginForm.get('username').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;

    this.authService.login(this.loginRequestPayload).subscribe(data => {
      if (data) {
        this.isError = false;
        this.localStorage.store("image" ,"https://www.redditstatic.com/avatars/avatar_default_08_D4E815.png" ) ;
        this.router.navigateByUrl('/');
        this.toastr.success('Login Successful');
      } else {
        this.isError = true;
      }
    });
  }
  

  signIn2(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data=>{
        this.userSocial=data;
        const token = this.userSocial.idToken;
        
        // 
        this.authService.googleLogin(token).subscribe(data=>{
            this.isError=false
            this.localStorage.store("image" ,this.userSocial.photoUrl);
            this.toastr.success("Login successful","Success",{progressBar:true});
            this.redirectTo('');
        },
        error=>{
          this.isError=true;
          throwError(error)
          console.log(error.error.text)
          this.toastr.error("Login failed",error.error.text,{progressBar:true})
        })
       }
      )
  }

  signInamazon(){
    
    this.socialAuthService.signIn(AmazonLoginProvider.PROVIDER_ID).then(data=>{
        this.userSocial=data;   
        const token = this.userSocial.authToken;
          this.authService.amazonLogin(token).subscribe(data=>{
          this.isError=false
            
          this.toastr.success("Login successful","Success",{progressBar:true});
          this.redirectTo('');
          this.localStorage.store("image" ,"https://www.redditstatic.com/avatars/avatar_default_08_D4E815.png" ) ;
        },
        error=>{
          this.isError=true;
          throwError(error)
          console.log(error.error.text)
          this.toastr.error("Login failed",error.error.text,{progressBar:true})
        })
       }
      )
  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/list-subreddits', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }
  

}
