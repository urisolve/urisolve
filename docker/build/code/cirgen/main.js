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
                Ramos: $("#Ramos")[0].checked,
                Nos: $("#Nos")[0].checked           
            },
            DC: {
                Malhas: $("#isMalhas")[0].checked,
                Ramos: $("#Ramos")[0].checked,
                Nos: $("#Nos")[0].checked,
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
            
        }

    } 
});