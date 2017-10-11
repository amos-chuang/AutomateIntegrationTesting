module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fsExtra = __webpack_require__(1);

	var _fsExtra2 = _interopRequireDefault(_fsExtra);

	var _log = __webpack_require__(2);

	var _log2 = _interopRequireDefault(_log);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _webpack = __webpack_require__(4);

	var _webpack2 = _interopRequireDefault(_webpack);

	var _webpackMerge = __webpack_require__(5);

	var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DEFAULT_LOG_NAME = 'webpack.txt';

	var StaticServerLauncher = function () {
	  function StaticServerLauncher() {
	    _classCallCheck(this, StaticServerLauncher);
	  }

	  _createClass(StaticServerLauncher, [{
	    key: 'onPrepare',
	    value: function onPrepare(_ref) {
	      var _this = this;

	      var baseConfig = _ref.webpackConfig;
	      var driverConfig = _ref.webpackDriverConfig;
	      var logging = _ref.webpackLog;

	      if (!baseConfig && !driverConfig) {
	        return Promise.resolve();
	      }

	      this.baseConfig = baseConfig;
	      this.driverConfig = driverConfig;

	      if (logging) {
	        var stream = void 0;
	        if (typeof logging === 'string') {
	          var file = _path2.default.join(logging, DEFAULT_LOG_NAME);
	          _fsExtra2.default.createFileSync(file);
	          stream = _fsExtra2.default.createWriteStream(file);
	        }
	        this.log = new _log2.default('debug', stream);
	      } else {
	        this.log = new _log2.default('emergency');
	      }

	      if (this.driverConfig) {
	        this.config = _webpackMerge2.default.smart(baseConfig, driverConfig);
	      } else {
	        this.config = baseConfig;
	      }

	      this.bundler = (0, _webpack2.default)(this.config);

	      return new Promise(function (resolve, reject) {
	        _this.bundler.run(function (err, stats) {
	          if (err) {
	            reject(err);
	          }

	          _this.log.info(stats.toString({ chunks: false, colors: logging === true }));
	          resolve();
	        });
	      });
	    }
	  }]);

	  return StaticServerLauncher;
	}();

	exports.default = StaticServerLauncher;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs-extra");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("log");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("webpack-merge");

/***/ }
/******/ ]);