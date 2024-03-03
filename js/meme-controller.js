"use strict";

const TOUCH_EVS = ["touchstart", "touchmove", "touchend"];
let isDragging = false;
let draggedElement = null;
let draggedElementType = null;
let offsetX = 0;
let offsetY = 0;

window.onload = onInit;
let gElCanvas;
let gCtx;

function onInit() {
  gElCanvas = document.querySelector("canvas");
  gCtx = gElCanvas.getContext("2d");

  gElCanvas.addEventListener("mousedown", onMouseDown);
  gElCanvas.addEventListener("mousemove", onMouseMove);
  gElCanvas.addEventListener("mouseup", onMouseUp);
  gElCanvas.addEventListener("mouseleave", onMouseUp);

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

function onRemoveSelected() {
  // Check if a line is selected
  if (gMeme.selectedLineIdx !== null && gMeme.lines.length > 0) {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = null; // Reset selected line index
    renderMeme(gMeme);
  }
  // Check if an icon is selected
  else if (gMeme.selectedIconIdx !== null && gMeme.icons.length > 0) {
    gMeme.icons.splice(gMeme.selectedIconIdx, 1);
    gMeme.selectedIconIdx = null; // Reset selected icon index
    renderMeme(gMeme);
  } else {
    console.log("No elements to remove");
  }
}

function OnFlexible() {
  const randomImgId = getRandomInt(1, gImgs.length + 1);
  setImg(randomImgId);
  const randomText = getRandomText();
  setLineTxt(randomText);
  renderMeme(gMeme);
  switchToEditor();
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

/*drag and drop */

function onMouseDown(e) {
  const { x, y } = getMousePos(gElCanvas, e);

  const iconIdx = gMeme.icons.findIndex((icon) => isMouseOnElement(x, y, icon));
  if (iconIdx !== -1) {
    startDrag(gMeme.icons[iconIdx], "icon");
    return;
  }

  const lineIdx = gMeme.lines.findIndex((line) =>
    isMouseOnElement(x, y, line, true)
  );
  if (lineIdx !== -1) {
    startDrag(gMeme.lines[lineIdx], "line");
    return;
  }
}

function onMouseMove(e) {
  if (!isDragging) return;
  const { x, y } = getMousePos(gElCanvas, e);
  draggedElement.x = x - offsetX;
  draggedElement.y = y - offsetY;

  if (draggedElementType === "line") {
    draggedElement.posX = x - offsetX;
    draggedElement.posY = y - offsetY;
  }

  renderMeme(gMeme);
}

function onMouseUp() {
  if (isDragging) {
    isDragging = false;
    draggedElement = null;
    draggedElementType = null;
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function isMouseOnElement(x, y, element, isLine = false) {
  if (isLine) {
    return (
      x >= element.posX &&
      x <= element.posX + 100 &&
      y >= element.posY - 30 &&
      y <= element.posY + 10
    );
  } else {
    return (
      x >= element.x - element.size / 2 &&
      x <= element.x + element.size / 2 &&
      y >= element.y - element.size / 2 &&
      y <= element.y + element.size / 2
    );
  }
}

function startDrag(element, type) {
  isDragging = true;
  draggedElement = element;
  draggedElementType = type;
  offsetX = gMouseX - element.x;
  offsetY = gMouseY - element.y;
}

/*SWITCH SECTIONS */

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

  displaySavedMemes();
}

function showabout() {
  document.querySelector(".main-gallery").classList.add("hide");
  document.querySelector(".editor").classList.add("hide");
  document.querySelector(".saved-memes-section").classList.add("hide");

  document.getElementById("aboutSection").classList.remove("hide");
}

function switchToEditor() {
  document.getElementById("aboutSection").classList.add("hide");
  document.querySelector(".main-gallery").classList.add("hide");
  document.querySelector(".saved-memes-section").classList.add("hide");

  document.querySelector(".editor").classList.remove("hide");
}
