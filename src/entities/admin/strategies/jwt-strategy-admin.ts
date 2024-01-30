import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/config/available-configs';
import { AdminService } from '../services/admin.service';
import { jwtGuardNames } from 'src/entities/constants/jwt-guard-names';

@Injectable()
export class JwtStrategyAdmin extends PassportStrategy(Strategy, jwtGuardNames.JWT_ADMIN) {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(AvailableConfigs.SECRET),
    });
  }

  async validate(payload: any) {
    const admin = await this.adminService.vratiAdminaPoId(payload.id);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}