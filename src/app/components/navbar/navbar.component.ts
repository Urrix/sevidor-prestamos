import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.userName = this.authService.getUserName();
      this.userRole = this.authService.getRole();
    });
  }

  logout() {
    this.authService.logout();
  }

}
