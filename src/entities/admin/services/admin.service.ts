import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import mongoose, { Model } from "mongoose";
import { AdminDocument } from "src/database/entities/admin.entity";
import { ChangePassword } from "src/entities/interfaces/change-password.interface";
import * as bcrypt from "bcrypt";
import { ProdavacService } from "src/entities/prodavac/services/prodavac.service";
import { KategorijaService } from "src/entities/kategorija/services/kategorija.service";
import { ProizvodService } from "src/entities/proizvod/services/proizvod.service";
import { EmailService } from "src/shared/services/email.service";
import { ConfigService } from "@nestjs/config";
import { AvailableConfigs } from "src/config/available-configs";

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(modelNames.ADMIN)
        private readonly adminModel: Model<AdminDocument>,
        private readonly prodavacService: ProdavacService,
        private readonly kategorijaServie: KategorijaService,
        private readonly proizvodService: ProizvodService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async vratiAdmina(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const admin = await this.vratiAdminaPoId(id);
        if(!admin) {
            throw new NotFoundException("Admin nije pronađen!");
        }
        return admin;
    }

    async vratiAdminaPoId(id: string) {
        return this.adminModel.findById(id);
    }

    async vratiAdminaSaLozinkom(korisnickoIme: string) {
        const admin = await this.adminModel.findOne({ korisnickoIme }).select('+lozinka');
        if(!admin) {
            throw new NotFoundException("Admin nije pronađen!");
        }
        return admin;
    }

    async promeniLozinku(changePassword: ChangePassword, id: string) {
        const admin = await this.adminModel.findById(id).select('lozinka');
        const poklapaSe = await bcrypt.compare(
          changePassword.staraLozinka,
          admin.lozinka,
        );
    
        if (!poklapaSe) {
          throw new BadRequestException('Pogrešna stara lozinka!');
        }

        admin.lozinka = await bcrypt.hash(changePassword.novaLozinka, 8);
        await admin.save();
    
        return { message: 'Lozinka je uspešno promenjena!' };
    }

    async potvrdiProdavca(id: string) {
        const prodavac = await this.prodavacService.vratiNedostupnogProdavca(id);
        prodavac.dostupan = true;
        await prodavac.save();
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: prodavac.imejl , subject: "Obaveštenje", text:"Vaša registracija je uspešna. Uživajte u korišćenju naše platforme."});
        return prodavac;
    }

    async odbijProdavca(id: string) {
        const prodavac = await this.prodavacService.vratiNedostupnogProdavca(id);
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: prodavac.imejl , subject: "Obaveštenje", text:"Vaša registracija je odbijena!"});
        return await this.prodavacService.obrisiProdavca(id);
    }

    async potvrdiKategoriju(id: string) {
        const kategorija = await this.kategorijaServie.vratiNedostupnuKategoriju(id);
        kategorija.dostupna = true;
        await kategorija.save();
        return kategorija;
    }

    async odbijKategoriju(id: string) {
        await this.kategorijaServie.vratiNedostupnuKategoriju(id);
        return await this.kategorijaServie.obrisiKategoriju(id);
    }

    async potvrdiProizvod(proizvodId: string, kategorijaId: string) {
        let proizvod = await this.proizvodService.vratiProizvodPoId(proizvodId);
        const kategorija = await this.kategorijaServie.vratiKategorijuPoId(kategorijaId);
        proizvod.dostupan = true;
        proizvod.kategorijaId = kategorija.id;
        await proizvod.save();
        proizvod = await this.proizvodService.vratiProizvodPoId(proizvodId);
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: proizvod.prodavac.imejl , subject: "Obaveštenje", text:`Vaš proizvod je prihvaćen i dodeljena mu je kategorija ${proizvod.kategorija.naziv}!`});
        return proizvod;
    }

    async odbijProizvod(id: string) {
        const proizvod = await this.proizvodService.vratiNedostupniProizvod(id);
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: proizvod.prodavac.imejl , subject: "Obaveštenje", text:"Vaš proizvod je odbijen!"});
        return await this.proizvodService.obrisiProizvod(id);
    }
}