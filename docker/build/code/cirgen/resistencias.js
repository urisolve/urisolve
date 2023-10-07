function todosSaoResistencias(circuto){
   for (const componente of alterarCircuito.componentes){
    if (componente.tipo !== "resistencia") {
        return false;
    }
   } 
   return true;
}