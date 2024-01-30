import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { OcenaService } from "../services/ocena.service";
import { JwtAuthGuardKorisnik } from "src/entities/korisnik/guards/jwt-auth-guard-korisnik";
import { KorisnikDecorator } from "src/entities/korisnik/decorators/korisnik.decorator";
import { JwtAuthGuardProdavac } from "src/entities/prodavac/guards/jwt-auth-guard-prodavac";
import { ProdavacDecorator } from "src/entities/prodavac/decorators/prodavac.decorator";

@Controller('ocene')
export class OcenaController {
    constructor(
        private readonly ocenaService: OcenaService,
    ) {}

    @UseGuards(JwtAuthGuardKorisnik)
    @Post()
    async kreirajOcenu(@KorisnikDecorator("id") kupacId: string, 
                       @Body("brojZvezdica") brojZvezdica: number,
                       @Body("rezervacijaId") rezervacijaId: string,
                       @Body("datumIVreme") datumIVreme: string,
                       @Body("komentar") komentar: string) {
        return this.ocenaService.kreirajOcenu(kupacId, brojZvezdica, rezervacijaId, datumIVreme, komentar);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Get()
    async vratiSveKomentareZaPrdavca(@ProdavacDecorator("id") prodavacId: string) {
        return this.ocenaService.vratiSveKomentareZaProdavca(prodavacId);
    }

    @Get(":prodavacId")
    async vratiSveKomentareZaPrdavcaId(@Param("prodavacId") prodavacId: string) {
        return this.ocenaService.vratiSveKomentareZaProdavca(prodavacId);
    }
    
}