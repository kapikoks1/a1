/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var StyleManager = /*#__PURE__*/function () {
  function StyleManager(styles) {
    _classCallCheck(this, StyleManager);
    this.currentStyle = null;
    this.styles = styles;
    this.createStyleLinks();
    this.setupEventListeners();
  }
  return _createClass(StyleManager, [{
    key: "createStyleLinks",
    value: function createStyleLinks() {
      var navElement = document.querySelector('nav');
      if (!navElement) {
        navElement = document.createElement('nav');
        document.body.prepend(navElement);
      }
      // Iteracja po stylach i tworzenie linków
      Object.keys(this.styles).forEach(function (style) {
        var link = document.createElement('a');
        link.textContent = "".concat(style);
        link.href = '#';
        link.setAttribute('data-style', style);
        link.classList.add('style-link');
        navElement.appendChild(link);
      });
    }
  }, {
    key: "applyStyle",
    value: function applyStyle(style) {
      console.log('Zmiana stylu na:', style);
      if (!this.styles[style]) {
        console.error("Style '".concat(style, "' not found in styles dictionary."));
        return;
      }
      var existingLink = document.querySelector('link#current-style');
      if (existingLink) {
        existingLink.remove();
      }
      var newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = this.styles[style];
      newLink.id = 'current-style';
      document.head.appendChild(newLink);
      this.currentStyle = style;
    }
    // Ustaw nasłuchiwacze na kliknięcia w linki
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      var styleLinks = document.querySelectorAll('a[data-style]');
      styleLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          var target = event.target;
          var newStyle = target.getAttribute('data-style');
          if (newStyle) {
            // Zmień styl na wybrany
            _this.applyStyle(newStyle);
          }
        });
      });
    }
  }]);
}();
var styles = {
  'css1': 'style/page1.css',
  'css2': 'style/page2.css'
};
new StyleManager(styles);
/******/ })()
;