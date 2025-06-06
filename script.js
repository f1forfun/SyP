const JSON_URL = 'https://opensheet.elk.sh/1yz-JkWidUVkWjqYAcwDuqUHJ4knIudDgOl1Tyr5hMts/Hoja1';

const catalogo = document.getElementById('catalogo');

let temporadasList = [];  // Lista ordenada de temporadas con capítulos

fetch(JSON_URL)
  .then(response => response.json())
  .then(data => {
    temporadasList = [];
    const temporadasSet = new Set();

    data.forEach(entry => {
      const key = `${entry.serie} - Temporada ${entry.temporada}`;
      if (!temporadasSet.has(key)) {
        temporadasSet.add(key);
        temporadasList.push({
          key,
          temporada: entry.temporada,
          serie: entry.serie,
          imagen: entry.imagen,
          capitulos: []
        });
      }
    });

    data.forEach(entry => {
      const key = `${entry.serie} - Temporada ${entry.temporada}`;
      const temporada = temporadasList.find(t => t.key === key);
      if (temporada) {
        temporada.capitulos.push({
          episodio: entry.episodio,
          titulo: entry.titulo,
          enlace: entry.enlace,
          enlace2: entry.enlace2,
          imagen: entry.imagen
        });
      }
    });

    const ultimaVista = sessionStorage.getItem('ultimaVista');
    if (ultimaVista) {
      const vista = JSON.parse(ultimaVista);
      if (vista.view === 'capitulos') {
        const temporada = temporadasList.find(t => t.key === vista.key);
        if (temporada) {
          renderCapitulos(vista.key, temporada);
          return;
        }
      }
    }

    renderVistaPrincipalConOrden(temporadasList);
  })
  .catch(error => {
    console.error('Error cargando JSON:', error);
  });

function capituloFormateado(n) {
  const num = parseInt(n);
  return num < 10 ? `0${num}` : `${num}`;
}

function renderVistaPrincipalConOrden(temporadasList) {
  catalogo.innerHTML = '';

  let currentSerie = null;
  let contenedorTemporadas;

  temporadasList.forEach(({ key, temporada, serie, imagen, capitulos }) => {
    if (serie !== currentSerie) {
      currentSerie = serie;
      const tituloSerie = document.createElement('h2');
      tituloSerie.textContent = serie;
      tituloSerie.style.color = '#ff4b2b';
      tituloSerie.style.margin = '30px 0 15px 0';
      catalogo.appendChild(tituloSerie);

      contenedorTemporadas = document.createElement('div');
      contenedorTemporadas.className = 'temporadas-container';
      catalogo.appendChild(contenedorTemporadas);
    }

    const card = document.createElement('a');
    card.className = 'temporada';
    card.href = '#';
    card.addEventListener('click', e => {
      e.preventDefault();
      renderCapitulos(key, { temporada, serie, imagen, capitulos });
      sessionStorage.setItem('ultimaVista', JSON.stringify({ view: 'capitulos', key }));
    });

    const img = document.createElement('img');
    img.src = imagen;
    img.alt = key;

    const span = document.createElement('span');
    span.textContent = key;

    card.appendChild(img);
    card.appendChild(span);
    contenedorTemporadas.appendChild(card);
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
    sessionStorage.removeItem('ultimaVista');
    renderVistaPrincipalConOrden(temporadasList);
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

    if (cap.enlace2 && cap.enlace2.trim() !== '') {
      a.href = '#';
      a.addEventListener('click', e => {
        e.preventDefault();
        mostrarOpcionesEnlaces(cap.enlace, cap.enlace2);
      });
    }

    capsDiv.appendChild(a);
  });

  catalogo.appendChild(capsDiv);
}

function mostrarOpcionesEnlaces(enlace1, enlace2) {
  // Crear overlay
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  });

  // Crear cuadro modal
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    backgroundColor: '#121212',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '320px',
    width: '90%',
    boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
  });

  // Texto pregunta
  const pregunta = document.createElement('p');
  pregunta.textContent = '¿Qué enlace quieres abrir?';
  Object.assign(pregunta.style, {
    color: '#fff',
    fontSize: '18px',
    marginBottom: '20px',
    fontWeight: '600',
  });

  // Botón Enlace 1
  const btn1 = document.createElement('button');
  btn1.textContent = 'Enlace 1';
  Object.assign(btn1.style, {
    backgroundColor: '#ff4b2b',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    flex: '1',
    marginRight: '12px',
  });
  btn1.addEventListener('click', () => {
    window.location.href = enlace1;
    document.body.removeChild(overlay);
  });

  // Botón Enlace 2 (naranja más suave)
  const btn2 = document.createElement('button');
  btn2.textContent = 'Enlace 2';
  Object.assign(btn2.style, {
    backgroundColor: '#ff7a66',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    flex: '1',
  });
  btn2.addEventListener('click', () => {
    window.location.href = enlace2;
    document.body.removeChild(overlay);
  });

  // Botón cerrar
  const cerrarBtn = document.createElement('button');
  cerrarBtn.textContent = 'Cerrar';
  Object.assign(cerrarBtn.style, {
    marginTop: '20px',
    backgroundColor: '#555',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  });
  cerrarBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  // Contenedor de botones enlaces (flex)
  const btnContainer = document.createElement('div');
  Object.assign(btnContainer.style, {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  });

  btnContainer.appendChild(btn1);
  btnContainer.appendChild(btn2);

  modal.appendChild(pregunta);
  modal.appendChild(btnContainer);
  modal.appendChild(cerrarBtn);
  overlay.appendChild(modal);

  document.body.appendChild(overlay);
}

// Evento para volver a vista principal al hacer click en el logo o título
document.querySelector('.logo-container').addEventListener('click', () => {
  sessionStorage.removeItem('ultimaVista');
  renderVistaPrincipalConOrden(temporadasList);
});
