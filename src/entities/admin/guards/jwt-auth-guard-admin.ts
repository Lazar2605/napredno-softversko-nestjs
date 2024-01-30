import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtGuardNames } from 'src/entities/constants/jwt-guard-names';

@Injectable()
export class JwtAuthGuardAdmin extends AuthGuard(jwtGuardNames.JWT_ADMIN) {}