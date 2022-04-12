import { Component, OnInit } from '@angular/core';
import {Project} from "../../../models/Project";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Position} from "../../../models/Position";
import {NotificationService} from "../../../services/notification.service";
import {MatDialogRef} from "@angular/material/dialog";
import {PositionService} from "../../../services/position.service";
import {ProjectService} from "../../../services/project.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/User";

@Component({
  selector: 'app-delete-position-by-user',
  templateUrl: './delete-position-by-user.component.html',
  styleUrls: ['./delete-position-by-user.component.css']
})
export class DeletePositionByUserComponent implements OnInit {

  users: User[];
  deletePositionForm!: FormGroup;
  positions: Position[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DeletePositionByUserComponent>,
    private positionService: PositionService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getAllUsers();

    this.deletePositionForm = this.formBuilder.group({
      user: ['', Validators.required],
      position: ['', Validators.required]
    });
  }

  getAllUsers(): void {
    this.userService.getAll().subscribe({
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
