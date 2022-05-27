import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Task} from "../../../models/Task";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TokenStorageService} from "../../../services/token-storage.service";
import {Router} from "@angular/router";
import {TaskService} from "../../../services/task.service";
import {NotificationService} from "../../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {MoreInfoTaskComponent} from "../../../admin/tasks/more-info-task/more-info-task.component";
import {MoreUserTaskComponent} from "./more-user-task/more-user-task.component";

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.css']
})
export class UserTasksComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description','createTime','dueTime','lastEditTime', 'startTime', 'endTime','project','assignee','creator','priority','stage', 'type', 'action'];

  dataSourceTasksCreated: MatTableDataSource<Task>;
  dataSourceTasksInProgress: MatTableDataSource<Task>;
  dataSourceTasksOnReview: MatTableDataSource<Task>;
  dataSourceTasksReleased: MatTableDataSource<Task>;

  tasksCreated: Task[];
  tasksInProgress: Task[];
  tasksOnReview: Task[];
  tasksReleased: Task[];

  @ViewChild('paginatorNewTask') paginatorCreated: MatPaginator;
  @ViewChild('paginatorInProgress') paginatorInProgress: MatPaginator;
  @ViewChild('paginatorOnReview') paginatorOnReview: MatPaginator;
  @ViewChild('paginatorFinished') paginatorReleased: MatPaginator;
  @ViewChild('sortCreated') sortCreated: MatSort;
  @ViewChild('sortInProgress') sortInProgress: MatSort;
  @ViewChild('sortOnReview') sortOnReview: MatSort;
  @ViewChild('sortReleased') sortReleased: MatSort;

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
        this.dataSourceTasksCreated = new MatTableDataSource<Task>(this.tasksCreated);
        this.dataSourceTasksCreated.paginator = this.paginatorCreated;
        this.dataSourceTasksCreated.sort = this.sortCreated;
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
        this.dataSourceTasksInProgress = new MatTableDataSource<Task>(this.tasksInProgress);
        this.dataSourceTasksInProgress.paginator = this.paginatorInProgress;
        this.dataSourceTasksInProgress.sort = this.sortInProgress;
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
        this.dataSourceTasksOnReview = new MatTableDataSource<Task>(this.tasksOnReview);
        this.dataSourceTasksOnReview.paginator = this.paginatorOnReview;
        this.dataSourceTasksOnReview.sort = this.sortOnReview;
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
        this.dataSourceTasksReleased = new MatTableDataSource<Task>(this.tasksReleased);
        this.dataSourceTasksReleased.paginator = this.paginatorReleased;
        this.dataSourceTasksReleased.sort = this.sortReleased;
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  applyFilterTasksCreated(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTasksCreated.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTasksCreated.paginator) {
      this.dataSourceTasksCreated.paginator.firstPage();
    }
  }

  applyFilterTasksInProgress(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTasksInProgress.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTasksInProgress.paginator) {
      this.dataSourceTasksInProgress.paginator.firstPage();
    }
  }

  applyFilterTasksReleased(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTasksReleased.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTasksReleased.paginator) {
      this.dataSourceTasksReleased.paginator.firstPage();
    }
  }

  applyFilterTasksOnReview(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTasksOnReview.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTasksOnReview.paginator) {
      this.dataSourceTasksOnReview.paginator.firstPage();
    }
  }

  moreAboutTask(row: any) {
    this.dialog.open(MoreUserTaskComponent,{
      data: row
    });
  }

  startTask(row: any) {
    this.tasksService.changeStage(row.id,'IN_PROGRESS').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Виконання завдання розпочато');
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('Сталася помилка');
      }
    });
  }

  finishTask(row: any) {
    this.tasksService.changeStage(row.id,'ON_REVIEW').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання на перевірці');
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('Сталася помилка');
      }
    });
  }
}
