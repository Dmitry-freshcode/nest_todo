import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(  
    private userDB:UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object> { 
    try{
      const isExist = await this.userDB.findUser({ username: createUserDto.username });           
      if (!isExist){        
          const saltRounds = 10;
          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(createUserDto.password, salt);   
          const createdUser = _.assign(createUserDto, { password: hash });          
          this.userDB.create(createdUser);
          return {statusCode: 201, message: "user created"};
      }else{
        throw new UnauthorizedException({status:'user is Exist'}); 
        //return {status: 'userIsExist'};
      }
    }   catch{      
      throw new HttpException('user is Exist', HttpStatus.BAD_REQUEST);
    }    
  }

  // async find(id: string): Promise<object> {
  //   try{
  //     const result =await this.userModel.findById(id).exec();
  //     if (result){
  //       return {status: 'user find'}} 
  //   } catch {
  //     throw new HttpException('BAD_REQUEST : users.find', HttpStatus.BAD_REQUEST);
  //   }    
  // }

  async findOne(username: string): Promise<IUser | undefined> {   
    try{    
      return this.userDB.findUser({ username: username });
    } catch{
      throw new HttpException('BAD_REQUEST : users.findOne', HttpStatus.BAD_REQUEST);
    }    
  }

  async getProfile(username: string): Promise<Object | undefined>{
    const user = await this.findOne(username);
    return {
      username: user.username,
      _id:user._id
    }
  }


}
