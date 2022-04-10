import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Project} from "../../../models/Project";
import {User} from "../../../models/User";
import {Position} from "../../../models/Position";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";
import {ProjectService} from "../../../services/project.service";
import {PositionService} from "../../../services/position.service";

@Component({
  selector: 'app-delete-position-from-project',
  templateUrl: './delete-position-from-project.component.html',
  styleUrls: ['./delete-position-from-project.component.css']
})
export class DeletePositionFromProjectComponent implements OnInit {

  projects: Project[];
  deletePositionForm!: FormGroup;
  positions: Position[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DeletePositionFromProjectComponent>,
    private positionService: PositionService,
    private projectService: ProjectService
  ) {
  }

  ngOnInit(): void {
    this.getAllProjects();

    this.deletePositionForm = this.formBuilder.group({
      project: ['', Validators.required],
      position: ['', Validators.required]
    });
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

  setUpPositions(project: Project, event: any): void {
    if (event.isUserInput)
      this.positions = project.positions;
  }

  deletePosition(): void {
    this.positionService.deletePosition(this.deletePositionForm.value.position.id).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Посаду успішно видалено');
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
