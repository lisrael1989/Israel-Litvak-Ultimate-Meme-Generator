"use strict";
let gCanvas;
let gCtx;
let gMeme;

const TOUCH_EVENTS = ["touchstart", "touchmove", "touchend"];

function createMeme() {
  return {
    width: null,
    height: null,
    size: 30,
    align: "center",
    color: "#ffffff",

    txts: [
      {
        line: "",
        order: 0,
        posX: 80,
        posY: 60,
      },
    ],
  };
}

function renderCanvas() {
  var img = getCurrImg();
  var imgCanvas = new Image();
  imgCanvas.src = img.url;
  imgCanvas.onload = function () {
    drawCanvas(this);
    gMeme.txts.forEach(function (txt, idx) {
      renderTxt(txt, idx);
    });
  };
  return { width: imgCanvas.width, height: imgCanvas.height };
}
