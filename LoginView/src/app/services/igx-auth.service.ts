import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user-model.interface.';
import { OidcSecurityService, OidcConfigService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';

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

    public googleConfig: ExternalAuthConfig;
    public facebookConfig: ExternalAuthConfig;

    public addGoogle(googleConfig: ExternalAuthConfig) {
        this.googleConfig = googleConfig;
    }

    public login(externalStsConfig: ExternalAuthConfig) {
        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
            this.configService(externalStsConfig);
            this.oidcSecurityService.authorize();
        });
        this.oidcConfigService.load_using_stsServer(externalStsConfig.stsServer);
    }

    public loginFB() {
        FB.login((response) => {
            // tslint:disable-next-line:no-debugger
            debugger;
            if (response.authResponse) {
              FB.api('/me', function(newResponse) {
                console.log('User name: ' + newResponse.name);
              });
             } else {
              console.log('User cancelled login or did not fully authorize.');
             }
              // this.router.navigate(['./redirect-facebook']);
        }, {scope: 'email'});
    }

    public getUserInfo(externalStsConfig: ExternalAuthConfig): Promise<IUser> {
        let resolve: (val: IUser) => void;
        let reject: () => void;
        const user = new Promise<IUser>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
            this.configService(externalStsConfig);
            this.oidcSecurityService.authorizedCallback();
            this.oidcSecurityService.onAuthorizationResult.subscribe(() => {
                this.oidcSecurityService.getUserData().subscribe(userData => {
                    resolve(userData as IUser);
                });
            });
        });
        this.oidcConfigService.load_using_stsServer(externalStsConfig.stsServer);
        return user;
    }

    public configService(externalStsConfig: ExternalAuthConfig) {
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = externalStsConfig.stsServer;
        openIDImplicitFlowConfiguration.redirect_url = externalStsConfig.redirect_url;
        openIDImplicitFlowConfiguration.client_id = externalStsConfig.client_id;
        openIDImplicitFlowConfiguration.response_type = externalStsConfig.response_type;
        openIDImplicitFlowConfiguration.scope = externalStsConfig.scope;
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = externalStsConfig.redirect_url;
        openIDImplicitFlowConfiguration.post_login_route = externalStsConfig.post_login_route;
        openIDImplicitFlowConfiguration.auto_userinfo = externalStsConfig.auto_userinfo;
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
            externalStsConfig.max_id_token_iat_offset_allowed_in_seconds;
        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    }
}
