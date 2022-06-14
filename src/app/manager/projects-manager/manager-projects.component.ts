import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../models/Project";
import {MatTableDataSource} from "@angular/material/table";
import {EditProjectComponent} from "../../admin/projects/edit-project/edit-project.component";
import {
  AddPositionToProjectComponent
} from "../../admin/projects/add-position-to-project/add-position-to-project.component";
import {
  DeletePositionFromProjectComponent
} from "../../admin/projects/delete-position-from-project/delete-position-from-project.component";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import {ProjectService} from "../../services/project.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {
  AddWorkerToProjectByManagerComponent
} from "../workers-manager/add-worker-to-project-by-manager/add-worker-to-project-by-manager.component";
import {
  DeletePositionFromManagerProjectComponent
} from "./delete-position-from-manager-project/delete-position-from-manager-project.component";
import {
  AddPositionToManagerProjectComponent
} from "./add-position-to-manager-project/add-position-to-manager-project.component";
import {EditProjectByManagerComponent} from "./edit-project-by-manager/edit-project-by-manager.component";
import {Task} from "../../models/Task";

@Component({
  selector: 'app-projects-manager',
  templateUrl: './manager-projects.component.html',
  styleUrls: ['./manager-projects.component.css']
})
export class ManagerProjectsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'createTime','projectStage','projectType','manager','positions', 'action'];
  displayedColumnsForReport: string[] = ['name', 'createTime','projectStage','projectType','positions'];
  dataSource: MatTableDataSource<Project>;
  projects: Project[];

  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('date') dateText: ElementRef;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/main']);
    }
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.projectService.getAllByAuthManager().subscribe({
      next: (data) => {
        this.projects = <Project[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Project>(this.projects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      }, error: (error) => {
        console.log(error);
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  editProject(row: any) {
    this.dialog.open(EditProjectByManagerComponent,{
      data: row
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addPositionToProject(): void {
    this.dialog.open(AddPositionToManagerProjectComponent);
  }

  deletePositionFromProject(): void {
    this.dialog.open(DeletePositionFromManagerProjectComponent);
  }

  public downloadAsPDF(): void {
    const user = this.tokenStorage.getUser();
    const date = new Date().toLocaleString();
    this.dateText.nativeElement.innerHTML = '<p>Дата видачі звіту: '+date+',<br>' +
      'Створив: ' + user.name + ' ' + user.surname + '</p>';

    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = {
      content: html
    };
    pdfMake.createPdf(documentDefinition).open();
  }

}
