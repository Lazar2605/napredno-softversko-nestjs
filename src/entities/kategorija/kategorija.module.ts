import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { KategorijaSchema } from 'src/database/entities/kategorija.entity';
import { KategorijaAdminController } from './controllers/kategorija-admin.controller';
import { KategorijaService } from './services/kategorija.service';
import { KategorijaProdavacController } from './controllers/kategorija-prodavac.controller';
import { KategorijaController } from './controllers/kategorija.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: modelNames.KATEGORIJA, schema: KategorijaSchema }])
  ],
  controllers: [KategorijaAdminController, KategorijaProdavacController, KategorijaController],
  providers: [KategorijaService],
  exports: [KategorijaService],
})
export class KategorijaModule {}