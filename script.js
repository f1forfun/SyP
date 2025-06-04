// script.js

// Script para navegación con teclado estilo TV (flechas)
const filas = Array.from(document.querySelectorAll('.capitulos'));
let filaActual = 0;
let colActual = 0;

// Foco inicial
function setFocus() {
  const caps = filas[filaActual].querySelectorAll('.capitulo');
  if (caps.length === 0) return;
  if (colActual >= caps.length) colActual = caps.length -1;
  caps[colActual].focus();
}

// Cuando carga la página, ponemos foco al primer capítulo
window.onload = () => {
  setFocus();
};

// Escuchar eventos de teclado
window.addEventListener('keydown', (e) => {
  const caps = filas[filaActual].querySelectorAll('.capitulo');
  if (!caps.length) return;

  switch(e.key) {
    case 'ArrowRight':
      if (colActual < caps.length - 1) {
        colActual++;
        setFocus();
        e.preventDefault();
      }
      break;
    case 'ArrowLeft':
      if (colActual > 0) {
        colActual--;
        setFocus();
        e.preventDefault();
      }
      break;
    case 'ArrowDown':
      if (filaActual < filas.length -1) {
        filaActual++;
        const nextCaps = filas[filaActual].querySelectorAll('.capitulo');
        if (colActual >= nextCaps.length) colActual = nextCaps.length -1;
        setFocus();
        e.preventDefault();
      }
      break;
    case 'ArrowUp':
      if (filaActual > 0) {
        filaActual--;
        const prevCaps = filas[filaActual].querySelectorAll('.capitulo');
        if (colActual >= prevCaps.length) colActual = prevCaps.length -1;
        setFocus();
        e.preventDefault();
      }
      break;
    case 'Enter':
    case 'NumpadEnter':
      // Al pulsar enter, abrir el enlace activo
      const capitulo = document.activeElement;
      if (capitulo && capitulo.classList.contains('capitulo')) {
        window.location.href = capitulo.href;
        e.preventDefault();
      }
      break;
  }
});
