import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Project} from "../../models/Project";
import {ProjectService} from "../../services/project.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {EditProjectComponent} from "./edit-project/edit-project.component";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import {AddUserToProjectComponent} from "../users/add-user-to-project/add-user-to-project.component";
import {AddPositionToProjectComponent} from "./add-position-to-project/add-position-to-project.component";
import {DeletePositionFromProjectComponent} from "./delete-position-from-project/delete-position-from-project.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'createTime','projectStage','projectType','manager','positions', 'action'];
  displayedColumnsForReport: string[] = ['name', 'createTime','projectStage','projectType','positions'];
  dataSource: MatTableDataSource<Project>;
  projects: Project[];

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
    if(this.tokenStorage.getRole() === 'ROLE_MANAGER') {
      this.router.navigate(['manager/projects'])
    } else if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/main']);
    }
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = <Project[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Project>(this.projects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error: (error) => {
        console.log(error);
        this.notificationService.showSnackBar("На жаль сталася помилка :(");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  editProject(row: any) {
    this.dialog.open(EditProjectComponent,{
      data: row
    });
  }

  addProject() {
    this.dialog.open(EditProjectComponent);
  }

  deleteProject(row: any) {
    this.projectService.delete(row.id).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar("Проект успішно видалено");
        location.reload();
      },
      error: (error) => {
        this.notificationService.showSnackBar("Сталася помилка, спробуйте пізніше");
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditProjectComponent);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addPositionToProject(): void {
    this.dialog.open(AddPositionToProjectComponent);
  }

  deletePositionFromProject(): void {
    this.dialog.open(DeletePositionFromProjectComponent);
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
