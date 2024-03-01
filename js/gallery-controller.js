"use strict";

var gFilterBy = {
  keywords: "",
};

var gImgs = [
  { id: 1, url: "meme-imgs/1.jpg", keywords: ["famous", "tramp"] },
  { id: 2, url: "meme-imgs/2.jpg", keywords: ["pets", "dog"] },
  { id: 3, url: "meme-imgs/3.jpg", keywords: ["funny", "cat"] },
  { id: 4, url: "meme-imgs/4.jpg", keywords: ["pets", "cat"] },
  { id: 5, url: "meme-imgs/5.jpg", keywords: ["funny", "baby"] },
  { id: 6, url: "meme-imgs/6.jpg", keywords: ["funny", "cat"] },
  { id: 7, url: "meme-imgs/7.jpg", keywords: ["funny", "kids"] },
  { id: 8, url: "meme-imgs/8.jpg", keywords: ["funny", "movie"] },
  { id: 9, url: "meme-imgs/9.jpg", keywords: ["famous", "kids"] },
  { id: 10, url: "meme-imgs/10.jpg", keywords: ["funny", "cat"] },
  { id: 11, url: "meme-imgs/11.jpg", keywords: ["funny", "movie"] },
  { id: 12, url: "meme-imgs/12.jpg", keywords: ["funny", "cat"] },
  { id: 13, url: "meme-imgs/13.jpg", keywords: ["famous", "funny"] },
  { id: 14, url: "meme-imgs/14.jpg", keywords: ["movie", "scary"] },
  { id: 15, url: "meme-imgs/15.jpg", keywords: ["famous", "cat"] },
  { id: 16, url: "meme-imgs/16.jpg", keywords: ["movie", "cat"] },
  { id: 17, url: "meme-imgs/17.jpg", keywords: ["famous", "dictator"] },
  { id: 18, url: "meme-imgs/18.jpg", keywords: ["movie", "funny"] },
];

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

function getImg() {
  if (!gFilterBy.keywords) return gImgs;

  const filteredImgs = gImgs.filter((img) =>
    img.keywords.some((keyword) =>
      keyword.toLowerCase().includes(gFilterBy.keywords.toLowerCase())
    )
  );

  return filteredImgs;
}

function onSelectImg(id) {
  setImg(id);
  renderMeme(gMeme);
  switchSection();
}

/* fillter Keywords*/

function onSetFilterBy(filterBy) {
  setFilterBy(filterBy);
  renderGallery();
}

function setFilterBy(filterBy) {
  if (filterBy.keywords !== undefined) gFilterBy.keywords = filterBy.keywords;
}
