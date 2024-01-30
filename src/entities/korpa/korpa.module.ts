import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { KorpaSchema } from 'src/database/entities/korpa.entity';
import { SharedModule } from 'src/shared/services/shared.module';
import { KorpaController } from './controllers/korpa.controller';
import { KorpaService } from './services/korpa.service';
import { ProizvodModule } from '../proizvod/proizvod.module';
import { ProdavacModule } from '../prodavac/prodavac.module';


@Module({
  imports: [
    SharedModule,
    ProizvodModule,
    ProdavacModule,
    MongooseModule.forFeature([{ name: modelNames.KORPA, schema: KorpaSchema }])
  ],
  controllers: [KorpaController],
  providers: [KorpaService],
  exports: [KorpaService],
})
export class KorpaModule {}