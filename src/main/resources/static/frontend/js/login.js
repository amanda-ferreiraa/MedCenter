// Mostrar/ocultar senha
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.innerHTML = `<i class="fas fa-${isHidden ? 'eye-slash' : 'eye'}"></i>`;
});

// Formulário de login
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value.trim();

    const loginDTO = {
        email: email,
        senha: senha
    };

    try {
        const response = await fetch("http://localhost:8080/api/medicos/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginDTO)
        });

        if (response.ok) {
            const medico = await response.json();

            // ✅ Salva o objeto médico inteiro no localStorage
            localStorage.setItem("medicoLogado", JSON.stringify(medico));
            // ✅ Salva só o e-mail no localStorage para uso na página de perfil
            localStorage.setItem("emailMedicoLogado", medico.email);

            // ✅ Esconde a mensagem de erro se estiver visível
            errorMessage.classList.add("hidden");

            // ✅ Redireciona para o dashboard
            console.log("Médico logado:", medico.nome, medico.email);
            window.location.href = "../pages/usuario.html";

        } else {
            // ❌ Mostra mensagem de erro
            errorMessage.textContent = "Email ou senha incorretos.";
            errorMessage.classList.remove("hidden");
        }

    } catch (erro) {
        console.error("Erro ao tentar logar:", erro);
        errorMessage.textContent = "Erro na conexão com o servidor.";
        errorMessage.classList.remove("hidden");
    }
});
