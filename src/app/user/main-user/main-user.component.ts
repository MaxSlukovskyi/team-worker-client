import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.css']
})
export class MainUserComponent implements OnInit {

  constructor(
    public tokenService: TokenStorageService,
    private router: Router
  ) {
    this.router.navigate(['user/tasks']);
  }

  ngOnInit(): void {
  }

}
