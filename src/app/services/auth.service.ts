import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map,delay } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection:AngularFirestoreCollection<IUser>;
  public isAuthenticated$:Observable<boolean>;
  public isAuthenticatedWithDelay$:Observable<boolean>

  constructor(private auth:AngularFireAuth,private db:AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map(user => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
    auth.user.subscribe(console.log)
  }

  public async createUser(UserData:IUser){
    if(!UserData.password){
      throw new Error("Password not provided! ")
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(UserData.email as string, UserData.password as string);
    if(!userCred.user){
      throw new Error("User can't be found!")
    }
      await this.usersCollection.doc(userCred.user?.uid ).set({
        name:UserData.name,
        email:UserData.email,
        age:UserData.age,
        phoneNumber:UserData.phoneNumber
      });

      await userCred.user.updateProfile({displayName:UserData.name})
  }
}
