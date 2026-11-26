/* Confeti: vendor/ local -> CDN -> respaldo propio (miniConfetti). El juego funciona igual sin ninguno. */
(function(){function L(u,n){var e=document.createElement('script');e.async=true;e.src=u;e.onerror=function(){n&&n()};document.head.appendChild(e)}
L('vendor/confetti.browser.min.js',function(){L('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js')})})();
