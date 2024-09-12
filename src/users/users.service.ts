import { Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { GooglePayload } from 'src/auth/auth.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { Res, Response } from 'src/utils/response';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUserUsingGooglePayload(
    googlePayload: GooglePayload,
    authPayload: Auth,
  ): Promise<Response> {
    try {
      const generateUserPayloadResponse = await this.generateUserPayload(
        googlePayload.given_name,
        googlePayload.family_name,
      );

      if (generateUserPayloadResponse.success === false) {
        return generateUserPayloadResponse;
      }
      const userObject = generateUserPayloadResponse.data;
      const user = await this.prisma.user.create({
        data: {
          ...userObject,
          auth: { create: { ...authPayload } },
        },
      });
      return Res.success('User created', user);
    } catch (error) {
      return Res.error('UHE-US-CUGI', 'unhandled error', error);
    }
  }

  async generateUserPayload(
    first_name: string = '',
    last_name: string = '',
  ): Promise<Response> {
    try {
      const user = {
        first_name,
        last_name,
      };
      return Res.success('User payload generated', user);
    } catch (error) {
      return Res.error('UHE-US-GUP', 'unhandled error', error);
    }
  }
}
