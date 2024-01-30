import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { localGuardNames } from 'src/entities/constants/local-guard-names';

@Injectable()
export class LocalAuthGuardAdmin extends AuthGuard(localGuardNames.LOCAL_ADMIN) {}