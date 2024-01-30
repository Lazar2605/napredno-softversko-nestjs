import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { modelNames } from 'src/database/constants/model-names';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AvailableConfigs } from 'src/config/available-configs';
import { ProdavacSchema } from 'src/database/entities/prodavac.entity';
import { ProdavacController } from './controllers/prodavac.controller';
import { ProdavacService } from './services/prodavac.service';
import { ProdavacAuthService } from './services/prodavac-auth.service';
import { LocalStrategyProdavac } from './strategies/local-strategy-prodavac';
import { JwtStrategyProdavac } from './strategies/jwt-strategy-prodavac';
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
    MongooseModule.forFeature([{ name: modelNames.PRODAVAC, schema: ProdavacSchema }])
  ],
  controllers: [ProdavacController],
  providers: [ProdavacService, ProdavacAuthService, LocalStrategyProdavac, JwtStrategyProdavac],
  exports: [ProdavacService],
})
export class ProdavacModule {}