export interface ILogin {
    username: string;
    password: string;

    tryLogIn();
    showRegistrationForm();
}
