import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { RezervacijaSchema } from 'src/database/entities/rezervacija.entity';
import { RezervacijaController } from './controllers/rezervacija.controller';
import { RezervacijaService } from './services/rezervacija.service';
import { KorpaModule } from '../korpa/korpa.module';
import { KorisnikModule } from '../korisnik/korisnik.module';
import { ProdavacModule } from '../prodavac/prodavac.module';
import { SharedModule } from 'src/shared/services/shared.module';


@Module({
  imports: [
    KorpaModule,
    KorisnikModule,
    ProdavacModule,
    SharedModule,
    MongooseModule.forFeature([{ name: modelNames.REZERVACIJA, schema: RezervacijaSchema }])
  ],
  controllers: [RezervacijaController],
  providers: [RezervacijaService],
  exports: [RezervacijaService],
})
export class RezervacijaModule {}