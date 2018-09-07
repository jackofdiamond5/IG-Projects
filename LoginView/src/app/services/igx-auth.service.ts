import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user-model.interface.';
import { OidcSecurityService, OidcConfigService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import { AuthenticationService } from './authentication.service';
import { GoogleProvider } from '../providers/google-provider';
import { FacebookProvider } from '../providers/facebook-provider';

export enum ExternalAuthProvider {
    Facebook = 'Facebook',
    Google = 'Google',
    Twitter = 'Twitter',
    Microsoft = 'Microsoft'
}

export interface ExternalAuthConfig {
    stsServer: string;
    client_id: string;
    scope: string;
    provider: ExternalAuthProvider;
    redirect_url: string;
    response_type: string;
    post_logout_redirect_uri: string;
    post_login_route: string;
    auto_userinfo: boolean;
    max_id_token_iat_offset_allowed_in_seconds: number;
}

@Injectable({
    providedIn: 'root'
})
export class ExternalAuthService {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService) {
    }

    private googleProvider: GoogleProvider;
    private facebookProvider: FacebookProvider;

    public facebookConfig: ExternalAuthConfig;

    public addGoogle(googleConfig: ExternalAuthConfig) {
        this.googleProvider = new GoogleProvider(this.oidcConfigService, this.oidcSecurityService, googleConfig);
    }

    public login() {
        this.googleProvider.login();
    }

    public loginFB() {
        // const self = this;
        // FB.login((response) => {
        //     if (response.authResponse) {
        //         FB.api(
        //             '/me?fields=id,email,name,first_name,last_name,picture',
        //             function (newResponse) {

        //             });
        //     } else {
        //         console.log('User cancelled login or did not fully authorize.');
        //     }
        //     // this.router.navigate(['./redirect-facebook']);
        // }, { scope: 'public_profile' });
    }

    public getUserInfo(externalAuthProvider: ExternalAuthProvider): Promise<IUser> {
        return this.googleProvider.getUserInfo();
    }
}
