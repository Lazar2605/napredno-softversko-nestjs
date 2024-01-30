import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { KategorijaService } from "../services/kategorija.service";
import { JwtAuthGuardAdmin } from "src/entities/admin/guards/jwt-auth-guard-admin";
import { Kategorija } from "src/database/entities/kategorija.entity";


@Controller('kategorije/admin')
export class KategorijaAdminController {
    constructor(
        private readonly kategorijaService: KategorijaService,
    ) {}
    
    @UseGuards(JwtAuthGuardAdmin)
    @Post()
    async kreirajKategoriju(
        @Body() kategorija: Kategorija
    ) {
        return this.kategorijaService.kreirajDostupnuKategoriju(kategorija);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Patch(":id")
    async izmeniKategoriju(
        @Body() kategorija: Kategorija,
        @Param("id") kategorijaId: string,
    ) {
        return this.kategorijaService.izmeniKategoriju(kategorija, kategorijaId);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Get("zahtevi")
    async vratiSveZahteveZaKategoriju() {
        return this.kategorijaService.vratiSveNedostupneKategorije();
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Get()
    async vratiSveKategorije() {
        return this.kategorijaService.vratiSveKategorije();
    }

}