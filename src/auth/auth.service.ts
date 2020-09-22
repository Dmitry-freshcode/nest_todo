import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { UserRepository } from 'src/users/user.repository';
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
        if(user) {
          const compare = await bcrypt.compare(pass, user.password); 
          return compare && user;
        }                
        return false;
        
      }
      async login(data:LoginUserDto):Promise<object> {    
        const isExist =  await this.validateUser(data.username,data.password);
        const user = await this.usersService.findOne(data.username)        
        const payload = { username: data.username };
            return {
              access_token: this.jwtService.sign(payload, {secret : process.env.JWT_SECRET}),
              username: user.username,
              _id: user._id,
            };             
      }
    

}