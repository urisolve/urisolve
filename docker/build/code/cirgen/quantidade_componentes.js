function verificarNumeroDeComponentes(circuito, componentesEscolhidos) {
    const numeroDeComponentesPresentes = circuito.componentes.length;
    const numeroDeComponentesEscolhidos = componentesEscolhidos.length;
  
    if (numeroDeComponentesEscolhidos < numeroDeComponentesPresentes) {
      // Se o número de componentes escolhidos for menor que os componentes presentes
      const componentesEmFalta = numeroDeComponentesPresentes - numeroDeComponentesEscolhidos;
      console.warn(`Aviso: Faltam ${componentesEmFalta} componentes para preencher o circuito.`);

    } else if (numeroDeComponentesEscolhidos > numeroDeComponentesPresentes) {
      // Se o número de componentes escolhidos for maior que os componentes presentes
      const componentesEmExcesso = numeroDeComponentesEscolhidos - numeroDeComponentesPresentes;
      console.warn(`Aviso: Você selecionou ${componentesEmExcesso} componentes a mais do que o necessário.`);
      
    } else {
      // Se o número de componentes escolhidos for igual aos componentes presentes, não há aviso.
      console.log("Número de componentes escolhidos é igual aos componentes presentes.");
    }
  }
  