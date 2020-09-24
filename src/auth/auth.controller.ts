import { Controller , UseGuards, Post,Body, Get,Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {GoogleAuthGuard} from './google-auth.guard'



@Controller('auth')

export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly appService: AppService       
      ) {}

  
  @UseGuards(LocalAuthGuard)  
  @Post('login')
  async login(@Body() body) {
    //console.log(body)
    //return {status:"login"};
    return this.authService.login(body);
  }

  @Post('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    console.log(req);
    return this.appService.googleLogin(req);
  }

  @Post('succsess')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    console.log(req);
    return this.appService.googleLogin(req)
  }
  
}
