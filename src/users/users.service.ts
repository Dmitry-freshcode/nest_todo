import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>){}

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        //console.log(createUserDto);
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(createUserDto.password, salt);
        const createdUser = new this.userModel(_.assign(createUserDto, {password: hash}));
        
        return await createdUser.save();
    }

    async find(id: string): Promise<IUser> {
        return await this.userModel.findById(id).exec();
    }
    async findOne(username: string): Promise<IUser | undefined> {
        //console.log(username);
        //const user =await this.userModel.findOne({name: username}).exec();
        return await this.userModel.findOne({username: username}).exec();
      }
}