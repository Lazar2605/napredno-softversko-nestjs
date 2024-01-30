import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { KorpaService } from "../services/korpa.service";
import { JwtAuthGuardKorisnik } from "src/entities/korisnik/guards/jwt-auth-guard-korisnik";
import { KorisnikDecorator } from "src/entities/korisnik/decorators/korisnik.decorator";

@Controller('korpe')
export class KorpaController {
    constructor(
        private readonly korpaService: KorpaService,
    ) {}

    @UseGuards(JwtAuthGuardKorisnik)
    @Post("logovan")
    async kreirajKorpuZaKorisnika(@KorisnikDecorator("id") id: string) {
        return this.korpaService.kreirajKorpuZaKorisnika(id);
    }

    @Post("nelogovan")
    async kreirajKorpuZaGosta(@Body("hash") hash: string) {
        return this.korpaService.kreirajKorpuZaGosta(hash);
    }

    @UseGuards(JwtAuthGuardKorisnik)
    @Post("proizvod/:proizvodId/logovan")
    async dodajProizvodUKorpuZaKorisnika(@KorisnikDecorator("id") id: string, @Param("proizvodId") proizvodId: string, @Body("kvantitet") kvantitet: number, @Body("novaCena") novaCena: number) {
        return this.korpaService.dodajProizvodUKorpuZaKorisnika(id, proizvodId, kvantitet, novaCena);
    }

    @Post("proizvod/:proizvodId/nelogovan")
    async dodajProizvodUKorpuZaGosta(@Body("hash") hash: string, @Param("proizvodId") proizvodId: string , @Body("kvantitet") kvantitet: number) {
        return this.korpaService.dodajProizvodUKorpuZaGosta(hash, proizvodId, kvantitet);
    }

    @UseGuards(JwtAuthGuardKorisnik)
    @Get("logovan")
    async vratiTrenutnuKorpuZaKorisnika(@KorisnikDecorator("id") id: string) {
        return this.korpaService.vratiKorpuLogovanogKorisnika(id);
    }

    @Get("nelogovan/:hash")
    async vratiTrenutnuKorpuZaGosta(@Param("hash") hash: string) {
        return this.korpaService.vratiKorpuNelogovanogKorisnika(hash);
    }
    
    @UseGuards(JwtAuthGuardKorisnik)
    @Post("izmeni/kvantitet/logovan")
    async izmeniKvantitetKorisnik(@KorisnikDecorator("id") id: string, @Body("kvantitet") kvantitet: number,  @Body("proizvodId") proizvodId: string) {
        return this.korpaService.izmeniKvantitetKorisnik(id, kvantitet, proizvodId);
    }

    @Post("izmeni/kvantitet/:hash/nelogovan")
    async izmeniKvantitetGost(@Param("hash") hash: string, @Body("kvantitet") kvantitet: number, @Body("proizvodId") proizvodId: string) {
        return this.korpaService.izmeniKvantitetGost(hash, kvantitet, proizvodId);
    }

    @UseGuards(JwtAuthGuardKorisnik)
    @Delete("logovan")
    async obrisiKorpuKorisnik(@KorisnikDecorator("id") id: string) {
        return this.korpaService.obrisiKorpuKorisnik(id);
    }

    @Delete(":hash/nelogovan")
    async obrisiKorpuGost(@Param("hash") hash: string) {
        return this.korpaService.obrisiKorpuGost(hash);
    }
    
}