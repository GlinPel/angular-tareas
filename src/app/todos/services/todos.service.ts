import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TodosService {
  private url: string = environment.apiUrl;
  todos$ = new BehaviorSubject<TodoInterface[]>([]);
  filter$ = new BehaviorSubject<FilterEnum>(FilterEnum.all)

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.setAllUserTodos();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('TOKEN');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  getTodos(): Observable<any>{
    const formData = new FormData();
    const user_id = this.authService.getLoggedUser().id.toString();
    formData.append('user_id', user_id);
    return this.httpClient.post<TodoInterface[]>(`${this.url}/user/tasks`, formData, {headers: this.getAuthHeaders()});
  }

  setAllUserTodos(): void {
    this.getTodos().subscribe(
      (response) => {
        response.map( (element: any) => {
          const newTodo: TodoInterface = {
            text: element.title,
            isCompleted: element.state,
            id: element.id
          };
          const updatedTodos = [...this.todos$.getValue(), newTodo];
          this.todos$.next(updatedTodos);
        })
      },
      (error) => console.log(error)
    );
  }

  addTodo(text: string){
    const formData = new FormData();
    const user_id = this.authService.getLoggedUser().id.toString();
    formData.append('user_id', user_id);
    formData.append('task_title', text);
    this.httpClient.post<any>(`${this.url}/user/newTask`, formData, {headers: this.getAuthHeaders()}).subscribe(
      (response) => {
        const newTodo: TodoInterface = {
          text: response.title,
          isCompleted: response.state,
          id: response.id
        };
        const updatedTodos = [...this.todos$.getValue(), newTodo];
        this.todos$.next(updatedTodos);
      },
      (error) => console.log(error)
    );
  }

  changeFilter(filterName: FilterEnum): void {
    this.filter$.next(filterName);
  }

  changeTodo(id: string, text: string): void {
    const updatedTodos = this.todos$.getValue().map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text,
        };
      }
      return todo;
    });
    const formData = new FormData();
    formData.append('task_id', id);
    formData.append('task_title', text);
    this.httpClient.post<any>(`${this.url}/user/editTask/title`, formData, {headers: this.getAuthHeaders()}).subscribe(
      (response) => {
        this.todos$.next(updatedTodos);
      },
      (error) => console.log(error)
    );
  }
  
  removeTodo(id: string): void {
    const updatedTodos = this.todos$
      .getValue()
      .filter((todo) => todo.id !== id);
    const formData = new FormData();
    formData.append('task_id', id);
    this.httpClient.post<any>(`${this.url}/user/deleteTask`, formData, {headers: this.getAuthHeaders()}).subscribe(
      (response) => {
        this.todos$.next(updatedTodos);
      },
      (error) => console.log(error)
    );
  }

  toggleTodo(id: string): void {
    let isCompleted: boolean;
    const updatedTodos = this.todos$.getValue().map((todo) => {
      if (todo.id === id) {
        isCompleted = !todo.isCompleted;
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });
    const formData = new FormData();
    formData.append('task_id', id);
    formData.append('task_state', isCompleted.toString());
    this.httpClient.post<any>(`${this.url}/user/editTask/status`, formData, {headers: this.getAuthHeaders()}).subscribe(
      (response) => {
        this.todos$.next(updatedTodos);
      },
      (error) => console.log(error)
    );
  }
}
