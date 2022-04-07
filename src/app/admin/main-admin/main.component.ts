import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../../services/user.service";
import {User} from "../../models/User";
import {Position} from "../../models/Position";
import {EditUserComponent} from "../users/edit-user/edit-user.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router) {

    if (this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['main-user']);
    }
  }

  ngOnInit(): void {

  }
}
