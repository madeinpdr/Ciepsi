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

// Troca a imagem e salva no localStorage
function trocarImagem(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      document.getElementById('profile-pic').src = imageData;
      localStorage.setItem('profileImage', imageData); // Persistência
    };
    reader.readAsDataURL(file);
  }
}

// Carrega imagem salva ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    document.getElementById('profile-pic').src = savedImage;
  }
});

//editar a imagem de perfil

let cropper;
let imagemCortadaBase64 = null;

// Função para abrir o modal de recorte
function abrirCropModal(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const cropImage = document.getElementById('crop-image');
      cropImage.src = e.target.result;

      // Exibe o modal de recorte
      document.getElementById('crop-modal').style.display = 'flex';

      // Destroi o cropper anterior, se existir
      if (cropper) {
        cropper.destroy();
      }

      // Inicia o cropper
      cropper = new Cropper(cropImage, {
        aspectRatio: 1, // Quadrado
        viewMode: 1,
      });
    };
    reader.readAsDataURL(file);
  }
}

// Função para confirmar o recorte e aplicar a imagem
function confirmarRecorte() {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas({
      width: 300,
      height: 300,
    });

    imagemCortadaBase64 = canvas.toDataURL('image/png');

    // Atualiza a visualização da imagem
    document.getElementById('profile-pic').src = imagemCortadaBase64;

    fecharCropModal(); // Fecha o modal
  }
}

// Função para fechar o modal de recorte
function fecharCropModal() {
  document.getElementById('crop-modal').style.display = 'none';
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}

// Função para salvar tudo, incluindo a imagem
function saveProfile() {
  // Salvar outros campos, se aplicável
  const name = document.getElementById('name-input').value;
  const bio = document.getElementById('bio-input').value;
  const phone = document.getElementById('phone-input').value;
  const email = document.getElementById('email-input').value;

  localStorage.setItem('name', name);
  localStorage.setItem('bio', bio);
  localStorage.setItem('phone', phone);
  localStorage.setItem('email', email);

  // Salva a imagem recortada, se houver
  if (imagemCortadaBase64) {
    localStorage.setItem('profileImage', imagemCortadaBase64);
  }

  // Atualiza exibição
  document.getElementById('name-display').textContent = name;
  document.getElementById('bio-display').textContent = bio;
  document.getElementById('phone-display').textContent = phone;
  document.getElementById('email-display').textContent = email;

  toggleEdit(false); // Fecha o modo de edição
}

// Carregar dados salvos no localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedImage = localStorage.getItem('profileImage');
  const savedName = localStorage.getItem('name');
  const savedBio = localStorage.getItem('bio');
  const savedPhone = localStorage.getItem('phone');
  const savedEmail = localStorage.getItem('email');

  if (savedImage) document.getElementById('profile-pic').src = savedImage;
  if (savedName) document.getElementById('name-display').textContent = savedName;
  if (savedBio) document.getElementById('bio-display').textContent = savedBio;
  if (savedPhone) document.getElementById('phone-display').textContent = savedPhone;
  if (savedEmail) document.getElementById('email-display').textContent = savedEmail;
});
