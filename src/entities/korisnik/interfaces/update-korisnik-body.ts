import { Adresa } from "src/database/interfaces/adresa.interface"
import { BrojTelefona } from "src/database/interfaces/broj-telefona.interface"

export interface UpdateKorisnikBody {
    prezime: string;
    adresa: Adresa;
    brojTelefona: BrojTelefona;
}