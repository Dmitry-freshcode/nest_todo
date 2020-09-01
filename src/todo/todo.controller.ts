import { Controller, Post, Body, Get, Request, Req } from '@nestjs/common';
import { TodoService } from './todo.service';

import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  //console.log('request');@Req() request: Request
  //async create(@Body() createTodoDto: CreateTodoDto) {
  async create(@Body() request: Body) {
    console.log(request);
    //await this.todoService.create(createTodoDto);
    //await this.todoService.create(request);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return await this.todoService.findAll();
  }
}
