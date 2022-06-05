import { Component, OnInit } from '@angular/core';
import {Project} from "../../../models/Project";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Position} from "../../../models/Position";
import {NotificationService} from "../../../services/notification.service";
import {MatDialogRef} from "@angular/material/dialog";
import {PositionService} from "../../../services/position.service";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-delete-position-from-manager-project',
  templateUrl: './delete-position-from-manager-project.component.html',
  styleUrls: ['./delete-position-from-manager-project.component.css']
})
export class DeletePositionFromManagerProjectComponent implements OnInit {

  projects: Project[];
  deletePositionForm!: FormGroup;
  positions: Position[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DeletePositionFromManagerProjectComponent>,
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
    this.projectService.getAllByAuthManager().subscribe({
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
