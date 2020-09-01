import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async create(createTodo: CreateTodoDto): Promise<Todo> {
    const newTodo = new this.todoModel(createTodo);
    return await newTodo.save();
  }

  async findId(id: string): Promise<any> {
    return await this.todoModel.find({ _id: id });
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoModel.find().exec();
  }

  async deleteAll(): Promise<any> {
    return await this.todoModel.remove({}).exec();
  }
  async delete(id: string): Promise<any> {
    return await this.todoModel.deleteOne({ _id: id });
  }
  async update(id: string) {
    const [{ state: oldState }] = await this.todoModel.find({ _id: id });
    //return oldState;
    return await this.todoModel.update({ _id: id }, { state: !oldState });
  }
}
