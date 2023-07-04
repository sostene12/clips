import { Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IUser from '../models/user.model';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>

  private redirect: boolean = false

  constructor(private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map(user => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({} as Data))
    ).subscribe((data: Data & { authOnly?: boolean }) => 
    this.redirect = data.authOnly ?? false);
    console.log(this.redirect);
  }

  public async createUser(UserData: IUser) {
    if (!UserData.password) {
      throw new Error("Password not provided! ")
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(UserData.email as string, UserData.password as string);
    if (!userCred.user) {
      throw new Error("User can't be found!")
    }
    await this.usersCollection.doc(userCred.user?.uid).set({
      name: UserData.name,
      email: UserData.email,
      age: UserData.age,
      phoneNumber: UserData.phoneNumber
    });

    await userCred.user.updateProfile({ displayName: UserData.name })
  }

  public async logout(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    await this.auth.signOut();
    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }
}
