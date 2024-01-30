import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtGuardNames } from 'src/entities/constants/jwt-guard-names';

@Injectable()
export class JwtAuthGuardProdavac extends AuthGuard(jwtGuardNames.JWT_PRODAVAC) {}