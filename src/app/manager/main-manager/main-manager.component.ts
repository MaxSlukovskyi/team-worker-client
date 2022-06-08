import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-main-manager',
  templateUrl: './main-manager.component.html',
  styleUrls: ['./main-manager.component.css']
})
export class MainManagerComponent implements OnInit {

  constructor(
    private router: Router,
    public tokenStorage: TokenStorageService,
  ) {
    if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/statistics']);
    }
    this.router.navigate(['manager/statistics']);
  }

  ngOnInit(): void {

  }

}
