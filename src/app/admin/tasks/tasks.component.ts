import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TaskService} from "../../services/task.service";
import {NotificationService} from "../../services/notification.service";
import {Task} from "../../models/Task";
import {MatDialog} from "@angular/material/dialog";
import {MoreInfoTaskComponent} from "./more-info-task/more-info-task.component";
import {AddTaskComponent} from "./add-task/add-task.component";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description','createTime','dueTime','lastEditTime', 'startTime', 'endTime','project','assignee','creator','priority','stage', 'type', 'action'];
  displayedColumnsForReport: string[] = ['name', 'description','createTime','dueTime', 'startTime', 'endTime','project','assignee','creator','priority','stage','type'];
  dataSource: MatTableDataSource<Task>;
  tasks: Task[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('date') dateText: ElementRef;

  dataSourceCheck: MatTableDataSource<Task>;
  tasksCheck: Task[];

  loading = true;
  loadingRev = true;

  @ViewChild('paginatorCheck') paginatorCheck: MatPaginator;

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router,
    private tasksService: TaskService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    if(this.tokenStorage.getRole() === 'ROLE_MANAGER') {
      this.router.navigate(['manager/tasks'])
    } else if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/tasks']);
    }
  }

  ngOnInit(): void {
    this.getAllTasks();
    this.getDoneTasks();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  moreAboutTask(row: any) {
    this.dialog.open(MoreInfoTaskComponent,{
      data: row
    });
  }

  addTask() {
    this.dialog.open(AddTaskComponent);
  }

  updateTask(row: any) {
    this.dialog.open(AddTaskComponent, {
      data: row
    });
  }

  deleteTask(row: any) {
    this.tasksService.deleteTask(row.id).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання успішно видалено');
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('На жаль сталася помилка');
      }
    })
  }

  getAllTasks(): void {
    this.tasksService.getAllTasksForAdministrator().subscribe({
      next: (data) => {
        this.tasks = <Task[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Task>(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getDoneTasks(): void {
    this.tasksService.getTasksByStageForAdmin('ON_REVIEW').subscribe({
      next: (data) => {
        this.tasksCheck = <Task[]>JSON.parse(JSON.stringify(data));
        this.dataSourceCheck = new MatTableDataSource<Task>(this.tasksCheck);
        this.dataSourceCheck.paginator = this.paginatorCheck;
        this.dataSourceCheck.sort = this.sort;
        this.loadingRev = false;
      },
      error: (error) => {
        this.notificationService.showSnackBar("Не вдалося завантажити виконані завдання");
      }
    });
  }

  applyFilterTasksOnReview(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCheck.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCheck.paginator) {
      this.dataSourceCheck.paginator.firstPage();
    }
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


  acceptTask(row:any) {
    this.tasksService.changeStage(row.id,'RELEASED').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання виконано');
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('Сталася помилка');
      }
    });
  }

  rejectTask(row:any) {
    this.tasksService.changeStage(row.id,'IN_PROGRESS').subscribe({
      next: (data) => {
        this.notificationService.showSnackBar('Завдання відхилено');
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar('Сталася помилка');
      }
    });
  }
}
