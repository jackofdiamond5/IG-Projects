import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user-model.interface.';
import { OidcSecurityService, OidcConfigService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import { AuthenticationService } from './authentication.service';
import { GoogleProvider } from '../providers/google-provider';
import { FacebookProvider } from '../providers/facebook-provider';
import { IAuthProvider } from '../providers/IAuthProvider';

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

    activeProvider: ExternalAuthProvider;
    protected providers: Map<ExternalAuthProvider, IAuthProvider> = new Map();

    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService) {
    }


    public has(provider: ExternalAuthProvider) {
      return this.providers.has(provider);
    }

    public addGoogle(googleConfig: ExternalAuthConfig) {
        this.providers.set(
          ExternalAuthProvider.Google,
          new GoogleProvider(this.oidcConfigService, this.oidcSecurityService, googleConfig)
        );
    }

    public addFacebook(fbConfig: ExternalAuthConfig) {
      this.providers.set(
        ExternalAuthProvider.Facebook,
        new FacebookProvider(fbConfig)
      );
    }

    public login(provider: ExternalAuthProvider) {
        const extProvider = this.providers.get(provider);
        if (extProvider) {
          extProvider.login();
        }
    }

    /**
     * TODO setActiveProvider
     */
    public setActiveProvider(provider: ExternalAuthProvider) {
      this.activeProvider = provider;
    }


    /** TODO, use setActiveProvider only? */
    public getUserInfo(provider: ExternalAuthProvider): Promise<IUser> {
        const extProvider = this.providers.get(provider);
        if (extProvider) {
          return extProvider.getUserInfo();
        }
        return Promise.reject(null); // TODO ?
    }

    /**
     * logout
     */
    public logout() {
      this.providers.get(this.activeProvider).logout();
    }
}
