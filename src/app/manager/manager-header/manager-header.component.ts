import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-manager-header',
  templateUrl: './manager-header.component.html',
  styleUrls: ['./manager-header.component.css']
})
export class ManagerHeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
  }

  main(): void {
    this.router.navigate(['manager/main']);
  }

  openUsers(): void {
    this.router.navigate(['manager/workers']);
  }

  openProjects(): void {
    this.router.navigate(['manager/projects']);
  }

  openTasks(): void {
    this.router.navigate(['manager/tasks']);
  }

  openStatistics() {
    this.router.navigate(['manager/statistics'])
  }

  logout(): void {
    this.tokenStorage.logOut();
  }

}
