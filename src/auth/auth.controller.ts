import { Controller , UseGuards, Post,Body} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,       
      ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body) {    
    return this.authService.login(body);
  }
  

}
