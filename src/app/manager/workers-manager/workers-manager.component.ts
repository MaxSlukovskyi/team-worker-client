import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../models/User";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {
  DeletePositionByUserComponent
} from "../../admin/users/delete-position-by-user/delete-position-by-user.component";
import {EditUserComponent} from "../../admin/users/edit-user/edit-user.component";
import {AddUserToProjectComponent} from "../../admin/users/add-user-to-project/add-user-to-project.component";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import {DeletePositionByManagerComponent} from "./delete-position-by-manager/delete-position-by-manager.component";
import {
  AddWorkerToProjectByManagerComponent
} from "./add-worker-to-project-by-manager/add-worker-to-project-by-manager.component";


@Component({
  selector: 'app-workers-manager',
  templateUrl: './workers-manager.component.html',
  styleUrls: ['./workers-manager.component.css']
})
export class WorkersManagerComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'surname','username','position','role'];
  displayedColumnsForReport: string[] = ['name', 'surname','username','position'];
  dataSource: MatTableDataSource<User>;
  allUsers: User[];
  projectsUsers: User[];
  allUsersChecked: boolean;

  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('date') dateText: ElementRef;

  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/main']);
    }
  }

  ngOnInit(): void {
    this.getProjectUsers();
    this.getAllUsers();
  }

  onToggleChange(): void {
      if(this.allUsersChecked) {
        this.dataSource = new MatTableDataSource<User>(this.projectsUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource<User>(this.allUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
  }

  addUserToProject() {
    this.dialog.open(AddWorkerToProjectByManagerComponent);
  }

  removePositionFromUser() {
    this.dialog.open(DeletePositionByManagerComponent);
  }

  getAllUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.allUsers = <User[]>JSON.parse(JSON.stringify(data));
      }, error: (error) => {
        console.log(error);
        this.notificationService.showSnackBar("На жаль сталася помилка при завантаженні всіх користувачів");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  getProjectUsers(): void {
    this.userService.getAllByAuthManager().subscribe({
      next: (data) => {
        this.projectsUsers = <User[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<User>(this.projectsUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      }, error: (error) => {
        this.notificationService.showSnackBar("На жаль сталася помилка при завантаженні користувачів з ваших проектів");
        this.tokenStorage.logOut();
        this.router.navigate(['login']);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
      content: html
    };
    pdfMake.createPdf(documentDefinition).open();
  }
}
