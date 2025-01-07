import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serialize(dto: ClassConstructor<any>) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    /* console.log('I am running before the handler', context); */

    return next.handle().pipe(
      map((data: any) => {
        /* console.log('I am running before the response is sent out', data); */
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
