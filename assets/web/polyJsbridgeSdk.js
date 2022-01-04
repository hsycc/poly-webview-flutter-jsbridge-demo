/*
 * @Author: hsycc
 * @Date: 2022-01-04 16:27:03
 * @LastEditTime: 2022-01-04 16:28:08
 * @Description: 
 * 
 */
var PolyJsbridgeSdk;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendModeEnum = exports.defaultConfig = exports.Jsbridge = exports.PolyJsbridgeSdk = void 0;
var sdk_1 = __importDefault(__webpack_require__(/*! ./lib/sdk */ "./lib/sdk.ts"));
exports.PolyJsbridgeSdk = sdk_1.default;
var jsbridge_1 = __importDefault(__webpack_require__(/*! ./lib/jsbridge */ "./lib/jsbridge.ts"));
exports.Jsbridge = jsbridge_1.default;
var config_1 = __webpack_require__(/*! ./lib/config */ "./lib/config.ts");
Object.defineProperty(exports, "defaultConfig", ({ enumerable: true, get: function () { return config_1.defaultConfig; } }));
var type_1 = __webpack_require__(/*! ./lib/type */ "./lib/type.ts");
Object.defineProperty(exports, "SendModeEnum", ({ enumerable: true, get: function () { return type_1.SendModeEnum; } }));
exports["default"] = sdk_1.default;


/***/ }),

/***/ "./lib/config.ts":
/*!***********************!*\
  !*** ./lib/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultConfig = void 0;
exports.defaultConfig = {
    mode: 'channel',
    maxTryTimes: 3,
    isDebug: true,
    protocol: 'poly://',
    JavascriptChannelName: 'PolySdk',
};


/***/ }),

/***/ "./lib/jsbridge.ts":
/*!*************************!*\
  !*** ./lib/jsbridge.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var type_1 = __webpack_require__(/*! ./type */ "./lib/type.ts");
var events_1 = __importDefault(__webpack_require__(/*! events */ "./node_modules/events/events.js"));
var Jsbridge = (function () {
    function Jsbridge(config) {
        this.tryTimes = 0;
        this.event = new events_1.default();
        this.config = config;
        this.isInBrowser = !!(typeof window !== 'undefined');
    }
    Jsbridge.prototype.$call = function (method, payload, hasCallback) {
        var _this = this;
        payload = payload || {};
        if (this.isInBrowser) {
            var that_1 = this;
            return new Promise(function (resolve, reject) {
                var callbackId = hasCallback ? _this.getCallbackId() : '';
                var message = _this.generateMessage(method, payload, callbackId);
                if (that_1.config.isDebug) {
                    console.debug('send', message);
                }
                if (callbackId) {
                    _this.$register(callbackId);
                    _this.$on(callbackId, function (result) {
                        if (that_1.config.isDebug) {
                            console.debug("[" + callbackId + "]:", result);
                        }
                        try {
                            if (result.code === 200) {
                                resolve(result);
                            }
                            else {
                                reject(result);
                            }
                        }
                        catch (error) {
                            reject(error);
                        }
                        finally {
                            _this.$off(callbackId);
                        }
                    });
                }
                _this.sendMessage(message);
            });
        }
        else {
            console.error('does not support poly-jsbridge-sdk');
            return new Promise(function (resolve, reject) {
                reject('does not support poly-jsbridge-sdk');
            });
        }
    };
    Jsbridge.prototype.$on = function (name, func) {
        if (this.event._events[name]) {
            this.$off(name);
        }
        this.event.on(name, func);
        return this;
    };
    Jsbridge.prototype.$off = function (name, func) {
        if (func) {
            this.event.removeListener(name, func);
        }
        else {
            this.event.removeAllListeners(name);
        }
        return this;
    };
    Jsbridge.prototype.$register = function (name) {
        var _this = this;
        var ar = name.split('.');
        var len = ar.length;
        var obj = this;
        var eventName = ar.join('_');
        ar.forEach(function (el, idx) {
            if (idx === len - 1) {
                obj[el] = function (json) {
                    _this.event.emit(eventName, json);
                };
            }
            else {
                obj[el] = obj[el] || {};
                obj = obj[el];
            }
        });
    };
    Jsbridge.prototype.generateMessage = function (method, payload, callbackId) {
        if (this.config.mode === type_1.SendModeEnum.CHANNEL) {
            var message = {
                method: method,
                payload: payload,
            };
            if (callbackId) {
                Object.assign(message, {
                    callbackId: callbackId,
                });
            }
            return JSON.stringify(message);
        }
        else {
            var payloadData = this.encode(payload);
            var message = this.config.protocol.concat(method).concat('?payload=').concat(payloadData);
            if (callbackId) {
                message = message.concat('&callbackId=').concat(callbackId);
            }
            return message;
        }
    };
    Jsbridge.prototype.encode = function (obj) {
        var json = JSON.stringify(obj);
        return encodeURIComponent(json);
    };
    Jsbridge.prototype.decode = function (str) {
        var jsonStr = decodeURIComponent(str);
        return JSON.parse(jsonStr);
    };
    Jsbridge.prototype.getCallbackId = function () {
        var random = parseInt(Math.random() * 10000 + '');
        return 'poly_sdk_callback_' + new Date().getTime() + random;
    };
    Jsbridge.prototype.sendMessage = function (msg) {
        var _this = this;
        var _a;
        if (this.isInBrowser) {
            try {
                if (this.config.mode === type_1.SendModeEnum.CHANNEL) {
                    this.config.JavascriptChannelName === 'window'
                        ?
                            window.postMessage(msg)
                        :
                            window[this.config.JavascriptChannelName].postMessage(msg);
                }
                else {
                    var iframe = document.createElement('IFRAME');
                    iframe.setAttribute('src', msg);
                    document.documentElement.appendChild(iframe);
                    (_a = iframe.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(iframe);
                    iframe = null;
                }
                this.tryTimes = 1;
            }
            catch (error) {
                if (this.tryTimes < this.config.maxTryTimes) {
                    setTimeout(function () {
                        _this.sendMessage(msg);
                        _this.tryTimes = ++_this.tryTimes;
                    }, 1000);
                }
                else {
                    throw new Error("post msg timeout( " + this.config.maxTryTimes + " times): " + msg + " \n , error: " + error);
                }
            }
        }
        else {
            throw new Error('Method not implemented.');
        }
    };
    return Jsbridge;
}());
exports["default"] = Jsbridge;


/***/ }),

