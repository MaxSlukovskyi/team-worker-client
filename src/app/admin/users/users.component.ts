import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../models/User";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../../services/user.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EditUserComponent} from "./edit-user/edit-user.component";
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import {AddUserToProjectComponent} from "./add-user-to-project/add-user-to-project.component";
import {DeletePositionByUserComponent} from "./delete-position-by-user/delete-position-by-user.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'surname','username','position','role','action'];
  displayedColumnsForReport: string[] = ['name', 'surname','username','position'];
  dataSource: MatTableDataSource<User>;
  users: User[];

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
    if(this.tokenStorage.getRole() === 'ROLE_MANAGER') {
      this.router.navigate(['manager/users'])
    } else if(this.tokenStorage.getRole() === 'ROLE_USER') {
      this.router.navigate(['user/main']);
    }
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  removePositionFromUser() {
    this.dialog.open(DeletePositionByUserComponent);
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getAllUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = <User[]>JSON.parse(JSON.stringify(data));
        this.dataSource = new MatTableDataSource<User>(this.users);
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

  addUserToProject() {
    this.dialog.open(AddUserToProjectComponent);
  }

  editUser(row: any) {
    this.dialog.open(EditUserComponent,{
      data: row
    });
  }

  deleteUser(row: any) {
    this.userService.delete(row.id).subscribe({
      next: (data) => {
        this.notificationService.showSnackBar("Користувача успішно видалено");
        location.reload();
      },
      error: (error) => {
        if (error.status === 400) {
          this.notificationService.showSnackBar('Неможливо видалити самого себе');
        } else {
          this.notificationService.showSnackBar('Сталася помилка');
        }
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
