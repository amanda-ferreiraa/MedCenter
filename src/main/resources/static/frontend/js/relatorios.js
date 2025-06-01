 // Initialize charts
        document.addEventListener('DOMContentLoaded', function() {
            // Specialties chart (bar)
            const specialtiesCtx = document.getElementById('specialtiesChart').getContext('2d');
            const specialtiesChart = new Chart(specialtiesCtx, {
                type: 'bar',
                data: {
                    labels: ['Clínico Geral', 'Pediatria', 'Cirurgia', 'Cardiologia', 'Ortopedia', 'Ginecologia'],
                    datasets: [{
                        label: 'Atendimentos',
                        data: [128, 95, 72, 68, 42, 38],
                        backgroundColor: [
                            'rgba(29, 78, 216, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(220, 38, 38, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(6, 182, 212, 0.7)'
                        ],
                        borderColor: [
                            'rgba(29, 78, 216, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(220, 38, 38, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(6, 182, 212, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            
            // Risk classification chart (pie)
            const riskCtx = document.getElementById('riskChart').getContext('2d');
            const riskChart = new Chart(riskCtx, {
                type: 'pie',
                data: {
                    labels: ['Verde', 'Amarelo', 'Vermelho'],
                    datasets: [{
                        data: [210, 105, 40],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(220, 38, 38, 0.7)'
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(220, 38, 38, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            
            // Outcomes chart (doughnut)
            const outcomesCtx = document.getElementById('outcomesChart').getContext('2d');
            const outcomesChart = new Chart(outcomesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Alta', 'Internação', 'Transferência'],
                    datasets: [{
                        data: [278, 42, 35],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(220, 38, 38, 0.7)'
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(220, 38, 38, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
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