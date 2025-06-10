# MedCenter: Sistema de Gestão de Atendimentos Médicos

O MedCenter é uma aplicação web completa desenvolvida para otimizar a gestão de atendimentos médicos em clínicas e hospitais. Ele oferece funcionalidades para o médico logado acompanhar seus atendimentos diários e semanais, visualizar relatórios gerenciais abrangentes e um site institucional para o público geral com informações sobre a clínica e serviços.

## 🚀 Tecnologias Utilizadas

Este projeto é dividido em duas partes principais:

### Frontend

* **HTML5:** Estrutura das páginas.
* **CSS3 (com Tailwind CSS):** Estilização e responsividade da interface.
* **JavaScript:** Lógica de interatividade, consumo de API e manipulação do DOM.
* **Chart.js:** Biblioteca para criação de gráficos dinâmicos nos relatórios e dashboard do usuário.
* **Font Awesome:** Ícones.

### Backend (Spring Boot)

* **Java:** Linguagem principal de desenvolvimento.
* **Spring Boot:** Framework para construção da API RESTful.
* **Spring Data JPA:** Para persistência de dados.
* **Spring Security:** Para autenticação e autorização (mencionado nas configurações).
* **Maven:** Gerenciamento de dependências do projeto.
* **Banco de Dados:** (Mencionar qual banco de dados está usando, ex: PostgreSQL, MySQL, H2).

## ✨ Funcionalidades Principais

### Área do Usuário (Médico) - Dashboard
* **Login de Médico:** Autenticação baseada em credenciais (armazenamento do ID do médico no `localStorage`).
* **Resumo Diário:** Visualização rápida de atendimentos totais, concluídos e em andamento para o dia.
* **Gráfico de Atendimentos Semanais:** Representação visual da evolução dos atendimentos na última semana.
* **Tabela de Atendimentos do Dia:** Lista detalhada dos atendimentos agendados para o dia atual.
* **Navegação Lateral (Sidebar):** Menu de acesso rápido às diferentes seções do sistema.
* **Logout:** Funcionalidade para encerrar a sessão.
* **Botão "Novo Atendimento":** Redirecionamento para a página de gestão de atendimentos.

### Relatórios Gerenciais
* **Gráfico de Atendimentos por Especialidade:** Visão da demanda em diferentes áreas médicas.
* **Gráfico de Atendimentos por Classificação de Risco:** Distribuição dos atendimentos por níveis de risco.
* **Gráfico de Atendimentos por Desfecho:** Análise dos resultados dos atendimentos (alta, internação, transferência).
* **Tabela de Desempenho Médico:** Detalhes sobre o volume de atendimentos e tempo médio por médico.
* **Cartões de Resumo Global:** Total de atendimentos, altas, internações e transferências.
* **Filtros Dinâmicos:** Opções para filtrar relatórios por especialidade e médico (a serem implementadas nos gráficos e tabelas).
* **Exportação para XLS:** Geração de relatórios em formato de planilha Excel.

### Site Institucional
* **Seções com Animações:** Efeitos visuais suaves ao rolar a página.
* **FAQ Interativo:** Seção de perguntas frequentes com funcionalidade de acordeão.
* **Formulário de Contato:** Com validação básica no frontend.
* **Efeitos de Hover:** Interatividade visual nos cards de recursos e vantagens.
* **Scroll Suave:** Navegação otimizada entre as seções.

## ⚙️ Configuração e Execução

### Pré-requisitos

* **Java Development Kit (JDK) 17+**
* **Maven 3.x**
* **Node.js e npm (ou yarn)** (Para o frontend)
* **Git** (Para clonar o repositório)
* **Um ambiente de desenvolvimento integrado (IDE)** como IntelliJ IDEA, Eclipse ou VS Code.

### Backend (Spring Boot)

