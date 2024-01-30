import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Seeder } from "nestjs-seeder";
import { modelNames } from "../constants/model-names";
import { Admin } from "../entities/admin.entity";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminSeeder implements Seeder {
  constructor(@InjectModel(modelNames.ADMIN) 
  private readonly adminModel: mongoose.Model<Admin>) {}

  async seed(): Promise<any> {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Popuni sve argumente!');
        return;
      }
    const [korisnickoIme, lozinka] = args;
    const admin: Partial<Admin> = {
        korisnickoIme, 
        lozinka: await bcrypt.hash(lozinka, 8),
        }
    return this.adminModel.create(admin);
  }
  async drop(): Promise<any> {
    return this.adminModel.deleteMany({});
  }
}