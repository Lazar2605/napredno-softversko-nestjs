import * as Joi from "joi";
import { Kategorija } from "src/database/entities/kategorija.entity";

export const createKategorijaValidator = Joi.object<Kategorija>({
    naziv: Joi.string().required(),
    roditeljskaKategorijaId: Joi.string(),
}).options({
    stripUnknown: true,
});