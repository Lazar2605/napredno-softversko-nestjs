import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { ProdavacAuthService } from '../services/prodavac-auth.service';
import { localGuardNames } from 'src/entities/constants/local-guard-names';

@Injectable()
export class LocalStrategyProdavac extends PassportStrategy(Strategy, localGuardNames.LOCAL_PRODAVAC) {
  constructor(private prodavacAuthService: ProdavacAuthService) {
    super({ usernameField: 'imejl', passwordField: 'lozinka' });
  }

  async validate(imejl: string, lozinka: string) {
    const prodavac = await this.prodavacAuthService.validateProdavac(imejl, lozinka);

    if (!prodavac) {
      throw new UnauthorizedException();
    }
    return prodavac;
  }
}