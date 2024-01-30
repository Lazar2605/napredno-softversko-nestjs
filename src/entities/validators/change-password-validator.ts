import * as Joi from 'joi';
import { RegularExpressions } from '../constants/regular-expressions';
import { ChangePassword } from '../interfaces/change-password.interface';

export const changePasswordValidator = Joi.object<ChangePassword>({
  staraLozinka: Joi.string().regex(RegularExpressions.LOZINKA).required().min(8).max(20),
  novaLozinka: Joi.string().regex(RegularExpressions.LOZINKA).required().min(8).max(20),
}).options({
  stripUnknown: true,
});