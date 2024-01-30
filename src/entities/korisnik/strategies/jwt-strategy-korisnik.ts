import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/config/available-configs';
import { KorisnikService } from '../services/korisnik.service';
import { jwtGuardNames } from 'src/entities/constants/jwt-guard-names';

@Injectable()
export class JwtStrategyKorisnik extends PassportStrategy(Strategy, jwtGuardNames.JWT_KORISNIK) {
  constructor(
    private readonly configService: ConfigService,
    private readonly korisnikService: KorisnikService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(AvailableConfigs.SECRET),
    });
  }

  async validate(payload: any) {
    const korisnik = await this.korisnikService.vratiKorisnikaPoId(payload.id);
    if (!korisnik) {
      throw new UnauthorizedException();
    }
    return korisnik;
  }
}