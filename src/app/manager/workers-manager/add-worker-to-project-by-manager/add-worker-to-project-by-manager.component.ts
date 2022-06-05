import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {ProjectService} from "../../../services/project.service";
import {User} from "../../../models/User";
import {Project} from "../../../models/Project";
import {Position} from "../../../models/Position";

@Component({
  selector: 'app-add-worker-to-project-by-manager',
  templateUrl: './add-worker-to-project-by-manager.component.html',
  styleUrls: ['./add-worker-to-project-by-manager.component.css']
})
export class AddWorkerToProjectByManagerComponent implements OnInit {

  users: User[];
  projects: Project[];
  user: User;
  selectedProject: Project;
  userForm!: FormGroup;
  positions: Position[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public editData: any,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddWorkerToProjectByManagerComponent>,
    private userService: UserService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.getAllProjects();
    this.getAllUsers();

    this.userForm = this.formBuilder.group({
      user: ['', Validators.required],
      project: ['', Validators.required],
      position:  ['', Validators.required]
    });
  }

  getAllProjects(): void {
    this.projectService.getAllByAuthManager().subscribe({
      next: (data) => {
        this.projects = <Project[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        console.log(error);
      }
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

  setUpPositions(project: Project, event: any): void {
    if(event.isUserInput)
      this.positions = project.positions;
  }

  updateUser(): void {
    this.userService.setPosition(this.userForm.value.user.id, this.userForm.value.position).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Працівника успішно додано');
        this.userForm.reset();
        this.dialogRef.close();
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar(error.status);
        this.userForm.reset();
        this.dialogRef.close();
      }
    })
  }


}
