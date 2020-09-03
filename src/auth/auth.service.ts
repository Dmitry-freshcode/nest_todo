import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
//import { TokenService } from 'src/token/token.service';
//import { CreateUserDto } from '../users/dto/create-user.dto';
//import { SignOptions } from 'jsonwebtoken';
//import { CreateUserTokenDto } from 'src/token/dto/create-user-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private usersService: UserService,
        //private readonly tokenService: TokenService,
    ) { }
    async validateUser(username: string, pass: string): Promise<any> {
      
        const user = await this.usersService.findOne(username);        
        const compare = bcrypt.compare(pass, user.password);        
        return compare && user;
        
      }
      async login(user: any) {        
        //console.log(user);
        const payload = { username: user.username };
        return {
          access_token: this.jwtService.sign(payload, {secret : process.env.JWT_SECRET
          }),
        };
      }
}