import { IsNotEmpty, IsString } from 'class-validator';

export class ContinueWithGoogleDto {
  @IsString()
  @IsNotEmpty()
  googleToken: string;
}

export class FetchAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
