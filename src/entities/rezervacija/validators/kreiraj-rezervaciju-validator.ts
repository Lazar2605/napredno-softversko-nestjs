import * as Joi from 'joi';
import { RegularExpressions } from '../../constants/regular-expressions';
import { KreirajRezervaciju } from 'src/entities/rezervacija/interfaces/kreiraj-rezervaciju.interface';

export const kreirajRezervacijuValidator = Joi.object<KreirajRezervaciju>({
    kupac: Joi.object({
        ime: Joi.string().required(),
        prezime: Joi.string().required(),
        imejl: Joi.string().required().email(),
        adresa: Joi.object({
            ulica: Joi.string().required(),
            grad: Joi.string().required(),
            postanskiBroj: Joi.number().required(),
        }),
        brojTelefona: Joi.object ({
            drzavniPozivniBroj: Joi.string().regex(RegularExpressions.DRZAVNI_POZIVNI_BROJ).required(),
            broj: Joi.string().required(),
        }),
    }),
    hash: Joi.string().required(),
    cena: Joi.number().required(),
    
}).options({
    stripUnknown: true,
});