import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { OcenaSchema } from 'src/database/entities/ocena.entity';
import { OcenaController } from './controllers/ocena.controller';
import { OcenaService } from './services/ocena.service';
import { ProizvodModule } from '../proizvod/proizvod.module';
import { RezervacijaModule } from '../rezervacija/rezervacija.module';
import { ProdavacModule } from '../prodavac/prodavac.module';
import { SharedModule } from 'src/shared/services/shared.module';


@Module({
  imports: [
    ProizvodModule,
    RezervacijaModule,
    ProdavacModule,
    SharedModule,
    MongooseModule.forFeature([{ name: modelNames.OCENA, schema: OcenaSchema }])
  ],
  controllers: [OcenaController],
  providers: [OcenaService],
  exports: [],
})
export class OcenaModule {}