/***/ "./lib/sdk.ts":
/*!********************!*\
  !*** ./lib/sdk.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __webpack_require__(/*! ./config */ "./lib/config.ts");
var jsbridge_1 = __importDefault(__webpack_require__(/*! ./jsbridge */ "./lib/jsbridge.ts"));
var PolyJsbridgeSdk = (function () {
    function PolyJsbridgeSdk(config) {
        config = Object.assign(config_1.defaultConfig, config || {});
        var jsbridge = new jsbridge_1.default(config);
        this.$jsbridge = jsbridge;
        this.$on = jsbridge.$on.bind(jsbridge);
        this.$off = jsbridge.$on.bind(jsbridge);
        this.$call = jsbridge.$call.bind(jsbridge);
        this.$register = jsbridge.$register.bind(jsbridge);
        this._init();
    }
    PolyJsbridgeSdk.prototype._init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window.$jsbridge = this.$jsbridge;
                this.$register('log');
                this.$on('log', function (result) {
                    console.log(result);
                });
                return [2];
            });
        });
    };
    PolyJsbridgeSdk.prototype.exitApp = function () {
        return this.$jsbridge.$call('exitApp', {}, false);
    };
    PolyJsbridgeSdk.prototype.toast = function (message, hasCallback) {
        if (hasCallback === void 0) { hasCallback = false; }
        return this.$jsbridge.$call('toast', {
            message: message,
        }, hasCallback);
    };
    PolyJsbridgeSdk.prototype.log = function (message, hasCallback) {
        if (hasCallback === void 0) { hasCallback = false; }
        return this.$jsbridge.$call('log', {
            message: message,
        }, hasCallback);
    };
    PolyJsbridgeSdk.prototype.navigatorTo = function (url, hasCallback) {
        if (hasCallback === void 0) { hasCallback = false; }
        return this.$jsbridge.$call('navigatorTo', {
            url: url,
        }, hasCallback);
    };
    PolyJsbridgeSdk.prototype.navigatorBack = function (url, hasCallback) {
        if (hasCallback === void 0) { hasCallback = false; }
        return this.$jsbridge.$call('navigatorBack', {
            url: url,
        }, hasCallback);
    };
    PolyJsbridgeSdk.prototype.redirectTo = function (url, hasCallback) {
        if (hasCallback === void 0) { hasCallback = false; }
        return this.$jsbridge.$call('redirectTo', {
            url: url,
        }, hasCallback);
    };
    PolyJsbridgeSdk.prototype.getResgiterList = function (hasCallback) {
        if (hasCallback === void 0) { hasCallback = true; }
        return this.$jsbridge.$call('getResgiterList', {}, hasCallback);
    };
    return PolyJsbridgeSdk;
}());
exports["default"] = PolyJsbridgeSdk;


/***/ }),

