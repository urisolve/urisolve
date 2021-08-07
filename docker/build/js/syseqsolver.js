/*
 * Author : André Rocha
 * Email : anr@isep.ipp.pt
 * Source : https://github.com/txroot/syseqsolver
 */

/**
import { createMatrix } from './math';
* Solver function
* @param {math.Matrix} coefMatrix   Coefficients Matrix (An)
* @param {math.Matrix} consMatrix    Constants Matrix (Bn)
* @param {math.Matrix} varMatrix    Variable Matrix (Xn)
* @param {int} decPlaces    Desired Decimal Places
* @returns {math.Matrix}    Code Error: 0 - Success; 1 - Error; 2 - Overflow.
* @returns {math.Matrix}    Solution Matrix
* Teste
*/


function solve( coefMatrix, constMatrix, varMatrix, decPlaces ) {

    var c = coefMatrix;
    var d = constMatrix;
    var o = math.matrix();
    var oi = math.matrix();
    var oit = math.matrix();
    // Get number of Columns and Rows
    var mSize = math.size(c);
    var mRows = mSize._data[0];
    var mCols = mSize._data[1];

    console.log('Starting Job with a ' + mRows + ' x ' + mCols + ' Matrix...');

    // Check if it is a Square Matrix. If not, quits with error code.
    if(mRows != mCols) return 1;

    o.resize([mRows, 1]);
    oi.resize([mRows, 1]);
    oit.resize([mRows, 1]);

    // Get Matrix Determinant
    let det = math.det(c) ;

    for(i=0; i<mCols; i++) {
        let cc = c.clone();
        for(j=0; j<mRows; j++) {
            cc.subset(math.index(j, i), constMatrix.subset(math.index(j,0)));
        }
        let dd = math.det(cc);
        let ii = math.divide(dd,det);

        o.subset(math.index(i, 0), math.round(ii, decPlaces));
        oi.subset(math.index(i, 0), varMatrix.subset(math.index(i,0)));
        oit.subset(math.index(i, 0), prettify(math.round(ii, decPlaces), 1, 1, decPlaces));
    }

    // Produce toTex
    let rx = math.parse(c.toString()).toTex();
    let sx = math.parse(d.toString()).toTex();
    let ox = math.parse(o.toString()).toTex();

    console.log('o = ' + o);
    console.log('oi = ' + oi);
    console.log('oit = ' + oit);
    console.log('Job done!');

    let obj = {
        variables: oi,
        result: o,
        texResult: oit
    };

    return obj;
};

