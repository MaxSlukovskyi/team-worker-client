import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Project} from "../../../models/Project";
import {User} from "../../../models/User";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../../services/notification.service";
import {ProjectService} from "../../../services/project.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-edit-project-by-manager',
  templateUrl: './edit-project-by-manager.component.html',
  styleUrls: ['./edit-project-by-manager.component.css']
})
export class EditProjectByManagerComponent implements OnInit {

  projectForm !: FormGroup;
  project: Project;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public editData: any,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<EditProjectByManagerComponent>,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      createTime: ['', Validators.required],
      projectStage: ['', Validators.required],
      projectType: ['', Validators.required],
      manager: ['', Validators.required]
    });
    if(this.editData) {
      this.projectForm.controls['name'].setValue(this.editData.name);
      this.projectForm.controls['createTime'].setValue(this.editData.createTime);
      this.projectForm.controls['projectStage'].setValue(this.editData.projectStage);
      this.projectForm.controls['projectType'].setValue(this.editData.projectType);
      this.projectForm.controls['manager'].setValue(this.editData.manager);
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
    }
  }
}
