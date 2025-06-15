const nameDisplay = document.getElementById("name-display");
const bioDisplay = document.getElementById("bio-display");
const nameInput = document.getElementById("name-input");
const bioInput = document.getElementById("bio-input");

const editBtn = document.querySelector(".edit-btn");
const saveBtn = document.querySelector(".save-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const exitBtn = document.querySelector(".exit");

function toggleEdit(editing) {
  nameDisplay.style.display = editing ? "none" : "block";
  bioDisplay.style.display = editing ? "none" : "block";
  nameInput.style.display = editing ? "block" : "none";
  bioInput.style.display = editing ? "block" : "none";

  editBtn.style.display = editing ? "none" : "inline-block";
  saveBtn.style.display = editing ? "inline-block" : "none";
  cancelBtn.style.display = editing ? "inline-block" : "none";
}

function saveProfile() {
  nameDisplay.textContent = nameInput.value;
  bioDisplay.textContent = bioInput.value;
  toggleEdit(false);
}

//editar email e telefone
function toggleEdit(isEditing) {
  // Campos principais
  document.getElementById('name-display').style.display = isEditing ? 'none' : 'block';
  document.getElementById('name-input').style.display = isEditing ? 'block' : 'none';

  document.getElementById('bio-display').style.display = isEditing ? 'none' : 'block';
  document.getElementById('bio-input').style.display = isEditing ? 'block' : 'none';

  // Botões
  document.querySelector('.edit-btn').style.display = isEditing ? 'none' : 'inline-block';
  document.querySelector('.save-btn').style.display = isEditing ? 'inline-block' : 'none';
  document.querySelector('.cancel-btn').style.display = isEditing ? 'inline-block' : 'none';
  document.getElementById('reset-btn').style.display = isEditing ? 'inline-block' : 'none';

  document.querySelector('.exit').style.display = isEditing ? 'none' : 'inline-block';

  // Redes sociais / contatos
  document.getElementById('phone-display').style.display = isEditing ? 'none' : 'inline-block';
  document.getElementById('phone-input').style.display = isEditing ? 'block' : 'none';

  document.getElementById('email-display').style.display = isEditing ? 'none' : 'inline-block';
  document.getElementById('email-input').style.display = isEditing ? 'block' : 'none';
}


function saveProfile() {
  const name = document.getElementById('name-input').value;
  const bio = document.getElementById('bio-input').value;
  const phone = document.getElementById('phone-input').value.trim();
  const email = document.getElementById('email-input').value.trim();

  // Regex de validação
  const phoneRegex = /^\d{10,15}$/; // Aceita entre 10 e 15 dígitos (ex: com DDD)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    alert("Digite um número de telefone válido (somente números, entre 10 e 15 dígitos).");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Digite um e-mail válido.");
    return;
  }

  // Atualiza os campos visíveis
  document.getElementById('name-display').textContent = name;
  document.getElementById('bio-display').textContent = bio;
  document.getElementById('phone-display').textContent = phone;
  document.getElementById('email-display').textContent = email;

  // Esconde modo de edição
  toggleEdit(false);

  // Salva no localStorage
  localStorage.setItem("profileData", JSON.stringify({
    name,
    bio,
    phone,
    email
  }));
}

// Resetar o perfil

function resetProfile() {
  // Remove dados do localStorage
  localStorage.removeItem("profileData");

  // Valores padrão
  const defaultName = "";
  const defaultBio = "";
  const defaultPhone = "";
  const defaultEmail = "";

  // Atualiza inputs
  document.getElementById("name-input").value = defaultName;
  document.getElementById("bio-input").value = defaultBio;
  document.getElementById("phone-input").value = defaultPhone;
  document.getElementById("email-input").value = defaultEmail;

  // Atualiza displays
  document.getElementById("name-display").textContent = defaultName;
  document.getElementById("bio-display").textContent = defaultBio;
  document.getElementById("phone-display").textContent = "Não informado";
  document.getElementById("email-display").textContent = "Não informado";

  // Mantém o modo edição ligado
  toggleEdit(true);
}


window.onload = function () {
  const savedData = localStorage.getItem("profileData");
  if (savedData) {
    const { name, bio, phone, email } = JSON.parse(savedData);

    document.getElementById("name-display").textContent = name;
    document.getElementById("name-input").value = name;

    document.getElementById("bio-display").textContent = bio;
    document.getElementById("bio-input").value = bio;

    document.getElementById("phone-display").textContent = phone || "Não informado";
    document.getElementById("phone-input").value = phone;

    document.getElementById("email-display").textContent = email || "Não informado";
    document.getElementById("email-input").value = email;
  }
};

//para conferir se é mesmo e-mail e telefone

document.getElementById("phone-input").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, ""); // Remove tudo que não for dígito
});

const emailInput = document.getElementById("email-input");
const emailError = document.getElementById("email-error");

emailInput.addEventListener("input", function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailInput.value) || emailInput.value === "") {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }



});




//voltar para o Dashboard

document.getElementById("exit").addEventListener("click", function () {
  window.location.href = "/dashboard";
});
