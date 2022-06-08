import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Task} from "../../models/Task";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {MoreUserTaskComponent} from "../../user/user-tasks/more-user-task/more-user-task.component";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {AddTaskComponent} from "../../admin/tasks/add-task/add-task.component";
import {AddTaskByManagerComponent} from "./add-task-by-manager/add-task-by-manager.component";
import {MatTableDataSource} from "@angular/material/table";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-tasks-manager',
  templateUrl: './tasks-manager.component.html',
  styleUrls: ['./tasks-manager.component.css']
})
export class TasksManagerComponent implements OnInit {

  tasksCreated: Task[] = [];
  tasksInProgress: Task[] = [];
  tasksOnReview: Task[] = [];
  tasksReleased: Task[] = [];
  tasks: Task[] = [];

  displayedColumnsForReport: string[] = ['name', 'description','createTime','dueTime', 'startTime', 'endTime','project','assignee','creator','priority','stage','type'];

  dataSource: MatTableDataSource<Task>;

  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('date') dateText: ElementRef;

  task: Task;

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router,
    private tasksService: TaskService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/tasks']);
    }
  }

  ngOnInit(): void {
    this.getTasksCreated();
    this.getTasksInProgress();
    this.getTasksOnReview();
    this.getTasksReleased();
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.tasksService.getAllTasksForManager().subscribe({
      next: (data) => {
        this.tasks = <Task[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Task>(this.tasks);
      },
      error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getTasksCreated(): void {
    this.tasksService.getTasksByStageForManager('CREATED').subscribe({
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
    this.tasksService.getTasksByStageForManager('IN_PROGRESS').subscribe({
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
    this.tasksService.getTasksByStageForManager('ON_REVIEW').subscribe({
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
    this.tasksService.getTasksByStageForManager('RELEASED').subscribe({
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

  releaseTask(task: Task) {
    this.tasksService.changeStage(task.id,'RELEASED').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання прийнято');
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

  dropToRelease(event: CdkDragDrop<Task[]>) {
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
    this.releaseTask(this.task);
  }

  addTask() {
    this.dialog.open(AddTaskByManagerComponent);
  }

  editTask(item: Task) {
    this.dialog.open(AddTaskByManagerComponent, {
      data: item
    });
  }

  deleteTask(item: Task) {
    this.tasksService.deleteTask(item.id).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання успішно видалено');
        window.location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
    }
    });
  }

  public downloadAsPDF(): void {
    const user = this.tokenStorage.getUser();
    const date = new Date().toLocaleString();
    this.dateText.nativeElement.innerHTML = '<p>Дата видачі звіту: '+date+',<br>' +
      'Створив: ' + user.name + ' ' + user.surname + '</p>';

    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = {
      content: html,
      pageSize: 'A4',
      pageOrientation: 'landscape'
    };
    pdfMake.createPdf(documentDefinition).open();
  }
}
