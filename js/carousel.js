var btns = document.querySelectorAll(".listaDeArtigos-slider-item");
var news0 = document.querySelector("#new0");
var news1 = document.querySelector("#new1");
var news2 = document.querySelector("#new2");
var news = document.querySelectorAll(".listaDeArtigos-item");

news0.style.display = "block";

var indicadorSlideAtual = document.createElement("span");
indicadorSlideAtual.classList.add("escondeVisualmente");
indicadorSlideAtual.id = "slideAtual";
indicadorSlideAtual.textContent = "(Slide atual)";

// Percorre todos os botoes controladores
btns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var noticiaSelecionada = this.getAttribute("data-sliderItem");
    news.forEach(function (noticia) {
      noticia.style.display = "none";

      if (noticiaSelecionada === noticia.getAttribute("data-news")) {
        noticia.style.display = "block";
      }
    });

    document.querySelector("#slideAtual")?.remove();
    this.append(indicadorSlideAtual);

    // Remove classe 'ativo' dos outros botoes
    btns.forEach(function (btnRemoveClass) {
      btnRemoveClass.classList.remove("listaDeArtigos-slider-item--ativo");
    });

    this.classList.add("listaDeArtigos-slider-item--ativo");
  });
});
