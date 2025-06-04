const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7F3OqP2BHpzpqTQ7JFvb9lTNz4SR2Wbtqe8AqkFTIS_IxB7xPO1At-sJwRCC_DRDDAcPzouVubcuC/pub?output=csv";

function parseCSV(csvText) {
  const lines = csvText.split("\n").filter(line => line.trim() !== "");
  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(delimiter).map(value => value.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
  return rows;


function groupBySerieAndTemporada(data) {
  const series = {};
  data.forEach(item => {
    const key = `${item.serie} - Temporada ${item.temporada}`;
    if (!series[key]) series[key] = [];
    series[key].push(item);
  });
  return series;
}

function createDOMFromData(seriesData) {
  const container = document.body;

  for (const [serieName, capitulos] of Object.entries(seriesData)) {
    const serieDiv = document.createElement("div");
    serieDiv.className = "serie";

    const titleDiv = document.createElement("div");
    titleDiv.className = "serie-title";
    titleDiv.textContent = serieName;

    const capitulosDiv = document.createElement("div");
    capitulosDiv.className = "capitulos";

    capitulos.forEach(cap => {
      const a = document.createElement("a");
      a.className = "capitulo";
      a.href = cap.enlace;
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = cap.imagen;
      img.alt = cap.titulo;

      const span = document.createElement("span");
      span.textContent = `Ep ${cap.episodio} - ${cap.titulo}`;

      a.appendChild(img);
      a.appendChild(span);
      capitulosDiv.appendChild(a);
    });

    serieDiv.appendChild(titleDiv);
    serieDiv.appendChild(capitulosDiv);
    container.appendChild(serieDiv);
  }

  // Marcar capítulo activo al hacer clic
  document.querySelectorAll('.capitulo').forEach(capitulo => {
    capitulo.addEventListener('click', () => {
      document.querySelectorAll('.capitulo').forEach(c => c.classList.remove('active'));
      capitulo.classList.add('active');
    });
  });
}

fetch(CSV_URL)
  .then(response => response.text())
  .then(text => {
    const parsed = parseCSV(text);
    const grouped = groupBySerieAndTemporada(parsed);
    createDOMFromData(grouped);
  })
  .catch(err => {
    console.error("Error cargando CSV:", err);
  });
