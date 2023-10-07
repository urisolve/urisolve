$(function(){
    function recolherInformação() {
         return {
             circuto: {
                 AC: $("#isAC")[0].checked,
                 DC: $("#isDC")[0].checked,
                 Nos: $("#isNos")[0].checked,    
                 Malhas: $("#isMalhas")[0].checked,
                 Ramos: $("#isRamos")[0].checked
                  },
             componentes: {
                 Resistência: $("#isResistênca")[0].checked,
                 Condensador: $("#isCondensador")[0].checked,
                 Bobine: $("#isBobine")[0].checked,
               
                 Fonte_de_corrente: $("#isFonte de corrente")[0].checked,
                 Fonte_de_tensão: $("#isFonte de tensão")[0].checked 
                  }
                }
    }
    function escolherCircuito(escolhasutilizador){
        return{
            const listaDeNomes = ["NO_R1_M1.json","N2_R3_M2_ESTRELA.json","N2_R3_M2.json","N2_R4_M3.json","N2_R5_M4.json"."N4_R6_M3_TRIANGULO.json"];
            const listaDeCircuitos = listaDeNomes.map(nome =>{
                const partes = nome.match(/N(\d+)_R(\d+)_M(\d+)\.json/);
                if (partes){
                    return{
                        nome_original:nome,
                        N:parselnt(partes[1]),
                        R:parselnt(partes[2]),
                        M:parselnt(partes[3])
                    };
                }else{
                    throw new Error('Nome de arquivo inválido:${nome}');
                }
            }),
            const criterios = {N:[],R:[],M:[]},
            const circuitosFiltrados=listaDeCircuitos.filter(circuito =>{
                return(
                    circuito.N===criterios.N&&
                    circuito.R===criterios.R&&
                    circuito.M===criterios.M);
            }),
            
            if(circuitosFiltrados.length===0){
                throw new Error("Nenhum circuito satisfaz os critérios.");
            }else if(circuitosFiltrados.length===1){
                const nomeEscolhido=circuitosFiltrados[0].nome_original;
                fetch('/lista_nomes_circuitos')
                .then(responde => responde.json())
                .then(data =>{
                    if(data.error){
                        console.error(data.error);
                    }else{
                        const nomesEscolhidos=data.files;
                        console.log('Circuito escolhido: ${nomeEscolhido}');
                  }
                    })
                    .catch(error=>{
                        console.error('Erro na solicitação:', error);
                    });
                    else{
                        const indiceAleatorio = Match.floor(Math.random()*circuitosFiltrados.length);
                        const nomeAleatorio = circuitosFiltrados[indiceAleatorio].nome_original;
                        fetch('/lista_nomes_circuitos')
                        .then(responde => responde.json())
                        .then(data =>{
                             if(data.error){
                                console.error(data.error);
                             }else{
                                const nomesEscolhidos=data.files;
                                console.log('Circuito escolhido aleatoriamente: ${nomeAleatorio}');
                  }
                    })
                    .catch(error=>{
                        console.error('Erro na solicitação:', error);
                    });
                }
            }
        }
    }
    function alterarCircuito(){
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