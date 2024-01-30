import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform {
  constructor(private schema: Joi.Schema<T>) {}

  transform(value: any) {
    const { error, value: validatedValue } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return validatedValue;
  }
}