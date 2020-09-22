import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { truncateSync } from 'fs';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';
import {ReloadGateway} from '../socket/reload.gateway'

@Injectable()
export class TodoService {
  constructor(
    @InjectModel('Todo') private readonly todoModel: Model<Todo>,   
    private readonly ReloadGateway: ReloadGateway) {}

  async create(createTodo: CreateTodoDto): Promise<Todo> {
    try{  
    const newTodo = new this.todoModel(createTodo);
    const result = await newTodo.save();
    this.ReloadGateway.server.emit('refresh');
      return result;
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
      const {username , page, filter}= query;
      const tasksAtPage = 12;
      const totalTest = await this.todoModel.aggregate([
        {
            '$match': {
                'userId': query.username
            }
        }, {
            '$group': {
                '_id': '$state', 
                'count': {
                    '$sum': 1
                }
            }
        }
    ]);      
      
      let taskNotCompleted = 0;
      let taskCompleted=0;
      
      totalTest.forEach((elem)=>{
        if(elem._id === false) {
          taskNotCompleted=elem.count;
        }
        if(elem._id === true) {
          taskCompleted=elem.count;
        }        
      })       
      const taskAll = taskCompleted + taskNotCompleted;      

      //const allTasks = await this.todoModel.find({userId : username});    
      //const taskAll = allTasks.length;
      //const taskCompleted = allTasks.filter((elem)=>elem.state===true).length;
      //const taskNotCompleted = allTasks.filter((elem)=>elem.state===false).length;      
     
      //const taskCompleted = await this.todoModel.find({userId : username, state:true}).countDocuments(); 
      //const taskNotCompleted = await this.todoModel.find({userId : username,state:false}).countDocuments();    
      
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
      let currentPage = Number(page) || 1;
      if (currentPage>pages){currentPage = pages};      
      let skip = ((currentPage-1) * tasksAtPage);
      if (skip<0){skip = 0};      
      const tasks =  await this.todoModel
          .find(foundTasks)
          .skip(Number(skip))
          .limit(Number(tasksAtPage))
          .sort({ dueDate : 'asc'})
          .exec();
      
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

  async delete(id: string): Promise<Object> {
    try{      
      const result = await this.todoModel.deleteOne({ _id: id });
      this.ReloadGateway.server.emit('refresh');
      return result;
    } catch{
      throw new HttpException('BAD_REQUEST : todo.delete', HttpStatus.BAD_REQUEST);
    }    
  }
  async update(query): Promise<Object> {
      try{              
        if (await this.todoModel.findById(query._id).exec()) { 
            const result =await this.todoModel
            .updateOne({ _id: query._id }, { state: !query.state })
            .exec();
            this.ReloadGateway.server.emit('refresh');
          return result;
        }
        return 'id is not find in DB';
      }catch{
        throw new HttpException('BAD_REQUEST : todo.update', HttpStatus.BAD_REQUEST);
      }
    }  
}

  // async deleteAll(): Promise<Object> {
  //   try{
  //     return await this.todoModel.deleteMany({}).exec();
  //   } catch{
  //     throw new HttpException('BAD_REQUEST : todo.deleteAll', HttpStatus.BAD_REQUEST);
  //   }
    
  // }
