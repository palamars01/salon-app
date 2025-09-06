import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import { GoogleUser } from '@repo/shared/interfaces/auth';

import googleAuthConfig from '@/common/config/googleAuth/google.auth.config';

@Injectable()
export class GoogleService {
  constructor(
    @Inject(googleAuthConfig.KEY)
    private googleAuthCfg: ConfigType<typeof googleAuthConfig>,
  ) {}
  private getAuthClient(): OAuth2Client {
    const authClient = new OAuth2Client(
      this.googleAuthCfg.GOOGLE_CLIENT_ID,
      this.googleAuthCfg.GOOGLE_CLIENT_SECRET,
      this.googleAuthCfg.GOOGLE_CALLBACK_URL,
    );

    return authClient;
  }
  private getAuthUrl(authClient: OAuth2Client): { url: string } {
    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = authClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      prompt: 'consent',

      include_granted_scopes: true,
    });

    return { url: authorizeUrl };
  }

  async getOAuth2ClientUrl(): Promise<{ url: string }> {
    const authClient = this.getAuthClient();

    return this.getAuthUrl(authClient);
  }

  async getAuthClientData(code: string): Promise<GoogleUser> {
    const authClient = this.getAuthClient();
    const tokenData = await authClient.getToken(code);
    const tokens = tokenData.tokens;
    const refreshToken = tokens?.refresh_token || '';
    const accessToken = tokens?.access_token || '';

    authClient.setCredentials(tokens);

    const googleAuth = google.oauth2({
      version: 'v2', //Check v
      auth: authClient,
    } as any);

    const googleUserInfo = await googleAuth.userinfo.get();

    const email = googleUserInfo.data.email!;
    const fName = googleUserInfo.data.given_name;
    const lName = googleUserInfo.data.family_name;
    return { email, fName, lName, refreshToken, accessToken };
  }
}
