import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Project} from "../../../models/Project";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../../services/notification.service";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  projectForm !: FormGroup;
  project: Project;

  constructor(
              @Inject(MAT_DIALOG_DATA)
              public editData: any,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<EditProjectComponent>,
              private projectService: ProjectService
  ) { }

  ngOnInit(): void {
      this.projectForm = this.formBuilder.group({
        name: ['', Validators.required],
        createTime: ['', Validators.required],
        projectStage: ['', Validators.required],
        projectType: ['', Validators.required]
      });
    if(this.editData) {
      this.projectForm.controls['name'].setValue(this.editData.name);
      this.projectForm.controls['createTime'].setValue(this.editData.createTime);
      this.projectForm.controls['projectStage'].setValue(this.editData.projectStage);
      this.projectForm.controls['projectType'].setValue(this.editData.projectType);
    }
  }

  updateProject(): void {
    if (this.editData) {
      this.projectService.update(this.projectForm.value, this.editData.id).subscribe({
        next: (data) => {
          this.notificationService.showSnackBar('Дані про проект оновлені');
          this.projectForm.reset();
          this.dialogRef.close();
          location.reload();
        },
        error: (error) => {
          this.notificationService.showSnackBar(error.status);
          this.projectForm.reset();
          this.dialogRef.close();
        }
      });
    } else {
      this.projectForm.value.createTime = new Date().toLocaleString();
      this.projectService.add(this.projectForm.value).subscribe({
        next: (data) => {
          this.notificationService.showSnackBar('Проект успішно додано');
          this.projectForm.reset();
          this.dialogRef.close();
          location.reload();
        },
        error: (error) => {
          this.notificationService.showSnackBar('Сталася помилка, спробуйте пізніше');
          this.projectForm.reset();
          this.dialogRef.close();
        }
      })
    }

  }
}
