import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> { 
    try{
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(createUserDto.password, salt);    
      const createdUser = new this.userModel(
        _.assign(createUserDto, { password: hash }),
      );     
  
      return await createdUser.save();
    }   catch{
      throw new HttpException('BAD_REQUEST : users.create', HttpStatus.BAD_REQUEST);
    }    
  }

  async find(id: string): Promise<IUser> {
    try{
      return await this.userModel.findById(id).exec();
    } catch {
      throw new HttpException('BAD_REQUEST : users.find', HttpStatus.BAD_REQUEST);
    }    
  }

  async findOne(username: string): Promise<IUser | undefined> {   
    try{
      return await this.userModel.findOne({ username: username }).exec();
    } catch{
      throw new HttpException('BAD_REQUEST : users.findOne', HttpStatus.BAD_REQUEST);
    }    
  }
}
