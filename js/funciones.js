$(document).ready(function () {

});

var primo = null;

/* The only even prime number is 2. 
All other even numbers can be divided by 2.
If the sum of a number's digits is a multiple of 3, that number can be divided by 3.
No prime number greater than 5 ends in a 5. Any number greater than 5 that ends in a 5 can be divided by 5.
Zero and 1 are not considered prime numbers.
Except for 0 and 1, a number is either a prime number or a composite number. 
A composite number is defined as any number, greater than 1, that is not prime.
*/

var numerosPrimos = [
    2, 3, 5, 7, 11, 13, 17, 19, 23,
    29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
    71, 73, 79, 83, 89, 97, 101, 103, 107, 109,
    113, 127, 131, 137, 139, 149, 151, 157, 163, 167,
    173, 179, 181, 191, 193, 197, 199, 211, 223, 227,
    229, 233, 239, 241, 251, 257, 263, 269, 271, 277,
    281, 283, 293, 307, 311, 313, 317, 331, 337, 347,
    349, 353, 359, 367, 373, 379, 383, 389, 397, 401,
    409, 419, 421, 431, 433, 439, 443, 449, 457, 461,
    463, 467, 479, 487, 491, 499, 503, 509, 521, 523,
    541, 547, 557, 563, 569, 571, 577, 587, 593, 599,
    601, 607, 613, 617, 619, 631, 641, 643, 647, 653,
    659, 661, 673, 677, 683, 691, 701, 709, 719, 727,
    733, 739, 743, 751, 757, 761, 769, 773, 787, 797,
    809, 811, 821, 823, 827, 829, 839, 853, 857, 859,
    863, 877, 881, 883, 887, 907, 911, 919, 929, 937,
    941, 947, 953, 967, 971, 977, 983, 991, 997
];  // numeros primos hasta 1000

function parteDecimal(numero) {
    n = Math.abs(numero); // transforma a positivo en caso de ser negativo
    var parteDecimal = n - Math.floor(n) // obtiene parte decimal solamente
    return parteDecimal;   // (type: number) 153.5 -> resultado === 0.5; 22 -> resultado === 0
}

function esPrimo(numeroUsuario) {
    var vueltas = 0;
    while ( vueltas < numerosPrimos.length ) {
        // 168 vueltas
        for ( var elemento of numerosPrimos ) {
            var resultado = numeroUsuario / elemento;
            console.log(resultado + " = " + numeroUsuario + " / " + elemento);
            if ( parteDecimal(resultado) == 0 && elemento != numeroUsuario ) {
                primo = false;
                return primo; 
            } else {
                primo = true;
            }
            vueltas++;
        }
    }
    return primo;
}