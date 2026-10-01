/* iSignal Charts - global iframe auto-height */
(function () {
  'use strict';

  var CHART_ORIGIN = 'https://vijay-jay-jadhav.github.io';
  var CHART_PATH = '/ISignal-Charts/charts/';

  function resizeIframe(iframe, height) {
    var value = Number(height);
    if (!isFinite(value) || value < 1) return;
    iframe.style.height = Math.ceil(value) + 'px';
  }

  function handleMessage(event) {
    if (event.origin !== CHART_ORIGIN) return;
    if (!event.data || event.data.type !== 'isignal-chart-height') return;
    if (!event.source) return;

    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];

      try {
        if (iframe.contentWindow === event.source) {
          var src = iframe.getAttribute('src') || '';
          if (src.indexOf(CHART_ORIGIN + CHART_PATH) === 0) {
            resizeIframe(iframe, event.data.height);
          }
          break;
        }
      } catch (e) {}
    }
  }

  window.addEventListener('message', handleMessage);
})();