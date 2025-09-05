import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id || 'anonymous';
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url} user:${userId}\n`;

    fs.appendFileSync('logs.txt', log);

    return next.handle().pipe(
      tap(() => {
      }),
    );
  }
}