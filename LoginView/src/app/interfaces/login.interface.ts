export interface ILogin {
    username: string;
    password: string;

    tryLogin();
    showRegistrationForm(event);
}
