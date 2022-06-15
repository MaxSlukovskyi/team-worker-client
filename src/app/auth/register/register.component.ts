import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public regForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder
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
    this.regForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    this.loading = true;
    this.authService.registration( this.regForm.value).subscribe(() => {
      this.notificationService.showSnackBar('Успішна реєстрація!');
      this.router.navigate(['/login']);
    }, error => {
      console.log(error);
      if(error.status === 400) {
        this.notificationService.showSnackBar('Цей логін вже зайнятий, спробуйте інший');
      } else {
        this.notificationService.showSnackBar('Сталася помилка, спробуйте пізніше');
      }
    });
  }

}
