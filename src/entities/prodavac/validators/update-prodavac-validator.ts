import * as Joi from "joi";
import { RegularExpressions } from "../../constants/regular-expressions";
import { UpdateProdavacBody } from "../interfaces/update-prodavac-body";

export const updateProdavacValidator = Joi.object<UpdateProdavacBody>({
    prezime: Joi.string(),
    adresa: Joi.object({
        ulica: Joi.string().required(),
        grad: Joi.string().required(),
        postanskiBroj: Joi.number().required(),
    }),
    brojTelefona: ({
        drzavniPozivniBroj: Joi.string().regex(RegularExpressions.DRZAVNI_POZIVNI_BROJ).required(),
        broj: Joi.string().required(),
    }),
    nazivPG: Joi.string(),
    registatskiBrojPG: Joi.string(),  // treab regex
    brojRacuna: Joi.string(),  // treba regex
    cenaDostave: Joi.number(),
}).options({
    stripUnknown: true,
});