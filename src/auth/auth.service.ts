import { Injectable } from '@nestjs/common';
import { Res, Response } from 'src/utils/response';
import { ContinueWithGoogleDto, FetchAccessTokenDto } from './auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AccessTokenPayload,
  GooglePayload,
  RefreshTokenPayload,
} from './auth.type';
import { EmailForCommunication, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private client = new OAuth2Client();

  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async continueWithGoogle(
    continueWithGoogleDto: ContinueWithGoogleDto,
  ): Promise<Response> {
    try {
      let ticket = null;
      try {
        ticket = await this.client.verifyIdToken({
          idToken: continueWithGoogleDto.googleToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
      } catch (error) {
        if (error?.message?.startsWith('Token used too late')) {
          return Res.error('AUT-CWG-1', 'Token used too late');
        }
        return Res.error('AUT-CWG-2', 'Invalid token');
      }
      const googlePayload: GooglePayload = ticket.getPayload();

      const findOrCreateByGoogleUserIdResponse =
        await this.findOrCreateByGoogleUserId(googlePayload);

      const createNewSessionResponse =
        await this.createNewSessionWithRefreshToken(
          findOrCreateByGoogleUserIdResponse.data,
        );

      if (createNewSessionResponse.success === false) {
        return createNewSessionResponse;
      }

      return Res.success(
        'Successfully loged in',
        createNewSessionResponse.data,
      );
    } catch (error) {
      console.log(error);
      return Res.error('UHE-AUS-CWG', 'unhandled error', error);
    }
  }

  async findOrCreateByGoogleUserId(
    googlePayload: GooglePayload,
  ): Promise<Response> {
    try {
      const user = await this.prisma.auth.findFirst({
        where: { google_user_id: googlePayload.sub },
      });

      if (user) {
        return Res.success('User found', user);
      }

      const createAuthPayloadResponse = await this.createAuthPayload(
        EmailForCommunication.GOOGLE,
        null,
        googlePayload?.sub,
        googlePayload?.email,
      );

      if (createAuthPayloadResponse.success === false) {
        return createAuthPayloadResponse;
      }

      const auth = createAuthPayloadResponse.data;

      const createUserUsingGooglePayloadResponse =
        await this.userService.createUserUsingGooglePayload(
          googlePayload,
          auth,
        );

      if (createUserUsingGooglePayloadResponse.success === false) {
        return createUserUsingGooglePayloadResponse;
      }

      return Res.success(
        'User created',
        createUserUsingGooglePayloadResponse.data,
      );
    } catch (error) {
      return Res.error('UHE-US-FBOGUI', 'unhandled error', error);
    }
  }

  async createAuthPayload(
    email: EmailForCommunication,
    custom_email_id: string,
    google_user_id: string,
    google_email_id: string,
  ): Promise<Response> {
    try {
      const auth = {
        email,
        custom_email_id,
        google_user_id,
        google_email_id,
      };
      return Res.success('Auth payload generated', auth);
    } catch (error) {
      return Res.error('UHE-AUS-CAP', 'unhandled error', error);
    }
  }

  async createNewSessionWithRefreshToken(user: User): Promise<Response> {
    try {
      const jti = uuidv4();
      const epochNow = Date.now() / 1000;
      const timeToLive = 365 * 24 * 60 * 60; // 1 year
      const expiresIn = epochNow + timeToLive;
      const payload: RefreshTokenPayload = {
        sub: user.id.toString(),
        iat: epochNow,
        exp: expiresIn,
        jti,
      };
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {});
      return Res.success('Session created and refresh token generated', {
        refreshToken,
      });
    } catch (error) {
      console.log(error);
      return Res.error('UHE-AUS-CNS', 'unhandled error', error);
    }
  }

  async createNewAccessToken(user: User): Promise<Response> {
    try {
      const jti = uuidv4();
      const epochNow = Date.now() / 1000;
      const timeToLive = 30 * 24 * 60 * 60; // 30 days
      const expiresIn = epochNow + timeToLive;
      const accessTokenPayload: AccessTokenPayload = {
        iss: process?.env?.JWT_ISSUER,
        aud: 'aud',
        sub: user.id.toString(),
        picture: 'string',
        first_name: user.first_name,
        last_name: user.last_name,
        iat: epochNow,
        exp: expiresIn,
        jti,
      };
      const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.JWT_SECRET,
        {},
      );
      return Res.success('access token created', { accessToken });
    } catch (error) {
      console.log(error);
      return Res.error('UHE-AUS-CNAT', 'unhandled error', error);
    }
  }

  async fetchAccessTokenAndReplaceRefreshToken(
    fetchAccessTokenDto: FetchAccessTokenDto,
  ) {
    try {
      const refreshTokenPayload = jwt.verify(
        fetchAccessTokenDto.refreshToken,
        process.env.JWT_SECRET,
      ) as RefreshTokenPayload;

      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(refreshTokenPayload.sub) },
      });

      if (!user) {
        return Res.error('AUS-FATARRT-1', 'User not found');
      }

      const newAccessTokenResponse = await this.createNewAccessToken(user);

      if (newAccessTokenResponse.success === false) {
        return newAccessTokenResponse;
      }

      const newSessionResponse =
        await this.createNewSessionWithRefreshToken(user);

      if (newSessionResponse.success === false) {
        return newSessionResponse;
      }

      return Res.success('Access token fetched and refresh token replaced', {
        ...newAccessTokenResponse.data,
        ...newSessionResponse.data,
      });
    } catch (error) {
      console.log(error);
      return Res.error('UHE-AUS-FATARRT', 'unhandled error', error);
    }
  }
}
