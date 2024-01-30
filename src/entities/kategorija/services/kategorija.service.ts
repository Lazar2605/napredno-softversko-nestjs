import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import mongoose, { Model } from "mongoose";
import { Kategorija, KategorijaDocument } from "src/database/entities/kategorija.entity";

@Injectable()
export class KategorijaService {
    constructor(
        @InjectModel(modelNames.KATEGORIJA)
        private readonly kategorijaModel: Model<KategorijaDocument>
    ) {}

    async kreirajKategoriju(kategorija: Kategorija) {
        return new this.kategorijaModel(kategorija).save();
    }

    async kreirajDostupnuKategoriju(kategorija: Kategorija) {
        return new this.kategorijaModel({ ...kategorija, dostupna: true }).save();
    }

    async vratiSvePrimarneKategorije() {
        return this.kategorijaModel.find({ dostupna: true, roditeljskaKategorijaId: { $exists: false } });
    }

    async vratiSveKategorije() {
        return this.kategorijaModel.find({ dostupna: true }).populate("roditeljska");
    }

    async vratiNedostupnuKategoriju(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const kategorija = await this.kategorijaModel.findById(id).where({ dostupna: false });
        if(!kategorija) {
            throw new NotFoundException("Kategorija nije pronađena!");
        }
        return kategorija;
    }

    async obrisiKategoriju(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Unesi validan id');
        }
        const kategorija = await this.kategorijaModel.findByIdAndDelete(id);
        if(!kategorija) {
            throw new NotFoundException("Kategorija nije pronađena");
        }

        return kategorija;
    }

    async vratiSveNedostupneKategorije() {
        return this.kategorijaModel.find({ dostupna: false });
    }

    async vratiKategorijuPoId(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Unesi validan id');
        }
        const kategorija = await this.kategorijaModel.findById(id).populate("cerkeKategorije");
        if(!kategorija) {
            throw new NotFoundException("Kategorija ne postoji!");
        }
        return kategorija;
    }

    async izmeniKategoriju(kategorijaBody: Kategorija, id: string) {
        const kategorija = await this.vratiKategorijuPoId(id);
        Object.assign(kategorija, kategorijaBody);
        await kategorija.save();

        return kategorija;
    }


}