import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from './schemas/todo.schemas';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import {ReloadGateway} from '../socket/reload.gateway'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }])],
  providers: [TodoService,ReloadGateway],
  controllers: [TodoController],
})
export class TodoModule {}
