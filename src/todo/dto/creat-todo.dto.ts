import { Document } from 'mongoose';

export interface CreateTodoDto extends Document {
  readonly name: string;
  readonly state: boolean;
  readonly dueDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
