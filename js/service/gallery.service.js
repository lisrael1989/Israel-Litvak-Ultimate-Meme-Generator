"use strict";

var IMG_KEY = "currImg";

var gImgs = [
  { id: 1, url: "meme-imgs/1.jpg", keywords: ["famous", "tramp"] },
  { id: 2, url: "meme-imgs/2.jpg", keywords: ["pets", "dog"] },
  { id: 3, url: "meme-imgs/3.jpg", keywords: ["funny", "cat"] },
  { id: 4, url: "meme-imgs/4.jpg", keywords: ["pets", "cat"] },
  { id: 5, url: "meme-imgs/5.jpg", keywords: ["funny", "baby"] },
  { id: 6, url: "meme-imgs/6.jpg", keywords: ["funny", "cat"] },
  { id: 7, url: "meme-imgs/7.jpg", keywords: ["funny", "children"] },
  { id: 8, url: "meme-imgs/8.jpg", keywords: ["funny", "movie"] },
  { id: 9, url: "meme-imgs/9.jpg", keywords: ["famous", "children"] },
  { id: 10, url: "meme-imgs/10.jpg", keywords: ["funny", "cat"] },
  { id: 11, url: "meme-imgs/11.jpg", keywords: ["funny", "movie"] },
  { id: 12, url: "meme-imgs/12.jpg", keywords: ["funny", "cat"] },
  { id: 13, url: "meme-imgs/13.jpg", keywords: ["famous", "funny"] },
  { id: 14, url: "meme-imgs/14.jpg", keywords: ["movie", "scary"] },
  { id: 15, url: "meme-imgs/15.jpg", keywords: ["famous", "cat"] },
  { id: 16, url: "meme-imgs/16.jpg", keywords: ["movie", "cat"] },
  { id: 17, url: "meme-imgs/17.jpg", keywords: ["famous", "putin"] },
  { id: 18, url: "meme-imgs/18.jpg", keywords: ["movie", "funny"] },
];

let gKeywordSearchCountMap = {
  cat: 12,
  Baby: 4,
  famous: 10,
  movie: 8,
  funny: 24,
  children: 12,
};

function getImgs() {
  return gImgs;
}

function selectImg(elImg) {
  localStorage.clear();
  var imgId = elImg.id;
  var img = findItemById(imgId);
  showCanvas();
  saveCurrImg(img);
  initCanvas(img);
}

function findItemById(imgId) {
  for (var i = 0; i < gImgs.length; i++) {
    var img = gImgs[i];
    if (img.id === imgId) {
      return img;
    }
  }
}

function saveCurrImg(img) {
  saveToStorage(IMG_KEY, img);
}

function getCurrImg() {
  var currImg = loadFromStorage(IMG_KEY);
  return currImg;
}
