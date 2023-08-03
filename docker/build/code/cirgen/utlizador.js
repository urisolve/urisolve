Função que carrega o ficheiro do servidor para o cliente: 

function fetchFileFromServer(relativePath) {
  const absoluteUrl = new URL(relativePath, window.location.origin).href;
  return fetch(absoluteUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .catch(error => {
      console.error('Error fetching the file:', error);
      throw error;
    });
}

Como utilizar a função no código:

fetchFileFromServer(circuitUrl)
    .then(text => {
      // colocar aqui o código seguinte, sendo que "text" é o conteúdo do ficheiro
    })
    .catch(error => {
      // Caso não resulte corre esta função (possibilidade de mostrar erro ao utilizador)
    });
