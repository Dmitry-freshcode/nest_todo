import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    //let user = req.body;
    console.log(req.body);
    //user={ username: 'test1', password: 'test1' };
   // return user;
    next();
  }
}
