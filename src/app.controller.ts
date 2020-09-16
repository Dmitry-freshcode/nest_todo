import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body, 
   
} from '@nestjs/common';
//import { JwtAuthGuard } from './auth/jwt-auth.guard';
//import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserService } from './users/users.service';


import {SubscribeMessage, MessageBody, WebSocketGateway} from '@nestjs/websockets'



@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  async sayHello() {
    return "Server available";  }

  


}
