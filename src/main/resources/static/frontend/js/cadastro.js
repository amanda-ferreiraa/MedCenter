// Toggle password visibility
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// Máscara para o campo de telefone
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !value[2]
            ? value[1]
            : `(${value[1]}) ${value[2]}${value[3] ? '-' + value[3] : ''}`;
    }
});

// Máscara para o campo CRM
const crmInput = document.getElementById('crm');
crmInput.addEventListener('input', function (e) {
    let value = e.target.value.toUpperCase();

    if (!value.startsWith('CRM/')) {
        if (value.startsWith('CRM')) {
            value = 'CRM/' + value.substring(3);
        } else {
            value = 'CRM/' + value;
        }
    }

    value = value.replace(/[^A-Z0-9\/-]/g, '');

    const parts = value.split('/');
    if (parts.length > 1) {
        let ufNumber = parts[1].replace(/[^A-Z0-9]/g, '');

        if (ufNumber.length > 2) {
            ufNumber = ufNumber.substring(0, 2) + '-' + ufNumber.substring(2);
        }

        value = 'CRM/' + ufNumber;
    }

    e.target.value = value.substring(0, 14);
});

// VALIDAÇÕES + ENVIO DO FORMULÁRIO
const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Padrões de validação
    const crmPattern = /^CRM\/[A-Z]{2}-\d{6}$/;
    const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;

    // Limpa erros anteriores
    document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
    document.querySelectorAll('.error-message-field').forEach(el => el.classList.add('hidden'));
    errorMessage.classList.add('hidden');

    // Campos
    const crm = document.getElementById('crm');
    const specialty = document.getElementById('specialty');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    // Validar CRM
    if (!crmPattern.test(crm.value)) {
        crm.classList.add('error-field');
        document.getElementById('crm-error').classList.remove('hidden');
        isValid = false;
    }

    // Especialidade obrigatória
    if (!specialty.value) {
        specialty.classList.add('error-field');
        isValid = false;
    }

    // Email válido
    if (!email.value.includes('@') || !email.value.includes('.')) {
        email.classList.add('error-field');
        document.getElementById('email-error').classList.remove('hidden');
        isValid = false;
    }

    // Telefone no formato correto
    if (!phonePattern.test(phone.value)) {
        phone.classList.add('error-field');
        document.getElementById('phone-error').classList.remove('hidden');
        isValid = false;
    }

    // Senha com no mínimo 8 caracteres
    if (password.value.length < 8) {
        password.classList.add('error-field');
        document.getElementById('password-error').classList.remove('hidden');
        isValid = false;
    }

    // Confirmação de senha igual
    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('error-field');
        document.getElementById('confirm-password-error').classList.remove('hidden');
        isValid = false;
    }

    // Se deu ruim em alguma validação, mostra msg e scrolla
    if (!isValid) {
        errorMessage.classList.remove('hidden');
        const firstError = document.querySelector('.error-field');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Se deu bom, cria o objeto com os dados
    const medicoData = {
        fullname: document.getElementById("fullname").value,
        crm: crm.value,
        especialidade: specialty.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        dataNascimento: document.getElementById("birthdate")?.value || null,
        endereco: document.getElementById("address")?.value || null,
        cep: document.getElementById("cep")?.value || null,
        biografia: document.getElementById("bio")?.value || null,
        fotoUrl: document.getElementById("photo-url")?.value || null
    };

    // Envia via fetch
    fetch("http://localhost:8080/api/medicos/cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(medicoData)
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao cadastrar médico");
            return response.json();
        })
        .then(data => {
            alert("Cadastro realizado com sucesso! Redirecionando para o login...");
            window.location.href = "login.html";
        })
        .catch(error => {
            alert("Erro ao cadastrar médico. Verifique os dados e tente novamente.");
            console.error(error);
        });
});

