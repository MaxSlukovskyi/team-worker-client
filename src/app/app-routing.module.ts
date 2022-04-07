import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {MainComponent} from "./admin/main-admin/main.component";
import {UsersComponent} from "./admin/users/users.component";
import {ProjectsComponent} from "./admin/projects/projects.component";
import {TasksComponent} from "./admin/tasks/tasks.component";
import {MainUserComponent} from "./main-user/main-user.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component: MainComponent},
  {path: 'users', component: UsersComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'tasks', component: TasksComponent},
  {path: 'main-user', component: MainUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
