import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  )
  {}


  ngOnInit(): void {

  }

  main(): void {
    this.router.navigate(['admin/main']);
  }

  openUsers(): void {
    this.router.navigate(['admin/users']);
  }

  openProjects(): void {
    this.router.navigate(['admin/projects']);
  }

  openTasks(): void {
    this.router.navigate(['admin/tasks']);
  }

  openStatistics() {
    this.router.navigate(['admin/statistics'])
  }

  userMode(): void {
    this.router.navigate(['user/main']);
  }

  logout(): void {
    this.tokenStorage.logOut();
  }
}
