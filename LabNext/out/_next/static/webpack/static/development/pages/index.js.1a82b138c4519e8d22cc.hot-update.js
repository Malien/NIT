webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/util/pollyfilling.ts":
/*!**********************************!*\
  !*** ./src/util/pollyfilling.ts ***!
  \**********************************/
/*! exports provided: fromEntries */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromEntries", function() { return fromEntries; });
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");

// Guess I'll be writing pollyfill for Object.fromEntries
function fromEntries(entries) {
  var out = {};
  entries.forEach(function (_ref) {
    var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    out[key] = value;
  });
  return out;
}

/***/ })

})
//# sourceMappingURL=index.js.1a82b138c4519e8d22cc.hot-update.js.map