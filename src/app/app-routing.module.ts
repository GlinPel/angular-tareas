import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ErrorPageComponent } from './shared/error-page/error-page.component';


const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: "tareas",
    loadChildren: () => import("./todos/todos.module").then(m => m.TodosModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: "tareas"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
