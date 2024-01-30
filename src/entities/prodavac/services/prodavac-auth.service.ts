import {
    BadRequestException,
    Injectable,
  } from '@nestjs/common';
  import * as bcrypt from 'bcryptjs';
  import { JwtService } from '@nestjs/jwt';
  import { ProdavacService } from './prodavac.service';
  import * as validator from "class-validator";
import { Roles } from 'src/database/constants/roles';
import { ProdavacDocument } from 'src/database/entities/prodavac.entity';
  
  @Injectable()
  export class ProdavacAuthService {
    constructor(
      private readonly prodavacService: ProdavacService,
      private readonly jwtService: JwtService,
    ) {}
  
    async validateProdavac(imejl: string, lozinka: string) {
      if (!validator.isEmail(imejl)) {
        throw new BadRequestException('Neispravna imejl adresa!');
      }
      const prodavacSaLozinkom = await this.prodavacService.vratiProdavcaSaLozinkom(imejl);

      const poklapaSe = await bcrypt.compare(lozinka, prodavacSaLozinkom.lozinka);
  
      if (!poklapaSe) {
        throw new BadRequestException('Pogrešna lozinka!');
      }
      const prodavac = prodavacSaLozinkom.toObject();
      delete prodavac.lozinka;
      return prodavac;
    }
  
    async login(prodavac: ProdavacDocument) {
      const { _id: id, imejl } = prodavac;
      const payload = { id, imejl, role: Roles.PRODAVAC };
      return {
        accessToken: this.jwtService.sign(payload),
        prodavac
      };
    }
  }