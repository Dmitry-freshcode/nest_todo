import { Injectable ,HttpException,HttpStatus, Body} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async create(createTodo: CreateTodoDto): Promise<Todo> {
    try{    
      //console.log(createTodo)  
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

  async findByUser(query): Promise<Object> {
    try{
      //console.log(query);
      const {username , page, filter}= query;
      const tasksAtPage = 10;
      const taskAll = await this.todoModel.find({userId : username}).countDocuments().exec();
      const taskCompleted = await this.todoModel.find({userId : username,state:true}).countDocuments().exec(); 
      const taskNotCompleted = await this.todoModel.find({userId : username,state:false}).countDocuments().exec(); 
     
      let count,foundTasks;
      switch (filter)  {
        case('completed'):{
          foundTasks = {userId : username,state:true};
          count = taskCompleted;
          break;
        }
        case('notCompleted'):{
          foundTasks = {userId : username,state:false};
          count = taskNotCompleted;
          break;
        }
        default:{
          foundTasks = {userId : username}; 
          count = taskAll;
        }
      } 

      const pages = Math.ceil((count)/tasksAtPage);
      let currentPage = Number(page);
      if (currentPage>pages){currentPage = pages}
      //console.log(currentPage);
      const tasks =  await this.todoModel
          .find(foundTasks)
          .skip(Number((currentPage-1) * tasksAtPage))
          .limit(Number(tasksAtPage))
          .sort({ dueDate : 'asc'})
          .exec();  
          //console.log(tasks);
           
     
      return {
        tasks: tasks,
        pages: pages,
        currentPage: currentPage,
        tasksAll:taskAll,
        tasksComplete: taskCompleted,
        tasksNoCompleted:taskNotCompleted,
      };
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
  async update(query): Promise<Object> {
      try{
        //console.log(query);        
        if (await this.todoModel.findById(query._id).exec()) {
          // const [{ state: oldState }] = await this.todoModel
          //   .find({ _id: id })
          //   .exec();
          return await this.todoModel
            .updateOne({ _id: query._id }, { state: !query.state })
            .exec();
        }
        return 'id is not find in DB';
      }catch{
        throw new HttpException('BAD_REQUEST : todo.update', HttpStatus.BAD_REQUEST);
      }
    }
  
}
