import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentilas = {
    email:'',
    password:''
  }

  login(){
    console.log(this.credentilas.email);
    console.log(this.credentilas.password);
  }

}
