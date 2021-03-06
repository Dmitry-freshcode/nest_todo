import {
  Controller,
  Body,
  UseGuards,
  Request,
  Get,
  Post,  
} from '@nestjs/common';
import { UserService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor( 
    private userService: UserService,
  ) {}

  @Post('add')
  async addUser(@Body() body) {    
    return this.userService.create(body);
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {    
    return this.userService.getProfile(req.user.username);
  }
}