/***/ "./lib/type.ts":
/*!*********************!*\
  !*** ./lib/type.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendModeEnum = void 0;
var SendModeEnum;
(function (SendModeEnum) {
    SendModeEnum["CHANNEL"] = "channel";
    SendModeEnum["URL"] = "url";
})(SendModeEnum = exports.SendModeEnum || (exports.SendModeEnum = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	PolyJsbridgeSdk = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seUpzYnJpZGdlU2RrLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUztBQUM3QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBLGtDQUFrQyxRQUFRO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMseUJBQXlCO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhEQUE4RCxZQUFZO0FBQzFFO0FBQ0EsOERBQThELFlBQVk7QUFDMUU7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxZQUFZO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6ZUEsa0ZBQXdDO0FBTXRDLDBCQU5LLGFBQWUsQ0FNTDtBQUxqQixpR0FBc0M7QUFNcEMsbUJBTkssa0JBQVEsQ0FNTDtBQUxWLDBFQUE2QztBQU0zQywrRkFOTyxzQkFBYSxRQU1QO0FBTGYsb0VBQWtFO0FBTWhFLDhGQU5PLG1CQUFZLFFBTVA7QUFLZCxxQkFBZSxhQUFlOzs7Ozs7Ozs7Ozs7OztBQ1hqQixxQkFBYSxHQUFXO0lBQ25DLElBQUksRUFBRSxTQUFTO0lBQ2YsV0FBVyxFQUFFLENBQUM7SUFDZCxPQUFPLEVBQUUsSUFBSTtJQUNiLFFBQVEsRUFBRSxTQUFTO0lBQ25CLHFCQUFxQixFQUFFLFNBQVM7Q0FDakMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ1JGLGdFQUE4RDtBQUU5RCxxR0FBa0M7QUFFbEM7SUFLRSxrQkFBWSxNQUFjO1FBSGxCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFJbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGdCQUFZLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFHTSx3QkFBSyxHQUFaLFVBQ0UsTUFBYyxFQUNkLE9BQWdDLEVBQ2hDLFdBQTZCO1FBSC9CLGlCQW1EQztRQTlDQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFLcEIsSUFBTSxNQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWxCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtnQkFDakMsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDM0QsSUFBTSxPQUFPLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNsRSxJQUFJLE1BQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO29CQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDaEM7Z0JBRUQsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsS0FBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0IsS0FBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBQyxNQUFzQjt3QkFDMUMsSUFBSSxNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTs0QkFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFJLFVBQVUsT0FBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3lCQUMzQzt3QkFDRCxJQUFJOzRCQUNGLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7Z0NBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDakI7aUNBQU07Z0NBRUwsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzZCQUNoQjt5QkFDRjt3QkFBQyxPQUFPLEtBQUssRUFBRTs0QkFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQ2Y7Z0NBQVM7NEJBRVIsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzt5QkFDdkI7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7aUJBQ0o7Z0JBRUQsS0FBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDcEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO2dCQUNqQyxNQUFNLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUdNLHNCQUFHLEdBQVYsVUFBVyxJQUFZLEVBQUUsSUFBcUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUdNLHVCQUFJLEdBQVgsVUFBWSxJQUFZLEVBQUUsSUFBc0M7UUFDOUQsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFHTSw0QkFBUyxHQUFoQixVQUFpQixJQUFZO1FBQTdCLGlCQW1CQztRQWxCQyxJQUFNLEVBQUUsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sR0FBRyxHQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDOUIsSUFBSSxHQUFHLEdBQVEsSUFBSSxDQUFDO1FBQ3BCLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFL0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQUUsRUFBRSxHQUFHO1lBQ2pCLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0JBRW5CLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFDLElBQTZCO29CQUN0QyxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLENBQUMsQ0FBQzthQUNIO2lCQUFNO2dCQUVMLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUV4QixHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFRTyxrQ0FBZSxHQUF2QixVQUF3QixNQUFjLEVBQUUsT0FBZ0MsRUFBRSxVQUFtQjtRQUMzRixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLG1CQUFZLENBQUMsT0FBTyxFQUFFO1lBQzdDLElBQU0sT0FBTyxHQUFHO2dCQUNkLE1BQU07Z0JBQ04sT0FBTzthQUNSLENBQUM7WUFFRixJQUFJLFVBQVUsRUFBRTtnQkFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtvQkFDckIsVUFBVTtpQkFDWCxDQUFDLENBQUM7YUFDSjtZQUVELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQzthQUFNO1lBQ0wsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxRixJQUFJLFVBQVUsRUFBRTtnQkFDZCxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDN0Q7WUFFRCxPQUFPLE9BQU8sQ0FBQztTQUNoQjtJQUNILENBQUM7SUFRTyx5QkFBTSxHQUFkLFVBQWUsR0FBNEI7UUFDekMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFRTyx5QkFBTSxHQUFkLFVBQWUsR0FBVztRQUV4QixJQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUtPLGdDQUFhLEdBQXJCO1FBQ0UsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDcEQsT0FBTyxvQkFBb0IsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUM5RCxDQUFDO0lBS00sOEJBQVcsR0FBbEIsVUFBbUIsR0FBVztRQUE5QixpQkFxQ0M7O1FBbkNDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJO2dCQUNGLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssbUJBQVksQ0FBQyxPQUFPLEVBQUU7b0JBRTdDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEtBQUssUUFBUTt3QkFDNUMsQ0FBQzs0QkFDQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQzt3QkFDekIsQ0FBQzs0QkFDQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBR0wsSUFBSSxNQUFNLEdBQXVCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2xFLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNoQyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDN0MsWUFBTSxDQUFDLFVBQVUsMENBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN2QyxNQUFNLEdBQUcsSUFBSSxDQUFDO2lCQUNmO2dCQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2FBQ25CO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBRWQsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO29CQUMzQyxVQUFVLENBQUM7d0JBQ1QsS0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2xDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDVjtxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsaUJBQVksR0FBRyxxQkFBZ0IsS0FBTyxDQUFDLENBQUM7aUJBQ3JHO2FBQ0Y7U0FDRjthQUFNO1lBRUwsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDO0FBRUQscUJBQWUsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeE54QixzRUFBeUM7QUFDekMsNkZBQWtDO0FBR2xDO0lBT0UseUJBQVksTUFBZTtRQUN6QixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxzQkFBYSxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwRCxJQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBS1ksK0JBQUssR0FBbEI7OztnQkFFRSxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQUMsTUFBVztvQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7Ozs7S0FDSjtJQUtNLGlDQUFPLEdBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQVFNLCtCQUFLLEdBQVosVUFBYSxPQUFlLEVBQUUsV0FBcUM7UUFBckMsaURBQXFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQ3pCLE9BQU8sRUFDUDtZQUNFLE9BQU87U0FDUixFQUNELFdBQVcsQ0FDWixDQUFDO0lBQ0osQ0FBQztJQVNNLDZCQUFHLEdBQVYsVUFDRSxPQUF5QyxFQUN6QyxXQUFxQztRQUFyQyxpREFBcUM7UUFFckMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FDekIsS0FBSyxFQUNMO1lBQ0UsT0FBTztTQUNSLEVBQ0QsV0FBVyxDQUNaLENBQUM7SUFDSixDQUFDO0lBUU0scUNBQVcsR0FBbEIsVUFBbUIsR0FBVyxFQUFFLFdBQXFDO1FBQXJDLGlEQUFxQztRQUNuRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUN6QixhQUFhLEVBQ2I7WUFDRSxHQUFHO1NBQ0osRUFDRCxXQUFXLENBQ1osQ0FBQztJQUNKLENBQUM7SUFRTSx1Q0FBYSxHQUFwQixVQUFxQixHQUFXLEVBQUUsV0FBcUM7UUFBckMsaURBQXFDO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQ3pCLGVBQWUsRUFDZjtZQUNFLEdBQUc7U0FDSixFQUNELFdBQVcsQ0FDWixDQUFDO0lBQ0osQ0FBQztJQVFNLG9DQUFVLEdBQWpCLFVBQWtCLEdBQVcsRUFBRSxXQUFxQztRQUFyQyxpREFBcUM7UUFDbEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FDekIsWUFBWSxFQUNaO1lBQ0UsR0FBRztTQUNKLEVBQ0QsV0FBVyxDQUNaLENBQUM7SUFDSixDQUFDO0lBTU0seUNBQWUsR0FBdEIsVUFBdUIsV0FBb0M7UUFBcEMsZ0RBQW9DO1FBQ3pELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUM7QUFHRCxxQkFBZSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdkkvQixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDdEIsbUNBQXFCO0lBQ3JCLDJCQUFhO0FBQ2YsQ0FBQyxFQUhXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBR3ZCOzs7Ozs7O1VDWEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL1tuYW1lXS8uL2luZGV4LnRzIiwid2VicGFjazovL1tuYW1lXS8uL2xpYi9jb25maWcudHMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbGliL2pzYnJpZGdlLnRzIiwid2VicGFjazovL1tuYW1lXS8uL2xpYi9zZGsudHMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbGliL3R5cGUudHMiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUiA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyA/IFJlZmxlY3QgOiBudWxsXG52YXIgUmVmbGVjdEFwcGx5ID0gUiAmJiB0eXBlb2YgUi5hcHBseSA9PT0gJ2Z1bmN0aW9uJ1xuICA/IFIuYXBwbHlcbiAgOiBmdW5jdGlvbiBSZWZsZWN0QXBwbHkodGFyZ2V0LCByZWNlaXZlciwgYXJncykge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfVxuXG52YXIgUmVmbGVjdE93bktleXNcbmlmIChSICYmIHR5cGVvZiBSLm93bktleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVmbGVjdE93bktleXMgPSBSLm93bktleXNcbn0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBQcm9jZXNzRW1pdFdhcm5pbmcod2FybmluZykge1xuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbn1cblxudmFyIE51bWJlcklzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIE51bWJlcklzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgRXZlbnRFbWl0dGVyLmluaXQuY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xubW9kdWxlLmV4cG9ydHMub25jZSA9IG9uY2U7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzQ291bnQgPSAwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcblxuRXZlbnRFbWl0dGVyLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBfZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiBfZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgdmFyIGVyO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApXG4gICAgICBlciA9IGFyZ3NbMF07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21tZW50cyBvbiB0aGUgYHRocm93YCBsaW5lcyBhcmUgaW50ZW50aW9uYWwsIHRoZXkgc2hvd1xuICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH1cbiAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIGVycm9yLicgKyAoZXIgPyAnICgnICsgZXIubWVzc2FnZSArICcpJyA6ICcnKSk7XG4gICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gIH1cblxuICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBSZWZsZWN0QXBwbHkoaGFuZGxlciwgdGhpcywgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDogW2V4aXN0aW5nLCBsaXN0ZW5lcl07XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgfSBlbHNlIGlmIChwcmVwZW5kKSB7XG4gICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhpc3RpbmcucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBtID0gX2dldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgIGlmIChtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtICYmICFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAvLyBObyBlcnJvciBjb2RlIGZvciB0aGlzIHNpbmNlIGl0IGlzIGEgV2FybmluZ1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyAnICsgU3RyaW5nKHR5cGUpICsgJyBsaXN0ZW5lcnMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdCcpO1xuICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICB3LnR5cGUgPSB0eXBlO1xuICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgIFByb2Nlc3NFbWl0V2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmFwcGx5KHRoaXMudGFyZ2V0LCBhcmd1bWVudHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzdGF0ZSA9IHsgZmlyZWQ6IGZhbHNlLCB3cmFwRm46IHVuZGVmaW5lZCwgdGFyZ2V0OiB0YXJnZXQsIHR5cGU6IHR5cGUsIGxpc3RlbmVyOiBsaXN0ZW5lciB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICB0aGlzLm9uKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3BsaWNlT25lKGxpc3QsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50c1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChldmxpc3RlbmVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdW53cmFwID8gW2V2bGlzdGVuZXIubGlzdGVuZXIgfHwgZXZsaXN0ZW5lcl0gOiBbZXZsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHVud3JhcCA/XG4gICAgdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICByZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQgPiAwID8gUmVmbGVjdE93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKVxuICAgIGxpc3RbaW5kZXhdID0gbGlzdFtpbmRleCArIDFdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBvbmNlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBlcnJvckxpc3RlbmVyKGVycikge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihuYW1lLCByZXNvbHZlcik7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcigpIHtcbiAgICAgIGlmICh0eXBlb2YgZW1pdHRlci5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGVycm9yTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgcmVzb2x2ZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICBpZiAobmFtZSAhPT0gJ2Vycm9yJykge1xuICAgICAgYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgZXJyb3JMaXN0ZW5lciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGhhbmRsZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCAnZXJyb3InLCBoYW5kbGVyLCBmbGFncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIGxpc3RlbmVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgZW1pdHRlci5vbmNlKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdHRlci5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFdmVudFRhcmdldCBkb2VzIG5vdCBoYXZlIGBlcnJvcmAgZXZlbnQgc2VtYW50aWNzIGxpa2UgTm9kZVxuICAgIC8vIEV2ZW50RW1pdHRlcnMsIHdlIGRvIG5vdCBsaXN0ZW4gZm9yIGBlcnJvcmAgZXZlbnRzIGhlcmUuXG4gICAgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmN0aW9uIHdyYXBMaXN0ZW5lcihhcmcpIHtcbiAgICAgIC8vIElFIGRvZXMgbm90IGhhdmUgYnVpbHRpbiBgeyBvbmNlOiB0cnVlIH1gIHN1cHBvcnQgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcExpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyKGFyZyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiZW1pdHRlclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBFdmVudEVtaXR0ZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBlbWl0dGVyKTtcbiAgfVxufVxuIiwiLypcbiAqIEBBdXRob3I6IGhzeWNjXG4gKiBARGF0ZTogMjAyMS0xMS0xNyAxMjozMTozN1xuICogQExhc3RFZGl0VGltZTogMjAyMS0xMS0xNyAxMzo1OTozNFxuICogQERlc2NyaXB0aW9uOlxuICpcbiAqL1xuaW1wb3J0IFBvbHlKc2JyaWRnZVNkayBmcm9tICcuL2xpYi9zZGsnO1xuaW1wb3J0IEpzYnJpZGdlIGZyb20gJy4vbGliL2pzYnJpZGdlJztcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tICcuL2xpYi9jb25maWcnO1xuaW1wb3J0IHsgU2VuZE1vZGVFbnVtLCBDbGllbnRSZXNwb25zZSwgQ29uZmlnIH0gZnJvbSAnLi9saWIvdHlwZSc7XG5cbmV4cG9ydCB7XG4gIFBvbHlKc2JyaWRnZVNkayxcbiAgSnNicmlkZ2UsXG4gIGRlZmF1bHRDb25maWcsXG4gIFNlbmRNb2RlRW51bSxcbiAgQ29uZmlnLFxuICBDbGllbnRSZXNwb25zZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBvbHlKc2JyaWRnZVNkayBcbiIsIi8qKlxuICogQGZvcm1hdFxuICogQEF1dGhvcjogaHN5Y2NcbiAqIEBEYXRlOiAyMDIxLTA5LTIxIDE4OjE2OjQ3XG4gKiBATGFzdEVkaXRUaW1lOiAyMDIxLTExLTE2IDAwOjQ5OjQxXG4gKiBARGVzY3JpcHRpb246XG4gKi9cblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi90eXBlJztcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcbiAgbW9kZTogJ2NoYW5uZWwnLCAvLyB1cmxcbiAgbWF4VHJ5VGltZXM6IDMsXG4gIGlzRGVidWc6IHRydWUsXG4gIHByb3RvY29sOiAncG9seTovLycsXG4gIEphdmFzY3JpcHRDaGFubmVsTmFtZTogJ1BvbHlTZGsnLFxufTtcbiIsIi8qKlxuICogQGZvcm1hdFxuICogQEF1dGhvcjogaHN5Y2NcbiAqIEBEYXRlOiAyMDIxLTA5LTIxIDE4OjIyOjE5XG4gKiBATGFzdEVkaXRUaW1lOiAyMDIxLTExLTE4IDE1OjQ2OjAxXG4gKiBARGVzY3JpcHRpb246XG4gKi9cblxuaW1wb3J0IHsgQ29uZmlnLCBDbGllbnRSZXNwb25zZSwgU2VuZE1vZGVFbnVtIH0gZnJvbSAnLi90eXBlJztcblxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuXG5jbGFzcyBKc2JyaWRnZSB7XG4gIHB1YmxpYyBjb25maWc6IENvbmZpZztcbiAgcHJpdmF0ZSB0cnlUaW1lcyA9IDA7XG4gIHByaXZhdGUgaXNJbkJyb3dzZXI6IGJvb2xlYW47XG4gIHByaXZhdGUgZXZlbnQ6IGFueTtcbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWcpIHtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaXNJbkJyb3dzZXIgPSAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyk7XG4gIH1cblxuICAvKiogY2FsbCBtZXNzYWdlIGFuZCBzZW5kIHRvIGNsaWVudCAqL1xuICBwdWJsaWMgJGNhbGwoXG4gICAgbWV0aG9kOiBzdHJpbmcsXG4gICAgcGF5bG9hZDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgaGFzQ2FsbGJhY2s6IGJvb2xlYW4gfCBzdHJpbmcsXG4gICk6IFByb21pc2U8Q2xpZW50UmVzcG9uc2U+IHtcbiAgICBwYXlsb2FkID0gcGF5bG9hZCB8fCB7fTtcbiAgICAvLyBpbiBicm93c2VyXG4gICAgaWYgKHRoaXMuaXNJbkJyb3dzZXIpIHtcbiAgICAgIC8vIFRPRE86IGN1c3RvbSBjYWxsYmFjayBpZCBjYXNlIGNhbGxzIHRoZSByZWdpc3RlcmVkIGZ1bmN0aW9uXG4gICAgICAvLyBpZiAodHlwZW9mIGhhc0NhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gfVxuXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2tJZCA9IGhhc0NhbGxiYWNrID8gdGhpcy5nZXRDYWxsYmFja0lkKCkgOiAnJztcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuZ2VuZXJhdGVNZXNzYWdlKG1ldGhvZCwgcGF5bG9hZCwgY2FsbGJhY2tJZCk7XG4gICAgICAgIGlmICh0aGF0LmNvbmZpZy5pc0RlYnVnKSB7XG4gICAgICAgICAgY29uc29sZS5kZWJ1Zygnc2VuZCcsIG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrSWQpIHtcbiAgICAgICAgICB0aGlzLiRyZWdpc3RlcihjYWxsYmFja0lkKTtcbiAgICAgICAgICB0aGlzLiRvbihjYWxsYmFja0lkLCAocmVzdWx0OiBDbGllbnRSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoYXQuY29uZmlnLmlzRGVidWcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgWyR7Y2FsbGJhY2tJZH1dOmAsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzdGF0dXMgY29kZSBlcnJvclxuICAgICAgICAgICAgICAgIHJlamVjdChyZXN1bHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gdW5zdWJzY3JpYmUgY2FsbGJhY2tJZFxuICAgICAgICAgICAgICB0aGlzLiRvZmYoY2FsbGJhY2tJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2RvZXMgbm90IHN1cHBvcnQgcG9seS1qc2JyaWRnZS1zZGsnKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlamVjdCgnZG9lcyBub3Qgc3VwcG9ydCBwb2x5LWpzYnJpZGdlLXNkaycpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIHN1YnNjcmliZSAqL1xuICBwdWJsaWMgJG9uKG5hbWU6IHN0cmluZywgZnVuYzogKHJlc3VsdDogQ2xpZW50UmVzcG9uc2UpID0+IGFueSk6IGFueSB7XG4gICAgaWYgKHRoaXMuZXZlbnQuX2V2ZW50c1tuYW1lXSkge1xuICAgICAgdGhpcy4kb2ZmKG5hbWUpO1xuICAgIH1cbiAgICB0aGlzLmV2ZW50Lm9uKG5hbWUsIGZ1bmMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIHVuc3Vic2NyaWJlICovXG4gIHB1YmxpYyAkb2ZmKG5hbWU6IHN0cmluZywgZnVuYz86IChyZXN1bHQ6IENsaWVudFJlc3BvbnNlKSA9PiBhbnkpOiBhbnkge1xuICAgIGlmIChmdW5jKSB7XG4gICAgICB0aGlzLmV2ZW50LnJlbW92ZUxpc3RlbmVyKG5hbWUsIGZ1bmMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV2ZW50LnJlbW92ZUFsbExpc3RlbmVycyhuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogcmVnaXN0ZXIgKi9cbiAgcHVibGljICRyZWdpc3RlcihuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBhcjogc3RyaW5nW10gPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgY29uc3QgbGVuOiBudW1iZXIgPSBhci5sZW5ndGg7XG4gICAgbGV0IG9iajogYW55ID0gdGhpcztcbiAgICBjb25zdCBldmVudE5hbWUgPSBhci5qb2luKCdfJyk7XG5cbiAgICBhci5mb3JFYWNoKChlbCwgaWR4KSA9PiB7XG4gICAgICBpZiAoaWR4ID09PSBsZW4gLSAxKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgb2JqW2VsXSA9IChqc29uOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICAgIHRoaXMuZXZlbnQuZW1pdChldmVudE5hbWUsIGpzb24pO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBvYmpbZWxdID0gb2JqW2VsXSB8fCB7fTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBvYmogPSBvYmpbZWxdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBtZXNzYWdlXG4gICAqICAge1wibWV0aG9kXCI6XCJ0b2FzdFwiLFwicGF5bG9hZFwiOntcIm1lc3NhZ2VcIjpcIuS9oOWlvVwifSxcImNhbGxiYWNrSWRcIjpcInBvbHlfc2RrX2NhbGxiYWNrXzE2MzI3MjcyNTIwOTA1NzdcIn1cbiAgICogICBvclxuICAgKiAgIHBvbHk6Ly90b2FzdD9wYXlsb2FkPSU3QiUyMm1lc3NhZ2UlMjIlM0ElMjJzYXklMjBoZWxsbyUyMiU3RD9jYWxsYmFja0lkPXBvbHlfc2RrX2NhbGxiYWNrXzE2MzY5OTc1NTQ1MTI4MFxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZU1lc3NhZ2UobWV0aG9kOiBzdHJpbmcsIHBheWxvYWQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBjYWxsYmFja0lkPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5jb25maWcubW9kZSA9PT0gU2VuZE1vZGVFbnVtLkNIQU5ORUwpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG5cbiAgICAgIGlmIChjYWxsYmFja0lkKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24obWVzc2FnZSwge1xuICAgICAgICAgIGNhbGxiYWNrSWQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBheWxvYWREYXRhID0gdGhpcy5lbmNvZGUocGF5bG9hZCk7XG4gICAgICBsZXQgbWVzc2FnZSA9IHRoaXMuY29uZmlnLnByb3RvY29sLmNvbmNhdChtZXRob2QpLmNvbmNhdCgnP3BheWxvYWQ9JykuY29uY2F0KHBheWxvYWREYXRhKTtcblxuICAgICAgaWYgKGNhbGxiYWNrSWQpIHtcbiAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UuY29uY2F0KCcmY2FsbGJhY2tJZD0nKS5jb25jYXQoY2FsbGJhY2tJZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBlbmNvZGUgdGhlIGRhdGFcbiAgICogUGFyc2UgSmF2YXNjcmlwdCBPYmplY3QgdG8gcGFyYW1zIFN0cmluZ1xuICAgKiBgSlNPTi5zdHJpbmdpZnkoKSAtPiBlbmNvZGVVUklDb21wb25lbnQoKWBcbiAgICovXG4gIHByaXZhdGUgZW5jb2RlKG9iajogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBzdHJpbmcge1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoanNvbik7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogZGVjb2RlIHRoZSBkYXRhXG4gICAqIFBhcnNlIHVybCBwYXJhbXMgZGF0YSB0byBzdHJpbmdcbiAgICogYGRlY29kZVVSSUNvbXBvbmVudCgpIC0+IEpTT04ucGFyc2UoKWBcbiAgICovXG4gIHByaXZhdGUgZGVjb2RlKHN0cjogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICAgIC8vIGNvbnN0IGRlY29kZVVSTCA9IGF0b2Ioc3RyKTtcbiAgICBjb25zdCBqc29uU3RyID0gZGVjb2RlVVJJQ29tcG9uZW50KHN0cik7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoanNvblN0cik7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgcmFuZG9tIHN0cmluZywgYmVnaW4gd2l0aCBgcG9seV9zZGtfY2FsbGJhY2tfW3JhbmRvbV1gXG4gICAqL1xuICBwcml2YXRlIGdldENhbGxiYWNrSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCByYW5kb20gPSBwYXJzZUludChNYXRoLnJhbmRvbSgpICogMTAwMDAgKyAnJyk7XG4gICAgcmV0dXJuICdwb2x5X3Nka19jYWxsYmFja18nICsgbmV3IERhdGUoKS5nZXRUaW1lKCkgKyByYW5kb207XG4gIH1cblxuICAvKipcbiAgICogUG9zdCBtZXNzYWdlIHRvIGNsaWVudFxuICAgKi9cbiAgcHVibGljIHNlbmRNZXNzYWdlKG1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gYnJvd3NlclxuICAgIGlmICh0aGlzLmlzSW5Ccm93c2VyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy5jb25maWcubW9kZSA9PT0gU2VuZE1vZGVFbnVtLkNIQU5ORUwpIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpcy5jb25maWcuSmF2YXNjcmlwdENoYW5uZWxOYW1lID09PSAnd2luZG93J1xuICAgICAgICAgICAgPyAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZShtc2cpXG4gICAgICAgICAgICA6IC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgd2luZG93W3RoaXMuY29uZmlnLkphdmFzY3JpcHRDaGFubmVsTmFtZV0ucG9zdE1lc3NhZ2UobXNnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjcmVhdGUgaWZyYW1lXG4gICAgICAgICAgLy8gY29uc3QgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnRcbiAgICAgICAgICBsZXQgaWZyYW1lOiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJRlJBTUUnKTtcbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCBtc2cpO1xuICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzZXQgdGhlIHRyeVRpbWUgdG8gZmlyc3RcbiAgICAgICAgdGhpcy50cnlUaW1lcyA9IDE7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBwZXIgc2Vjb25kIHdpbGwgYXR0ZW1wdCB0byByZWludm9rZSwgZmFpbGVkIG92ZXIgIG1heFRyeVRpbWVzIHdpbGwgbmV2ZXIgcmVpbnZva2VkIGFnYWluXG4gICAgICAgIGlmICh0aGlzLnRyeVRpbWVzIDwgdGhpcy5jb25maWcubWF4VHJ5VGltZXMpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UobXNnKTtcbiAgICAgICAgICAgIHRoaXMudHJ5VGltZXMgPSArK3RoaXMudHJ5VGltZXM7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBwb3N0IG1zZyB0aW1lb3V0KCAke3RoaXMuY29uZmlnLm1heFRyeVRpbWVzfSB0aW1lcyk6ICR7bXNnfSBcXG4gLCBlcnJvcjogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub2RlanNcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSnNicmlkZ2U7XG4iLCIvKipcbiAqIEBmb3JtYXRcbiAqIEBBdXRob3I6IGhzeWNjXG4gKiBARGF0ZTogMjAyMS0wOS0yMSAxODoxNjozNVxuICogQExhc3RFZGl0VGltZTogMjAyMS0xMS0xOCAxMDo0MToxN1xuICogQERlc2NyaXB0aW9uOlxuICovXG5cbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgSnNicmlkZ2UgZnJvbSAnLi9qc2JyaWRnZSc7XG5pbXBvcnQgdHlwZSB7IENsaWVudFJlc3BvbnNlLCBDb25maWcgfSBmcm9tICcuL3R5cGUnO1xuXG5jbGFzcyBQb2x5SnNicmlkZ2VTZGsge1xuICAkanNicmlkZ2U6IEpzYnJpZGdlO1xuICAkcmVnaXN0ZXI6IChuYW1lOiBzdHJpbmcpID0+IHZvaWQ7XG4gICRvZmY6IChuYW1lOiBzdHJpbmcsIGZ1bmM/OiBhbnkpID0+IGFueTtcbiAgJG9uOiAobmFtZTogc3RyaW5nLCBmdW5jOiBhbnkpID0+IGFueTtcbiAgJGNhbGw6IChtZXRob2Q6IHN0cmluZywgcGF5bG9hZDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGhhc0NhbGxiYWNrOiBib29sZWFuIHwgc3RyaW5nKSA9PiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoY29uZmlnPzogQ29uZmlnKSB7XG4gICAgY29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q29uZmlnLCBjb25maWcgfHwge30pO1xuICAgIGNvbnN0IGpzYnJpZGdlID0gbmV3IEpzYnJpZGdlKGNvbmZpZyk7XG4gICAgdGhpcy4kanNicmlkZ2UgPSBqc2JyaWRnZTtcbiAgICB0aGlzLiRvbiA9IGpzYnJpZGdlLiRvbi5iaW5kKGpzYnJpZGdlKTtcbiAgICB0aGlzLiRvZmYgPSBqc2JyaWRnZS4kb24uYmluZChqc2JyaWRnZSk7XG4gICAgdGhpcy4kY2FsbCA9IGpzYnJpZGdlLiRjYWxsLmJpbmQoanNicmlkZ2UpO1xuICAgIHRoaXMuJHJlZ2lzdGVyID0ganNicmlkZ2UuJHJlZ2lzdGVyLmJpbmQoanNicmlkZ2UpO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgX2luaXQgcmVnaXN0ZXIgZnVuY3Rpb24gdG8gYXBwIGNhbGwuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgX2luaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdpbmRvdy4kanNicmlkZ2UgPSB0aGlzLiRqc2JyaWRnZTtcbiAgICB0aGlzLiRyZWdpc3RlcignbG9nJyk7XG4gICAgdGhpcy4kb24oJ2xvZycsIChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBleGl0ICBhcHBcbiAgICovXG4gIHB1YmxpYyBleGl0QXBwKCk6IFByb21pc2U8Q2xpZW50UmVzcG9uc2U+IHtcbiAgICByZXR1cm4gdGhpcy4kanNicmlkZ2UuJGNhbGwoJ2V4aXRBcHAnLCB7fSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIGFwcCB0b2FzdFxuICAgKlxuICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgKiBAcGFyYW0gaGFzQ2FsbGJhY2tcbiAgICovXG4gIHB1YmxpYyB0b2FzdChtZXNzYWdlOiBzdHJpbmcsIGhhc0NhbGxiYWNrOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2UpOiBQcm9taXNlPENsaWVudFJlc3BvbnNlPiB7XG4gICAgcmV0dXJuIHRoaXMuJGpzYnJpZGdlLiRjYWxsKFxuICAgICAgJ3RvYXN0JyxcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgIH0sXG4gICAgICBoYXNDYWxsYmFjayxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHByaW50IGxvZyBpbiBhcHBcbiAgICpcbiAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICogQHBhcmFtIGhhc0NhbGxiYWNrXG4gICAqL1xuXG4gIHB1YmxpYyBsb2coXG4gICAgbWVzc2FnZTogc3RyaW5nIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgaGFzQ2FsbGJhY2s6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZSxcbiAgKTogUHJvbWlzZTxDbGllbnRSZXNwb25zZT4gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy4kanNicmlkZ2UuJGNhbGwoXG4gICAgICAnbG9nJyxcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgIH0sXG4gICAgICBoYXNDYWxsYmFjayxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIGFwcCBuYXZpZ2F0b3IgdG9cbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gaGFzQ2FsbGJhY2tcbiAgICovXG4gIHB1YmxpYyBuYXZpZ2F0b3JUbyh1cmw6IHN0cmluZywgaGFzQ2FsbGJhY2s6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZSk6IFByb21pc2U8Q2xpZW50UmVzcG9uc2U+IHtcbiAgICByZXR1cm4gdGhpcy4kanNicmlkZ2UuJGNhbGwoXG4gICAgICAnbmF2aWdhdG9yVG8nLFxuICAgICAge1xuICAgICAgICB1cmwsXG4gICAgICB9LFxuICAgICAgaGFzQ2FsbGJhY2ssXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhcHAgbmF2aWdhdG9yIGJhY2tcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW1cbiAgICovXG4gIHB1YmxpYyBuYXZpZ2F0b3JCYWNrKHVybDogc3RyaW5nLCBoYXNDYWxsYmFjazogYm9vbGVhbiB8IHN0cmluZyA9IGZhbHNlKTogUHJvbWlzZTxDbGllbnRSZXNwb25zZT4ge1xuICAgIHJldHVybiB0aGlzLiRqc2JyaWRnZS4kY2FsbChcbiAgICAgICduYXZpZ2F0b3JCYWNrJyxcbiAgICAgIHtcbiAgICAgICAgdXJsLFxuICAgICAgfSxcbiAgICAgIGhhc0NhbGxiYWNrLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogcmVkaXJlYyBjdXJyZW50IGFwcCBwYWdlIHRvIHVybFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBoYXNDYWxsYmFja1xuICAgKi9cbiAgcHVibGljIHJlZGlyZWN0VG8odXJsOiBzdHJpbmcsIGhhc0NhbGxiYWNrOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2UpOiBQcm9taXNlPENsaWVudFJlc3BvbnNlPiB7XG4gICAgcmV0dXJuIHRoaXMuJGpzYnJpZGdlLiRjYWxsKFxuICAgICAgJ3JlZGlyZWN0VG8nLFxuICAgICAge1xuICAgICAgICB1cmwsXG4gICAgICB9LFxuICAgICAgaGFzQ2FsbGJhY2ssXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgYXBwIHJlc2dpdGVyIGxpc3RcbiAgICpcbiAgICovXG4gIHB1YmxpYyBnZXRSZXNnaXRlckxpc3QoaGFzQ2FsbGJhY2s6IGJvb2xlYW4gfCBzdHJpbmcgPSB0cnVlKTogUHJvbWlzZTxDbGllbnRSZXNwb25zZT4ge1xuICAgIHJldHVybiB0aGlzLiRqc2JyaWRnZS4kY2FsbCgnZ2V0UmVzZ2l0ZXJMaXN0Jywge30sIGhhc0NhbGxiYWNrKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSB7IFBvbHlKc2JyaWRnZVNkayB9O1xuZXhwb3J0IGRlZmF1bHQgUG9seUpzYnJpZGdlU2RrO1xuIiwiLyoqXG4gKiBAZm9ybWF0XG4gKiBAQXV0aG9yOiBoc3ljY1xuICogQERhdGU6IDIwMjEtMDktMjEgMTg6MTY6NThcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjEtMTEtMTYgMDA6NDg6MjlcbiAqIEBEZXNjcmlwdGlvbjpcbiAqL1xuXG5leHBvcnQgZW51bSBTZW5kTW9kZUVudW0ge1xuICAnQ0hBTk5FTCcgPSAnY2hhbm5lbCcsXG4gICdVUkwnID0gJ3VybCcsXG59XG5cbi8qKiBpbml0IHBhcmFtICovXG5leHBvcnQgdHlwZSBDb25maWcgPSB7XG4gIG1vZGU/OiAnY2hhbm5lbCcgfCAndXJsJztcblxuICAvKiogTWF4aW11bSBudW1iZXIgb2YgcmVxdWVzdHMgKi9cbiAgbWF4VHJ5VGltZXM6IG51bWJlcjtcblxuICAvKiogZGVidWcgbW9kZSAqL1xuICBpc0RlYnVnPzogYm9vbGVhbjtcblxuICAvKiogcHJvdG9jb2wgKi9cbiAgcHJvdG9jb2w6IHN0cmluZztcblxuICAvKiogbmF0aXZlIGNoYW5uZWwgbmFtZSAqL1xuICBKYXZhc2NyaXB0Q2hhbm5lbE5hbWU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIENsaWVudFJlc3BvbnNlID0ge1xuICAvKiogc3RhdHVzIGNvZGUgKi9cbiAgY29kZTogbnVtYmVyO1xuXG4gIC8qKiBjYWxsYmFjayBkYXRhICovXG4gIGRhdGE/OiBhbnk7XG5cbiAgLyoqIGNhbGxiYWNrIG1lc3NhZ2UgKi9cbiAgbWVzc2FnZTogc3RyaW5nO1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9