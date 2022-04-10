import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../models/User";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {Project} from "../../../models/Project";
import {MatTableDataSource} from "@angular/material/table";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userForm !: FormGroup;
  user: User;
  projects: Project[];

  constructor(
              @Inject(MAT_DIALOG_DATA)
              public editData: any,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<EditUserComponent>,
              private userService: UserService,
              private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    if(this.editData) {
      this.userForm = this.formBuilder.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        username: ['', Validators.required],
        projects: ['', Validators.required]
      });

      this.userForm.controls['name'].setValue(this.editData.name);
      this.userForm.controls['surname'].setValue(this.editData.surname);
      this.userForm.controls['username'].setValue(this.editData.username);
      this.userForm.controls['projects'].setValue(this.editData.projects);
    }
  }

  getAllProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = <Project[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  updateUser(): void {
           this.userService.update(this.userForm.value, this.editData.id).subscribe({
          next: (data) => {
            this.notificationService.showSnackBar('Дані користувача оновлено');
            this.userForm.reset();
            this.dialogRef.close();
            location.reload();
          },
          error: (error) => {
            this.notificationService.showSnackBar(error.status);
            this.userForm.reset();
            this.dialogRef.close();
            location.reload();
          }
        });
      }
}
