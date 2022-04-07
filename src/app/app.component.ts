import { Component } from '@angular/core';
import {TokenStorageService} from "./services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'team-worker-client';

  constructor(
    private tokenService: TokenStorageService,
    private router: Router
  ) {
    if(!this.tokenService.getUser()) {
      this.router.navigate(['login']);
    }
  }
}
