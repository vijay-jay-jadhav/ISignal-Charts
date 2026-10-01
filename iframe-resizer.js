/* iSignal Charts - parent-page iframe auto-height helper */
(function () {
  'use strict';

  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'isignal-chart-height') return;

    var iframe = Array.prototype.find.call(
      document.querySelectorAll('iframe'),
      function (frame) { return frame.contentWindow === event.source; }
    );

    if (!iframe) return;

    try {
      var allowed = new URL(iframe.src).hostname === 'vijay-jay-jadhav.github.io';
      if (!allowed) return;
    } catch (e) {
      return;
    }

    var height = Math.max(1, Number(event.data.height) || 0);
    iframe.style.height = height + 'px';
  });
})();