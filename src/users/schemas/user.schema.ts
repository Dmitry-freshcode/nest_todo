import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({    
    username: { type: String, required: true, unique: true },    
    password: { type: String, required: true },
});

//UserSchema.index({ name: 1 }, { unique: true });
//export const TodoSchema = SchemaFactory.createForClass(Todo);