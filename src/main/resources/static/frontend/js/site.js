
    // Animação para o formulário de contato
    document.addEventListener('DOMContentLoaded', function() {
      // Animação de entrada para todas as seções
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        const elements = section.querySelectorAll('h2, p, div, .feature, .specialty-card, .advantage-card, .faq-item');
        
        elements.forEach((el, index) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.transitionDelay = `${index * 0.1}s`;
        });
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              elements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              });
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(section);
      });
      
      // FAQ Accordion
      const faqQuestions = document.querySelectorAll('.faq-question');
      faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
          const answer = question.nextElementSibling;
          const isActive = question.classList.contains('active');
          
          // Fecha todas as outras respostas
          document.querySelectorAll('.faq-question').forEach(q => {
            if (q !== question) {
              q.classList.remove('active');
              q.nextElementSibling.classList.remove('active');
            }
          });
          
          // Alterna o estado atual
          question.classList.toggle('active');
          answer.classList.toggle('active');
        });
      });
      
      // Validação do formulário
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Validação simples
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const message = document.getElementById('message').value.trim();
          
          if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
          }
          
          // Simulação de envio
          alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
          contactForm.reset();
        });
      }
      
      // Efeito hover nos cards de features
      const features = document.querySelectorAll('.feature, .specialty-card, .advantage-card');
      features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
          const icon = this.querySelector('.icon, .specialty-icon, .advantage-icon');
          if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.1)';
          }
        });
        
        feature.addEventListener('mouseleave', function() {
          const icon = this.querySelector('.icon, .specialty-icon, .advantage-icon');
          if (icon) {
            icon.style.transform = 'rotate(0) scale(1)';
          }
        });
      });
      
      // Scroll suave para links internos
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        });
      });
      
      // Animação para os ícones flutuantes
      const floatingElements = document.querySelectorAll('.floating');
      floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
      });
    });
