import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/config/available-configs';
import { ProdavacService } from '../services/prodavac.service';
import { jwtGuardNames } from 'src/entities/constants/jwt-guard-names';

@Injectable()
export class JwtStrategyProdavac extends PassportStrategy(Strategy, jwtGuardNames.JWT_PRODAVAC) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prodavacService: ProdavacService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(AvailableConfigs.SECRET),
    });
  }

  async validate(payload: any) {
    const prodavac = await this.prodavacService.vratiProdavcaPoId(payload.id);
    if (!prodavac) {
      throw new UnauthorizedException();
    }
    return prodavac;
  }
}