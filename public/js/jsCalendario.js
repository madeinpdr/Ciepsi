const diasContainer = document.getElementById("dias");
const mesAtualLabel = document.getElementById("mes-atual");
const prevBtn = document.getElementById("prev-mes");
const nextBtn = document.getElementById("next-mes");
const dataInput = document.getElementById("data-consulta");
const salvarBtn = document.getElementById("salvar");
const listaConsultas = document.getElementById("lista-consultas");
const pacienteInput = document.getElementById("paciente");
const descricaoInput = document.getElementById("descricao");
const horaInput = document.getElementById("hora-consulta");


let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let agendamentos = {}; // { 'YYYY-MM-DD': [ {nome, desc}, ... ] }

function gerarCalendario(mes, ano) {
  diasContainer.innerHTML = "";
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  const nomeMes = new Date(ano, mes).toLocaleString("pt-BR", { month: "long", year: "numeric" });
  mesAtualLabel.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  // Preencher espaços vazios
  for (let i = 0; i < primeiroDia; i++) {
    diasContainer.innerHTML += "<div></div>";
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const div = document.createElement("div");
    div.classList.add("dia");
    div.textContent = dia;

    if (agendamentos[dataStr]) {
      div.classList.add("agendado");
    }

    div.addEventListener("click", () => {
      dataInput.value = dataStr;
      mostrarConsultas(dataStr);
    });

    diasContainer.appendChild(div);
  }
}

function mostrarConsultas(data) {
  listaConsultas.innerHTML = "";

  if (agendamentos[data]) {
    agendamentos[data].forEach((consulta, index) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.background = "#e1f5e5";
      li.style.padding = "8px 12px";
      li.style.marginBottom = "6px";
      li.style.borderRadius = "6px";

      const textoConsulta = document.createElement("span");
      textoConsulta.textContent = `${consulta.hora} - ${consulta.nome} - ${consulta.descricao}`;
      textoConsulta.style.flex = "1";

      const btnRemover = document.createElement("button");
      btnRemover.style.width = "28px";
      btnRemover.style.height = "28px";
      btnRemover.style.display = "flex";
      btnRemover.style.alignItems = "center";
      btnRemover.style.justifyContent = "center";
      btnRemover.style.cursor = "pointer";
      btnRemover.style.backgroundColor = "#888888";
      btnRemover.style.border = "none";
      btnRemover.style.borderRadius = "4px";
      btnRemover.style.color = "white";
      btnRemover.style.transition = "background-color 0.3s ease";

      // Ícone Bootstrap
      const icon = document.createElement("i");
      icon.classList.add("bi", "bi-x-lg");
      icon.style.fontSize = "16px";
      icon.style.pointerEvents = "none"; // garante clique no botão
      icon.style.display = "flex";
      icon.style.alignItems = "center";
      icon.style.justifyContent = "center";
      icon.style.pointerEvents = "none"; // garante que o clique vá para o botão, não para o ícone

      btnRemover.appendChild(icon);

      btnRemover.addEventListener("mouseenter", () => {
        btnRemover.style.backgroundColor = "#555";
      });

      btnRemover.addEventListener("mouseleave", () => {
        btnRemover.style.backgroundColor = "#888888";
      });

      btnRemover.addEventListener("click", () => {
        const modal = document.getElementById("confirmModal");
        modal.style.display = "flex";

        const oldYes = document.getElementById("confirmYes");
        const oldNo = document.getElementById("confirmNo");
        const newYes = oldYes.cloneNode(true);
        const newNo = oldNo.cloneNode(true);
        oldYes.parentNode.replaceChild(newYes, oldYes);
        oldNo.parentNode.replaceChild(newNo, oldNo);

        newYes.addEventListener("click", () => {
          agendamentos[data].splice(index, 1);
          if (agendamentos[data].length === 0) delete agendamentos[data];
          gerarCalendario(mesAtual, anoAtual);
          mostrarConsultas(data);
          modal.style.display = "none";
        });

        newNo.addEventListener("click", () => {
          modal.style.display = "none";
        });
      });

      li.appendChild(textoConsulta);
      li.appendChild(btnRemover);
      listaConsultas.appendChild(li);
    });
  }
}



salvarBtn.addEventListener("click", () => {
  const data = dataInput.value;
  const hora = horaInput.value;
  const nome = pacienteInput.value.trim();
  const desc = descricaoInput.value.trim();

  const hoje = new Date();
  const dataSelecionada = new Date(data + 'T00:00:00');
  hoje.setHours(0, 0, 0, 0);

  if (dataSelecionada < hoje) {
    alert("Você não pode agendar consultas para datas anteriores.");
    return;
  }

  if (!data || !hora || !nome || !desc) {
    alert("Preencha todos os campos!");
    return;
  }

  if (!agendamentos[data]) agendamentos[data] = [];
  agendamentos[data].push({ nome, descricao: desc, hora });

  pacienteInput.value = "";
  descricaoInput.value = "";
  horaInput.value = "";

  gerarCalendario(mesAtual, anoAtual);
  mostrarConsultas(data);
});


prevBtn.addEventListener("click", () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  gerarCalendario(mesAtual, anoAtual);
});

nextBtn.addEventListener("click", () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  gerarCalendario(mesAtual, anoAtual);
});

gerarCalendario(mesAtual, anoAtual);

//CLIQUE PARA O DROPDOWN

const profileImg = document.getElementById('profileImg');
const dropdownMenu = document.getElementById('dropdownMenu');

profileImg.addEventListener('click', function (event) {
  dropdownMenu.classList.toggle('show');
  event.stopPropagation();
});

window.addEventListener('click', function () {
  dropdownMenu.classList.remove('show');
});

dropdownMenu.addEventListener('click', function (event) {
  event.stopPropagation();
});

//entrar no perfil pelo DropDown
document.getElementById("ProfileBtn").addEventListener("click", function () {
  window.location.href = "/perfil";
});

