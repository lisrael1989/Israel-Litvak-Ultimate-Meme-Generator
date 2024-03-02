"use strict";

const TOUCH_EVS = ["touchstart", "touchmove", "touchend"];

let gElCanvas;
let gCtx;

function onInit() {
  gElCanvas = document.querySelector("canvas");
  gCtx = gElCanvas.getContext("2d");

  gElCanvas.addEventListener("click", onClick);
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
  const margin = indx * 50;
  const textMargin = 10;

  const { txt, size, color, align, font } = line;
  gCtx.fillStyle = color;
  gCtx.font = `${size}px ${font}`;
  gCtx.textAlign = align;
  gCtx.textBaseline = "middle";

  let textX;
  switch (align) {
    case "left":
      textX = 10;
      break;
    case "center":
      textX = gElCanvas.width / 2;
      break;
    case "right":
      textX = gElCanvas.width - 10;
      break;
  }

  gCtx.fillText(txt, textX, 100 + margin);
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
    return;
  }

  gMeme.lines.forEach((line, idx) => {
    const { posX, posY, textHeight, textWidth } = line;

    if (
      clickPos.x >= posX &&
      clickPos.x <= posX + textWidth &&
      clickPos.y >= posY &&
      clickPos.y <= posY + textHeight
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

  elGallery.classList.toggle("hide");
  elEditor.classList.toggle("hide");
  elGalleryHeder.classList.toggle("hide");
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

function onAlignText(alignment) {
  setAlignment(alignment);
  renderMeme(gMeme);
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

/*saved memes */
function onSaveMeme() {
  const memeImageURL = gElCanvas.toDataURL("image/png");

  const memeToSave = { ...gMeme, imageUrl: memeImageURL };

  const savedMemes = loadFromStorage(MEME_DB) || [];
  savedMemes.push(memeToSave);
  saveToStorage(MEME_DB, savedMemes);

  alert("Meme saved!");
  switchToSavedGallery();
}

function switchToSavedGallery() {
  document.querySelector(".editor").style.display = "none";
  document.querySelector(".main-gallery").style.display = "none";
  document.querySelector(".saved-memes-section").style.display = "block";
  displaySavedMemes();
}

function switchToAboutSection() {
  const elGallery = document.querySelector(".imgs-container");
  const elEditor = document.querySelector(".editor");
  const elGalleryHeder = document.querySelector(".gallery-header");

  elGallery.classList.toggle("hide");
  elEditor.classList.toggle("hide");
  elGalleryHeder.classList.toggle("hide");
  document.querySelector(".about-section").style.display = "block";
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
