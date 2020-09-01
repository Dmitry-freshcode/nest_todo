//import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Todo extends Document {
  @Prop()
  name: string;

  @Prop()
  state: boolean;

  @Prop()
  dueDate: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// export const Todo = new mongoose.Schema({
//   name: { type: String, required: true },
//   , default: false },
//   dueDate: { type: Date },
//   createdAt: { type: Date },
//   updatedAt: { type: Date },
// });
