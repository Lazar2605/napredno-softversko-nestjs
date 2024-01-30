import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { AdminAuthService } from '../services/admin-auth.service';
import { localGuardNames } from 'src/entities/constants/local-guard-names';

@Injectable()
export class LocalStrategyAdmin extends PassportStrategy(Strategy, localGuardNames.LOCAL_ADMIN) {
  constructor(private adminAuthService: AdminAuthService) {
    super({ usernameField: 'korisnickoIme', passwordField: 'lozinka' });
  }

  async validate(korisnickoIme: string, lozinka: string) {
    const admin = await this.adminAuthService.validateAdmin(korisnickoIme, lozinka);

    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}