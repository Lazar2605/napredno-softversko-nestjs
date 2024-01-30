import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import mongoose, { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { UpdateProdavacBody } from "../interfaces/update-prodavac-body";
import { Prodavac, ProdavacDocument } from "src/database/entities/prodavac.entity";
import { ChangePassword } from "src/entities/interfaces/change-password.interface";
import { EmailService } from "src/shared/services/email.service";
import { ConfigService } from "@nestjs/config";
import { AvailableConfigs } from "src/config/available-configs";

@Injectable()
export class ProdavacService {
    constructor(
        @InjectModel(modelNames.PRODAVAC)
        private readonly prodavacModel: Model<ProdavacDocument>,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async create(prodavacBody: Prodavac) {
        const lozinka = await bcrypt.hash(prodavacBody.lozinka, 8);
        const noviProdavac = await new this.prodavacModel({...prodavacBody, lozinka }).save();
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: prodavacBody.imejl , subject: "Obaveštenje", text:"Uspešno ste popunili formu za registraciju, sačekajte odobrenje."});

        const prodavac = noviProdavac.toObject();
        delete prodavac.lozinka;

        return prodavac;
    }

    async vratiProdavcaSaLozinkom(imejl: string) {
        const prodavac = await this.prodavacModel.findOne({ imejl, dostupan: true }).select('+lozinka');
        if(!prodavac) {
            throw new NotFoundException("Prodavac nije pronađen!");
        }
        return prodavac;
    }

    async vratiProdavca(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const prodavac = await this.vratiProdavcaPoId(id);
        if(!prodavac) {
            throw new NotFoundException("Prodavac nije pronađen!");
        }
        return prodavac;
    }

    async vratiNedostupnogProdavca(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const prodavac = await this.prodavacModel.findById(id).where({ dostupan: false });
        if(!prodavac) {
            throw new NotFoundException("Prodavac nije pronađen!");
        }
        return prodavac;
    }

    async vratiSveNedostupneProdavce() {
        return this.prodavacModel.find({ dostupan: false });
    }

    async vratiProdavcaPoId(id: string) {
        return this.prodavacModel.findById(id).where({ dostupan: true });
    }

    async azurirajProdavca(id: string, prodavacBody: UpdateProdavacBody) {
        const prodavac = await this.vratiProdavcaPoId(id);
        Object.assign(prodavac, prodavacBody);
        await prodavac.save();

        return prodavac;
    }

    async obrisiProdavca(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const prodavac = await this.prodavacModel.findByIdAndDelete(id);
        if(!prodavac) {
            throw new NotFoundException("Prodavac nije pronađen");
        }

        return prodavac;
    }

    async promeniLozinku(changePassword: ChangePassword, id: string) {
        const prodavac = await this.prodavacModel.findById(id).select('lozinka');
        const poklapaSe = await bcrypt.compare(
          changePassword.staraLozinka,
          prodavac.lozinka,
        );
    
        if (!poklapaSe) {
          throw new BadRequestException('Pogrešna stara lozinka!');
        }

        prodavac.lozinka = await bcrypt.hash(changePassword.novaLozinka, 8);
        await prodavac.save();
    
        return { message: 'Lozinka je uspešno promenjena!' };
    }
}