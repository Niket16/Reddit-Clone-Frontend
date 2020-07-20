import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormControl, Validators } from '@angular/forms';
import { SignupRequestPayload } from './signup-request.payload';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signupRequestPayload: SignupRequestPayload;
  
  constructor(private authService : AuthService,private router: Router, private toastr: ToastrService) {
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''
    };
   }

 
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  signup(){
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;

    // console.log(this.signupRequestPayload);
    this.authService.signup(this.signupRequestPayload)
        .subscribe(data =>
          {
            
            if(data.toString().includes("Email"))
            {
              
              console.log(data+" 1");
              this.toastr.error("Email already exists");
            }

            else if(data.toString().includes("Username"))
            {
              console.log(data+" 2");
              this.toastr.error("Username already exists");

            }
            else{
              console.log(data);
              this.router.navigate(['/login'],{queryParams:{registered:true}})

            }
          },
          (error=>
            {
              
              console.log("Error");
              this.toastr.error(error,"Error",{progressBar:true});
            })
      )

  }
  
}
