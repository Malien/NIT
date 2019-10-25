webpackHotUpdate("static/development/pages/index.js",{

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_components_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/components/common */ "./src/components/common.tsx");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/index.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _src_api_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/api/browser */ "./src/api/browser.ts");


var _jsxFileName = "/Users/yaroslav/Developer/Study/NIT/LabNext/pages/index.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;




var desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
var items = [{
  name: "Light night blouse",
  description: desc,
  id: Object(uuid__WEBPACK_IMPORTED_MODULE_4__["v1"])(),
  previews: ["static/assets/SVG/category-2.svg"],
  tags: [],
  price: 39.99,
  prevPrice: 59.99,
  rating: 5,
  bias: 1.5
}, {
  name: "Indigo jeans",
  description: desc,
  id: Object(uuid__WEBPACK_IMPORTED_MODULE_4__["v1"])(),
  previews: ["static/assets/SVG/category-3.svg"],
  tags: [],
  price: 39.99,
  rating: 4,
  bias: -1
}, {
  name: "French berette",
  description: desc,
  id: Object(uuid__WEBPACK_IMPORTED_MODULE_4__["v1"])(),
  previews: ["static/assets/SVG/category-1.svg"],
  tags: [],
  price: 24.99,
  prevPrice: 34.99,
  rating: 3,
  outOfStock: true
}, {
  name: "Khaki overalls",
  description: desc,
  id: Object(uuid__WEBPACK_IMPORTED_MODULE_4__["v1"])(),
  previews: ["static/assets/SVG/category-3.svg"],
  tags: [],
  price: 39.99,
  rating: 2
}, {
  name: "Cristy blouse",
  description: desc,
  id: Object(uuid__WEBPACK_IMPORTED_MODULE_4__["v1"])(),
  previews: ["static/assets/SVG/category-2.svg"],
  tags: [],
  price: 39.99,
  rating: 5,
  bias: -0.5
}, {
  name: "\"Engage\" shirt",
  description: desc,
  id: Object(uuid__WEBPACK_IMPORTED_MODULE_4__["v1"])(),
  previews: ["static/assets/SVG/category-2.svg"],
  tags: [],
  price: 39.99,
  rating: 2
}];

var IndexPage = function IndexPage(props) {
  return __jsx(_src_components_common__WEBPACK_IMPORTED_MODULE_3__["AppFrame"], {
    path: "/",
    name: "All Items",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 81
    },
    __self: this
  }, props.err && __jsx(_src_components_common__WEBPACK_IMPORTED_MODULE_3__["ErrorMsg"], {
    msg: "Error occured while loading products",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82
    },
    __self: this
  }), __jsx(_src_components_common__WEBPACK_IMPORTED_MODULE_3__["Storefront"], {
    items: items,
    sections: [{
      title: "Hats and Accessories",
      items: props.hats,
      link: "/accessories"
    }, {
      title: "Jackets and tops",
      items: props.tops,
      link: "/tops"
    }, {
      title: "Pants and leggins",
      items: props.leggins,
      link: "/leggins"
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 83
    },
    __self: this
  }));
};

IndexPage.getInitialProps =
/*#__PURE__*/
function () {
  var _ref = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(ctx) {
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!ctx.req) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", {
              hats: __webpack_require__(/*! ../static/items/hats.json */ "./static/items/hats.json"),
              tops: __webpack_require__(/*! ../static/items/tops.json */ "./static/items/tops.json"),
              leggins: __webpack_require__(/*! ../static/items/leggins.json */ "./static/items/leggins.json")
            });

          case 4:
            return _context.abrupt("return", Object(_src_api_browser__WEBPACK_IMPORTED_MODULE_5__["fetchItems"])({
              hats: "/static/items/hats.json",
              tops: "/static/items/tops.json",
              leggins: "/static/items/leggins.json"
            }, []));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (IndexPage);

/***/ })

})
//# sourceMappingURL=index.js.f67c7cbc46080da9a960.hot-update.js.map