import { Controller, Get, Param } from "@nestjs/common";
import { KategorijaService } from "../services/kategorija.service";

@Controller('kategorije')
export class KategorijaController {
    constructor(
        private readonly kategorijaService: KategorijaService,
    ) {}

    @Get()
    async vratiSvePrimarneKategorije() {
        return this.kategorijaService.vratiSvePrimarneKategorije();
    }

    @Get(":id")
    async vratiKategoriju(@Param("id") id: string) {
        return this.kategorijaService.vratiKategorijuPoId(id);
    }


}