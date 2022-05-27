import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {MainComponent} from "./admin/main-admin/main.component";
import {UsersComponent} from "./admin/users/users.component";
import {ProjectsComponent} from "./admin/projects/projects.component";
import {TasksComponent} from "./admin/tasks/tasks.component";
import {MainUserComponent} from "./user/main-user/main-user.component";
import {UserTasksComponent} from "./user/main-user/user-tasks/user-tasks.component";
import {StatisticsComponent} from "./admin/statistics/statistics.component";
import {MainManagerComponent} from "./manager/main-manager/main-manager.component";
import {WorkersManagerComponent} from "./manager/workers-manager/workers-manager.component";
import {ManagerProjectsComponent} from "./manager/projects-manager/manager-projects.component";
import {TasksManagerComponent} from "./manager/tasks-manager/tasks-manager.component";
import {StatisticsManagerComponent} from "./manager/statistics-manager/statistics-manager.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin/main', component: MainComponent},
  {path: 'admin/users', component: UsersComponent},
  {path: 'admin/projects', component: ProjectsComponent},
  {path: 'admin/tasks', component: TasksComponent},
  {path: 'admin/statistics', component: StatisticsComponent},
  {path: 'user/main', component: MainUserComponent},
  {path: 'user/tasks', component: UserTasksComponent},
  {path: 'manager/main', component: MainManagerComponent},
  {path: 'manager/workers', component: WorkersManagerComponent},
  {path: 'manager/projects', component: ManagerProjectsComponent},
  {path: 'manager/tasks', component: TasksManagerComponent},
  {path: 'manager/statistics', component: StatisticsManagerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
