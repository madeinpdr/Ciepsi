document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = document.getElementById("btn-submit");

    function verificarCampos() {
        if (emailInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
            submitButton.classList.add("ativo");
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove("ativo");
            submitButton.disabled = true;
        }
    }

    emailInput.addEventListener("input", verificarCampos);
    passwordInput.addEventListener("input", verificarCampos);
});

Pass.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
