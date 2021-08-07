/*
 * Author : André Rocha
 * Email : anr@isep.ipp.pt
 * Source : https://github.com/txroot/syseqsolver
 */

/**
import { createMatrix } from './math';
* Prettify function
* @param {*} inpNumber   Input number to prettify
* @param {int} outRepres    Desired Output Representation: 0 - Cartesian; 1 - Polar; 2 - Exponential.
* @param {int} outFormat    Output format: 0 - Plain Text; 1 - TeX Format.
* @param {int} decPlaces    Desired Decimal Places
* @returns {string}    Return a Prettified Number
*/

function prettify( inpNumber, outRepres, outFormat, decPlaces ) {

    var pretNumber;

    // To do - Check and filter parameters type
    switch (outRepres) {
        case 1:
            // This function is not OK - 03-12-2019
            var rO = inpNumber.abs();
            var phiO = math.multiply(inpNumber.arg(), math.divide(180,math.pi)) ;

            if(outFormat === 1) {
                var outNumber = '' + math.round(rO, decPlaces) + '\\angle{' + math.round(phiO, decPlaces) + '^{\\circ}}';
                return outNumber;
            }
            else {
                var outNumber = '' + math.round(rO, decPlaces) + ', ' + math.round(phiO, decPlaces);
                return outNumber;
            }
            console.log('R= ' + rO +  ' phi= ' + phiO);
            break;
        case 2:

            break;
        default:
            // Convert from Polar to Cartesian
            var outNumber = math.complex( { r: inpNumber.abs(), phi: inpNumber.arg() });
            console.log('in = ' + inpNumber + ' out= ' + outNumber);
    }
    return pretNumber;
}