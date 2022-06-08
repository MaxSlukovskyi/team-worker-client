import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Task} from "../../models/Task";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {MoreUserTaskComponent} from "./more-user-task/more-user-task.component";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.css']
})
export class UserTasksComponent implements OnInit {

  tasksCreated: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksOnReview: Task[] = [];
  tasksReleased: Task[] = [];

  task: Task;

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router,
    private tasksService: TaskService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getTasksCreated();
    this.getTasksInProgress();
    this.getTasksOnReview();
    this.getTasksReleased();
  }

  getTasksCreated(): void {
    this.tasksService.getTasksByStage('CREATED').subscribe({
      next: (data) => {
        this.tasksCreated = <Task[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getTasksInProgress(): void {
    this.tasksService.getTasksByStage('IN_PROGRESS').subscribe({
      next: (data) => {
        this.tasksInProgress = <Task[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }


  getTasksOnReview(): void {
    this.tasksService.getTasksByStage('ON_REVIEW').subscribe({
      next: (data) => {
        this.tasksOnReview = <Task[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getTasksReleased(): void {
    this.tasksService.getTasksByStage('RELEASED').subscribe({
      next: (data) => {
        this.tasksReleased = <Task[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  moreAboutTask(item: Task) {
    this.dialog.open(MoreUserTaskComponent,{
      data: item
    });
  }

  startTask(task: Task) {
    this.tasksService.changeStage(task.id,'IN_PROGRESS').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Виконання завдання розпочато');
        window.location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  finishTask(task: Task) {
    this.tasksService.changeStage(task.id,'ON_REVIEW').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання на перевірці');
        window.location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  dropToInProgress(event: CdkDragDrop<Task[]>) {
    this.task = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.startTask(this.task);
  }

  dropToReview(event: CdkDragDrop<Task[]>) {
    this.task = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.finishTask(this.task);
  }

  dropToRelease($event: CdkDragDrop<Task[], any>) {
    this.notificationService.showSnackBar('Для того щоб завдання було повністю виконане, його повинен перевірити ваш керівник');
  }
}
