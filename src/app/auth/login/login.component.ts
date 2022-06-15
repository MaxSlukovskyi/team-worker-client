import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loading = false;
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    if(this.tokenStorage.getUser()) {
      if(this.tokenStorage.getRole() === 'ROLE_ADMIN') {
        this.router.navigate(['admin/main']);
      } else if(this.tokenStorage.getRole() === 'ROLE_MANAGER') {
        this.router.navigate(['manager/main'])
      } else {
        this.router.navigate(['user/main']);
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(data => {

      this.tokenStorage.saveToken(data.token);

      this.userService.getUserByUsername(data.username).subscribe({
        next: (res) => {
          this.tokenStorage.saveUser(res);
          this.notificationService.showSnackBar('Вітаємо, ' + this.tokenStorage.getUser().name);

          for(var i = 0; i < this.tokenStorage.getUser().roles.length; i++) {
            if(this.tokenStorage.getUser().roles[i].name === 'ROLE_ADMIN'||this.tokenStorage.getUser().roles[i].name === 'ROLE_MANAGER') {
              this.tokenStorage.setRole(this.tokenStorage.getUser().roles[i]);
              location.reload();
              break;
            }
            this.tokenStorage.setRole(this.tokenStorage.getUser().roles[i]);
            console.log(this.tokenStorage.getRole());
            location.reload();
          }
        }
      });
    }, error => {
      console.log(error);
      if(error.status === 0) {
        this.notificationService.showSnackBar('Відстуній зв`язок з сервером, спробуйте пізніше');
      } else {
        this.notificationService.showSnackBar(error.error.message);
      }
      this.tokenStorage.logOut();
    });
  }
}
