"use strict";

const MEME_DB = "memesDB";

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
