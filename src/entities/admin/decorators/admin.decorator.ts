import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminDocument } from 'src/database/entities/admin.entity';

export const AdminDecorator = createParamDecorator(
  (data: keyof AdminDocument, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const admin = request.user; 

    if (data) {
      return admin[data]; 
    }
    return admin;
  },
);