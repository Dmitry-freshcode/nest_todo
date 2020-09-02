import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async create(createTodo: CreateTodoDto): Promise<Todo> {
    const newTodo = new this.todoModel(createTodo);
    return await newTodo.save();
  }

  async findId(id: string): Promise<Todo[]> {
    return await this.todoModel.find({ _id: id });
  }

  async findAll(query): Promise<Todo[]> {
    if (query.page>0){return await this.todoModel.find().skip(Number((query.page-1)*query.perPage)).limit(Number(query.perPage)).exec();}
    return await this.todoModel.find().exec();   
  }

  async deleteAll(): Promise<Object> {
    return await this.todoModel.remove({}).exec();
  }
  async delete(id: string): Promise<Object> {
    return await this.todoModel.deleteOne({ _id: id });
  }
  async update(id: string): Promise<Object> {
    const [{ state: oldState }] = await this.todoModel.find({ _id: id });    
    return await this.todoModel.update({ _id: id }, { state: !oldState });
  }
}
