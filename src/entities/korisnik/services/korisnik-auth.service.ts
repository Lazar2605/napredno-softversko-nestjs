import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import * as bcrypt from 'bcryptjs';
  import { JwtService } from '@nestjs/jwt';
  import { KorisnikService } from './korisnik.service';
  import { KorisnikDocument } from 'src/database/entities/korisnik.entity';
  import * as validator from "class-validator";
import { Roles } from 'src/database/constants/roles';
  
  @Injectable()
  export class KorisnikAuthService {
    constructor(
      private readonly korisnikService: KorisnikService,
      private readonly jwtService: JwtService,
    ) {}
  
    async validateKorisnik(imejl: string, lozinka: string) {
      if (!validator.isEmail(imejl)) {
        throw new BadRequestException('Neispravna imejl adresa!');
      }
      const korisnikSaLozinkom = await this.korisnikService.vratiKorisnikaSaLozinkom(imejl);

      const poklapaSe = await bcrypt.compare(lozinka, korisnikSaLozinkom.lozinka);
  
      if (!poklapaSe) {
        throw new BadRequestException('Pogrešna lozinka!');
      }
      const korisnik = korisnikSaLozinkom.toObject();
      delete korisnik.lozinka;
      return korisnik;
    }
  
    async login(korisnik: KorisnikDocument) {
      const {_id: id, imejl} = korisnik;
      const payload = { id, imejl, role: Roles.KORISNIK };
      return {
        accessToken: this.jwtService.sign(payload),
        korisnik
      };
    }
  }