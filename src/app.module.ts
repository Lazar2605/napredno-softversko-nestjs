import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailableConfigs } from './config/available-configs';
import { KorisnikModule } from './entities/korisnik/korisnik.module';
import { AdminModule } from './entities/admin/admin.module';
import { ProdavacModule } from './entities/prodavac/prodavac.module';
import { KategorijaModule } from './entities/kategorija/kategorija.module';
import { ProizvodModule } from './entities/proizvod/proizvod.module';
import { SharedModule } from './shared/services/shared.module';
import { KorpaModule } from './entities/korpa/korpa.module';
import { RezervacijaModule } from './entities/rezervacija/rezervacija.module';
import { OcenaModule } from './entities/ocena/ocena.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(AvailableConfigs.MONGODB_CONNECTION_STRING),
      }),
      inject: [ConfigService],
    }),
    KorisnikModule,
    AdminModule,
    ProdavacModule,
    KategorijaModule,
    ProizvodModule,
    KorpaModule,
    RezervacijaModule,
    SharedModule,
    OcenaModule
  ],
})
export class AppModule {}
