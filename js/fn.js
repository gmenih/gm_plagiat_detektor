function ResizeAnimate(width, height, ms) {
  var scrHeight = window.screen.availHeight;
  var scrWidth = window.screen.availWidth;
  var win = require('nw.gui').Window.get();
  if (width > scrWidth || height > scrHeight)
    win.maximize();
  else {
    win.resizeTo(width, height);
    win.moveTo((scrWidth / 2) - (win.width / 2), (scrHeight / 2) - (win.height /
      2));
  }
}
