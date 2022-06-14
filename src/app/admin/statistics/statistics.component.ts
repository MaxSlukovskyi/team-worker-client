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
import {ChartType, Row} from "angular-google-charts";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  taskForm !: FormGroup;

  hideTable = false;

  displayedColumns: string[] = ['name', 'username','position','percentageOnTime','totalCompletedTasks'];
  dataSource: MatTableDataSource<Statistics>;
  stats: Statistics[];
  positions: Position[];
  users: User[];
  projects: Project[];

  loading = true;

  hiddenTaskByMonth = true;
  hiddenType = true;
  hiddenStage = true;
  hiddenClosest = true;

  doneOnTime: number = 0;
  doneCount: number = 0;
  bestMonthTasks: number = 0;
  averageTime: string = '';
  closestTask: Task = <Task>{};

  //кругова діаграма по типах
  typeStage: ChartType = ChartType.PieChart;
  dataStage:Row[] = [];
  columnNamesStage = ['Стадія', 'Кількість'];
  optionsStage = {
  };

  //лінійна по місяцях
  typeTaskByMonth: ChartType = ChartType.LineChart;
  dataTaskByMonth:Row[] = [];
  columnNamesTaskByMonth = ['Місяць', 'Кількість'];
  optionsTaskByMonth = {
    hAxis: {
      title: 'Місяць'
    },
    vAxis:{
      format: 0,
      title: 'Кількість завдань'
    },
    pointSize:5,
    legend: {position: 'none'}
  };

  //типи - кількість діаграма
  typeType: ChartType = ChartType.ColumnChart;
  dataType:Row[] = [];
  columnNamesType = ['Тип завдання', 'Кількість'];
  optionsType = {
    legend: {position: 'none'},
    vAxis: {
      format: 0,
      bar: {groupWidth: "95%"},
    }
  };

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
        this.loading = false;
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    })
  }

  getTasksByFilters(): void {
    if(this.taskForm.value.user.id) {
      this.dataStage = [];
      this.dataType = [];
      this.dataTaskByMonth = [];

      this.doneOnTime = 0;
      this.doneCount = 0;
      this.bestMonthTasks = 0;
      this.averageTime = '';
      this.closestTask = <Task>{};

      this.hiddenTaskByMonth = true;
      this.hiddenType = true;
      this.hiddenStage = true;
      this.hiddenClosest = true;

      this.hideTable = true;

      this.getDoneOnTime();
      this.getAllDoneTasksCount();
      this.getAverageTime();
      this.getBestMonth();
      this.getStatsMonths();
      this.getStatsType();
      this.getStatsStage();
      this.getClosestTask();
    }

  }

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

  getDoneOnTime(): void {
    this.taskService.getStatsOnTimeForUserManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        this.doneOnTime = value;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getAllDoneTasksCount(): void {
    this.taskService.getStatsAllDoneTasksManager(this.taskForm.value.user.id,'RELEASED').subscribe({
      next: value => {
        this.doneCount = value;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       this.tokenStorage.logOut();
       this.router.navigate(['login']);
      }
    });
  }

  getAverageTime(): void {
    this.taskService.getAverageTimeManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        this.averageTime = value.response;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getBestMonth(): void {
    this.taskService.getStatsBestMonthManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        this.bestMonthTasks = value;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       this.tokenStorage.logOut();
       this.router.navigate(['login']);
      }
    });
  }

  getStatsMonths(): void {
    this.taskService.getStatsMonthsManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        this.dataTaskByMonth = [
          [value[value.length-1].name, value[value.length-1].number]
        ];

        for(let i = value.length-2; i>=0; i--) {
          this.dataTaskByMonth.push([
            value[i].name, value[i].number
          ]);
        }
        this.hiddenTaskByMonth = false;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       this.tokenStorage.logOut();
       this.router.navigate(['login']);
      }
    });
  }

  getStatsType(): void {
    this.taskService.getStatsTypesManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        this.dataType = [
          [value[value.length-1].name, value[value.length-1].number]
        ];

        for(let i = value.length-2; i>=0; i--) {
          this.dataType.push([
            value[i].name, value[i].number
          ]);
        }
        this.hiddenType = false;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       this.tokenStorage.logOut();
       this.router.navigate(['login']);
      }});
  }

  getStatsStage(): void {
    this.taskService.getStatsStagesManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        this.dataStage = [
          [value[value.length-1].name, value[value.length-1].number]
        ];

        for(let i = value.length-2; i>=0; i--) {
          this.dataStage.push([
            value[i].name, value[i].number
          ]);
        }
        this.hiddenStage = false;
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       this.tokenStorage.logOut();
       this.router.navigate(['login']);
      }
    });
  }

  getClosestTask(): void {
    this.taskService.getTaskClosestManager(this.taskForm.value.user.id).subscribe({
      next: value => {
        if(value != null) {
          this.closestTask = value;
          this.hiddenClosest = false;
        }
      },
      error: err => {
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
       this.tokenStorage.logOut();
       this.router.navigate(['login']);
      }
    });
  }
}
