import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Project} from "../../../models/Project";
import {Position} from "../../../models/Position";
import {User} from "../../../models/User";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../../services/notification.service";
import {ProjectService} from "../../../services/project.service";
import {UserService} from "../../../services/user.service";
import {TaskService} from "../../../services/task.service";
import {TokenStorageService} from "../../../services/token-storage.service";

@Component({
  selector: 'app-add-task-by-manager',
  templateUrl: './add-task-by-manager.component.html',
  styleUrls: ['./add-task-by-manager.component.css']
})
export class AddTaskByManagerComponent implements OnInit {

  taskForm !: FormGroup;
  projects: Project[];
  positions: Position[];
  users: User[];
  task: Task;
  buttonText: string;

  hidden: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public editData: any,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddTaskByManagerComponent>,
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private tokenService: TokenStorageService

  ) { }

  ngOnInit(): void {
    this.getAllProjects();
    if(this.editData) {
      this.taskForm = this.formBuilder.group({
        name: [this.editData.name, Validators.required],
        project: [this.editData.project, Validators.required],
        dueTime: [AddTaskByManagerComponent.dateFormat(this.editData.dueTime, 'yyyy-MM-ddThh:mm'), Validators.required],
        position: [null, Validators.required],
        assignee: [this.editData.assignee, Validators.required],
        priority: [this.editData.priority, Validators.required],
        type: [this.editData.type, Validators.required],
        description: [this.editData.description, Validators.required]
      });
      this.buttonText = 'Зберегти';
    } else {
      this.hidden = false;
      this.taskForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        assignee: ['', Validators.required],
        dueTime: ['', Validators.required],
        user: ['', Validators.required],
        position: ['', Validators.required],
        project: ['', Validators.required],
        priority: ['', Validators.required],
        stage: ['', Validators.required],
        type: ['', Validators.required]
      });
      this.buttonText = 'Додати';
    }
  }

  getAllProjects(): void {
    this.projectService.getAllByAuthManager().subscribe({
      next: (data) => {
        this.projects = <Project[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
       this.notificationService.showSnackBar('Виникла помилка при завантаженні проектів');
      }
    });
  }

  setUpPositions(project: Project, event: any): void {
    if(event.isUserInput) {
      this.positions = project.positions;
    }
  }

  setUpUser(position: Position, event: any): void {
    if(event.isUserInput) {
      this.users = [];
      this.userService.getUsersByPosition(position.id).subscribe({
        next: (data) => {
          this.users = <User[]>JSON.parse(JSON.stringify(data));
        },
        error: (error) => {
          this.notificationService.showSnackBar('Виникла помилка при завантаженні користувачів');
        }
      })
    }
  }

  setTask(): void {
    if(this.editData) {
      this.taskService.updateTask(this.editData.id, {
        id: 0,
        name: this.taskForm.value.name,
        description: this.taskForm.value.description,
        createTime: AddTaskByManagerComponent.convertToLocalDate(new Date().toLocaleString()),
        dueTime: AddTaskByManagerComponent.convertToLocalDate(this.taskForm.value.dueTime),
        lastEditTime: AddTaskByManagerComponent.convertToLocalDate(new Date().toLocaleString()),
        startTime: this.taskForm.value.startTime,
        endTime: this.taskForm.value.endTime,
        assignee: this.taskForm.value.assignee,
        creator: this.tokenService.getUser(),
        project: this.taskForm.value.project,
        priority: this.taskForm.value.priority,
        type: this.taskForm.value.type,
        stage: this.taskForm.value.stage,
        overdue: false
      }).subscribe({
        next: (data) => {
          this.notificationService.showSnackBar('Завдання успішно оновлено');
          this.taskForm.reset();
          this.dialogRef.close();
          location.reload();
        },
        error: (error) => {
          this.notificationService.showSnackBar('На жаль сталася помилка');
          this.taskForm.reset();
          this.dialogRef.close();
          location.reload();
        }
      });

    } else {
      this.taskService.addTask({
        id: 0,
        name: this.taskForm.value.name,
        description: this.taskForm.value.description,
        createTime: AddTaskByManagerComponent.convertToLocalDate(new Date().toLocaleString()),
        dueTime: AddTaskByManagerComponent.convertToLocalDate(this.taskForm.value.dueTime),
        lastEditTime: AddTaskByManagerComponent.convertToLocalDate(new Date().toLocaleString()),
        startTime: '',
        endTime: '',
        assignee: this.taskForm.value.assignee,
        creator: this.tokenService.getUser(),
        project: this.taskForm.value.project,
        priority: this.taskForm.value.priority,
        type: this.taskForm.value.type,
        stage: 'CREATED',
        overdue: false
      }).subscribe({
        next: (data) => {
          this.notificationService.showSnackBar('Завдання успішно додано');
          this.taskForm.reset();
          this.dialogRef.close();
          location.reload();
        },
        error: (error) => {
          this.notificationService.showSnackBar('На жаль сталася помилка');
          this.taskForm.reset();
          this.dialogRef.close();
          location.reload();
        }
      });
    }
  }

  private static convertToLocalDate(date: string): string {
    date.replace('-','.');
    date.replace('T',', ');
    return date;
  }

  private static dateFormat(inputDate: string, format: string) {
    //parse the input date
    const date = inputDate.split(',');
    const splittedDate = date[0].split('.');
    const dateTime = new Date(splittedDate[1]+'.'+splittedDate[0]+'.'+splittedDate[2]+', '+date[1]);

    //extract the parts of the date
    const day = dateTime.getDate();
    const month = dateTime.getMonth()+1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours();
    const min = dateTime.getMinutes();

    //replace the month
    format = format.replace("MM", month.toString().padStart(2,"0"));

    //replace the year
    if (format.indexOf("yyyy") > -1) {
      format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
      format = format.replace("yy", year.toString().substr(2,2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2,"0"));

    format = format.replace("hh",hour.toString().padStart(2,"0"));

    format = format.replace("mm", min.toString().padStart(2,"0"));
    return format;
  }

  showEditAssignee() {
    this.hidden = !this.hidden;
  }
}
