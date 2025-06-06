document.addEventListener("DOMContentLoaded", async () => {
    const nomeMedicoEl = document.getElementById("nome-medico"); // já existente no seu código
    const nomeMedicoH2 = document.getElementById("nome-medico-h2"); // <--- id do seu h2 na home
    const img = document.getElementById("foto-perfil");
    const editBtn = document.getElementById("edit-profile");
    const saveBtn = document.getElementById("save-changes");
    const inputs = document.querySelectorAll("input, select, textarea");
    const changePhotoBtn = document.getElementById("change-photo");
    const photoUploadInput = document.getElementById("photo-upload");

    async function carregarPerfil() {
        try {
            const email = localStorage.getItem("emailMedicoLogado");
            if (!email) {
                console.warn("Nenhum email de médico logado encontrado.");
                return;
            }

            const response = await fetch(`http://localhost:8080/perfil?email=${encodeURIComponent(email)}`);
            if (!response.ok) throw new Error("Erro ao buscar dados do perfil");

            const dados = await response.json();

            // Atualiza nome no topo (verifique se tem esse elemento)
            if (nomeMedicoEl) nomeMedicoEl.innerText = dados.nome || "Médico(a)";

            // Atualiza o h2 na home com o nome do médico logado
            if (nomeMedicoH2) nomeMedicoH2.innerText = dados.nome || "Médico(a)";

            // Atualiza foto do perfil
            if (dados.fotoPerfil && dados.fotoPerfil.trim() !== "") {
                img.src = dados.fotoPerfil;
            } else {
                img.src = "../../assets/images/foto-padrao.png";
            }

            // Preenche os inputs com os dados recebidos
            document.getElementById("nome-completo").value = dados.nome || "";
            document.getElementById("crm").value = dados.crm || "";
            document.getElementById("especialidade").value = dados.especialidade || "Selecionar";
            document.getElementById("email").value = dados.email || "";
            document.getElementById("telefone").value = dados.telefone || "";
            document.getElementById("data-nascimento").value = dados.dataNascimento || "";
            document.getElementById("genero").value = dados.genero || "Masculino";
            document.getElementById("endereco").value = dados.endereco || "";
            document.getElementById("cep").value = dados.cep || "";
            document.getElementById("biografia").value = dados.biografia || "";

            // Não preenche senha por segurança
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
        }
    }

    function ativarEdicao() {
        inputs.forEach(input => {
            if (input.id !== "crm" && input.id !== "email") {
                input.disabled = false;
            }
        });
        editBtn.classList.add("hidden");
        saveBtn.classList.remove("hidden");
    }

    async function salvarAlteracoes() {
        const perfilAtualizado = {
            nome: document.getElementById("nome-completo").value,
            email: localStorage.getItem("emailMedicoLogado"),
            especialidade: document.getElementById("especialidade").value,
            telefone: document.getElementById("telefone").value,
            dataNascimento: document.getElementById("data-nascimento").value,
            genero: document.getElementById("genero").value,
            endereco: document.getElementById("endereco").value,
            cep: document.getElementById("cep").value,
            biografia: document.getElementById("biografia").value,
            fotoPerfil: img.src,
        };

        try {
            const email = localStorage.getItem("emailMedicoLogado");
            if (!email) return;

            const response = await fetch(`http://localhost:8080/perfil?email=${encodeURIComponent(email)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(perfilAtualizado),
            });

            if (!response.ok) throw new Error("Erro ao salvar perfil");

            alert("Perfil atualizado com sucesso!");
            inputs.forEach(input => input.disabled = true);
            editBtn.classList.remove("hidden");
            saveBtn.classList.add("hidden");

            if (nomeMedicoEl) nomeMedicoEl.innerText = perfilAtualizado.nome || "Médico(a)";
            if (nomeMedicoH2) nomeMedicoH2.innerText = perfilAtualizado.nome || "Médico(a)";
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            alert("Não foi possível salvar as alterações.");
        }
    }

    changePhotoBtn.addEventListener("click", () => {
        photoUploadInput.click();
    });

    photoUploadInput.addEventListener("change", () => {
        const file = photoUploadInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    editBtn.addEventListener("click", ativarEdicao);
    saveBtn.addEventListener("click", salvarAlteracoes);

    await carregarPerfil();
});
