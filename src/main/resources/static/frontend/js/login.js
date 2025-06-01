    // Mostrar/ocultar senha
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    togglePassword.addEventListener('click', function () {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePassword.innerHTML = `<i class="fas fa-${isHidden ? 'eye-slash' : 'eye'}"></i>`;
    });

    // Simulação de login com erro
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      // Simula login: email correto "admin@medcenter.com", senha "123456"
      if (email === 'amanda@gmail.com' && password === '05122006') {
        errorMessage.classList.add('hidden');
        window.location.href = "../pages/usuario.html";
        // Redireciona ou carrega o sistema
      } else {
        errorMessage.classList.remove('hidden');
      }
    });

