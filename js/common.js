var prefix = 'bs';
var importDoc = (document._currentScript || document.currentScript).ownerDocument;

// Create <style> elm with template CSS
var css = importDoc.querySelector('#x-css');
var style = document.createElement('style');

style.appendChild(css.content.cloneNode(true));
document.head.appendChild(style);
