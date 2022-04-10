import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {MainComponent} from "./admin/main-admin/main.component";
import {UsersComponent} from "./admin/users/users.component";
import {ProjectsComponent} from "./admin/projects/projects.component";
import {TasksComponent} from "./admin/tasks/tasks.component";
import {MainUserComponent} from "./main-user/main-user.component";
import {UserTasksComponent} from "./main-user/user-tasks/user-tasks.component";
import {StatisticsComponent} from "./admin/statistics/statistics.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin/main', component: MainComponent},
  {path: 'admin/users', component: UsersComponent},
  {path: 'admin/projects', component: ProjectsComponent},
  {path: 'admin/tasks', component: TasksComponent},
  {path: 'admin/statistics', component: StatisticsComponent},
  {path: 'user/main', component: MainUserComponent},
  {path: 'user/tasks', component: UserTasksComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
