import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private destroy$ = new Subject<any>();

  isAdmin = null;
  isLogged = false;
  @Output()
  toggleSidenav = new EventEmitter<void>();

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {

    this.subscription.add(
      this.authSvc.isLogged.subscribe(res => this.isLogged = res)
    );

    this.authSvc.IsAdmin$.pipe(
      takeUntil(this.destroy$)
    )
      .subscribe((res) => (this.isAdmin = res));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.authSvc.logout();

  }

}
