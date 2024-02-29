"use strict";

const MEME_DB = "memesDB";
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

var gMeme = {
  selectedImgId: null,
  selectedLineIdx: 0,
  lines: [
    {
      txt: "First line ",
      size: 30,
      color: "black",
      align: "center",
      font: "Impact",
      underline: false,

      posX: null,
      posY: null,

      textWidth: null,
      textHight: null,
    },
  ],
};

function getMeme() {
  return gMeme;
}

function getImg() {
  return gImgs;
}

function getImgByIdx(idx = null) {
  if (idx !== null) {
    return gImgs[idx].url;
  }
}

function setLineTxt(elTxt) {
  gMeme.lines[gMeme.selectedLineIdx].txt = elTxt;
}

function setImg(id) {
  gMeme.selectedImgId = id;
}

function changeFontSize(value) {
  gMeme.lines[gMeme.selectedLineIdx].size += value;
}

function changeColor(value) {
  gMeme.lines[gMeme.selectedLineIdx].color = value;
  renderMeme(gMeme);
}

function switchLine() {
  gMeme.selectedLineIdx += 1;
  if (gMeme.selectedLineIdx > gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
}

function switchWithClick(idx) {
  gMeme.selectedLineIdx = idx;
  renderMeme(gMeme);
}

function addLine() {
  const defaultPosY = gMeme.lines.length * 50 + 50;
  gMeme.lines.push({
    txt: "New line",
    size: 30,
    color: "red",
    align: "left",
    font: "Impact",
    posX: 50,
    posY: defaultPosY,
  });
  gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function setLineCoords(indx, x, y, textWidth, textHight) {
  const currLine = gMeme.lines[indx];
  currLine.posX = x;
  currLine.posY = y;
  currLine.textWidth = textWidth;
  currLine.textHight = textHight;
}

function setAlignment(alignment) {
  const line = gMeme.lines[gMeme.selectedLineIdx];
  if (line) line.align = alignment;
  updatePosX();
}

function updatePosX() {
  const canvasWidth = gElCanvas.width;

  gMeme.lines.forEach(function (line, idx) {
    gCtx.font = `${line.size}px ${line.font}`;
    const textWidth = gCtx.measureText(line.txt).width;

    switch (line.align) {
      case "left":
        line.posX = 10; // A small margin from the left edge
        break;
      case "center":
        line.posX = canvasWidth / 2; // Center of the canvas
        break;
      case "right":
        line.posX = canvasWidth - textWidth - 10; // Adjusted for the width of the text
        break;
    }
  });

  renderMeme(gMeme);
}
