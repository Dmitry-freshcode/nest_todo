import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ReloadModule } from './socket/reload.module'
//import { TokenModule } from './token/token.module';

const environment = process.env.NODE_ENV || 'development';


@Module({
  imports: [
    ReloadModule,
    TodoModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    AuthModule,    
    //TokenModule,
  ],
  //controllers: [AppController],
  providers: [AuthModule],
  controllers: [AppController],
})
export class AppModule {}
