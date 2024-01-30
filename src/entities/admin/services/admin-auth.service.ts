import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import * as bcrypt from 'bcryptjs';
  import { JwtService } from '@nestjs/jwt';
  import { AdminService } from './admin.service';
  import { AdminDocument } from 'src/database/entities/admin.entity';
  import { Roles } from 'src/database/constants/roles';
  
  @Injectable()
  export class AdminAuthService {
    constructor(
      private readonly adminService: AdminService,
      private readonly jwtService: JwtService,
    ) {}
  
    async validateAdmin(korisnickoIme: string, lozinka: string) {
      const adminSaLozinkom = await this.adminService.vratiAdminaSaLozinkom(korisnickoIme);

      const poklapaSe = await bcrypt.compare(lozinka, adminSaLozinkom.lozinka);
  
      if (!poklapaSe) {
        throw new BadRequestException('Pogrešna lozinka!');
      }
      const admin = adminSaLozinkom.toObject();
      delete admin.lozinka;
      return admin;
    }
  
    async login(admin: AdminDocument) {
      const {_id: id, korisnickoIme} = admin;
      const payload = { id, korisnickoIme, role: Roles.ADMIN };
      return {
        accessToken: this.jwtService.sign(payload),
        admin
      };
    }
  }