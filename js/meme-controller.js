"use strict";

const TOUCH_EVS = ["touchstart", "touchmove", "touchend"];

let gElCanvas;
let gCtx;

function onInit() {
  gElCanvas = document.querySelector("canvas");
  gCtx = gElCanvas.getContext("2d");

  gElCanvas.addEventListener("click", onClick);
  gElCanvas.addEventListener("click", onClick);
}

function renderMeme(meme) {
  const { selectedImgId, selectedLineIdx, lines } = meme;

  if (selectedImgId !== null) {
    const imageIdx = selectedImgId - 1;
    const elImg = new Image();
    elImg.src = getImgByIdx(imageIdx);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
    drawLines(lines, selectedLineIdx);
  }
  return;
}

function onTxtInput(elTxt) {
  setLineTxt(elTxt);
  renderMeme(gMeme);
}

function drawLine(line, indx) {
  const margin = indx * 50;
  const textMargin = 10;

  const { txt, size, color, align } = line;
  gCtx.fillStyle = `${color}`;
  gCtx.font = `${size}px Arial`;

  gCtx.textAlign = align; // Update the text alignment

  gCtx.textBaseline = "middle";

  // Calculate the width of the text
  const textWidth = gCtx.measureText(txt).width;

  const textX = gElCanvas.width / 2;

  // Draw the text
  gCtx.fillText(txt, textX, 100 + margin);

  if (indx === gMeme.selectedLineIdx) {
    // Calculate the y-coordinate and height for the rectangle
    const textHeight = size + 2 * textMargin;
    const textY = 100 - textHeight / 2 + margin;

    // Calculate the x-coordinate for the left edge of the rectangle (subtract half of textWidth)
    const rectX = textX - textWidth / 2;

    // Draw the rectangle
    gCtx.strokeRect(rectX, textY, textWidth, textHeight);
    gCtx.strokeStyle = "transparent";
    setLineCoords(indx, rectX, textY, textWidth, textHeight);
  }
}

function downloadCanvas(elLink) {
  elLink.download = "my-img";

  const dataUrl = gElCanvas.toDataURL();
  elLink.href = dataUrl;
}

function onChangeFontSize(value) {
  changeFontSize(value);
  renderMeme(gMeme);
}

function onChangeColor(value) {
  changeColor(value);
  renderMeme(gMeme);
}

function drawLines(lines) {
  lines.map((line, index) => drawLine(line, index));
  return;
}

function onSwitchLine() {
  switchLine();
  renderMeme(gMeme);
  const selectedLine = gMeme.lines[gMeme.selectedLineIdx];
  const elTxtInput = document.getElementById("text-input");
  elTxtInput.placeholder = selectedLine.txt;
}

function onAddLine() {
  addLine();
  renderMeme(gMeme);
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (TOUCH_EVS.includes(ev.type)) {
    // Gets the first touch point
    ev.preventDefault();
    ev = ev.changedTouches[0];
    // Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function onClick(ev) {
  const clickPos = getEvPos(ev);
  gMeme.lines.forEach((line, idx) => {
    const { posX, posY, textHight, textWidth } = line;

    if (
      clickPos.x >= posX &&
      clickPos.x >= posX &&
      clickPos.x <= posX + textWidth &&
      clickPos.y >= posY &&
      clickPos.y <= posY + textHight
    ) {
      switchWithClick(idx);
      renderMeme(gMeme);
    }
  });
}

function switchSection() {
  const elGallery = document.querySelector(".imgs-container");
  const elEditor = document.querySelector(".editor");
  const elGalleryHeder = document.querySelector(".gallery-header");

  // console.log(elNavBtnTxt.innerText);

  elGallery.classList.toggle("hide");
  elEditor.classList.toggle("hide");
  elGalleryHeder.classList.toggle("hide");
}

function onRemoveLine() {
  const lastLineIdx = gMeme.lines.length - 1;
  const lastLine = gMeme.lines[lastLineIdx];
  const { posX, posY, textWidth, textHeight } = lastLine;
  gCtx.clearRect(posX, posY, textWidth, textHeight);
  gMeme.lines.splice(lastLineIdx, 1);
  renderMeme(gMeme);
}

function OnFlexible() {
  const randomImgId = getRandomInt(1, gImgs.length + 1);
  setImg(randomImgId);
  const randomText = getRandomText();
  setLineTxt(randomText);
  renderMeme(gMeme);
  switchSection();
}

function getRandomText() {
  const texts = ["i love memes", "hello", "love code"];
  const randomIndex = getRandomInt(0, texts.length);
  return texts[randomIndex];
}

function onAlignText(alignment) {
  setAlignment(alignment);
  renderMeme(gMeme);
}

function changeFont() {
  var elFont = document.querySelector(".select-font").value;
  var line = gMeme.lines[gMeme.selectedLineIdx];
  line.font = elFont;
  renderMeme(gMeme);
}
