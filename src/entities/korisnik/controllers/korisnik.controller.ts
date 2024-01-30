import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { KorisnikService } from "../services/korisnik.service";
import { JoiValidationPipe } from "src/pipes/joi-validation-pipe";
import { createKorisnikValidator } from "../validators/create-korisnik-validator";
import { Korisnik, KorisnikDocument } from "src/database/entities/korisnik.entity";
import { LocalAuthGuardKorisnik } from "../guards/local-auth-guard-korisnik";
import { KorisnikAuthService } from "../services/korisnik-auth.service";
import { KorisnikDecorator } from "../decorators/korisnik.decorator";
import { JwtAuthGuardKorisnik } from "../guards/jwt-auth-guard-korisnik";
import { UpdateKorisnikBody } from "../interfaces/update-korisnik-body";
import { updateKorisnikValidator } from "../validators/update-korisnik-validator";
import { JwtAuthGuardAdmin } from "src/entities/admin/guards/jwt-auth-guard-admin";
import { ChangePassword } from "src/entities/interfaces/change-password.interface";
import { changePasswordValidator } from "src/entities/validators/change-password-validator";


@Controller('korisnici')
export class KorisnikController {
    constructor(
        private readonly korisnikService: KorisnikService,
        private readonly korisnikAuthService: KorisnikAuthService
    ) {}

    @Post()
    async registrujSeKaoKorisnik(@Body(new JoiValidationPipe<Korisnik>(createKorisnikValidator)) korisnik: Korisnik){
        return this.korisnikService.kreirajKorisnika(korisnik);
    }
    
    @UseGuards(LocalAuthGuardKorisnik)
    @Post("login")
    async logujSeKaoKorisnik(
       @KorisnikDecorator() korisnik: KorisnikDocument
    ) {
        return this.korisnikAuthService.login(korisnik);
    }

    @UseGuards(JwtAuthGuardKorisnik)
    @Patch()
    async azurirajProfil(
       @KorisnikDecorator("id") id: string,
       @Body(new JoiValidationPipe<UpdateKorisnikBody>(updateKorisnikValidator)) korisnikBody: UpdateKorisnikBody
    ) {
        return this.korisnikService.azurirajKorisnika(id, korisnikBody);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Delete(":id")
    async obrisiKorisnika(@Param("id") id: string) {
        return this.korisnikService.obrisiKorisnika(id);
    }
    
    @UseGuards(JwtAuthGuardKorisnik)
    @Get("trenutni")
    async vratiTrenutnogKorisnika(@KorisnikDecorator() korisnik: KorisnikDocument) {
        return korisnik;
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Get(":id")
    async vratiKorisnika(@Param("id") id: string) {
        return this.korisnikService.vratiKorisnika(id);
    }

    @UseGuards(JwtAuthGuardKorisnik)
    @Post('lozinka/promeni')
    async promeniLozinku(
      @Body(new JoiValidationPipe<ChangePassword>(changePasswordValidator))
      changePassword: ChangePassword,
      @KorisnikDecorator('id') id: string,
    ) {
      return this.korisnikService.promeniLozinku(changePassword, id);
    }


}