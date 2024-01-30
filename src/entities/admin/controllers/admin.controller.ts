import { Controller, Get, Param, Post, UseGuards, Body } from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { AdminAuthService } from "../services/admin-auth.service";
import { LocalAuthGuardAdmin } from "../guards/local-auth-guard-admin";
import { AdminDecorator } from "../decorators/admin.decorator";
import { Admin, AdminDocument } from "src/database/entities/admin.entity";
import { JwtAuthGuardAdmin } from "../guards/jwt-auth-guard-admin";
import { JoiValidationPipe } from "src/pipes/joi-validation-pipe";
import { ChangePassword } from "src/entities/interfaces/change-password.interface";
import { changePasswordValidator } from "src/entities/validators/change-password-validator";


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly adminAuthService: AdminAuthService
    ) {}

    @UseGuards(LocalAuthGuardAdmin)
    @Post("login")
    async logujSeKaoAdmin(
       @AdminDecorator() admin: AdminDocument
    ) {
        return this.adminAuthService.login(admin);
    }
    
    @UseGuards(JwtAuthGuardAdmin)
    @Get("trenutni")
    async vratiTrenutnogAdmina(@AdminDecorator() admin: Admin) {
        return admin;
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Get(":id")
    async vratiAdmina(@Param("id") id: string) {
        return this.adminService.vratiAdmina(id);
    }

    
    @UseGuards(JwtAuthGuardAdmin)
    @Post('lozinka/promeni')
    async promeniLozinku(
      @Body(new JoiValidationPipe<ChangePassword>(changePasswordValidator))
      changePassword: ChangePassword,
      @AdminDecorator('id') id: string,
    ) {
      return this.adminService.promeniLozinku(changePassword, id);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Post("prodavac/:id/potvrdi")
    async potvrdiProdavca(@Param("id") id: string) {
        return this.adminService.potvrdiProdavca(id);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Post("prodavac/:id/odbij")
    async odbijProdavca(@Param("id") id: string) {
        return this.adminService.odbijProdavca(id);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Post("kategorija/:id/potvrdi")
    async potvrdiKategoriju(@Param("id") id: string) {
        return this.adminService.potvrdiKategoriju(id);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Post("kategorija/:id/odbij")
    async odbijKategoriju(@Param("id") id: string) {
        return this.adminService.odbijKategoriju(id);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Post("proizvod/:proizvodId/potvrdi/kategorija/:kategorijaId")
    async potvrdiProizvod(
        @Param("proizvodId") proizvodId: string,
        @Param("kategorijaId") kategorijaId: string) {
        return this.adminService.potvrdiProizvod(proizvodId, kategorijaId);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Post("proizvod/:proizvodId/odbij")
    async odbijProizvod(
        @Param("proizvodId") proizvodId: string) {
        return this.adminService.odbijProizvod(proizvodId);
    }
}