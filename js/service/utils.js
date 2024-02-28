"use strict";

function makeId(length = 6) {
  let id = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    id += possible.charAt(getRandomInt(0, possible.length));
  }
  return id;
}
