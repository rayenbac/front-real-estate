import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @ViewChild('authModal') authModal!: AuthModalComponent;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$();
  }

  openAuthModal(event: Event): void {
    const triggerElement = event.currentTarget as HTMLElement;
    this.authModal.show(triggerElement);
  }

  onModalClose(): void {
    // Optional: Add any logic needed when conjunctive after the modal closes
  }
}