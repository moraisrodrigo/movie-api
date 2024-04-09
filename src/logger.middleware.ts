import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let parametersString = '';

    if (req.query)
      parametersString = Object.entries(req.query)
        .map(([key, value]) => `${key}=${value}`)
        .join(' & ');

    console.log(`[${req.method}]: '${req.baseUrl}' ${parametersString}`);

    next();
  }
}
