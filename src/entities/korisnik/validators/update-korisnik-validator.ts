import * as Joi from "joi";
import { RegularExpressions } from "../../constants/regular-expressions";
import { UpdateKorisnikBody } from "../interfaces/update-korisnik-body";

export const updateKorisnikValidator = Joi.object<UpdateKorisnikBody>({
    prezime: Joi.string(),
    adresa: Joi.object({
        ulica: Joi.string().required(),
        grad: Joi.string().required(),
        postanskiBroj: Joi.number().required(),
    }),
    brojTelefona: Joi.object ({
        drzavniPozivniBroj: Joi.string().regex(RegularExpressions.DRZAVNI_POZIVNI_BROJ).required(),
        broj: Joi.string().required(),
    }),
}).options({
    stripUnknown: true,
});