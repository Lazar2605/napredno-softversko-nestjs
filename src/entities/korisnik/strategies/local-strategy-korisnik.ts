import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { KorisnikAuthService } from '../services/korisnik-auth.service';
import { localGuardNames } from 'src/entities/constants/local-guard-names';

@Injectable()
export class LocalStrategyKorisnik extends PassportStrategy(Strategy, localGuardNames.LOCAL_KORISNIK) {
  constructor(private korisnikAuthService: KorisnikAuthService) {
    super({ usernameField: 'imejl', passwordField: 'lozinka' });
  }

  async validate(imejl: string, lozinka: string) {
    const korisnik = await this.korisnikAuthService.validateKorisnik(imejl, lozinka);

    if (!korisnik) {
      throw new UnauthorizedException();
    }
    return korisnik;
  }
}