"use strict";

const TOUCH_EVS = ["touchstart", "touchmove", "touchend"];

window.onload = onInit;
let gElCanvas;
let gCtx;

function onInit() {
  gElCanvas = document.querySelector("canvas");
  gCtx = gElCanvas.getContext("2d");

  window.addEventListener("resize", resizeCanvas);
  gElCanvas.addEventListener("click", onClick);
  resizeCanvas();
}

function renderMeme(meme) {
  const { selectedImgId, lines } = meme;

  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);

  if (selectedImgId !== null) {
    const imageIdx = selectedImgId - 1;
    const elImg = new Image();
    elImg.onload = function () {
      gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
      renderIcons();
      lines.forEach((line, index) => drawLine(line, index));
    };
    elImg.src = getImgByIdx(imageIdx);
  } else {
    lines.forEach((line, index) => drawLine(line, index));
  }
}

function onTxtInput(elTxt) {
  setLineTxt(elTxt);
  renderMeme(gMeme);
}

function drawLine(line, indx) {
  const { txt, size, color, align, font, posX, posY } = line;

  gCtx.fillStyle = color;
  gCtx.font = `${size}px ${font}`;
  gCtx.textAlign = align;
  gCtx.textBaseline = "middle";

  gCtx.fillText(txt, posX, posY);
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
  gMeme.selectedLineIdx += 1;
  if (gMeme.selectedLineIdx >= gMeme.lines.length) {
    gMeme.selectedLineIdx = 0;
  }
  const selectedLine = gMeme.lines[gMeme.selectedLineIdx];
  const elTxtInput = document.getElementById("text-input");
  const elFontSelect = document.querySelector(".select-font");

  elTxtInput.value = selectedLine.txt;
  elFontSelect.value = selectedLine.font;

  renderMeme(gMeme);
}

