import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import { Model } from "mongoose";
import { KorpaDocument } from "src/database/entities/korpa.entity";
import { ProizvodService } from "src/entities/proizvod/services/proizvod.service";

@Injectable()
export class KorpaService {
    constructor(
        @InjectModel(modelNames.KORPA)
        private readonly korpaModel: Model<KorpaDocument>,
        private readonly proizvodService: ProizvodService,
    ) {}

    async vratiKorpuLogovanogKorisnika(id: string) {
        const korpa = await this.korpaModel.findOne({ kupacId: id}).populate("proizvodi").populate("prodavac");
        if(!korpa) {
            throw new NotFoundException("Korpa nije pronađena!");
        }
        return korpa;
    }

    
    async vratiKorpuNelogovanogKorisnika(hash: string) {
        const korpa = await this.korpaModel.findOne({ hashZaNelogovanogKupca: hash}).populate("proizvodi").populate("prodavac");
        if(!korpa) {
            throw new NotFoundException("Korpa nije pronađena!");
        }
        return korpa;

        
    }

    async dodajProizvodUKorpuZaKorisnika(id: string, proizvodId: string, kvantitet: number, novaCena: number) {
        let [korpa, proizvod] = await Promise.all([this.korpaModel.findOne({ kupacId: id }), this.proizvodService.vratiProizvodPoId(proizvodId)]);
        if (!korpa) {
            korpa = await this.kreirajKorpuZaKorisnika(id);
            korpa.prodavacId = proizvod.prodavac._id;
        }
        let pom = 0;
        if ((korpa.prodavacId) && (korpa.prodavacId.toString() !== proizvod.prodavac._id.toString())) {
            korpa.proizvodiKolicina.splice(0, korpa.proizvodiKolicina.length);
            korpa.prodavacId = proizvod.prodavac._id;
            pom = 1;
        }
        let flag = 0;
        korpa.proizvodiKolicina.map(pk => {
            if (pk.proizvodId.toString() === proizvodId) {
                pk.kvantitet += kvantitet;
                flag = 1;
                return;
            }
        })
        korpa.prodavacId = proizvod.prodavac._id;
        if (flag === 0)
            korpa.proizvodiKolicina.push({ proizvodId: proizvod._id, kvantitet });
        korpa.ukupnaCena += novaCena;
        await korpa.save();
        return { korpa, flag: pom }
    }

    async dodajProizvodUKorpuZaGosta(hash: string, proizvodId: string, kvantitet: number) {
        let [korpa, proizvod] = await Promise.all([this.korpaModel.findOne({ hashZaNelogovanogKupca: hash }), this.proizvodService.vratiProizvodPoId(proizvodId)]);
        if (!korpa) {
            korpa = await this.kreirajKorpuZaGosta(hash);
            korpa.prodavacId = proizvod.prodavac._id;
        }
        let pom = 0;
        if (korpa.prodavacId.toString() !== proizvod.prodavac._id.toString()) {
            korpa.proizvodiKolicina.splice(0, korpa.proizvodiKolicina.length);
            korpa.prodavacId = proizvod.prodavac._id;
            pom = 1;
        }
        let flag = 0;
        korpa.proizvodiKolicina.map(pk => {
            if (pk.proizvodId.toString() === proizvodId) {
                pk.kvantitet += kvantitet;
                flag = 1;
                return;
            }
        })
        korpa.prodavacId = proizvod.prodavac._id;
        if (flag === 0)
            korpa.proizvodiKolicina.push({ proizvodId: proizvod._id, kvantitet });
        await korpa.save();
        return { korpa, flag: pom }
    }

    async kreirajKorpuZaKorisnika(id: string) {
        return new this.korpaModel({ kupacId: id, ukupnaCena: 0 }).save();
    }

    async kreirajKorpuZaGosta(hash: string) {
        return new this.korpaModel({ hashZaNelogovanogKupca: hash, ukupnaCena: 0 }).save();
    }

