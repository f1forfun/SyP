const JSON_URL = 'https://opensheet.elk.sh/1yz-JkWidUVkWjqYAcwDuqUHJ4knIudDgOl1Tyr5hMts/Hoja1'; // Reemplaza con tu URL

fetch(JSON_URL)
  .then(response => response.json())
  .then(data => {
    const catalogo = document.getElementById('catalogo');
    const seriesMap = {};

    data.forEach(entry => {
      const key = `${entry.serie} - Temporada ${entry.temporada}`;
      if (!seriesMap[key]) {
        seriesMap[key] = [];
      }

      seriesMap[key].push({
        episodio: entry.episodio,
        titulo: entry.titulo,
        enlace: entry.enlace,
        imagen: entry.imagen
      });
    });

    Object.entries(seriesMap).forEach(([serieTemporada, capitulos]) => {
      const serieDiv = document.createElement('div');
      serieDiv.className = 'serie';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'serie-title';
      titleDiv.textContent = serieTemporada;
      serieDiv.appendChild(titleDiv);

      const capsDiv = document.createElement('div');
      capsDiv.className = 'capitulos';

      capitulos.forEach(cap => {
        const a = document.createElement('a');
        a.className = 'capitulo';
        a.href = cap.enlace;

        const img = document.createElement('img');
        img.src = cap.imagen;
        img.alt = `${cap.episodio} - ${cap.titulo}`;

        const span = document.createElement('span');
        span.textContent = `T${capituloFormateado(cap.episodio)} - ${cap.titulo}`;

        a.appendChild(img);
        a.appendChild(span);

        // efecto activo
        a.addEventListener('click', () => {
          document.querySelectorAll('.capitulo').forEach(c => c.classList.remove('active'));
          a.classList.add('active');
        });

        capsDiv.appendChild(a);
      });

      serieDiv.appendChild(capsDiv);
      catalogo.appendChild(serieDiv);
    });
  })
  .catch(error => {
    console.error('Error cargando JSON:', error);
  });

function capituloFormateado(n) {
  const num = parseInt(n);
  return num < 10 ? `0${num}` : num;
}

