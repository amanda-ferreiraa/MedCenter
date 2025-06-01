// Script para carregar a navbar dinamicamente em todas as páginas
document.addEventListener("DOMContentLoaded", function () {
  // Faz uma requisição para buscar o HTML da navbar
  fetch("../pages/navbar.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar a navbar: " + response.status);
      }
      return response.text();
    })
    .then(data => {
      // Insere o HTML da navbar no container
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer) {
        navbarContainer.innerHTML = data;
        
        // Inicializa a funcionalidade da navbar após o carregamento
        initNavbar();
      }
    })
    .catch(error => {
      console.error("Erro ao carregar a navbar:", error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('../pages/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;

            // Verifica o nome da página atual
            const currentPage = window.location.pathname.split('/').pop();

            // Se for login ou cadastro, esconde os itens com essa classe
            if (currentPage === 'login.html' || currentPage === 'cadastro.html') {
                const itensParaEsconder = document.querySelectorAll('.esconder-em-login');
                itensParaEsconder.forEach(item => {
                    item.style.display = 'none';
                });
            }
        });
});

// Função para inicializar todas as funcionalidades da navbar
function initNavbar() {
  // Configura o menu hambúrguer
  setupMobileMenu();
  
  // Configura os links de navegação
  setupNavLinks();
  
  // Adiciona classe para animação de entrada
  setTimeout(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.classList.add('loaded');
    }
  }, 100);
  
  // Adiciona efeito de scroll na navbar
  setupScrollEffect();
}

// Configura o menu hambúrguer para dispositivos móveis
function setupMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbarLinks = document.getElementById('navbar-links');
  
  if (menuToggle && navbarLinks) {
    menuToggle.addEventListener('click', function() {
      // Alterna a classe active no botão do menu
      this.classList.toggle('active');
      
      // Alterna a classe active no menu
      navbarLinks.classList.toggle('active');
      
      // Atualiza o atributo aria-expanded para acessibilidade
      const isExpanded = navbarLinks.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
      
      // Adiciona/remove classe no body para o overlay
      document.body.classList.toggle('menu-open', isExpanded);
      
      // Bloqueia/desbloqueia o scroll do body quando o menu está aberto
      if (isExpanded) {
        // Salva a posição atual do scroll
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        // Restaura a posição do scroll
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    });
    
    // Fecha o menu ao clicar em um link
    const navLinks = navbarLinks.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Remove a classe do body e restaura o scroll
        document.body.classList.remove('menu-open');
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      });
    });
    
    // Fecha o menu ao clicar no overlay (body.menu-open)
    document.body.addEventListener('click', function(e) {
      if (document.body.classList.contains('menu-open') && 
          !e.target.closest('nav') && 
          !e.target.closest('#menu-toggle')) {
        navbarLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        
        // Restaura o scroll
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    });
  }
}

// Configura os links de navegação
function setupNavLinks() {
  // Marca o link ativo com base na URL atual
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('#navbar-links a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    
    // Adiciona eventos de hover para animação suave
    link.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
    
    // Configura redirecionamentos
    link.addEventListener('click', function(event) {
      const href = this.getAttribute('href');
      
      // Se for um link interno ou de login, previne o comportamento padrão
      if (href === '#' || href.includes('login.html')) {
        event.preventDefault();
        
        // Se for o link de login, redireciona para a página de login
        if (href.includes('login.html')) {
          window.location.href = href;
        }
      }
    });
  });
  
  // Configura o botão de login
  const loginButton = document.querySelector('.login-button a');
  if (loginButton) {
    loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = this.getAttribute('href');
    });
  }
}

// Adiciona efeito de scroll na navbar
function setupScrollEffect() {
  let lastScrollTop = 0;
  const navbar = document.querySelector('nav');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Adiciona classe 'scrolled' quando a página é rolada
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Oculta a navbar ao rolar para baixo e mostra ao rolar para cima
      if (scrollTop > lastScrollTop && scrollTop > 70) {
        // Rolando para baixo
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Rolando para cima
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }
}
  