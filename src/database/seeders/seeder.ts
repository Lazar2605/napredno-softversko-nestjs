import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AdminSeeder } from "./admin-seeder";
import { AvailableConfigs } from "../../config/available-configs";
import { modelNames } from "../constants/model-names";
import { AdminSchema } from "../entities/admin.entity";

seeder({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot({envFilePath: '.env'})],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(AvailableConfigs.MONGODB_CONNECTION_STRING),
      }),
      inject: [ConfigService],  
    }),
    MongooseModule.forFeature([{ name: modelNames.ADMIN, schema: AdminSchema }]),
  ],
}).run([AdminSeeder]);