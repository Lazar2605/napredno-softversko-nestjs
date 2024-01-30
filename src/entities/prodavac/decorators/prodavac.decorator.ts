import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ProdavacDocument } from 'src/database/entities/prodavac.entity';

export const ProdavacDecorator = createParamDecorator(
  (data: keyof ProdavacDocument, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const prodavac = request.user; 

    if (data) {
      return prodavac[data]; 
    }
    return prodavac;
  },
);