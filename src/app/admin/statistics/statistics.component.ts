import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Task} from "../../models/Task";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import {Project} from "../../models/Project";
import {Position} from "../../models/Position";
import {User} from "../../models/User";
import {ProjectService} from "../../services/project.service";
import {UserService} from "../../services/user.service";
import {TasksComponent} from "../tasks/tasks.component";
import {TaskService} from "../../services/task.service";
import {NotificationService} from "../../services/notification.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MoreInfoTaskComponent} from "../tasks/more-info-task/more-info-task.component";
import {MatDialog} from "@angular/material/dialog";
import {Statistics} from "../../models/Statistics";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  taskForm !: FormGroup;

  displayedColumns: string[] = ['name', 'username','position','percentageOnTime','totalCompletedTasks'];
  dataSource: MatTableDataSource<Statistics>;
  stats: Statistics[];
  positions: Position[];
  users: User[];
  projects: Project[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private notificationService: NotificationService,
  ) {
    if(this.tokenStorage.getRole() === 'ROLE_MANAGER') {
      this.router.navigate(['manager/statistics'])
    } else if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/main']);
    }
  }

  ngOnInit(): void {
    this.getAllProjects();
     this.taskForm  = this.formBuilder.group({
      project: ['', Validators.required],
      position: ['', Validators.required],
      user: ['', Validators.required]
     });
     this.getDefaultStatistics();
  }

  getDefaultStatistics(): void {
    this.userService.getDefaultStatistics().subscribe({
      next: (data) => {
        this.stats = <Statistics[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Statistics>(this.stats);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data);
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       /* this.tokenStorage.logOut();
        this.router.navigate(['login']);*/
      }
    })
  }

  /*getTasksByFilters(): void {
    this.taskService.getUserTasksByFilter(this.taskForm.value.user.id,
      {
        time1: this.taskForm.value.startTime.toLocaleString(),
        time2: this.taskForm.value.endTime.toLocaleString()
      })
      .subscribe({
      next: (data) => {
        this.tasks = <Task[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Task>(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.notificationService.showSnackBar('Користувача знайдено');
      },
      error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
      });
  }*/

  getAllProjects(): void {
    this.projectService.getAll().subscribe({
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
          console.log('Виникла помилка при завантаженні користувачів');
        }
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
