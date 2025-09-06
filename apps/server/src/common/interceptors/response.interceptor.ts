import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode,
          message: statusCode <= 400 && 'OK',
          timestamp: new Date(Date.now()).toISOString(),
          errors: data?.errors,
          data,
        };
      }),
      //   catchError((err) => {
      //     const statusCode = err instanceof HttpException ? err.getStatus() : 500;
      //     const errorResponse = {
      //       statusCode,
      //       message: err.message || 'Internal server error',
      //       error: err.name || 'Error',
      //       timestamp: Date.now(),
      //       version: 'v2',
      //       path: request.url,
      //       data: {},
      //     };
      //     return throwError(() => new HttpException(errorResponse, statusCode));
      //   }),
    );
  }
}
