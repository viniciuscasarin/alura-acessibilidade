// Variáveis
var conteudoForaDoDialog = document.querySelector("#conteudoForaDoDialog");
var btnAbreDialog = document.querySelector("#abreDialog");
var dialog = document.querySelector(".dialogNewsletter");
var dialogBody = document.querySelector(".dialogNewsletter-body");
var dialogOverlay = document.querySelector(".dialogNewsletter-overlay");

btnAbreDialog.style.display = "block";

// Quando abrir a dialog...
btnAbreDialog.addEventListener("click", function () {
  dialog.classList.add("dialogNewsletter--aberto");
  document.querySelector(".dialogNewsletter-campo").focus();
  conteudoForaDoDialog.inert = true;
});

function fechandoDialog() {
  document.activeElement.blur();
  dialog.classList.remove("dialogNewsletter--aberto");
  conteudoForaDoDialog.inert = false;
  btnAbreDialog.focus();
}

// Listeners
document
  .querySelector(".dialogNewsletter-fechar")
  .addEventListener("click", fechandoDialog);

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 27) {
    fechandoDialog();
  }
});

dialogOverlay.addEventListener("click", function () {
  fechandoDialog();
});
