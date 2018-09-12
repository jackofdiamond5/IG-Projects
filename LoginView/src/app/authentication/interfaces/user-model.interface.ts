export interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    picture: string;
    token: string;
    externalToken?: string;
}