1.  **Clonar o Repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio/backend # Ou o diretório do seu projeto backend
    ```
2.  **Configurar o Banco de Dados:**
    * Verifique o arquivo `src/main/resources/application.properties` (ou `application.yml`) para configurar as credenciais do seu banco de dados.
    * Exemplo para H2 (banco em memória para desenvolvimento):
        ```properties
        spring.datasource.url=jdbc:h2:mem:medcenterdb
        spring.datasource.driverClassName=org.h2.Driver
        spring.datasource.username=sa
        spring.datasource.password=
        spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
        spring.jpa.hibernate.ddl-auto=update
        spring.h2.console.enabled=true
        ```
3.  **Configurar CORS (Crucial para o Frontend):**
    * No seu projeto Spring Boot, certifique-se de que a configuração CORS está permitindo as requisições do frontend. O código `CorsConfig.java` fornecido é um bom ponto de partida, mas **ajuste `allowedOrigins`** para o endereço exato do seu frontend quando não for `*`.
    * Exemplo no `CorsConfig.java`:
        ```java
        @Configuration
        public class CorsConfig {
            @Bean
            public WebMvcConfigurer corsConfigurer() {
                return new WebMvcConfigurer() {
                    @Override
                    public void addCorsMappings(CorsRegistry registry) {
                        registry.addMapping("/**")
                                .allowedOrigins("http://localhost:8000") // Ajuste esta linha para o URL do seu frontend
                                .allowedMethods("GET", "POST", "PUT", "DELETE")
                                .allowedHeaders("*");
                    }
                };
            }
        }
        ```
        * **Observação:** O comando `http-server -c-1 --cors` geralmente roda o frontend na porta 8080 ou 8000. Se for 8080, você terá um conflito com o backend. Prefira rodar em uma porta diferente, como `http-server -p 8000 -c-1 --cors`. Confirme a porta do seu frontend e coloque-a aqui.

4.  **Executar o Backend:**
    * Pela IDE: Execute a classe principal da aplicação Spring Boot (geralmente com `main` no nome).
    * Via Maven:
        ```bash
        mvn clean install
        mvn spring-boot:run
        ```
    * O backend estará disponível em `http://localhost:8080`.

### Frontend

1.  **Navegar para o Diretório do Frontend:**
    ```bash
    cd seu-repositorio/frontend # Ou o diretório do seu projeto frontend
    ```
2.  **Instalar Dependências (se houver `package.json`):**
    ```bash
    npm install
    # ou
    yarn install
    ```
    * Se não houver `package.json` e você estiver usando apenas arquivos `.js` e `.html`, não é necessário instalar dependências via npm/yarn.

3.  **Configurar a API Base URL:**
    * Nos arquivos JavaScript do frontend (`RELATORIO`, `SITE`, `USUARIO`), a constante `API_BASE_URL` está definida como `http://localhost:8080/api/atendimentos`. Mantenha esta URL, pois é onde seu backend Spring Boot está rodando.

4.  **Servir o Frontend:**
    * Para servir os arquivos estáticos do frontend e habilitar o CORS, você pode usar o `http-server`:
        ```bash
        npm install -g http-server # Instalar globalmente se ainda não tiver
        http-server -p 8000 -c-1 --cors # Executa na porta 8000 com CORS habilitado
        ```
        * **ATENÇÃO:** Confirme a porta em que o `http-server` está rodando (geralmente 8080 ou 8000) e **ajuste o `allowedOrigins` do CORS no backend** se necessário. Evite a porta 8080 para o frontend se o backend também usa 8080, para evitar conflitos.

5.  **Acessar a Aplicação:**
    * Abra seu navegador e acesse `http://localhost:8000/frontend/pages/site.html` (ou a porta que o `http-server` indicou).

## 🤝 Contribuição

1.  Faça um fork do projeto.
2.  Crie uma nova branch (`git checkout -b feature/minha-feature`).
3.  Faça suas alterações e commit (`git commit -m 'feat: Adiciona nova funcionalidade'`).
4.  Envie para a branch (`git push origin feature/minha-feature`).
5.  Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---
