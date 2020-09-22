import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from './schemas/todo.schemas';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import {ReloadGateway} from '../socket/reload.gateway'
import { TodoRepository } from './todo.reposiory';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }])],
  providers: [TodoService,ReloadGateway,TodoRepository],
  controllers: [TodoController],
})
export class TodoModule {}
