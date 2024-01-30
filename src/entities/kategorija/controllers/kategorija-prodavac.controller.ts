import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { KategorijaService } from "../services/kategorija.service";
import { Kategorija } from "src/database/entities/kategorija.entity";
import { JwtAuthGuardProdavac } from "src/entities/prodavac/guards/jwt-auth-guard-prodavac";


@Controller('kategorije/prodavac')
export class KategorijaProdavacController {
    constructor(
        private readonly kategorijaService: KategorijaService,
    ) {}
    
    @UseGuards(JwtAuthGuardProdavac)
    @Post()
    async kreirajKategoriju(
        @Body() kategorija: Kategorija
    ) {
        return this.kategorijaService.kreirajKategoriju(kategorija);
    }

}