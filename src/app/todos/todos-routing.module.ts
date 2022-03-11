import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodosComponent } from './components/todos/todos.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: TodosComponent
      },
      {
        path: "**",
        redirectTo: "/tareas"
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule { }
