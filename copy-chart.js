/* iSignal Charts - shared copy chart helper */
(function () {
  'use strict';

  var ISIGNAL_ORIGINS = [
    'https://isignal.in',
    'https://www.isignal.in'
  ];

  function getHeight() {
    var body = document.body;
    var html = document.documentElement;
    return Math.ceil(Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      html ? html.scrollHeight : 0,
      html ? html.offsetHeight : 0,
      html ? html.clientHeight : 0
    ));
  }

  function sendHeight() {
    if (!window.parent || window.parent === window) return;

    var height = getHeight();
    var message = {
      type: 'isignal-chart-height',
      height: height
    };

    ISIGNAL_ORIGINS.forEach(function (origin) {
      window.parent.postMessage(message, origin);
    });
  }

  function startHeightReporter() {
    sendHeight();

    if (window.ResizeObserver) {
      var observer = new ResizeObserver(function () {
        sendHeight();
      });
      observer.observe(document.documentElement);
      if (document.body) observer.observe(document.body);
    }

    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);

    [100, 300, 600, 1000, 1500].forEach(function (delay) {
      setTimeout(sendHeight, delay);
    });
  }

  function makeEmbedCode() {
    var src = window.location.href.split('#')[0];
    return '<iframe src="' + src + '" width="100%" frameborder="0" scrolling="no"></iframe>';
  }

  function fallbackCopy(text, button) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();

    try {
      document.execCommand('copy');
      button.textContent = 'Copied!';
      setTimeout(function () { button.textContent = 'Copy chart'; }, 1800);
    } finally {
      document.body.removeChild(area);
    }
  }

  function addStyles() {
    if (document.getElementById('isignal-copy-chart-styles')) return;

    var style = document.createElement('style');
    style.id = 'isignal-copy-chart-styles';
    style.textContent =
      '#isignal-copy-chart-btn {' +
      'display:inline-block;' +
      'margin-top:6px;' +
      'padding:3px 8px;' +
      'border:1px solid #b8b8b8;' +
      'border-radius:3px;' +
      'background:transparent;' +
      'color:#666;' +
      'font:400 11px/1.3 "Fira Sans Condensed",Arial,sans-serif;' +
      'cursor:pointer;' +
      '}' +
      '#isignal-copy-chart-btn:hover { background:#f0f0f0; color:#333; }' +
      '#isignal-copy-chart-btn:focus { outline:1px solid #999; outline-offset:1px; }';
    document.head.appendChild(style);
  }

  function addCopyButton() {
    var source = document.querySelector('.src');
    if (!source || document.getElementById('isignal-copy-chart-btn')) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'isignal-copy-chart-btn';
    button.textContent = 'Copy chart';

    button.addEventListener('click', function () {
      var code = makeEmbedCode();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          button.textContent = 'Copied!';
          setTimeout(function () { button.textContent = 'Copy chart'; }, 1800);
        }).catch(function () {
          fallbackCopy(code, button);
        });
      } else {
        fallbackCopy(code, button);
      }
    });

    source.appendChild(document.createElement('br'));
    source.appendChild(button);
  }

  function start() {
    addStyles();
    addCopyButton();
    startHeightReporter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();