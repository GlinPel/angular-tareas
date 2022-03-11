import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  errorCamposVacios: boolean = false;
  errorCoincidencia: boolean = false;
  errorEmail: boolean = false;
  errorExiste: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  private validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  private register(registerForm){
    this.errorCamposVacios = false;
    if(registerForm.email === "" || registerForm.password === "" || registerForm.userName === "" || registerForm.password2 === "" ){
      this.errorCamposVacios = true;
      return;
    }
    if(!this.validateEmail(registerForm.email)){
      this.errorEmail = true;
      return;
    }
    if(registerForm.password !== registerForm.password2 ){
      this.errorCoincidencia = true;
      return;
    }
    const user = {
      "email": registerForm.email,
      "password": registerForm.password,
      "userName": registerForm.userName
    }

    this.authService.register(user)
      .subscribe( resp => {
        this.authService.setLoggedUser(resp);
        this.router.navigate(["/tareas"])
      }, error => {
        this.errorExiste = true;
      }
    )
  }

  submitRegister(registerForm){
    this.register(registerForm);
  }
}
