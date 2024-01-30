import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { KorisnikSchema } from 'src/database/entities/korisnik.entity';
import { KorisnikService } from './services/korisnik.service';
import { KorisnikController } from './controllers/korisnik.controller';
import { PassportModule } from '@nestjs/passport';
import { KorisnikAuthService } from './services/korisnik-auth.service';
import { LocalStrategyKorisnik } from './strategies/local-strategy-korisnik';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AvailableConfigs } from 'src/config/available-configs';
import { JwtStrategyKorisnik } from './strategies/jwt-strategy-korisnik';
import { SharedModule } from 'src/shared/services/shared.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(AvailableConfigs.SECRET),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: modelNames.KORISNIK, schema: KorisnikSchema }])
  ],
  controllers: [KorisnikController],
  providers: [KorisnikService, KorisnikAuthService, LocalStrategyKorisnik, JwtStrategyKorisnik],
  exports: [KorisnikService],
})
export class KorisnikModule {}