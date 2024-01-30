import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RezervacijaService } from "../services/rezervacija.service";
import { JwtAuthGuardKorisnik } from "src/entities/korisnik/guards/jwt-auth-guard-korisnik";
import { KorisnikDecorator } from "src/entities/korisnik/decorators/korisnik.decorator";
import { KorisnikDocument } from "src/database/entities/korisnik.entity";
import { KreirajRezervaciju } from "src/entities/rezervacija/interfaces/kreiraj-rezervaciju.interface";
import { JoiValidationPipe } from "src/pipes/joi-validation-pipe";
import { kreirajRezervacijuValidator } from "../validators/kreiraj-rezervaciju-validator";
import { JwtAuthGuardProdavac } from "src/entities/prodavac/guards/jwt-auth-guard-prodavac";

@Controller('rezervacije')
export class RezervacijaController {
    constructor(
        private readonly rezervacijaService: RezervacijaService,
    ) {}

    @UseGuards(JwtAuthGuardKorisnik)
    @Post("logovan")
    async kreirajRezervacijuZaKorisnika(@KorisnikDecorator() korisnik: KorisnikDocument) {
        return this.rezervacijaService.kreirajRezervacijuZaKorisnika(korisnik);
    }

    @Post("nelogovan")
    async kreirajRezervacijuZaGosta(@Body(new JoiValidationPipe<KreirajRezervaciju>(kreirajRezervacijuValidator)) kupacIHash: KreirajRezervaciju) {
        return this.rezervacijaService.kreirajRezervacijuZaGosta(kupacIHash);
    }

    @UseGuards(JwtAuthGuardKorisnik)
    @Get()
    async vratiSveMojeRezervacije(@KorisnikDecorator("imejl") imejl: string) {
        return this.rezervacijaService.vratiSveRezervacijeKorisnika(imejl);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Get("prodavac")
    async vratiSveMojeRezervacijeProdavac(@KorisnikDecorator("id") id: string) {
        return this.rezervacijaService.vratiSveRezervacijeProdavca(id);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Post("promeni-status/:rezervacijaId")
    async promeniStatus(@Param("rezervacijaId") rezervacijaId: string, @Body("status") status: string) {
        return this.rezervacijaService.promeniStatus(rezervacijaId, status);
    }

    
    @UseGuards(JwtAuthGuardKorisnik)
    @Post("promeni-status-korisnik/:rezervacijaId")
    async promeniStatusKorisnik(@Param("rezervacijaId") rezervacijaId: string, @Body("status") status: string) {
        return this.rezervacijaService.promeniStatus(rezervacijaId, status);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Delete(":rezervacijaId")
    async obrisiRezervaciju(@Param("rezervacijaId") rezervacijaId: string) {
        return this.rezervacijaService.obrisiRezervaciju(rezervacijaId);
    }
    
}