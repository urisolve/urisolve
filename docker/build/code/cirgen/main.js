$(function(){
    function recolherInformação() {
         return {
             circuto: {
                 AC: $("#isAC")[0].checked,
                 DC: $("#isDC")[0].checked,
                 Malhas: $("#isMalhas")[0].checked,
                 Ramos: $("#isRamos")[0].checked
                  },
             componentes: {
                 Resistência: $("#isResistênca")[0].checked,
                 Condensador: $("#isCondensador")[0].checked,
                 Bobine: $("#isBobine")[0].checked,
                 Massa: $("#isMassa")[0].checked,
                 Fonte_de_corrente: $("#isFonte de corrente")[0].checked,
                 Fonte_de_tensão: $("#isFonte de tensão")[0].checked 
                  }
                }
    }
    function escolherCircuito(){
        return{
            AC: {
                Malhas: $("#isMalhas")[0].checked,
                Ramos: $("#isRamos")[0].checked,
                Nos: $("#isNos")[0].checked           
            },
            DC: {
                Malhas: $("#isMalhas")[0].checked,
                Ramos: $("#isRamos")[0].checked,
                Nos: $("#isNos")[0].checked,
            }

        }

    }
    function preencherCircuito(){
        return{
            Componentes: {
                Resistência: $("#isResistênca")[0].checked,
                Condensador: $("#isCondensador")[0].checked,
                Bobine: $("#isBobine")[0].checked,
                Massa: $("#isMassa")[0].checked,
                Fonte_de_corrente: $("#isFonte de corrente")[0].checked,
                Fonte_de_tensão: $("#isFonte de tensão")[0].checked 

            }
            
        }

    }                             
    function mostrarCircuito(){
        return{
            Circuitos: {
                M1_R1: $("#isM1_R1")[0].checked,
                M2_R3_ESTRELA: $("#isM2_R3_ESTRELA")[0].checked,
                M2_R3: $("#isM2_R3")[0].checked,
                M3_R4: $("#isM3_R4")[0].checked,
                M3_R6_TRIANGULO: $("#isM3_R6_TRIANGULO")[0].checked,
                M4_R5: $("#isM4_R5")[0].checked
            }
            
        }

    } 
});