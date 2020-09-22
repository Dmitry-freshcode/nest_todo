import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
//import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Todo } from './schemas/todo.schemas';
import {ReloadGateway} from '../socket/reload.gateway'
import { TodoRepository } from './todo.reposiory';

@Injectable()
export class TodoService {
  constructor(     
    private readonly ReloadGateway: ReloadGateway,
    private todoDB:TodoRepository) {}

  create(createTodo: CreateTodoDto): Promise<Todo> {
    try{  
      const result = this.todoDB.create(createTodo);
      this.ReloadGateway.server.emit('refresh');
      return result;
    }catch{
      throw new HttpException('BAD_REQUEST : todo.create', HttpStatus.BAD_REQUEST);
    }    
  }

  findId(id: string): Promise<Todo> {
    try{
        return this.todoDB.findTodo({ _id: id });      
    } catch{
      throw new HttpException('BAD_REQUEST : todo.findId', HttpStatus.BAD_REQUEST);
    }    
  }

  async findByUser(query): Promise<Object> {
    try{              
      const {username , page, filter}= query;
      const tasksAtPage = 12;
      const totalTest = await this.todoDB.getTasksState(query);  
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
      const tasks = await this.todoDB.getPageTasks({
        foundTasks,
        skip,
        tasksAtPage,        
      }); 
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
      const result = this.todoDB.delete(id);
      this.ReloadGateway.server.emit('refresh');
      return result;
    } catch{
      throw new HttpException('BAD_REQUEST : todo.delete', HttpStatus.BAD_REQUEST);
    }    
  }
  async update(query): Promise<Object> {
      try{        
        if(await this.todoDB.findTodo({ _id:query._id })){
          const result = this.todoDB.updateTodo({ _id: query._id },{ state: !query.state })
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
