import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async create(createTodo: CreateTodoDto): Promise<Todo> {
    try{      
      const newTodo = new this.todoModel(createTodo);
    return await newTodo.save();
    }catch{
      throw new HttpException('BAD_REQUEST : todo.create', HttpStatus.BAD_REQUEST);
    }
    
  }

  async findId(id: string): Promise<Todo[]> {
    try{
      return await this.todoModel.find({ _id: id });
    } catch{
      throw new HttpException('BAD_REQUEST : todo.findId', HttpStatus.BAD_REQUEST);
    }
    
  }

  async findByUser(username,query?): Promise<Object> {
    try{
      const todoAtPage = 10;
      const todos = await this.todoModel.find({username : username}).exec();
      const pages = Math.ceil((todos.length)/todoAtPage);
      let currentPage = Number(query.page);
      if (currentPage>pages){currentPage = pages}      
      const pageOfTodo =  await this.todoModel
          .find({username : username})
          .skip(Number((currentPage-1) * todoAtPage))
          .limit(Number(todoAtPage))
          .sort({ dueDate : 'asc'})
          .exec();     
      // console.log(`pages: ${pages},currentPage: ${query.page}`);
      // console.log(`todos : ${todos.length}`);
      //console.log(currentPage)

      return {todos: pageOfTodo,pages: pages,currentPage: currentPage};
    } catch{
      throw new HttpException('BAD_REQUEST : todo.findAll', HttpStatus.BAD_REQUEST);
    }
    }
   

  async deleteAll(): Promise<Object> {
    try{
      return await this.todoModel.deleteMany({}).exec();
    } catch{
      throw new HttpException('BAD_REQUEST : todo.deleteAll', HttpStatus.BAD_REQUEST);
    }
    
  }
  async delete(id: string): Promise<Object> {
    try{
      return await this.todoModel.deleteOne({ _id: id });
    } catch{
      throw new HttpException('BAD_REQUEST : todo.delete', HttpStatus.BAD_REQUEST);
    }
    
  }
  async update(id: string): Promise<Object> {
      try{
        if (await this.todoModel.findById(id).exec()) {
          const [{ state: oldState }] = await this.todoModel
            .find({ _id: id })
            .exec();
          return await this.todoModel
            .updateOne({ _id: id }, { state: !oldState })
            .exec();
        }
        return 'id is not find in DB';
      }catch{
        throw new HttpException('BAD_REQUEST : todo.update', HttpStatus.BAD_REQUEST);
      }
    }
  
}
