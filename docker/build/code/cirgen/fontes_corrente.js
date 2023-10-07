function verificaCircuitos(circuito) {
    const fontesDeCorrente = circuito.fontes_de_corrente;
    const ramos = circuito.ramos;
  
    // Verifica se todas as fontes de corrente estão preenchidas em primeiro lugar
    for (let i = 0; i < ramos.length; i++) {
      const ramo = ramos[i];
      if (!fontesDeCorrente.some(fonte => fonte.nome === ramo.fonte_de_corrente)) {
        throw new Error(`A fonte de corrente no Ramo ${ramo.nome} não foi definida.`);
      }
    }
  
    // Verifica se cada ramo tem apenas uma fonte de corrente
    for (let i = 0; i < ramos.length; i++) {
      const ramo = ramos[i];
      const fontesRelacionadas = ramos.filter(r => r.fonte_de_corrente === ramo.fonte_de_corrente);
      if (fontesRelacionadas.length > 1) {
        throw new Error(`O Ramo ${ramo.nome} possui mais de uma fonte de corrente.`);
      }
    }
  
    console.log("Verificação concluída com sucesso.");
  }
  
  