// Component Objects
class linearEqSystem {
    constructor(cpId) {
        this.id = cpId || null,
        this.coefMatrix = math.matrix(),
        this.consMatrix = math.matrix(),
        this.varMatrix = math.matrix(),
        this.decPlaces = math.matrix(),
        this.cRes = math.matrix(),
        this.equatArr = new Array(),
        this.varNames = new Array(),
        this.cols = 0,
        this.rows = 0,
        this.lastVarRow = 0,      // Save last changed index
        this.lastConstRow = 0,
        this.cleanEquations = function() {
            this.equatArr.splice(0, this.equatArr.length)
        },
        this.remEquation = function (pos) {
            this.equatArr[pos] = "";
         },
        this.prepare = function (inc) {
            this.cols = inc.length;
            this.rows = inc.length;

            this.coefMatrix.resize([this.rows, this.cols]);
            this.consMatrix.resize([this.rows, 1]);
            this.varMatrix.resize([this.rows, 1]);
            for(let i=0; i<inc.length; i++) this.varMatrix._data[i] = inc[i];
        },
        this.addEquation = function (leq, inc) {

            let csotxt;
            this.equatArr.push(leq);

            let m = Algebrite.run("simplify(" + leq + ")");

            // AlgebraJS
            m = algebra.parse(m);
            let cs = new algebra.Equation(m, 0);
            csotxt = cs.toString();

            let iterData = new Array();
            // Get variables names and count it
            cs.lhs.terms.forEach(function(tE, tI, tO) {
                tE.variables.forEach(function(vE, vI, vO) {
                    iterData.push(vE.variable);
                });
            });

            // Remove duplicated nodes references
            iterData = iterData.concat(this.varNames);
            let iterUniqueVar = new Array();
            iterUniqueVar = [...new Set(iterData)];

            // Remove i from the variables list
            iterUniqueVar = iterUniqueVar.filter(e => e !== 'i');
            iterUniqueVar.sort();

            // Save the sorted unique variables list
            this.varNames = iterUniqueVar;

        },
        this.buildSystem = function() {
            let errorCode = 0;

            // Insert new equation to Matrix
                // leq is the left hand of the equation, in the text format a11*X1 + a12*X2 + a1n*Xn
                // inc is the variable array for the variables matrix (optional)

            for(let i=0; i<this.equatArr.length; i++) {
                let csotxt;
                let foundVar = new Array();
                let constant = math.complex(0, 0);
                let variables = new Array();
                let m = Algebrite.run("simplify(" + this.equatArr[i] + ")");

                // AlgebraJS
                m = algebra.parse(m);
                let cs = new algebra.Equation(m, 0);

                // Get constant real part
                let reNum = 0;
                let reDen = 1;
                if(cs.lhs.constants.length) reNum = cs.lhs.constants[0].numer;
                if(cs.lhs.constants.length)reDen = cs.lhs.constants[0].denom;
                let reConst = math.divide(reNum, reDen);
                constant.re = reConst;

                // Get constant imaginary part
                cs.lhs.terms.forEach(function(tE, tI, tO) {
                    let num = 0;
                    let den = 1;
                    if(tE.variables.length === 1 && tE.variables[0].variable === 'i') {
                        num = tE.coefficients[0].numer;
                        den = tE.coefficients[0].denom;
                        constant.im = math.divide(num, den);
                    }
                });

                // Get variables values
                let varI = 0;   // var index
                let varN;       // next var

                let mcs = 1;
                let end = false;
                do {
                    switch (mcs) {
                        // Set variable to search for real and imaginary parts
                        case 1: {
                            if(varI >= this.varNames.length) { end = true; break; }
                            varN = this.varNames[varI];
                            varI++;
                            mcs++;
                        }
                        // Search for the values
                        case 2: {
                            // Get and Set variables value
                            let incCoef = math.complex(0, 0);
                            cs.lhs.terms.forEach(function(tE, tI, tO) {
                                let num = 0;
                                let den = 1;
                                let inc = '';
                                let fnd = false;

                                // Real part of the variable
                                if(tE.variables.length === 1) {
                                    inc = tE.variables[0].variable;
                                    if(inc == varN) {
                                        num = tE.coefficients[0].numer;
                                        den = tE.coefficients[0].denom;
                                        incCoef.re = math.divide(num, den);
                                        // Save in the array
                                        let index = variables.findIndex(item => item.ref == varN);
                                        if (index > -1) {
                                            variables[index].re = incCoef.re;
                                        }
                                        else variables.push({ ref: varN, re: incCoef.re, im: incCoef.im });
                                    }
                                }

                                // Imaginary part of the variable
                                if(tE.variables.length === 2 && (tE.variables[0].variable === 'i' || tE.variables[1].variable === 'i' )) {
                                    if(tE.variables[0].variable === 'i') inc = tE.variables[1].variable;
                                    if(tE.variables[1].variable === 'i') inc = tE.variables[0].variable;
                                    if(inc == varN) {
                                        num = tE.coefficients[0].numer;
                                        den = tE.coefficients[0].denom;
                                        incCoef.im = math.divide(num, den);
                                        // Save in the array
                                        let index = variables.findIndex(item => item.ref == varN);
                                        if (index > -1) {
                                            variables[index].im = incCoef.im;
                                        }
                                        else variables.push({ ref: varN, re: incCoef.re, im: incCoef.im });
                                    }
                                }
                            });
                            mcs--;

                        }
                        default:
                            break;
                    }
                } while (!end);

                // Set data in the corresponding matrix

                // If the object is empty, do some initializations
                if(this.cols == 0 ) this.prepare(this.varNames);

                // Add constant
                let addCon = math.subtract(0, constant);
                this.consMatrix.subset(math.index(this.lastConstRow, 0), addCon);
                this.lastConstRow++;

                // Add variables
                let thisEqSys = this;
                variables.forEach(function(tE, tI, tO) {
                    let vS = thisEqSys.varMatrix._size[0];
                    for(let i=0; i<vS; i++) {
                        let thisVar = thisEqSys.varMatrix.subset(math.index(i, 0));
                        if(thisVar == tE.ref) {
                            let thisCoef = math.complex(tE.re, tE.im);
                            thisEqSys.coefMatrix.subset(math.index(thisEqSys.lastVarRow, i), thisCoef);
                        }
                    }
                });
                this.lastVarRow++;

                csotxt = cs.toString();
                console.log(cs.toTex());

            }

            return {
                errorCode:   errorCode
            };

        };
    }
}