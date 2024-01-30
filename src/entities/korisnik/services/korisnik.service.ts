import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import mongoose, { Model } from "mongoose";
import { Korisnik, KorisnikDocument } from "src/database/entities/korisnik.entity";
import * as bcrypt from "bcrypt";
import { UpdateKorisnikBody } from "../interfaces/update-korisnik-body";
import { ChangePassword } from "src/entities/interfaces/change-password.interface";
import { EmailService } from "src/shared/services/email.service";
import { ConfigService } from "@nestjs/config";
import { AvailableConfigs } from "src/config/available-configs";

@Injectable()
export class KorisnikService {
    constructor(
        @InjectModel(modelNames.KORISNIK)
        private readonly korisnikModel: Model<KorisnikDocument>,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async kreirajKorisnika(korisnikBody: Korisnik) {
        const lozinka = await bcrypt.hash(korisnikBody.lozinka, 8);
        const noviKorisnik = await new this.korisnikModel({...korisnikBody, lozinka }).save();
        const korisnik = noviKorisnik.toObject();
        delete korisnik.lozinka;
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: korisnikBody.imejl, subject: "Uspešna registracija", text:"Uspešno ste se registrovali na sajt Kupuj domaće!"});


        return korisnik;
    }

    async vratiKorisnikaSaLozinkom(imejl: string) {
        const korisnik = await this.korisnikModel.findOne({ imejl }).select('+lozinka');
        if(!korisnik) {
            throw new NotFoundException("Korisnik ne postoji!");
        }
        return korisnik;
    }

    async vratiKorisnika(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const korisnik = await this.vratiKorisnikaPoId(id);
        if(!korisnik) {
            throw new NotFoundException("Korisnik ne postoji!");
        }
        return korisnik;
    }

    async vratiKorisnikaPoId(id: string) {
        return this.korisnikModel.findById(id);
    }

    async azurirajKorisnika(id: string, korisnikBody: UpdateKorisnikBody) {
        const korisnik = await this.vratiKorisnikaPoId(id);
        Object.assign(korisnik, korisnikBody);
        await korisnik.save();

        return korisnik;
    }

    async obrisiKorisnika(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const korisnik = await this.korisnikModel.findByIdAndDelete(id);
        if(!korisnik) {
            throw new NotFoundException("Korisnik nije pronađen");
        }

        return korisnik;
    }

    async promeniLozinku(changePassword: ChangePassword, id: string) {
        const korisnik = await this.korisnikModel.findById(id).select('lozinka');
        const poklapaSe = await bcrypt.compare(
          changePassword.staraLozinka,
          korisnik.lozinka,
        );
    
        if (!poklapaSe) {
          throw new BadRequestException('Pogrešna stara lozinka!');
        }

        korisnik.lozinka = await bcrypt.hash(changePassword.novaLozinka, 8);
        await korisnik.save();
    
        return { message: 'Lozinka je uspešno promenjena!' };
      }

}