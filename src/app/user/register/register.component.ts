import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  inSubmission = false;
  showAlert = false;
  alertMsg = 'Please wait! Your account is being  created.';
  alertColor = 'blue';

  constructor(private auth: AuthService,  private emailTaken: EmailTaken) { }

  name = new FormControl('', [Validators.required, Validators.minLength(3)])
  email = new FormControl('', [Validators.required, Validators.email],[this.emailTaken.validate])
  password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)])
  confirm_password = new FormControl('', [Validators.required])
  age = new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(130)])
  phoneNumber = new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)])

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
    confirm_password: this.confirm_password,
    age: this.age,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirm_password')]);


  async register() {
    this.inSubmission = true
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your account is being  created.'
    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (error) {
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured. please try again later.';
      this.inSubmission = false;
      return;
    }

    this.alertColor = 'green';
    this.alertMsg = 'Success! Your account has been created.'
  }

}
