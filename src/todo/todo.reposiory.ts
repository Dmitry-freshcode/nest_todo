import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/creat-todo.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schemas';


@Injectable()
export class TodoRepository{
    constructor(@InjectModel('Todo')
        private todoModel: Model<Todo>){}

    async create(Model:CreateTodoDto):Promise<CreateTodoDto>{
        const todo = new this.todoModel(Model);
        return await todo.save();
    }

    async findTodo(data:Object):Promise<Todo | undefined>{    
        return await this.todoModel.findOne(data).exec();
    }

    async getTasksState(query):Promise<Array<{_id: Boolean,count: number}>>
    {
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
        return totalTest;
    }

    async getPageTasks (data:{
        foundTasks:{
            userId : string,
            state:boolean
        },
        skip:number,
        tasksAtPage:number
    }):Promise<Object[]>{
        const tasks = await this.todoModel
        .find(data.foundTasks)
        .skip(Number(data.skip))
        .limit(Number(data.tasksAtPage))
        .sort({ dueDate : 'asc'})
        .exec();
        return tasks;
    } 

    async delete(id:string):Promise<Object>{
        return await this.todoModel.deleteOne({ _id: id })
    }

    async updateTodo(data:Object,newData:Object):Promise<Object>{
        const result =await this.todoModel
        .updateOne(data,newData)
        .exec();
        return result;
    }

}