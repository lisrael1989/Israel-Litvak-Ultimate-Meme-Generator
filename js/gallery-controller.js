"use strict";

renderGallery();

function renderGallery() {
  const elGallery = document.querySelector(".imgs-container");
  const imgs = getImg();

  const strHTML = imgs
    .map((img) => {
      return `<img src="meme-imgs/${img.id}.jpg" id="${img.id}" onclick="onSelectImg(id)" />`;
    })
    .join("");

  elGallery.innerHTML = strHTML;
}

function onSelectImg(id) {
  setImg(id);
  renderMeme(gMeme);
  switchSection();
}
