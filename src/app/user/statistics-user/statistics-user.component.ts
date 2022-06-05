import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {TaskService} from "../../services/task.service";
import {NotificationService} from "../../services/notification.service";
import {ChartType, Row} from "angular-google-charts";
import ChartEditor = google.visualization.ChartEditor;
import {Task} from "../../models/Task";



@Component({
  selector: 'app-statistics-user',
  templateUrl: './statistics-user.component.html',
  styleUrls: ['./statistics-user.component.css']
})
export class StatisticsUserComponent implements OnInit {

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

  constructor(
    public tokenStorage: TokenStorageService,
    private router: Router,
    private tasksService: TaskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getDoneOnTime();
    this.getAllDoneTasksCount();
    this.getAverageTime();
    this.getBestMonth();
    this.getStatsMonths();
    this.getStatsType();
    this.getStatsStage();
    this.getClosestTask();
  }

  getDoneOnTime(): void {
    this.tasksService.getStatsOnTimeForUser().subscribe({
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
    this.tasksService.getStatsAllDoneTasks('RELEASED').subscribe({
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
    this.tasksService.getAverageTime().subscribe({
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
    this.tasksService.getStatsBestMonth().subscribe({
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
    this.tasksService.getStatsMonths().subscribe({
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
    this.tasksService.getStatsTypes().subscribe({
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
    this.tasksService.getStatsStages().subscribe({
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
    this.tasksService.getTaskClosest().subscribe({
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
