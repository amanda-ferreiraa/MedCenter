  // Toggle edit mode
        const editBtn = document.getElementById('edit-profile');
        const saveBtn = document.getElementById('save-changes');
        const inputs = document.querySelectorAll('input, select, textarea');
        
        editBtn.addEventListener('click', function() {
            inputs.forEach(input => {
                input.disabled = false;
                input.classList.add('bg-blue-50');
            });
            
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        });
        
        saveBtn.addEventListener('click', function() {
            inputs.forEach(input => {
                input.disabled = true;
                input.classList.remove('bg-blue-50');
            });
            
            saveBtn.classList.add('hidden');
            editBtn.classList.remove('hidden');
            
            // Here you would typically save the changes to the server
            alert('Alterações salvas com sucesso!');
        });
        
        // Change profile photo
        const changePhotoBtn = document.getElementById('change-photo');
        const photoUpload = document.getElementById('photo-upload');
        const profileImage = document.getElementById('profile-image');
        
        changePhotoBtn.addEventListener('click', function() {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    profileImage.src = event.target.result;
                }
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        // Mobile menu toggle
        document.getElementById('menu-toggle').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('open');
            document.querySelector('.overlay').classList.toggle('open');
        });
        
        // Close menu when clicking overlay
        document.querySelector('.overlay').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.remove('open');
            this.classList.remove('open');
        });
        
        // Toggle password visibility
        document.querySelectorAll('[type="password"]').forEach(input => {
            const eyeBtn = input.nextElementSibling;
            eyeBtn.addEventListener('click', function() {
                if (input.type === 'password') {
                    input.type = 'text';
                    eyeBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    eyeBtn.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });