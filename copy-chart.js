/* iSignal Charts - shared copy/embed helper */
(function () {
  'use strict';

  var CHART_ORIGIN = window.location.origin;

  function getChartHeight() {
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
    if (window.parent === window) return;

    var referrerOrigin = '*';
    try {
      if (document.referrer) {
        referrerOrigin = new URL(document.referrer).origin;
      }
    } catch (e) {}

    window.parent.postMessage({
      type: 'isignal-chart-height',
      height: getChartHeight()
    }, referrerOrigin);
  }

  function makeEmbedCode() {
    var src = window.location.href.split('#')[0];
    var id = 'isignal-chart-' + Math.random().toString(36).slice(2, 10);

    return '<div style="width:100%;">\n' +
      '  <iframe id="' + id + '" src="' + src + '" ' +
      'style="width:100%;border:0;display:block;" scrolling="no"></iframe>\n' +
      '  <script>\n' +
      '  (function(){\n' +
      '    var f=document.getElementById("' + id + '");\n' +
      '    window.addEventListener("message",function(e){\n' +
      '      if(e.source!==f.contentWindow) return;\n' +
      '      if(!e.data || e.data.type!=="isignal-chart-height") return;\n' +
      '      f.style.height=Math.max(1,Number(e.data.height)||0)+"px";\n' +
      '    });\n' +
      '  })();\n' +
      '  <\\/script>\n' +
      '</div>';
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
          setTimeout(function () {
            button.textContent = 'Copy chart';
          }, 1800);
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
      setTimeout(function () {
        button.textContent = 'Copy chart';
      }, 1800);
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
      '#isignal-copy-chart-btn:hover {' +
      'background:#f0f0f0;' +
      'color:#333;' +
      '}' +
      '#isignal-copy-chart-btn:focus {' +
      'outline:1px solid #999;' +
      'outline-offset:1px;' +
      '}';
    document.head.appendChild(style);
  }

  function start() {
    addStyles();
    addCopyButton();
    sendHeight();

    if (window.ResizeObserver) {
      var observer = new ResizeObserver(function () {
        sendHeight();
      });
      observer.observe(document.documentElement);
      if (document.body) observer.observe(document.body);
    } else {
      window.addEventListener('resize', sendHeight);
      setInterval(sendHeight, 500);
    }

    window.addEventListener('load', sendHeight);
    setTimeout(sendHeight, 100);
    setTimeout(sendHeight, 500);
    setTimeout(sendHeight, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();