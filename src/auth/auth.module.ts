import { Module ,NestModule , MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../users/user.repository';
import { LoggerMiddleware } from '../users/logger.middleware'
import { GoogleStrategy } from './google.strategy';
//import { TokenModule } from 'src/token/token.module';
//import { ConfigModule } from '@nestjs/config';
import {AppService} from './app.service'

@Module({
  imports: [
    AppService,
    UsersModule,
    PassportModule, 
    GoogleStrategy,   
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AppService,AuthService, JwtStrategy,LocalStrategy,GoogleStrategy,],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}