import { Controller, UseGuards, Post, Body, Get, Param, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Patch, Delete } from "@nestjs/common";
import { ProizvodService } from "../services/proizvod.service";
import { JwtAuthGuardProdavac } from "src/entities/prodavac/guards/jwt-auth-guard-prodavac";
import { Proizvod } from "src/database/entities/proizvod.entity";
import { ProdavacDecorator } from "src/entities/prodavac/decorators/prodavac.decorator";
import { ProdavacDocument } from "src/database/entities/prodavac.entity";
import { ParseQueryPipe } from "src/pipes/parse-query-pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuardAdmin } from "src/entities/admin/guards/jwt-auth-guard-admin";

@Controller('proizvodi')
export class ProizvodController {
    constructor(
        private readonly proizvodService: ProizvodService,
    ) {}

    @UseGuards(JwtAuthGuardProdavac)
    @Post()
    @UseInterceptors(FileInterceptor("file")) 
    async kreirajProizvod(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize:  1000000 }),
                    new FileTypeValidator({ fileType: "image"}),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body() proizvod: Proizvod,
        @ProdavacDecorator() prodavac: ProdavacDocument,
    ) {
        return this.proizvodService.kreirajProizvod(proizvod, prodavac, file);
    }

    @Get("kategorija/:kategorijaId")
    async vratiProzivodeKategorije(
        @Query(new ParseQueryPipe()) queryObject: any,
        @Param("kategorijaId") kategorijaId: string 
    ) {
        return this.proizvodService.vratiProizvodeKategorije(queryObject, kategorijaId);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Get("nedostupni")
    async vratiNedostupneProizvode() {
        return this.proizvodService.vratiSveNedostupneProizvode();
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Get("prodavac")
    async vratiMojeProizvode(@ProdavacDecorator("id") prodavacId: string) {
        return this.proizvodService.vratiProizvodeProdavca(prodavacId);
    }

    @Get("prodavac/:prodavacId")
    async vratiProizvodeProdavca(@Param("prodavacId") prodavacId: string) {
        return this.proizvodService.vratiProizvodeProdavca(prodavacId);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Patch(":proizvodId")
    async azurirajCenu(@Param("proizvodId") proizvodId: string, @Body("cena") cena: number) {
        return this.proizvodService.azurirajCenu(proizvodId, cena);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Delete(":proizvodId")
    async obrisiProizvod(@Param("proizvodId") proizvodId: string) {
        return this.proizvodService.obrisiProizvod(proizvodId);
    }

    @Get(":id")
    async vratiProizvodiPoId(@Param("id") id: string) {
        return this.proizvodService.vratiProizvodPoId(id);
    }
}