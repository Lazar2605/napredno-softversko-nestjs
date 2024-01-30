import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { ProizvodSchema } from 'src/database/entities/proizvod.entity';
import { ProizvodController } from './controllers/proizvod.controller';
import { ProizvodService } from './services/proizvod.service';
import { SharedModule } from 'src/shared/services/shared.module';
import { ProdavacModule } from '../prodavac/prodavac.module';
import { KategorijaModule } from '../kategorija/kategorija.module';


@Module({
  imports: [
    SharedModule,
    ProdavacModule,
    KategorijaModule,
    MongooseModule.forFeature([{ name: modelNames.PROIZVOD, schema: ProizvodSchema }])
  ],
  controllers: [ProizvodController],
  providers: [ProizvodService],
  exports: [ProizvodService],
})
export class ProizvodModule {}