import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import { Model } from "mongoose";
import { OcenaDocument } from "src/database/entities/ocena.entity";
import { ProizvodService } from "src/entities/proizvod/services/proizvod.service";
import { ProdavacService } from "src/entities/prodavac/services/prodavac.service";
import { RezervacijaService } from "src/entities/rezervacija/services/rezervacija.service";
import { ProdavacDocument } from "src/database/entities/prodavac.entity";
import { EmailService } from "src/shared/services/email.service";
import { ConfigService } from "@nestjs/config";
import { AvailableConfigs } from "src/config/available-configs";

@Injectable()
export class OcenaService {
    constructor(
        @InjectModel(modelNames.OCENA)
        private readonly ocenaModel: Model<OcenaDocument>,
        private readonly proizvodService: ProizvodService,
        private readonly prodavacService: ProdavacService,
        private readonly rezervacijaService: RezervacijaService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async kreirajOcenu(kupacId: string, brojZvezdica: number, rezervacijaId: string, datumIVreme: string, komentar: string) {
        const ocena = new this.ocenaModel({ kupacId, brojZvezdica, rezervacijaId, datumIVreme, komentar }).save();
        const rezervacija = await this.rezervacijaService.vratiRezervacijuPoId(rezervacijaId);
        const prodavac = await this.prodavacService.vratiProdavcaPoId(rezervacija.prodavacId.toString());
        const novaProsecnaOcena = await this.izracunajProsecnuOcenu(prodavac);
        prodavac.prosecnaOcena = novaProsecnaOcena;
        await prodavac.save();
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: rezervacija.prodavac.imejl , subject: "Obaveštenje", text:`Korisnik ${rezervacija.kupac.ime} ${rezervacija.kupac.prezime} je ocenio vašu porudžbinu:\nOcena: ${brojZvezdica}\nKomentar: ${komentar}`});
        return ocena;
    }

    async izracunajProsecnuOcenu(prodavac: ProdavacDocument) {
      let ocene = await this.ocenaModel.find({}).populate("rezervacija");
      ocene = ocene.filter(ocena => 
        ocena.rezervacija.prodavacId.toString() === prodavac.id
      )
      const ukupanZbir = ocene.reduce((ukupno, ocena) => {
          return ukupno + ocena.brojZvezdica;
      }, 0);

      return ukupanZbir/ocene.length;
    }

    async vratiSveKomentareZaProdavca(prodavacId: string) {
        const ocene = await this.ocenaModel.find({}).populate("rezervacija").sort({datumIVreme: -1});
        const oceneMap = ocene.filter(ocena => 
            ocena.rezervacija.prodavacId.toString() === prodavacId)
        const oceneSaProizvodima = [];

        for (const ocena of oceneMap) {
          const proizvodiKolicina = await Promise.all(
            ocena.rezervacija.proizvodiKolicina.map(async (pk) => {
              const proizvod = await this.proizvodService.vratiProizvodPoId(pk.proizvodId.toString());
              return { proizvod, kvantitet: pk.kvantitet };
            })
          );
    
          const ocenaSaProizvodima = {
            _id: ocena._id,
            brojZvezdica: ocena.brojZvezdica,
            komentar: ocena.komentar,
            datumIVreme: ocena.datumIVreme,
            kupacId: ocena.kupacId,
            rezervacijaId: ocena.rezervacijaId,
            rezervacija: {
              _id: ocena.rezervacija._id,
              ukupnaCena: ocena.rezervacija.ukupnaCena,
              prodavacId: ocena.rezervacija.prodavacId,
              kupac: ocena.rezervacija.kupac,
              proizvodiKolicina: proizvodiKolicina,
              datum: ocena.rezervacija.datum,
              status: ocena.rezervacija.status,
            },
          };
    
          oceneSaProizvodima.push(ocenaSaProizvodima);
        }
    
        return oceneSaProizvodima;

        
        
    }
}