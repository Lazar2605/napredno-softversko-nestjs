export const RegularExpressions = {
    LOZINKA: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/,
    DRZAVNI_POZIVNI_BROJ: /^[+]{1}(?:[0-9\-\(\)\/\.]\s?){2,5}$/
}