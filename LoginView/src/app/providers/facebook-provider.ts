import { IAuthProvider } from './IAuthProvider';
import { IUser } from '../interfaces/user-model.interface.';
import { ExternalAuthConfig } from '../services/igx-auth.service';

export class FacebookProvider implements IAuthProvider {

    constructor(private externalStsConfig: ExternalAuthConfig) { }

    public config() {

    }

    public login() {
        const self = this;
        FB.login((response) => {
            if (response.authResponse) {
                FB.api(
                    '/me?fields=id,email,name,first_name,last_name,picture',
                    function (newResponse) {

                    });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
            // this.router.navigate(['./redirect-facebook']);
        }, { scope: 'public_profile' });
    }

    getUserInfo(): Promise<IUser> {
      throw new Error('Method not implemented.');
    }

    public logout() {

    }
}
