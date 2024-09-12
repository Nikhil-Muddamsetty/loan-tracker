import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Res } from 'src/utils/response';
import { ContinueWithGoogleDto, FetchAccessTokenDto } from './auth.dto';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('continue-with-google')
  continueWithGoogle(@Body() continueWithGoogleDto: ContinueWithGoogleDto) {
    try {
      return this.authService.continueWithGoogle(continueWithGoogleDto);
    } catch (error) {
      return Res.error('UHE-AUT-CWG', 'unhandled error', error);
    }
  }

  @Public()
  @Post('fetch-access-token')
  fetchAccessToken(@Body() fetchAccessTokenDto: FetchAccessTokenDto) {
    try {
      return this.authService.fetchAccessTokenAndReplaceRefreshToken(
        fetchAccessTokenDto,
      );
    } catch (error) {
      return Res.error('UHE-AUT-FAT', 'unhandled error', error);
    }
  }
}
