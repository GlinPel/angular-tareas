export interface LoggedUser {
    id: number;
    email: string;
    userName: string;
    token: string;
}
  
export interface formLoginUser {
    email: string;
    password: string;
}

export interface formRegisterUser {
    email: string;
    password: string;
    userName: string;
}