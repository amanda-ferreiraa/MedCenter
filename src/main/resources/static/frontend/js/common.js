// Script para funcionalidades comuns em todas as páginas

document.addEventListener("DOMContentLoaded", () => {
  // Adiciona a classe ativo ao body para iniciar as animações
  document.querySelector("body").classList.add("ativo");
  
  // Inicializa os ícones Lucide se a biblioteca estiver disponível
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Adiciona animação de fade-in aos elementos quando entrarem na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  // Observa as features e outros elementos para animação
  document.querySelectorAll('.feature, .titulo, .video, .quadrado3, .fade-in, .stat-item').forEach(item => {
    observer.observe(item);
  });
}); 