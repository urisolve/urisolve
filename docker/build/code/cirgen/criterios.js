function criterios(circuito){
    const nos = circuito.nos.length;
    const ramos = circuito.ramos.length;
    const malhas = circuito.malhas.length;
    
    return {N:nos, R:ramos, M:malhas};

}