import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Project} from "../../../models/Project";
import {NotificationService} from "../../../services/notification.service";
import {MatDialogRef} from "@angular/material/dialog";
import {ProjectService} from "../../../services/project.service";
import {PositionService} from "../../../services/position.service";

@Component({
  selector: 'app-add-position-to-manager-project',
  templateUrl: './add-position-to-manager-project.component.html',
  styleUrls: ['./add-position-to-manager-project.component.css']
})
export class AddPositionToManagerProjectComponent implements OnInit {

  addPositionForm !: FormGroup;
  projects: Project[];

  @ViewChild('positionName') positionName: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddPositionToManagerProjectComponent>,
    private projectService: ProjectService,
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.getAllProjects();
    this.addPositionForm = this.formBuilder.group({
      project: ['', Validators.required],
      position: ['', Validators.required]
    });
  }

  addPositionToProject(): void {
    this.positionService.addPosition({
      id: 0,
      name: this.positionName.nativeElement.value,
      project: this.addPositionForm.value.project
    }).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Посаду успішно додано');
        this.addPositionForm.reset();
        this.dialogRef.close();
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('Сталася помилка, спробуйте пізніше');
        this.addPositionForm.reset();
        this.dialogRef.close();
      }
    })
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

}
