document.addEventListener('DOMContentLoaded', function () {
    // Sidebar
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');

    function abrirSidebar() {
        if (sidebar) sidebar.classList.remove('menu-lateral-escondida');
        if (overlay) overlay.classList.add('ativa');
    }
    function fecharSidebar() {
        if (sidebar) sidebar.classList.add('menu-lateral-escondida');
        if (overlay) overlay.classList.remove('ativa');
    }

    if (menuToggle) menuToggle.addEventListener('click', abrirSidebar);
    if (overlay) overlay.addEventListener('click', fecharSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', fecharSidebar);

    if (sidebar) sidebar.classList.add('menu-lateral-escondida');

    // Alterna o menu lateral no mobile
    const sidebarMobile = document.querySelector('.sidebar');
    const overlayMobile = document.querySelector('.overlay');
    const menuToggleMobile = document.getElementById('menu-toggle');
    if (menuToggleMobile && sidebarMobile && overlayMobile) {
        menuToggleMobile.addEventListener('click', function() {
            sidebarMobile.classList.toggle('open');
            overlayMobile.classList.toggle('open');
        });
        overlayMobile.addEventListener('click', function() {
            sidebarMobile.classList.remove('open');
            overlayMobile.classList.remove('open');
        });
    }

    // Torna as linhas da tabela clicáveis no mobile
    if (window.innerWidth < 768) {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('click', function() {
                const link = this.querySelector('td:last-child a');
                if (link) window.location.href = link.href;
            });
        });
    }

    // Evento de clique no botão "Novo Atendimento"
    const btn = document.getElementById('novo-atendimento-btn');
    if (btn) {
        btn.addEventListener('click', function() {
            window.location.href = 'atendimentos.html';
        });
    }
});