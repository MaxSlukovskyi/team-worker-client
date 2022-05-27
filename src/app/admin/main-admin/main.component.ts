import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router) {

    if(this.tokenStorage.getRole() === 'ROLE_MANAGER') {
      this.router.navigate(['manager/main'])
    } else if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/main']);
    }
  }

  ngOnInit(): void {

  }
}
