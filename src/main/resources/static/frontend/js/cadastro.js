        // Toggle password visibility
        const togglePassword = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        
        togglePassword.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
        
        // Form validation
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.getElementById('error-message');
        
        // CRM validation pattern
        const crmPattern = /^CRM\/[A-Z]{2}-\d{6}$/;
        // Phone validation pattern (Brazilian format)
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Reset error states
            document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
            document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
            errorMessage.classList.add('hidden');
            
            // Validate full name
            const fullname = document.getElementById('fullname');
            if (!fullname.value.trim()) {
                fullname.classList.add('error-field');
                document.getElementById('fullname-error').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate CRM
            const crm = document.getElementById('crm');
            if (!crmPattern.test(crm.value)) {
                crm.classList.add('error-field');
                document.getElementById('crm-error').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate specialty
            const specialty = document.getElementById('specialty');
            if (!specialty.value) {
                specialty.classList.add('error-field');
                isValid = false;
            }
            
            // Validate email
            const email = document.getElementById('email');
            if (!email.value.includes('@') || !email.value.includes('.')) {
                email.classList.add('error-field');
                document.getElementById('email-error').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate phone
            const phone = document.getElementById('phone');
            if (!phonePattern.test(phone.value)) {
                phone.classList.add('error-field');
                document.getElementById('phone-error').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate password
            const password = document.getElementById('password');
            if (password.value.length < 8) {
                password.classList.add('error-field');
                document.getElementById('password-error').classList.remove('hidden');
                isValid = false;
            }
            
            // Validate password confirmation
            const confirmPassword = document.getElementById('confirm-password');
            if (password.value !== confirmPassword.value) {
                confirmPassword.classList.add('error-field');
                document.getElementById('confirm-password-error').classList.remove('hidden');
                isValid = false;
            }
            
            if (!isValid) {
                // Show general error message
                errorMessage.classList.remove('hidden');
                // Scroll to first error
                const firstError = document.querySelector('.error-field');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // If all valid, simulate successful registration
            alert('Cadastro realizado com sucesso! Redirecionando para o login...');
            // In a real app, you would submit the form here
        });
        
        // Phone input mask
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !value[2]
                    ? value[1]
                    : `(${value[1]}) ${value[2]}${value[3] ? '-' + value[3] : ''}`;
            }
        });
        
        // CRM input mask
        const crmInput = document.getElementById('crm');
        crmInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase();
            if (value.length > 0) {
                if (!value.startsWith('CRM/')) {
                    if (value.startsWith('CRM')) {
                        value = 'CRM/' + value.substring(3);
                    } else {
                        value = 'CRM/' + value;
                    }
                }
                
                // Remove all non-alphanumeric characters except slash and hyphen
                value = value.replace(/[^A-Z0-9\/-]/g, '');
                
                // Format as CRM/XX-123456
                if (value.length > 4) {
                    const parts = value.split('/');
                    if (parts.length > 1) {
                        let ufNumber = parts[1];
                        if (ufNumber.length > 0) {
                            ufNumber = ufNumber.replace(/[^A-Z-]/g, '');
                            if (ufNumber.length > 2 && !ufNumber.includes('-')) {
                                ufNumber = ufNumber.substring(0, 2) + '-' + ufNumber.substring(2);
                            }
                            value = 'CRM/' + ufNumber;
                        }
                    }
                }
                
                e.target.value = value.substring(0, 11); // Max length
            }
        });