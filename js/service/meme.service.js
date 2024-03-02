"use strict";

const MEME_DB = "memesDB";
let isDragging = false;
var gMeme = {
  selectedImgId: null,
  selectedLineIdx: 0,
  selectedIconIdx: null,
  icons: [],
  lines: [
    {
      txt: "First line ",
      size: 30,
      color: "black",
      align: "center",
      font: "Impact",
      underline: false,

      posX: 250,
      posY: 250,
    },
  ],
};

function getMeme() {
  return gMeme;
}

function getImgByIdx(idx) {
  return gImgs[idx].url;
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
        line.posX = 10;
        break;
      case "center":
        line.posX = canvasWidth / 2;
        break;
      case "right":
        line.posX = canvasWidth - textWidth - 10;
        break;
    }
  });

  renderMeme(gMeme);
}

/* add icons */
function addIcon(iconCharacter) {
  const defaultPosY = 200;
  const defaultPosX = 200;

  gMeme.icons.push({
    icon: iconCharacter,
    x: defaultPosX,
    y: defaultPosY,
    size: 40,
  });
  console.log(iconCharacter);
}

function renderIcons() {
  gMeme.icons.forEach((icon) => {
    gCtx.font = `${icon.size}px Arial`;
    gCtx.fillText(icon.icon, icon.x, icon.y);
  });
}

/*Share*/
/*facebook */

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData();
  formData.append("img", imgDataUrl);

  const XHR = new XMLHttpRequest();
  XHR.onreadystatechange = () => {
    if (XHR.readyState !== XMLHttpRequest.DONE) return;
    if (XHR.status !== 200) return console.error("Error uploading image");
    const { responseText: url } = XHR;

    console.log("Got back live url:", url);
    onSuccess(url);
  };
  XHR.onerror = (req, ev) => {
    console.error(
      "Error connecting to server with request:",
      req,
      "\nGot response data:",
      ev
    );
  };
  XHR.open("POST", "//ca-upload.com/here/upload.php");
  XHR.send(formData);
}
