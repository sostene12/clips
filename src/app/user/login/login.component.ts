import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  inSubmission = false;
  alertMsg = 'Please wait! we are logging you in.';
  alertColor = 'blue';
  showAlert = false

  credentilas = {
    email: '',
    password: ''
  }

  constructor(private auth: AngularFireAuth) { }

  async login() {
    this.inSubmission = true
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! we are logging you in.';
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentilas.email,
        this.credentilas.password);

    } catch (error) {
      this.inSubmission = false
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured. please try again later.';
      return;
    }

    this.alertMsg = 'Success! you are now logged in.';
    this.alertColor = 'green'
  }

}
