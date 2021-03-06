//import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  state: boolean;

  @Prop()
  dueDate: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// export const Todo = new mongoose.Schema({
//   name: { type: String, required: true },
//   , default: false },
//   dueDate: { type: Date },
//   createdAt: { type: Date },
//   updatedAt: { type: Date },
// });
