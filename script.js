// Solo una imagen puede estar activa a la vez
document.querySelectorAll('.capitulo').forEach(capitulo => {
  capitulo.addEventListener('click', () => {
    document.querySelectorAll('.capitulo').forEach(c => c.classList.remove('active'));
    capitulo.classList.add('active');
  });
});
