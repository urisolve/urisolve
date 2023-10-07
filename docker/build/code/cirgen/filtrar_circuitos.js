function filtrarCircuitos(circuitos) {
    let circuitosFiltrados = circuitos.filter(circuito => {
        return circuito.tipo === "Tipo desejado";
    
    });
    if (circuitoFiltrados.length === 0) {
        throw new Error("Nenhum circuito satisfaz os critérios de filtro.");
    }
    // Se ainda houver múltiplos após o filtro sequencial, escolha aleatoriamente um deles
    if (circuitosFiltrados.length > 1) {
      const indiceAleatorio = Math.floor(Math.random() * circuitosFiltrados.length);
      return circuitosFiltrados[indiceAleatorio];
    }
    // Se apenas um circuito passar pelos critérios de filtro, retorne-o
    return circuitosFiltrados[0];
  

  try {
    const circuitoSelecionado = filtrarCircuitos(circuitos);
    console.log("Circuito selecionado:", circuitoSelecionado.nome);
  } catch (error) {
    console.error(error.message);
  }
}
 
  
  
  