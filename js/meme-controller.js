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
  setLineTxt(elTxt.value);
  renderMeme(gMeme);
}

function drawLine(line, indx) {
  const margin = indx * 50;

  const { txt, size, color } = line;
  gCtx.fillStyle = `${color}`;
  gCtx.font = `${size}px Arial`;

  gCtx.textAlign = "center";
  gCtx.textBaseline = "middle";

  gCtx.fillText(txt, 200, 100 + margin);

  if (indx === gMeme.selectedLineIdx) {
    const textAspects = gCtx.measureText(txt);

    const textHight =
      textAspects.actualBoundingBoxAscent +
      textAspects.actualBoundingBoxDescent +
      10;

    const textWidth = textAspects.width;

    const x = 200 - textAspects.actualBoundingBoxRight;
    const y = 100 - textAspects.actualBoundingBoxAscent - 5 + margin;

    gCtx.strokeRect(x, y, textWidth, textHight);

    setLineCoords(indx, x, y, textWidth, textHight);
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

  // console.log(elNavBtnTxt.innerText);

  elGallery.classList.toggle("hide");
  elEditor.classList.toggle("hide");
}
