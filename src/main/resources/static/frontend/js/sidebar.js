document.addEventListener('DOMContentLoaded', function () {
    // Carrega a sidebar de um arquivo externo (sidebar.html)
    fetch('../pages/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;

            // Após carregar a sidebar, adiciona os eventos
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const menuToggle = document.getElementById('menu-toggle');
            const closeSidebar = document.getElementById('close-sidebar');

            function abrirSidebar() {
                sidebar.classList.remove('menu-lateral-escondida');
                overlay.classList.add('ativa');
            }

            function fecharSidebar() {
                sidebar.classList.add('menu-lateral-escondida');
                overlay.classList.remove('ativa');
            }

            if (menuToggle) menuToggle.addEventListener('click', abrirSidebar);
            if (overlay) overlay.addEventListener('click', fecharSidebar);
            if (closeSidebar) closeSidebar.addEventListener('click', fecharSidebar);

            // Sidebar sempre começa escondida
            sidebar.classList.add('menu-lateral-escondida');

            // 🚨 AQUI ENTRA O DESTACAR LINK ATUAL
            const links = document.querySelectorAll('.menu-lateral-item');
            const currentPage = window.location.pathname.split('/').pop();

            links.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref === currentPage) {
                    link.classList.add('selected');
                }
            });
        });
});
