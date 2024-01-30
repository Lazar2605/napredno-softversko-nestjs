import * as Joi from "joi";
import { RegularExpressions } from "../../constants/regular-expressions";
import { Korisnik } from "src/database/entities/korisnik.entity";

export const createKorisnikValidator = Joi.object<Korisnik>({
    ime: Joi.string().required(),
    prezime: Joi.string().required(),
    imejl: Joi.string().required().email(),
    lozinka: Joi.string().required().regex(RegularExpressions.LOZINKA).required().min(8).max(20),
    adresa: Joi.object({
        ulica: Joi.string().required(),
        grad: Joi.string().required(),
        postanskiBroj: Joi.number().required(),
    }),
    brojTelefona: Joi.object({
        drzavniPozivniBroj: Joi.string().regex(RegularExpressions.DRZAVNI_POZIVNI_BROJ).required(),
        broj: Joi.string().required(),
    }),
    pol: Joi.string().required(),
    jmbg: Joi.string().required(),
}).options({
    stripUnknown: true,
});