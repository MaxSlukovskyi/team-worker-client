import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  constructor(
    private router: Router,
    public tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
  }

  main(): void {
    this.router.navigate(['main-user']);
  }

  openTask(): void {
    this.router.navigate(['user/tasks']);
  }

  logout(): void {
    this.tokenStorage.logOut();
  }

  openStatistics() {
    this.router.navigate(['user/statistics']);
  }
}
