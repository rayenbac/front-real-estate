import { Injectable } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomSocialAuthService {
  private userSubject = new BehaviorSubject<SocialUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.handleSocialLogin(user);
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
    this.userSubject.next(null);
  }

  private handleSocialLogin(user: SocialUser): void {
    const { provider, idToken, email, name, photoUrl } = user;
    this.userSubject.next(user);
  }
}