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

export class ExternalAuthService {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService) {
    }

    public googleConfig: ExternalAuthConfig;

    public Login(externalStsConfig: ExternalAuthConfig) {
        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
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

            this.oidcSecurityService.authorize();
        });
        this.oidcConfigService.load_using_stsServer(externalStsConfig.stsServer); // https://accounts.google.com
    }
}