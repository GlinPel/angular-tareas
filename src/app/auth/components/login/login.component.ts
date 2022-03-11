import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formLoginUser, LoggedUser } from '../../interfaces/AuthInterfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  errorLogin: boolean = false;
  errorCamposVacios: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  private login(user: formLoginUser){
    this.errorLogin = false;
    this.errorCamposVacios = false;
    if(user.email === "" || user.password === ""){
      this.errorCamposVacios = true;
      return;
    }
    this.authService.login(user)
      .subscribe( (resp: LoggedUser) => {
        this.authService.setLoggedUser(resp);
        this.router.navigate(["/tareas"])
      }, error => {
        this.errorLogin = true;
        console.log(this.errorLogin);
      }
    )
  }

  submitLogin(loginForm: formLoginUser){
    this.login(loginForm);
  }
}
