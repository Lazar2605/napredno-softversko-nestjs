import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { AdminSchema } from 'src/database/entities/admin.entity';
import { AdminService } from './services/admin.service';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthService } from './services/admin-auth.service';
import { LocalStrategyAdmin } from './strategies/local-strategy-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AvailableConfigs } from 'src/config/available-configs';
import { JwtStrategyAdmin } from './strategies/jwt-strategy-admin';
import { AdminController } from './controllers/admin.controller';
import { ProdavacModule } from '../prodavac/prodavac.module';
import { KategorijaModule } from '../kategorija/kategorija.module';
import { ProizvodModule } from '../proizvod/proizvod.module';
import { SharedModule } from 'src/shared/services/shared.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    ProdavacModule,
    KategorijaModule,
    ProizvodModule,
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(AvailableConfigs.SECRET),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: modelNames.ADMIN, schema: AdminSchema }])
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminAuthService, LocalStrategyAdmin, JwtStrategyAdmin],
  exports: [AdminService],
})
export class AdminModule {}