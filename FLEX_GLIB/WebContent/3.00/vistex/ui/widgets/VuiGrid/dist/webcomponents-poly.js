(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(6);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/**
@license @nocompile
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(){/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';var r,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},da="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function ha(){ha=function(){};da.Symbol||(da.Symbol=ia)}var ia=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}();
function ja(){ha();var a=da.Symbol.iterator;a||(a=da.Symbol.iterator=da.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ka(this)}});ja=function(){}}function ka(a){var b=0;return la(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function la(a){ja();a={next:a};a[da.Symbol.iterator]=function(){return this};return a}function ma(a){ja();var b=a[Symbol.iterator];return b?b.call(a):ka(a)}
function na(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}var oa;if("function"==typeof Object.setPrototypeOf)oa=Object.setPrototypeOf;else{var pa;a:{var qa={Ja:!0},ra={};try{ra.__proto__=qa;pa=ra.Ja;break a}catch(a){}pa=!1}oa=pa?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var sa=oa;function ta(){this.f=!1;this.b=null;this.ea=void 0;this.a=1;this.G=0;this.c=null}
function ua(a){if(a.f)throw new TypeError("Generator is already running");a.f=!0}ta.prototype.v=function(a){this.ea=a};function va(a,b){a.c={Ma:b,Ra:!0};a.a=a.G}ta.prototype.return=function(a){this.c={return:a};this.a=this.G};function wa(a,b){a.a=3;return{value:b}}function xa(a){this.a=new ta;this.b=a}function ya(a,b){ua(a.a);var c=a.a.b;if(c)return Ba(a,"return"in c?c["return"]:function(a){return{value:a,done:!0}},b,a.a.return);a.a.return(b);return Ca(a)}
function Ba(a,b,c,d){try{var e=b.call(a.a.b,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.a.f=!1,e;var f=e.value}catch(g){return a.a.b=null,va(a.a,g),Ca(a)}a.a.b=null;d.call(a.a,f);return Ca(a)}function Ca(a){for(;a.a.a;)try{var b=a.b(a.a);if(b)return a.a.f=!1,{value:b.value,done:!1}}catch(c){a.a.ea=void 0,va(a.a,c)}a.a.f=!1;if(a.a.c){b=a.a.c;a.a.c=null;if(b.Ra)throw b.Ma;return{value:b.return,done:!0}}return{value:void 0,done:!0}}
function Da(a){this.next=function(b){ua(a.a);a.a.b?b=Ba(a,a.a.b.next,b,a.a.v):(a.a.v(b),b=Ca(a));return b};this.throw=function(b){ua(a.a);a.a.b?b=Ba(a,a.a.b["throw"],b,a.a.v):(va(a.a,b),b=Ca(a));return b};this.return=function(b){return ya(a,b)};ja();this[Symbol.iterator]=function(){return this}}function Ea(a,b){b=new Da(new xa(b));sa&&sa(b,a.prototype);return b}
(function(){if(!function(){var a=document.createEvent("Event");a.initEvent("foo",!0,!0);a.preventDefault();return a.defaultPrevented}()){var a=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&(a.call(this),Object.defineProperty(this,"defaultPrevented",{get:function(){return!0},configurable:!0}))}}var b=/Trident/.test(navigator.userAgent);if(!window.CustomEvent||b&&"function"!==typeof window.CustomEvent)window.CustomEvent=function(a,b){b=b||{};var c=document.createEvent("CustomEvent");
c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c},window.CustomEvent.prototype=window.Event.prototype;if(!window.Event||b&&"function"!==typeof window.Event){var c=window.Event;window.Event=function(a,b){b=b||{};var c=document.createEvent("Event");c.initEvent(a,!!b.bubbles,!!b.cancelable);return c};if(c)for(var d in c)window.Event[d]=c[d];window.Event.prototype=c.prototype}if(!window.MouseEvent||b&&"function"!==typeof window.MouseEvent){b=window.MouseEvent;window.MouseEvent=function(a,
b){b=b||{};var c=document.createEvent("MouseEvent");c.initMouseEvent(a,!!b.bubbles,!!b.cancelable,b.view||window,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget);return c};if(b)for(d in b)window.MouseEvent[d]=b[d];window.MouseEvent.prototype=b.prototype}Array.from||(Array.from=function(a){return[].slice.call(a)});Object.assign||(Object.assign=function(a,b){for(var c=[].slice.call(arguments,1),d=0,e;d<c.length;d++)if(e=c[d])for(var f=
a,n=e,p=Object.getOwnPropertyNames(n),G=0;G<p.length;G++)e=p[G],f[e]=n[e];return a})})(window.WebComponents);(function(){function a(){}function b(a,b){if(!a.childNodes.length)return[];switch(a.nodeType){case Node.DOCUMENT_NODE:return R.call(a,b);case Node.DOCUMENT_FRAGMENT_NODE:return Cb.call(a,b);default:return w.call(a,b)}}var c="undefined"===typeof HTMLTemplateElement,d=!(document.createDocumentFragment().cloneNode()instanceof DocumentFragment),e=!1;/Trident/.test(navigator.userAgent)&&function(){function a(a,b){if(a instanceof DocumentFragment)for(var d;d=a.firstChild;)c.call(this,d,b);else c.call(this,
a,b);return a}e=!0;var b=Node.prototype.cloneNode;Node.prototype.cloneNode=function(a){a=b.call(this,a);this instanceof DocumentFragment&&(a.__proto__=DocumentFragment.prototype);return a};DocumentFragment.prototype.querySelectorAll=HTMLElement.prototype.querySelectorAll;DocumentFragment.prototype.querySelector=HTMLElement.prototype.querySelector;Object.defineProperties(DocumentFragment.prototype,{nodeType:{get:function(){return Node.DOCUMENT_FRAGMENT_NODE},configurable:!0},localName:{get:function(){},
configurable:!0},nodeName:{get:function(){return"#document-fragment"},configurable:!0}});var c=Node.prototype.insertBefore;Node.prototype.insertBefore=a;var d=Node.prototype.appendChild;Node.prototype.appendChild=function(b){b instanceof DocumentFragment?a.call(this,b,null):d.call(this,b);return b};var f=Node.prototype.removeChild,g=Node.prototype.replaceChild;Node.prototype.replaceChild=function(b,c){b instanceof DocumentFragment?(a.call(this,b,c),f.call(this,c)):g.call(this,b,c);return c};Document.prototype.createDocumentFragment=
function(){var a=this.createElement("df");a.__proto__=DocumentFragment.prototype;return a};var h=Document.prototype.importNode;Document.prototype.importNode=function(a,b){b=h.call(this,a,b||!1);a instanceof DocumentFragment&&(b.__proto__=DocumentFragment.prototype);return b}}();var f=Node.prototype.cloneNode,g=Document.prototype.createElement,h=Document.prototype.importNode,k=Node.prototype.removeChild,l=Node.prototype.appendChild,n=Node.prototype.replaceChild,p=DOMParser.prototype.parseFromString,
G=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML")||{get:function(){return this.innerHTML},set:function(a){this.innerHTML=a}},u=Object.getOwnPropertyDescriptor(window.Node.prototype,"childNodes")||{get:function(){return this.childNodes}},w=Element.prototype.querySelectorAll,R=Document.prototype.querySelectorAll,Cb=DocumentFragment.prototype.querySelectorAll,Db=function(){if(!c){var a=document.createElement("template"),b=document.createElement("template");b.content.appendChild(document.createElement("div"));
a.content.appendChild(b);a=a.cloneNode(!0);return 0===a.content.childNodes.length||0===a.content.firstChild.content.childNodes.length||d}}();if(c){var U=document.implementation.createHTMLDocument("template"),Ma=!0,q=document.createElement("style");q.textContent="template{display:none;}";var za=document.head;za.insertBefore(q,za.firstElementChild);a.prototype=Object.create(HTMLElement.prototype);var ea=!document.createElement("div").hasOwnProperty("innerHTML");a.R=function(b){if(!b.content&&b.namespaceURI===
document.documentElement.namespaceURI){b.content=U.createDocumentFragment();for(var c;c=b.firstChild;)l.call(b.content,c);if(ea)b.__proto__=a.prototype;else if(b.cloneNode=function(b){return a.b(this,b)},Ma)try{m(b),z(b)}catch(Gh){Ma=!1}a.a(b.content)}};var ba={option:["select"],thead:["table"],col:["colgroup","table"],tr:["tbody","table"],th:["tr","tbody","table"],td:["tr","tbody","table"]},m=function(b){Object.defineProperty(b,"innerHTML",{get:function(){return fa(this)},set:function(b){var c=ba[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(b)||
["",""])[1].toLowerCase()];if(c)for(var d=0;d<c.length;d++)b="<"+c[d]+">"+b+"</"+c[d]+">";U.body.innerHTML=b;for(a.a(U);this.content.firstChild;)k.call(this.content,this.content.firstChild);b=U.body;if(c)for(d=0;d<c.length;d++)b=b.lastChild;for(;b.firstChild;)l.call(this.content,b.firstChild)},configurable:!0})},z=function(a){Object.defineProperty(a,"outerHTML",{get:function(){return"<template>"+this.innerHTML+"</template>"},set:function(a){if(this.parentNode){U.body.innerHTML=a;for(a=this.ownerDocument.createDocumentFragment();U.body.firstChild;)l.call(a,
U.body.firstChild);n.call(this.parentNode,a,this)}else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");},configurable:!0})};m(a.prototype);z(a.prototype);a.a=function(c){c=b(c,"template");for(var d=0,e=c.length,f;d<e&&(f=c[d]);d++)a.R(f)};document.addEventListener("DOMContentLoaded",function(){a.a(document)});Document.prototype.createElement=function(){var b=g.apply(this,arguments);"template"===b.localName&&a.R(b);return b};DOMParser.prototype.parseFromString=
function(){var b=p.apply(this,arguments);a.a(b);return b};Object.defineProperty(HTMLElement.prototype,"innerHTML",{get:function(){return fa(this)},set:function(b){G.set.call(this,b);a.a(this)},configurable:!0,enumerable:!0});var ca=/[&\u00A0"]/g,Eb=/[&\u00A0<>]/g,Na=function(a){switch(a){case "&":return"&amp;";case "<":return"&lt;";case ">":return"&gt;";case '"':return"&quot;";case "\u00a0":return"&nbsp;"}};q=function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b};var Aa=q("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
Oa=q("style script xmp iframe noembed noframes plaintext noscript".split(" ")),fa=function(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):u.get.call(a),e=0,f=d.length,g;e<f&&(g=d[e]);e++){a:{var h=g;var k=a;var l=b;switch(h.nodeType){case Node.ELEMENT_NODE:for(var n=h.localName,m="<"+n,p=h.attributes,w=0;k=p[w];w++)m+=" "+k.name+'="'+k.value.replace(ca,Na)+'"';m+=">";h=Aa[n]?m:m+fa(h,l)+"</"+n+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&Oa[k.localName]?h:h.replace(Eb,Na);break a;
case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),Error("not implemented");}}c+=h}return c}}if(c||Db){a.b=function(a,b){var c=f.call(a,!1);this.R&&this.R(c);b&&(l.call(c.content,f.call(a.content,!0)),Pa(c.content,a.content));return c};var Pa=function(c,d){if(d.querySelectorAll&&(d=b(d,"template"),0!==d.length)){c=b(c,"template");for(var e=0,f=c.length,g,h;e<f;e++)h=d[e],g=c[e],a&&a.R&&a.R(h),n.call(g.parentNode,uf.call(h,!0),g)}},uf=Node.prototype.cloneNode=
function(b){if(!e&&d&&this instanceof DocumentFragment)if(b)var c=vf.call(this.ownerDocument,this,!0);else return this.ownerDocument.createDocumentFragment();else this.nodeType===Node.ELEMENT_NODE&&"template"===this.localName&&this.namespaceURI==document.documentElement.namespaceURI?c=a.b(this,b):c=f.call(this,b);b&&Pa(c,this);return c},vf=Document.prototype.importNode=function(c,d){d=d||!1;if("template"===c.localName)return a.b(c,d);var e=h.call(this,c,d);if(d){Pa(e,c);c=b(e,'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');
for(var f,k=0;k<c.length;k++){f=c[k];d=g.call(document,"script");d.textContent=f.textContent;for(var l=f.attributes,m=0,p;m<l.length;m++)p=l[m],d.setAttribute(p.name,p.value);n.call(f.parentNode,d,f)}}return e}}c&&(window.HTMLTemplateElement=a)})();var Fa=setTimeout;function Ga(){}function Ha(a,b){return function(){a.apply(b,arguments)}}function t(a){if(!(this instanceof t))throw new TypeError("Promises must be constructed via new");if("function"!==typeof a)throw new TypeError("not a function");this.J=0;this.ta=!1;this.B=void 0;this.U=[];Ia(a,this)}
function Ja(a,b){for(;3===a.J;)a=a.B;0===a.J?a.U.push(b):(a.ta=!0,Ka(function(){var c=1===a.J?b.Ta:b.Ua;if(null===c)(1===a.J?La:Qa)(b.oa,a.B);else{try{var d=c(a.B)}catch(e){Qa(b.oa,e);return}La(b.oa,d)}}))}function La(a,b){try{if(b===a)throw new TypeError("A promise cannot be resolved with itself.");if(b&&("object"===typeof b||"function"===typeof b)){var c=b.then;if(b instanceof t){a.J=3;a.B=b;Ra(a);return}if("function"===typeof c){Ia(Ha(c,b),a);return}}a.J=1;a.B=b;Ra(a)}catch(d){Qa(a,d)}}
function Qa(a,b){a.J=2;a.B=b;Ra(a)}function Ra(a){2===a.J&&0===a.U.length&&Ka(function(){a.ta||"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",a.B)});for(var b=0,c=a.U.length;b<c;b++)Ja(a,a.U[b]);a.U=null}function Sa(a,b,c){this.Ta="function"===typeof a?a:null;this.Ua="function"===typeof b?b:null;this.oa=c}function Ia(a,b){var c=!1;try{a(function(a){c||(c=!0,La(b,a))},function(a){c||(c=!0,Qa(b,a))})}catch(d){c||(c=!0,Qa(b,d))}}
t.prototype["catch"]=function(a){return this.then(null,a)};t.prototype.then=function(a,b){var c=new this.constructor(Ga);Ja(this,new Sa(a,b,c));return c};t.prototype["finally"]=function(a){var b=this.constructor;return this.then(function(c){return b.resolve(a()).then(function(){return c})},function(c){return b.resolve(a()).then(function(){return b.reject(c)})})};
function Ta(a){return new t(function(b,c){function d(a,g){try{if(g&&("object"===typeof g||"function"===typeof g)){var h=g.then;if("function"===typeof h){h.call(g,function(b){d(a,b)},c);return}}e[a]=g;0===--f&&b(e)}catch(n){c(n)}}if(!a||"undefined"===typeof a.length)throw new TypeError("Promise.all accepts an array");var e=Array.prototype.slice.call(a);if(0===e.length)return b([]);for(var f=e.length,g=0;g<e.length;g++)d(g,e[g])})}
function Ua(a){return a&&"object"===typeof a&&a.constructor===t?a:new t(function(b){b(a)})}function Va(a){return new t(function(b,c){c(a)})}function Wa(a){return new t(function(b,c){for(var d=0,e=a.length;d<e;d++)a[d].then(b,c)})}var Ka="function"===typeof setImmediate&&function(a){setImmediate(a)}||function(a){Fa(a,0)};/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
if(!window.Promise){window.Promise=t;t.prototype.then=t.prototype.then;t.all=Ta;t.race=Wa;t.resolve=Ua;t.reject=Va;var Xa=document.createTextNode(""),Ya=[];(new MutationObserver(function(){for(var a=Ya.length,b=0;b<a;b++)Ya[b]();Ya.splice(0,a)})).observe(Xa,{characterData:!0});Ka=function(a){Ya.push(a);Xa.textContent=0<Xa.textContent.length?"":"a"}};/*
 Copyright (C) 2015 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function(a,b){if(!(b in a)){var c=typeof global===typeof c?window:global,d=0,e=""+Math.random(),f="__\u0001symbol@@"+e,g=a.getOwnPropertyNames,h=a.getOwnPropertyDescriptor,k=a.create,l=a.keys,n=a.freeze||a,p=a.defineProperty,G=a.defineProperties,u=h(a,"getOwnPropertyNames"),w=a.prototype,R=w.hasOwnProperty,Cb=w.propertyIsEnumerable,Db=w.toString,U=function(a,b,c){R.call(a,f)||p(a,f,{enumerable:!1,configurable:!1,writable:!1,value:{}});a[f]["@@"+b]=c},Ma=function(a,b){var c=k(a);g(b).forEach(function(a){ba.call(b,
a)&&Aa(c,a,b[a])});return c},q=function(){},za=function(a){return a!=f&&!R.call(ca,a)},ea=function(a){return a!=f&&R.call(ca,a)},ba=function(a){var b=""+a;return ea(b)?R.call(this,b)&&this[f]["@@"+b]:Cb.call(this,a)},m=function(b){p(w,b,{enumerable:!1,configurable:!0,get:q,set:function(a){fa(this,b,{enumerable:!1,configurable:!0,writable:!0,value:a});U(this,b,!0)}});return n(ca[b]=p(a(b),"constructor",Eb))},z=function(a){if(this&&this!==c)throw new TypeError("Symbol is not a constructor");return m("__\u0001symbol:".concat(a||
"",e,++d))},ca=k(null),Eb={value:z},Na=function(a){return ca[a]},Aa=function(a,b,c){var d=""+b;if(ea(d)){b=fa;if(c.enumerable){var e=k(c);e.enumerable=!1}else e=c;b(a,d,e);U(a,d,!!c.enumerable)}else p(a,b,c);return a},Oa=function(a){return g(a).filter(ea).map(Na)};u.value=Aa;p(a,"defineProperty",u);u.value=Oa;p(a,b,u);u.value=function(a){return g(a).filter(za)};p(a,"getOwnPropertyNames",u);u.value=function(a,b){var c=Oa(b);c.length?l(b).concat(c).forEach(function(c){ba.call(b,c)&&Aa(a,c,b[c])}):G(a,
b);return a};p(a,"defineProperties",u);u.value=ba;p(w,"propertyIsEnumerable",u);u.value=z;p(c,"Symbol",u);u.value=function(a){a="__\u0001symbol:".concat("__\u0001symbol:",a,e);return a in w?ca[a]:m(a)};p(z,"for",u);u.value=function(a){if(za(a))throw new TypeError(a+" is not a symbol");return R.call(ca,a)?a.slice(20,-e.length):void 0};p(z,"keyFor",u);u.value=function(a,b){var c=h(a,b);c&&ea(b)&&(c.enumerable=ba.call(a,b));return c};p(a,"getOwnPropertyDescriptor",u);u.value=function(a,b){return 1===
arguments.length?k(a):Ma(a,b)};p(a,"create",u);u.value=function(){var a=Db.call(this);return"[object String]"===a&&ea(this)?"[object Symbol]":a};p(w,"toString",u);try{var fa=k(p({},"__\u0001symbol:",{get:function(){return p(this,"__\u0001symbol:",{value:!1})["__\u0001symbol:"]}}))["__\u0001symbol:"]||p}catch(Pa){fa=function(a,b,c){var d=h(w,b);delete w[b];p(a,b,c);p(w,b,d)}}}})(Object,"getOwnPropertySymbols");
(function(a){var b=a.defineProperty,c=a.prototype,d=c.toString,e;"iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag".split(" ").forEach(function(f){if(!(f in Symbol))switch(b(Symbol,f,{value:Symbol(f)}),f){case "toStringTag":e=a.getOwnPropertyDescriptor(c,"toString"),e.value=function(){var a=d.call(this),b=this[Symbol.toStringTag];return"undefined"===typeof b?a:"[object "+b+"]"},b(c,"toString",e)}})})(Object,Symbol);
(function(a,b,c){function d(){return this}b[a]||(b[a]=function(){var b=0,c=this,g={next:function(){var a=c.length<=b;return a?{done:a}:{done:a,value:c[b++]}}};g[a]=d;return g});c[a]||(c[a]=function(){var b=String.fromCodePoint,c=this,g=0,h=c.length,k={next:function(){var a=h<=g,d=a?"":b(c.codePointAt(g));g+=d.length;return a?{done:a}:{done:a,value:d}}};k[a]=d;return k})})(Symbol.iterator,Array.prototype,String.prototype);/*

Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var Za=Object.prototype.toString;Object.prototype.toString=function(){return void 0===this?"[object Undefined]":null===this?"[object Null]":Za.call(this)};Object.keys=function(a){return Object.getOwnPropertyNames(a).filter(function(b){return(b=Object.getOwnPropertyDescriptor(a,b))&&b.enumerable})};var $a=window.Symbol.iterator;
String.prototype[$a]&&String.prototype.codePointAt||(String.prototype[$a]=function ab(){var b,c=this;return Ea(ab,function(d){1==d.a&&(b=0);if(3!=d.a)return b<c.length?d=wa(d,c[b]):(d.a=0,d=void 0),d;b++;d.a=2})});Set.prototype[$a]||(Set.prototype[$a]=function bb(){var b,c=this,d;return Ea(bb,function(e){1==e.a&&(b=[],c.forEach(function(c){b.push(c)}),d=0);if(3!=e.a)return d<b.length?e=wa(e,b[d]):(e.a=0,e=void 0),e;d++;e.a=2})});
Map.prototype[$a]||(Map.prototype[$a]=function cb(){var b,c=this,d;return Ea(cb,function(e){1==e.a&&(b=[],c.forEach(function(c,d){b.push([d,c])}),d=0);if(3!=e.a)return d<b.length?e=wa(e,b[d]):(e.a=0,e=void 0),e;d++;e.a=2})});/*

 Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.WebComponents=window.WebComponents||{flags:{}};var db=document.querySelector('script[src*="webcomponents-bundle"]'),eb=/wc-(.+)/,v={};if(!v.noOpts){location.search.slice(1).split("&").forEach(function(a){a=a.split("=");var b;a[0]&&(b=a[0].match(eb))&&(v[b[1]]=a[1]||!0)});if(db)for(var fb=0,gb=void 0;gb=db.attributes[fb];fb++)"src"!==gb.name&&(v[gb.name]=gb.value||!0);if(v.log&&v.log.split){var hb=v.log.split(",");v.log={};hb.forEach(function(a){v.log[a]=!0})}else v.log={}}
window.WebComponents.flags=v;var ib=v.shadydom;ib&&(window.ShadyDOM=window.ShadyDOM||{},window.ShadyDOM.force=ib);var jb=v.register||v.ce;jb&&window.customElements&&(window.customElements.forcePolyfill=jb);/*

Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function kb(){this.wa=this.root=null;this.da=!1;this.N=this.aa=this.la=this.assignedSlot=this.assignedNodes=this.S=null;this.childNodes=this.nextSibling=this.previousSibling=this.lastChild=this.firstChild=this.parentNode=this.W=void 0;this.Ba=this.ra=!1;this.$={}}kb.prototype.toJSON=function(){return{}};function x(a){a.__shady||(a.__shady=new kb);return a.__shady}function y(a){return a&&a.__shady};var A=window.ShadyDOM||{};A.Pa=!(!Element.prototype.attachShadow||!Node.prototype.getRootNode);var lb=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild");A.K=!!(lb&&lb.configurable&&lb.get);A.na=A.force||!A.Pa;var mb=navigator.userAgent.match("Trident"),nb=navigator.userAgent.match("Edge");void 0===A.ya&&(A.ya=A.K&&(mb||nb));function ob(a){return(a=y(a))&&void 0!==a.firstChild}function B(a){return"ShadyRoot"===a.Ga}function pb(a){a=a.getRootNode();if(B(a))return a}
var qb=Element.prototype,rb=qb.matches||qb.matchesSelector||qb.mozMatchesSelector||qb.msMatchesSelector||qb.oMatchesSelector||qb.webkitMatchesSelector;function sb(a,b){if(a&&b)for(var c=Object.getOwnPropertyNames(b),d=0,e=void 0;d<c.length&&(e=c[d]);d++){var f=e,g=a,h=Object.getOwnPropertyDescriptor(b,f);h&&Object.defineProperty(g,f,h)}}function tb(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];for(d=0;d<c.length;d++)sb(a,c[d]);return a}
function ub(a,b){for(var c in b)a[c]=b[c]}var vb=document.createTextNode(""),wb=0,xb=[];(new MutationObserver(function(){for(;xb.length;)try{xb.shift()()}catch(a){throw vb.textContent=wb++,a;}})).observe(vb,{characterData:!0});function yb(a){xb.push(a);vb.textContent=wb++}var zb=!!document.contains;function Ab(a,b){for(;b;){if(b==a)return!0;b=b.parentNode}return!1}
function Bb(a){for(var b=a.length-1;0<=b;b--){var c=a[b],d=c.getAttribute("id")||c.getAttribute("name");d&&"length"!==d&&isNaN(d)&&(a[d]=c)}a.item=function(b){return a[b]};a.namedItem=function(b){if("length"!==b&&isNaN(b)&&a[b])return a[b];for(var c=ma(a),d=c.next();!d.done;d=c.next())if(d=d.value,(d.getAttribute("id")||d.getAttribute("name"))==b)return d;return null};return a};var Fb=[],Gb;function Hb(a){Gb||(Gb=!0,yb(Ib));Fb.push(a)}function Ib(){Gb=!1;for(var a=!!Fb.length;Fb.length;)Fb.shift()();return a}Ib.list=Fb;function Jb(){this.a=!1;this.addedNodes=[];this.removedNodes=[];this.ca=new Set}function Kb(a){a.a||(a.a=!0,yb(function(){a.flush()}))}Jb.prototype.flush=function(){if(this.a){this.a=!1;var a=this.takeRecords();a.length&&this.ca.forEach(function(b){b(a)})}};Jb.prototype.takeRecords=function(){if(this.addedNodes.length||this.removedNodes.length){var a=[{addedNodes:this.addedNodes,removedNodes:this.removedNodes}];this.addedNodes=[];this.removedNodes=[];return a}return[]};
function Lb(a,b){var c=x(a);c.S||(c.S=new Jb);c.S.ca.add(b);var d=c.S;return{Fa:b,P:d,Ha:a,takeRecords:function(){return d.takeRecords()}}}function Mb(a){var b=a&&a.P;b&&(b.ca.delete(a.Fa),b.ca.size||(x(a.Ha).S=null))}
function Nb(a,b){var c=b.getRootNode();return a.map(function(a){var b=c===a.target.getRootNode();if(b&&a.addedNodes){if(b=Array.from(a.addedNodes).filter(function(a){return c===a.getRootNode()}),b.length)return a=Object.create(a),Object.defineProperty(a,"addedNodes",{value:b,configurable:!0}),a}else if(b)return a}).filter(function(a){return a})};var Ob=Element.prototype.insertBefore,Pb=Element.prototype.replaceChild,Qb=Element.prototype.removeChild,Rb=Element.prototype.setAttribute,Sb=Element.prototype.removeAttribute,Tb=Element.prototype.cloneNode,Ub=Document.prototype.importNode,Vb=Element.prototype.addEventListener,Wb=Element.prototype.removeEventListener,Xb=Window.prototype.addEventListener,Yb=Window.prototype.removeEventListener,Zb=Element.prototype.dispatchEvent,$b=Node.prototype.contains||HTMLElement.prototype.contains,ac=Document.prototype.getElementById,
bc=Element.prototype.querySelector,cc=DocumentFragment.prototype.querySelector,dc=Document.prototype.querySelector,ec=Element.prototype.querySelectorAll,fc=DocumentFragment.prototype.querySelectorAll,gc=Document.prototype.querySelectorAll,C={};C.appendChild=Element.prototype.appendChild;C.insertBefore=Ob;C.replaceChild=Pb;C.removeChild=Qb;C.setAttribute=Rb;C.removeAttribute=Sb;C.cloneNode=Tb;C.importNode=Ub;C.addEventListener=Vb;C.removeEventListener=Wb;C.cb=Xb;C.eb=Yb;C.dispatchEvent=Zb;
C.contains=$b;C.getElementById=ac;C.kb=bc;C.nb=cc;C.ib=dc;C.querySelector=function(a){switch(this.nodeType){case Node.ELEMENT_NODE:return bc.call(this,a);case Node.DOCUMENT_NODE:return dc.call(this,a);default:return cc.call(this,a)}};C.lb=ec;C.ob=fc;C.jb=gc;C.querySelectorAll=function(a){switch(this.nodeType){case Node.ELEMENT_NODE:return ec.call(this,a);case Node.DOCUMENT_NODE:return gc.call(this,a);default:return fc.call(this,a)}};var hc=/[&\u00A0"]/g,ic=/[&\u00A0<>]/g;function jc(a){switch(a){case "&":return"&amp;";case "<":return"&lt;";case ">":return"&gt;";case '"':return"&quot;";case "\u00a0":return"&nbsp;"}}function kc(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}var lc=kc("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),mc=kc("style script xmp iframe noembed noframes plaintext noscript".split(" "));
function nc(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):a.childNodes,e=0,f=d.length,g=void 0;e<f&&(g=d[e]);e++){a:{var h=g;var k=a,l=b;switch(h.nodeType){case Node.ELEMENT_NODE:k=h.localName;for(var n="<"+k,p=h.attributes,G=0,u;u=p[G];G++)n+=" "+u.name+'="'+u.value.replace(hc,jc)+'"';n+=">";h=lc[k]?n:n+nc(h,l)+"</"+k+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&mc[k.localName]?h:h.replace(ic,jc);break a;case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),
Error("not implemented");}}c+=h}return c};var D=document.createTreeWalker(document,NodeFilter.SHOW_ALL,null,!1),E=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT,null,!1);function oc(a){var b=[];D.currentNode=a;for(a=D.firstChild();a;)b.push(a),a=D.nextSibling();return b}
var F={parentNode:function(a){D.currentNode=a;return D.parentNode()},firstChild:function(a){D.currentNode=a;return D.firstChild()},lastChild:function(a){D.currentNode=a;return D.lastChild()},previousSibling:function(a){D.currentNode=a;return D.previousSibling()},nextSibling:function(a){D.currentNode=a;return D.nextSibling()}};F.childNodes=oc;F.parentElement=function(a){E.currentNode=a;return E.parentNode()};F.firstElementChild=function(a){E.currentNode=a;return E.firstChild()};
F.lastElementChild=function(a){E.currentNode=a;return E.lastChild()};F.previousElementSibling=function(a){E.currentNode=a;return E.previousSibling()};F.nextElementSibling=function(a){E.currentNode=a;return E.nextSibling()};F.children=function(a){var b=[];E.currentNode=a;for(a=E.firstChild();a;)b.push(a),a=E.nextSibling();return Bb(b)};F.innerHTML=function(a){return nc(a,function(a){return oc(a)})};
F.textContent=function(a){switch(a.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:a=document.createTreeWalker(a,NodeFilter.SHOW_TEXT,null,!1);for(var b="",c;c=a.nextNode();)b+=c.nodeValue;return b;default:return a.nodeValue}};var pc=A.K,qc=[Node.prototype,Element.prototype,HTMLElement.prototype];function H(a){var b;a:{for(b=0;b<qc.length;b++){var c=qc[b];if(c.hasOwnProperty(a)){b=c;break a}}b=void 0}if(!b)throw Error("Could not find descriptor for "+a);return Object.getOwnPropertyDescriptor(b,a)}
var I=pc?{parentNode:H("parentNode"),firstChild:H("firstChild"),lastChild:H("lastChild"),previousSibling:H("previousSibling"),nextSibling:H("nextSibling"),childNodes:H("childNodes"),parentElement:H("parentElement"),previousElementSibling:H("previousElementSibling"),nextElementSibling:H("nextElementSibling"),innerHTML:H("innerHTML"),textContent:H("textContent"),firstElementChild:H("firstElementChild"),lastElementChild:H("lastElementChild"),children:H("children")}:{},rc=pc?{firstElementChild:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,
"firstElementChild"),lastElementChild:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,"lastElementChild"),children:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,"children")}:{},sc=pc?{firstElementChild:Object.getOwnPropertyDescriptor(Document.prototype,"firstElementChild"),lastElementChild:Object.getOwnPropertyDescriptor(Document.prototype,"lastElementChild"),children:Object.getOwnPropertyDescriptor(Document.prototype,"children")}:{},tc={va:I,mb:rc,hb:sc,parentNode:function(a){return I.parentNode.get.call(a)},
firstChild:function(a){return I.firstChild.get.call(a)},lastChild:function(a){return I.lastChild.get.call(a)},previousSibling:function(a){return I.previousSibling.get.call(a)},nextSibling:function(a){return I.nextSibling.get.call(a)},childNodes:function(a){return Array.prototype.slice.call(I.childNodes.get.call(a))},parentElement:function(a){return I.parentElement.get.call(a)},previousElementSibling:function(a){return I.previousElementSibling.get.call(a)},nextElementSibling:function(a){return I.nextElementSibling.get.call(a)},
innerHTML:function(a){return I.innerHTML.get.call(a)},textContent:function(a){return I.textContent.get.call(a)},children:function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return rc.children.get.call(a);case Node.DOCUMENT_NODE:return sc.children.get.call(a);default:return I.children.get.call(a)}},firstElementChild:function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return rc.firstElementChild.get.call(a);case Node.DOCUMENT_NODE:return sc.firstElementChild.get.call(a);default:return I.firstElementChild.get.call(a)}},
lastElementChild:function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return rc.lastElementChild.get.call(a);case Node.DOCUMENT_NODE:return sc.lastElementChild.get.call(a);default:return I.lastElementChild.get.call(a)}}};var J=A.ya?tc:F;function uc(a){for(;a.firstChild;)a.removeChild(a.firstChild)}
var vc=A.K,wc=document.implementation.createHTMLDocument("inert"),xc=Object.getOwnPropertyDescriptor(Node.prototype,"isConnected"),yc=xc&&xc.get,zc=Object.getOwnPropertyDescriptor(Document.prototype,"activeElement"),Ac={parentElement:{get:function(){var a=y(this);(a=a&&a.parentNode)&&a.nodeType!==Node.ELEMENT_NODE&&(a=null);return void 0!==a?a:J.parentElement(this)},configurable:!0},parentNode:{get:function(){var a=y(this);a=a&&a.parentNode;return void 0!==a?a:J.parentNode(this)},configurable:!0},
nextSibling:{get:function(){var a=y(this);a=a&&a.nextSibling;return void 0!==a?a:J.nextSibling(this)},configurable:!0},previousSibling:{get:function(){var a=y(this);a=a&&a.previousSibling;return void 0!==a?a:J.previousSibling(this)},configurable:!0},nextElementSibling:{get:function(){var a=y(this);if(a&&void 0!==a.nextSibling){for(a=this.nextSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}return J.nextElementSibling(this)},configurable:!0},previousElementSibling:{get:function(){var a=
y(this);if(a&&void 0!==a.previousSibling){for(a=this.previousSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}return J.previousElementSibling(this)},configurable:!0}},Bc={className:{get:function(){return this.getAttribute("class")||""},set:function(a){this.setAttribute("class",a)},configurable:!0}},Cc={childNodes:{get:function(){if(ob(this)){var a=y(this);if(!a.childNodes){a.childNodes=[];for(var b=this.firstChild;b;b=b.nextSibling)a.childNodes.push(b)}var c=a.childNodes}else c=
J.childNodes(this);c.item=function(a){return c[a]};return c},configurable:!0},childElementCount:{get:function(){return this.children.length},configurable:!0},firstChild:{get:function(){var a=y(this);a=a&&a.firstChild;return void 0!==a?a:J.firstChild(this)},configurable:!0},lastChild:{get:function(){var a=y(this);a=a&&a.lastChild;return void 0!==a?a:J.lastChild(this)},configurable:!0},textContent:{get:function(){if(ob(this)){for(var a=[],b=0,c=this.childNodes,d;d=c[b];b++)d.nodeType!==Node.COMMENT_NODE&&
a.push(d.textContent);return a.join("")}return J.textContent(this)},set:function(a){if("undefined"===typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:if(!ob(this)&&vc){var b=this.firstChild;(b!=this.lastChild||b&&b.nodeType!=Node.TEXT_NODE)&&uc(this);tc.va.textContent.set.call(this,a)}else uc(this),(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.appendChild(document.createTextNode(a));break;default:this.nodeValue=a}},configurable:!0},firstElementChild:{get:function(){var a=
y(this);if(a&&void 0!==a.firstChild){for(a=this.firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}return J.firstElementChild(this)},configurable:!0},lastElementChild:{get:function(){var a=y(this);if(a&&void 0!==a.lastChild){for(a=this.lastChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}return J.lastElementChild(this)},configurable:!0},children:{get:function(){return ob(this)?Bb(Array.prototype.filter.call(this.childNodes,function(a){return a.nodeType===Node.ELEMENT_NODE})):
J.children(this)},configurable:!0},innerHTML:{get:function(){return ob(this)?nc("template"===this.localName?this.content:this):J.innerHTML(this)},set:function(a){var b="template"===this.localName?this.content:this;uc(b);var c=this.localName||"div";c=this.namespaceURI&&this.namespaceURI!==wc.namespaceURI?wc.createElementNS(this.namespaceURI,c):wc.createElement(c);vc?tc.va.innerHTML.set.call(c,a):c.innerHTML=a;for(a="template"===this.localName?c.content:c;a.firstChild;)b.appendChild(a.firstChild)},
configurable:!0}},Dc={shadowRoot:{get:function(){var a=y(this);return a&&a.wa||null},configurable:!0}},Ec={activeElement:{get:function(){var a=zc&&zc.get?zc.get.call(document):A.K?void 0:document.activeElement;if(a&&a.nodeType){var b=!!B(this);if(this===document||b&&this.host!==a&&C.contains.call(this.host,a)){for(b=pb(a);b&&b!==this;)a=b.host,b=pb(a);a=this===document?b?null:a:b===this?a:null}else a=null}else a=null;return a},set:function(){},configurable:!0}};
function K(a,b,c){for(var d in b){var e=Object.getOwnPropertyDescriptor(a,d);e&&e.configurable||!e&&c?Object.defineProperty(a,d,b[d]):c&&console.warn("Could not define",d,"on",a)}}function Fc(a){K(a,Ac);K(a,Bc);K(a,Cc);K(a,Ec)}
function Gc(){var a=Hc.prototype;a.__proto__=DocumentFragment.prototype;K(a,Ac,!0);K(a,Cc,!0);K(a,Ec,!0);Object.defineProperties(a,{nodeType:{value:Node.DOCUMENT_FRAGMENT_NODE,configurable:!0},nodeName:{value:"#document-fragment",configurable:!0},nodeValue:{value:null,configurable:!0}});["localName","namespaceURI","prefix"].forEach(function(b){Object.defineProperty(a,b,{value:void 0,configurable:!0})});["ownerDocument","baseURI","isConnected"].forEach(function(b){Object.defineProperty(a,b,{get:function(){return this.host[b]},
configurable:!0})})}var Ic=A.K?function(){}:function(a){var b=x(a);b.ra||(b.ra=!0,K(a,Ac,!0),K(a,Bc,!0))},Jc=A.K?function(){}:function(a){x(a).Ba||(K(a,Cc,!0),K(a,Dc,!0))};var Kc=J.childNodes;function Lc(a,b,c){Jc(b);var d=x(b);void 0!==d.firstChild&&(d.childNodes=null);if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){d=a.childNodes;for(var e=0;e<d.length;e++)Mc(d[e],b,c);a=x(a);b=void 0!==a.firstChild?null:void 0;a.firstChild=a.lastChild=b;a.childNodes=b}else Mc(a,b,c)}
function Mc(a,b,c){Ic(a);c=c||null;var d=x(a),e=x(b),f=c?x(c):null;d.previousSibling=c?f.previousSibling:b.lastChild;if(f=y(d.previousSibling))f.nextSibling=a;if(f=y(d.nextSibling=c))f.previousSibling=a;d.parentNode=b;c?c===e.firstChild&&(e.firstChild=a):(e.lastChild=a,e.firstChild||(e.firstChild=a));e.childNodes=null}
function Nc(a,b){var c=x(a);b=x(b);a===b.firstChild&&(b.firstChild=c.nextSibling);a===b.lastChild&&(b.lastChild=c.previousSibling);a=c.previousSibling;var d=c.nextSibling;a&&(x(a).nextSibling=d);d&&(x(d).previousSibling=a);c.parentNode=c.previousSibling=c.nextSibling=void 0;void 0!==b.childNodes&&(b.childNodes=null)}
function Oc(a,b){var c=x(a);if(void 0===c.firstChild)for(c.childNodes=null,b=b||Kc(a),c.firstChild=b[0]||null,c.lastChild=b[b.length-1]||null,Jc(a),c=0;c<b.length;c++){var d=b[c],e=x(d);e.parentNode=a;e.nextSibling=b[c+1]||null;e.previousSibling=b[c-1]||null;Ic(d)}};var Pc=J.parentNode,Qc=window.document,Rc=A.qb;
function Sc(a,b,c){if(a.ownerDocument!==Qc&&b.ownerDocument!==Qc)return C.insertBefore.call(a,b,c);if(b===a)throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");if(c){var d=y(c);d=d&&d.parentNode;if(void 0!==d&&d!==a||void 0===d&&Pc(c)!==a)throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");}if(c===b)return b;var e=[],f=Tc,g=pb(a),h;g?h=g.host.localName:h=Uc(a);
if(b.parentNode){var k=Uc(b);Vc(b.parentNode,b,!!g||!(b.getRootNode()instanceof ShadowRoot));f=function(a,b){Wc()&&(Xc(a,k),Tc(a,b))}}d=!0;var l=(!Rc||void 0===b.__noInsertionPoint)&&!Yc(b,h);if(g)b.__noInsertionPoint&&!l||Zc(b,function(a){"slot"===a.localName&&e.push(a);l&&f(a,h)});else if(l){var n=Uc(b);Zc(b,function(a){var b=h;Wc()&&(Xc(a,n),Tc(a,b))})}e.length&&$c(g,e);("slot"===a.localName||e.length)&&g&&ad(g);ob(a)&&(Lc(b,a,c),g=y(a),bd(a)?(ad(g.root),d=!1):g.root&&(d=!1));d?(d=B(a)?a.host:
a,c?(c=cd(c),C.insertBefore.call(d,b,c)):C.appendChild.call(d,b)):b.ownerDocument!==a.ownerDocument&&a.ownerDocument.adoptNode(b);dd(a,b);return b}
function Vc(a,b,c){c=void 0===c?!1:c;if(a.ownerDocument!==Qc)return C.removeChild.call(a,b);if(b.parentNode!==a)throw Error("The node to be removed is not a child of this node: "+b);var d=pb(b),e=y(a);if(ob(a)&&(Nc(b,a),bd(a))){ad(e.root);var f=!0}if(Wc()&&!c&&d){var g=Uc(b);Zc(b,function(a){Xc(a,g)})}ed(b);if(d){var h=a&&"slot"===a.localName;h&&(f=!0);((c=fd(d,b))||h)&&ad(d)}f||(f=B(a)?a.host:a,(!e.root&&"slot"!==b.localName||f===Pc(b))&&C.removeChild.call(f,b));dd(a,null,b);return b}
function ed(a){var b=y(a);if(b&&void 0!==b.W){b=a.childNodes;for(var c=0,d=b.length,e=void 0;c<d&&(e=b[c]);c++)ed(e)}if(a=y(a))a.W=void 0}function cd(a){var b=a;a&&"slot"===a.localName&&(b=(b=(b=y(a))&&b.N)&&b.length?b[0]:cd(a.nextSibling));return b}function bd(a){return(a=(a=y(a))&&a.root)&&gd(a)}
function hd(a,b){if("slot"===b)a=a.parentNode,bd(a)&&ad(y(a).root);else if("slot"===a.localName&&"name"===b&&(b=pb(a))){if(b.m){id(b);var c=a.Ea,d=jd(a);if(d!==c){c=b.w[c];var e=c.indexOf(a);0<=e&&c.splice(e,1);c=b.w[d]||(b.w[d]=[]);c.push(a);1<c.length&&(b.w[d]=kd(c))}}ad(b)}}function dd(a,b,c){if(a=(a=y(a))&&a.S)b&&a.addedNodes.push(b),c&&a.removedNodes.push(c),Kb(a)}
function ld(a){if(a&&a.nodeType){var b=x(a),c=b.W;void 0===c&&(B(a)?(c=a,b.W=c):(c=(c=a.parentNode)?ld(c):a,C.contains.call(document.documentElement,a)&&(b.W=c)));return c}}function md(a,b,c){var d=[];nd(a.childNodes,b,c,d);return d}function nd(a,b,c,d){for(var e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++){var h;if(h=g.nodeType===Node.ELEMENT_NODE){h=g;var k=b,l=c,n=d,p=k(h);p&&n.push(h);l&&l(p)?h=p:(nd(h.childNodes,k,l,n),h=void 0)}if(h)break}}var od=null;
function Wc(){od||(od=window.ShadyCSS&&window.ShadyCSS.ScopingShim);return od||null}function pd(a,b,c){if(a.ownerDocument!==Qc)C.setAttribute.call(a,b,c);else{var d=Wc();d&&"class"===b?d.setElementClass(a,c):(C.setAttribute.call(a,b,c),hd(a,b))}}function qd(a,b){if(a.ownerDocument!==document||"template"===a.localName)return C.importNode.call(document,a,b);var c=C.importNode.call(document,a,!1);if(b){a=a.childNodes;b=0;for(var d;b<a.length;b++)d=qd(a[b],!0),c.appendChild(d)}return c}
function Tc(a,b){var c=Wc();c&&c.scopeNode(a,b)}function Xc(a,b){var c=Wc();c&&c.unscopeNode(a,b)}function Yc(a,b){var c=Wc();if(!c)return!0;if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){c=!0;for(var d=0;c&&d<a.childNodes.length;d++)c=c&&Yc(a.childNodes[d],b);return c}return a.nodeType!==Node.ELEMENT_NODE?!0:c.currentScopeForNode(a)===b}function Uc(a){if(a.nodeType!==Node.ELEMENT_NODE)return"";var b=Wc();return b?b.currentScopeForNode(a):""}
function Zc(a,b){if(a){a.nodeType===Node.ELEMENT_NODE&&b(a);for(var c=0,d;c<a.childNodes.length;c++)d=a.childNodes[c],d.nodeType===Node.ELEMENT_NODE&&Zc(d,b)}};var rd="__eventWrappers"+Date.now(),sd=function(){var a=Object.getOwnPropertyDescriptor(Event.prototype,"composed");return a?function(b){return a.get.call(b)}:null}(),td={blur:!0,focus:!0,focusin:!0,focusout:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseout:!0,mouseover:!0,mouseup:!0,wheel:!0,beforeinput:!0,input:!0,keydown:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,touchstart:!0,touchend:!0,touchmove:!0,touchcancel:!0,pointerover:!0,
pointerenter:!0,pointerdown:!0,pointermove:!0,pointerup:!0,pointercancel:!0,pointerout:!0,pointerleave:!0,gotpointercapture:!0,lostpointercapture:!0,dragstart:!0,drag:!0,dragenter:!0,dragleave:!0,dragover:!0,drop:!0,dragend:!0,DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,keypress:!0},ud={DOMAttrModified:!0,DOMAttributeNameChanged:!0,DOMCharacterDataModified:!0,DOMElementNameChanged:!0,DOMNodeInserted:!0,DOMNodeInsertedIntoDocument:!0,DOMNodeRemoved:!0,DOMNodeRemovedFromDocument:!0,DOMSubtreeModified:!0};
function vd(a,b){var c=[],d=a;for(a=a===window?window:a.getRootNode();d;)c.push(d),d=d.assignedSlot?d.assignedSlot:d.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&d.host&&(b||d!==a)?d.host:d.parentNode;c[c.length-1]===document&&c.push(window);return c}function wd(a,b){if(!B)return a;a=vd(a,!0);for(var c=0,d,e=void 0,f,g=void 0;c<b.length;c++)if(d=b[c],f=d===window?window:d.getRootNode(),f!==e&&(g=a.indexOf(f),e=f),!B(f)||-1<g)return d}
var xd={get composed(){void 0===this.Z&&(sd?this.Z="focusin"===this.type||"focusout"===this.type||sd(this):!1!==this.isTrusted&&(this.Z=td[this.type]));return this.Z||!1},composedPath:function(){this.qa||(this.qa=vd(this.__target,this.composed));return this.qa},get target(){return wd(this.currentTarget||this.__previousCurrentTarget,this.composedPath())},get relatedTarget(){if(!this.ja)return null;this.sa||(this.sa=vd(this.ja,!0));return wd(this.currentTarget||this.__previousCurrentTarget,this.sa)},
stopPropagation:function(){Event.prototype.stopPropagation.call(this);this.ia=!0},stopImmediatePropagation:function(){Event.prototype.stopImmediatePropagation.call(this);this.ia=this.Aa=!0}};function yd(a){function b(b,d){b=new a(b,d);b.Z=d&&!!d.composed;return b}ub(b,a);b.prototype=a.prototype;return b}var zd={focus:!0,blur:!0};function Ad(a){return a.__target!==a.target||a.ja!==a.relatedTarget}
function Bd(a,b,c){if(c=b.__handlers&&b.__handlers[a.type]&&b.__handlers[a.type][c])for(var d=0,e;(e=c[d])&&(!Ad(a)||a.target!==a.relatedTarget)&&(e.call(b,a),!a.Aa);d++);}
function Cd(a){var b=a.composedPath();Object.defineProperty(a,"currentTarget",{get:function(){return d},configurable:!0});for(var c=b.length-1;0<=c;c--){var d=b[c];Bd(a,d,"capture");if(a.ia)return}Object.defineProperty(a,"eventPhase",{get:function(){return Event.AT_TARGET}});var e;for(c=0;c<b.length;c++){d=b[c];var f=y(d);f=f&&f.root;if(0===c||f&&f===e)if(Bd(a,d,"bubble"),d!==window&&(e=d.getRootNode()),a.ia)break}}
function Dd(a,b,c,d,e,f){for(var g=0;g<a.length;g++){var h=a[g],k=h.type,l=h.capture,n=h.once,p=h.passive;if(b===h.node&&c===k&&d===l&&e===n&&f===p)return g}return-1}
function Ed(a,b,c){if(b){var d=typeof b;if("function"===d||"object"===d)if("object"!==d||b.handleEvent&&"function"===typeof b.handleEvent){var e=this instanceof Window?C.cb:C.addEventListener;if(ud[a])return e.call(this,a,b,c);if(c&&"object"===typeof c){var f=!!c.capture;var g=!!c.once;var h=!!c.passive}else f=!!c,h=g=!1;var k=c&&c.ka||this,l=b[rd];if(l){if(-1<Dd(l,k,a,f,g,h))return}else b[rd]=[];l=function(e){g&&this.removeEventListener(a,b,c);e.__target||Fd(e);if(k!==this){var f=Object.getOwnPropertyDescriptor(e,
"currentTarget");Object.defineProperty(e,"currentTarget",{get:function(){return k},configurable:!0})}e.__previousCurrentTarget=e.currentTarget;if(!B(k)||-1!=e.composedPath().indexOf(k))if(e.composed||-1<e.composedPath().indexOf(k))if(Ad(e)&&e.target===e.relatedTarget)e.eventPhase===Event.BUBBLING_PHASE&&e.stopImmediatePropagation();else if(e.eventPhase===Event.CAPTURING_PHASE||e.bubbles||e.target===k||k instanceof Window){var h="function"===d?b.call(k,e):b.handleEvent&&b.handleEvent(e);k!==this&&
(f?(Object.defineProperty(e,"currentTarget",f),f=null):delete e.currentTarget);return h}};b[rd].push({node:k,type:a,capture:f,once:g,passive:h,fb:l});zd[a]?(this.__handlers=this.__handlers||{},this.__handlers[a]=this.__handlers[a]||{capture:[],bubble:[]},this.__handlers[a][f?"capture":"bubble"].push(l)):e.call(this,a,l,c)}}}
function Gd(a,b,c){if(b){var d=this instanceof Window?C.eb:C.removeEventListener;if(ud[a])return d.call(this,a,b,c);if(c&&"object"===typeof c){var e=!!c.capture;var f=!!c.once;var g=!!c.passive}else e=!!c,g=f=!1;var h=c&&c.ka||this,k=void 0;var l=null;try{l=b[rd]}catch(n){}l&&(f=Dd(l,h,a,e,f,g),-1<f&&(k=l.splice(f,1)[0].fb,l.length||(b[rd]=void 0)));d.call(this,a,k||b,c);k&&zd[a]&&this.__handlers&&this.__handlers[a]&&(a=this.__handlers[a][e?"capture":"bubble"],k=a.indexOf(k),-1<k&&a.splice(k,1))}}
function Hd(){for(var a in zd)window.addEventListener(a,function(a){a.__target||(Fd(a),Cd(a))},!0)}function Fd(a){a.__target=a.target;a.ja=a.relatedTarget;if(A.K){var b=Object.getPrototypeOf(a);if(!b.hasOwnProperty("__patchProto")){var c=Object.create(b);c.gb=b;sb(c,xd);b.__patchProto=c}a.__proto__=b.__patchProto}else sb(a,xd)}var Id=yd(window.Event),Jd=yd(window.CustomEvent),Kd=yd(window.MouseEvent);
function Ld(){window.Event=Id;window.CustomEvent=Jd;window.MouseEvent=Kd;Hd();if(!sd&&Object.getOwnPropertyDescriptor(Event.prototype,"isTrusted")){var a=function(){var a=new MouseEvent("click",{bubbles:!0,cancelable:!0,composed:!0});this.dispatchEvent(a)};Element.prototype.click?Element.prototype.click=a:HTMLElement.prototype.click&&(HTMLElement.prototype.click=a)}};function Md(a,b){return{index:a,X:[],ba:b}}
function Nd(a,b,c,d){var e=0,f=0,g=0,h=0,k=Math.min(b-e,d-f);if(0==e&&0==f)a:{for(g=0;g<k;g++)if(a[g]!==c[g])break a;g=k}if(b==a.length&&d==c.length){h=a.length;for(var l=c.length,n=0;n<k-g&&Od(a[--h],c[--l]);)n++;h=n}e+=g;f+=g;b-=h;d-=h;if(0==b-e&&0==d-f)return[];if(e==b){for(b=Md(e,0);f<d;)b.X.push(c[f++]);return[b]}if(f==d)return[Md(e,b-e)];k=e;g=f;d=d-g+1;h=b-k+1;b=Array(d);for(l=0;l<d;l++)b[l]=Array(h),b[l][0]=l;for(l=0;l<h;l++)b[0][l]=l;for(l=1;l<d;l++)for(n=1;n<h;n++)if(a[k+n-1]===c[g+l-1])b[l][n]=
b[l-1][n-1];else{var p=b[l-1][n]+1,G=b[l][n-1]+1;b[l][n]=p<G?p:G}k=b.length-1;g=b[0].length-1;d=b[k][g];for(a=[];0<k||0<g;)0==k?(a.push(2),g--):0==g?(a.push(3),k--):(h=b[k-1][g-1],l=b[k-1][g],n=b[k][g-1],p=l<n?l<h?l:h:n<h?n:h,p==h?(h==d?a.push(0):(a.push(1),d=h),k--,g--):p==l?(a.push(3),k--,d=l):(a.push(2),g--,d=n));a.reverse();b=void 0;k=[];for(g=0;g<a.length;g++)switch(a[g]){case 0:b&&(k.push(b),b=void 0);e++;f++;break;case 1:b||(b=Md(e,0));b.ba++;e++;b.X.push(c[f]);f++;break;case 2:b||(b=Md(e,
0));b.ba++;e++;break;case 3:b||(b=Md(e,0)),b.X.push(c[f]),f++}b&&k.push(b);return k}function Od(a,b){return a===b};var Pd=J.parentNode,Qd=J.childNodes,Rd={},Sd=A.deferConnectionCallbacks&&"loading"===document.readyState,Td;function Ud(a){var b=[];do b.unshift(a);while(a=a.parentNode);return b}
function Hc(a,b,c){if(a!==Rd)throw new TypeError("Illegal constructor");this.Ga="ShadyRoot";this.host=b;this.c=c&&c.mode;a=Qd(b);Oc(b,a);c=x(b);c.root=this;c.wa="closed"!==this.c?this:null;c=x(this);c.firstChild=c.lastChild=c.parentNode=c.nextSibling=c.previousSibling=null;c.childNodes=[];this.b=this.V=!1;this.a=this.w=this.m=null;if(A.preferPerformance){c=0;for(var d=a.length;c<d;c++)C.removeChild.call(b,a[c])}else ad(this)}function ad(a){a.V||(a.V=!0,Hb(function(){return Vd(a)}))}
function Vd(a){for(var b;a;){a.V&&(b=a);a:{var c=a;a=c.host.getRootNode();if(B(a))for(var d=c.host.childNodes,e=0;e<d.length;e++)if(c=d[e],"slot"==c.localName)break a;a=void 0}}b&&b._renderRoot()}
Hc.prototype._renderRoot=function(){var a=Sd;Sd=!0;this.V=!1;if(this.m){id(this);for(var b=0,c;b<this.m.length;b++){c=this.m[b];var d=y(c),e=d.assignedNodes;d.assignedNodes=[];d.N=[];if(d.la=e)for(d=0;d<e.length;d++){var f=y(e[d]);f.aa=f.assignedSlot;f.assignedSlot===c&&(f.assignedSlot=null)}}for(b=this.host.firstChild;b;b=b.nextSibling)Wd(this,b);for(b=0;b<this.m.length;b++){c=this.m[b];e=y(c);if(!e.assignedNodes.length)for(d=c.firstChild;d;d=d.nextSibling)Wd(this,d,c);(d=(d=y(c.parentNode))&&d.root)&&
(gd(d)||d.V)&&d._renderRoot();Xd(this,e.N,e.assignedNodes);if(d=e.la){for(f=0;f<d.length;f++)y(d[f]).aa=null;e.la=null;d.length>e.assignedNodes.length&&(e.da=!0)}e.da&&(e.da=!1,Yd(this,c))}c=this.m;b=[];for(e=0;e<c.length;e++)d=c[e].parentNode,(f=y(d))&&f.root||!(0>b.indexOf(d))||b.push(d);for(c=0;c<b.length;c++){f=b[c];e=f===this?this.host:f;d=[];f=f.childNodes;for(var g=0;g<f.length;g++){var h=f[g];if("slot"==h.localName){h=y(h).N;for(var k=0;k<h.length;k++)d.push(h[k])}else d.push(h)}f=Qd(e);g=
Nd(d,d.length,f,f.length);k=h=0;for(var l=void 0;h<g.length&&(l=g[h]);h++){for(var n=0,p=void 0;n<l.X.length&&(p=l.X[n]);n++)Pd(p)===e&&C.removeChild.call(e,p),f.splice(l.index+k,1);k-=l.ba}k=0;for(l=void 0;k<g.length&&(l=g[k]);k++)for(h=f[l.index],n=l.index;n<l.index+l.ba;n++)p=d[n],C.insertBefore.call(e,p,h),f.splice(n,0,p)}}if(!A.preferPerformance&&!this.b)for(b=this.host.childNodes,c=0,e=b.length;c<e;c++)d=b[c],f=y(d),Pd(d)!==this.host||"slot"!==d.localName&&f.assignedSlot||C.removeChild.call(this.host,
d);this.b=!0;Sd=a;Td&&Td()};function Wd(a,b,c){var d=x(b),e=d.aa;d.aa=null;c||(c=(a=a.w[b.slot||"__catchall"])&&a[0]);c?(x(c).assignedNodes.push(b),d.assignedSlot=c):d.assignedSlot=void 0;e!==d.assignedSlot&&d.assignedSlot&&(x(d.assignedSlot).da=!0)}function Xd(a,b,c){for(var d=0,e=void 0;d<c.length&&(e=c[d]);d++)if("slot"==e.localName){var f=y(e).assignedNodes;f&&f.length&&Xd(a,b,f)}else b.push(c[d])}
function Yd(a,b){C.dispatchEvent.call(b,new Event("slotchange"));b=y(b);b.assignedSlot&&Yd(a,b.assignedSlot)}function $c(a,b){a.a=a.a||[];a.m=a.m||[];a.w=a.w||{};a.a.push.apply(a.a,b instanceof Array?b:na(ma(b)))}function id(a){if(a.a&&a.a.length){for(var b=a.a,c,d=0;d<b.length;d++){var e=b[d];Oc(e);Oc(e.parentNode);var f=jd(e);a.w[f]?(c=c||{},c[f]=!0,a.w[f].push(e)):a.w[f]=[e];a.m.push(e)}if(c)for(var g in c)a.w[g]=kd(a.w[g]);a.a=[]}}
function jd(a){var b=a.name||a.getAttribute("name")||"__catchall";return a.Ea=b}function kd(a){return a.sort(function(a,c){a=Ud(a);for(var b=Ud(c),e=0;e<a.length;e++){c=a[e];var f=b[e];if(c!==f)return a=Array.from(c.parentNode.childNodes),a.indexOf(c)-a.indexOf(f)}})}
function fd(a,b){if(a.m){id(a);var c=a.w,d;for(d in c)for(var e=c[d],f=0;f<e.length;f++){var g=e[f];if(Ab(b,g)){e.splice(f,1);var h=a.m.indexOf(g);0<=h&&a.m.splice(h,1);f--;g=y(g);if(h=g.N)for(var k=0;k<h.length;k++){var l=h[k],n=Pd(l);n&&C.removeChild.call(n,l)}g.N=[];g.assignedNodes=[];h=!0}}return h}}function gd(a){id(a);return!(!a.m||!a.m.length)}
if(window.customElements&&A.na&&!A.preferPerformance){var Zd=new Map;Td=function(){var a=Array.from(Zd);Zd.clear();a=ma(a);for(var b=a.next();!b.done;b=a.next()){b=ma(b.value);var c=b.next().value;b.next().value?c.Ca():c.Da()}};Sd&&document.addEventListener("readystatechange",function(){Sd=!1;Td()},{once:!0});var $d=function(a,b,c){var d=0,e="__isConnected"+d++;if(b||c)a.prototype.connectedCallback=a.prototype.Ca=function(){Sd?Zd.set(this,!0):this[e]||(this[e]=!0,b&&b.call(this))},a.prototype.disconnectedCallback=
a.prototype.Da=function(){Sd?this.isConnected||Zd.set(this,!1):this[e]&&(this[e]=!1,c&&c.call(this))};return a},define=window.customElements.define;Object.defineProperty(window.CustomElementRegistry.prototype,"define",{value:function(a,b){var c=b.prototype.connectedCallback,d=b.prototype.disconnectedCallback;define.call(window.customElements,a,$d(b,c,d));b.prototype.connectedCallback=c;b.prototype.disconnectedCallback=d}})};function ae(a){var b=a.getRootNode();B(b)&&Vd(b);return(a=y(a))&&a.assignedSlot||null}
var be={addEventListener:Ed.bind(window),removeEventListener:Gd.bind(window)},ce={addEventListener:Ed,removeEventListener:Gd,appendChild:function(a){return Sc(this,a)},insertBefore:function(a,b){return Sc(this,a,b)},removeChild:function(a){return Vc(this,a)},replaceChild:function(a,b){Sc(this,a,b);Vc(this,b);return a},cloneNode:function(a){if("template"==this.localName)var b=C.cloneNode.call(this,a);else if(b=C.cloneNode.call(this,!1),a&&b.nodeType!==Node.ATTRIBUTE_NODE){a=this.childNodes;for(var c=
0,d;c<a.length;c++)d=a[c].cloneNode(!0),b.appendChild(d)}return b},getRootNode:function(){return ld(this)},contains:function(a){return Ab(this,a)},dispatchEvent:function(a){Ib();return C.dispatchEvent.call(this,a)}};
Object.defineProperties(ce,{isConnected:{get:function(){if(yc&&yc.call(this))return!0;if(this.nodeType==Node.DOCUMENT_FRAGMENT_NODE)return!1;var a=this.ownerDocument;if(zb){if(C.contains.call(a,this))return!0}else if(a.documentElement&&C.contains.call(a.documentElement,this))return!0;for(a=this;a&&!(a instanceof Document);)a=a.parentNode||(B(a)?a.host:void 0);return!!(a&&a instanceof Document)},configurable:!0}});
var de={get assignedSlot(){return ae(this)}},ee={querySelector:function(a){return md(this,function(b){return rb.call(b,a)},function(a){return!!a})[0]||null},querySelectorAll:function(a,b){if(b){b=Array.prototype.slice.call(C.querySelectorAll.call(this,a));var c=this.getRootNode();return b.filter(function(a){return a.getRootNode()==c})}return md(this,function(b){return rb.call(b,a)})}},fe={},ge={assignedNodes:function(a){if("slot"===this.localName){var b=this.getRootNode();B(b)&&Vd(b);return(b=y(this))?
(a&&a.flatten?b.N:b.assignedNodes)||[]:[]}}},he=tb({setAttribute:function(a,b){pd(this,a,b)},removeAttribute:function(a){C.removeAttribute.call(this,a);hd(this,a)},attachShadow:function(a){if(!this)throw"Must provide a host.";if(!a)throw"Not enough arguments.";return new Hc(Rd,this,a)},get slot(){return this.getAttribute("slot")},set slot(a){pd(this,"slot",a)},get assignedSlot(){return ae(this)}},ee,ge);Object.defineProperties(he,Dc);
var ie={importNode:function(a,b){return qd(a,b)},getElementById:function(a){return md(this,function(b){return b.id==a},function(a){return!!a})[0]||null}};Object.defineProperties(ie,{_activeElement:Ec.activeElement});
for(var je=HTMLElement.prototype.blur,ke={blur:function(){var a=y(this);(a=(a=a&&a.root)&&a.activeElement)?a.blur():je.call(this)}},le={},me=ma(Object.getOwnPropertyNames(Document.prototype)),ne=me.next();!ne.done;le={H:le.H},ne=me.next())le.H=ne.value,"on"===le.H.substring(0,2)&&Object.defineProperty(ke,le.H,{set:function(a){return function(b){var c=x(this),d=a.H.substring(2);c.$[a.H]&&this.removeEventListener(d,c.$[a.H]);this.addEventListener(d,b,{});c.$[a.H]=b}}(le),get:function(a){return function(){var b=
y(this);return b&&b.$[a.H]}}(le),configurable:!0});var oe=tb({addEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.ka=this;this.host.addEventListener(a,b,c)},removeEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.ka=this;this.host.removeEventListener(a,b,c)},getElementById:function(a){return md(this,function(b){return b.id==a},function(a){return!!a})[0]||null}},ee);A.preferPerformance||(tb(ie,ee),tb(fe,ee));
function L(a,b){for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){var e=c[d],f=Object.getOwnPropertyDescriptor(b,e);f.value?a[e]=f.value:Object.defineProperty(a,e,f)}};if(A.na){var ShadyDOM={inUse:A.na,patch:function(a){Jc(a);Ic(a);return a},isShadyRoot:B,enqueue:Hb,flush:Ib,settings:A,filterMutations:Nb,observeChildren:Lb,unobserveChildren:Mb,nativeMethods:C,nativeTree:J,deferConnectionCallbacks:A.deferConnectionCallbacks,preferPerformance:A.preferPerformance,handlesDynamicScoping:!0};window.ShadyDOM=ShadyDOM;Ld();var pe=window.customElements&&window.customElements.nativeHTMLElement||HTMLElement;L(Hc.prototype,oe);L(window.Node.prototype,ce);L(window.Window.prototype,
be);L(window.Text.prototype,de);L(window.Element.prototype,he);L(window.DocumentFragment.prototype,fe);L(window.Document.prototype,ie);window.HTMLSlotElement&&L(window.HTMLSlotElement.prototype,ge);L(pe.prototype,ke);A.K&&(Fc(window.Node.prototype),Fc(window.Text.prototype),Fc(window.DocumentFragment.prototype),Fc(window.Element.prototype),Fc(pe.prototype),Fc(window.Document.prototype),window.HTMLSlotElement&&Fc(window.HTMLSlotElement.prototype));Gc();window.ShadowRoot=Hc};var qe=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function re(a){var b=qe.has(a);a=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);return!b&&a}function M(a){var b=a.isConnected;if(void 0!==b)return b;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return!(!a||!(a.__CE_isImportDocument||a instanceof Document))}
function se(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
function te(a,b,c){c=void 0===c?new Set:c;for(var d=a;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;b(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)te(d,b,c);d=se(a,e);continue}else if("template"===f){d=se(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)te(e,b,c)}d=d.firstChild?d.firstChild:se(a,d)}}function N(a,b,c){a[b]=c};function ue(){this.a=new Map;this.v=new Map;this.f=[];this.c=!1}function ve(a,b,c){a.a.set(b,c);a.v.set(c.constructorFunction,c)}function we(a,b){a.c=!0;a.f.push(b)}function xe(a,b){a.c&&te(b,function(b){return a.b(b)})}ue.prototype.b=function(a){if(this.c&&!a.__CE_patched){a.__CE_patched=!0;for(var b=0;b<this.f.length;b++)this.f[b](a)}};function O(a,b){var c=[];te(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state?a.connectedCallback(d):ye(a,d)}}
function P(a,b){var c=[];te(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state&&a.disconnectedCallback(d)}}
function Q(a,b,c){c=void 0===c?{}:c;var d=c.bb||new Set,e=c.ha||function(b){return ye(a,b)},f=[];te(b,function(b){if("link"===b.localName&&"import"===b.getAttribute("rel")){var c=b.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:b.addEventListener("load",function(){var c=b.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);Q(a,c,{bb:f,ha:e})}})}else f.push(b)},d);
if(a.c)for(b=0;b<f.length;b++)a.b(f[b]);for(b=0;b<f.length;b++)e(f[b])}
function ye(a,b){if(void 0===b.__CE_state){var c=b.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=a.a.get(b.localName)){c.constructionStack.push(b);var d=c.constructorFunction;try{try{if(new d!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop()}}catch(g){throw b.__CE_state=2,g;}b.__CE_state=1;b.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=
c[d],f=b.getAttribute(e);null!==f&&a.attributeChangedCallback(b,e,null,f,null)}M(b)&&a.connectedCallback(b)}}}ue.prototype.connectedCallback=function(a){var b=a.__CE_definition;b.connectedCallback&&b.connectedCallback.call(a)};ue.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;b.disconnectedCallback&&b.disconnectedCallback.call(a)};
ue.prototype.attributeChangedCallback=function(a,b,c,d,e){var f=a.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b)&&f.attributeChangedCallback.call(a,b,c,d,e)};function ze(a){var b=document;this.b=a;this.a=b;this.P=void 0;Q(this.b,this.a);"loading"===this.a.readyState&&(this.P=new MutationObserver(this.c.bind(this)),this.P.observe(this.a,{childList:!0,subtree:!0}))}function Ae(a){a.P&&a.P.disconnect()}ze.prototype.c=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||Ae(this);for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,d=0;d<c.length;d++)Q(this.b,c[d])};function Be(){var a=this;this.a=this.B=void 0;this.b=new Promise(function(b){a.a=b;a.B&&b(a.B)})}Be.prototype.resolve=function(a){if(this.B)throw Error("Already resolved.");this.B=a;this.a&&this.a(a)};function S(a){this.c=!1;this.a=a;this.G=new Map;this.f=function(a){return a()};this.b=!1;this.v=[];this.ea=new ze(a)}r=S.prototype;
r.define=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!re(a))throw new SyntaxError("The element name '"+a+"' is not valid.");if(this.a.a.get(a))throw Error("A custom element with name '"+a+"' has already been defined.");if(this.c)throw Error("A custom element is already being defined.");this.c=!0;try{var d=function(a){var b=e[a];if(void 0!==b&&!(b instanceof Function))throw Error("The '"+a+"' callback must be a function.");
return b},e=b.prototype;if(!(e instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var f=d("connectedCallback");var g=d("disconnectedCallback");var h=d("adoptedCallback");var k=d("attributeChangedCallback");var l=b.observedAttributes||[]}catch(n){return}finally{this.c=!1}b={localName:a,constructorFunction:b,connectedCallback:f,disconnectedCallback:g,adoptedCallback:h,attributeChangedCallback:k,observedAttributes:l,constructionStack:[]};ve(this.a,
a,b);this.v.push(b);this.b||(this.b=!0,this.f(function(){return Ce(c)}))};r.ha=function(a){Q(this.a,a)};
function Ce(a){if(!1!==a.b){a.b=!1;for(var b=a.v,c=[],d=new Map,e=0;e<b.length;e++)d.set(b[e].localName,[]);Q(a.a,document,{ha:function(b){if(void 0===b.__CE_state){var e=b.localName,f=d.get(e);f?f.push(b):a.a.a.get(e)&&c.push(b)}}});for(e=0;e<c.length;e++)ye(a.a,c[e]);for(;0<b.length;){var f=b.shift();e=f.localName;f=d.get(f.localName);for(var g=0;g<f.length;g++)ye(a.a,f[g]);(e=a.G.get(e))&&e.resolve(void 0)}}}r.get=function(a){if(a=this.a.a.get(a))return a.constructorFunction};
r.za=function(a){if(!re(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.G.get(a);if(b)return b.b;b=new Be;this.G.set(a,b);this.a.a.get(a)&&!this.v.some(function(b){return b.localName===a})&&b.resolve(void 0);return b.b};r.Va=function(a){Ae(this.ea);var b=this.f;this.f=function(c){return a(function(){return b(c)})}};window.CustomElementRegistry=S;S.prototype.define=S.prototype.define;S.prototype.upgrade=S.prototype.ha;S.prototype.get=S.prototype.get;
S.prototype.whenDefined=S.prototype.za;S.prototype.polyfillWrapFlushCallback=S.prototype.Va;var De=window.Document.prototype.createElement,Ee=window.Document.prototype.createElementNS,Fe=window.Document.prototype.importNode,Ge=window.Document.prototype.prepend,He=window.Document.prototype.append,Ie=window.DocumentFragment.prototype.prepend,Je=window.DocumentFragment.prototype.append,Ke=window.Node.prototype.cloneNode,Le=window.Node.prototype.appendChild,Me=window.Node.prototype.insertBefore,Ne=window.Node.prototype.removeChild,Oe=window.Node.prototype.replaceChild,Pe=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),Qe=window.Element.prototype.attachShadow,Re=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Se=window.Element.prototype.getAttribute,Te=window.Element.prototype.setAttribute,Ue=window.Element.prototype.removeAttribute,Ve=window.Element.prototype.getAttributeNS,We=window.Element.prototype.setAttributeNS,Xe=window.Element.prototype.removeAttributeNS,Ye=window.Element.prototype.insertAdjacentElement,Ze=window.Element.prototype.insertAdjacentHTML,$e=window.Element.prototype.prepend,
af=window.Element.prototype.append,bf=window.Element.prototype.before,cf=window.Element.prototype.after,df=window.Element.prototype.replaceWith,ef=window.Element.prototype.remove,ff=window.HTMLElement,gf=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),hf=window.HTMLElement.prototype.insertAdjacentElement,jf=window.HTMLElement.prototype.insertAdjacentHTML;var kf=new function(){};function lf(){var a=mf;window.HTMLElement=function(){function b(){var b=this.constructor,d=a.v.get(b);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(0===e.length)return e=De.call(document,d.localName),Object.setPrototypeOf(e,b.prototype),e.__CE_state=1,e.__CE_definition=d,a.b(e),e;d=e.length-1;var f=e[d];if(f===kf)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[d]=kf;Object.setPrototypeOf(f,b.prototype);a.b(f);return f}b.prototype=ff.prototype;Object.defineProperty(b.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});return b}()};function nf(a,b,c){function d(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var f=[],l=0;l<d.length;l++){var n=d[l];n instanceof Element&&M(n)&&f.push(n);if(n instanceof DocumentFragment)for(n=n.firstChild;n;n=n.nextSibling)e.push(n);else e.push(n)}b.apply(this,d);for(d=0;d<f.length;d++)P(a,f[d]);if(M(this))for(d=0;d<e.length;d++)f=e[d],f instanceof Element&&O(a,f)}}void 0!==c.ga&&(b.prepend=d(c.ga));void 0!==c.append&&(b.append=d(c.append))};function of(){var a=mf;N(Document.prototype,"createElement",function(b){if(this.__CE_hasRegistry){var c=a.a.get(b);if(c)return new c.constructorFunction}b=De.call(this,b);a.b(b);return b});N(Document.prototype,"importNode",function(b,c){b=Fe.call(this,b,!!c);this.__CE_hasRegistry?Q(a,b):xe(a,b);return b});N(Document.prototype,"createElementNS",function(b,c){if(this.__CE_hasRegistry&&(null===b||"http://www.w3.org/1999/xhtml"===b)){var d=a.a.get(c);if(d)return new d.constructorFunction}b=Ee.call(this,
b,c);a.b(b);return b});nf(a,Document.prototype,{ga:Ge,append:He})};function pf(){function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var c=void 0;if(this.firstChild){var e=this.childNodes,h=e.length;if(0<h&&M(this)){c=Array(h);for(var k=0;k<h;k++)c[k]=e[k]}}d.set.call(this,a);if(c)for(a=0;a<c.length;a++)P(b,c[a])}}})}var b=mf;N(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);
a=Me.call(this,a,d);if(M(this))for(d=0;d<c.length;d++)O(b,c[d]);return a}c=M(a);d=Me.call(this,a,d);c&&P(b,a);M(this)&&O(b,a);return d});N(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=Le.call(this,a);if(M(this))for(var e=0;e<c.length;e++)O(b,c[e]);return a}c=M(a);e=Le.call(this,a);c&&P(b,a);M(this)&&O(b,a);return e});N(Node.prototype,"cloneNode",function(a){a=Ke.call(this,!!a);this.ownerDocument.__CE_hasRegistry?Q(b,a):
xe(b,a);return a});N(Node.prototype,"removeChild",function(a){var c=M(a),e=Ne.call(this,a);c&&P(b,a);return e});N(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=Oe.call(this,a,d);if(M(this))for(P(b,d),d=0;d<c.length;d++)O(b,c[d]);return a}c=M(a);var f=Oe.call(this,a,d),g=M(this);g&&P(b,d);c&&P(b,a);g&&O(b,a);return f});Pe&&Pe.get?a(Node.prototype,Pe):we(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=
[],b=0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)Ne.call(this,this.firstChild);Le.call(this,document.createTextNode(a))}})})};function qf(a){function b(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var h=[],k=0;k<d.length;k++){var l=d[k];l instanceof Element&&M(l)&&h.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)e.push(l);else e.push(l)}b.apply(this,d);for(d=0;d<h.length;d++)P(a,h[d]);if(M(this))for(d=0;d<e.length;d++)h=e[d],h instanceof Element&&O(a,h)}}var c=Element.prototype;void 0!==bf&&(c.before=b(bf));void 0!==bf&&(c.after=b(cf));void 0!==df&&
N(c,"replaceWith",function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var g=[],h=0;h<c.length;h++){var k=c[h];k instanceof Element&&M(k)&&g.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)d.push(k);else d.push(k)}h=M(this);df.apply(this,c);for(c=0;c<g.length;c++)P(a,g[c]);if(h)for(P(a,this),c=0;c<d.length;c++)g=d[c],g instanceof Element&&O(a,g)});void 0!==ef&&N(c,"remove",function(){var b=M(this);ef.call(this);b&&P(a,this)})};function rf(){function a(a,b){Object.defineProperty(a,"innerHTML",{enumerable:b.enumerable,configurable:!0,get:b.get,set:function(a){var c=this,e=void 0;M(this)&&(e=[],te(this,function(a){a!==c&&e.push(a)}));b.set.call(this,a);if(e)for(var f=0;f<e.length;f++){var g=e[f];1===g.__CE_state&&d.disconnectedCallback(g)}this.ownerDocument.__CE_hasRegistry?Q(d,this):xe(d,this);return a}})}function b(a,b){N(a,"insertAdjacentElement",function(a,c){var e=M(c);a=b.call(this,a,c);e&&P(d,c);M(a)&&O(d,c);return a})}
function c(a,b){function c(a,b){for(var c=[];a!==b;a=a.nextSibling)c.push(a);for(b=0;b<c.length;b++)Q(d,c[b])}N(a,"insertAdjacentHTML",function(a,d){a=a.toLowerCase();if("beforebegin"===a){var e=this.previousSibling;b.call(this,a,d);c(e||this.parentNode.firstChild,this)}else if("afterbegin"===a)e=this.firstChild,b.call(this,a,d),c(this.firstChild,e);else if("beforeend"===a)e=this.lastChild,b.call(this,a,d),c(e||this.firstChild,null);else if("afterend"===a)e=this.nextSibling,b.call(this,a,d),c(this.nextSibling,
e);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");})}var d=mf;Qe&&N(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=Qe.call(this,a)});Re&&Re.get?a(Element.prototype,Re):gf&&gf.get?a(HTMLElement.prototype,gf):we(d,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return Ke.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName,c=b?this.content:this,d=Ee.call(document,
this.namespaceURI,this.localName);for(d.innerHTML=a;0<c.childNodes.length;)Ne.call(c,c.childNodes[0]);for(a=b?d.content:d;0<a.childNodes.length;)Le.call(c,a.childNodes[0])}})});N(Element.prototype,"setAttribute",function(a,b){if(1!==this.__CE_state)return Te.call(this,a,b);var c=Se.call(this,a);Te.call(this,a,b);b=Se.call(this,a);d.attributeChangedCallback(this,a,c,b,null)});N(Element.prototype,"setAttributeNS",function(a,b,c){if(1!==this.__CE_state)return We.call(this,a,b,c);var e=Ve.call(this,a,
b);We.call(this,a,b,c);c=Ve.call(this,a,b);d.attributeChangedCallback(this,b,e,c,a)});N(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return Ue.call(this,a);var b=Se.call(this,a);Ue.call(this,a);null!==b&&d.attributeChangedCallback(this,a,b,null,null)});N(Element.prototype,"removeAttributeNS",function(a,b){if(1!==this.__CE_state)return Xe.call(this,a,b);var c=Ve.call(this,a,b);Xe.call(this,a,b);var e=Ve.call(this,a,b);c!==e&&d.attributeChangedCallback(this,b,c,e,a)});hf?b(HTMLElement.prototype,
hf):Ye?b(Element.prototype,Ye):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");jf?c(HTMLElement.prototype,jf):Ze?c(Element.prototype,Ze):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");nf(d,Element.prototype,{ga:$e,append:af});qf(d)};var sf=window.customElements;if(!sf||sf.forcePolyfill||"function"!=typeof sf.define||"function"!=typeof sf.get){var mf=new ue;lf();of();nf(mf,DocumentFragment.prototype,{ga:Ie,append:Je});pf();rf();document.__CE_hasRegistry=!0;var customElements=new S(mf);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements})};function tf(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName=""}
function wf(a){a=a.replace(xf,"").replace(yf,"");var b=zf,c=a,d=new tf;d.start=0;d.end=c.length;for(var e=d,f=0,g=c.length;f<g;f++)if("{"===c[f]){e.rules||(e.rules=[]);var h=e,k=h.rules[h.rules.length-1]||null;e=new tf;e.start=f+1;e.parent=h;e.previous=k;h.rules.push(e)}else"}"===c[f]&&(e.end=f+1,e=e.parent||d);return b(d,a)}
function zf(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=Af(c),c=c.replace(Bf," "),c=c.substring(c.lastIndexOf(";")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf("@"),a.atRule?0===c.indexOf("@media")?a.type=Cf:c.match(Df)&&(a.type=Ef,a.keyframesName=a.selector.split(Bf).pop()):a.type=0===c.indexOf("--")?Ff:Gf);if(c=a.rules)for(var d=0,e=c.length,f=void 0;d<e&&(f=c[d]);d++)zf(f,
b);return a}function Af(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a="0"+a;return"\\"+a})}
function Hf(a,b,c){c=void 0===c?"":c;var d="";if(a.cssText||a.rules){var e=a.rules,f;if(f=e)f=e[0],f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var g=e.length,h=void 0;f<g&&(h=e[f]);f++)d=Hf(h,b,d)}else b?b=a.cssText:(b=a.cssText,b=b.replace(If,"").replace(Jf,""),b=b.replace(Kf,"").replace(Lf,"")),(d=b.trim())&&(d="  "+d+"\n")}d&&(a.selector&&(c+=a.selector+" {\n"),c+=d,a.selector&&(c+="}\n\n"));return c}
var Gf=1,Ef=7,Cf=4,Ff=1E3,xf=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,yf=/@import[^;]*;/gim,If=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,Jf=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,Kf=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,Lf=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,Df=/^@[^\s]*keyframes/,Bf=/\s+/g;var T=!(window.ShadyDOM&&window.ShadyDOM.inUse),Mf;function Nf(a){Mf=a&&a.shimcssproperties?!1:T||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"))}var Of;window.ShadyCSS&&void 0!==window.ShadyCSS.cssBuild&&(Of=window.ShadyCSS.cssBuild);window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?Mf=window.ShadyCSS.nativeCss:window.ShadyCSS?(Nf(window.ShadyCSS),window.ShadyCSS=void 0):Nf(window.WebComponents&&window.WebComponents.flags);
var V=Mf,Pf=Of;var Qf=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,Rf=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,Sf=/(--[\w-]+)\s*([:,;)]|$)/gi,Tf=/(animation\s*:)|(animation-name\s*:)/,Uf=/@media\s(.*)/,Vf=/\{[^}]*\}/g;var Wf=new Set;function Xf(a,b){if(!a)return"";"string"===typeof a&&(a=wf(a));b&&Yf(a,b);return Hf(a,V)}function Zf(a){!a.__cssRules&&a.textContent&&(a.__cssRules=wf(a.textContent));return a.__cssRules||null}function $f(a){return!!a.parent&&a.parent.type===Ef}function Yf(a,b,c,d){if(a){var e=!1,f=a.type;if(d&&f===Cf){var g=a.selector.match(Uf);g&&(window.matchMedia(g[1]).matches||(e=!0))}f===Gf?b(a):c&&f===Ef?c(a):f===Ff&&(e=!0);if((a=a.rules)&&!e)for(e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++)Yf(g,b,c,d)}}
function ag(a,b,c,d){var e=document.createElement("style");b&&e.setAttribute("scope",b);e.textContent=a;bg(e,c,d);return e}var cg=null;function dg(a){a=document.createComment(" Shady DOM styles for "+a+" ");var b=document.head;b.insertBefore(a,(cg?cg.nextSibling:null)||b.firstChild);return cg=a}function bg(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);cg?a.compareDocumentPosition(cg)===Node.DOCUMENT_POSITION_PRECEDING&&(cg=a):cg=a}
function eg(a,b){for(var c=0,d=a.length;b<d;b++)if("("===a[b])c++;else if(")"===a[b]&&0===--c)return b;return-1}function fg(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");var d=eg(a,c+3),e=a.substring(c+4,d);c=a.substring(0,c);a=fg(a.substring(d+1),b);d=e.indexOf(",");return-1===d?b(c,e.trim(),"",a):b(c,e.substring(0,d).trim(),e.substring(d+1).trim(),a)}function gg(a,b){T?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b)}
function hg(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b,b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is,c=a.extends);return{is:b,Y:c}}function ig(a){for(var b=[],c="",d=0;0<=d&&d<a.length;d++)if("("===a[d]){var e=eg(a,d);c+=a.slice(d,e+1);d=e}else","===a[d]?(b.push(c),c=""):c+=a[d];c&&b.push(c);return b}
function jg(a){if(void 0!==Pf)return Pf;if(void 0===a.__cssBuild){var b=a.getAttribute("css-build");if(b)a.__cssBuild=b;else{a:{b="template"===a.localName?a.content.firstChild:a.firstChild;if(b instanceof Comment&&(b=b.textContent.trim().split(":"),"css-build"===b[0])){b=b[1];break a}b=""}if(""!==b){var c="template"===a.localName?a.content.firstChild:a.firstChild;c.parentNode.removeChild(c)}a.__cssBuild=b}}return a.__cssBuild||""}
function kg(a){a=void 0===a?"":a;return""!==a&&V?T?"shadow"===a:"shady"===a:!1};function lg(){}function mg(a,b){ng(W,a,function(a){og(a,b||"")})}function ng(a,b,c){b.nodeType===Node.ELEMENT_NODE&&c(b);var d;"template"===b.localName?d=(b.content||b._content||b).childNodes:d=b.children||b.childNodes;if(d)for(b=0;b<d.length;b++)ng(a,d[b],c)}
function og(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"),a.classList.remove(b)):(a.classList.add("style-scope"),a.classList.add(b));else if(a.getAttribute){var d=a.getAttribute("class");c?d&&(b=d.replace("style-scope","").replace(b,""),gg(a,b)):gg(a,(d?d+" ":"")+"style-scope "+b)}}function pg(a,b,c){ng(W,a,function(a){og(a,b,!0);og(a,c)})}function qg(a,b){ng(W,a,function(a){og(a,b||"",!0)})}
function rg(a,b,c,d,e){var f=W;e=void 0===e?"":e;""===e&&(T||"shady"===(void 0===d?"":d)?e=Xf(b,c):(a=hg(a),e=sg(f,b,a.is,a.Y,c)+"\n\n"));return e.trim()}function sg(a,b,c,d,e){var f=tg(c,d);c=c?"."+c:"";return Xf(b,function(b){b.c||(b.selector=b.F=ug(a,b,a.b,c,f),b.c=!0);e&&e(b,c,f)})}function tg(a,b){return b?"[is="+a+"]":a}
function ug(a,b,c,d,e){var f=ig(b.selector);if(!$f(b)){b=0;for(var g=f.length,h=void 0;b<g&&(h=f[b]);b++)f[b]=c.call(a,h,d,e)}return f.filter(function(a){return!!a}).join(",")}function vg(a){return a.replace(wg,function(a,c,d){-1<d.indexOf("+")?d=d.replace(/\+/g,"___"):-1<d.indexOf("___")&&(d=d.replace(/___/g,"+"));return":"+c+"("+d+")"})}
function xg(a){for(var b=[],c;c=a.match(yg);){var d=c.index,e=eg(a,d);if(-1===e)throw Error(c.input+" selector missing ')'");c=a.slice(d,e+1);a=a.replace(c,"\ue000");b.push(c)}return{pa:a,matches:b}}function zg(a,b){var c=a.split("\ue000");return b.reduce(function(a,b,f){return a+b+c[f+1]},c[0])}
lg.prototype.b=function(a,b,c){var d=!1;a=a.trim();var e=wg.test(a);e&&(a=a.replace(wg,function(a,b,c){return":"+b+"("+c.replace(/\s/g,"")+")"}),a=vg(a));var f=yg.test(a);if(f){var g=xg(a);a=g.pa;g=g.matches}a=a.replace(Ag,":host $1");a=a.replace(Bg,function(a,e,f){d||(a=Cg(f,e,b,c),d=d||a.stop,e=a.Ka,f=a.value);return e+f});f&&(a=zg(a,g));e&&(a=vg(a));return a};
function Cg(a,b,c,d){var e=a.indexOf("::slotted");0<=a.indexOf(":host")?a=Dg(a,d):0!==e&&(a=c?Eg(a,c):a);c=!1;0<=e&&(b="",c=!0);if(c){var f=!0;c&&(a=a.replace(Fg,function(a,b){return" > "+b}))}a=a.replace(Gg,function(a,b,c){return'[dir="'+c+'"] '+b+", "+b+'[dir="'+c+'"]'});return{value:a,Ka:b,stop:f}}
function Eg(a,b){a=a.split(/(\[.+?\])/);for(var c=[],d=0;d<a.length;d++)if(1===d%2)c.push(a[d]);else{var e=a[d];if(""!==e||d!==a.length-1)e=e.split(":"),e[0]+=b,c.push(e.join(":"))}return c.join("")}function Dg(a,b){var c=a.match(Hg);return(c=c&&c[2].trim()||"")?c[0].match(Ig)?a.replace(Hg,function(a,c,f){return b+f}):c.split(Ig)[0]===b?c:"should_not_match":a.replace(":host",b)}function Jg(a){":root"===a.selector&&(a.selector="html")}
lg.prototype.c=function(a){return a.match(":host")?"":a.match("::slotted")?this.b(a,":not(.style-scope)"):Eg(a.trim(),":not(.style-scope)")};da.Object.defineProperties(lg.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"style-scope"}}});
var wg=/:(nth[-\w]+)\(([^)]+)\)/,Bg=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,Ig=/[[.:#*]/,Ag=/^(::slotted)/,Hg=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Fg=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Gg=/(.*):dir\((?:(ltr|rtl))\)/,yg=/:(?:matches|any|-(?:webkit|moz)-any)/,W=new lg;function Kg(a,b,c,d,e){this.M=a||null;this.b=b||null;this.c=c||[];this.T=null;this.cssBuild=e||"";this.Y=d||"";this.a=this.I=this.O=null}function X(a){return a?a.__styleInfo:null}function Lg(a,b){return a.__styleInfo=b}Kg.prototype.f=function(){return this.M};Kg.prototype._getStyleRules=Kg.prototype.f;function Mg(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var Ng=navigator.userAgent.match("Trident");function Og(){}function Pg(a){var b={},c=[],d=0;Yf(a,function(a){Qg(a);a.index=d++;a=a.C.cssText;for(var c;c=Sf.exec(a);){var e=c[1];":"!==c[2]&&(b[e]=!0)}},function(a){c.push(a)});a.b=c;a=[];for(var e in b)a.push(e);return a}
function Qg(a){if(!a.C){var b={},c={};Rg(a,c)&&(b.L=c,a.rules=null);b.cssText=a.parsedCssText.replace(Vf,"").replace(Qf,"");a.C=b}}function Rg(a,b){var c=a.C;if(c){if(c.L)return Object.assign(b,c.L),!0}else{c=a.parsedCssText;for(var d;a=Qf.exec(c);){d=(a[2]||a[3]).trim();if("inherit"!==d||"unset"!==d)b[a[1].trim()]=d;d=!0}return d}}
function Sg(a,b,c){b&&(b=0<=b.indexOf(";")?Tg(a,b,c):fg(b,function(b,e,f,g){if(!e)return b+g;(e=Sg(a,c[e],c))&&"initial"!==e?"apply-shim-inherit"===e&&(e="inherit"):e=Sg(a,c[f]||f,c)||f;return b+(e||"")+g}));return b&&b.trim()||""}
function Tg(a,b,c){b=b.split(";");for(var d=0,e,f;d<b.length;d++)if(e=b[d]){Rf.lastIndex=0;if(f=Rf.exec(e))e=Sg(a,c[f[1]],c);else if(f=e.indexOf(":"),-1!==f){var g=e.substring(f);g=g.trim();g=Sg(a,g,c)||g;e=e.substring(0,f)+g}b[d]=e&&e.lastIndexOf(";")===e.length-1?e.slice(0,-1):e||""}return b.join(";")}
function Ug(a,b){var c={},d=[];Yf(a,function(a){a.C||Qg(a);var e=a.F||a.parsedSelector;b&&a.C.L&&e&&Mg.call(b,e)&&(Rg(a,c),a=a.index,e=parseInt(a/32,10),d[e]=(d[e]||0)|1<<a%32)},null,!0);return{L:c,key:d}}
function Vg(a,b,c,d){b.C||Qg(b);if(b.C.L){var e=hg(a);a=e.is;e=e.Y;e=a?tg(a,e):"html";var f=b.parsedSelector,g=":host > *"===f||"html"===f,h=0===f.indexOf(":host")&&!g;"shady"===c&&(g=f===e+" > *."+e||-1!==f.indexOf("html"),h=!g&&0===f.indexOf(e));if(g||h)c=e,h&&(b.F||(b.F=ug(W,b,W.b,a?"."+a:"",e)),c=b.F||e),d({pa:c,Sa:h,pb:g})}}function Wg(a,b,c){var d={},e={};Yf(b,function(b){Vg(a,b,c,function(c){Mg.call(a._element||a,c.pa)&&(c.Sa?Rg(b,d):Rg(b,e))})},null,!0);return{Wa:e,Qa:d}}
function Xg(a,b,c,d){var e=hg(b),f=tg(e.is,e.Y),g=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])"),h=X(b);e=h.M;h=h.cssBuild;var k=Yg(e,d);return rg(b,e,function(b){var e="";b.C||Qg(b);b.C.cssText&&(e=Tg(a,b.C.cssText,c));b.cssText=e;if(!T&&!$f(b)&&b.cssText){var h=e=b.cssText;null==b.ua&&(b.ua=Tf.test(e));if(b.ua)if(null==b.fa){b.fa=[];for(var l in k)h=k[l],h=h(e),e!==h&&(e=h,b.fa.push(l))}else{for(l=0;l<b.fa.length;++l)h=k[b.fa[l]],e=h(e);h=e}b.cssText=h;b.F=
b.F||b.selector;e="."+d;l=ig(b.F);h=0;for(var u=l.length,w=void 0;h<u&&(w=l[h]);h++)l[h]=w.match(g)?w.replace(f,e):e+" "+w;b.selector=l.join(",")}},h)}function Yg(a,b){a=a.b;var c={};if(!T&&a)for(var d=0,e=a[d];d<a.length;e=a[++d]){var f=e,g=b;f.f=new RegExp("\\b"+f.keyframesName+"(?!\\B|-)","g");f.a=f.keyframesName+"-"+g;f.F=f.F||f.selector;f.selector=f.F.replace(f.keyframesName,f.a);c[e.keyframesName]=Zg(e)}return c}function Zg(a){return function(b){return b.replace(a.f,a.a)}}
function $g(a,b){var c=ah,d=Zf(a);a.textContent=Xf(d,function(a){var d=a.cssText=a.parsedCssText;a.C&&a.C.cssText&&(d=d.replace(If,"").replace(Jf,""),a.cssText=Tg(c,d,b))})}da.Object.defineProperties(Og.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"x-scope"}}});var ah=new Og;var bh={},ch=window.customElements;if(ch&&!T){var dh=ch.define;ch.define=function(a,b,c){bh[a]||(bh[a]=dg(a));dh.call(ch,a,b,c)}};function eh(){this.cache={}}eh.prototype.store=function(a,b,c,d){var e=this.cache[a]||[];e.push({L:b,styleElement:c,I:d});100<e.length&&e.shift();this.cache[a]=e};eh.prototype.fetch=function(a,b,c){if(a=this.cache[a])for(var d=a.length-1;0<=d;d--){var e=a[d],f;a:{for(f=0;f<c.length;f++){var g=c[f];if(e.L[g]!==b[g]){f=!1;break a}}f=!0}if(f)return e}};function fh(){}var gh=new RegExp(W.a+"\\s*([^\\s]*)");function hh(a){return(a=(a.classList&&a.classList.value?a.classList.value:a.getAttribute("class")||"").match(gh))?a[1]:""}function ih(a){var b=a.getRootNode();return b===a||b===a.ownerDocument?"":(a=b.host)?hg(a).is:""}
function jh(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var d=0;d<c.addedNodes.length;d++){var e=c.addedNodes[d];if(e.nodeType===Node.ELEMENT_NODE){var f=e.getRootNode(),g=hh(e);if(g&&f===e.ownerDocument&&("style"!==e.localName&&"template"!==e.localName||""===jg(e)))qg(e,g);else if(f instanceof ShadowRoot)for(f=ih(e),f!==g&&pg(e,g,f),e=window.ShadyDOM.nativeMethods.querySelectorAll.call(e,":not(."+W.a+")"),g=0;g<e.length;g++){f=e[g];
var h=ih(f);h&&og(f,h)}}}}}
if(!(T||window.ShadyDOM&&window.ShadyDOM.handlesDynamicScoping)){var kh=new MutationObserver(jh),lh=function(a){kh.observe(a,{childList:!0,subtree:!0})};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)lh(document);else{var mh=function(){lh(document.body)};window.HTMLImports?window.HTMLImports.whenReady(mh):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){mh();document.removeEventListener("readystatechange",a)};document.addEventListener("readystatechange",
a)}else mh()})}fh=function(){jh(kh.takeRecords())}}var nh=fh;var oh={};var ph=Promise.resolve();function qh(a){if(a=oh[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1}function rh(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function sh(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a._validating||(a._validating=!0,ph.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a._validating=!1}))};var th=new eh;function Y(){this.G={};this.c=document.documentElement;var a=new tf;a.rules=[];this.f=Lg(this.c,new Kg(a));this.v=!1;this.b=this.a=null}r=Y.prototype;r.flush=function(){nh()};r.Oa=function(a){return Zf(a)};r.$a=function(a){return Xf(a)};r.prepareTemplate=function(a,b,c){this.prepareTemplateDom(a,b);this.prepareTemplateStyles(a,b,c)};
r.prepareTemplateStyles=function(a,b,c){if(!a._prepared){T||bh[b]||(bh[b]=dg(b));a._prepared=!0;a.name=b;a.extends=c;oh[b]=a;var d=jg(a),e=kg(d);c={is:b,extends:c};var f=[];for(var g=a.content.querySelectorAll("style"),h=0;h<g.length;h++){var k=g[h];if(k.hasAttribute("shady-unscoped")){if(!T){var l=k.textContent;Wf.has(l)||(Wf.add(l),l=k.cloneNode(!0),document.head.appendChild(l));k.parentNode.removeChild(k)}}else f.push(k.textContent),k.parentNode.removeChild(k)}f=f.join("").trim();uh(this);if(!e){if(g=
!d)g=Rf.test(f)||Qf.test(f),Rf.lastIndex=0,Qf.lastIndex=0;h=wf(f);g&&V&&this.a&&this.a.transformRules(h,b);a._styleAst=h}g=[];V||(g=Pg(a._styleAst));if(!g.length||V)h=T?a.content:null,b=bh[b]||null,d=rg(c,a._styleAst,null,d,e?f:""),d=d.length?ag(d,c.is,h,b):null,a._style=d;a.a=g}};r.prepareTemplateDom=function(a,b){var c=jg(a);T||"shady"===c||a._domPrepared||(a._domPrepared=!0,mg(a.content,b))};
function vh(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface,a.b.transformCallback=function(b){a.xa(b)},a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.v)&&a.flushCustomStyles()})})}function uh(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim,a.a.invalidCallback=qh);vh(a)}
r.flushCustomStyles=function(){uh(this);if(this.b){var a=this.b.processStyles();if(this.b.enqueued&&!kg(this.f.cssBuild)){if(V){if(!this.f.cssBuild)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&V&&this.a){var d=Zf(c);uh(this);this.a.transformRules(d);c.textContent=Xf(d)}}}else{wh(this,this.c,this.f);for(b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&$g(c,this.f.O);this.v&&this.styleDocument()}this.b.enqueued=!1}}};
r.styleElement=function(a,b){var c=X(a);if(!c){var d=hg(a);c=d.is;d=d.Y;var e=bh[c]||null;c=oh[c];if(c){var f=c._styleAst;var g=c.a;var h=jg(c)}f=new Kg(f,e,g,d,h);c&&Lg(a,f);c=f}a!==this.c&&(this.v=!0);b&&(c.T=c.T||{},Object.assign(c.T,b));if(V){b=c;f=hg(a).is;if(b.T){g=b.T;for(var k in g)null===k?a.style.removeProperty(k):a.style.setProperty(k,g[k])}if(!(!(k=oh[f])&&a!==this.c||k&&""!==jg(k))&&k&&k._style&&!rh(k)){if(rh(k)||k._applyShimValidatingVersion!==k._applyShimNextVersion)uh(this),this.a&&
this.a.transformRules(k._styleAst,f),k._style.textContent=rg(a,b.M),sh(k);T&&(f=a.shadowRoot)&&(f=f.querySelector("style"))&&(f.textContent=rg(a,b.M));b.M=k._styleAst}}else if(k=c,this.flush(),wh(this,a,k),k.c&&k.c.length){b=hg(a).is;c=(f=th.fetch(b,k.O,k.c))?f.styleElement:null;g=k.I;(h=f&&f.I)||(h=this.G[b]=(this.G[b]||0)+1,h=b+"-"+h);k.I=h;h=k.I;d=ah;d=c?c.textContent||"":Xg(d,a,k.O,h);e=X(a);var l=e.a;l&&!T&&l!==c&&(l._useCount--,0>=l._useCount&&l.parentNode&&l.parentNode.removeChild(l));T?e.a?
(e.a.textContent=d,c=e.a):d&&(c=ag(d,h,a.shadowRoot,e.b)):c?c.parentNode||(Ng&&-1<d.indexOf("@media")&&(c.textContent=d),bg(c,null,e.b)):d&&(c=ag(d,h,null,e.b));c&&(c._useCount=c._useCount||0,e.a!=c&&c._useCount++,e.a=c);h=c;T||(c=k.I,e=d=a.getAttribute("class")||"",g&&(e=d.replace(new RegExp("\\s*x-scope\\s*"+g+"\\s*","g")," ")),e+=(e?" ":"")+"x-scope "+c,d!==e&&gg(a,e));f||th.store(b,k.O,h,k.I)}};function xh(a,b){return(b=b.getRootNode().host)?X(b)?b:xh(a,b):a.c}
function wh(a,b,c){a=xh(a,b);var d=X(a);a=Object.create(d.O||null);var e=Wg(b,c.M,c.cssBuild);b=Ug(d.M,b).L;Object.assign(a,e.Qa,b,e.Wa);b=c.T;for(var f in b)if((e=b[f])||0===e)a[f]=e;f=ah;b=Object.getOwnPropertyNames(a);for(e=0;e<b.length;e++)d=b[e],a[d]=Sg(f,a[d],a);c.O=a}r.styleDocument=function(a){this.styleSubtree(this.c,a)};
r.styleSubtree=function(a,b){var c=a.shadowRoot;(c||a===this.c)&&this.styleElement(a,b);if(b=c&&(c.children||c.childNodes))for(a=0;a<b.length;a++)this.styleSubtree(b[a]);else if(a=a.children||a.childNodes)for(b=0;b<a.length;b++)this.styleSubtree(a[b])};
r.xa=function(a){var b=this,c=jg(a);c!==this.f.cssBuild&&(this.f.cssBuild=c);if(!kg(c)){var d=Zf(a);Yf(d,function(a){if(T)Jg(a);else{var d=W;a.selector=a.parsedSelector;Jg(a);a.selector=a.F=ug(d,a,d.c,void 0,void 0)}V&&""===c&&(uh(b),b.a&&b.a.transformRule(a))});V?a.textContent=Xf(d):this.f.M.rules.push(d)}};r.getComputedStyleValue=function(a,b){var c;V||(c=(X(a)||X(xh(this,a))).O[b]);return(c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};
r.Za=function(a,b){var c=a.getRootNode();b=b?b.split(/\s/):[];c=c.host&&c.host.localName;if(!c){var d=a.getAttribute("class");if(d){d=d.split(/\s/);for(var e=0;e<d.length;e++)if(d[e]===W.a){c=d[e+1];break}}}c&&b.push(W.a,c);V||(c=X(a))&&c.I&&b.push(ah.a,c.I);gg(a,b.join(" "))};r.Ia=function(a){return X(a)};r.Ya=function(a,b){og(a,b)};r.ab=function(a,b){og(a,b,!0)};r.Xa=function(a){return ih(a)};r.La=function(a){return hh(a)};Y.prototype.flush=Y.prototype.flush;Y.prototype.prepareTemplate=Y.prototype.prepareTemplate;
Y.prototype.styleElement=Y.prototype.styleElement;Y.prototype.styleDocument=Y.prototype.styleDocument;Y.prototype.styleSubtree=Y.prototype.styleSubtree;Y.prototype.getComputedStyleValue=Y.prototype.getComputedStyleValue;Y.prototype.setElementClass=Y.prototype.Za;Y.prototype._styleInfoForNode=Y.prototype.Ia;Y.prototype.transformCustomStyleForDocument=Y.prototype.xa;Y.prototype.getStyleAst=Y.prototype.Oa;Y.prototype.styleAstToString=Y.prototype.$a;Y.prototype.flushCustomStyles=Y.prototype.flushCustomStyles;
Y.prototype.scopeNode=Y.prototype.Ya;Y.prototype.unscopeNode=Y.prototype.ab;Y.prototype.scopeForNode=Y.prototype.Xa;Y.prototype.currentScopeForNode=Y.prototype.La;Object.defineProperties(Y.prototype,{nativeShadow:{get:function(){return T}},nativeCss:{get:function(){return V}}});var Z=new Y,yh,zh;window.ShadyCSS&&(yh=window.ShadyCSS.ApplyShim,zh=window.ShadyCSS.CustomStyleInterface);
window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplate(a,b,c)},prepareTemplateDom:function(a,b){Z.prepareTemplateDom(a,b)},prepareTemplateStyles:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplateStyles(a,b,c)},styleSubtree:function(a,b){Z.flushCustomStyles();Z.styleSubtree(a,b)},styleElement:function(a){Z.flushCustomStyles();Z.styleElement(a)},styleDocument:function(a){Z.flushCustomStyles();Z.styleDocument(a)},flushCustomStyles:function(){Z.flushCustomStyles()},
getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:V,nativeShadow:T,cssBuild:Pf};yh&&(window.ShadyCSS.ApplyShim=yh);zh&&(window.ShadyCSS.CustomStyleInterface=zh);Window.prototype.Na=!1;
(function(a){function b(a){""==a&&(f.call(this),this.i=!0);return a.toLowerCase()}function c(a){var b=a.charCodeAt(0);return 32<b&&127>b&&-1==[34,35,60,62,63,96].indexOf(b)?a:encodeURIComponent(a)}function d(a){var b=a.charCodeAt(0);return 32<b&&127>b&&-1==[34,35,60,62,96].indexOf(b)?a:encodeURIComponent(a)}function e(a,e,g){function h(a){ba.push(a)}var k=e||"scheme start",w=0,q="",u=!1,R=!1,ba=[];a:for(;(void 0!=a[w-1]||0==w)&&!this.i;){var m=a[w];switch(k){case "scheme start":if(m&&p.test(m))q+=
m.toLowerCase(),k="scheme";else if(e){h("Invalid scheme.");break a}else{q="";k="no scheme";continue}break;case "scheme":if(m&&G.test(m))q+=m.toLowerCase();else if(":"==m){this.h=q;q="";if(e)break a;void 0!==l[this.h]&&(this.D=!0);k="file"==this.h?"relative":this.D&&g&&g.h==this.h?"relative or authority":this.D?"authority first slash":"scheme data"}else if(e){void 0!=m&&h("Code point not allowed in scheme: "+m);break a}else{q="";w=0;k="no scheme";continue}break;case "scheme data":"?"==m?(this.s="?",
k="query"):"#"==m?(this.A="#",k="fragment"):void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.ma+=c(m));break;case "no scheme":if(g&&void 0!==l[g.h]){k="relative";continue}else h("Missing scheme."),f.call(this),this.i=!0;break;case "relative or authority":if("/"==m&&"/"==a[w+1])k="authority ignore slashes";else{h("Expected /, got: "+m);k="relative";continue}break;case "relative":this.D=!0;"file"!=this.h&&(this.h=g.h);if(void 0==m){this.j=g.j;this.o=g.o;this.l=g.l.slice();this.s=g.s;this.u=g.u;this.g=g.g;
break a}else if("/"==m||"\\"==m)"\\"==m&&h("\\ is an invalid code point."),k="relative slash";else if("?"==m)this.j=g.j,this.o=g.o,this.l=g.l.slice(),this.s="?",this.u=g.u,this.g=g.g,k="query";else if("#"==m)this.j=g.j,this.o=g.o,this.l=g.l.slice(),this.s=g.s,this.A="#",this.u=g.u,this.g=g.g,k="fragment";else{k=a[w+1];var z=a[w+2];if("file"!=this.h||!p.test(m)||":"!=k&&"|"!=k||void 0!=z&&"/"!=z&&"\\"!=z&&"?"!=z&&"#"!=z)this.j=g.j,this.o=g.o,this.u=g.u,this.g=g.g,this.l=g.l.slice(),this.l.pop();k=
"relative path";continue}break;case "relative slash":if("/"==m||"\\"==m)"\\"==m&&h("\\ is an invalid code point."),k="file"==this.h?"file host":"authority ignore slashes";else{"file"!=this.h&&(this.j=g.j,this.o=g.o,this.u=g.u,this.g=g.g);k="relative path";continue}break;case "authority first slash":if("/"==m)k="authority second slash";else{h("Expected '/', got: "+m);k="authority ignore slashes";continue}break;case "authority second slash":k="authority ignore slashes";if("/"!=m){h("Expected '/', got: "+
m);continue}break;case "authority ignore slashes":if("/"!=m&&"\\"!=m){k="authority";continue}else h("Expected authority, got: "+m);break;case "authority":if("@"==m){u&&(h("@ already seen."),q+="%40");u=!0;for(m=0;m<q.length;m++)z=q[m],"\t"==z||"\n"==z||"\r"==z?h("Invalid whitespace in authority."):":"==z&&null===this.g?this.g="":(z=c(z),null!==this.g?this.g+=z:this.u+=z);q=""}else if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){w-=q.length;q="";k="host";continue}else q+=m;break;case "file host":if(void 0==
m||"/"==m||"\\"==m||"?"==m||"#"==m){2!=q.length||!p.test(q[0])||":"!=q[1]&&"|"!=q[1]?(0!=q.length&&(this.j=b.call(this,q),q=""),k="relative path start"):k="relative path";continue}else"\t"==m||"\n"==m||"\r"==m?h("Invalid whitespace in file host."):q+=m;break;case "host":case "hostname":if(":"!=m||R)if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m){this.j=b.call(this,q);q="";k="relative path start";if(e)break a;continue}else"\t"!=m&&"\n"!=m&&"\r"!=m?("["==m?R=!0:"]"==m&&(R=!1),q+=m):h("Invalid code point in host/hostname: "+
m);else if(this.j=b.call(this,q),q="",k="port","hostname"==e)break a;break;case "port":if(/[0-9]/.test(m))q+=m;else if(void 0==m||"/"==m||"\\"==m||"?"==m||"#"==m||e){""!=q&&(q=parseInt(q,10),q!=l[this.h]&&(this.o=q+""),q="");if(e)break a;k="relative path start";continue}else"\t"==m||"\n"==m||"\r"==m?h("Invalid code point in port: "+m):(f.call(this),this.i=!0);break;case "relative path start":"\\"==m&&h("'\\' not allowed in path.");k="relative path";if("/"!=m&&"\\"!=m)continue;break;case "relative path":if(void 0!=
m&&"/"!=m&&"\\"!=m&&(e||"?"!=m&&"#"!=m))"\t"!=m&&"\n"!=m&&"\r"!=m&&(q+=c(m));else{"\\"==m&&h("\\ not allowed in relative path.");if(z=n[q.toLowerCase()])q=z;".."==q?(this.l.pop(),"/"!=m&&"\\"!=m&&this.l.push("")):"."==q&&"/"!=m&&"\\"!=m?this.l.push(""):"."!=q&&("file"==this.h&&0==this.l.length&&2==q.length&&p.test(q[0])&&"|"==q[1]&&(q=q[0]+":"),this.l.push(q));q="";"?"==m?(this.s="?",k="query"):"#"==m&&(this.A="#",k="fragment")}break;case "query":e||"#"!=m?void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.s+=
d(m)):(this.A="#",k="fragment");break;case "fragment":void 0!=m&&"\t"!=m&&"\n"!=m&&"\r"!=m&&(this.A+=m)}w++}}function f(){this.u=this.ma=this.h="";this.g=null;this.o=this.j="";this.l=[];this.A=this.s="";this.D=this.i=!1}function g(a,b){void 0===b||b instanceof g||(b=new g(String(b)));this.a=a;f.call(this);a=this.a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g,"");e.call(this,a,null,b)}var h=!1;if(!a.Na)try{var k=new URL("b","http://a");k.pathname="c%20d";h="http://a/c%20d"===k.href}catch(w){}if(!h){var l=
Object.create(null);l.ftp=21;l.file=0;l.gopher=70;l.http=80;l.https=443;l.ws=80;l.wss=443;var n=Object.create(null);n["%2e"]=".";n[".%2e"]="..";n["%2e."]="..";n["%2e%2e"]="..";var p=/[a-zA-Z]/,G=/[a-zA-Z0-9\+\-\.]/;g.prototype={toString:function(){return this.href},get href(){if(this.i)return this.a;var a="";if(""!=this.u||null!=this.g)a=this.u+(null!=this.g?":"+this.g:"")+"@";return this.protocol+(this.D?"//"+a+this.host:"")+this.pathname+this.s+this.A},set href(a){f.call(this);e.call(this,a)},get protocol(){return this.h+
":"},set protocol(a){this.i||e.call(this,a+":","scheme start")},get host(){return this.i?"":this.o?this.j+":"+this.o:this.j},set host(a){!this.i&&this.D&&e.call(this,a,"host")},get hostname(){return this.j},set hostname(a){!this.i&&this.D&&e.call(this,a,"hostname")},get port(){return this.o},set port(a){!this.i&&this.D&&e.call(this,a,"port")},get pathname(){return this.i?"":this.D?"/"+this.l.join("/"):this.ma},set pathname(a){!this.i&&this.D&&(this.l=[],e.call(this,a,"relative path start"))},get search(){return this.i||
!this.s||"?"==this.s?"":this.s},set search(a){!this.i&&this.D&&(this.s="?","?"==a[0]&&(a=a.slice(1)),e.call(this,a,"query"))},get hash(){return this.i||!this.A||"#"==this.A?"":this.A},set hash(a){this.i||(a?(this.A="#","#"==a[0]&&(a=a.slice(1)),e.call(this,a,"fragment")):this.A="")},get origin(){var a;if(this.i||!this.h)return"";switch(this.h){case "data":case "file":case "javascript":case "mailto":return"null"}return(a=this.host)?this.h+"://"+a:""}};var u=a.URL;u&&(g.createObjectURL=function(a){return u.createObjectURL.apply(u,
arguments)},g.revokeObjectURL=function(a){u.revokeObjectURL(a)});a.URL=g}})(window);Object.getOwnPropertyDescriptor(Node.prototype,"baseURI")||Object.defineProperty(Node.prototype,"baseURI",{get:function(){var a=(this.ownerDocument||this).querySelector("base[href]");return a&&a.href||window.location.href},configurable:!0,enumerable:!0});var Ah=document.createElement("style");Ah.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var Bh=document.querySelector("head");Bh.insertBefore(Ah,Bh.firstChild);var Ch=window.customElements,Dh=!1,Eh=null;Ch.polyfillWrapFlushCallback&&Ch.polyfillWrapFlushCallback(function(a){Eh=a;Dh&&a()});function Fh(){window.HTMLTemplateElement.bootstrap&&window.HTMLTemplateElement.bootstrap(window.document);Eh&&Eh();Dh=!0;window.WebComponents.ready=!0;document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))}
"complete"!==document.readyState?(window.addEventListener("load",Fh),window.addEventListener("DOMContentLoaded",function(){window.removeEventListener("load",Fh);Fh()})):Fh();}).call(this);

//# sourceMappingURL=webcomponents-bundle.js.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1), __webpack_require__(7).setImmediate))

/***/ })
/******/ ]);
});