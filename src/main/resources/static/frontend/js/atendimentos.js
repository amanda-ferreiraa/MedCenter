document.addEventListener('DOMContentLoaded', function() {
    // Menu lateral (opcional)
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    }

    // Abrir modal ao clicar nos botões "+" (desktop e mobile)
    document.querySelectorAll('#novo-atendimento-desktop, .botao-novo-atendimento-mobile').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = document.getElementById('modal-atendimento');
            if (modal) modal.classList.remove('hidden');
        });
    });

    // Fechar modal ao clicar no X
    const fecharModal = document.getElementById('fechar-modal');
    if (fecharModal) {
        fecharModal.addEventListener('click', function() {
            const modal = document.getElementById('modal-atendimento');
            if (modal) modal.classList.add('hidden');
        });
    }

    // Fechar modal ao clicar fora do conteúdo
    const modalAtendimento = document.getElementById('modal-atendimento');
    if (modalAtendimento) {
        modalAtendimento.addEventListener('click', function(e) {
            if (e.target === this) this.classList.add('hidden');
        });
    }

    // Prevenir envio real do formulário e fechar modal
    const formAtendimento = document.getElementById('form-atendimento');
    if (formAtendimento) {
        formAtendimento.addEventListener('submit', function(e) {
            e.preventDefault();
            const modal = document.getElementById('modal-atendimento');
            if (modal) modal.classList.add('hidden');
            // Aqui você pode adicionar lógica para salvar os dados
        });
    }
});