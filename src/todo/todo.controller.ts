import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch, 
  Query,
  UseGuards
} from '@nestjs/common';
import { TodoService } from './todo.service';

import { CreateTodoDto } from './dto/creat-todo.dto';



import { JwtAuthGuard } from '../auth/jwt-auth.guard';

//import { AuthService } from './auth/auth.service';
//import { Todo } from './schemas/todo.schemas';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}  
  @UseGuards(JwtAuthGuard)
  @Post('/todo')
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.create(createTodoDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/todo')
  async findAll(@Body() body, @Query() query ){

    if (body._id) {
      return await this.todoService.findId(body._id);
    } else {     
      if (query) {
        return await this.todoService.findAll(query);
      }else{
        return await this.todoService.findAll({});
      }      
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/todo')
  async delete(@Body() body) {
    if (body._id) {
      return await this.todoService.delete(body._id);
    } else {
      return await this.todoService.deleteAll();
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/todo')
  async update(@Body() body) {
    return await this.todoService.update(body._id);
  }
}
