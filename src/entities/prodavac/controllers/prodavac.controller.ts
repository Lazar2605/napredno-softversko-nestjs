import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ProdavacService } from "../services/prodavac.service";
import { JoiValidationPipe } from "src/pipes/joi-validation-pipe";
import { createProdavacValidator } from "../validators/create-prodavac-validator";
import { Prodavac, ProdavacDocument } from "src/database/entities/prodavac.entity";
import { LocalAuthGuardProdavac } from "../guards/local-auth-guard-podavac";
import { ProdavacAuthService } from "../services/prodavac-auth.service";
import { ProdavacDecorator } from "../decorators/prodavac.decorator";
import { JwtAuthGuardProdavac } from "../guards/jwt-auth-guard-prodavac";
import { UpdateProdavacBody } from "../interfaces/update-prodavac-body";
import { updateProdavacValidator } from "../validators/update-prodavac-validator";
import { JwtAuthGuardAdmin } from "src/entities/admin/guards/jwt-auth-guard-admin";
import { ChangePassword } from "src/entities/interfaces/change-password.interface";
import { changePasswordValidator } from "src/entities/validators/change-password-validator";


@Controller('prodavci')
export class ProdavacController {
    constructor(
        private readonly prodavacService: ProdavacService,
        private readonly prodavacAuthService: ProdavacAuthService
    ) {}

    @Post()
    async registrujSeKaoProdavac(@Body(new JoiValidationPipe<Prodavac>(createProdavacValidator)) prodavac: Prodavac){
        return this.prodavacService.create(prodavac);
    }
    
    @UseGuards(LocalAuthGuardProdavac)
    @Post("login")
    async logujSeKaoProdavac(
       @ProdavacDecorator() prodavac: ProdavacDocument
    ) {
        return this.prodavacAuthService.login(prodavac);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Patch()
    async azurirajProfil(
       @ProdavacDecorator("id") id: string,
       @Body(new JoiValidationPipe<UpdateProdavacBody>(updateProdavacValidator)) prodavacBody: UpdateProdavacBody
    ) {
        return this.prodavacService.azurirajProdavca(id, prodavacBody);
    }

    @UseGuards(JwtAuthGuardAdmin)
    @Delete(":id")
    async obrisiProdavca(@Param("id") id: string) {
        return this.prodavacService.obrisiProdavca(id);
    }

    @UseGuards(JwtAuthGuardProdavac)
    @Get("trenutni")
    async vratiTrenutnogProdavca(@ProdavacDecorator() prodavac: Prodavac) {
        return prodavac;
    }
    
    @UseGuards(JwtAuthGuardAdmin)
    @Get("zahtevi")
    async vratiSveZahteveZaRegistraciju() {
        return this.prodavacService.vratiSveNedostupneProdavce();
    }
    @Get(":id")
    async vratiProdavca(@Param("id") id: string) {
        return this.prodavacService.vratiProdavca(id);
    }


    @UseGuards(JwtAuthGuardProdavac)
    @Post('lozinka/promeni')
    async promeniLozinku(
      @Body(new JoiValidationPipe<ChangePassword>(changePasswordValidator))
      changePassword: ChangePassword,
      @ProdavacDecorator('id') id: string,
    ) {
      return this.prodavacService.promeniLozinku(changePassword, id);
    }

}