import * as Joi from "joi";
import { Proizvod } from "src/database/entities/proizvod.entity";

export const createKategorijaValidator = Joi.object<Proizvod>({
    naziv: Joi.string().required(),
    opis: Joi.string().trim(),
    cena: Joi.object({
        kolicina: Joi.number().required(),
        mera: Joi.string().required(),
        iznos: Joi.number().required()
    })

}).options({
    stripUnknown: true,
});