import { Component, OnInit } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { AuthService } from '../../../auth/services/auth.service';
import { LoggedUser } from 'src/app/auth/interfaces/AuthInterfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todos-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  text: string = '';
  user: string = '';

  constructor(
    private todoService: TodosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedUser().userName;
  }

  changeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  addTodo(): void {
    this.todoService.addTodo(this.text);
    this.text = '';
  }
  logout(){
    localStorage.removeItem("TOKEN");
    this.router.navigate(["/auth/login"]);
  }
}
