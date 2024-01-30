import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { KorisnikDocument } from '../../../database/entities/korisnik.entity';

export const KorisnikDecorator = createParamDecorator(
  (data: keyof KorisnikDocument, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const korisnik = request.user; 

    if (data) {
      return korisnik[data]; 
    }
    return korisnik;
  },
);