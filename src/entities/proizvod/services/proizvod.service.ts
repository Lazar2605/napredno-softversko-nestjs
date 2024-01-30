import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import mongoose, { Types,  Model, mongo } from "mongoose";
import { ProizvodDocument } from "src/database/entities/proizvod.entity";
import { ProdavacDocument } from "src/database/entities/prodavac.entity";
import { PaginationService } from "src/shared/services/pagination.service";
import { ProdavacService } from "src/entities/prodavac/services/prodavac.service";
import { KategorijaService } from "src/entities/kategorija/services/kategorija.service";
import { KategorijaDocument } from "src/database/entities/kategorija.entity";

@Injectable()
export class ProizvodService {
    constructor(
        @InjectModel(modelNames.PROIZVOD)
        private readonly proizvodModel: Model<ProizvodDocument>,
        private readonly paginationService: PaginationService<ProizvodDocument>,
        private readonly prodavacService: ProdavacService,
        private readonly kategorijaService: KategorijaService,
    ) {}

    async kreirajProizvod(proizvod: any, prodavac: ProdavacDocument, file: Express.Multer.File) {
        return new this.proizvodModel({ ...proizvod, prodavacId: prodavac.id, slikaKljuc: file.originalname, cena: { kolicina: proizvod.kolicina, mera: proizvod.mera, iznos: proizvod.iznos } }).save();
    }

    async vratiProizvodPoId(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Unesi validan id');
        }
        const proizvod = await this.proizvodModel.findById(id).populate("prodavac").populate("kategorija");
        if(!proizvod) {
            throw new NotFoundException("Proizvod ne postoji!");
        }
        return proizvod;
    }

    private getAllSubcategories(categoryId: string, categories: KategorijaDocument[]): string[] {
        const subcategories: string[] = [categoryId];
    
        const children = categories.filter(category => {
            return category.roditeljskaKategorijaId?.toString() === categoryId
        });
        for (const child of children) {
            subcategories.push(...this.getAllSubcategories(child._id, categories));
        }
    
        return subcategories;
    }

    async vratiProizvodeKategorije(queryObject: any, kategorijaId: string) {
        const categories: KategorijaDocument[] = await this.kategorijaService.vratiSveKategorije(); // Pretpostavljajući da imate model za kategorije
        const subcategories = this.getAllSubcategories(kategorijaId, categories);
        const { minCena, maxCena, naziv, grad } = queryObject;
        const filterCriteria: any = {
            $or: [
                { kategorijaId: { $in: subcategories } },
            ]
        };
        if (minCena || maxCena) {
            filterCriteria['$and'] = [];
            if (minCena) {
              filterCriteria['$and'].push({
                'cena.iznos': { $gte: +minCena },
              });
            }
      
            if (maxCena) {
              filterCriteria['$and'].push({
                'cena.iznos': { $lte: +maxCena },
              });
            }
        }
        
        if(naziv) {
            filterCriteria.naziv = naziv;
        }

        if(grad) {
            filterCriteria['prodavac.adresa.grad'] = grad;
        }

        return this.paginationService.paginate(this.proizvodModel, filterCriteria, queryObject);
    }

    async vratiNedostupniProizvod(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Unesi validan id');
        }
        const proizvod = await this.proizvodModel.findById(id).where({ dostupan: false }).populate("prodavac");
        if(!proizvod) {
            throw new NotFoundException("Proizvod nije pronađen!");
        }
        return proizvod;
    }

    async obrisiProizvod(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Unesi validan id');
        }
        const proizvod = await this.proizvodModel.findByIdAndDelete(id);
        if(!proizvod) {
            throw new NotFoundException("Proizvod nije pronađen");
        }

        return proizvod;
    }

    async vratiSveNedostupneProizvode() {
        return this.proizvodModel.find({ dostupan: false }).populate("prodavac");
    }

    async vratiProizvodeProdavca(id: string) {
        const prodavac = await this.prodavacService.vratiProdavcaPoId(id);
        return this.proizvodModel.find({ prodavacId: prodavac.id }).populate("kategorija");
    }

    async azurirajCenu(proizvodId: string, cena: number) {
        const proizvod = await this.vratiProizvodPoId(proizvodId);
        return this.proizvodModel.findOneAndUpdate({ _id: proizvod._id }, { $set: { "cena.iznos": cena } }, { new: true });
    }
}