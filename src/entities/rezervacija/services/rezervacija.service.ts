import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { modelNames } from "src/database/constants/model-names";
import mongoose, { Model } from "mongoose";
import { RezervacijaDocument } from "src/database/entities/rezervacija.entity";
import { KorisnikDocument } from "src/database/entities/korisnik.entity";
import { Kupac } from "src/database/interfaces/kupac.interface";
import { KorpaService } from "src/entities/korpa/services/korpa.service";
import { KreirajRezervaciju } from "src/entities/rezervacija/interfaces/kreiraj-rezervaciju.interface";
import { KorisnikService } from "src/entities/korisnik/services/korisnik.service";
import { ProdavacService } from "src/entities/prodavac/services/prodavac.service";
import { EmailService } from "src/shared/services/email.service";
import { ConfigService } from "@nestjs/config";
import { AvailableConfigs } from "src/config/available-configs";

@Injectable()
export class RezervacijaService {
    constructor(
        @InjectModel(modelNames.REZERVACIJA)
        private readonly rezervacijaModel: Model<RezervacijaDocument>,
        private readonly korpaService: KorpaService,
        private readonly korisnikService: KorisnikService,
        private readonly prodavacService: ProdavacService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async kreirajRezervacijuZaKorisnika(korisnik: KorisnikDocument) {
        const kupac : Kupac = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            imejl: korisnik.imejl,
            adresa: {
                ulica: korisnik.adresa.ulica,
                grad: korisnik.adresa.grad,
                postanskiBroj: korisnik.adresa.postanskiBroj
            },
            brojTelefona: {
                drzavniPozivniBroj: korisnik.brojTelefona.drzavniPozivniBroj,
                broj: korisnik.brojTelefona.broj,
            }
        }

        const datum = new Date();
        datum.setHours(datum.getHours() + 1);
        const korpa = await this.korpaService.vratiKorpuLogovanogKorisnika(korisnik.id);
        if (korpa.proizvodiKolicina.length < 1) {
            throw new BadRequestException("Nemaš ništa u korpi!");
        }
        const retKorpa = new this.rezervacijaModel({ ukupnaCena: korpa.ukupnaCena, prodavacId: korpa.prodavacId, kupac, proizvodiKolicina: korpa.proizvodiKolicina, datum })
        await this.korpaService.obrisiKorpuKorisnik(korisnik.id);
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: korisnik.imejl , subject: "Obaveštenje", text:"Uspešno ste poručili na našem sajtu, sačekajte da prodavac potvrdi vašu porudžbinu."});
        return retKorpa.save();
    }

    async kreirajRezervacijuZaGosta(kupacIHash: KreirajRezervaciju) {
        const korpa = await this.korpaService.vratiKorpuNelogovanogKorisnika(kupacIHash.hash);
        const datum = new Date();
        datum.setHours(datum.getHours() + 1);
        if (korpa.proizvodiKolicina.length < 1) {
            throw new BadRequestException("Nemaš ništa u korpi!");
        }
        const retKorpa = new this.rezervacijaModel({ ukupnaCena: kupacIHash.cena, prodavacId: korpa.prodavacId, kupac: kupacIHash.kupac, proizvodiKolicina: korpa.proizvodiKolicina, datum })
        await this.korpaService.obrisiKorpuGost(kupacIHash.hash);
        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: kupacIHash.kupac.imejl , subject: "Obaveštenje", text:"Uspešno ste poručili na našem sajtu, sačekajte da prodavac potvrdi vašu porudžbinu."});
        return retKorpa.save();
    }

    async vratiSveRezervacijeKorisnika(imejl: string) {
        const korisnik = await this.korisnikService.vratiKorisnikaSaLozinkom(imejl);
        return this.rezervacijaModel.find({ "kupac.imejl": korisnik.imejl}).populate("prodavac").populate("proizvodi");
    }

    async vratiSveRezervacijeProdavca(id: string) {
        const prodavac = await this.prodavacService.vratiProdavcaPoId(id);
        return this.rezervacijaModel.find({ prodavacId: prodavac.id }).populate("proizvodi");
    }

    async vratiRezervacijuPoId(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Unesi validan id');
        }
        const rezervacija = await this.rezervacijaModel.findById(id).populate("proizvodi").populate("prodavac");
        if(!rezervacija) {
            throw new NotFoundException("Rezervacija ne postoji!");
        }
        return rezervacija;
    }

    async promeniStatus(rezervacijaId: string, status: string) {
        const rezervacija = await this.vratiRezervacijuPoId(rezervacijaId);
        rezervacija.status = status;
        await rezervacija.save();
        if(status === "isporučeno") {
            const proizvodiPoruka = rezervacija.proizvodi.map((proizvod, index) => {
                return `${proizvod.naziv} ${proizvod.cena.kolicina}${proizvod.cena.mera} - Cena: ${proizvod.cena.iznos} RSD, Količina: ${rezervacija.proizvodiKolicina[index].kvantitet}`;
              }).join('\n');
            await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: rezervacija.kupac.imejl , subject: "Obaveštenje", text:`Vaša porudžbina je prihvaćena:\nProizvodi: ${proizvodiPoruka} \nUkupna cena: ${rezervacija.ukupnaCena}RSD \nProdavac: ${rezervacija.prodavac.ime} ${rezervacija.prodavac.prezime} Broj telefona: ${rezervacija.prodavac.brojTelefona.drzavniPozivniBroj}${rezervacija.prodavac.brojTelefona.broj}`});
        }
        return rezervacija;
    }

    async obrisiRezervaciju(rezervacijaId: string) {
        const isValidId = mongoose.isValidObjectId(rezervacijaId);

        if (!isValidId) {
            throw new BadRequestException('Unesi validan id');
        }
        const rezervacija = await this.rezervacijaModel.findByIdAndDelete(rezervacijaId).populate("proizvodi").populate("prodavac");
        if(!rezervacija) {
            throw new NotFoundException("Rezervacija nije pronađen");
        }
        const proizvodiPoruka = rezervacija.proizvodi.map((proizvod, index) => {
            return `${proizvod.naziv} ${proizvod.cena.kolicina}${proizvod.cena.mera} - Cena: ${proizvod.cena.iznos} RSD, Količina: ${rezervacija.proizvodiKolicina[index].kvantitet}`;
          }).join('\n');

        await this.emailService.sendEmail({from: this.configService.get(AvailableConfigs.SENDGRID_SENDER_EMAIL), to: rezervacija.kupac.imejl , subject: "Obaveštenje", text:`Vaša porudžbina je odbijena!Proizvodi: ${proizvodiPoruka} \nUkupna cena: ${rezervacija.ukupnaCena}RSD \nProdavac: ${rezervacija.prodavac.ime} ${rezervacija.prodavac.prezime} Broj telefona: ${rezervacija.prodavac.brojTelefona.drzavniPozivniBroj}${rezervacija.prodavac.brojTelefona.broj}`});

        return rezervacija;
    }
}