function onAddLine() {
  console.log("Adding line");

  addLine();
  renderMeme(gMeme);
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (TOUCH_EVS.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];

    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function onClick(ev) {
  const clickPos = getEvPos(ev);

  const clickedIconIdx = gMeme.icons.findIndex((icon) => {
    return (
      clickPos.x >= icon.x - icon.size / 2 &&
      clickPos.x <= icon.x + icon.size / 2 &&
      clickPos.y >= icon.y - icon.size / 2 &&
      clickPos.y <= icon.y + icon.size / 2
    );
  });

  if (clickedIconIdx !== -1) {
    gMeme.selectedIconIdx = clickedIconIdx;
  } else {
    gMeme.selectedIconIdx = null;
    gMeme.lines.forEach((line, idx) => {
      const { posX, posY, size } = line;
      gCtx.font = `${line.size}px ${line.font}`;
      const textWidth = gCtx.measureText(line.txt).width;
      const textHeight = line.size;

      if (
        clickPos.x >= posX - textWidth / 2 &&
        clickPos.x <= posX + textWidth / 2 &&
        clickPos.y >= posY - textHeight / 2 &&
        clickPos.y <= posY + textHeight / 2
      ) {
        switchWithClick(idx);
        renderMeme(gMeme);
      }
    });
  }
}

function onRemoveLine() {
  if (gMeme.lines.length > 0) {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = Math.max(0, gMeme.selectedLineIdx - 1);
    renderMeme(gMeme);
  } else {
    console.log("No lines to remove");
  }
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

function changeFont() {
  var selectedFont = document.querySelector(".select-font").value;
  if (gMeme.lines.length > 0 && gMeme.selectedLineIdx != null) {
    gMeme.lines[gMeme.selectedLineIdx].font = selectedFont;
    renderMeme(gMeme);
  }
}

function toggleMenu() {
  document.body.classList.toggle("menu-open");
  const menuButton = document.querySelector(".toggle-menu-btn");

  if (document.body.classList.contains("menu-open")) {
    menuButton.textContent = "X";
  } else {
    menuButton.textContent = "☰";
  }
}

function onSaveMeme() {
  const memeImageURL = gElCanvas.toDataURL("image/png");

  const memeToSave = { ...gMeme, imageUrl: memeImageURL };

  const savedMemes = loadFromStorage(MEME_DB) || [];
  savedMemes.push(memeToSave);
  saveToStorage(MEME_DB, savedMemes);

  alert("Meme saved!");
  switchToSavedGallery();
}

function displaySavedMemes() {
  const savedMemes = loadFromStorage(MEME_DB) || [];
  const container = document.querySelector(".saved-memes-container");
  container.innerHTML = "";

  savedMemes.forEach((meme, index) => {
    const imgElement = document.createElement("img");
    imgElement.src = meme.imageUrl;
    imgElement.className = "saved-meme-img";
    imgElement.onclick = () => editSavedMeme(index);
    container.appendChild(imgElement);
  });
}

function editSavedMeme(index) {
  const savedMemes = loadFromStorage(MEME_DB);
  const memeToEdit = savedMemes[index];
  if (memeToEdit) {
    gMeme = memeToEdit;
    renderMeme(gMeme);

    document.querySelector(".saved-memes-section").style.display = "none";
    document.querySelector(".main-gallery").style.display = "none";
    document.querySelector(".editor").style.display = "grid";
  }
}

function resizeCanvas() {
  const maxWidth = 400;
  const maxHeight = 400;
  const minWidth = 300;
  const minHeight = 300;

  if (window.innerWidth < 500) {
    gElCanvas.width = minWidth;
    gElCanvas.height = minHeight;
  } else {
    gElCanvas.width = maxWidth;
    gElCanvas.height = maxHeight;
  }

  renderMeme(gMeme);
}

/* icons */
function onSetIcons(iconCharacter) {
  addIcon(iconCharacter);
  renderMeme(gMeme);
}

/*share to facebook */
function onImgInput(ev) {
  loadImageFromInput(ev, renderImg);
}

function onshareMeme() {
  const imgDataUrl = gElCanvas.toDataURL("image/jpeg");

  function onSuccess(uploadedImgUrl) {
    const url = encodeURIComponent(uploadedImgUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`);
  }

  doUploadImg(imgDataUrl, onSuccess);
}

/*movment */
function onSetLinePosDown() {
  setLinePosDown();
}

function onSetLinePosUp() {
  setLinePosUp();
}

function onSetLinePosRight() {
  setLinePosRight();
}

function onSetLinePosLeft() {
  setLinePosLeft();
}

function onAlignText(alignment) {
  setAlignment(alignment);
  renderMeme(gMeme);
}

/*SWITCH SECTIONS */
function switchSection() {
  document.getElementById("aboutSection").classList.add("hide");

  const elGallery = document.querySelector(".imgs-container");
  const elEditor = document.querySelector(".editor-layout");
  const elGalleryHeader = document.querySelector(".gallery-header");

  elGallery.classList.toggle("hide");
  elEditor.classList.toggle("hide");
  elGalleryHeader.classList.toggle("hide");
}

function switchToGallery() {
  document.querySelector(".editor").classList.add("hide");
  document.querySelector(".saved-memes-section").classList.add("hide");
  document.getElementById("aboutSection").classList.add("hide");

  document.querySelector(".main-gallery").classList.remove("hide");

  document.querySelector(".gallery-header").classList.remove("hide");

  renderGallery();
}

function switchToSavedGallery() {
  document.getElementById("aboutSection").classList.add("hide");
  document.querySelector(".editor").classList.add("hide");
  document.querySelector(".main-gallery").classList.add("hide");
  document.querySelector(".saved-memes-section").classList.remove("hide");
}

function showabout() {
  document.querySelector(".main-gallery").classList.add("hide");
  document.querySelector(".editor").classList.add("hide");
  document.querySelector(".saved-memes-section").classList.add("hide");

  document.getElementById("aboutSection").classList.remove("hide");
}
