const JSON_URL = 'https://opensheet.elk.sh/1yz-JkWidUVkWjqYAcwDuqUHJ4knIudDgOl1Tyr5hMts/Hoja1';

const catalogo = document.getElementById('catalogo');

let seriesMap = {};  // Variable global para almacenar las series

fetch(JSON_URL)
  .then(response => response.json())
  .then(data => {
    seriesMap = {}; // Reiniciar seriesMap

    data.forEach(entry => {
      const key = `${entry.serie} - Temporada ${entry.temporada}`;
      if (!seriesMap[key]) {
        seriesMap[key] = {
          temporada: entry.temporada,
          serie: entry.serie,
          imagen: entry.imagen,
          capitulos: []
        };
      }

      seriesMap[key].capitulos.push({
        episodio: entry.episodio,
        titulo: entry.titulo,
        enlace: entry.enlace,
        imagen: entry.imagen
      });
    });

    const ultimaVista = sessionStorage.getItem('ultimaVista');
    if (ultimaVista) {
      const vista = JSON.parse(ultimaVista);
      if (vista.view === 'capitulos' && seriesMap[vista.key]) {
        renderCapitulos(vista.key, seriesMap[vista.key]);
        return;
      }
    }

    renderVistaPrincipal(seriesMap);
  })
  .catch(error => {
    console.error('Error cargando JSON:', error);
  });

function capituloFormateado(n) {
  const num = parseInt(n);
  return num < 10 ? `0${num}` : `${num}`;
}

function renderVistaPrincipal(seriesMap) {
  catalogo.innerHTML = '';

  const seriesAgrupadas = {};

  Object.entries(seriesMap).forEach(([clave, datos]) => {
    const nombreSerie = datos.serie;
    if (!seriesAgrupadas[nombreSerie]) {
      seriesAgrupadas[nombreSerie] = [];
    }
    seriesAgrupadas[nombreSerie].push({ clave, datos });
  });

  Object.entries(seriesAgrupadas).forEach(([nombreSerie, temporadas]) => {
    const tituloSerie = document.createElement('h2');
    tituloSerie.textContent = nombreSerie;
    tituloSerie.style.color = '#ff4b2b';
    tituloSerie.style.margin = '30px 0 15px 0';
    catalogo.appendChild(tituloSerie);

    const contenedorTemporadas = document.createElement('div');
    contenedorTemporadas.className = 'temporadas-container';

    temporadas.forEach(({ clave, datos }) => {
      const card = document.createElement('a');
      card.className = 'temporada';
      card.href = '#';
      card.addEventListener('click', e => {
        e.preventDefault();
        renderCapitulos(clave, datos);
        sessionStorage.setItem('ultimaVista', JSON.stringify({ view: 'capitulos', key: clave }));
      });

      const img = document.createElement('img');
      img.src = datos.imagen;
      img.alt = clave;

      const span = document.createElement('span');
      span.textContent = clave;

      card.appendChild(img);
      card.appendChild(span);
      contenedorTemporadas.appendChild(card);
    });

    catalogo.appendChild(contenedorTemporadas);
  });

  sessionStorage.setItem('ultimaVista', JSON.stringify({ view: 'principal' }));
}

function renderCapitulos(clave, datos) {
  catalogo.innerHTML = '';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'serie-title';
  titleDiv.textContent = clave;
  catalogo.appendChild(titleDiv);

  const volverBtn = document.createElement('button');
  volverBtn.textContent = '← Volver';
  volverBtn.className = 'volver-btn';
  volverBtn.addEventListener('click', () => {
    sessionStorage.removeItem('ultimaVista'); // limpiar historial
    renderVistaPrincipal(seriesMap); // mostrar vista principal
  });
  catalogo.appendChild(volverBtn);

  const capsDiv = document.createElement('div');
  capsDiv.className = 'capitulos';

  datos.capitulos.forEach(cap => {
    const a = document.createElement('a');
    a.className = 'capitulo';
    a.href = cap.enlace;

    const img = document.createElement('img');
    img.src = cap.imagen;
    img.alt = `${datos.temporada}x${capituloFormateado(cap.episodio)} - ${cap.titulo}`;

    const span = document.createElement('span');
    span.textContent = `${datos.temporada}x${capituloFormateado(cap.episodio)} - ${cap.titulo}`;

    a.appendChild(img);
    a.appendChild(span);
    capsDiv.appendChild(a);
  });

  catalogo.appendChild(capsDiv);
}

// Añadir evento para volver a vista principal al hacer click en el logo o título
document.querySelector('.logo-container').addEventListener('click', () => {
  sessionStorage.removeItem('ultimaVista');
  renderVistaPrincipal(seriesMap);
});
