import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/User";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Position} from "../../../models/Position";
import {NotificationService} from "../../../services/notification.service";
import {MatDialogRef} from "@angular/material/dialog";
import {PositionService} from "../../../services/position.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-delete-position-by-manager',
  templateUrl: './delete-position-by-manager.component.html',
  styleUrls: ['./delete-position-by-manager.component.css']
})
export class DeletePositionByManagerComponent implements OnInit {

  users: User[];
  deletePositionForm!: FormGroup;
  positions: Position[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DeletePositionByManagerComponent>,
    private positionService: PositionService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();

    this.deletePositionForm = this.formBuilder.group({
      user: ['', Validators.required],
      position: ['', Validators.required]
    });
  }

  getAllUsers(): void {
    this.userService.getAllByAuthManager().subscribe({
      next: (data) => {
        this.users = <User[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  setUpPositions(user: User, event: any): void {
    if (event.isUserInput)
      this.positions = user.position;
  }

  deletePosition(): void {
    this.userService.deleteUserPosition(
      this.deletePositionForm.value.user.id,
      this.deletePositionForm.value.position).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Посада знята з користувача');
        this.deletePositionForm.reset();
        this.dialogRef.close();
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('Сталася помилка, спробуйте пізніше');
        this.deletePositionForm.reset();
        this.dialogRef.close();
      }
    });
  }

}
