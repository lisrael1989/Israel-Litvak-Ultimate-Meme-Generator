"use strict";

function onInit() {
  renderGallery(gImgs);
}

function renderGallery() {
  const imgs = getImgs();
  var strHTMLs = "";

  imgs.forEach((img) => {
    strHTMLs += `
<img src="${img.url}" onclick="onImgSelect(this,${img.url})">
`;
  });
  document.querySelector(".imgs-container").innerHTML = strHTMLs;
  setImgs(imgs);
}

function onImgSelect(elImg, imgUrl) {
  setImg(elImg, imgUrl);
  renderMeme();
}