    async izmeniKvantitetGost(hash: string, kvantitet: number, proizvodId: string) {
        let [korpa, proizvod] = await Promise.all([this.vratiKorpuNelogovanogKorisnika(hash), this.proizvodService.vratiProizvodPoId(proizvodId)]);
        let flag = 0;
        let stariKvantitet;
        korpa.proizvodiKolicina.map(async (p) => {
            if(p.proizvodId.toString() === proizvod.id) 
            {
                stariKvantitet = p.kvantitet;
                if(kvantitet === 0) {
                    flag = 1;
                    return;
                }
                p.kvantitet = kvantitet;
                return;
            }
        })
        console.log(korpa);
        if (stariKvantitet > kvantitet)
            console.log(korpa.ukupnaCena);
            console.log(stariKvantitet);
            console.log(kvantitet);
            console.log(proizvod.cena.iznos);
            korpa.ukupnaCena -= Math.abs(stariKvantitet - kvantitet) * proizvod.cena.iznos;
        if(kvantitet > stariKvantitet)
            korpa.ukupnaCena += Math.abs(stariKvantitet - kvantitet) * proizvod.cena.iznos;
        if(flag === 1) {
            korpa.proizvodiKolicina = await this.obrisiProizvodIzKorpe(korpa, proizvodId);
        }
        
        if (stariKvantitet > kvantitet)
            korpa.ukupnaCena -= Math.abs(stariKvantitet - kvantitet) * proizvod.cena.iznos;
        if(kvantitet > stariKvantitet)
            korpa.ukupnaCena += Math.abs(stariKvantitet - kvantitet) * proizvod.cena.iznos;
        return korpa.save();
    }

    
    async izmeniKvantitetKorisnik(id: string, kvantitet: number, proizvodId: string) {
        let [korpa, proizvod] = await Promise.all([this.vratiKorpuLogovanogKorisnika(id), this.proizvodService.vratiProizvodPoId(proizvodId)]);
        let flag = 0;
        let stariKvantitet;
        korpa.proizvodiKolicina.map(async (p) => {
            if(p.proizvodId.toString() === proizvod.id) 
            {
                stariKvantitet = p.kvantitet;
                if(kvantitet === 0) {
                    flag = 1;
                    return;
                }
                p.kvantitet = kvantitet;
                return;
            }
        })

        if (stariKvantitet > kvantitet)
            korpa.ukupnaCena -= Math.abs(stariKvantitet - kvantitet) * proizvod.cena.iznos;
        if(kvantitet > stariKvantitet)
            korpa.ukupnaCena += Math.abs(stariKvantitet - kvantitet) * proizvod.cena.iznos;

        if(flag === 1) {
            korpa.proizvodiKolicina = await this.obrisiProizvodIzKorpe(korpa, proizvodId);
        }

        return korpa.save();
    }

    async obrisiProizvodIzKorpe(korpa: KorpaDocument, proizvodId: string) {
        const index = korpa.proizvodiKolicina.findIndex(proizvod => proizvod.proizvodId.toString() === proizvodId);
        const index2 = korpa.proizvodi.findIndex(proizvod => proizvod.id.toString() === proizvodId)
        if (index !== -1) {
            korpa.proizvodiKolicina.splice(index, 1);
        }
        if (index2 !== -1) {
            korpa.proizvodi.splice(index, 1);
        }
    
        return korpa.proizvodiKolicina;
    }

    async obrisiKorpuKorisnik(id: string) {
        const korpa = await this.vratiKorpuLogovanogKorisnika(id);
        return this.korpaModel.deleteOne({ kupacId: korpa.kupacId });
    }

    async obrisiKorpuGost(hash: string) {
        const korpa = await this.vratiKorpuNelogovanogKorisnika(hash);
        return this.korpaModel.deleteOne({ hashZaNelogovanogKupca: korpa.hashZaNelogovanogKupca });
    }


}