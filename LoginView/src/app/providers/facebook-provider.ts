
export class FacebookProvider {
    constructor() { }

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

    public getUserInfo() {

    }

    public logout() {

    }
}
