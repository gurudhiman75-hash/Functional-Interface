var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b2) => (typeof require !== "undefined" ? require : a)[b2]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except2, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except2)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-helpers.js
var require_err_helpers = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-helpers.js"(exports, module) {
    "use strict";
    var isErrorLike = (err) => {
      return err && typeof err.message === "string";
    };
    var getErrorCause = (err) => {
      if (!err) return;
      const cause = err.cause;
      if (typeof cause === "function") {
        const causeResult = err.cause();
        return isErrorLike(causeResult) ? causeResult : void 0;
      } else {
        return isErrorLike(cause) ? cause : void 0;
      }
    };
    var _stackWithCauses = (err, seen) => {
      if (!isErrorLike(err)) return "";
      const stack = err.stack || "";
      if (seen.has(err)) {
        return stack + "\ncauses have become circular...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        return stack + "\ncaused by: " + _stackWithCauses(cause, seen);
      } else {
        return stack;
      }
    };
    var stackWithCauses = (err) => _stackWithCauses(err, /* @__PURE__ */ new Set());
    var _messageWithCauses = (err, seen, skip) => {
      if (!isErrorLike(err)) return "";
      const message = skip ? "" : err.message || "";
      if (seen.has(err)) {
        return message + ": ...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        const skipIfVErrorStyleCause = typeof err.cause === "function";
        return message + (skipIfVErrorStyleCause ? "" : ": ") + _messageWithCauses(cause, seen, skipIfVErrorStyleCause);
      } else {
        return message;
      }
    };
    var messageWithCauses = (err) => _messageWithCauses(err, /* @__PURE__ */ new Set());
    module.exports = {
      isErrorLike,
      getErrorCause,
      stackWithCauses,
      messageWithCauses
    };
  }
});

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-proto.js
var require_err_proto = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-proto.js"(exports, module) {
    "use strict";
    var seen = /* @__PURE__ */ Symbol("circular-ref-tag");
    var rawSymbol = /* @__PURE__ */ Symbol("pino-raw-err-ref");
    var pinoErrProto = Object.create({}, {
      type: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      message: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      stack: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      aggregateErrors: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoErrProto, rawSymbol, {
      writable: true,
      value: {}
    });
    module.exports = {
      pinoErrProto,
      pinoErrorSymbols: {
        seen,
        rawSymbol
      }
    };
  }
});

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err.js
var require_err = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err.js"(exports, module) {
    "use strict";
    module.exports = errSerializer;
    var { messageWithCauses, stackWithCauses, isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = messageWithCauses(err);
      _err.stack = stackWithCauses(err);
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errSerializer(err2));
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (key !== "cause" && !Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-with-cause.js
var require_err_with_cause = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-with-cause.js"(exports, module) {
    "use strict";
    module.exports = errWithCauseSerializer;
    var { isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errWithCauseSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = err.message;
      _err.stack = err.stack;
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errWithCauseSerializer(err2));
      }
      if (isErrorLike(err.cause) && !Object.prototype.hasOwnProperty.call(err.cause, seen)) {
        _err.cause = errWithCauseSerializer(err.cause);
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (!Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errWithCauseSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/req.js
var require_req = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/req.js"(exports, module) {
    "use strict";
    module.exports = {
      mapHttpRequest,
      reqSerializer
    };
    var rawSymbol = /* @__PURE__ */ Symbol("pino-raw-req-ref");
    var pinoReqProto = Object.create({}, {
      id: {
        enumerable: true,
        writable: true,
        value: ""
      },
      method: {
        enumerable: true,
        writable: true,
        value: ""
      },
      url: {
        enumerable: true,
        writable: true,
        value: ""
      },
      query: {
        enumerable: true,
        writable: true,
        value: ""
      },
      params: {
        enumerable: true,
        writable: true,
        value: ""
      },
      headers: {
        enumerable: true,
        writable: true,
        value: {}
      },
      remoteAddress: {
        enumerable: true,
        writable: true,
        value: ""
      },
      remotePort: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoReqProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function reqSerializer(req) {
      const connection2 = req.info || req.socket;
      const _req = Object.create(pinoReqProto);
      _req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
      _req.method = req.method;
      if (req.originalUrl) {
        _req.url = req.originalUrl;
      } else {
        const path = req.path;
        _req.url = typeof path === "string" ? path : req.url ? req.url.path || req.url : void 0;
      }
      if (req.query) {
        _req.query = req.query;
      }
      if (req.params) {
        _req.params = req.params;
      }
      _req.headers = req.headers;
      _req.remoteAddress = connection2 && connection2.remoteAddress;
      _req.remotePort = connection2 && connection2.remotePort;
      _req.raw = req.raw || req;
      return _req;
    }
    function mapHttpRequest(req) {
      return {
        req: reqSerializer(req)
      };
    }
  }
});

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/res.js
var require_res = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/res.js"(exports, module) {
    "use strict";
    module.exports = {
      mapHttpResponse,
      resSerializer
    };
    var rawSymbol = /* @__PURE__ */ Symbol("pino-raw-res-ref");
    var pinoResProto = Object.create({}, {
      statusCode: {
        enumerable: true,
        writable: true,
        value: 0
      },
      headers: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoResProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function resSerializer(res) {
      const _res = Object.create(pinoResProto);
      _res.statusCode = res.headersSent ? res.statusCode : null;
      _res.headers = res.getHeaders ? res.getHeaders() : res._headers;
      _res.raw = res;
      return _res;
    }
    function mapHttpResponse(res) {
      return {
        res: resSerializer(res)
      };
    }
  }
});

// ../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = __commonJS({
  "../../node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/index.js"(exports, module) {
    "use strict";
    var errSerializer = require_err();
    var errWithCauseSerializer = require_err_with_cause();
    var reqSerializers = require_req();
    var resSerializers = require_res();
    module.exports = {
      err: errSerializer,
      errWithCause: errWithCauseSerializer,
      mapHttpRequest: reqSerializers.mapHttpRequest,
      mapHttpResponse: resSerializers.mapHttpResponse,
      req: reqSerializers.reqSerializer,
      res: resSerializers.resSerializer,
      wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
        if (customSerializer === errSerializer) return customSerializer;
        return function wrapErrSerializer(err) {
          return customSerializer(errSerializer(err));
        };
      },
      wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
        if (customSerializer === reqSerializers.reqSerializer) return customSerializer;
        return function wrappedReqSerializer(req) {
          return customSerializer(reqSerializers.reqSerializer(req));
        };
      },
      wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
        if (customSerializer === resSerializers.resSerializer) return customSerializer;
        return function wrappedResSerializer(res) {
          return customSerializer(resSerializers.resSerializer(res));
        };
      }
    };
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/caller.js
var require_caller = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/caller.js"(exports, module) {
    "use strict";
    function noOpPrepareStackTrace(_, stack) {
      return stack;
    }
    module.exports = function getCallers() {
      const originalPrepare = Error.prepareStackTrace;
      Error.prepareStackTrace = noOpPrepareStackTrace;
      const stack = new Error().stack;
      Error.prepareStackTrace = originalPrepare;
      if (!Array.isArray(stack)) {
        return void 0;
      }
      const entries = stack.slice(2);
      const fileNames = [];
      for (const entry of entries) {
        if (!entry) {
          continue;
        }
        fileNames.push(entry.getFileName());
      }
      return fileNames;
    };
  }
});

// ../../node_modules/.pnpm/@pinojs+redact@0.4.0/node_modules/@pinojs/redact/index.js
var require_redact = __commonJS({
  "../../node_modules/.pnpm/@pinojs+redact@0.4.0/node_modules/@pinojs/redact/index.js"(exports, module) {
    "use strict";
    function deepClone(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof Array) {
        const cloned = [];
        for (let i = 0; i < obj.length; i++) {
          cloned[i] = deepClone(obj[i]);
        }
        return cloned;
      }
      if (typeof obj === "object") {
        const cloned = Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
          }
        }
        return cloned;
      }
      return obj;
    }
    function parsePath(path) {
      const parts = [];
      let current = "";
      let inBrackets = false;
      let inQuotes = false;
      let quoteChar = "";
      for (let i = 0; i < path.length; i++) {
        const char2 = path[i];
        if (!inBrackets && char2 === ".") {
          if (current) {
            parts.push(current);
            current = "";
          }
        } else if (char2 === "[") {
          if (current) {
            parts.push(current);
            current = "";
          }
          inBrackets = true;
        } else if (char2 === "]" && inBrackets) {
          parts.push(current);
          current = "";
          inBrackets = false;
          inQuotes = false;
        } else if ((char2 === '"' || char2 === "'") && inBrackets) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char2;
          } else if (char2 === quoteChar) {
            inQuotes = false;
            quoteChar = "";
          } else {
            current += char2;
          }
        } else {
          current += char2;
        }
      }
      if (current) {
        parts.push(current);
      }
      return parts;
    }
    function setValue(obj, parts, value) {
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (typeof current !== "object" || current === null || !(key in current)) {
          return false;
        }
        if (typeof current[key] !== "object" || current[key] === null) {
          return false;
        }
        current = current[key];
      }
      const lastKey = parts[parts.length - 1];
      if (lastKey === "*") {
        if (Array.isArray(current)) {
          for (let i = 0; i < current.length; i++) {
            current[i] = value;
          }
        } else if (typeof current === "object" && current !== null) {
          for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
              current[key] = value;
            }
          }
        }
      } else {
        if (typeof current === "object" && current !== null && lastKey in current && Object.prototype.hasOwnProperty.call(current, lastKey)) {
          current[lastKey] = value;
        }
      }
      return true;
    }
    function removeKey(obj, parts) {
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (typeof current !== "object" || current === null || !(key in current)) {
          return false;
        }
        if (typeof current[key] !== "object" || current[key] === null) {
          return false;
        }
        current = current[key];
      }
      const lastKey = parts[parts.length - 1];
      if (lastKey === "*") {
        if (Array.isArray(current)) {
          for (let i = 0; i < current.length; i++) {
            current[i] = void 0;
          }
        } else if (typeof current === "object" && current !== null) {
          for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
              delete current[key];
            }
          }
        }
      } else {
        if (typeof current === "object" && current !== null && lastKey in current && Object.prototype.hasOwnProperty.call(current, lastKey)) {
          delete current[lastKey];
        }
      }
      return true;
    }
    var PATH_NOT_FOUND = /* @__PURE__ */ Symbol("PATH_NOT_FOUND");
    function getValueIfExists(obj, parts) {
      let current = obj;
      for (const part of parts) {
        if (current === null || current === void 0) {
          return PATH_NOT_FOUND;
        }
        if (typeof current !== "object" || current === null) {
          return PATH_NOT_FOUND;
        }
        if (!(part in current)) {
          return PATH_NOT_FOUND;
        }
        current = current[part];
      }
      return current;
    }
    function getValue(obj, parts) {
      let current = obj;
      for (const part of parts) {
        if (current === null || current === void 0) {
          return void 0;
        }
        if (typeof current !== "object" || current === null) {
          return void 0;
        }
        current = current[part];
      }
      return current;
    }
    function redactPaths(obj, paths, censor, remove = false) {
      for (const path of paths) {
        const parts = parsePath(path);
        if (parts.includes("*")) {
          redactWildcardPath(obj, parts, censor, path, remove);
        } else {
          if (remove) {
            removeKey(obj, parts);
          } else {
            const value = getValueIfExists(obj, parts);
            if (value === PATH_NOT_FOUND) {
              continue;
            }
            const actualCensor = typeof censor === "function" ? censor(value, parts) : censor;
            setValue(obj, parts, actualCensor);
          }
        }
      }
    }
    function redactWildcardPath(obj, parts, censor, originalPath, remove = false) {
      const wildcardIndex = parts.indexOf("*");
      if (wildcardIndex === parts.length - 1) {
        const parentParts = parts.slice(0, -1);
        let current = obj;
        for (const part of parentParts) {
          if (current === null || current === void 0) return;
          if (typeof current !== "object" || current === null) return;
          current = current[part];
        }
        if (Array.isArray(current)) {
          if (remove) {
            for (let i = 0; i < current.length; i++) {
              current[i] = void 0;
            }
          } else {
            for (let i = 0; i < current.length; i++) {
              const indexPath = [...parentParts, i.toString()];
              const actualCensor = typeof censor === "function" ? censor(current[i], indexPath) : censor;
              current[i] = actualCensor;
            }
          }
        } else if (typeof current === "object" && current !== null) {
          if (remove) {
            const keysToDelete = [];
            for (const key in current) {
              if (Object.prototype.hasOwnProperty.call(current, key)) {
                keysToDelete.push(key);
              }
            }
            for (const key of keysToDelete) {
              delete current[key];
            }
          } else {
            for (const key in current) {
              const keyPath = [...parentParts, key];
              const actualCensor = typeof censor === "function" ? censor(current[key], keyPath) : censor;
              current[key] = actualCensor;
            }
          }
        }
      } else {
        redactIntermediateWildcard(obj, parts, censor, wildcardIndex, originalPath, remove);
      }
    }
    function redactIntermediateWildcard(obj, parts, censor, wildcardIndex, originalPath, remove = false) {
      const beforeWildcard = parts.slice(0, wildcardIndex);
      const afterWildcard = parts.slice(wildcardIndex + 1);
      const pathArray = [];
      function traverse(current, pathLength) {
        if (pathLength === beforeWildcard.length) {
          if (Array.isArray(current)) {
            for (let i = 0; i < current.length; i++) {
              pathArray[pathLength] = i.toString();
              traverse(current[i], pathLength + 1);
            }
          } else if (typeof current === "object" && current !== null) {
            for (const key in current) {
              pathArray[pathLength] = key;
              traverse(current[key], pathLength + 1);
            }
          }
        } else if (pathLength < beforeWildcard.length) {
          const nextKey = beforeWildcard[pathLength];
          if (current && typeof current === "object" && current !== null && nextKey in current) {
            pathArray[pathLength] = nextKey;
            traverse(current[nextKey], pathLength + 1);
          }
        } else {
          if (afterWildcard.includes("*")) {
            const wrappedCensor = typeof censor === "function" ? (value, path) => {
              const fullPath = [...pathArray.slice(0, pathLength), ...path];
              return censor(value, fullPath);
            } : censor;
            redactWildcardPath(current, afterWildcard, wrappedCensor, originalPath, remove);
          } else {
            if (remove) {
              removeKey(current, afterWildcard);
            } else {
              const actualCensor = typeof censor === "function" ? censor(getValue(current, afterWildcard), [...pathArray.slice(0, pathLength), ...afterWildcard]) : censor;
              setValue(current, afterWildcard, actualCensor);
            }
          }
        }
      }
      if (beforeWildcard.length === 0) {
        traverse(obj, 0);
      } else {
        let current = obj;
        for (let i = 0; i < beforeWildcard.length; i++) {
          const part = beforeWildcard[i];
          if (current === null || current === void 0) return;
          if (typeof current !== "object" || current === null) return;
          current = current[part];
          pathArray[i] = part;
        }
        if (current !== null && current !== void 0) {
          traverse(current, beforeWildcard.length);
        }
      }
    }
    function buildPathStructure(pathsToClone) {
      if (pathsToClone.length === 0) {
        return null;
      }
      const pathStructure = /* @__PURE__ */ new Map();
      for (const path of pathsToClone) {
        const parts = parsePath(path);
        let current = pathStructure;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!current.has(part)) {
            current.set(part, /* @__PURE__ */ new Map());
          }
          current = current.get(part);
        }
      }
      return pathStructure;
    }
    function selectiveClone(obj, pathStructure) {
      if (!pathStructure) {
        return obj;
      }
      function cloneSelectively(source, pathMap, depth = 0) {
        if (!pathMap || pathMap.size === 0) {
          return source;
        }
        if (source === null || typeof source !== "object") {
          return source;
        }
        if (source instanceof Date) {
          return new Date(source.getTime());
        }
        if (Array.isArray(source)) {
          const cloned2 = [];
          for (let i = 0; i < source.length; i++) {
            const indexStr = i.toString();
            if (pathMap.has(indexStr) || pathMap.has("*")) {
              cloned2[i] = cloneSelectively(source[i], pathMap.get(indexStr) || pathMap.get("*"));
            } else {
              cloned2[i] = source[i];
            }
          }
          return cloned2;
        }
        const cloned = Object.create(Object.getPrototypeOf(source));
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (pathMap.has(key) || pathMap.has("*")) {
              cloned[key] = cloneSelectively(source[key], pathMap.get(key) || pathMap.get("*"));
            } else {
              cloned[key] = source[key];
            }
          }
        }
        return cloned;
      }
      return cloneSelectively(obj, pathStructure);
    }
    function validatePath(path) {
      if (typeof path !== "string") {
        throw new Error("Paths must be (non-empty) strings");
      }
      if (path === "") {
        throw new Error("Invalid redaction path ()");
      }
      if (path.includes("..")) {
        throw new Error(`Invalid redaction path (${path})`);
      }
      if (path.includes(",")) {
        throw new Error(`Invalid redaction path (${path})`);
      }
      let bracketCount = 0;
      let inQuotes = false;
      let quoteChar = "";
      for (let i = 0; i < path.length; i++) {
        const char2 = path[i];
        if ((char2 === '"' || char2 === "'") && bracketCount > 0) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char2;
          } else if (char2 === quoteChar) {
            inQuotes = false;
            quoteChar = "";
          }
        } else if (char2 === "[" && !inQuotes) {
          bracketCount++;
        } else if (char2 === "]" && !inQuotes) {
          bracketCount--;
          if (bracketCount < 0) {
            throw new Error(`Invalid redaction path (${path})`);
          }
        }
      }
      if (bracketCount !== 0) {
        throw new Error(`Invalid redaction path (${path})`);
      }
    }
    function validatePaths(paths) {
      if (!Array.isArray(paths)) {
        throw new TypeError("paths must be an array");
      }
      for (const path of paths) {
        validatePath(path);
      }
    }
    function slowRedact(options = {}) {
      const {
        paths = [],
        censor = "[REDACTED]",
        serialize = JSON.stringify,
        strict = true,
        remove = false
      } = options;
      validatePaths(paths);
      const pathStructure = buildPathStructure(paths);
      return function redact(obj) {
        if (strict && (obj === null || typeof obj !== "object")) {
          if (obj === null || obj === void 0) {
            return serialize ? serialize(obj) : obj;
          }
          if (typeof obj !== "object") {
            return serialize ? serialize(obj) : obj;
          }
        }
        const cloned = selectiveClone(obj, pathStructure);
        const original = obj;
        let actualCensor = censor;
        if (typeof censor === "function") {
          actualCensor = censor;
        }
        redactPaths(cloned, paths, actualCensor, remove);
        if (serialize === false) {
          cloned.restore = function() {
            return deepClone(original);
          };
          return cloned;
        }
        if (typeof serialize === "function") {
          return serialize(cloned);
        }
        return JSON.stringify(cloned);
      };
    }
    module.exports = slowRedact;
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/symbols.js
var require_symbols = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/symbols.js"(exports, module) {
    "use strict";
    var setLevelSym = /* @__PURE__ */ Symbol("pino.setLevel");
    var getLevelSym = /* @__PURE__ */ Symbol("pino.getLevel");
    var levelValSym = /* @__PURE__ */ Symbol("pino.levelVal");
    var levelCompSym = /* @__PURE__ */ Symbol("pino.levelComp");
    var useLevelLabelsSym = /* @__PURE__ */ Symbol("pino.useLevelLabels");
    var useOnlyCustomLevelsSym = /* @__PURE__ */ Symbol("pino.useOnlyCustomLevels");
    var mixinSym = /* @__PURE__ */ Symbol("pino.mixin");
    var lsCacheSym = /* @__PURE__ */ Symbol("pino.lsCache");
    var chindingsSym = /* @__PURE__ */ Symbol("pino.chindings");
    var asJsonSym = /* @__PURE__ */ Symbol("pino.asJson");
    var writeSym = /* @__PURE__ */ Symbol("pino.write");
    var redactFmtSym = /* @__PURE__ */ Symbol("pino.redactFmt");
    var timeSym = /* @__PURE__ */ Symbol("pino.time");
    var timeSliceIndexSym = /* @__PURE__ */ Symbol("pino.timeSliceIndex");
    var streamSym = /* @__PURE__ */ Symbol("pino.stream");
    var stringifySym = /* @__PURE__ */ Symbol("pino.stringify");
    var stringifySafeSym = /* @__PURE__ */ Symbol("pino.stringifySafe");
    var stringifiersSym = /* @__PURE__ */ Symbol("pino.stringifiers");
    var endSym = /* @__PURE__ */ Symbol("pino.end");
    var formatOptsSym = /* @__PURE__ */ Symbol("pino.formatOpts");
    var messageKeySym = /* @__PURE__ */ Symbol("pino.messageKey");
    var errorKeySym = /* @__PURE__ */ Symbol("pino.errorKey");
    var nestedKeySym = /* @__PURE__ */ Symbol("pino.nestedKey");
    var nestedKeyStrSym = /* @__PURE__ */ Symbol("pino.nestedKeyStr");
    var mixinMergeStrategySym = /* @__PURE__ */ Symbol("pino.mixinMergeStrategy");
    var msgPrefixSym = /* @__PURE__ */ Symbol("pino.msgPrefix");
    var wildcardFirstSym = /* @__PURE__ */ Symbol("pino.wildcardFirst");
    var serializersSym = /* @__PURE__ */ Symbol.for("pino.serializers");
    var formattersSym = /* @__PURE__ */ Symbol.for("pino.formatters");
    var hooksSym = /* @__PURE__ */ Symbol.for("pino.hooks");
    var needsMetadataGsym = /* @__PURE__ */ Symbol.for("pino.metadata");
    module.exports = {
      setLevelSym,
      getLevelSym,
      levelValSym,
      levelCompSym,
      useLevelLabelsSym,
      mixinSym,
      lsCacheSym,
      chindingsSym,
      asJsonSym,
      writeSym,
      serializersSym,
      redactFmtSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      wildcardFirstSym,
      needsMetadataGsym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    };
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/redaction.js
var require_redaction = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/redaction.js"(exports, module) {
    "use strict";
    var Redact = require_redact();
    var { redactFmtSym, wildcardFirstSym } = require_symbols();
    var rx = /[^.[\]]+|\[([^[\]]*?)\]/g;
    var CENSOR = "[Redacted]";
    var strict = false;
    function redaction(opts, serialize) {
      const { paths, censor, remove } = handle(opts);
      const shape = paths.reduce((o, str) => {
        rx.lastIndex = 0;
        const first = rx.exec(str);
        const next = rx.exec(str);
        let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
        if (ns === "*") {
          ns = wildcardFirstSym;
        }
        if (next === null) {
          o[ns] = null;
          return o;
        }
        if (o[ns] === null) {
          return o;
        }
        const { index: index2 } = next;
        const nextPath = `${str.substr(index2, str.length - 1)}`;
        o[ns] = o[ns] || [];
        if (ns !== wildcardFirstSym && o[ns].length === 0) {
          o[ns].push(...o[wildcardFirstSym] || []);
        }
        if (ns === wildcardFirstSym) {
          Object.keys(o).forEach(function(k) {
            if (o[k]) {
              o[k].push(nextPath);
            }
          });
        }
        o[ns].push(nextPath);
        return o;
      }, {});
      const result = {
        [redactFmtSym]: Redact({ paths, censor, serialize, strict, remove })
      };
      const topCensor = (...args) => {
        return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
      };
      return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
        if (shape[k] === null) {
          o[k] = (value) => topCensor(value, [k]);
        } else {
          const wrappedCensor = typeof censor === "function" ? (value, path) => {
            return censor(value, [k, ...path]);
          } : censor;
          o[k] = Redact({
            paths: shape[k],
            censor: wrappedCensor,
            serialize,
            strict,
            remove
          });
        }
        return o;
      }, result);
    }
    function handle(opts) {
      if (Array.isArray(opts)) {
        opts = { paths: opts, censor: CENSOR };
        return opts;
      }
      let { paths, censor = CENSOR, remove } = opts;
      if (Array.isArray(paths) === false) {
        throw Error("pino \u2013 redact must contain an array of strings");
      }
      if (remove === true) censor = void 0;
      return { paths, censor, remove };
    }
    module.exports = redaction;
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/time.js
var require_time = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/time.js"(exports, module) {
    "use strict";
    var nullTime = () => "";
    var epochTime = () => `,"time":${Date.now()}`;
    var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
    var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
    var NS_PER_MS = 1000000n;
    var NS_PER_SEC = 1000000000n;
    var startWallTimeNs = BigInt(Date.now()) * NS_PER_MS;
    var startHrTime = process.hrtime.bigint();
    var isoTimeNano = () => {
      const elapsedNs = process.hrtime.bigint() - startHrTime;
      const currentTimeNs = startWallTimeNs + elapsedNs;
      const secondsSinceEpoch = currentTimeNs / NS_PER_SEC;
      const nanosWithinSecond = currentTimeNs % NS_PER_SEC;
      const msSinceEpoch = Number(secondsSinceEpoch * 1000n + nanosWithinSecond / 1000000n);
      const date2 = new Date(msSinceEpoch);
      const year = date2.getUTCFullYear();
      const month = (date2.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = date2.getUTCDate().toString().padStart(2, "0");
      const hours = date2.getUTCHours().toString().padStart(2, "0");
      const minutes = date2.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date2.getUTCSeconds().toString().padStart(2, "0");
      return `,"time":"${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${nanosWithinSecond.toString().padStart(9, "0")}Z"`;
    };
    module.exports = { nullTime, epochTime, unixTime, isoTime, isoTimeNano };
  }
});

// ../../node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS({
  "../../node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js"(exports, module) {
    "use strict";
    function tryStringify(o) {
      try {
        return JSON.stringify(o);
      } catch (e) {
        return '"[Circular]"';
      }
    }
    module.exports = format;
    function format(f, args, opts) {
      var ss = opts && opts.stringify || tryStringify;
      var offset = 1;
      if (typeof f === "object" && f !== null) {
        var len = args.length + offset;
        if (len === 1) return f;
        var objects = new Array(len);
        objects[0] = ss(f);
        for (var index2 = 1; index2 < len; index2++) {
          objects[index2] = ss(args[index2]);
        }
        return objects.join(" ");
      }
      if (typeof f !== "string") {
        return f;
      }
      var argLen = args.length;
      if (argLen === 0) return f;
      var str = "";
      var a = 1 - offset;
      var lastPos = -1;
      var flen = f && f.length || 0;
      for (var i = 0; i < flen; ) {
        if (f.charCodeAt(i) === 37 && i + 1 < flen) {
          lastPos = lastPos > -1 ? lastPos : 0;
          switch (f.charCodeAt(i + 1)) {
            case 100:
            // 'd'
            case 102:
              if (a >= argLen)
                break;
              if (args[a] == null) break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += Number(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 105:
              if (a >= argLen)
                break;
              if (args[a] == null) break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += Math.floor(Number(args[a]));
              lastPos = i + 2;
              i++;
              break;
            case 79:
            // 'O'
            case 111:
            // 'o'
            case 106:
              if (a >= argLen)
                break;
              if (args[a] === void 0) break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              var type = typeof args[a];
              if (type === "string") {
                str += "'" + args[a] + "'";
                lastPos = i + 2;
                i++;
                break;
              }
              if (type === "function") {
                str += args[a].name || "<anonymous>";
                lastPos = i + 2;
                i++;
                break;
              }
              str += ss(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 115:
              if (a >= argLen)
                break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += String(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 37:
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += "%";
              lastPos = i + 2;
              i++;
              a--;
              break;
          }
          ++a;
        }
        ++i;
      }
      if (lastPos === -1)
        return f;
      else if (lastPos < flen) {
        str += f.slice(lastPos);
      }
      return str;
    }
  }
});

// ../../node_modules/.pnpm/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js
var require_atomic_sleep = __commonJS({
  "../../node_modules/.pnpm/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js"(exports, module) {
    "use strict";
    if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        Atomics.wait(nil, 0, 0, Number(ms));
      };
      const nil = new Int32Array(new SharedArrayBuffer(4));
      module.exports = sleep;
    } else {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        const target = Date.now() + Number(ms);
        while (target > Date.now()) {
        }
      };
      module.exports = sleep;
    }
  }
});

// ../../node_modules/.pnpm/sonic-boom@4.2.1/node_modules/sonic-boom/index.js
var require_sonic_boom = __commonJS({
  "../../node_modules/.pnpm/sonic-boom@4.2.1/node_modules/sonic-boom/index.js"(exports, module) {
    "use strict";
    var fs2 = __require("fs");
    var EventEmitter = __require("events");
    var inherits = __require("util").inherits;
    var path = __require("path");
    var sleep = require_atomic_sleep();
    var assert = __require("assert");
    var BUSY_WRITE_TIMEOUT = 100;
    var kEmptyBuffer = Buffer.allocUnsafe(0);
    var MAX_WRITE = 16 * 1024;
    var kContentModeBuffer = "buffer";
    var kContentModeUtf8 = "utf8";
    var [major, minor] = (process.versions.node || "0.0").split(".").map(Number);
    var kCopyBuffer = major >= 22 && minor >= 7;
    function openFile(file, sonic) {
      sonic._opening = true;
      sonic._writing = true;
      sonic._asyncDrainScheduled = false;
      function fileOpened(err, fd) {
        if (err) {
          sonic._reopening = false;
          sonic._writing = false;
          sonic._opening = false;
          if (sonic.sync) {
            process.nextTick(() => {
              if (sonic.listenerCount("error") > 0) {
                sonic.emit("error", err);
              }
            });
          } else {
            sonic.emit("error", err);
          }
          return;
        }
        const reopening = sonic._reopening;
        sonic.fd = fd;
        sonic.file = file;
        sonic._reopening = false;
        sonic._opening = false;
        sonic._writing = false;
        if (sonic.sync) {
          process.nextTick(() => sonic.emit("ready"));
        } else {
          sonic.emit("ready");
        }
        if (sonic.destroyed) {
          return;
        }
        if (!sonic._writing && sonic._len > sonic.minLength || sonic._flushPending) {
          sonic._actualWrite();
        } else if (reopening) {
          process.nextTick(() => sonic.emit("drain"));
        }
      }
      const flags = sonic.append ? "a" : "w";
      const mode = sonic.mode;
      if (sonic.sync) {
        try {
          if (sonic.mkdir) fs2.mkdirSync(path.dirname(file), { recursive: true });
          const fd = fs2.openSync(file, flags, mode);
          fileOpened(null, fd);
        } catch (err) {
          fileOpened(err);
          throw err;
        }
      } else if (sonic.mkdir) {
        fs2.mkdir(path.dirname(file), { recursive: true }, (err) => {
          if (err) return fileOpened(err);
          fs2.open(file, flags, mode, fileOpened);
        });
      } else {
        fs2.open(file, flags, mode, fileOpened);
      }
    }
    function SonicBoom(opts) {
      if (!(this instanceof SonicBoom)) {
        return new SonicBoom(opts);
      }
      let { fd, dest, minLength, maxLength, maxWrite, periodicFlush, sync, append = true, mkdir, retryEAGAIN, fsync, contentMode, mode } = opts || {};
      fd = fd || dest;
      this._len = 0;
      this.fd = -1;
      this._bufs = [];
      this._lens = [];
      this._writing = false;
      this._ending = false;
      this._reopening = false;
      this._asyncDrainScheduled = false;
      this._flushPending = false;
      this._hwm = Math.max(minLength || 0, 16387);
      this.file = null;
      this.destroyed = false;
      this.minLength = minLength || 0;
      this.maxLength = maxLength || 0;
      this.maxWrite = maxWrite || MAX_WRITE;
      this._periodicFlush = periodicFlush || 0;
      this._periodicFlushTimer = void 0;
      this.sync = sync || false;
      this.writable = true;
      this._fsync = fsync || false;
      this.append = append || false;
      this.mode = mode;
      this.retryEAGAIN = retryEAGAIN || (() => true);
      this.mkdir = mkdir || false;
      let fsWriteSync;
      let fsWrite;
      if (contentMode === kContentModeBuffer) {
        this._writingBuf = kEmptyBuffer;
        this.write = writeBuffer;
        this.flush = flushBuffer;
        this.flushSync = flushBufferSync;
        this._actualWrite = actualWriteBuffer;
        fsWriteSync = () => fs2.writeSync(this.fd, this._writingBuf);
        fsWrite = () => fs2.write(this.fd, this._writingBuf, this.release);
      } else if (contentMode === void 0 || contentMode === kContentModeUtf8) {
        this._writingBuf = "";
        this.write = write;
        this.flush = flush;
        this.flushSync = flushSync;
        this._actualWrite = actualWrite;
        fsWriteSync = () => {
          if (Buffer.isBuffer(this._writingBuf)) {
            return fs2.writeSync(this.fd, this._writingBuf);
          }
          return fs2.writeSync(this.fd, this._writingBuf, "utf8");
        };
        fsWrite = () => {
          if (Buffer.isBuffer(this._writingBuf)) {
            return fs2.write(this.fd, this._writingBuf, this.release);
          }
          return fs2.write(this.fd, this._writingBuf, "utf8", this.release);
        };
      } else {
        throw new Error(`SonicBoom supports "${kContentModeUtf8}" and "${kContentModeBuffer}", but passed ${contentMode}`);
      }
      if (typeof fd === "number") {
        this.fd = fd;
        process.nextTick(() => this.emit("ready"));
      } else if (typeof fd === "string") {
        openFile(fd, this);
      } else {
        throw new Error("SonicBoom supports only file descriptors and files");
      }
      if (this.minLength >= this.maxWrite) {
        throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
      }
      this.release = (err, n) => {
        if (err) {
          if ((err.code === "EAGAIN" || err.code === "EBUSY") && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {
            if (this.sync) {
              try {
                sleep(BUSY_WRITE_TIMEOUT);
                this.release(void 0, 0);
              } catch (err2) {
                this.release(err2);
              }
            } else {
              setTimeout(fsWrite, BUSY_WRITE_TIMEOUT);
            }
          } else {
            this._writing = false;
            this.emit("error", err);
          }
          return;
        }
        this.emit("write", n);
        const releasedBufObj = releaseWritingBuf(this._writingBuf, this._len, n);
        this._len = releasedBufObj.len;
        this._writingBuf = releasedBufObj.writingBuf;
        if (this._writingBuf.length) {
          if (!this.sync) {
            fsWrite();
            return;
          }
          try {
            do {
              const n2 = fsWriteSync();
              const releasedBufObj2 = releaseWritingBuf(this._writingBuf, this._len, n2);
              this._len = releasedBufObj2.len;
              this._writingBuf = releasedBufObj2.writingBuf;
            } while (this._writingBuf.length);
          } catch (err2) {
            this.release(err2);
            return;
          }
        }
        if (this._fsync) {
          fs2.fsyncSync(this.fd);
        }
        const len = this._len;
        if (this._reopening) {
          this._writing = false;
          this._reopening = false;
          this.reopen();
        } else if (len > this.minLength) {
          this._actualWrite();
        } else if (this._ending) {
          if (len > 0) {
            this._actualWrite();
          } else {
            this._writing = false;
            actualClose(this);
          }
        } else {
          this._writing = false;
          if (this.sync) {
            if (!this._asyncDrainScheduled) {
              this._asyncDrainScheduled = true;
              process.nextTick(emitDrain, this);
            }
          } else {
            this.emit("drain");
          }
        }
      };
      this.on("newListener", function(name) {
        if (name === "drain") {
          this._asyncDrainScheduled = false;
        }
      });
      if (this._periodicFlush !== 0) {
        this._periodicFlushTimer = setInterval(() => this.flush(null), this._periodicFlush);
        this._periodicFlushTimer.unref();
      }
    }
    function releaseWritingBuf(writingBuf, len, n) {
      if (typeof writingBuf === "string") {
        writingBuf = Buffer.from(writingBuf);
      }
      len = Math.max(len - n, 0);
      writingBuf = writingBuf.subarray(n);
      return { writingBuf, len };
    }
    function emitDrain(sonic) {
      const hasListeners = sonic.listenerCount("drain") > 0;
      if (!hasListeners) return;
      sonic._asyncDrainScheduled = false;
      sonic.emit("drain");
    }
    inherits(SonicBoom, EventEmitter);
    function mergeBuf(bufs, len) {
      if (bufs.length === 0) {
        return kEmptyBuffer;
      }
      if (bufs.length === 1) {
        return bufs[0];
      }
      return Buffer.concat(bufs, len);
    }
    function write(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      data = "" + data;
      const dataLen = Buffer.byteLength(data);
      const len = this._len + dataLen;
      const bufs = this._bufs;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || Buffer.byteLength(bufs[bufs.length - 1]) + dataLen > this.maxWrite) {
        bufs.push(data);
      } else {
        bufs[bufs.length - 1] += data;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function writeBuffer(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      const len = this._len + data.length;
      const bufs = this._bufs;
      const lens = this._lens;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || lens[lens.length - 1] + data.length > this.maxWrite) {
        bufs.push([data]);
        lens.push(data.length);
      } else {
        bufs[bufs.length - 1].push(data);
        lens[lens.length - 1] += data.length;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function callFlushCallbackOnDrain(cb) {
      this._flushPending = true;
      const onDrain = () => {
        if (!this._fsync) {
          try {
            fs2.fsync(this.fd, (err) => {
              this._flushPending = false;
              cb(err);
            });
          } catch (err) {
            cb(err);
          }
        } else {
          this._flushPending = false;
          cb();
        }
        this.off("error", onError);
      };
      const onError = (err) => {
        this._flushPending = false;
        cb(err);
        this.off("drain", onDrain);
      };
      this.once("drain", onDrain);
      this.once("error", onError);
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push("");
      }
      this._actualWrite();
    }
    function flushBuffer(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push([]);
        this._lens.push(0);
      }
      this._actualWrite();
    }
    SonicBoom.prototype.reopen = function(file) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.reopen(file);
        });
        return;
      }
      if (this._ending) {
        return;
      }
      if (!this.file) {
        throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
      }
      if (file) {
        this.file = file;
      }
      this._reopening = true;
      if (this._writing) {
        return;
      }
      const fd = this.fd;
      this.once("ready", () => {
        if (fd !== this.fd) {
          fs2.close(fd, (err) => {
            if (err) {
              return this.emit("error", err);
            }
          });
        }
      });
      openFile(this.file, this);
    };
    SonicBoom.prototype.end = function() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.end();
        });
        return;
      }
      if (this._ending) {
        return;
      }
      this._ending = true;
      if (this._writing) {
        return;
      }
      if (this._len > 0 && this.fd >= 0) {
        this._actualWrite();
      } else {
        actualClose(this);
      }
    };
    function flushSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift(this._writingBuf);
        this._writingBuf = "";
      }
      let buf = "";
      while (this._bufs.length || buf.length) {
        if (buf.length <= 0) {
          buf = this._bufs[0];
        }
        try {
          const n = Buffer.isBuffer(buf) ? fs2.writeSync(this.fd, buf) : fs2.writeSync(this.fd, buf, "utf8");
          const releasedBufObj = releaseWritingBuf(buf, this._len, n);
          buf = releasedBufObj.writingBuf;
          this._len = releasedBufObj.len;
          if (buf.length <= 0) {
            this._bufs.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
      try {
        fs2.fsyncSync(this.fd);
      } catch {
      }
    }
    function flushBufferSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift([this._writingBuf]);
        this._writingBuf = kEmptyBuffer;
      }
      let buf = kEmptyBuffer;
      while (this._bufs.length || buf.length) {
        if (buf.length <= 0) {
          buf = mergeBuf(this._bufs[0], this._lens[0]);
        }
        try {
          const n = fs2.writeSync(this.fd, buf);
          buf = buf.subarray(n);
          this._len = Math.max(this._len - n, 0);
          if (buf.length <= 0) {
            this._bufs.shift();
            this._lens.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
    }
    SonicBoom.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      actualClose(this);
    };
    function actualWrite() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf.length ? this._writingBuf : this._bufs.shift() || "";
      if (this.sync) {
        try {
          const written = Buffer.isBuffer(this._writingBuf) ? fs2.writeSync(this.fd, this._writingBuf) : fs2.writeSync(this.fd, this._writingBuf, "utf8");
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        fs2.write(this.fd, this._writingBuf, release);
      }
    }
    function actualWriteBuffer() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf.length ? this._writingBuf : mergeBuf(this._bufs.shift(), this._lens.shift());
      if (this.sync) {
        try {
          const written = fs2.writeSync(this.fd, this._writingBuf);
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        if (kCopyBuffer) {
          this._writingBuf = Buffer.from(this._writingBuf);
        }
        fs2.write(this.fd, this._writingBuf, release);
      }
    }
    function actualClose(sonic) {
      if (sonic.fd === -1) {
        sonic.once("ready", actualClose.bind(null, sonic));
        return;
      }
      if (sonic._periodicFlushTimer !== void 0) {
        clearInterval(sonic._periodicFlushTimer);
      }
      sonic.destroyed = true;
      sonic._bufs = [];
      sonic._lens = [];
      assert(typeof sonic.fd === "number", `sonic.fd must be a number, got ${typeof sonic.fd}`);
      try {
        fs2.fsync(sonic.fd, closeWrapped);
      } catch {
      }
      function closeWrapped() {
        if (sonic.fd !== 1 && sonic.fd !== 2) {
          fs2.close(sonic.fd, done);
        } else {
          done();
        }
      }
      function done(err) {
        if (err) {
          sonic.emit("error", err);
          return;
        }
        if (sonic._ending && !sonic._writing) {
          sonic.emit("finish");
        }
        sonic.emit("close");
      }
    }
    SonicBoom.SonicBoom = SonicBoom;
    SonicBoom.default = SonicBoom;
    module.exports = SonicBoom;
  }
});

// ../../node_modules/.pnpm/on-exit-leak-free@2.1.2/node_modules/on-exit-leak-free/index.js
var require_on_exit_leak_free = __commonJS({
  "../../node_modules/.pnpm/on-exit-leak-free@2.1.2/node_modules/on-exit-leak-free/index.js"(exports, module) {
    "use strict";
    var refs = {
      exit: [],
      beforeExit: []
    };
    var functions = {
      exit: onExit,
      beforeExit: onBeforeExit
    };
    var registry;
    function ensureRegistry() {
      if (registry === void 0) {
        registry = new FinalizationRegistry(clear);
      }
    }
    function install(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.on(event, functions[event]);
    }
    function uninstall(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.removeListener(event, functions[event]);
      if (refs.exit.length === 0 && refs.beforeExit.length === 0) {
        registry = void 0;
      }
    }
    function onExit() {
      callRefs("exit");
    }
    function onBeforeExit() {
      callRefs("beforeExit");
    }
    function callRefs(event) {
      for (const ref of refs[event]) {
        const obj = ref.deref();
        const fn = ref.fn;
        if (obj !== void 0) {
          fn(obj, event);
        }
      }
      refs[event] = [];
    }
    function clear(ref) {
      for (const event of ["exit", "beforeExit"]) {
        const index2 = refs[event].indexOf(ref);
        refs[event].splice(index2, index2 + 1);
        uninstall(event);
      }
    }
    function _register(event, obj, fn) {
      if (obj === void 0) {
        throw new Error("the object can't be undefined");
      }
      install(event);
      const ref = new WeakRef(obj);
      ref.fn = fn;
      ensureRegistry();
      registry.register(obj, ref);
      refs[event].push(ref);
    }
    function register(obj, fn) {
      _register("exit", obj, fn);
    }
    function registerBeforeExit(obj, fn) {
      _register("beforeExit", obj, fn);
    }
    function unregister(obj) {
      if (registry === void 0) {
        return;
      }
      registry.unregister(obj);
      for (const event of ["exit", "beforeExit"]) {
        refs[event] = refs[event].filter((ref) => {
          const _obj = ref.deref();
          return _obj && _obj !== obj;
        });
        uninstall(event);
      }
    }
    module.exports = {
      register,
      registerBeforeExit,
      unregister
    };
  }
});

// ../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/package.json
var require_package = __commonJS({
  "../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/package.json"(exports, module) {
    module.exports = {
      name: "thread-stream",
      version: "3.1.0",
      description: "A streaming way to send data to a Node.js Worker Thread",
      main: "index.js",
      types: "index.d.ts",
      dependencies: {
        "real-require": "^0.2.0"
      },
      devDependencies: {
        "@types/node": "^20.1.0",
        "@types/tap": "^15.0.0",
        "@yao-pkg/pkg": "^5.11.5",
        desm: "^1.3.0",
        fastbench: "^1.0.1",
        husky: "^9.0.6",
        "pino-elasticsearch": "^8.0.0",
        "sonic-boom": "^4.0.1",
        standard: "^17.0.0",
        tap: "^16.2.0",
        "ts-node": "^10.8.0",
        typescript: "^5.3.2",
        "why-is-node-running": "^2.2.2"
      },
      scripts: {
        build: "tsc --noEmit",
        test: 'standard && npm run build && npm run transpile && tap "test/**/*.test.*js" && tap --ts test/*.test.*ts',
        "test:ci": "standard && npm run transpile && npm run test:ci:js && npm run test:ci:ts",
        "test:ci:js": 'tap --no-check-coverage --timeout=120 --coverage-report=lcovonly "test/**/*.test.*js"',
        "test:ci:ts": 'tap --ts --no-check-coverage --coverage-report=lcovonly "test/**/*.test.*ts"',
        "test:yarn": 'npm run transpile && tap "test/**/*.test.js" --no-check-coverage',
        transpile: "sh ./test/ts/transpile.sh",
        prepare: "husky install"
      },
      standard: {
        ignore: [
          "test/ts/**/*",
          "test/syntax-error.mjs"
        ]
      },
      repository: {
        type: "git",
        url: "git+https://github.com/mcollina/thread-stream.git"
      },
      keywords: [
        "worker",
        "thread",
        "threads",
        "stream"
      ],
      author: "Matteo Collina <hello@matteocollina.com>",
      license: "MIT",
      bugs: {
        url: "https://github.com/mcollina/thread-stream/issues"
      },
      homepage: "https://github.com/mcollina/thread-stream#readme"
    };
  }
});

// ../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/wait.js
var require_wait = __commonJS({
  "../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/wait.js"(exports, module) {
    "use strict";
    var MAX_TIMEOUT = 1e3;
    function wait(state, index2, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index2);
      if (current === expected) {
        done(null, "ok");
        return;
      }
      let prior = current;
      const check = (backoff2) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            prior = current;
            current = Atomics.load(state, index2);
            if (current === prior) {
              check(backoff2 >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff2 * 2);
            } else {
              if (current === expected) done(null, "ok");
              else done(null, "not-equal");
            }
          }, backoff2);
        }
      };
      check(1);
    }
    function waitDiff(state, index2, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index2);
      if (current !== expected) {
        done(null, "ok");
        return;
      }
      const check = (backoff2) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            current = Atomics.load(state, index2);
            if (current !== expected) {
              done(null, "ok");
            } else {
              check(backoff2 >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff2 * 2);
            }
          }, backoff2);
        }
      };
      check(1);
    }
    module.exports = { wait, waitDiff };
  }
});

// ../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/indexes.js
var require_indexes = __commonJS({
  "../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/indexes.js"(exports, module) {
    "use strict";
    var WRITE_INDEX = 4;
    var READ_INDEX = 8;
    module.exports = {
      WRITE_INDEX,
      READ_INDEX
    };
  }
});

// ../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/index.js
var require_thread_stream = __commonJS({
  "../../node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/index.js"(exports, module) {
    "use strict";
    var { version: version2 } = require_package();
    var { EventEmitter } = __require("events");
    var { Worker } = __require("worker_threads");
    var { join } = __require("path");
    var { pathToFileURL } = __require("url");
    var { wait } = require_wait();
    var {
      WRITE_INDEX,
      READ_INDEX
    } = require_indexes();
    var buffer2 = __require("buffer");
    var assert = __require("assert");
    var kImpl = /* @__PURE__ */ Symbol("kImpl");
    var MAX_STRING = buffer2.constants.MAX_STRING_LENGTH;
    var FakeWeakRef = class {
      constructor(value) {
        this._value = value;
      }
      deref() {
        return this._value;
      }
    };
    var FakeFinalizationRegistry = class {
      register() {
      }
      unregister() {
      }
    };
    var FinalizationRegistry2 = process.env.NODE_V8_COVERAGE ? FakeFinalizationRegistry : global.FinalizationRegistry || FakeFinalizationRegistry;
    var WeakRef2 = process.env.NODE_V8_COVERAGE ? FakeWeakRef : global.WeakRef || FakeWeakRef;
    var registry = new FinalizationRegistry2((worker) => {
      if (worker.exited) {
        return;
      }
      worker.terminate();
    });
    function createWorker(stream, opts) {
      const { filename, workerData } = opts;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      const toExecute = bundlerOverrides["thread-stream-worker"] || join(__dirname, "lib", "worker.js");
      const worker = new Worker(toExecute, {
        ...opts.workerOpts,
        trackUnmanagedFds: false,
        workerData: {
          filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
          dataBuf: stream[kImpl].dataBuf,
          stateBuf: stream[kImpl].stateBuf,
          workerData: {
            $context: {
              threadStreamVersion: version2
            },
            ...workerData
          }
        }
      });
      worker.stream = new FakeWeakRef(stream);
      worker.on("message", onWorkerMessage);
      worker.on("exit", onWorkerExit);
      registry.register(stream, worker);
      return worker;
    }
    function drain(stream) {
      assert(!stream[kImpl].sync);
      if (stream[kImpl].needDrain) {
        stream[kImpl].needDrain = false;
        stream.emit("drain");
      }
    }
    function nextFlush(stream) {
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let leftover = stream[kImpl].data.length - writeIndex;
      if (leftover > 0) {
        if (stream[kImpl].buf.length === 0) {
          stream[kImpl].flushing = false;
          if (stream[kImpl].ending) {
            end(stream);
          } else if (stream[kImpl].needDrain) {
            process.nextTick(drain, stream);
          }
          return;
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, nextFlush.bind(null, stream));
        } else {
          stream.flush(() => {
            if (stream.destroyed) {
              return;
            }
            Atomics.store(stream[kImpl].state, READ_INDEX, 0);
            Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
            while (toWriteBytes > stream[kImpl].data.length) {
              leftover = leftover / 2;
              toWrite = stream[kImpl].buf.slice(0, leftover);
              toWriteBytes = Buffer.byteLength(toWrite);
            }
            stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
            write(stream, toWrite, nextFlush.bind(null, stream));
          });
        }
      } else if (leftover === 0) {
        if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
          return;
        }
        stream.flush(() => {
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          nextFlush(stream);
        });
      } else {
        destroy(stream, new Error("overwritten"));
      }
    }
    function onWorkerMessage(msg) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        this.exited = true;
        this.terminate();
        return;
      }
      switch (msg.code) {
        case "READY":
          this.stream = new WeakRef2(stream);
          stream.flush(() => {
            stream[kImpl].ready = true;
            stream.emit("ready");
          });
          break;
        case "ERROR":
          destroy(stream, msg.err);
          break;
        case "EVENT":
          if (Array.isArray(msg.args)) {
            stream.emit(msg.name, ...msg.args);
          } else {
            stream.emit(msg.name, msg.args);
          }
          break;
        case "WARNING":
          process.emitWarning(msg.err);
          break;
        default:
          destroy(stream, new Error("this should not happen: " + msg.code));
      }
    }
    function onWorkerExit(code) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        return;
      }
      registry.unregister(stream);
      stream.worker.exited = true;
      stream.worker.off("exit", onWorkerExit);
      destroy(stream, code !== 0 ? new Error("the worker thread exited") : null);
    }
    var ThreadStream = class extends EventEmitter {
      constructor(opts = {}) {
        super();
        if (opts.bufferSize < 4) {
          throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
        }
        this[kImpl] = {};
        this[kImpl].stateBuf = new SharedArrayBuffer(128);
        this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
        this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
        this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
        this[kImpl].sync = opts.sync || false;
        this[kImpl].ending = false;
        this[kImpl].ended = false;
        this[kImpl].needDrain = false;
        this[kImpl].destroyed = false;
        this[kImpl].flushing = false;
        this[kImpl].ready = false;
        this[kImpl].finished = false;
        this[kImpl].errored = null;
        this[kImpl].closed = false;
        this[kImpl].buf = "";
        this.worker = createWorker(this, opts);
        this.on("message", (message, transferList) => {
          this.worker.postMessage(message, transferList);
        });
      }
      write(data) {
        if (this[kImpl].destroyed) {
          error(this, new Error("the worker has exited"));
          return false;
        }
        if (this[kImpl].ending) {
          error(this, new Error("the worker is ending"));
          return false;
        }
        if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
          try {
            writeSync(this);
            this[kImpl].flushing = true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        this[kImpl].buf += data;
        if (this[kImpl].sync) {
          try {
            writeSync(this);
            return true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        if (!this[kImpl].flushing) {
          this[kImpl].flushing = true;
          setImmediate(nextFlush, this);
        }
        this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
        return !this[kImpl].needDrain;
      }
      end() {
        if (this[kImpl].destroyed) {
          return;
        }
        this[kImpl].ending = true;
        end(this);
      }
      flush(cb) {
        if (this[kImpl].destroyed) {
          if (typeof cb === "function") {
            process.nextTick(cb, new Error("the worker has exited"));
          }
          return;
        }
        const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
        wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
          if (err) {
            destroy(this, err);
            process.nextTick(cb, err);
            return;
          }
          if (res === "not-equal") {
            this.flush(cb);
            return;
          }
          process.nextTick(cb);
        });
      }
      flushSync() {
        if (this[kImpl].destroyed) {
          return;
        }
        writeSync(this);
        flushSync(this);
      }
      unref() {
        this.worker.unref();
      }
      ref() {
        this.worker.ref();
      }
      get ready() {
        return this[kImpl].ready;
      }
      get destroyed() {
        return this[kImpl].destroyed;
      }
      get closed() {
        return this[kImpl].closed;
      }
      get writable() {
        return !this[kImpl].destroyed && !this[kImpl].ending;
      }
      get writableEnded() {
        return this[kImpl].ending;
      }
      get writableFinished() {
        return this[kImpl].finished;
      }
      get writableNeedDrain() {
        return this[kImpl].needDrain;
      }
      get writableObjectMode() {
        return false;
      }
      get writableErrored() {
        return this[kImpl].errored;
      }
    };
    function error(stream, err) {
      setImmediate(() => {
        stream.emit("error", err);
      });
    }
    function destroy(stream, err) {
      if (stream[kImpl].destroyed) {
        return;
      }
      stream[kImpl].destroyed = true;
      if (err) {
        stream[kImpl].errored = err;
        error(stream, err);
      }
      if (!stream.worker.exited) {
        stream.worker.terminate().catch(() => {
        }).then(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      } else {
        setImmediate(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      }
    }
    function write(stream, data, cb) {
      const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      const length = Buffer.byteLength(data);
      stream[kImpl].data.write(data, current);
      Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length);
      Atomics.notify(stream[kImpl].state, WRITE_INDEX);
      cb();
      return true;
    }
    function end(stream) {
      if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
        return;
      }
      stream[kImpl].ended = true;
      try {
        stream.flushSync();
        let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
        Atomics.notify(stream[kImpl].state, WRITE_INDEX);
        let spins = 0;
        while (readIndex !== -1) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
          readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
          if (readIndex === -2) {
            destroy(stream, new Error("end() failed"));
            return;
          }
          if (++spins === 10) {
            destroy(stream, new Error("end() took too long (10s)"));
            return;
          }
        }
        process.nextTick(() => {
          stream[kImpl].finished = true;
          stream.emit("finish");
        });
      } catch (err) {
        destroy(stream, err);
      }
    }
    function writeSync(stream) {
      const cb = () => {
        if (stream[kImpl].ending) {
          end(stream);
        } else if (stream[kImpl].needDrain) {
          process.nextTick(drain, stream);
        }
      };
      stream[kImpl].flushing = false;
      while (stream[kImpl].buf.length !== 0) {
        const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
        let leftover = stream[kImpl].data.length - writeIndex;
        if (leftover === 0) {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          continue;
        } else if (leftover < 0) {
          throw new Error("overwritten");
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        } else {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          while (toWriteBytes > stream[kImpl].buf.length) {
            leftover = leftover / 2;
            toWrite = stream[kImpl].buf.slice(0, leftover);
            toWriteBytes = Buffer.byteLength(toWrite);
          }
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        }
      }
    }
    function flushSync(stream) {
      if (stream[kImpl].flushing) {
        throw new Error("unable to flush while flushing");
      }
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let spins = 0;
      while (true) {
        const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        if (readIndex === -2) {
          throw Error("_flushSync failed");
        }
        if (readIndex !== writeIndex) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
        } else {
          break;
        }
        if (++spins === 10) {
          throw new Error("_flushSync took too long (10s)");
        }
      }
    }
    module.exports = ThreadStream;
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/transport.js
var require_transport = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/transport.js"(exports, module) {
    "use strict";
    var { createRequire } = __require("module");
    var getCallers = require_caller();
    var { join, isAbsolute, sep } = __require("node:path");
    var sleep = require_atomic_sleep();
    var onExit = require_on_exit_leak_free();
    var ThreadStream = require_thread_stream();
    function setupOnExit(stream) {
      onExit.register(stream, autoEnd);
      onExit.registerBeforeExit(stream, flush);
      stream.on("close", function() {
        onExit.unregister(stream);
      });
    }
    function buildStream(filename, workerData, workerOpts, sync) {
      const stream = new ThreadStream({
        filename,
        workerData,
        workerOpts,
        sync
      });
      stream.on("ready", onReady);
      stream.on("close", function() {
        process.removeListener("exit", onExit2);
      });
      process.on("exit", onExit2);
      function onReady() {
        process.removeListener("exit", onExit2);
        stream.unref();
        if (workerOpts.autoEnd !== false) {
          setupOnExit(stream);
        }
      }
      function onExit2() {
        if (stream.closed) {
          return;
        }
        stream.flushSync();
        sleep(100);
        stream.end();
      }
      return stream;
    }
    function autoEnd(stream) {
      stream.ref();
      stream.flushSync();
      stream.end();
      stream.once("close", function() {
        stream.unref();
      });
    }
    function flush(stream) {
      stream.flushSync();
    }
    function transport(fullOptions) {
      const { pipeline, targets, levels, dedupe, worker = {}, caller = getCallers(), sync = false } = fullOptions;
      const options = {
        ...fullOptions.options
      };
      const callers = typeof caller === "string" ? [caller] : caller;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      let target = fullOptions.target;
      if (target && targets) {
        throw new Error("only one of target or targets can be specified");
      }
      if (targets) {
        target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
        options.targets = targets.filter((dest) => dest.target).map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        });
        options.pipelines = targets.filter((dest) => dest.pipeline).map((dest) => {
          return dest.pipeline.map((t) => {
            return {
              ...t,
              level: dest.level,
              // duplicate the pipeline `level` property defined in the upper level
              target: fixTarget(t.target)
            };
          });
        });
      } else if (pipeline) {
        target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
        options.pipelines = [pipeline.map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        })];
      }
      if (levels) {
        options.levels = levels;
      }
      if (dedupe) {
        options.dedupe = dedupe;
      }
      options.pinoWillSendConfig = true;
      return buildStream(fixTarget(target), options, worker, sync);
      function fixTarget(origin) {
        origin = bundlerOverrides[origin] || origin;
        if (isAbsolute(origin) || origin.indexOf("file://") === 0) {
          return origin;
        }
        if (origin === "pino/file") {
          return join(__dirname, "..", "file.js");
        }
        let fixTarget2;
        for (const filePath of callers) {
          try {
            const context = filePath === "node:repl" ? process.cwd() + sep : filePath;
            fixTarget2 = createRequire(context).resolve(origin);
            break;
          } catch (err) {
            continue;
          }
        }
        if (!fixTarget2) {
          throw new Error(`unable to determine transport target for "${origin}"`);
        }
        return fixTarget2;
      }
    }
    module.exports = transport;
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/tools.js
var require_tools = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/tools.js"(exports, module) {
    "use strict";
    var diagChan = __require("node:diagnostics_channel");
    var format = require_quick_format_unescaped();
    var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
    var SonicBoom = require_sonic_boom();
    var onExit = require_on_exit_leak_free();
    var {
      lsCacheSym,
      chindingsSym,
      writeSym,
      serializersSym,
      formatOptsSym,
      endSym,
      stringifiersSym,
      stringifySym,
      stringifySafeSym,
      wildcardFirstSym,
      nestedKeySym,
      formattersSym,
      messageKeySym,
      errorKeySym,
      nestedKeyStrSym,
      msgPrefixSym
    } = require_symbols();
    var { isMainThread } = __require("worker_threads");
    var transport = require_transport();
    var asJsonChan;
    if (typeof diagChan.tracingChannel === "function") {
      asJsonChan = diagChan.tracingChannel("pino_asJson");
    } else {
      asJsonChan = {
        hasSubscribers: false,
        traceSync(fn, store, thisArg, ...args) {
          return fn.call(thisArg, ...args);
        }
      };
    }
    function noop3() {
    }
    function genLog(level, hook) {
      if (!hook) return LOG;
      return function hookWrappedLog(...args) {
        hook.call(this, args, LOG, level);
      };
      function LOG(o, ...n) {
        if (typeof o === "object") {
          let msg = o;
          if (o !== null) {
            if (o.method && o.headers && o.socket) {
              o = mapHttpRequest(o);
            } else if (typeof o.setHeader === "function") {
              o = mapHttpResponse(o);
            }
          }
          let formatParams;
          if (msg === null && n.length === 0) {
            formatParams = [null];
          } else {
            msg = n.shift();
            formatParams = n;
          }
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
        } else {
          let msg = o === void 0 ? n.shift() : o;
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](null, format(msg, n, this[formatOptsSym]), level);
        }
      }
    }
    function asString(str) {
      let result = "";
      let last = 0;
      let found = false;
      let point2 = 255;
      const l = str.length;
      if (l > 100) {
        return JSON.stringify(str);
      }
      for (var i = 0; i < l && point2 >= 32; i++) {
        point2 = str.charCodeAt(i);
        if (point2 === 34 || point2 === 92) {
          result += str.slice(last, i) + "\\";
          last = i;
          found = true;
        }
      }
      if (!found) {
        result = str;
      } else {
        result += str.slice(last);
      }
      return point2 < 32 ? JSON.stringify(str) : '"' + result + '"';
    }
    function asJson(obj, msg, num, time2) {
      if (asJsonChan.hasSubscribers === false) {
        return _asJson.call(this, obj, msg, num, time2);
      }
      const store = { instance: this, arguments };
      return asJsonChan.traceSync(_asJson, store, this, obj, msg, num, time2);
    }
    function _asJson(obj, msg, num, time2) {
      const stringify3 = this[stringifySym];
      const stringifySafe = this[stringifySafeSym];
      const stringifiers = this[stringifiersSym];
      const end = this[endSym];
      const chindings = this[chindingsSym];
      const serializers2 = this[serializersSym];
      const formatters = this[formattersSym];
      const messageKey = this[messageKeySym];
      const errorKey = this[errorKeySym];
      let data = this[lsCacheSym][num] + time2;
      data = data + chindings;
      let value;
      if (formatters.log) {
        obj = formatters.log(obj);
      }
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      let propStr = "";
      for (const key in obj) {
        value = obj[key];
        if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
          if (serializers2[key]) {
            value = serializers2[key](value);
          } else if (key === errorKey && serializers2.err) {
            value = serializers2.err(value);
          }
          const stringifier = stringifiers[key] || wildcardStringifier;
          switch (typeof value) {
            case "undefined":
            case "function":
              continue;
            case "number":
              if (Number.isFinite(value) === false) {
                value = null;
              }
            // this case explicitly falls through to the next one
            case "boolean":
              if (stringifier) value = stringifier(value);
              break;
            case "string":
              value = (stringifier || asString)(value);
              break;
            default:
              value = (stringifier || stringify3)(value, stringifySafe);
          }
          if (value === void 0) continue;
          const strKey = asString(key);
          propStr += "," + strKey + ":" + value;
        }
      }
      let msgStr = "";
      if (msg !== void 0) {
        value = serializers2[messageKey] ? serializers2[messageKey](msg) : msg;
        const stringifier = stringifiers[messageKey] || wildcardStringifier;
        switch (typeof value) {
          case "function":
            break;
          case "number":
            if (Number.isFinite(value) === false) {
              value = null;
            }
          // this case explicitly falls through to the next one
          case "boolean":
            if (stringifier) value = stringifier(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          case "string":
            value = (stringifier || asString)(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          default:
            value = (stringifier || stringify3)(value, stringifySafe);
            msgStr = ',"' + messageKey + '":' + value;
        }
      }
      if (this[nestedKeySym] && propStr) {
        return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
      } else {
        return data + propStr + msgStr + end;
      }
    }
    function asChindings(instance, bindings) {
      let value;
      let data = instance[chindingsSym];
      const stringify3 = instance[stringifySym];
      const stringifySafe = instance[stringifySafeSym];
      const stringifiers = instance[stringifiersSym];
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      const serializers2 = instance[serializersSym];
      const formatter = instance[formattersSym].bindings;
      bindings = formatter(bindings);
      for (const key in bindings) {
        value = bindings[key];
        const valid = (key.length < 5 || key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels") && bindings.hasOwnProperty(key) && value !== void 0;
        if (valid === true) {
          value = serializers2[key] ? serializers2[key](value) : value;
          value = (stringifiers[key] || wildcardStringifier || stringify3)(value, stringifySafe);
          if (value === void 0) continue;
          data += ',"' + key + '":' + value;
        }
      }
      return data;
    }
    function hasBeenTampered(stream) {
      return stream.write !== stream.constructor.prototype.write;
    }
    function buildSafeSonicBoom(opts) {
      const stream = new SonicBoom(opts);
      stream.on("error", filterBrokenPipe);
      if (!opts.sync && isMainThread) {
        onExit.register(stream, autoEnd);
        stream.on("close", function() {
          onExit.unregister(stream);
        });
      }
      return stream;
      function filterBrokenPipe(err) {
        if (err.code === "EPIPE") {
          stream.write = noop3;
          stream.end = noop3;
          stream.flushSync = noop3;
          stream.destroy = noop3;
          return;
        }
        stream.removeListener("error", filterBrokenPipe);
        stream.emit("error", err);
      }
    }
    function autoEnd(stream, eventName) {
      if (stream.destroyed) {
        return;
      }
      if (eventName === "beforeExit") {
        stream.flush();
        stream.on("drain", function() {
          stream.end();
        });
      } else {
        stream.flushSync();
      }
    }
    function createArgsNormalizer(defaultOptions) {
      return function normalizeArgs(instance, caller, opts = {}, stream) {
        if (typeof opts === "string") {
          stream = buildSafeSonicBoom({ dest: opts });
          opts = {};
        } else if (typeof stream === "string") {
          if (opts && opts.transport) {
            throw Error("only one of option.transport or stream can be specified");
          }
          stream = buildSafeSonicBoom({ dest: stream });
        } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
          stream = opts;
          opts = {};
        } else if (opts.transport) {
          if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
            throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
          }
          if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") {
            throw Error("option.transport.targets do not allow custom level formatters");
          }
          let customLevels;
          if (opts.customLevels) {
            customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
          }
          stream = transport({ caller, ...opts.transport, levels: customLevels });
        }
        opts = Object.assign({}, defaultOptions, opts);
        opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
        opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
        if (opts.prettyPrint) {
          throw new Error("prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)");
        }
        const { enabled, onChild } = opts;
        if (enabled === false) opts.level = "silent";
        if (!onChild) opts.onChild = noop3;
        if (!stream) {
          if (!hasBeenTampered(process.stdout)) {
            stream = buildSafeSonicBoom({ fd: process.stdout.fd || 1 });
          } else {
            stream = process.stdout;
          }
        }
        return { opts, stream };
      };
    }
    function stringify2(obj, stringifySafeFn) {
      try {
        return JSON.stringify(obj);
      } catch (_) {
        try {
          const stringify3 = stringifySafeFn || this[stringifySafeSym];
          return stringify3(obj);
        } catch (_2) {
          return '"[unable to serialize, circular reference is too complex to analyze]"';
        }
      }
    }
    function buildFormatters(level, bindings, log) {
      return {
        level,
        bindings,
        log
      };
    }
    function normalizeDestFileDescriptor(destination) {
      const fd = Number(destination);
      if (typeof destination === "string" && Number.isFinite(fd)) {
        return fd;
      }
      if (destination === void 0) {
        return 1;
      }
      return destination;
    }
    module.exports = {
      noop: noop3,
      buildSafeSonicBoom,
      asChindings,
      asJson,
      genLog,
      createArgsNormalizer,
      stringify: stringify2,
      buildFormatters,
      normalizeDestFileDescriptor
    };
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/constants.js"(exports, module) {
    var DEFAULT_LEVELS = {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60
    };
    var SORTING_ORDER = {
      ASC: "ASC",
      DESC: "DESC"
    };
    module.exports = {
      DEFAULT_LEVELS,
      SORTING_ORDER
    };
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/levels.js
var require_levels = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/levels.js"(exports, module) {
    "use strict";
    var {
      lsCacheSym,
      levelValSym,
      useOnlyCustomLevelsSym,
      streamSym,
      formattersSym,
      hooksSym,
      levelCompSym
    } = require_symbols();
    var { noop: noop3, genLog } = require_tools();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var levelMethods = {
      fatal: (hook) => {
        const logFatal = genLog(DEFAULT_LEVELS.fatal, hook);
        return function(...args) {
          const stream = this[streamSym];
          logFatal.call(this, ...args);
          if (typeof stream.flushSync === "function") {
            try {
              stream.flushSync();
            } catch (e) {
            }
          }
        };
      },
      error: (hook) => genLog(DEFAULT_LEVELS.error, hook),
      warn: (hook) => genLog(DEFAULT_LEVELS.warn, hook),
      info: (hook) => genLog(DEFAULT_LEVELS.info, hook),
      debug: (hook) => genLog(DEFAULT_LEVELS.debug, hook),
      trace: (hook) => genLog(DEFAULT_LEVELS.trace, hook)
    };
    var nums = Object.keys(DEFAULT_LEVELS).reduce((o, k) => {
      o[DEFAULT_LEVELS[k]] = k;
      return o;
    }, {});
    var initialLsCache = Object.keys(nums).reduce((o, k) => {
      o[k] = '{"level":' + Number(k);
      return o;
    }, {});
    function genLsCache(instance) {
      const formatter = instance[formattersSym].level;
      const { labels } = instance.levels;
      const cache = {};
      for (const label in labels) {
        const level = formatter(labels[label], Number(label));
        cache[label] = JSON.stringify(level).slice(0, -1);
      }
      instance[lsCacheSym] = cache;
      return instance;
    }
    function isStandardLevel(level, useOnlyCustomLevels) {
      if (useOnlyCustomLevels) {
        return false;
      }
      switch (level) {
        case "fatal":
        case "error":
        case "warn":
        case "info":
        case "debug":
        case "trace":
          return true;
        default:
          return false;
      }
    }
    function setLevel(level) {
      const { labels, values: values2 } = this.levels;
      if (typeof level === "number") {
        if (labels[level] === void 0) throw Error("unknown level value" + level);
        level = labels[level];
      }
      if (values2[level] === void 0) throw Error("unknown level " + level);
      const preLevelVal = this[levelValSym];
      const levelVal = this[levelValSym] = values2[level];
      const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
      const levelComparison = this[levelCompSym];
      const hook = this[hooksSym].logMethod;
      for (const key in values2) {
        if (levelComparison(values2[key], levelVal) === false) {
          this[key] = noop3;
          continue;
        }
        this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values2[key], hook);
      }
      this.emit(
        "level-change",
        level,
        levelVal,
        labels[preLevelVal],
        preLevelVal,
        this
      );
    }
    function getLevel(level) {
      const { levels, levelVal } = this;
      return levels && levels.labels ? levels.labels[levelVal] : "";
    }
    function isLevelEnabled(logLevel) {
      const { values: values2 } = this.levels;
      const logLevelVal = values2[logLevel];
      return logLevelVal !== void 0 && this[levelCompSym](logLevelVal, this[levelValSym]);
    }
    function compareLevel(direction, current, expected) {
      if (direction === SORTING_ORDER.DESC) {
        return current <= expected;
      }
      return current >= expected;
    }
    function genLevelComparison(levelComparison) {
      if (typeof levelComparison === "string") {
        return compareLevel.bind(null, levelComparison);
      }
      return levelComparison;
    }
    function mappings(customLevels = null, useOnlyCustomLevels = false) {
      const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
        o[customLevels[k]] = k;
        return o;
      }, {}) : null;
      const labels = Object.assign(
        Object.create(Object.prototype, { Infinity: { value: "silent" } }),
        useOnlyCustomLevels ? null : nums,
        customNums
      );
      const values2 = Object.assign(
        Object.create(Object.prototype, { silent: { value: Infinity } }),
        useOnlyCustomLevels ? null : DEFAULT_LEVELS,
        customLevels
      );
      return { labels, values: values2 };
    }
    function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
      if (typeof defaultLevel === "number") {
        const values2 = [].concat(
          Object.keys(customLevels || {}).map((key) => customLevels[key]),
          useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level),
          Infinity
        );
        if (!values2.includes(defaultLevel)) {
          throw Error(`default level:${defaultLevel} must be included in custom levels`);
        }
        return;
      }
      const labels = Object.assign(
        Object.create(Object.prototype, { silent: { value: Infinity } }),
        useOnlyCustomLevels ? null : DEFAULT_LEVELS,
        customLevels
      );
      if (!(defaultLevel in labels)) {
        throw Error(`default level:${defaultLevel} must be included in custom levels`);
      }
    }
    function assertNoLevelCollisions(levels, customLevels) {
      const { labels, values: values2 } = levels;
      for (const k in customLevels) {
        if (k in values2) {
          throw Error("levels cannot be overridden");
        }
        if (customLevels[k] in labels) {
          throw Error("pre-existing level values cannot be used for new levels");
        }
      }
    }
    function assertLevelComparison(levelComparison) {
      if (typeof levelComparison === "function") {
        return;
      }
      if (typeof levelComparison === "string" && Object.values(SORTING_ORDER).includes(levelComparison)) {
        return;
      }
      throw new Error('Levels comparison should be one of "ASC", "DESC" or "function" type');
    }
    module.exports = {
      initialLsCache,
      genLsCache,
      levelMethods,
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      assertNoLevelCollisions,
      assertDefaultLevelFound,
      genLevelComparison,
      assertLevelComparison
    };
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/meta.js
var require_meta = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/meta.js"(exports, module) {
    "use strict";
    module.exports = { version: "9.14.0" };
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/proto.js
var require_proto = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/proto.js"(exports, module) {
    "use strict";
    var { EventEmitter } = __require("node:events");
    var {
      lsCacheSym,
      levelValSym,
      setLevelSym,
      getLevelSym,
      chindingsSym,
      parsedChindingsSym,
      mixinSym,
      asJsonSym,
      writeSym,
      mixinMergeStrategySym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      serializersSym,
      formattersSym,
      errorKeySym,
      messageKeySym,
      useOnlyCustomLevelsSym,
      needsMetadataGsym,
      redactFmtSym,
      stringifySym,
      formatOptsSym,
      stringifiersSym,
      msgPrefixSym,
      hooksSym
    } = require_symbols();
    var {
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      initialLsCache,
      genLsCache,
      assertNoLevelCollisions
    } = require_levels();
    var {
      asChindings,
      asJson,
      buildFormatters,
      stringify: stringify2,
      noop: noop3
    } = require_tools();
    var {
      version: version2
    } = require_meta();
    var redaction = require_redaction();
    var constructor = class Pino {
    };
    var prototype = {
      constructor,
      child,
      bindings,
      setBindings,
      flush,
      isLevelEnabled,
      version: version2,
      get level() {
        return this[getLevelSym]();
      },
      set level(lvl) {
        this[setLevelSym](lvl);
      },
      get levelVal() {
        return this[levelValSym];
      },
      set levelVal(n) {
        throw Error("levelVal is read-only");
      },
      get msgPrefix() {
        return this[msgPrefixSym];
      },
      get [Symbol.toStringTag]() {
        return "Pino";
      },
      [lsCacheSym]: initialLsCache,
      [writeSym]: write,
      [asJsonSym]: asJson,
      [getLevelSym]: getLevel,
      [setLevelSym]: setLevel
    };
    Object.setPrototypeOf(prototype, EventEmitter.prototype);
    module.exports = function() {
      return Object.create(prototype);
    };
    var resetChildingsFormatter = (bindings2) => bindings2;
    function child(bindings2, options) {
      if (!bindings2) {
        throw Error("missing bindings for child Pino");
      }
      const serializers2 = this[serializersSym];
      const formatters = this[formattersSym];
      const instance = Object.create(this);
      if (options == null) {
        if (instance[formattersSym].bindings !== resetChildingsFormatter) {
          instance[formattersSym] = buildFormatters(
            formatters.level,
            resetChildingsFormatter,
            formatters.log
          );
        }
        instance[chindingsSym] = asChindings(instance, bindings2);
        instance[setLevelSym](this.level);
        if (this.onChild !== noop3) {
          this.onChild(instance);
        }
        return instance;
      }
      if (options.hasOwnProperty("serializers") === true) {
        instance[serializersSym] = /* @__PURE__ */ Object.create(null);
        for (const k in serializers2) {
          instance[serializersSym][k] = serializers2[k];
        }
        const parentSymbols = Object.getOwnPropertySymbols(serializers2);
        for (var i = 0; i < parentSymbols.length; i++) {
          const ks = parentSymbols[i];
          instance[serializersSym][ks] = serializers2[ks];
        }
        for (const bk in options.serializers) {
          instance[serializersSym][bk] = options.serializers[bk];
        }
        const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
        for (var bi = 0; bi < bindingsSymbols.length; bi++) {
          const bks = bindingsSymbols[bi];
          instance[serializersSym][bks] = options.serializers[bks];
        }
      } else instance[serializersSym] = serializers2;
      if (options.hasOwnProperty("formatters")) {
        const { level, bindings: chindings, log } = options.formatters;
        instance[formattersSym] = buildFormatters(
          level || formatters.level,
          chindings || resetChildingsFormatter,
          log || formatters.log
        );
      } else {
        instance[formattersSym] = buildFormatters(
          formatters.level,
          resetChildingsFormatter,
          formatters.log
        );
      }
      if (options.hasOwnProperty("customLevels") === true) {
        assertNoLevelCollisions(this.levels, options.customLevels);
        instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym]);
        genLsCache(instance);
      }
      if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
        instance.redact = options.redact;
        const stringifiers = redaction(instance.redact, stringify2);
        const formatOpts = { stringify: stringifiers[redactFmtSym] };
        instance[stringifySym] = stringify2;
        instance[stringifiersSym] = stringifiers;
        instance[formatOptsSym] = formatOpts;
      }
      if (typeof options.msgPrefix === "string") {
        instance[msgPrefixSym] = (this[msgPrefixSym] || "") + options.msgPrefix;
      }
      instance[chindingsSym] = asChindings(instance, bindings2);
      const childLevel = options.level || this.level;
      instance[setLevelSym](childLevel);
      this.onChild(instance);
      return instance;
    }
    function bindings() {
      const chindings = this[chindingsSym];
      const chindingsJson = `{${chindings.substr(1)}}`;
      const bindingsFromJson = JSON.parse(chindingsJson);
      delete bindingsFromJson.pid;
      delete bindingsFromJson.hostname;
      return bindingsFromJson;
    }
    function setBindings(newBindings) {
      const chindings = asChindings(this, newBindings);
      this[chindingsSym] = chindings;
      delete this[parsedChindingsSym];
    }
    function defaultMixinMergeStrategy(mergeObject, mixinObject) {
      return Object.assign(mixinObject, mergeObject);
    }
    function write(_obj, msg, num) {
      const t = this[timeSym]();
      const mixin = this[mixinSym];
      const errorKey = this[errorKeySym];
      const messageKey = this[messageKeySym];
      const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
      let obj;
      const streamWriteHook = this[hooksSym].streamWrite;
      if (_obj === void 0 || _obj === null) {
        obj = {};
      } else if (_obj instanceof Error) {
        obj = { [errorKey]: _obj };
        if (msg === void 0) {
          msg = _obj.message;
        }
      } else {
        obj = _obj;
        if (msg === void 0 && _obj[messageKey] === void 0 && _obj[errorKey]) {
          msg = _obj[errorKey].message;
        }
      }
      if (mixin) {
        obj = mixinMergeStrategy(obj, mixin(obj, num, this));
      }
      const s = this[asJsonSym](obj, msg, num, t);
      const stream = this[streamSym];
      if (stream[needsMetadataGsym] === true) {
        stream.lastLevel = num;
        stream.lastObj = obj;
        stream.lastMsg = msg;
        stream.lastTime = t.slice(this[timeSliceIndexSym]);
        stream.lastLogger = this;
      }
      stream.write(streamWriteHook ? streamWriteHook(s) : s);
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw Error("callback must be a function");
      }
      const stream = this[streamSym];
      if (typeof stream.flush === "function") {
        stream.flush(cb || noop3);
      } else if (cb) cb();
    }
  }
});

// ../../node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = __commonJS({
  "../../node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js"(exports, module) {
    "use strict";
    var { hasOwnProperty } = Object.prototype;
    var stringify2 = configure();
    stringify2.configure = configure;
    stringify2.stringify = stringify2;
    stringify2.default = stringify2;
    exports.stringify = stringify2;
    exports.configure = configure;
    module.exports = stringify2;
    var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
    function strEscape(str) {
      if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) {
        return `"${str}"`;
      }
      return JSON.stringify(str);
    }
    function sort(array, comparator) {
      if (array.length > 200 || comparator) {
        return array.sort(comparator);
      }
      for (let i = 1; i < array.length; i++) {
        const currentValue = array[i];
        let position = i;
        while (position !== 0 && array[position - 1] > currentValue) {
          array[position] = array[position - 1];
          position--;
        }
        array[position] = currentValue;
      }
      return array;
    }
    var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(
        Object.getPrototypeOf(
          new Int8Array()
        )
      ),
      Symbol.toStringTag
    ).get;
    function isTypedArrayWithEntries(value) {
      return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
    }
    function stringifyTypedArray(array, separator, maximumBreadth) {
      if (array.length < maximumBreadth) {
        maximumBreadth = array.length;
      }
      const whitespace = separator === "," ? "" : " ";
      let res = `"0":${whitespace}${array[0]}`;
      for (let i = 1; i < maximumBreadth; i++) {
        res += `${separator}"${i}":${whitespace}${array[i]}`;
      }
      return res;
    }
    function getCircularValueOption(options) {
      if (hasOwnProperty.call(options, "circularValue")) {
        const circularValue = options.circularValue;
        if (typeof circularValue === "string") {
          return `"${circularValue}"`;
        }
        if (circularValue == null) {
          return circularValue;
        }
        if (circularValue === Error || circularValue === TypeError) {
          return {
            toString() {
              throw new TypeError("Converting circular structure to JSON");
            }
          };
        }
        throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
      }
      return '"[Circular]"';
    }
    function getDeterministicOption(options) {
      let value;
      if (hasOwnProperty.call(options, "deterministic")) {
        value = options.deterministic;
        if (typeof value !== "boolean" && typeof value !== "function") {
          throw new TypeError('The "deterministic" argument must be of type boolean or comparator function');
        }
      }
      return value === void 0 ? true : value;
    }
    function getBooleanOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "boolean") {
          throw new TypeError(`The "${key}" argument must be of type boolean`);
        }
      }
      return value === void 0 ? true : value;
    }
    function getPositiveIntegerOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "number") {
          throw new TypeError(`The "${key}" argument must be of type number`);
        }
        if (!Number.isInteger(value)) {
          throw new TypeError(`The "${key}" argument must be an integer`);
        }
        if (value < 1) {
          throw new RangeError(`The "${key}" argument must be >= 1`);
        }
      }
      return value === void 0 ? Infinity : value;
    }
    function getItemCount(number) {
      if (number === 1) {
        return "1 item";
      }
      return `${number} items`;
    }
    function getUniqueReplacerSet(replacerArray) {
      const replacerSet = /* @__PURE__ */ new Set();
      for (const value of replacerArray) {
        if (typeof value === "string" || typeof value === "number") {
          replacerSet.add(String(value));
        }
      }
      return replacerSet;
    }
    function getStrictOption(options) {
      if (hasOwnProperty.call(options, "strict")) {
        const value = options.strict;
        if (typeof value !== "boolean") {
          throw new TypeError('The "strict" argument must be of type boolean');
        }
        if (value) {
          return (value2) => {
            let message = `Object can not safely be stringified. Received type ${typeof value2}`;
            if (typeof value2 !== "function") message += ` (${value2.toString()})`;
            throw new Error(message);
          };
        }
      }
    }
    function configure(options) {
      options = { ...options };
      const fail = getStrictOption(options);
      if (fail) {
        if (options.bigint === void 0) {
          options.bigint = false;
        }
        if (!("circularValue" in options)) {
          options.circularValue = Error;
        }
      }
      const circularValue = getCircularValueOption(options);
      const bigint2 = getBooleanOption(options, "bigint");
      const deterministic = getDeterministicOption(options);
      const comparator = typeof deterministic === "function" ? deterministic : void 0;
      const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
      const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
      function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
        let value = parent[key];
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        value = replacer.call(parent, key, value);
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            let join = ",";
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join;
              }
              const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let whitespace = "";
            let separator = "";
            if (spacer !== "") {
              indentation += spacer;
              join = `,
${indentation}`;
              whitespace = " ";
            }
            const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (deterministic && !isTypedArrayWithEntries(value)) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyFnReplacer(key2, value, stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
              separator = join;
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint2) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            let res = "";
            let join = ",";
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join;
              }
              const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            stack.push(value);
            let whitespace = "";
            if (spacer !== "") {
              indentation += spacer;
              join = `,
${indentation}`;
              whitespace = " ";
            }
            let separator = "";
            for (const key2 of replacer) {
              const tmp = stringifyArrayReplacer(key2, value[key2], stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join;
              }
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint2) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyIndent(key, value, stack, spacer, indentation) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifyIndent(key, value, stack, spacer, indentation);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              indentation += spacer;
              let res2 = `
${indentation}`;
              const join2 = `,
${indentation}`;
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
                res2 += tmp2 !== void 0 ? tmp2 : "null";
                res2 += join2;
              }
              const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
              res2 += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res2 += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              res2 += `
${originalIndentation}`;
              stack.pop();
              return `[${res2}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            indentation += spacer;
            const join = `,
${indentation}`;
            let res = "";
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, join, maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = join;
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyIndent(key2, value[key2], stack, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}: ${tmp}`;
                separator = join;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
              separator = join;
            }
            if (separator !== "") {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint2) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifySimple(key, value, stack) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifySimple(key, value, stack);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            const hasLength = value.length !== void 0;
            if (hasLength && Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifySimple(String(i), value[i], stack);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += ",";
              }
              const tmp = stringifySimple(String(i), value[i], stack);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `,"... ${getItemCount(removedKeys)} not stringified"`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (hasLength && isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, ",", maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = ",";
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifySimple(key2, value[key2], stack);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${tmp}`;
                separator = ",";
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint2) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringify3(value, replacer, space) {
        if (arguments.length > 1) {
          let spacer = "";
          if (typeof space === "number") {
            spacer = " ".repeat(Math.min(space, 10));
          } else if (typeof space === "string") {
            spacer = space.slice(0, 10);
          }
          if (replacer != null) {
            if (typeof replacer === "function") {
              return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
            }
            if (Array.isArray(replacer)) {
              return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
            }
          }
          if (spacer.length !== 0) {
            return stringifyIndent("", value, [], spacer, "");
          }
        }
        return stringifySimple("", value, []);
      }
      return stringify3;
    }
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/multistream.js
var require_multistream = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/multistream.js"(exports, module) {
    "use strict";
    var metadata = /* @__PURE__ */ Symbol.for("pino.metadata");
    var { DEFAULT_LEVELS } = require_constants();
    var DEFAULT_INFO_LEVEL = DEFAULT_LEVELS.info;
    function multistream(streamsArray, opts) {
      streamsArray = streamsArray || [];
      opts = opts || { dedupe: false };
      const streamLevels = Object.create(DEFAULT_LEVELS);
      streamLevels.silent = Infinity;
      if (opts.levels && typeof opts.levels === "object") {
        Object.keys(opts.levels).forEach((i) => {
          streamLevels[i] = opts.levels[i];
        });
      }
      const res = {
        write,
        add,
        remove,
        emit,
        flushSync,
        end,
        minLevel: 0,
        lastId: 0,
        streams: [],
        clone,
        [metadata]: true,
        streamLevels
      };
      if (Array.isArray(streamsArray)) {
        streamsArray.forEach(add, res);
      } else {
        add.call(res, streamsArray);
      }
      streamsArray = null;
      return res;
      function write(data) {
        let dest;
        const level = this.lastLevel;
        const { streams } = this;
        let recordedLevel = 0;
        let stream;
        for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
          dest = streams[i];
          if (dest.level <= level) {
            if (recordedLevel !== 0 && recordedLevel !== dest.level) {
              break;
            }
            stream = dest.stream;
            if (stream[metadata]) {
              const { lastTime, lastMsg, lastObj, lastLogger } = this;
              stream.lastLevel = level;
              stream.lastTime = lastTime;
              stream.lastMsg = lastMsg;
              stream.lastObj = lastObj;
              stream.lastLogger = lastLogger;
            }
            stream.write(data);
            if (opts.dedupe) {
              recordedLevel = dest.level;
            }
          } else if (!opts.dedupe) {
            break;
          }
        }
      }
      function emit(...args) {
        for (const { stream } of this.streams) {
          if (typeof stream.emit === "function") {
            stream.emit(...args);
          }
        }
      }
      function flushSync() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
        }
      }
      function add(dest) {
        if (!dest) {
          return res;
        }
        const isStream = typeof dest.write === "function" || dest.stream;
        const stream_ = dest.write ? dest : dest.stream;
        if (!isStream) {
          throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
        }
        const { streams, streamLevels: streamLevels2 } = this;
        let level;
        if (typeof dest.levelVal === "number") {
          level = dest.levelVal;
        } else if (typeof dest.level === "string") {
          level = streamLevels2[dest.level];
        } else if (typeof dest.level === "number") {
          level = dest.level;
        } else {
          level = DEFAULT_INFO_LEVEL;
        }
        const dest_ = {
          stream: stream_,
          level,
          levelVal: void 0,
          id: ++res.lastId
        };
        streams.unshift(dest_);
        streams.sort(compareByLevel);
        this.minLevel = streams[0].level;
        return res;
      }
      function remove(id) {
        const { streams } = this;
        const index2 = streams.findIndex((s) => s.id === id);
        if (index2 >= 0) {
          streams.splice(index2, 1);
          streams.sort(compareByLevel);
          this.minLevel = streams.length > 0 ? streams[0].level : -1;
        }
        return res;
      }
      function end() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
          stream.end();
        }
      }
      function clone(level) {
        const streams = new Array(this.streams.length);
        for (let i = 0; i < streams.length; i++) {
          streams[i] = {
            level,
            stream: this.streams[i].stream
          };
        }
        return {
          write,
          add,
          remove,
          minLevel: level,
          streams,
          clone,
          emit,
          flushSync,
          [metadata]: true
        };
      }
    }
    function compareByLevel(a, b2) {
      return a.level - b2.level;
    }
    function initLoopVar(length, dedupe) {
      return dedupe ? length - 1 : 0;
    }
    function adjustLoopVar(i, dedupe) {
      return dedupe ? i - 1 : i + 1;
    }
    function checkLoopVar(i, length, dedupe) {
      return dedupe ? i >= 0 : i < length;
    }
    module.exports = multistream;
  }
});

// ../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/pino.js
var require_pino = __commonJS({
  "../../node_modules/.pnpm/pino@9.14.0/node_modules/pino/pino.js"(exports, module) {
    "use strict";
    var os2 = __require("node:os");
    var stdSerializers = require_pino_std_serializers();
    var caller = require_caller();
    var redaction = require_redaction();
    var time2 = require_time();
    var proto = require_proto();
    var symbols = require_symbols();
    var { configure } = require_safe_stable_stringify();
    var { assertDefaultLevelFound, mappings, genLsCache, genLevelComparison, assertLevelComparison } = require_levels();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var {
      createArgsNormalizer,
      asChindings,
      buildSafeSonicBoom,
      buildFormatters,
      stringify: stringify2,
      normalizeDestFileDescriptor,
      noop: noop3
    } = require_tools();
    var { version: version2 } = require_meta();
    var {
      chindingsSym,
      redactFmtSym,
      serializersSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      setLevelSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      mixinSym,
      levelCompSym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    } = symbols;
    var { epochTime, nullTime } = time2;
    var { pid } = process;
    var hostname = os2.hostname();
    var defaultErrorSerializer = stdSerializers.err;
    var defaultOptions = {
      level: "info",
      levelComparison: SORTING_ORDER.ASC,
      levels: DEFAULT_LEVELS,
      messageKey: "msg",
      errorKey: "err",
      nestedKey: null,
      enabled: true,
      base: { pid, hostname },
      serializers: Object.assign(/* @__PURE__ */ Object.create(null), {
        err: defaultErrorSerializer
      }),
      formatters: Object.assign(/* @__PURE__ */ Object.create(null), {
        bindings(bindings) {
          return bindings;
        },
        level(label, number) {
          return { level: number };
        }
      }),
      hooks: {
        logMethod: void 0,
        streamWrite: void 0
      },
      timestamp: epochTime,
      name: void 0,
      redact: null,
      customLevels: null,
      useOnlyCustomLevels: false,
      depthLimit: 5,
      edgeLimit: 100
    };
    var normalize2 = createArgsNormalizer(defaultOptions);
    var serializers2 = Object.assign(/* @__PURE__ */ Object.create(null), stdSerializers);
    function pino2(...args) {
      const instance = {};
      const { opts, stream } = normalize2(instance, caller(), ...args);
      if (opts.level && typeof opts.level === "string" && DEFAULT_LEVELS[opts.level.toLowerCase()] !== void 0) opts.level = opts.level.toLowerCase();
      const {
        redact,
        crlf,
        serializers: serializers3,
        timestamp: timestamp2,
        messageKey,
        errorKey,
        nestedKey,
        base,
        name,
        level,
        customLevels,
        levelComparison,
        mixin,
        mixinMergeStrategy,
        useOnlyCustomLevels,
        formatters,
        hooks,
        depthLimit,
        edgeLimit,
        onChild,
        msgPrefix
      } = opts;
      const stringifySafe = configure({
        maximumDepth: depthLimit,
        maximumBreadth: edgeLimit
      });
      const allFormatters = buildFormatters(
        formatters.level,
        formatters.bindings,
        formatters.log
      );
      const stringifyFn = stringify2.bind({
        [stringifySafeSym]: stringifySafe
      });
      const stringifiers = redact ? redaction(redact, stringifyFn) : {};
      const formatOpts = redact ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
      const end = "}" + (crlf ? "\r\n" : "\n");
      const coreChindings = asChindings.bind(null, {
        [chindingsSym]: "",
        [serializersSym]: serializers3,
        [stringifiersSym]: stringifiers,
        [stringifySym]: stringify2,
        [stringifySafeSym]: stringifySafe,
        [formattersSym]: allFormatters
      });
      let chindings = "";
      if (base !== null) {
        if (name === void 0) {
          chindings = coreChindings(base);
        } else {
          chindings = coreChindings(Object.assign({}, base, { name }));
        }
      }
      const time3 = timestamp2 instanceof Function ? timestamp2 : timestamp2 ? epochTime : nullTime;
      const timeSliceIndex = time3().indexOf(":") + 1;
      if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
      if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
      if (msgPrefix && typeof msgPrefix !== "string") throw Error(`Unknown msgPrefix type "${typeof msgPrefix}" - expected "string"`);
      assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
      const levels = mappings(customLevels, useOnlyCustomLevels);
      if (typeof stream.emit === "function") {
        stream.emit("message", { code: "PINO_CONFIG", config: { levels, messageKey, errorKey } });
      }
      assertLevelComparison(levelComparison);
      const levelCompFunc = genLevelComparison(levelComparison);
      Object.assign(instance, {
        levels,
        [levelCompSym]: levelCompFunc,
        [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
        [streamSym]: stream,
        [timeSym]: time3,
        [timeSliceIndexSym]: timeSliceIndex,
        [stringifySym]: stringify2,
        [stringifySafeSym]: stringifySafe,
        [stringifiersSym]: stringifiers,
        [endSym]: end,
        [formatOptsSym]: formatOpts,
        [messageKeySym]: messageKey,
        [errorKeySym]: errorKey,
        [nestedKeySym]: nestedKey,
        // protect against injection
        [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
        [serializersSym]: serializers3,
        [mixinSym]: mixin,
        [mixinMergeStrategySym]: mixinMergeStrategy,
        [chindingsSym]: chindings,
        [formattersSym]: allFormatters,
        [hooksSym]: hooks,
        silent: noop3,
        onChild,
        [msgPrefixSym]: msgPrefix
      });
      Object.setPrototypeOf(instance, proto());
      genLsCache(instance);
      instance[setLevelSym](level);
      return instance;
    }
    module.exports = pino2;
    module.exports.destination = (dest = process.stdout.fd) => {
      if (typeof dest === "object") {
        dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
        return buildSafeSonicBoom(dest);
      } else {
        return buildSafeSonicBoom({ dest: normalizeDestFileDescriptor(dest), minLength: 0 });
      }
    };
    module.exports.transport = require_transport();
    module.exports.multistream = require_multistream();
    module.exports.levels = mappings();
    module.exports.stdSerializers = serializers2;
    module.exports.stdTimeFunctions = Object.assign({}, time2);
    module.exports.symbols = symbols;
    module.exports.version = version2;
    module.exports.default = pino2;
    module.exports.pino = pino2;
  }
});

// src/lib/motifs/percentage.ts
var percentageMotifs = [
  {
    id: "reverse_percentage_inference",
    topicCluster: "percentage",
    reasoningCategories: [
      "reverse-percentage",
      "hidden-base-inference"
    ],
    preferredOperations: [
      "reverse",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "wrongDenominator",
      "percentageTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      concise: 0.8,
      balanced: 0.4
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1,
      cat: 0.7
    }
  },
  {
    id: "successive_percentage_change",
    topicCluster: "percentage",
    reasoningCategories: [
      "successive-change",
      "compound-change"
    ],
    preferredOperations: [
      "transform",
      "aggregate"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "percentageTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.7
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.3
    }
  },
  {
    id: "contribution_based_growth",
    topicCluster: "percentage",
    reasoningCategories: [
      "contribution-analysis",
      "cross-comparison"
    ],
    preferredOperations: [
      "aggregate",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "partialAggregation",
      "wrongSeries"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1
    }
  }
];

// src/lib/motifs/ratio.ts
var ratioMotifs = [
  {
    id: "ratio_redistribution",
    topicCluster: "ratio-proportion",
    reasoningCategories: [
      "redistribution",
      "ratio-adjustment"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "unchangedTotalAssumption",
      "ratioInversion"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      concise: 0.5
    },
    examWeights: {
      ssc: 1.3,
      ibps: 1.1,
      rrb: 1
    }
  },
  {
    id: "common_base_comparison",
    topicCluster: "ratio-proportion",
    reasoningCategories: [
      "normalization",
      "cross-comparison"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "aggregate"
    ],
    commonDistractors: [
      "directComparison",
      "wrongNormalization"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      concise: 0.7
    },
    examWeights: {
      ssc: 1.2,
      rrb: 1.1,
      ibps: 0.9
    }
  },
  {
    id: "conditional_ratio_filtering",
    topicCluster: "ratio-proportion",
    reasoningCategories: [
      "conditional-selection",
      "filtered-comparison"
    ],
    preferredOperations: [
      "filter",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 1
    }
  }
];

// src/lib/motifs/coding-decoding.ts
var codingDecodingMotifs = [
  {
    id: "direct_alphabet_shift",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "direct-alphabet-shift",
      "simple-substitution"
    ],
    preferredOperations: [
      "transform"
    ],
    commonDistractors: [
      "arithmeticSlip",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 0.9
    }
  },
  {
    id: "reverse_alphabet_mapping",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "reverse-alphabet",
      "positional-coding"
    ],
    preferredOperations: [
      "reverse",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.6
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1,
      rrb: 1.1
    }
  },
  {
    id: "symbolic_position_encoding",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "mixed-symbol-letter-coding",
      "positional-coding"
    ],
    preferredOperations: [
      "transform",
      "compare"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 0.9
    }
  },
  {
    id: "conditional_letter_mapping",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "conditional-letter-mapping",
      "filtered-comparison"
    ],
    preferredOperations: [
      "filter",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.8
    }
  },
  {
    id: "multi_stage_word_transform",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "multi-stage-coding",
      "word-transformation-chains"
    ],
    preferredOperations: [
      "transform",
      "reverse",
      "aggregate"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.5,
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "inference_based_decoding",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "inference-based-decoding",
      "conditional-letter-mapping"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1
    }
  }
];

// src/lib/motifs/blood-relations.ts
var bloodRelationMotifs = [
  {
    id: "direct_family_relation",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "direct-family-relation",
      "single-chain-relation"
    ],
    preferredOperations: [
      "compare"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "generation_gap_reasoning",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "generation-gap-reasoning",
      "multi-person-chain-relations"
    ],
    preferredOperations: [
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 1
    }
  },
  {
    id: "gender_based_inference",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "gender-based-inference",
      "multi-person-chain-relations"
    ],
    preferredOperations: [
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "skippedCondition"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.9
    }
  },
  {
    id: "conditional_family_inference",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "conditional-family-inference",
      "nested-relationship-logic"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
      "comparisonTrap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.6,
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.1,
      sbi: 1.2,
      cat: 1.1
    }
  },
  {
    id: "circular_relation_chain",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "circular-relation-chains",
      "nested-relationship-logic"
    ],
    preferredOperations: [
      "compare",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1,
      sbi: 1
    }
  },
  {
    id: "indirect_relation_deduction",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "indirect-relation-deduction",
      "nested-relationship-logic"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "aggregate"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1
    }
  }
];

// src/lib/motifs/direction-sense.ts
var directionSenseMotifs = [
  {
    id: "straight_path_distance",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "straight-movement",
      "direct-distance"
    ],
    preferredOperations: [
      "transform",
      "compare"
    ],
    commonDistractors: [
      "arithmeticSlip",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "simple_turn_tracking",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "simple-left-right-turns",
      "orientation-changes"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.6
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "shortest_distance_inference",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "shortest-distance-inference",
      "multiple-turns"
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "cumulativeMistake"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 1
    }
  },
  {
    id: "orientation_shift_chain",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "orientation-changes",
      "coordinate-inference-chains"
    ],
    preferredOperations: [
      "transform",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "skippedCondition"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.9
    }
  },
  {
    id: "conditional_movement_reasoning",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "conditional-movement-reasoning",
      "hidden-orientation-shifts"
    ],
    preferredOperations: [
      "filter",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
      "comparisonTrap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.6,
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.1,
      sbi: 1.2,
      cat: 1.1
    }
  },
  {
    id: "coordinate_inference_chain",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "complex-directional-chains",
      "coordinate-inference-chains"
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1
    }
  }
];

// src/lib/motifs/inequality.ts
var inequalityMotifs = [
  {
    id: "direct_inequality_reading",
    topicCluster: "inequality",
    reasoningCategories: [
      "direct-inequalities",
      "basic-symbol-interpretation"
    ],
    preferredOperations: [
      "compare"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 1
    }
  },
  {
    id: "single_chain_deduction",
    topicCluster: "inequality",
    reasoningCategories: [
      "single-inference-chains",
      "basic-symbol-interpretation"
    ],
    preferredOperations: [
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.7
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "compound_inequality_linking",
    topicCluster: "inequality",
    reasoningCategories: [
      "compound-inequalities",
      "multi-statement-comparison"
    ],
    preferredOperations: [
      "compare",
      "aggregate",
      "infer"
    ],
    commonDistractors: [
      "comparisonTrap",
      "cumulativeMistake"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 0.9
    }
  },
  {
    id: "indirect_conclusion_validation",
    topicCluster: "inequality",
    reasoningCategories: [
      "indirect-conclusions",
      "multi-statement-comparison"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 0.9
    }
  },
  {
    id: "uncertain_branch_comparison",
    topicCluster: "inequality",
    reasoningCategories: [
      "uncertain-conclusions",
      "conditional-inequality-logic"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongSubsetSelection",
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.5,
      inferenceHeavy: 0.8
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1,
      sbi: 1
    }
  },
  {
    id: "nested_symbolic_reasoning",
    topicCluster: "inequality",
    reasoningCategories: [
      "nested-inference-chains",
      "mixed-symbolic-reasoning"
    ],
    preferredOperations: [
      "aggregate",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1
    }
  }
];

// src/lib/motifs/seating-arrangement.ts
var seatingArrangementMotifs = [
  {
    id: "direct_clue_linear",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "direct-placement"
    ],
    preferredOperations: [
      "compare",
      "transform"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 3],
    wordingBias: {
      concise: 0.9,
      balanced: 0.6
    },
    examWeights: {
      ssc: 1.25,
      rrb: 1.2,
      ibps: 0.9
    }
  },
  {
    id: "neighbor_clue_linear",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "neighbor-inference",
      "chained-deduction"
    ],
    preferredOperations: [
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 4],
    wordingBias: {
      concise: 0.7,
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1.2,
      sbi: 1.1
    }
  },
  {
    id: "relative_position_clue",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "chained-deduction",
      "neighbor-inference"
    ],
    preferredOperations: [
      "compare",
      "infer",
      "transform"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.7
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      cat: 1.1
    }
  },
  {
    id: "circular_opposite_chain",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "chained-deduction"
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [4, 6],
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.25,
      cat: 1.15
    }
  },
  {
    id: "row_facing_inference",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "neighbor-inference",
      "chained-deduction"
    ],
    preferredOperations: [
      "compare",
      "infer",
      "filter"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [4, 6],
    wordingBias: {
      balanced: 0.75,
      inferenceHeavy: 0.8
    },
    examWeights: {
      ibps: 1.25,
      sbi: 1.25,
      cat: 1.1
    }
  },
  {
    id: "alternate_facing_deduction",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "chained-deduction"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "transform"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [5, 7],
    wordingBias: {
      balanced: 0.65,
      inferenceHeavy: 0.9
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.3,
      cat: 1.2
    }
  },
  {
    id: "double_row_elimination",
    topicCluster: "seating-arrangement",
    reasoningCategories: [
      "chained-deduction"
    ],
    preferredOperations: [
      "filter",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [5, 7],
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.85
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.3,
      cat: 1.15
    }
  }
];

// src/lib/motifs/types.ts
function defineQuantMotif(motif) {
  return {
    domain: motif.topicCluster === "coding-decoding" || motif.topicCluster === "blood-relations" || motif.topicCluster === "inequality" || motif.topicCluster === "direction-sense" || motif.topicCluster === "ordering-ranking" || motif.topicCluster === "puzzles" || motif.topicCluster === "syllogism" || motif.topicCluster === "seating-arrangement" ? "reasoning" : "quant",
    archetype: motif.archetype ?? "general",
    difficultyProfile: {
      supportedDifficultyBands: motif.supportedDifficultyBands,
      reasoningDepthRange: motif.reasoningDepthRange,
      inferenceStyle: motif.inferenceStyle,
      examWeights: motif.examWeights
    },
    realizationHints: {
      wordingBias: motif.wordingBias,
      distractorHints: motif.commonDistractors
    },
    generationRules: {
      compatiblePatternTypes: motif.compatiblePatternTypes,
      requiredVariables: motif.requiredVariables,
      preferredOperations: motif.preferredOperations,
      supportedReasoningTypes: motif.supportedReasoningTypes,
      requiredReasoningCapabilities: motif.requiredReasoningCapabilities,
      compatibleTopics: motif.compatibleTopics,
      ruleTags: motif.reasoningCategories
    },
    ...motif
  };
}
function defineEnglishMotif(motif) {
  return motif;
}
function defineDIMotif(motif) {
  return motif;
}

// src/lib/motifs/practical-quant.ts
var practicalQuantMotifs = [
  defineQuantMotif({
    id: "hidden-base-shift",
    topicCluster: "percentage",
    archetype: "reverse-percentage",
    reasoningCategories: [
      "hidden-base-inference",
      "reverse-percentage"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongDenominator",
      "baseSwapTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 5],
    supportedDifficultyBands: [
      "Medium",
      "Hard"
    ],
    generationStrategy: [
      "hide the original base value behind a later comparison",
      "force reverse-percentage reconstruction before final arithmetic"
    ],
    parameterRanges: {
      percentageChange: {
        min: 8,
        max: 45
      },
      baseValue: {
        min: 80,
        max: 480
      }
    },
    distractorStrategies: [
      "use changed-base denominator",
      "ignore reverse step"
    ],
    difficultyTuning: {
      easy: [
        "single reverse step"
      ],
      medium: [
        "combine reverse step with comparison"
      ],
      hard: [
        "chain two hidden-base inferences"
      ]
    },
    validationRules: [
      "avoid symmetric percentage pairs",
      "require non-trivial reverse calculation"
    ],
    diversityTags: [
      "percent-base-shift",
      "reverse-reconstruction"
    ],
    rotationGroup: "quant-percentage-core",
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.7
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1.2,
      sbi: 1.1
    }
  }),
  defineQuantMotif({
    id: "reverse-percentage-bridge",
    topicCluster: "percentage",
    archetype: "reverse-percentage",
    reasoningCategories: [
      "reverse-percentage",
      "chained-percentage-ratio"
    ],
    preferredOperations: [
      "reverse",
      "transform",
      "aggregate"
    ],
    commonDistractors: [
      "netChangeConfusion",
      "partialAggregation"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "bridge two related percentage statements through one unknown",
      "ask for the original value or missing component"
    ],
    parameterRanges: {
      percentA: {
        min: 10,
        max: 35
      },
      percentB: {
        min: 5,
        max: 25
      }
    },
    distractorStrategies: [
      "treat successive changes as additive",
      "drop one bridge condition"
    ],
    difficultyTuning: {
      medium: [
        "one linked bridge"
      ],
      hard: [
        "two-stage bridge with hidden total"
      ]
    },
    validationRules: [
      "ensure integral final answer"
    ],
    diversityTags: [
      "successive-change",
      "linked-percent"
    ],
    rotationGroup: "quant-percentage-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.75
    },
    examWeights: {
      ibps: 1.15,
      sbi: 1.2
    }
  }),
  defineQuantMotif({
    id: "ratio-normalization-switch",
    topicCluster: "ratio-proportion",
    archetype: "ratio-trap",
    reasoningCategories: [
      "normalization",
      "cross-comparison"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "aggregate"
    ],
    commonDistractors: [
      "directComparison",
      "wrongNormalization"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "present ratios on different totals",
      "force common-base normalization before comparison"
    ],
    parameterRanges: {
      ratioPart: {
        min: 2,
        max: 11
      },
      totalValue: {
        min: 60,
        max: 360
      }
    },
    distractorStrategies: [
      "compare raw ratio parts",
      "normalize only one side"
    ],
    difficultyTuning: {
      easy: [
        "single normalization"
      ],
      medium: [
        "normalization plus transfer"
      ],
      hard: [
        "hidden total after normalization"
      ]
    },
    validationRules: [
      "keep ratios reducible but non-trivial"
    ],
    diversityTags: [
      "ratio-normalization"
    ],
    rotationGroup: "quant-ratio-core",
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.2,
      rrb: 1.1
    }
  }),
  defineQuantMotif({
    id: "partnership-ratio-switch",
    topicCluster: "ratio-proportion",
    archetype: "ratio-trap",
    reasoningCategories: [
      "ratio-adjustment",
      "conditional-selection"
    ],
    preferredOperations: [
      "transform",
      "infer",
      "filter"
    ],
    commonDistractors: [
      "timeIgnored",
      "ratioInversion"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "change one ratio driver mid-problem",
      "force part-time or weighted contribution reasoning"
    ],
    parameterRanges: {
      contributionMonths: {
        min: 3,
        max: 12
      }
    },
    distractorStrategies: [
      "ignore timing switch",
      "apply final ratio throughout"
    ],
    difficultyTuning: {
      medium: [
        "one partner joins late"
      ],
      hard: [
        "join-and-leave contribution mix"
      ]
    },
    validationRules: [
      "ensure contribution shares remain integral"
    ],
    diversityTags: [
      "ratio-time-weight"
    ],
    rotationGroup: "quant-ratio-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.7
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.15
    }
  }),
  defineQuantMotif({
    id: "weighted-average-confusion",
    topicCluster: "averages",
    archetype: "general",
    reasoningCategories: [
      "average-transformation",
      "comparison-chain"
    ],
    preferredOperations: [
      "aggregate",
      "compare",
      "transform"
    ],
    commonDistractors: [
      "simpleMeanTrap",
      "wrongGroupSize"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "split data into unequal groups",
      "force weighted average instead of direct mean"
    ],
    parameterRanges: {
      groupA: {
        min: 3,
        max: 10
      },
      groupB: {
        min: 2,
        max: 8
      }
    },
    distractorStrategies: [
      "take simple mean of subgroup averages",
      "swap subgroup sizes"
    ],
    difficultyTuning: {
      easy: [
        "two groups only"
      ],
      medium: [
        "weighted merge with missing total"
      ],
      hard: [
        "replacement or removal after weighted merge"
      ]
    },
    validationRules: [
      "avoid equal group sizes for weighted motifs"
    ],
    diversityTags: [
      "weighted-average"
    ],
    rotationGroup: "quant-averages-core",
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1.2
    }
  }),
  defineQuantMotif({
    id: "replacement-average-shift",
    topicCluster: "averages",
    archetype: "general",
    reasoningCategories: [
      "average-transformation",
      "hidden-base-inference"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "differenceSignError",
      "wrongCountUsage"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "replace one or more observations",
      "solve through average delta and count"
    ],
    parameterRanges: {
      itemCount: {
        min: 4,
        max: 15
      }
    },
    distractorStrategies: [
      "apply change to one value instead of total",
      "forget multiplication by count"
    ],
    difficultyTuning: {
      medium: [
        "single replacement"
      ],
      hard: [
        "multiple replacements with missing original"
      ]
    },
    validationRules: [
      "keep average shifts integer-friendly"
    ],
    diversityTags: [
      "average-replacement"
    ],
    rotationGroup: "quant-averages-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1
    }
  }),
  defineQuantMotif({
    id: "discount-profit-link",
    topicCluster: "profit-loss",
    archetype: "general",
    reasoningCategories: [
      "comparative-conditional-inference"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "sameBaseAssumption",
      "marginDiscountMixup"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "link marked price, discount, and profit through one unknown cost price"
    ],
    parameterRanges: {
      discountPercent: {
        min: 5,
        max: 35
      },
      profitPercent: {
        min: 8,
        max: 40
      }
    },
    distractorStrategies: [
      "take profit percent on marked price",
      "subtract discount directly from profit"
    ],
    difficultyTuning: {
      easy: [
        "single discount-profit relation"
      ],
      medium: [
        "marked price backsolve"
      ],
      hard: [
        "successive discount before profit target"
      ]
    },
    validationRules: [
      "keep cost price positive and integral"
    ],
    diversityTags: [
      "marked-price-bridge"
    ],
    rotationGroup: "quant-profit-loss-core",
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.15
    }
  }),
  defineQuantMotif({
    id: "successive-discount-margin",
    topicCluster: "profit-loss",
    archetype: "general",
    reasoningCategories: [
      "multi-step-arithmetic"
    ],
    preferredOperations: [
      "aggregate",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "additiveDiscountError",
      "wrongFinalBase"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "use two discounts or discount-plus-rebate",
      "ask effective profit, loss, or marked price"
    ],
    parameterRanges: {
      discountOne: {
        min: 5,
        max: 25
      },
      discountTwo: {
        min: 5,
        max: 20
      }
    },
    distractorStrategies: [
      "add discounts directly",
      "take net change from cost price"
    ],
    difficultyTuning: {
      medium: [
        "two successive discounts"
      ],
      hard: [
        "discount chain with target margin"
      ]
    },
    validationRules: [
      "avoid identical discount percentages"
    ],
    diversityTags: [
      "successive-discount"
    ],
    rotationGroup: "quant-profit-loss-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.65
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.15
    }
  }),
  defineQuantMotif({
    id: "compounding-trap",
    topicCluster: "si-ci",
    archetype: "general",
    reasoningCategories: [
      "compound-change",
      "nested-operations"
    ],
    preferredOperations: [
      "aggregate",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "simpleInterestSubstitution",
      "wrongPeriodRate"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "compare SI and CI or compare different compounding schedules"
    ],
    parameterRanges: {
      rate: {
        min: 4,
        max: 18
      },
      years: {
        min: 2,
        max: 4
      }
    },
    distractorStrategies: [
      "apply simple interest formula to CI",
      "forget compounding frequency change"
    ],
    difficultyTuning: {
      medium: [
        "two-year SI-CI difference"
      ],
      hard: [
        "quarterly or half-yearly compounding"
      ]
    },
    validationRules: [
      "keep resulting interest values manageable"
    ],
    diversityTags: [
      "si-ci-contrast"
    ],
    rotationGroup: "quant-interest-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      ssc: 1,
      ibps: 1.2,
      sbi: 1.25
    }
  }),
  defineQuantMotif({
    id: "interest-difference-backsolve",
    topicCluster: "si-ci",
    archetype: "general",
    reasoningCategories: [
      "hidden-base-inference",
      "multi-step-arithmetic"
    ],
    preferredOperations: [
      "reverse",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "principalSlip",
      "rateTimeSwap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 5],
    generationStrategy: [
      "provide interest difference and one auxiliary condition",
      "backsolve principal or rate"
    ],
    parameterRanges: {
      principal: {
        min: 500,
        max: 5e3
      }
    },
    distractorStrategies: [
      "treat difference as annual interest",
      "swap rate and time variables"
    ],
    difficultyTuning: {
      medium: [
        "solve principal from one difference"
      ],
      hard: [
        "solve rate with compound frequency change"
      ]
    },
    validationRules: [
      "ensure unique principal-rate combination"
    ],
    diversityTags: [
      "interest-backsolve"
    ],
    rotationGroup: "quant-interest-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.7
    },
    examWeights: {
      ibps: 1.15,
      sbi: 1.2
    }
  }),
  defineQuantMotif({
    id: "efficiency-substitution",
    topicCluster: "time-work",
    archetype: "general",
    reasoningCategories: [
      "conditional-ratio-logic",
      "multi-step-arithmetic"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "directTimeAdd",
      "wrongEfficiencyBase"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "substitute workers or machines with equivalent efficiency ratios"
    ],
    parameterRanges: {
      workerCount: {
        min: 2,
        max: 6
      },
      totalWork: {
        min: 24,
        max: 240
      }
    },
    distractorStrategies: [
      "add times instead of rates",
      "ignore efficiency equivalence"
    ],
    difficultyTuning: {
      easy: [
        "two-worker equivalence"
      ],
      medium: [
        "team replacement"
      ],
      hard: [
        "partial work before substitution"
      ]
    },
    validationRules: [
      "prefer integral unit rates",
      "avoid trivial LCMs"
    ],
    diversityTags: [
      "efficiency-map"
    ],
    rotationGroup: "quant-time-work-core",
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.15,
      ibps: 1.2
    }
  }),
  defineQuantMotif({
    id: "inverse-work-trap",
    topicCluster: "time-work",
    archetype: "general",
    reasoningCategories: [
      "conditional-ratio-logic"
    ],
    preferredOperations: [
      "reverse",
      "compare",
      "filter"
    ],
    commonDistractors: [
      "inverseRelationMiss",
      "rateTimeSwap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "hide the inverse time-rate relationship behind productivity comparisons"
    ],
    parameterRanges: {
      dayCount: {
        min: 4,
        max: 24
      }
    },
    distractorStrategies: [
      "use direct proportion instead of inverse proportion"
    ],
    difficultyTuning: {
      medium: [
        "one inverse relation"
      ],
      hard: [
        "inverse relation plus join/leave event"
      ]
    },
    validationRules: [
      "ensure final work fraction is clean"
    ],
    diversityTags: [
      "inverse-work"
    ],
    rotationGroup: "quant-time-work-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      ssc: 1.1,
      rrb: 1.1,
      ibps: 1.1
    }
  }),
  defineQuantMotif({
    id: "relative-speed-meet",
    topicCluster: "speed-time-distance",
    archetype: "general",
    reasoningCategories: [
      "comparison-chain",
      "multi-step-arithmetic"
    ],
    preferredOperations: [
      "compare",
      "aggregate",
      "infer"
    ],
    commonDistractors: [
      "sameDirectionTrap",
      "unitMismatch"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "build meet-or-overtake scenarios around relative speed"
    ],
    parameterRanges: {
      speedA: {
        min: 18,
        max: 90
      },
      speedB: {
        min: 12,
        max: 80
      }
    },
    distractorStrategies: [
      "add speeds when subtraction is needed",
      "ignore unit conversion"
    ],
    difficultyTuning: {
      easy: [
        "same-direction catch-up"
      ],
      medium: [
        "opposite-direction meet"
      ],
      hard: [
        "delay plus relative speed"
      ]
    },
    validationRules: [
      "convert to one unit system internally"
    ],
    diversityTags: [
      "relative-speed"
    ],
    rotationGroup: "quant-std-core",
    wordingBias: {
      concise: 0.5,
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1
    }
  }),
  defineQuantMotif({
    id: "train-platform-offset",
    topicCluster: "speed-time-distance",
    archetype: "general",
    reasoningCategories: [
      "hidden-base-inference"
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "compare"
    ],
    commonDistractors: [
      "lengthIgnored",
      "secondsHoursConfusion"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "link passing time with train and platform length"
    ],
    parameterRanges: {
      trainLength: {
        min: 90,
        max: 360
      },
      platformLength: {
        min: 60,
        max: 300
      }
    },
    distractorStrategies: [
      "use only platform length",
      "forget to add train length"
    ],
    difficultyTuning: {
      medium: [
        "single platform crossing"
      ],
      hard: [
        "two crossings with changed speed"
      ]
    },
    validationRules: [
      "keep speed-time conversion clean"
    ],
    diversityTags: [
      "train-passing"
    ],
    rotationGroup: "quant-std-core",
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.2,
      rrb: 1.1
    }
  }),
  defineQuantMotif({
    id: "weighted-mixture-shift",
    topicCluster: "mixture-alligation",
    archetype: "general",
    reasoningCategories: [
      "ratio-conversion",
      "comparative-conditional-inference"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "wrongBaseVolume",
      "straightAverageTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "mix two concentrations and shift one component after blending"
    ],
    parameterRanges: {
      concentrationA: {
        min: 10,
        max: 60
      },
      concentrationB: {
        min: 5,
        max: 45
      }
    },
    distractorStrategies: [
      "take direct average of concentrations",
      "ignore replacement after mixing"
    ],
    difficultyTuning: {
      medium: [
        "single alligation step"
      ],
      hard: [
        "alligation plus replacement"
      ]
    },
    validationRules: [
      "ensure concentration remains bounded"
    ],
    diversityTags: [
      "alligation-core"
    ],
    rotationGroup: "quant-mixture-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      ibps: 1.15,
      sbi: 1.15
    }
  }),
  defineQuantMotif({
    id: "replacement-alligation",
    topicCluster: "mixture-alligation",
    archetype: "general",
    reasoningCategories: [
      "conditional-ratio-logic"
    ],
    preferredOperations: [
      "filter",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "netVolumeIgnored",
      "wrongReplacementRatio"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "remove-and-replace equal quantity to reach target concentration"
    ],
    parameterRanges: {
      containerVolume: {
        min: 20,
        max: 120
      }
    },
    distractorStrategies: [
      "adjust concentration without removal",
      "use wrong repeated replacement formula"
    ],
    difficultyTuning: {
      medium: [
        "single replacement"
      ],
      hard: [
        "repeated replacement"
      ]
    },
    validationRules: [
      "avoid degenerate 0% or 100% concentrations"
    ],
    diversityTags: [
      "replacement-mixture"
    ],
    rotationGroup: "quant-mixture-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.7
    },
    examWeights: {
      ssc: 1,
      ibps: 1.2
    }
  }),
  defineQuantMotif({
    id: "equation-balance-shift",
    topicCluster: "algebra-basics",
    archetype: "general",
    reasoningCategories: [
      "one-step-arithmetic",
      "hidden-base-inference"
    ],
    preferredOperations: [
      "transform",
      "reverse",
      "compare"
    ],
    commonDistractors: [
      "signError",
      "wrongTransposition"
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [2, 4],
    generationStrategy: [
      "embed one linear relation inside another comparison or condition"
    ],
    parameterRanges: {
      coefficient: {
        min: 2,
        max: 12
      }
    },
    distractorStrategies: [
      "flip sign while transposing",
      "divide before simplification"
    ],
    difficultyTuning: {
      easy: [
        "one linear equation"
      ],
      medium: [
        "equation plus condition"
      ],
      hard: [
        "two variables with elimination hint"
      ]
    },
    validationRules: [
      "ensure unique solution"
    ],
    diversityTags: [
      "algebra-linear"
    ],
    rotationGroup: "quant-algebra-core",
    wordingBias: {
      concise: 0.6,
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.1,
      cat: 0.9
    }
  }),
  defineQuantMotif({
    id: "variable-elimination",
    topicCluster: "algebra-basics",
    archetype: "general",
    reasoningCategories: [
      "multi-step-arithmetic",
      "comparison-chain"
    ],
    preferredOperations: [
      "aggregate",
      "transform",
      "infer"
    ],
    commonDistractors: [
      "coefficientMismatch",
      "substitutionSlip"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 5],
    generationStrategy: [
      "solve paired equations through elimination or substitution"
    ],
    parameterRanges: {
      constant: {
        min: 6,
        max: 80
      }
    },
    distractorStrategies: [
      "equate wrong coefficients",
      "substitute partial expression only"
    ],
    difficultyTuning: {
      medium: [
        "two-variable elimination"
      ],
      hard: [
        "parameterized elimination with one hidden relation"
      ]
    },
    validationRules: [
      "avoid dependent systems"
    ],
    diversityTags: [
      "algebra-elimination"
    ],
    rotationGroup: "quant-algebra-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      cat: 1.1,
      ssc: 1
    }
  }),
  defineQuantMotif({
    id: "dimension-scale-effect",
    topicCluster: "mensuration",
    archetype: "general",
    reasoningCategories: [
      "comparative-conditional-inference"
    ],
    preferredOperations: [
      "transform",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "linearAreaMixup",
      "areaVolumeMixup"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "change one dimension and ask area or volume effect"
    ],
    parameterRanges: {
      scaleFactor: {
        min: 2,
        max: 5
      }
    },
    distractorStrategies: [
      "apply linear factor to area or volume",
      "square when cube is needed"
    ],
    difficultyTuning: {
      easy: [
        "single-dimension area change"
      ],
      medium: [
        "multi-dimension scale change"
      ],
      hard: [
        "reverse scale inference from area or volume"
      ]
    },
    validationRules: [
      "keep geometry primitive recognizable"
    ],
    diversityTags: [
      "mensuration-scaling"
    ],
    rotationGroup: "quant-mensuration-core",
    wordingBias: {
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.15,
      rrb: 1.05
    }
  }),
  defineQuantMotif({
    id: "composite-shape-breakdown",
    topicCluster: "mensuration",
    archetype: "general",
    reasoningCategories: [
      "multi-step-arithmetic"
    ],
    preferredOperations: [
      "aggregate",
      "transform",
      "compare"
    ],
    commonDistractors: [
      "missedSubshape",
      "perimeterAreaSwap"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "decompose a composite shape into standard pieces before solving"
    ],
    parameterRanges: {
      sideLength: {
        min: 4,
        max: 30
      }
    },
    distractorStrategies: [
      "drop one component shape",
      "use area formula for perimeter target"
    ],
    difficultyTuning: {
      medium: [
        "two-piece breakdown"
      ],
      hard: [
        "surface or volume composite breakdown"
      ]
    },
    validationRules: [
      "avoid ambiguous composite geometry"
    ],
    diversityTags: [
      "mensuration-composite"
    ],
    rotationGroup: "quant-mensuration-core",
    wordingBias: {
      balanced: 0.75,
      inferenceHeavy: 0.65
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1
    }
  })
];

// src/lib/motifs/practical-reasoning.ts
var practicalReasoningMotifs = [
  defineQuantMotif({
    id: "seating-sparse-anchor",
    topicCluster: "seating-arrangement",
    archetype: "elimination-chain",
    reasoningCategories: [
      "sparse-anchor",
      "indirect-elimination"
    ],
    preferredOperations: [
      "infer",
      "filter",
      "compare"
    ],
    commonDistractors: [
      "premature-end-fix",
      "adjacencyChainTrap"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [4, 6],
    generationStrategy: [
      "minimize direct seat locks",
      "force progress through relative clues and elimination"
    ],
    parameterRanges: {
      participantCount: {
        min: 5,
        max: 8
      }
    },
    distractorStrategies: [
      "symmetric mirror case",
      "incorrect extreme assumption"
    ],
    difficultyTuning: {
      easy: [
        "one anchor plus one relative chain"
      ],
      medium: [
        "single weak anchor with elimination"
      ],
      hard: [
        "no direct anchor beyond orientation"
      ]
    },
    validationRules: [
      "reject direct serialization chains",
      "require unique solution after clue minimization"
    ],
    diversityTags: [
      "sparse-anchor",
      "non-serial-seating"
    ],
    rotationGroup: "reasoning-seating-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.85
    },
    examWeights: {
      ssc: 1,
      ibps: 1.2,
      sbi: 1.2
    }
  }),
  defineQuantMotif({
    id: "seating-indirect-elimination",
    topicCluster: "seating-arrangement",
    archetype: "elimination-chain",
    reasoningCategories: [
      "indirect-elimination",
      "case-analysis"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "wrongCaseRetention",
      "prematureNeighborLock"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [5, 7],
    generationStrategy: [
      "build one or two case splits that collapse through contradiction"
    ],
    parameterRanges: {
      clueCount: {
        min: 5,
        max: 8
      }
    },
    distractorStrategies: [
      "retain eliminated mirror case",
      "forget exclusion clue"
    ],
    difficultyTuning: {
      medium: [
        "single contradiction case"
      ],
      hard: [
        "two linked eliminations"
      ]
    },
    validationRules: [
      "at least 40 percent interactive clues",
      "keep clue set minimal"
    ],
    diversityTags: [
      "case-elimination"
    ],
    rotationGroup: "reasoning-seating-core",
    wordingBias: {
      balanced: 0.65,
      inferenceHeavy: 0.9
    },
    examWeights: {
      ibps: 1.25,
      sbi: 1.25,
      cat: 1.1
    }
  }),
  defineQuantMotif({
    id: "seating-orientation-inversion",
    topicCluster: "seating-arrangement",
    archetype: "relative-placement",
    reasoningCategories: [
      "orientation-flip",
      "facing-inversion"
    ],
    preferredOperations: [
      "transform",
      "infer",
      "filter"
    ],
    commonDistractors: [
      "observerLeftRightSwap",
      "oppositeSeatConfusion"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [5, 8],
    generationStrategy: [
      "use alternate-facing or double-row geometry where left-right flips matter"
    ],
    parameterRanges: {
      participantCount: {
        min: 6,
        max: 10
      }
    },
    distractorStrategies: [
      "keep global left-right interpretation",
      "ignore facing state"
    ],
    difficultyTuning: {
      medium: [
        "single facing flip"
      ],
      hard: [
        "multiple flips across rows"
      ]
    },
    validationRules: [
      "must include at least one facing-sensitive clue"
    ],
    diversityTags: [
      "orientation-flip"
    ],
    rotationGroup: "reasoning-seating-core",
    wordingBias: {
      balanced: 0.6,
      inferenceHeavy: 0.9
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.3,
      cat: 1.15
    }
  }),
  defineQuantMotif({
    id: "ordering-dual-rank-offset",
    topicCluster: "ordering-ranking",
    archetype: "relative-placement",
    reasoningCategories: [
      "rank-offset",
      "dual-reference"
    ],
    preferredOperations: [
      "compare",
      "infer",
      "transform"
    ],
    commonDistractors: [
      "topBottomSwap",
      "middleCountOffByOne"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "combine rank from top and rank from bottom with one positional offset"
    ],
    parameterRanges: {
      participantCount: {
        min: 6,
        max: 14
      }
    },
    distractorStrategies: [
      "count inclusive instead of exclusive",
      "use same reference direction twice"
    ],
    difficultyTuning: {
      easy: [
        "single combined rank"
      ],
      medium: [
        "rank plus neighbor relation"
      ],
      hard: [
        "multiple offset references"
      ]
    },
    validationRules: [
      "avoid direct final-position clue"
    ],
    diversityTags: [
      "ranking-offset"
    ],
    rotationGroup: "reasoning-ranking-core",
    wordingBias: {
      concise: 0.6,
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.2,
      rrb: 1.1
    }
  }),
  defineQuantMotif({
    id: "ordering-middle-elimination",
    topicCluster: "ordering-ranking",
    archetype: "elimination-chain",
    reasoningCategories: [
      "middle-position",
      "indirect-elimination"
    ],
    preferredOperations: [
      "filter",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "centerPairConfusion",
      "endBias"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    generationStrategy: [
      "use middle-band restrictions and relative rank clues"
    ],
    parameterRanges: {
      participantCount: {
        min: 7,
        max: 12
      }
    },
    distractorStrategies: [
      "lock the exact middle too early",
      "forget odd-even seat effect"
    ],
    difficultyTuning: {
      medium: [
        "single middle restriction"
      ],
      hard: [
        "middle restriction plus directional ordering"
      ]
    },
    validationRules: [
      "require at least one non-direct interaction clue"
    ],
    diversityTags: [
      "ranking-middle-band"
    ],
    rotationGroup: "reasoning-ranking-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1
    }
  }),
  defineQuantMotif({
    id: "multi-variable-grid",
    topicCluster: "puzzles",
    archetype: "elimination-chain",
    reasoningCategories: [
      "multi-variable-grid",
      "cross-attribute-elimination"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare"
    ],
    commonDistractors: [
      "single-dimension-lock",
      "attributeCarryoverMistake"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [5, 8],
    generationStrategy: [
      "link two or three attributes through sparse cross-constraints"
    ],
    parameterRanges: {
      entityCount: {
        min: 4,
        max: 6
      }
    },
    distractorStrategies: [
      "assign attribute independently",
      "ignore one grid axis"
    ],
    difficultyTuning: {
      medium: [
        "two attributes"
      ],
      hard: [
        "three attributes with one case split"
      ]
    },
    validationRules: [
      "require unique full mapping",
      "avoid direct one-to-one clue dump"
    ],
    diversityTags: [
      "grid-puzzle"
    ],
    rotationGroup: "reasoning-puzzle-core",
    wordingBias: {
      balanced: 0.7,
      inferenceHeavy: 0.85
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.25,
      cat: 1.1
    }
  }),
  defineQuantMotif({
    id: "case-split-puzzle",
    topicCluster: "puzzles",
    archetype: "elimination-chain",
    reasoningCategories: [
      "case-analysis",
      "indirect-elimination"
    ],
    preferredOperations: [
      "filter",
      "infer",
      "transform"
    ],
    commonDistractors: [
      "unresolvedCaseCarry",
      "duplicateAssignment"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [5, 8],
    generationStrategy: [
      "start with an ambiguity that branches into two viable mini-cases"
    ],
    parameterRanges: {
      entityCount: {
        min: 4,
        max: 7
      }
    },
    distractorStrategies: [
      "forget eliminated branch",
      "collapse both branches into one hybrid answer"
    ],
    difficultyTuning: {
      medium: [
        "single binary branch"
      ],
      hard: [
        "branch plus attribute dependency"
      ]
    },
    validationRules: [
      "only one surviving branch at the end"
    ],
    diversityTags: [
      "branching-puzzle"
    ],
    rotationGroup: "reasoning-puzzle-core",
    wordingBias: {
      balanced: 0.65,
      inferenceHeavy: 0.9
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      cat: 1.15
    }
  }),
  defineQuantMotif({
    id: "possibility-conclusion-trap",
    topicCluster: "syllogism",
    archetype: "general",
    reasoningCategories: [
      "possibility-check",
      "conclusion-filtering"
    ],
    preferredOperations: [
      "filter",
      "compare",
      "infer"
    ],
    commonDistractors: [
      "definiteVsPossibleMixup",
      "reverseContainment"
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    generationStrategy: [
      "mix definite and possibility conclusions against tight statements"
    ],
    parameterRanges: {
      statementCount: {
        min: 2,
        max: 4
      }
    },
    distractorStrategies: [
      "promote possibility to certainty",
      "infer converse relation"
    ],
    difficultyTuning: {
      easy: [
        "basic possibility vs certainty"
      ],
      medium: [
        "mixed positive and negative conclusions"
      ],
      hard: [
        "linked possibility across three sets"
      ]
    },
    validationRules: [
      "keep one unambiguous answer option"
    ],
    diversityTags: [
      "syllogism-possibility"
    ],
    rotationGroup: "reasoning-syllogism-core",
    wordingBias: {
      concise: 0.7,
      balanced: 0.8
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1
    }
  }),
  defineQuantMotif({
    id: "venn-overlap-filter",
    topicCluster: "syllogism",
    archetype: "general",
    reasoningCategories: [
      "overlap-inference",
      "statement-combo-check"
    ],
    preferredOperations: [
      "compare",
      "infer",
      "filter"
    ],
    commonDistractors: [
      "allSomeSwap",
      "nonOverlapAssumption"
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 5],
    generationStrategy: [
      "compose statements that require careful overlap reasoning, not rote Venn drawing"
    ],
    parameterRanges: {
      statementCount: {
        min: 3,
        max: 4
      }
    },
    distractorStrategies: [
      "assume disjointness without support",
      "convert partial overlap into subset"
    ],
    difficultyTuning: {
      medium: [
        "three-set overlap"
      ],
      hard: [
        "overlap plus negative conclusion"
      ]
    },
    validationRules: [
      "avoid duplicate logical conclusions"
    ],
    diversityTags: [
      "syllogism-overlap"
    ],
    rotationGroup: "reasoning-syllogism-core",
    wordingBias: {
      balanced: 0.75
    },
    examWeights: {
      ssc: 1.1,
      ibps: 1.15
    }
  })
];

// src/lib/motifs/english.ts
var englishMotifs = [
  defineEnglishMotif({
    id: "subject_verb_ambiguity",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-ambiguity",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        sbi: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        concise: 0.5,
        balanced: 0.8
      },
      explanationStyle: [
        "agreement-based elimination"
      ],
      distractorHints: [
        "number agreement trap",
        "intervening phrase confusion"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "conditional",
        "inferential"
      ],
      ruleTags: [
        "subject-verb agreement",
        "intervening phrase"
      ]
    },
    triggerPatterns: [
      "prepositional phrase between subject and verb",
      "collective noun disagreement"
    ],
    ambiguityTags: [
      "agreement",
      "modifier-distance"
    ],
    commonDistractors: [
      "nearest-noun agreement",
      "plural lure"
    ],
    generationStrategy: [
      "insert a misleading noun between the true subject and verb",
      "keep one dominant grammar fault per item"
    ],
    parameterRanges: {
      clauseCount: {
        min: 1,
        max: 2
      }
    },
    distractorStrategies: [
      "nearest-noun lure",
      "collective-noun confusion"
    ],
    difficultyTuning: {
      easy: [
        "single interrupting phrase"
      ],
      medium: [
        "collective noun plus interrupting phrase"
      ],
      hard: [
        "compound subject with distractor noun"
      ]
    },
    validationRules: [
      "keep exactly one best correction",
      "avoid overlapping grammar faults"
    ],
    diversityTags: [
      "sva-core"
    ],
    rotationGroup: "english-error-spotting-core"
  }),
  defineEnglishMotif({
    id: "modifier_attachment_trap",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [3, 6],
      inferenceStyle: "hidden",
      examWeights: {
        cat: 1.25,
        ibps: 1
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8
      },
      explanationStyle: [
        "attachment resolution"
      ],
      distractorHints: [
        "misplaced modifier",
        "pronoun reference confusion"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "inferential",
        "multi-step"
      ],
      ruleTags: [
        "modifier-attachment",
        "reference-resolution"
      ]
    },
    triggerPatterns: [
      "dangling participle",
      "ambiguous relative clause"
    ],
    ambiguityTags: [
      "attachment",
      "reference"
    ],
    commonDistractors: [
      "nearest-clause attachment",
      "parallelism distraction"
    ],
    generationStrategy: [
      "use a misplaced or dangling modifier with one grammatically clean fix"
    ],
    distractorStrategies: [
      "nearest-clause attachment",
      "reference drift"
    ],
    difficultyTuning: {
      medium: [
        "single dangling modifier"
      ],
      hard: [
        "modifier plus pronoun-reference ambiguity"
      ]
    },
    validationRules: [
      "ensure only one option resolves attachment cleanly"
    ],
    diversityTags: [
      "modifier-attachment"
    ],
    rotationGroup: "english-sentence-improvement-core"
  }),
  defineEnglishMotif({
    id: "tense-confusion",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
        sbi: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        concise: 0.5,
        balanced: 0.85
      },
      explanationStyle: [
        "timeline consistency check"
      ],
      distractorHints: [
        "tense sequence mismatch",
        "perfect vs simple confusion"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "conditional",
        "inferential"
      ],
      ruleTags: [
        "tense agreement",
        "sequence of tense"
      ]
    },
    triggerPatterns: [
      "time marker conflicts with verb tense",
      "reported past event uses present perfect incorrectly"
    ],
    ambiguityTags: [
      "timeline",
      "aspect"
    ],
    commonDistractors: [
      "simple-vs-perfect",
      "present-vs-past lure"
    ],
    generationStrategy: [
      "anchor a sentence with a strong time cue and vary tense choices around it"
    ],
    distractorStrategies: [
      "swap simple and perfect forms",
      "use locally plausible but globally inconsistent tense"
    ],
    difficultyTuning: {
      easy: [
        "single time marker mismatch"
      ],
      medium: [
        "two-clause tense consistency"
      ],
      hard: [
        "narrative sequence with aspect trap"
      ]
    },
    validationRules: [
      "one dominant tense error only"
    ],
    diversityTags: [
      "tense-sequence"
    ],
    rotationGroup: "english-error-spotting-core"
  }),
  defineEnglishMotif({
    id: "article-misuse",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium"
      ],
      reasoningDepthRange: [1, 3],
      inferenceStyle: "direct",
      examWeights: {
        ssc: 1.2,
        rrb: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        concise: 0.8,
        balanced: 0.6
      },
      explanationStyle: [
        "article usage rule"
      ],
      distractorHints: [
        "a/an swap",
        "zero-article trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "direct"
      ],
      ruleTags: [
        "article usage"
      ]
    },
    triggerPatterns: [
      "vowel-sound mismatch",
      "generic noun with unnecessary article"
    ],
    ambiguityTags: [
      "article"
    ],
    commonDistractors: [
      "sound-spelling confusion",
      "generic-specific swap"
    ],
    generationStrategy: [
      "keep the sentence short and center the question on one article decision"
    ],
    distractorStrategies: [
      "use orthographic vowel instead of vowel sound",
      "mix generic and specific article usage"
    ],
    difficultyTuning: {
      easy: [
        "single article correction"
      ],
      medium: [
        "article plus countability context"
      ]
    },
    validationRules: [
      "avoid multiple grammar faults"
    ],
    diversityTags: [
      "article-usage"
    ],
    rotationGroup: "english-error-spotting-core"
  }),
  defineEnglishMotif({
    id: "contextual-antonym-trap",
    domain: "english",
    subdomain: "vocabulary",
    archetype: "grammar-ambiguity",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 4],
      inferenceStyle: "hidden",
      examWeights: {
        ibps: 1.1,
        sbi: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.75
      },
      explanationStyle: [
        "context fit over surface polarity"
      ],
      distractorHints: [
        "tone-match lure",
        "opposite-meaning trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "conditional",
        "inferential"
      ],
      ruleTags: [
        "fillers",
        "contextual vocabulary"
      ]
    },
    triggerPatterns: [
      "blank requires contextual opposite, not dictionary opposite"
    ],
    ambiguityTags: [
      "tone",
      "context"
    ],
    commonDistractors: [
      "near-synonym lure",
      "surface-antonym lure"
    ],
    generationStrategy: [
      "build filler sentences where local tone and global meaning disagree with obvious lexical choice"
    ],
    distractorStrategies: [
      "place one semantically close but context-wrong option",
      "place one tone-compatible but meaning-wrong option"
    ],
    difficultyTuning: {
      medium: [
        "single blank with tonal cue"
      ],
      hard: [
        "double blank with cross-blank dependency"
      ]
    },
    validationRules: [
      "one best contextual fit only"
    ],
    diversityTags: [
      "fillers-context"
    ],
    rotationGroup: "english-fillers-core"
  }),
  defineEnglishMotif({
    id: "logical-sequencing-anchor",
    domain: "english",
    subdomain: "grammar",
    archetype: "general",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [3, 5],
      inferenceStyle: "conditional",
      examWeights: {
        cat: 1.2,
        ibps: 1
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.75
      },
      explanationStyle: [
        "identify opening line and reference chain"
      ],
      distractorHints: [
        "false opener",
        "reference-link mismatch"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "multi-step",
        "inferential"
      ],
      ruleTags: [
        "para-jumbles",
        "coherence"
      ]
    },
    triggerPatterns: [
      "one sentence introduces topic while later sentence contains pronoun or contrast marker"
    ],
    ambiguityTags: [
      "ordering",
      "coherence"
    ],
    commonDistractors: [
      "connector-first lure",
      "pronoun-before-noun"
    ],
    generationStrategy: [
      "create one clear opener and one reference chain that fixes the middle order"
    ],
    distractorStrategies: [
      "use a discourse-marker sentence as fake opener",
      "swap two locally coherent but globally wrong middle lines"
    ],
    difficultyTuning: {
      medium: [
        "4-sentence jumbled set"
      ],
      hard: [
        "5-sentence set with one deceptive pair"
      ]
    },
    validationRules: [
      "single best sequence"
    ],
    diversityTags: [
      "para-jumble-anchor"
    ],
    rotationGroup: "english-parajumble-core"
  }),
  defineEnglishMotif({
    id: "reported-speech-shift",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ssc: 1,
        ibps: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.75
      },
      explanationStyle: [
        "tense-pronoun backshift"
      ],
      distractorHints: [
        "pronoun backshift miss",
        "tense retention trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "conditional",
        "multi-step"
      ],
      ruleTags: [
        "narration",
        "reported speech"
      ]
    },
    triggerPatterns: [
      "direct-to-indirect speech with tense and pronoun shifts"
    ],
    ambiguityTags: [
      "speech shift"
    ],
    commonDistractors: [
      "no-backshift lure",
      "wrong reporting verb construction"
    ],
    generationStrategy: [
      "change statement, question, or command into reported speech with one or two controlled shifts"
    ],
    distractorStrategies: [
      "retain original pronoun",
      "retain original tense without exception"
    ],
    difficultyTuning: {
      medium: [
        "simple statement conversion"
      ],
      hard: [
        "question or command conversion with pronoun shift"
      ]
    },
    validationRules: [
      "single correct indirect form"
    ],
    diversityTags: [
      "narration-core"
    ],
    rotationGroup: "english-narration-core"
  }),
  defineEnglishMotif({
    id: "object-focus-transform",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 4],
      inferenceStyle: "direct",
      examWeights: {
        ssc: 1.2,
        ibps: 1
      }
    },
    realizationHints: {
      wordingBias: {
        concise: 0.6,
        balanced: 0.8
      },
      explanationStyle: [
        "active-passive transformation"
      ],
      distractorHints: [
        "wrong auxiliary",
        "tense-carryover trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic"
      ],
      supportedReasoningTypes: [
        "direct",
        "conditional"
      ],
      ruleTags: [
        "active-passive"
      ]
    },
    triggerPatterns: [
      "object-led passive with tense preservation"
    ],
    ambiguityTags: [
      "voice"
    ],
    commonDistractors: [
      "auxiliary mismatch",
      "past-participle miss"
    ],
    generationStrategy: [
      "convert active to passive while preserving tense, aspect, and agent handling"
    ],
    distractorStrategies: [
      "use correct passive frame with wrong tense",
      "keep main verb in active form"
    ],
    difficultyTuning: {
      easy: [
        "simple present or past"
      ],
      medium: [
        "continuous or perfect tense"
      ],
      hard: [
        "modal or imperative passive"
      ]
    },
    validationRules: [
      "one correct transformed sentence"
    ],
    diversityTags: [
      "voice-transform"
    ],
    rotationGroup: "english-voice-core"
  })
];

// src/lib/motifs/di.ts
var diMotifs = [
  defineDIMotif({
    id: "cross_series_comparison",
    domain: "di",
    visualSubtype: "bar",
    archetype: "visual-comparison",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "direct",
      examWeights: {
        ibps: 1.2,
        sbi: 1.25
      }
    },
    realizationHints: {
      wordingBias: {
        concise: 0.6,
        balanced: 0.8
      },
      visualHints: [
        "multi-series comparison"
      ],
      distractorHints: [
        "wrong series read",
        "adjacent bar confusion"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "di"
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual"
      ],
      ruleTags: [
        "cross-series",
        "trend-reading"
      ]
    },
    interpretationModes: [
      "compare categories",
      "identify highest delta"
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue"
    ],
    generationStrategy: [
      "use two or more comparable series with one clean contrast target"
    ],
    distractorStrategies: [
      "adjacent-series confusion",
      "read wrong category row"
    ],
    difficultyTuning: {
      easy: [
        "single direct comparison"
      ],
      medium: [
        "comparison plus percentage or ratio"
      ],
      hard: [
        "multi-series trend comparison"
      ]
    },
    validationRules: [
      "stable legend mapping",
      "no visually identical distractor bars"
    ],
    diversityTags: [
      "bar-compare"
    ],
    rotationGroup: "di-bar-core"
  }),
  defineDIMotif({
    id: "ratio_proportion_table_trap",
    domain: "di",
    visualSubtype: "table",
    archetype: "data-interpretation",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [3, 6],
      inferenceStyle: "conditional",
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7
      },
      visualHints: [
        "ratio extraction from table"
      ],
      distractorHints: [
        "wrong denominator",
        "partial aggregation"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "di"
      ],
      supportedReasoningTypes: [
        "comparative",
        "multi-step"
      ],
      ruleTags: [
        "ratio-proportion",
        "tabular inference"
      ]
    },
    interpretationModes: [
      "derive ratio",
      "normalize totals",
      "compare proportional change"
    ],
    commonDistractors: [
      "wrongDenominator",
      "cumulativeMistake"
    ],
    generationStrategy: [
      "make totals derivable but not explicitly highlighted",
      "reward proportional reading over raw-value reading"
    ],
    distractorStrategies: [
      "wrong denominator",
      "normalize against subset instead of grand total"
    ],
    difficultyTuning: {
      medium: [
        "single ratio derivation"
      ],
      hard: [
        "ratio plus comparative change"
      ]
    },
    validationRules: [
      "preserve coherent units across all columns"
    ],
    diversityTags: [
      "table-ratio"
    ],
    rotationGroup: "di-table-core"
  }),
  defineDIMotif({
    id: "percentage-heavy-calculations",
    domain: "di",
    visualSubtype: "mixed",
    archetype: "data-interpretation",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [3, 6],
      inferenceStyle: "conditional",
      examWeights: {
        ibps: 1.25,
        sbi: 1.25
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.8
      },
      visualHints: [
        "dataset favors percentages, shares, and comparative change"
      ],
      distractorHints: [
        "percentage-point vs percent confusion",
        "wrong-base ratio trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "di"
      ],
      supportedReasoningTypes: [
        "comparative",
        "multi-step",
        "visual"
      ],
      ruleTags: [
        "percentage heavy",
        "mixed-di"
      ]
    },
    interpretationModes: [
      "percentage change",
      "share of total",
      "cross-year comparison"
    ],
    commonDistractors: [
      "percentagePointTrap",
      "wrongDenominator"
    ],
    generationStrategy: [
      "build realistic business or exam-style tables/charts where percentage work dominates"
    ],
    parameterRanges: {
      rowCount: {
        min: 4,
        max: 7
      },
      valueSpread: "moderate"
    },
    distractorStrategies: [
      "percent-vs-percentage-point confusion",
      "take row share instead of grand-total share"
    ],
    difficultyTuning: {
      medium: [
        "one percentage transformation"
      ],
      hard: [
        "multiple related percentage calculations"
      ]
    },
    validationRules: [
      "use calculation-friendly round numbers",
      "avoid noisy datasets with no interpretation value"
    ],
    diversityTags: [
      "di-percent-heavy"
    ],
    rotationGroup: "di-mixed-core"
  }),
  defineDIMotif({
    id: "approximation-friendly-datasets",
    domain: "di",
    visualSubtype: "table",
    archetype: "data-interpretation",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "direct",
      examWeights: {
        ssc: 1,
        ibps: 1.2,
        sbi: 1.2
      }
    },
    realizationHints: {
      wordingBias: {
        concise: 0.6,
        balanced: 0.8
      },
      visualHints: [
        "dataset built for fast approximation and elimination"
      ],
      distractorHints: [
        "close numeric options",
        "rounding-direction trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "di"
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual"
      ],
      ruleTags: [
        "approximation",
        "table"
      ]
    },
    interpretationModes: [
      "estimate ratio",
      "quick ranking",
      "close-option elimination"
    ],
    commonDistractors: [
      "overPreciseCalculation",
      "roundingDirectionError"
    ],
    generationStrategy: [
      "choose values that support rapid approximation without becoming trivial"
    ],
    parameterRanges: {
      rowCount: {
        min: 4,
        max: 6
      }
    },
    distractorStrategies: [
      "cluster options around approximate answer",
      "flip rounding direction on one option"
    ],
    difficultyTuning: {
      easy: [
        "single approximation"
      ],
      medium: [
        "approximation plus ranking"
      ],
      hard: [
        "multi-step approximation with close distractors"
      ]
    },
    validationRules: [
      "keep one clearly best option after approximation"
    ],
    diversityTags: [
      "di-approximation"
    ],
    rotationGroup: "di-table-core"
  }),
  defineDIMotif({
    id: "pie-share-normalization",
    domain: "di",
    visualSubtype: "pie",
    archetype: "visual-comparison",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [3, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ibps: 1.1,
        sbi: 1.1
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.8
      },
      visualHints: [
        "pie chart with linked totals or nested totals"
      ],
      distractorHints: [
        "angle-share confusion",
        "share-of-share trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "di"
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual",
        "multi-step"
      ],
      ruleTags: [
        "pie",
        "share normalization"
      ]
    },
    interpretationModes: [
      "convert share to value",
      "compare shares across totals"
    ],
    commonDistractors: [
      "wrongTotalSelection",
      "angleValueSwap"
    ],
    generationStrategy: [
      "force normalization across different total pie values or linked sub-shares"
    ],
    distractorStrategies: [
      "use raw angle instead of converted value",
      "normalize to wrong parent total"
    ],
    difficultyTuning: {
      medium: [
        "single-total pie comparison"
      ],
      hard: [
        "cross-pie normalization"
      ]
    },
    validationRules: [
      "angles must sum cleanly and support at least one meaningful comparison"
    ],
    diversityTags: [
      "di-pie-core"
    ],
    rotationGroup: "di-pie-core"
  }),
  defineDIMotif({
    id: "line-trend-comparison",
    domain: "di",
    visualSubtype: "line",
    archetype: "visual-comparison",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard"
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "direct",
      examWeights: {
        ibps: 1,
        sbi: 1.15
      }
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.75
      },
      visualHints: [
        "trend-focused line graph with one or two series"
      ],
      distractorHints: [
        "adjacent-point confusion",
        "trend vs value trap"
      ]
    },
    generationRules: {
      compatiblePatternTypes: [
        "di"
      ],
      supportedReasoningTypes: [
        "comparative",
        "visual"
      ],
      ruleTags: [
        "line graph",
        "trend reading"
      ]
    },
    interpretationModes: [
      "identify trend",
      "compare rise and fall",
      "find maximum change"
    ],
    commonDistractors: [
      "valueTrendSwap",
      "adjacentPointTrap"
    ],
    generationStrategy: [
      "make line graphs test interpretation of change, not just lookup"
    ],
    distractorStrategies: [
      "confuse highest value with highest increase",
      "swap consecutive intervals"
    ],
    difficultyTuning: {
      easy: [
        "single trend lookup"
      ],
      medium: [
        "trend plus ratio"
      ],
      hard: [
        "multi-series trend comparison"
      ]
    },
    validationRules: [
      "avoid flat lines across all series"
    ],
    diversityTags: [
      "di-line-core"
    ],
    rotationGroup: "di-line-core"
  })
];

// src/lib/motifs/index.ts
var ALL_MOTIFS = [
  ...percentageMotifs,
  ...ratioMotifs,
  ...codingDecodingMotifs,
  ...bloodRelationMotifs,
  ...directionSenseMotifs,
  ...inequalityMotifs,
  ...seatingArrangementMotifs,
  ...practicalQuantMotifs,
  ...practicalReasoningMotifs
];
var UNIVERSAL_MOTIFS = [
  ...ALL_MOTIFS.map(
    defineQuantMotif
  ),
  ...englishMotifs,
  ...diMotifs
];

// src/lib/shared/distractors/option-calibration.ts
function getDistractorMagnitude(correct, difficulty) {
  const baseMagnitude = Math.max(
    1,
    Math.abs(correct)
  );
  const magnitudeScale = difficulty === "Easy" ? 0.28 : difficulty === "Hard" ? 0.05 : 0.14;
  const minimumGap = difficulty === "Easy" ? baseMagnitude < 100 ? 18 : 35 : difficulty === "Hard" ? baseMagnitude < 100 ? 3 : 8 : baseMagnitude < 100 ? 9 : 18;
  return Math.max(
    minimumGap,
    Math.round(
      baseMagnitude * magnitudeScale
    )
  );
}
function getSignedCloseGap(magnitude) {
  return Math.max(
    1,
    Math.round(magnitude / 2)
  );
}
function compareOptionGap(leftValue, rightValue, correct, difficulty) {
  const leftGap = Math.abs(
    Number(leftValue) - correct
  );
  const rightGap = Math.abs(
    Number(rightValue) - correct
  );
  if (difficulty === "Easy") {
    return rightGap - leftGap;
  }
  if (difficulty === "Hard") {
    return leftGap - rightGap;
  }
  const targetGap = Math.max(
    6,
    Math.round(
      Math.abs(correct) * 0.12
    )
  );
  return Math.abs(leftGap - targetGap) - Math.abs(rightGap - targetGap);
}

// src/lib/core/exam-realism.ts
var EXAM_PROFILE_CONFIGS = {
  custom: {
    wordingStyle: "balanced",
    archetypeWeights: {},
    distractorWeights: {},
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1,
      inferenceBias: 1
    }
  },
  ssc: {
    wordingStyle: "concise",
    archetypeWeights: {
      "one-step-arithmetic": 1.35,
      "simple-percentage": 1.25,
      "comparison-chain": 1.15,
      "nested-operations": 0.8
    },
    distractorWeights: {
      arithmeticSlip: 1.4,
      percentageTrap: 1.2,
      prematureRounding: 1.2
    },
    reasoningWeights: {
      speedBias: 1.3,
      trapBias: 1,
      inferenceBias: 0.8
    }
  },
  ibps: {
    wordingStyle: "balanced",
    archetypeWeights: {
      "comparison-chain": 1.3,
      "ratio-conversion": 1.25,
      "conditional-ratio-logic": 1.2
    },
    distractorWeights: {
      wrongIntermediateValue: 1.3,
      wrongDenominator: 1.2,
      comparisonTrap: 1.2
    },
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1.25,
      inferenceBias: 1
    }
  },
  cat: {
    wordingStyle: "inference-heavy",
    archetypeWeights: {
      "hidden-base-inference": 1.35,
      "chained-percentage-ratio": 1.35,
      "comparative-conditional-inference": 1.4,
      "nested-operations": 1.35
    },
    distractorWeights: {
      wrongIntermediateValue: 1.35,
      cumulativeMistake: 1.25,
      ratioInversion: 1.15
    },
    reasoningWeights: {
      speedBias: 0.85,
      trapBias: 1.1,
      inferenceBias: 1.4
    }
  },
  sbi: {
    wordingStyle: "balanced",
    archetypeWeights: {
      "successive-percentage": 1.2,
      "ratio-conversion": 1.2,
      "conditional-ratio-logic": 1.15
    },
    distractorWeights: {
      percentageTrap: 1.25,
      wrongIntermediateValue: 1.2,
      wrongDenominator: 1.15
    },
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1.15,
      inferenceBias: 1.05
    }
  },
  rrb: {
    wordingStyle: "concise",
    archetypeWeights: {
      "direct-substitution": 1.2,
      "simple-ratio": 1.2,
      "one-step-arithmetic": 1.15
    },
    distractorWeights: {
      arithmeticSlip: 1.25,
      prematureRounding: 1.15
    },
    reasoningWeights: {
      speedBias: 1.2,
      trapBias: 0.95,
      inferenceBias: 0.85
    }
  }
};
function buildPrompt(variants, replacements) {
  let prompt = pickRandomItem(
    variants
  );
  for (const [key, value] of Object.entries(
    replacements
  )) {
    prompt = prompt.replaceAll(
      `{${key}}`,
      String(value)
    );
  }
  return prompt;
}
function getExamProfileConfig(examProfile = "custom") {
  return EXAM_PROFILE_CONFIGS[examProfile] ?? EXAM_PROFILE_CONFIGS.custom;
}
function buildExamRealismMetadata(examProfile, archetype, optionMetadata) {
  const profileConfig = getExamProfileConfig(
    examProfile
  );
  const distractorSummary = (optionMetadata ?? []).filter(
    (option) => !option.isCorrect && option.distractorType
  ).map(
    (option) => option.distractorType
  );
  return {
    examProfile,
    wordingStyle: profileConfig.wordingStyle,
    archetypeId: archetype.id,
    archetypeCategory: archetype.category,
    reasoningTraps: [
      ...new Set(
        (optionMetadata ?? []).filter(
          (option) => !option.isCorrect && option.reasoningTrap
        ).map(
          (option) => option.reasoningTrap
        )
      )
    ],
    weightingSummary: [
      `Archetype weight ${(profileConfig.archetypeWeights[archetype.category] ?? 1).toFixed(2)}`,
      `Trap bias ${profileConfig.reasoningWeights.trapBias.toFixed(
        2
      )}`,
      `Inference bias ${profileConfig.reasoningWeights.inferenceBias.toFixed(
        2
      )}`,
      distractorSummary.length ? `Distractor mix ${distractorSummary.join(
        ", "
      )}` : "Distractor mix standard"
    ]
  };
}

// src/lib/shared/randomness.ts
import { AsyncLocalStorage } from "node:async_hooks";

// src/lib/shared/reasoning-engine-error.ts
var ReasoningEngineError = class extends Error {
  code;
  phase;
  metadata;
  constructor(input) {
    super(input.message);
    this.name = "ReasoningEngineError";
    this.code = input.code;
    this.phase = input.phase;
    this.metadata = input.metadata;
    if ("cause" in input) {
      Object.defineProperty(
        this,
        "cause",
        {
          value: input.cause,
          enumerable: false,
          configurable: true
        }
      );
    }
  }
};
function buildReasoningErrorMetadata(metadata) {
  const context = getGenerationContext();
  return {
    seed: context?.seed,
    generationId: context?.generationId,
    generationTimestamp: context?.timestamp,
    ...metadata
  };
}
function isReasoningEngineError(error) {
  return error instanceof ReasoningEngineError;
}

// src/lib/shared/randomness.ts
var generationContextStore = new AsyncLocalStorage();
function hashSeed(value) {
  let hash = 2166136261;
  for (let index2 = 0; index2 < value.length; index2 += 1) {
    hash ^= value.charCodeAt(index2);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = state + 1831565813 >>> 0;
    let value = Math.imul(
      state ^ state >>> 15,
      1 | state
    );
    value ^= value + Math.imul(
      value ^ value >>> 7,
      61 | value
    );
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}
function normalizeSeed(seed) {
  return seed?.length ? seed : "default-seed";
}
function createRNGService(seed) {
  const normalizedSeed = normalizeSeed(seed);
  const nextValue = mulberry32(
    hashSeed(normalizedSeed)
  );
  return {
    next() {
      return nextValue();
    },
    nextInt(min, max) {
      return Math.floor(
        nextValue() * (max - min + 1)
      ) + min;
    },
    fork(label) {
      return createRNGService(
        `${normalizedSeed}:${label}`
      );
    },
    getSeed() {
      return normalizedSeed;
    }
  };
}
var fallbackRng = createRNGService(
  `fallback:${Date.now()}`
);
function createGenerationContext(seed) {
  const normalizedSeed = normalizeSeed(seed);
  return {
    seed: normalizedSeed,
    rng: createRNGService(
      normalizedSeed
    ),
    generationId: `gen_${hashSeed(normalizedSeed).toString(16)}`,
    timestamp: Date.now()
  };
}
function runWithGenerationContext(context, fn) {
  return generationContextStore.run(
    context,
    fn
  );
}
function getGenerationContext() {
  return generationContextStore.getStore();
}
function random() {
  return getGenerationContext()?.rng.next() ?? fallbackRng.next();
}
function randomInt(min, max) {
  const rng = getGenerationContext()?.rng;
  return rng ? rng.nextInt(min, max) : fallbackRng.nextInt(min, max);
}
function pickRandomTemplate(templateVariants) {
  if (!templateVariants?.length) {
    throw new ReasoningEngineError({
      code: "REALIZATION_NO_TEMPLATE_VARIANTS",
      phase: "realization",
      message: "No template variants provided.",
      metadata: buildReasoningErrorMetadata()
    });
  }
  const idx = randomInt(
    0,
    templateVariants.length - 1
  );
  return templateVariants[idx];
}
function pickRandomItem(items) {
  if (!items.length) {
    throw new ReasoningEngineError({
      code: "RNG_EMPTY_ITEM_SET",
      phase: "realization",
      message: "Expected at least one item.",
      metadata: buildReasoningErrorMetadata()
    });
  }
  return items[randomInt(0, items.length - 1)];
}
function pickWeightedItem(items, getWeight) {
  if (!items.length) {
    throw new ReasoningEngineError({
      code: "RNG_EMPTY_WEIGHTED_SET",
      phase: "optimization",
      message: "Expected at least one weighted item.",
      metadata: buildReasoningErrorMetadata()
    });
  }
  const weighted = items.map((item) => ({
    item,
    weight: Math.max(
      0.1,
      getWeight(item) ?? 1
    )
  }));
  const totalWeight = weighted.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );
  let roll = random() * totalWeight;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.item;
    }
  }
  return weighted[weighted.length - 1].item;
}
function shuffle(arr) {
  const copy = [...arr];
  for (let index2 = copy.length - 1; index2 > 0; index2 -= 1) {
    const swapIndex = randomInt(
      0,
      index2
    );
    const value = copy[index2];
    copy[index2] = copy[swapIndex];
    copy[swapIndex] = value;
  }
  return copy;
}

// src/lib/shared/text.ts
function extractTemplatePlaceholders(template) {
  if (!template) {
    return [];
  }
  return [
    ...new Set(
      Array.from(
        template.matchAll(
          /\{\{([^}]+)\}\}|\{([^}]+)\}/g
        )
      ).map(
        (match) => match[1] ?? match[2] ?? ""
      ).filter(
        (key) => key && key !== "answer" && key !== "baseText" && key !== "topic" && key !== "subtopic"
      )
    )
  ];
}
function renderNamedTemplate(template, values2) {
  let result = template;
  Object.entries(values2).forEach(
    ([key, value]) => {
      result = result.replaceAll(
        `{{${key}}}`,
        String(value)
      ).replaceAll(
        `{${key}}`,
        String(value)
      );
    }
  );
  return result.replace(/\{\{[^}]+\}\}/g, "").replace(/\{[^}]+\}/g, "").replace(/\s+/g, " ").trim();
}
function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}
function hasAnyToken(value, tokens) {
  return tokens.some(
    (token) => value.includes(token)
  );
}
function normalizeNumericValue(value) {
  return Number(value.toFixed(2));
}

// src/lib/shared/distractors/option-generator.ts
function buildDistractorCandidate(distractorType, value, likelyMistake, reasoningTrap) {
  return {
    distractorType,
    value: normalizeNumericValue(value),
    likelyMistake,
    reasoningTrap
  };
}
function normalizeExternalDistractorType(distractor) {
  switch (distractor) {
    case "wrongDenominator":
    case "percentageTrap":
    case "ratioInversion":
    case "arithmeticSlip":
    case "wrongIntermediateValue":
    case "comparisonTrap":
    case "prematureRounding":
    case "cumulativeMistake":
      return distractor;
    case "partialAggregation":
      return "cumulativeMistake";
    case "wrongSeries":
    case "directComparison":
    case "wrongSubsetSelection":
      return "comparisonTrap";
    case "unchangedTotalAssumption":
    case "skippedCondition":
      return "wrongIntermediateValue";
    case "wrongNormalization":
      return "ratioInversion";
    default:
      return void 0;
  }
}
function getTrapTypesForConfig(config) {
  const topicCluster = config?.topicCluster ?? "general-quant";
  const operations = config?.operationChain ?? [];
  const trapTypes = /* @__PURE__ */ new Set([
    "arithmeticSlip",
    "wrongIntermediateValue",
    "prematureRounding"
  ]);
  if (topicCluster === "percentage" || topicCluster === "profit-loss" || topicCluster === "si-ci" || operations.includes(
    "percentage"
  )) {
    trapTypes.add(
      "percentageTrap"
    );
    trapTypes.add(
      "wrongDenominator"
    );
  }
  if (topicCluster === "ratio-proportion" || operations.includes("ratio")) {
    trapTypes.add(
      "ratioInversion"
    );
  }
  if (operations.includes(
    "aggregate"
  ) || operations.includes(
    "cumulative"
  ) || (config?.reasoningDepth ?? 0) >= 4) {
    trapTypes.add(
      "cumulativeMistake"
    );
  }
  if (operations.includes("compare")) {
    trapTypes.add(
      "comparisonTrap"
    );
  }
  for (const hint of config?.distractorHints ?? []) {
    const normalizedHint = normalizeExternalDistractorType(
      hint
    );
    if (normalizedHint) {
      trapTypes.add(
        normalizedHint
      );
    }
  }
  return [...trapTypes];
}
function generateDistractorValue(correct, distractorType, config) {
  const difficulty = config?.difficulty ?? "Medium";
  const magnitude = getDistractorMagnitude(
    correct,
    difficulty
  );
  const signedCloseGap = getSignedCloseGap(magnitude);
  switch (distractorType) {
    case "percentageTrap":
      return correct + (difficulty === "Hard" ? signedCloseGap : magnitude * 2);
    case "ratioInversion":
      return difficulty === "Hard" ? correct + signedCloseGap : correct > 8 ? correct / 2 : correct * 2;
    case "wrongIntermediateValue":
      return correct + (difficulty === "Hard" ? signedCloseGap + 1 : magnitude * 2.5);
    case "comparisonTrap":
      return correct - (difficulty === "Hard" ? signedCloseGap : magnitude * 1.5);
    case "wrongDenominator":
      return correct + (difficulty === "Hard" ? signedCloseGap : magnitude);
    case "prematureRounding":
      return Math.round(
        correct + (difficulty === "Hard" ? 1 : magnitude / 3)
      );
    case "cumulativeMistake":
      return correct + (difficulty === "Hard" ? signedCloseGap + 2 : magnitude * 3);
    case "arithmeticSlip":
    default:
      return correct - (difficulty === "Hard" ? signedCloseGap : magnitude);
  }
}
function buildDistractorCandidates(correct, config) {
  const profileConfig = getExamProfileConfig(
    config?.examProfile
  );
  return getTrapTypesForConfig(
    config
  ).map((distractorType) => {
    const value = generateDistractorValue(
      correct,
      distractorType,
      config
    );
    switch (distractorType) {
      case "percentageTrap":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Applied the percentage change on the wrong base.",
          "Reverse percentage and base-value confusion."
        );
      case "ratioInversion":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Interchanged the ratio terms during normalization.",
          "Ratio inversion while converting to final values."
        );
      case "wrongIntermediateValue":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Used an intermediate quantity as the final answer.",
          "Hidden dependency trap in the operation chain."
        );
      case "comparisonTrap":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Compared the visible values before completing the transformation.",
          "Misleading comparison before full evaluation."
        );
      case "wrongDenominator":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Computed the fraction with the wrong denominator.",
          "Percentage denominator trap."
        );
      case "prematureRounding":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Rounded too early during calculation.",
          "Premature simplification trap."
        );
      case "cumulativeMistake":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Skipped one cumulative adjustment in the chain.",
          "Cumulative dependency trap."
        );
      case "arithmeticSlip":
      default:
        return buildDistractorCandidate(
          distractorType,
          value,
          "Made a small arithmetic slip in the final computation.",
          "Last-step arithmetic trap."
        );
    }
  }).sort((left, right) => {
    const leftWeight = profileConfig.distractorWeights[left.distractorType] ?? 1;
    const rightWeight = profileConfig.distractorWeights[right.distractorType] ?? 1;
    return rightWeight - leftWeight;
  });
}
function generateNumericOptions(correct, config) {
  const normalizedCorrect = normalizeNumericValue(correct);
  const difficulty = config?.difficulty ?? "Medium";
  const optionPool = /* @__PURE__ */ new Map();
  const addOption = (value, metadata) => {
    const normalized = normalizeNumericValue(value);
    if (normalized === normalizedCorrect) {
      return;
    }
    const key = String(normalized);
    if (!optionPool.has(key)) {
      optionPool.set(key, {
        value: key,
        isCorrect: false,
        ...metadata
      });
    }
  };
  const correctLabel = String(
    normalizedCorrect
  );
  optionPool.set(correctLabel, {
    value: correctLabel,
    isCorrect: true
  });
  if (config?.distractorStrategy?.type === "numeric_offsets") {
    for (const offset of config.distractorStrategy.offsets) {
      addOption(
        correct + offset,
        {
          distractorType: "arithmeticSlip",
          likelyMistake: "Applied a familiar offset instead of resolving the full chain.",
          reasoningTrap: "Shortcut arithmetic trap from preset distractor offsets."
        }
      );
    }
  }
  for (const distractor of buildDistractorCandidates(
    correct,
    config
  )) {
    addOption(
      distractor.value,
      distractor
    );
  }
  while (optionPool.size < 4) {
    const variance = Math.max(
      2,
      Math.round(
        Math.abs(correct) * 0.1
      )
    );
    addOption(
      correct + randomInt(
        -variance,
        variance
      ),
      {
        distractorType: "arithmeticSlip",
        likelyMistake: "Made a near-value arithmetic slip.",
        reasoningTrap: "Close-value arithmetic trap."
      }
    );
  }
  const correctOption = optionPool.get(correctLabel);
  const distractorOptions = [
    ...optionPool.values()
  ].filter(
    (option) => !option.isCorrect
  ).sort(
    (left, right) => compareOptionGap(
      left.value,
      right.value,
      normalizedCorrect,
      difficulty
    )
  ).slice(0, 3);
  const shuffled = shuffle([
    correctOption,
    ...distractorOptions
  ]);
  return {
    options: shuffled.map(
      (option) => option.value
    ),
    correct: shuffled.indexOf(
      shuffled.find(
        (option) => option.isCorrect
      )
    ),
    optionMetadata: shuffled
  };
}

// src/lib/shared/validation/contracts.ts
function getPatternRequiredVariables(pattern) {
  const patternVariables = pattern.variables ?? {};
  const templateVariants = pattern.templateVariants ?? [];
  const formulaVariables = pattern.formula ? [
    ...new Set(
      Array.from(
        pattern.formula.matchAll(
          /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g
        )
      ).map((match) => match[0]).filter(
        (token) => ![
          "Math",
          "return",
          "true",
          "false"
        ].includes(token) && !/^\d/.test(token)
      )
    )
  ] : [];
  return [
    .../* @__PURE__ */ new Set([
      ...pattern.requiredVariables ?? [],
      ...Object.keys(
        patternVariables
      ),
      ...extractTemplatePlaceholders(
        pattern.explanationTemplate
      ),
      ...formulaVariables,
      ...templateVariants.flatMap(
        (template) => extractTemplatePlaceholders(
          template
        )
      )
    ])
  ];
}
function getPatternReasoningCapabilities(pattern, topicCluster) {
  if (pattern.reasoningCapabilities?.length) {
    return pattern.reasoningCapabilities;
  }
  const capabilities = /* @__PURE__ */ new Set();
  const combinedText = `${pattern.topic} ${pattern.subtopic} ${pattern.formula ?? ""}`.toLowerCase();
  if (pattern.type === "di") {
    capabilities.add("visual");
  }
  if (pattern.type === "logic") {
    capabilities.add("symbolic");
  }
  if (pattern.formula) {
    capabilities.add("arithmetic");
  }
  if (hasAnyToken(combinedText, [
    "if",
    "when",
    "condition",
    "unless"
  ])) {
    capabilities.add("conditional");
  }
  if (hasAnyToken(combinedText, [
    "compare",
    "difference",
    "greater",
    "less",
    "highest",
    "lowest"
  ])) {
    capabilities.add("comparative");
  }
  if (hasAnyToken(combinedText, [
    "ratio",
    "inequality",
    "coding",
    "decoding",
    "direction",
    "relation"
  ])) {
    capabilities.add("symbolic");
  }
  if (countMatches(
    pattern.formula ?? "",
    /[+\-*/%]/g
  ) >= 2) {
    capabilities.add("multi-step");
    capabilities.add("inferential");
  } else {
    capabilities.add("direct");
  }
  if (topicCluster === "coding-decoding" || topicCluster === "blood-relations" || topicCluster === "direction-sense" || topicCluster === "inequality" || topicCluster === "ordering-ranking" || topicCluster === "puzzles" || topicCluster === "syllogism" || topicCluster === "seating-arrangement") {
    capabilities.add("inferential");
    capabilities.add("symbolic");
  }
  return [...capabilities];
}
function getMotifCompatibleTopics(motif) {
  return motif.compatibleTopics?.length ? motif.compatibleTopics : [motif.topicCluster];
}
function getMotifCompatiblePatternTypes(motif) {
  if (motif.compatiblePatternTypes?.length) {
    return motif.compatiblePatternTypes;
  }
  return [
    motif.topicCluster === "coding-decoding" || motif.topicCluster === "blood-relations" || motif.topicCluster === "inequality" || motif.topicCluster === "direction-sense" || motif.topicCluster === "ordering-ranking" || motif.topicCluster === "puzzles" || motif.topicCluster === "syllogism" || motif.topicCluster === "seating-arrangement" ? "logic" : "formula"
  ];
}
function getMotifRequiredVariables(motif) {
  return motif.requiredVariables ?? [];
}
function getMotifSupportedReasoningTypes(motif) {
  if (motif.supportedReasoningTypes?.length) {
    return motif.supportedReasoningTypes;
  }
  const supported = /* @__PURE__ */ new Set();
  supported.add(
    motif.inferenceStyle === "direct" ? "direct" : motif.inferenceStyle === "conditional" ? "conditional" : "inferential"
  );
  if (motif.reasoningDepthRange[1] >= 3) {
    supported.add("multi-step");
  }
  if (motif.preferredOperations.includes(
    "compare"
  )) {
    supported.add("comparative");
  }
  if (motif.topicCluster === "coding-decoding" || motif.topicCluster === "inequality" || motif.topicCluster === "blood-relations" || motif.topicCluster === "direction-sense" || motif.topicCluster === "ordering-ranking" || motif.topicCluster === "puzzles" || motif.topicCluster === "syllogism" || motif.topicCluster === "seating-arrangement") {
    supported.add("symbolic");
    supported.add("inferential");
  }
  return [...supported];
}
function getMotifSupportedDifficultyBands(motif) {
  if (motif.supportedDifficultyBands?.length) {
    return motif.supportedDifficultyBands;
  }
  const [minDepth, maxDepth] = motif.reasoningDepthRange;
  const bands = [];
  if (minDepth <= 2) {
    bands.push("Easy");
  }
  if (minDepth <= 4 && maxDepth >= 2) {
    bands.push("Medium");
  }
  if (maxDepth >= 3) {
    bands.push("Hard");
  }
  return bands.length ? bands : ["Medium"];
}
function validatePatternCompatibility(pattern, topicCluster, motif, difficulty) {
  const issues = [];
  if (pattern.supportedQuestionTypes?.length && !pattern.supportedQuestionTypes.includes(
    pattern.type
  )) {
    issues.push({
      reason: "Pattern type is not included in its supported question types."
    });
  }
  if (motif && pattern.supportedMotifs?.length && !pattern.supportedMotifs.includes(
    motif.id
  )) {
    issues.push({
      reason: "Pattern does not support the selected motif."
    });
  }
  const reasoningCapabilities = getPatternReasoningCapabilities(
    pattern,
    topicCluster
  );
  if (motif) {
    const compatibleTopics = getMotifCompatibleTopics(motif).map(
      (topic) => topic.toLowerCase()
    );
    const patternTopics = [
      topicCluster,
      pattern.topic.toLowerCase(),
      pattern.subtopic.toLowerCase()
    ];
    if (!patternTopics.some(
      (topic) => compatibleTopics.includes(
        topic
      )
    )) {
      issues.push({
        reason: "Motif is not compatible with the pattern topic."
      });
    }
    const requiredVariables = getMotifRequiredVariables(motif);
    const availableVariables = getPatternRequiredVariables(pattern);
    if (requiredVariables.some(
      (key) => !availableVariables.includes(
        key
      )
    )) {
      issues.push({
        reason: "Pattern is missing variables required by the motif."
      });
    }
    if (!getMotifCompatiblePatternTypes(
      motif
    ).includes(pattern.type)) {
      issues.push({
        reason: "Motif does not support the pattern question type."
      });
    }
    const supportedReasoning = getMotifSupportedReasoningTypes(
      motif
    );
    const hasReasoningOverlap = supportedReasoning.some(
      (type) => reasoningCapabilities.includes(
        type
      )
    );
    if (!hasReasoningOverlap) {
      issues.push({
        reason: "Pattern and motif reasoning capabilities do not overlap."
      });
    }
    const requiredCapabilities = motif.requiredReasoningCapabilities ?? [];
    if (requiredCapabilities.some(
      (capability) => !reasoningCapabilities.includes(
        capability
      )
    )) {
      issues.push({
        reason: "Pattern is missing reasoning capabilities required by the motif."
      });
    }
    if (difficulty && !getMotifSupportedDifficultyBands(
      motif
    ).includes(difficulty)) {
      issues.push({
        reason: "Motif does not support the requested difficulty band."
      });
    }
  }
  return {
    valid: issues.length === 0,
    issues
  };
}
function validateArchetypeCompatibility(pattern, archetype, motif, topicCluster) {
  const issues = [];
  const supportedMotifs = archetype.supportedMotifs;
  const requiredOperations = archetype.requiredOperations ?? archetype.operationChain;
  const reasoningDepthRange = archetype.reasoningDepthRange ?? [
    Math.max(
      1,
      archetype.operationChain.length - 1
    ),
    Math.max(
      1,
      archetype.operationChain.length + 1
    )
  ];
  if (!archetype.topicClusters.includes(
    topicCluster
  ) && !archetype.topicClusters.includes(
    "general-quant"
  )) {
    issues.push({
      reason: "Archetype does not support the requested topic cluster."
    });
  }
  if (motif && supportedMotifs?.length && !supportedMotifs.includes(motif.id)) {
    issues.push({
      reason: "Archetype does not support the selected motif."
    });
  }
  if (motif && requiredOperations.some(
    (operation) => !motif.preferredOperations.includes(
      operation
    ) && !archetype.operationChain.includes(
      operation
    )
  )) {
    issues.push({
      reason: "Archetype requires operations not aligned with the motif."
    });
  }
  const patternCapabilities = getPatternReasoningCapabilities(
    pattern,
    topicCluster
  );
  if (requiredOperations.includes(
    "filter"
  ) && !patternCapabilities.includes(
    "conditional"
  )) {
    issues.push({
      reason: "Pattern cannot support conditional archetype operations."
    });
  }
  if (motif && (archetype.operationChain.length < reasoningDepthRange[0] || archetype.operationChain.length > reasoningDepthRange[1])) {
    issues.push({
      reason: "Archetype reasoning depth is outside its configured range."
    });
  }
  return {
    valid: issues.length === 0,
    issues
  };
}

// src/lib/shared/motifs/selection.ts
function fallbackDifficultyLabel(difficultyScore) {
  if (difficultyScore <= 2.5) {
    return "Easy";
  }
  if (difficultyScore <= 5.5) {
    return "Medium";
  }
  return "Hard";
}
function getRangeOverlap(left, right) {
  const start = Math.max(
    left[0],
    right[0]
  );
  const end = Math.min(
    left[1],
    right[1]
  );
  return Math.max(0, end - start + 1);
}
function pickMotif(topicCluster, pattern, options, classifyDifficultyLabel2) {
  const classifyLabel = classifyDifficultyLabel2 ?? fallbackDifficultyLabel;
  const compatibleMotifs = ALL_MOTIFS.filter(
    (motif) => {
      if (motif.topicCluster !== topicCluster) {
        return false;
      }
      if (!pattern) {
        return true;
      }
      const difficulty = getRequestedDifficultyLabel(
        pattern,
        options,
        classifyLabel
      );
      const patternCompatibility = validatePatternCompatibility(
        pattern,
        topicCluster,
        motif,
        difficulty
      );
      return patternCompatibility.valid;
    }
  );
  if (!compatibleMotifs.length) {
    return null;
  }
  const targetDifficulty = pattern ? getRequestedDifficultyLabel(
    pattern,
    options,
    classifyLabel
  ) : "Medium";
  const targetDepthRange = targetDifficulty === "Easy" ? [1, 2] : targetDifficulty === "Hard" ? [3, 6] : [2, 4];
  return pickWeightedItem(
    compatibleMotifs,
    (motif) => {
      let weight = getMotifFormulaCompatibility(
        pattern,
        motif
      );
      const overlap = getRangeOverlap(
        targetDepthRange,
        motif.reasoningDepthRange
      );
      weight *= overlap > 0 ? 1 + overlap : 0.3;
      if (options?.examProfile && options.examProfile !== "custom") {
        weight *= motif.examWeights?.[options.examProfile] ?? 1;
      }
      return weight;
    }
  );
}

// src/lib/shared/realizers/prompts.ts
function buildQuantPrompt(archetype, context, examProfile) {
  const profileConfig = getExamProfileConfig(examProfile);
  const variants = [
    ...archetype.wordingVariants
  ];
  if (profileConfig.wordingStyle === "concise") {
    variants.push(
      "Answer quickly: {baseText}",
      "Find the answer: {baseText}"
    );
  }
  return buildPrompt(
    variants,
    {
      baseText: context.baseText,
      topic: context.pattern.topic,
      subtopic: context.pattern.subtopic
    }
  );
}
function buildComparisonPrompt(variants, replacements) {
  return buildPrompt(
    variants,
    replacements
  );
}

// src/lib/shared/realizers/scenarios.ts
var PERCENTAGE_SCENARIOS = [
  {
    entity: "company",
    metric: "revenue",
    context: "growth"
  },
  {
    entity: "factory",
    metric: "production",
    context: "increase"
  },
  {
    entity: "school",
    metric: "student strength",
    context: "change"
  },
  {
    entity: "country",
    metric: "exports",
    context: "growth"
  }
];
var RATIO_SCENARIOS = [
  {
    entity: "boys and girls",
    metric: "students",
    context: "distribution"
  },
  {
    entity: "red and blue balls",
    metric: "selection",
    context: "ratio"
  }
];
function generateScenario(topic) {
  const normalized = topic.toLowerCase();
  if (normalized.includes(
    "percentage"
  )) {
    return pickRandomItem(
      PERCENTAGE_SCENARIOS
    );
  }
  if (normalized.includes(
    "ratio"
  )) {
    return pickRandomItem(
      RATIO_SCENARIOS
    );
  }
  return {
    entity: "company",
    metric: "value",
    context: "change"
  };
}

// src/lib/shared/reasoning.ts
function createReasoningStep(operation, detail) {
  return {
    operation,
    detail
  };
}
function attachReasoningTrace(question, steps, dependencyComplexity = steps.length, operationChain = steps.map(
  (step) => step.operation
)) {
  return {
    ...question,
    reasoningSteps: steps.map(
      (step) => `${step.operation}: ${step.detail}`
    ),
    dependencyComplexity,
    operationChain
  };
}
function alignReasoningStepsWithMotif(reasoningSteps, motif) {
  if (!motif) {
    return reasoningSteps;
  }
  const alignedSteps = [
    ...reasoningSteps
  ];
  const hasPreferredSignal = alignedSteps.some(
    (step) => motif.preferredOperations.includes(
      step.operation
    )
  );
  if (!hasPreferredSignal) {
    const preferredOperation = motif.preferredOperations[0];
    if (preferredOperation) {
      alignedSteps.unshift(
        createReasoningStep(
          preferredOperation,
          motif.inferenceStyle === "hidden" ? "Identify the concealed base relation before computing the final value." : motif.inferenceStyle === "conditional" ? "Apply the motif condition before evaluating the target quantity." : "Start from the direct relation highlighted in the motif."
        )
      );
    }
  }
  return alignedSteps;
}

// src/lib/shared/validation.ts
function validateQuestionRealization(templates, values2) {
  const issues = [];
  const missingKeys = /* @__PURE__ */ new Set();
  templates.forEach((template) => {
    extractTemplatePlaceholders(
      template
    ).forEach((key) => {
      if (values2[key] === void 0) {
        missingKeys.add(key);
      }
    });
  });
  if (missingKeys.size) {
    issues.push({
      reason: `Missing template variables: ${[
        ...missingKeys
      ].join(", ")}`
    });
  }
  return {
    valid: issues.length === 0,
    issues
  };
}
function validateFormulaReferences(formula, values2) {
  if (!formula) {
    return {
      valid: false,
      issues: [
        {
          reason: "Pattern formula is missing."
        }
      ]
    };
  }
  const referencedVariables = [
    ...new Set(
      Array.from(
        formula.matchAll(
          /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g
        )
      ).map((match) => match[0]).filter(
        (token) => ![
          "Math",
          "return",
          "true",
          "false"
        ].includes(token) && !/^\d/.test(token)
      )
    )
  ];
  const missingVariables = referencedVariables.filter(
    (key) => values2[key] === void 0
  );
  return {
    valid: missingVariables.length === 0,
    issues: missingVariables.length ? [
      {
        reason: `Formula references missing variables: ${missingVariables.join(
          ", "
        )}`
      }
    ] : []
  };
}
function renderExplanation(template, values2, answer) {
  const compatibility = validateQuestionRealization(
    [template],
    {
      ...values2,
      answer
    }
  );
  let result = template;
  for (const key in values2) {
    result = result.replaceAll(
      `{{${key}}}`,
      String(values2[key])
    );
  }
  result = result.replaceAll(
    "{{answer}}",
    String(answer)
  );
  if (!compatibility.valid) {
    result = result.replace(
      /\{\{[^}]+\}\}/g,
      "the derived quantity"
    );
  }
  return result.replace(
    /\{\{[^}]+\}\}/g,
    "the derived quantity"
  );
}

// src/lib/quant/core.ts
function keyExists(values2, key) {
  return Object.prototype.hasOwnProperty.call(
    values2,
    key
  );
}
function generateValues(variables, difficulty = "Medium", motif) {
  const values2 = {};
  const safeVariables = variables ?? {};
  function generateDifficultyAwareNumber(min, max) {
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);
    const clampToRange = (value) => Math.max(
      lower,
      Math.min(upper, value)
    );
    const pickRoundedValue = (steps) => {
      const candidates = steps.flatMap((step) => {
        const start = Math.ceil(
          lower / step
        );
        const end = Math.floor(
          upper / step
        );
        return Array.from(
          {
            length: Math.max(
              0,
              end - start + 1
            )
          },
          (_, index2) => (start + index2) * step
        );
      }).filter(
        (value, index2, array) => array.indexOf(value) === index2
      );
      if (candidates.length) {
        return pickRandomItem(
          candidates
        );
      }
      return clampToRange(
        randomInt(lower, upper)
      );
    };
    if (difficulty === "Easy") {
      return pickRoundedValue([
        10,
        5,
        2
      ]);
    }
    if (difficulty === "Hard") {
      let value = randomInt(
        lower,
        upper
      );
      while (upper - lower > 6 && (value % 10 === 0 || value % 5 === 0 || value % 2 === 0)) {
        value = randomInt(
          lower,
          upper
        );
      }
      return value;
    }
    if (random() < 0.55) {
      return pickRoundedValue([
        5,
        2
      ]);
    }
    return randomInt(lower, upper);
  }
  for (const key in safeVariables) {
    const { min, max } = safeVariables[key];
    values2[key] = generateDifficultyAwareNumber(
      min,
      max
    );
  }
  if (motif) {
    if (keyExists(values2, "p")) {
      values2.p = difficulty === "Easy" ? pickRandomItem([
        10,
        20,
        25
      ]) : difficulty === "Hard" ? pickRandomItem([
        12,
        18,
        22,
        27
      ]) : pickRandomItem([
        10,
        15,
        20,
        25
      ]);
    }
    if (keyExists(values2, "q")) {
      values2.q = difficulty === "Easy" ? pickRandomItem([
        5,
        10,
        15
      ]) : difficulty === "Hard" ? pickRandomItem([
        7,
        12,
        17
      ]) : pickRandomItem([
        8,
        10,
        12,
        15
      ]);
    }
    if (motif.inferenceStyle === "hidden" && difficulty !== "Easy") {
      for (const key of [
        "b",
        "final",
        "amount"
      ]) {
        if (keyExists(values2, key)) {
          values2[key] = Math.max(
            1,
            values2[key] + (difficulty === "Hard" ? 3 : 1)
          );
        }
      }
    }
  }
  return values2;
}
function getMotifFormulaCompatibility(pattern, motif) {
  if (!pattern?.formula) {
    return 1;
  }
  const formula = pattern.formula.toLowerCase();
  const variableKeys = Object.keys(
    pattern.variables ?? {}
  );
  let weight = 1;
  if (motif.id === "reverse_percentage_inference") {
    if (variableKeys.includes("p") && (variableKeys.includes("b") || variableKeys.includes(
      "final"
    ))) {
      weight *= 1.6;
    }
    if (formula.includes("/")) {
      weight *= 1.3;
    }
  }
  if (motif.id === "successive_percentage_change") {
    if (variableKeys.includes("p") && variableKeys.includes("q")) {
      weight *= 1.7;
    }
    if (countMatches(
      formula,
      /[+\-*/%]/g
    ) >= 2) {
      weight *= 1.2;
    }
  }
  if (motif.id === "contribution_based_growth" && variableKeys.length >= 3) {
    weight *= 1.5;
  }
  if (motif.id === "ratio_redistribution" && variableKeys.length >= 3) {
    weight *= 1.4;
  }
  if (motif.id === "common_base_comparison" && formula.includes("/")) {
    weight *= 1.3;
  }
  if (motif.id === "conditional_ratio_filtering" && variableKeys.length >= 3) {
    weight *= 1.4;
  }
  return weight;
}
function evaluateFormula(formula, values2) {
  try {
    const varNames = Object.keys(values2);
    const varValues = varNames.map(
      (k) => values2[k]
    );
    const fn = new Function(
      ...varNames,
      `return ${formula};`
    );
    return Number(fn(...varValues));
  } catch (error) {
    console.log({
      formula,
      values: values2,
      error
    });
  }
  throw new ReasoningEngineError({
    code: "FORMULA_INVALID",
    phase: "realization",
    message: `Invalid formula: ${formula}`,
    metadata: buildReasoningErrorMetadata({
      formula,
      values: values2
    })
  });
}
function getArithmeticComplexity(values2) {
  const entries = Object.values(values2);
  if (!entries.length) {
    return 1;
  }
  const roughValues = entries.filter(
    (value) => value % 10 !== 0 && value % 5 !== 0 && value % 2 !== 0
  ).length;
  const largeValues = entries.filter(
    (value) => Math.abs(value) >= 100
  ).length;
  const roughRatio = roughValues / entries.length;
  if (roughRatio <= 0.2 && largeValues <= 1) {
    return 1;
  }
  if (roughRatio <= 0.6 && largeValues <= 2) {
    return 2;
  }
  return 3;
}
function inferQuantTopicCluster(pattern) {
  const topicText = `${pattern.topic} ${pattern.subtopic} ${pattern.formula ?? ""}`.toLowerCase();
  if (hasAnyToken(topicText, [
    "percent",
    "percentage"
  ])) {
    return "percentage";
  }
  if (hasAnyToken(topicText, [
    "ratio",
    "proportion"
  ])) {
    return "ratio-proportion";
  }
  if (hasAnyToken(topicText, [
    "profit",
    "loss",
    "discount",
    "marked price"
  ])) {
    return "profit-loss";
  }
  if (hasAnyToken(topicText, [
    "average",
    "mean"
  ])) {
    return "averages";
  }
  if (hasAnyToken(topicText, [
    "time and work",
    "time & work",
    "work and wages",
    "efficiency",
    "work rate"
  ])) {
    return "time-work";
  }
  if (hasAnyToken(topicText, [
    "speed",
    "distance",
    "train",
    "boat",
    "stream",
    "race"
  ])) {
    return "speed-time-distance";
  }
  if (hasAnyToken(topicText, [
    "mixture",
    "alligation",
    "replacement",
    "solution",
    "alloy"
  ])) {
    return "mixture-alligation";
  }
  if (hasAnyToken(topicText, [
    "algebra",
    "equation",
    "linear equation",
    "quadratic",
    "identity"
  ])) {
    return "algebra-basics";
  }
  if (hasAnyToken(topicText, [
    "mensuration",
    "perimeter",
    "area",
    "volume",
    "surface area",
    "cylinder",
    "sphere",
    "cone"
  ])) {
    return "mensuration";
  }
  if (hasAnyToken(topicText, [
    "seating arrangement",
    "linear seating",
    "circular seating",
    "square seating",
    "rectangular seating",
    "double row seating",
    "parallel row seating",
    "alternate facing seating",
    "seating",
    "arrangement",
    "left of",
    "right of",
    "immediate neighbor"
  ])) {
    return "seating-arrangement";
  }
  if (hasAnyToken(topicText, [
    "simple interest",
    "compound interest",
    "interest"
  ]) || /\bsi\b/.test(topicText) || /\bci\b/.test(topicText)) {
    return "si-ci";
  }
  if (hasAnyToken(topicText, [
    "coding",
    "decoding",
    "code",
    "decode",
    "alphabet series",
    "letter coding"
  ])) {
    return "coding-decoding";
  }
  if (hasAnyToken(topicText, [
    "blood relation",
    "blood relations",
    "family relation",
    "family tree",
    "brother",
    "sister",
    "father",
    "mother",
    "uncle",
    "aunt"
  ])) {
    return "blood-relations";
  }
  if (hasAnyToken(topicText, [
    "inequality",
    "inequalities",
    "greater than",
    "less than",
    "not greater than",
    "not less than",
    "comparison symbols"
  ])) {
    return "inequality";
  }
  if (hasAnyToken(topicText, [
    "direction sense",
    "direction",
    "north",
    "south",
    "east",
    "west",
    "left turn",
    "right turn"
  ])) {
    return "direction-sense";
  }
  if (hasAnyToken(topicText, [
    "ranking",
    "order",
    "position",
    "rank",
    "from top",
    "from bottom"
  ])) {
    return "ordering-ranking";
  }
  if (hasAnyToken(topicText, [
    "syllogism",
    "conclusion",
    "statement",
    "venn"
  ])) {
    return "syllogism";
  }
  if (hasAnyToken(topicText, [
    "puzzle",
    "box arrangement",
    "floor puzzle",
    "month puzzle",
    "day puzzle",
    "scheduling puzzle"
  ])) {
    return "puzzles";
  }
  return "general-quant";
}
function getRequestedDifficultyLabel(pattern, options, classifyDifficultyLabel2) {
  if (options?.targetDifficulty !== void 0) {
    return classifyDifficultyLabel2(
      options.targetDifficulty
    );
  }
  if (options?.targetAverageDifficulty !== void 0) {
    return classifyDifficultyLabel2(
      options.targetAverageDifficulty
    );
  }
  return pattern.difficulty ?? "Medium";
}
function getTargetDifficultyScore(pattern, options) {
  if (options?.targetDifficulty !== void 0) {
    return options.targetDifficulty;
  }
  if (options?.targetAverageDifficulty !== void 0) {
    return options.targetAverageDifficulty;
  }
  switch (pattern.difficulty ?? "Medium") {
    case "Easy":
      return 2;
    case "Hard":
      return 8.5;
    case "Medium":
    default:
      return 5;
  }
}

// src/lib/core/difficulty.ts
function clampDifficultyScore(score) {
  return Math.max(
    1,
    Math.min(
      10,
      Number(score.toFixed(1))
    )
  );
}
function classifyDifficultyLabel(difficultyScore) {
  if (difficultyScore <= 2.5) {
    return "Easy";
  }
  if (difficultyScore <= 5.5) {
    return "Medium";
  }
  return "Hard";
}
function getVisualComplexity(visualType) {
  switch (visualType) {
    case "bar":
      return 2;
    case "pie":
      return 3;
    case "line":
      return 4;
    case "table":
    default:
      return 1;
  }
}
function getDefaultDifficultyDistribution() {
  return {
    easy: 20,
    medium: 60,
    hard: 20
  };
}
function normalizeDifficultyDistribution(distribution) {
  const merged = {
    ...getDefaultDifficultyDistribution(),
    ...distribution
  };
  const total = merged.easy + merged.medium + merged.hard;
  if (total <= 0) {
    return getDefaultDifficultyDistribution();
  }
  return {
    easy: merged.easy / total * 100,
    medium: merged.medium / total * 100,
    hard: merged.hard / total * 100
  };
}
function getDifficultyBucketTargets(count, distribution) {
  const normalized = normalizeDifficultyDistribution(
    distribution
  );
  const rawTargets = {
    Easy: normalized.easy / 100 * count,
    Medium: normalized.medium / 100 * count,
    Hard: normalized.hard / 100 * count
  };
  const targets = {
    Easy: Math.floor(rawTargets.Easy),
    Medium: Math.floor(rawTargets.Medium),
    Hard: Math.floor(rawTargets.Hard)
  };
  let assigned = targets.Easy + targets.Medium + targets.Hard;
  const remainders = Object.keys(
    rawTargets
  ).map((label) => ({
    label,
    remainder: rawTargets[label] - targets[label]
  })).sort(
    (a, b2) => b2.remainder - a.remainder
  );
  for (const entry of remainders) {
    if (assigned >= count) {
      break;
    }
    targets[entry.label] += 1;
    assigned += 1;
  }
  return targets;
}
function deriveDifficultySignals(input) {
  if (input.kind === "formula") {
    const combinedText2 = `${input.text} ${input.explanation} ${input.formula}`.toLowerCase();
    const explicitOperationCount = input.operationChain?.length ?? 0;
    const formulaOperationCount = Math.max(
      1,
      countMatches(
        input.formula,
        /[+\-*/%]/g
      )
    );
    const operationCount2 = explicitOperationCount > 0 ? explicitOperationCount : formulaOperationCount;
    const variableCount = Object.keys(input.values).length;
    const usesPercentage2 = hasAnyToken(combinedText2, [
      "%",
      "percent",
      "percentage"
    ]);
    const usesRatio2 = hasAnyToken(combinedText2, [
      "ratio",
      "proportion"
    ]);
    const usesComparison2 = hasAnyToken(combinedText2, [
      "difference",
      "more than",
      "less than",
      "greater",
      "smaller"
    ]);
    const explicitReasoningDepth2 = input.reasoningSteps?.length ?? 0;
    const reasoningDepth2 = explicitReasoningDepth2 > 0 ? explicitReasoningDepth2 : Math.max(
      1,
      Math.ceil(
        operationCount2 / 2
      )
    );
    const inferenceComplexity2 = reasoningDepth2 <= 1 ? 1 : reasoningDepth2 <= 3 ? 2 : 3;
    const arithmeticComplexity = getArithmeticComplexity(
      input.values
    );
    const directLookup2 = operationCount2 === 1 && reasoningDepth2 === 1 && !usesPercentage2 && !usesRatio2 && !usesComparison2;
    const combinedConditions2 = hasAnyToken(combinedText2, [
      "if",
      "when",
      "respectively"
    ]);
    return {
      operationCount: operationCount2,
      reasoningDepth: reasoningDepth2,
      arithmeticComplexity,
      usesPercentage: usesPercentage2,
      usesRatio: usesRatio2,
      usesComparison: usesComparison2,
      visualComplexity: 0,
      inferenceComplexity: Math.max(
        inferenceComplexity2,
        input.dependencyComplexity ?? 1
      ),
      directLookup: directLookup2,
      trendAnalysis: false,
      multiStep: reasoningDepth2 >= 2 || operationCount2 >= 2 || variableCount >= 3,
      combinedConditions: combinedConditions2,
      crossColumnInference: false
    };
  }
  if (input.kind === "logic") {
    const combinedText2 = `${input.text} ${input.explanation}`.toLowerCase();
    const operationCount2 = Math.max(
      1,
      input.operationChain?.length ?? input.reasoningSteps?.length ?? 1
    );
    const reasoningDepth2 = Math.max(
      1,
      input.reasoningSteps?.length ?? operationCount2
    );
    const usesComparison2 = hasAnyToken(combinedText2, [
      "compare",
      "same",
      "which",
      "pattern"
    ]);
    const combinedConditions2 = hasAnyToken(combinedText2, [
      "if",
      "after",
      "condition",
      "first",
      "then"
    ]);
    const directLookup2 = operationCount2 === 1 && reasoningDepth2 === 1 && !combinedConditions2;
    return {
      operationCount: operationCount2,
      reasoningDepth: reasoningDepth2,
      arithmeticComplexity: 1,
      usesPercentage: false,
      usesRatio: false,
      usesComparison: usesComparison2,
      visualComplexity: 0,
      inferenceComplexity: Math.max(
        reasoningDepth2 >= 4 ? 3 : reasoningDepth2 >= 2 ? 2 : 1,
        input.dependencyComplexity ?? 1
      ),
      directLookup: directLookup2,
      trendAnalysis: false,
      multiStep: reasoningDepth2 >= 2 || operationCount2 >= 2,
      combinedConditions: combinedConditions2,
      crossColumnInference: false
    };
  }
  const combinedText = `${input.text} ${input.explanation}`.toLowerCase();
  const usesPercentage = hasAnyToken(combinedText, [
    "%",
    "percent",
    "percentage",
    "share",
    "growth"
  ]);
  const usesRatio = hasAnyToken(combinedText, [
    "ratio"
  ]);
  const usesComparison = hasAnyToken(combinedText, [
    "highest",
    "lowest",
    "difference",
    "increase",
    "decrease",
    "decline",
    "fluctuation",
    "largest",
    "smallest",
    "compare"
  ]);
  const directLookup = hasAnyToken(combinedText, [
    "highest",
    "lowest",
    "largest",
    "smallest"
  ]) && !hasAnyToken(combinedText, [
    "difference",
    "increase",
    "growth",
    "ratio",
    "percentage",
    "share"
  ]);
  const trendAnalysis = hasAnyToken(combinedText, [
    "trend",
    "increase",
    "decline",
    "fluctuation",
    "growth",
    "consecutive"
  ]);
  const combinedConditions = hasAnyToken(combinedText, [
    "combined",
    "together",
    "overall",
    "from",
    "to"
  ]);
  let operationCount = 1;
  if (combinedText.includes("total")) {
    operationCount = Math.max(
      2,
      input.rowCount - 1
    );
  } else if (combinedText.includes("average")) {
    operationCount = Math.max(
      2,
      input.rowCount
    );
  } else if (usesPercentage) {
    operationCount = combinedText.includes(
      "combined"
    ) ? 4 : 3;
  } else if (usesRatio) {
    operationCount = 3;
  } else if (hasAnyToken(combinedText, [
    "difference",
    "increase",
    "decline",
    "fluctuation"
  ])) {
    operationCount = trendAnalysis ? Math.max(2, input.rowCount - 1) : 2;
  } else if (directLookup) {
    operationCount = 1;
  }
  const reasoningDepth = Math.min(
    5,
    Math.max(
      1,
      (directLookup ? 1 : 2) + (trendAnalysis ? 2 : 0) + (usesPercentage || usesRatio ? 1 : 0) + (combinedConditions ? 1 : 0)
    )
  );
  const explicitReasoningDepth = input.reasoningSteps?.length ?? 0;
  const inferenceComplexity = Math.min(
    5,
    Math.max(
      1,
      (directLookup ? 1 : 2) + (trendAnalysis ? 2 : 0) + (input.numericColumnCount > 1 ? 1 : 0) + (combinedConditions ? 1 : 0)
    )
  );
  return {
    operationCount,
    arithmeticComplexity: 1,
    reasoningDepth: Math.max(
      reasoningDepth,
      explicitReasoningDepth
    ),
    usesPercentage,
    usesRatio,
    usesComparison,
    visualComplexity: getVisualComplexity(
      input.visualType
    ),
    inferenceComplexity: Math.max(
      inferenceComplexity,
      input.dependencyComplexity ?? 1
    ),
    directLookup,
    trendAnalysis,
    multiStep: operationCount >= 3 || trendAnalysis || usesPercentage || usesRatio,
    combinedConditions,
    crossColumnInference: input.numericColumnCount > 1 && combinedConditions
  };
}
function estimateDifficultyScore(input) {
  const signals = deriveDifficultySignals(input);
  let score = 0.45 + signals.arithmeticComplexity * 0.7 + signals.operationCount * 0.15 + signals.reasoningDepth * 0.5 + signals.visualComplexity * 0.18 + signals.inferenceComplexity * 0.18;
  if (signals.usesPercentage) {
    score += 0.18;
  }
  if (signals.usesRatio) {
    score += 0.22;
  }
  if (signals.usesComparison) {
    score += 0.12;
  }
  if (signals.trendAnalysis) {
    score += 0.3;
  }
  if (signals.multiStep) {
    score += 0.25;
  }
  if (signals.combinedConditions) {
    score += 0.3;
  }
  if (signals.crossColumnInference) {
    score += 0.5;
  }
  if (signals.directLookup) {
    score -= 0.7;
  }
  if (signals.operationCount <= 1 && signals.reasoningDepth <= 1 && !signals.combinedConditions && !signals.crossColumnInference) {
    score -= 0.85;
  }
  if (input.kind === "formula") {
    const targetDifficultyScore = input.targetDifficultyScore;
    if (input.difficultyHint === "Easy") {
      const easyCeiling = targetDifficultyScore !== void 0 ? Math.min(
        2.6,
        targetDifficultyScore + 0.9
      ) : 2.6;
      score = Math.min(
        score,
        easyCeiling
      );
    } else if (input.difficultyHint === "Medium") {
      const mediumFloor = targetDifficultyScore !== void 0 ? Math.max(
        3.8,
        targetDifficultyScore - 0.7
      ) : 4.1;
      const mediumCeiling = targetDifficultyScore !== void 0 ? Math.min(
        6.8,
        targetDifficultyScore + 0.9
      ) : 6.7;
      score = Math.min(
        Math.max(
          score,
          mediumFloor
        ),
        mediumCeiling
      );
    } else if (input.difficultyHint === "Hard") {
      const hardFloor = targetDifficultyScore !== void 0 ? Math.max(
        7.2,
        targetDifficultyScore - 0.8
      ) : 7.6;
      score = Math.max(
        score,
        hardFloor
      );
    }
  } else if (input.kind === "logic") {
    const targetDifficultyScore = input.targetDifficultyScore;
    if (input.difficultyHint === "Easy") {
      score = Math.min(
        score,
        targetDifficultyScore !== void 0 ? Math.min(2.7, targetDifficultyScore + 0.8) : 2.7
      );
    } else if (input.difficultyHint === "Medium") {
      score = Math.min(
        Math.max(
          score,
          targetDifficultyScore !== void 0 ? Math.max(3.9, targetDifficultyScore - 0.6) : 4
        ),
        targetDifficultyScore !== void 0 ? Math.min(6.8, targetDifficultyScore + 0.8) : 6.6
      );
    } else if (input.difficultyHint === "Hard") {
      score = Math.max(
        score,
        targetDifficultyScore !== void 0 ? Math.max(7.3, targetDifficultyScore - 0.8) : 7.5
      );
    }
  }
  return clampDifficultyScore(
    score
  );
}
function calculateDifficultyMetadata(input) {
  const signals = deriveDifficultySignals(input);
  const difficultyScore = estimateDifficultyScore(input);
  const difficultyLabel = classifyDifficultyLabel(
    difficultyScore
  );
  return {
    difficultyScore,
    difficultyLabel,
    estimatedSolveTime: Math.max(
      20,
      Math.round(
        25 + difficultyScore * 14 + signals.operationCount * 4
      )
    ),
    operationCount: signals.operationCount,
    reasoningDepth: signals.reasoningDepth,
    reasoningSteps: input.reasoningSteps ?? [],
    dependencyComplexity: input.dependencyComplexity ?? signals.inferenceComplexity,
    operationChain: input.operationChain ?? [],
    usesPercentage: signals.usesPercentage,
    usesRatio: signals.usesRatio,
    usesComparison: signals.usesComparison,
    visualComplexity: signals.visualComplexity,
    inferenceComplexity: signals.inferenceComplexity
  };
}
function applyDifficultyMetadata(question, input) {
  const difficultyMetadata = calculateDifficultyMetadata(
    input
  );
  return {
    ...question,
    difficulty: difficultyMetadata.difficultyLabel,
    difficultyScore: difficultyMetadata.difficultyScore,
    difficultyLabel: difficultyMetadata.difficultyLabel,
    difficultyMetadata
  };
}
function validateDifficultyTarget(difficultyScore, options) {
  if (options?.targetDifficulty === void 0) {
    return true;
  }
  const tolerance = options.difficultyTolerance ?? 1;
  return Math.abs(
    difficultyScore - options.targetDifficulty
  ) <= tolerance;
}
function sortByTargetDifficulty(questions2, targetDifficulty) {
  return [...questions2].sort(
    (a, b2) => Math.abs(
      a.difficultyScore - targetDifficulty
    ) - Math.abs(
      b2.difficultyScore - targetDifficulty
    )
  );
}
function buildDifficultyBalancedSet(questions2, desiredCount, options) {
  if (questions2.length <= desiredCount && !options?.difficultyDistribution && options?.targetAverageDifficulty === void 0 && options?.targetDifficulty === void 0) {
    return questions2;
  }
  let pool = [...questions2];
  if (options?.targetDifficulty !== void 0) {
    const withinTolerance = sortByTargetDifficulty(
      pool.filter(
        (question) => validateDifficultyTarget(
          question.difficultyScore,
          options
        )
      ),
      options.targetDifficulty
    );
    if (withinTolerance.length >= desiredCount) {
      pool = withinTolerance;
    } else {
      pool = sortByTargetDifficulty(
        pool,
        options.targetDifficulty
      );
    }
  }
  if (options?.difficultyDistribution) {
    const targets = getDifficultyBucketTargets(
      desiredCount,
      options.difficultyDistribution
    );
    const byLabel = {
      Easy: pool.filter(
        (question) => question.difficultyLabel === "Easy"
      ).sort(
        (a, b2) => a.difficultyScore - b2.difficultyScore
      ),
      Medium: pool.filter(
        (question) => question.difficultyLabel === "Medium"
      ).sort(
        (a, b2) => a.difficultyScore - b2.difficultyScore
      ),
      Hard: pool.filter(
        (question) => question.difficultyLabel === "Hard"
      ).sort(
        (a, b2) => a.difficultyScore - b2.difficultyScore
      )
    };
    const selected = [];
    Object.keys(targets).forEach((label) => {
      selected.push(
        ...byLabel[label].slice(
          0,
          targets[label]
        )
      );
    });
    if (selected.length < desiredCount) {
      const selectedSet = new Set(
        selected
      );
      const remainder = pool.filter(
        (question) => !selectedSet.has(question)
      );
      selected.push(
        ...remainder.slice(
          0,
          desiredCount - selected.length
        )
      );
    }
    pool = selected;
  }
  if (options?.targetAverageDifficulty !== void 0) {
    pool = sortByTargetDifficulty(
      pool,
      options.targetAverageDifficulty
    );
  }
  return pool.slice(0, desiredCount);
}

// src/lib/quant/di/index.ts
function getCategoryLabel(di, index2) {
  return di.categories?.[index2] ?? `Category ${index2 + 1}`;
}
function generateDISet(pattern) {
  const di = pattern.diPattern;
  if (!di) {
    throw new ReasoningEngineError({
      code: "DI_PATTERN_MISSING",
      phase: "topology",
      message: "DI pattern configuration is missing.",
      metadata: buildReasoningErrorMetadata({
        patternId: pattern.id,
        topic: pattern.topic
      })
    });
  }
  if (!di.columns.length) {
    throw new ReasoningEngineError({
      code: "DI_COLUMNS_MISSING",
      phase: "topology",
      message: "DI pattern must include columns.",
      metadata: buildReasoningErrorMetadata({
        patternId: pattern.id,
        topic: pattern.topic
      })
    });
  }
  const rows = [];
  for (let i = 0; i < di.rowCount; i++) {
    const row = {};
    for (const column of di.columns) {
      const range = di.valueRanges[column];
      row[column] = range ? randomInt(
        range.min,
        range.max
      ) : getCategoryLabel(di, i);
    }
    rows.push(row);
  }
  return rows;
}
function selectSeriesCount(availableCount, visualType) {
  if (availableCount <= 1) {
    return availableCount;
  }
  const roll = random();
  if (visualType === "line") {
    if (availableCount >= 3 && roll > 0.95) {
      return 3;
    }
    if (roll > 0.65) {
      return 2;
    }
    return 1;
  }
  if (visualType === "bar") {
    if (availableCount >= 3 && roll > 0.95) {
      return 3;
    }
    if (roll > 0.75) {
      return 2;
    }
    return 1;
  }
  return 1;
}
function getSeriesConfig(di, tableData, visualType) {
  const numericColumns = getNumericColumns(tableData);
  if (di.series?.length) {
    return di.series.filter(
      (series) => numericColumns.includes(
        series.column
      )
    );
  }
  if (visualType !== "bar" && visualType !== "line") {
    return void 0;
  }
  const seriesCount = selectSeriesCount(
    numericColumns.length,
    visualType
  );
  return numericColumns.slice(0, seriesCount).map(
    (column) => ({
      column,
      type: visualType,
      label: column
    })
  );
}
function getNumericColumns(tableData) {
  const firstRow = tableData[0];
  if (!firstRow) {
    return [];
  }
  return Object.keys(firstRow).filter(
    (key) => typeof firstRow[key] === "number"
  );
}
function getCategoryColumn(tableData) {
  const firstRow = tableData[0];
  if (!firstRow) {
    return void 0;
  }
  return Object.keys(firstRow).find(
    (key) => typeof firstRow[key] === "string"
  );
}
function generateChoiceOptions(choices, correctChoice) {
  const uniqueChoices = [
    ...new Set(choices)
  ];
  const shuffled = shuffle(uniqueChoices);
  return {
    options: shuffled,
    correct: shuffled.indexOf(
      correctChoice
    )
  };
}
function createNumericQuestion(text2, correct, explanation, context) {
  const generated = generateNumericOptions(
    correct,
    context
  );
  return {
    text: text2,
    options: generated.options,
    correct: generated.correct,
    explanation,
    optionMetadata: generated.optionMetadata
  };
}
function createCategoryQuestion(text2, categories2, correctCategory, explanation) {
  const generated = generateChoiceOptions(
    categories2,
    correctCategory
  );
  return {
    text: text2,
    options: generated.options,
    correct: generated.correct,
    explanation
  };
}
function createChoiceQuestion(text2, choices, correctChoice, explanation) {
  const generated = generateChoiceOptions(
    choices,
    correctChoice
  );
  return {
    text: text2,
    options: generated.options,
    correct: generated.correct,
    explanation
  };
}
function filterCategoryIndices(context, predicate) {
  return context.values.map((value, index2) => ({
    value,
    index: index2
  })).filter(
    ({ value, index: index2 }) => predicate(value, index2)
  ).map((entry) => entry.index);
}
function aggregateByIndices(values2, indices) {
  return indices.reduce(
    (sum, index2) => sum + values2[index2],
    0
  );
}
function createDIQuestionContext(tableData, visualType, series, categoryColumn, numericColumns, numericColumn) {
  const values2 = tableData.map(
    (row) => Number(row[numericColumn])
  );
  const categories2 = tableData.map(
    (row) => String(row[categoryColumn])
  );
  const total = values2.reduce(
    (sum, value) => sum + value,
    0
  );
  const average = Math.round(
    total / values2.length
  );
  const highest = Math.max(...values2);
  const lowest = Math.min(...values2);
  const highestIndex = values2.indexOf(highest);
  const lowestIndex = values2.indexOf(lowest);
  return {
    tableData,
    visualType,
    series,
    categoryColumn,
    numericColumn,
    numericColumns,
    values: values2,
    categories: categories2,
    total,
    average,
    highestIndex,
    lowestIndex
  };
}
function generateTotalQuestion(context) {
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the total {numericColumn}?`,
        `Find the sum of {numericColumn} across all {categoryColumn} values.`
      ],
      {
        numericColumn: context.numericColumn,
        categoryColumn: context.categoryColumn
      }
    ),
    context.total,
    `Total ${context.numericColumn} = ${context.total}`
  );
}
function generateAverageQuestion(context) {
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the average {numericColumn}?`,
        `Calculate the mean {numericColumn} for the given {categoryColumn} values.`
      ],
      {
        numericColumn: context.numericColumn,
        categoryColumn: context.categoryColumn
      }
    ),
    context.average,
    `Average ${context.numericColumn} = ${context.total} / ${context.values.length}`
  );
}
function generateHighestQuestion(context) {
  const correctCategory = context.categories[context.highestIndex];
  return createCategoryQuestion(
    buildPrompt(
      [
        `Which {categoryColumn} had the highest {numericColumn}?`,
        `Identify the {categoryColumn} with the maximum {numericColumn}.`
      ],
      {
        categoryColumn: context.categoryColumn,
        numericColumn: context.numericColumn
      }
    ),
    context.categories,
    correctCategory,
    `${correctCategory} had the highest ${context.numericColumn}.`
  );
}
function generateLowestQuestion(context) {
  const correctCategory = context.categories[context.lowestIndex];
  return createCategoryQuestion(
    buildPrompt(
      [
        `Which {categoryColumn} had the lowest {numericColumn}?`,
        `Identify the {categoryColumn} with the minimum {numericColumn}.`
      ],
      {
        categoryColumn: context.categoryColumn,
        numericColumn: context.numericColumn
      }
    ),
    context.categories,
    correctCategory,
    `${correctCategory} had the lowest ${context.numericColumn}.`
  );
}
function generateDifferenceQuestion(context) {
  if (context.values.length < 2) {
    return void 0;
  }
  const firstCategory = context.categories[0];
  const secondCategory = context.categories[1];
  const difference = Math.abs(
    context.values[0] - context.values[1]
  );
  return createNumericQuestion(
    `What is the difference between ${firstCategory} and ${secondCategory} ${context.numericColumn}?`,
    difference,
    `Difference = ${difference}`
  );
}
function generatePercentageQuestion(context) {
  if (context.values.length < 2) {
    return void 0;
  }
  const firstCategory = context.categories[0];
  const secondCategory = context.categories[1];
  const firstValue = context.values[0];
  const secondValue = context.values[1];
  const percentageIncrease = firstValue === 0 ? 0 : Math.round(
    (secondValue - firstValue) / firstValue * 100
  );
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the percentage increase from {firstCategory} to {secondCategory} in {numericColumn}?`,
        `By what percent did {numericColumn} rise from {firstCategory} to {secondCategory}?`
      ],
      {
        firstCategory,
        secondCategory,
        numericColumn: context.numericColumn
      }
    ),
    percentageIncrease,
    `Percentage increase = ${percentageIncrease}%`
  );
}
function getConsecutiveComparisons(context) {
  const comparisons = [];
  for (let i = 1; i < context.values.length; i++) {
    const fromCategory = context.categories[i - 1];
    const toCategory = context.categories[i];
    const fromValue = context.values[i - 1];
    const toValue = context.values[i];
    const difference = toValue - fromValue;
    comparisons.push({
      label: `${fromCategory} to ${toCategory}`,
      fromCategory,
      toCategory,
      fromValue,
      toValue,
      difference,
      absoluteDifference: Math.abs(difference)
    });
  }
  return comparisons;
}
function getOverallTrend(values2) {
  const differences = values2.slice(1).map(
    (value, index2) => value - values2[index2]
  );
  if (differences.every(
    (difference) => difference > 0
  )) {
    return "Increasing";
  }
  if (differences.every(
    (difference) => difference < 0
  )) {
    return "Decreasing";
  }
  if (differences.every(
    (difference) => difference === 0
  )) {
    return "No change";
  }
  return "Fluctuating";
}
function generateLineTrendQuestion(context) {
  if (context.values.length < 2) {
    return void 0;
  }
  const trend = getOverallTrend(context.values);
  return createChoiceQuestion(
    `What was the overall trend in ${context.numericColumn}?`,
    [
      "Increasing",
      "Decreasing",
      "Fluctuating",
      "No change"
    ],
    trend,
    `${context.numericColumn} was ${trend.toLowerCase()} across the given ${context.categoryColumn} values.`
  );
}
function generateLineHighestPointQuestion(context) {
  const correctCategory = context.categories[context.highestIndex];
  return createCategoryQuestion(
    `During which ${context.categoryColumn} was ${context.numericColumn} highest?`,
    context.categories,
    correctCategory,
    `${context.numericColumn} was highest during ${correctCategory}.`
  );
}
function generateLineLowestPointQuestion(context) {
  const correctCategory = context.categories[context.lowestIndex];
  return createCategoryQuestion(
    `During which ${context.categoryColumn} was ${context.numericColumn} lowest?`,
    context.categories,
    correctCategory,
    `${context.numericColumn} was lowest during ${correctCategory}.`
  );
}
function generateLineGrowthQuestion(context) {
  if (context.values.length < 2 || context.values[0] === 0) {
    return void 0;
  }
  const firstCategory = context.categories[0];
  const lastCategory = context.categories[context.categories.length - 1];
  const firstValue = context.values[0];
  const lastValue = context.values[context.values.length - 1];
  const growth = Math.round(
    (lastValue - firstValue) / firstValue * 100
  );
  return createNumericQuestion(
    `What was the percentage growth in ${context.numericColumn} from ${firstCategory} to ${lastCategory}?`,
    growth,
    `Percentage growth = (${lastValue} - ${firstValue}) / ${firstValue} x 100 = ${growth}%`
  );
}
function generateLineMaximumIncreaseQuestion(context) {
  const increases = getConsecutiveComparisons(
    context
  ).filter(
    (comparison) => comparison.difference > 0
  );
  if (!increases.length) {
    return void 0;
  }
  const maximumIncrease = increases.reduce(
    (best, comparison) => comparison.difference > best.difference ? comparison : best
  );
  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the increase in ${context.numericColumn} maximum?`,
    increases.map(
      (comparison) => comparison.label
    ),
    maximumIncrease.label,
    `The maximum increase was from ${maximumIncrease.fromCategory} to ${maximumIncrease.toCategory}: ${maximumIncrease.toValue} - ${maximumIncrease.fromValue} = ${maximumIncrease.difference}.`
  );
}
function generateLineDeclineQuestion(context) {
  const comparisons = getConsecutiveComparisons(context);
  const declines = comparisons.filter(
    (comparison) => comparison.difference < 0
  );
  if (!declines.length) {
    return void 0;
  }
  const firstDecline = declines[0];
  return createChoiceQuestion(
    `Which interval showed a decline in ${context.numericColumn}?`,
    comparisons.map(
      (comparison) => comparison.label
    ),
    firstDecline.label,
    `${context.numericColumn} declined from ${firstDecline.fromCategory} to ${firstDecline.toCategory}: ${firstDecline.fromValue} to ${firstDecline.toValue}.`
  );
}
function generateLineFluctuationQuestion(context) {
  const comparisons = getConsecutiveComparisons(context);
  if (!comparisons.length) {
    return void 0;
  }
  const greatestFluctuation = comparisons.reduce(
    (best, comparison) => comparison.absoluteDifference > best.absoluteDifference ? comparison : best
  );
  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the fluctuation in ${context.numericColumn} greatest?`,
    comparisons.map(
      (comparison) => comparison.label
    ),
    greatestFluctuation.label,
    `The greatest fluctuation was from ${greatestFluctuation.fromCategory} to ${greatestFluctuation.toCategory}: |${greatestFluctuation.toValue} - ${greatestFluctuation.fromValue}| = ${greatestFluctuation.absoluteDifference}.`
  );
}
function getPercentageShare(value, total) {
  return total === 0 ? 0 : Math.round(
    value / total * 100
  );
}
function getGreatestCommonDivisor(a, b2) {
  let x = Math.abs(a);
  let y = Math.abs(b2);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}
function formatRatio(first, second) {
  const divisor = getGreatestCommonDivisor(
    first,
    second
  );
  return `${Math.round(first / divisor)}:${Math.round(second / divisor)}`;
}
function generateRatioOptions(first, second) {
  const correct = formatRatio(
    first,
    second
  );
  const options = /* @__PURE__ */ new Set();
  options.add(correct);
  options.add(
    formatRatio(second, first)
  );
  options.add(
    formatRatio(
      first + second,
      second
    )
  );
  options.add(
    formatRatio(
      first,
      first + second
    )
  );
  while (options.size < 4) {
    options.add(
      formatRatio(
        first + randomInt(1, 5),
        second + randomInt(1, 5)
      )
    );
  }
  const shuffled = shuffle(
    [...options].slice(0, 4)
  );
  return {
    options: shuffled,
    correct: shuffled.indexOf(correct)
  };
}
function generatePercentageShareQuestion(context) {
  if (!context.values.length) {
    return void 0;
  }
  const index2 = randomInt(
    0,
    context.values.length - 1
  );
  const category = context.categories[index2];
  const share = getPercentageShare(
    context.values[index2],
    context.total
  );
  return createNumericQuestion(
    `What percentage share does ${category} contribute to total ${context.numericColumn}?`,
    share,
    `${category} contributes approximately ${share}% of total ${context.numericColumn}.`
  );
}
function generateLargestSectorQuestion(context) {
  const correctCategory = context.categories[context.highestIndex];
  return createCategoryQuestion(
    `Which ${context.categoryColumn} contributes the highest percentage?`,
    context.categories,
    correctCategory,
    `${correctCategory} has the largest contribution to total ${context.numericColumn}.`
  );
}
function generateSmallestSectorQuestion(context) {
  const correctCategory = context.categories[context.lowestIndex];
  return createCategoryQuestion(
    `Which ${context.categoryColumn} has the smallest contribution?`,
    context.categories,
    correctCategory,
    `${correctCategory} has the smallest contribution to total ${context.numericColumn}.`
  );
}
function generateRatioQuestion(context) {
  if (context.values.length < 2) {
    return void 0;
  }
  const firstCategory = context.categories[0];
  const secondCategory = context.categories[1];
  const generated = generateRatioOptions(
    context.values[0],
    context.values[1]
  );
  return {
    text: `What is the approximate ratio between ${firstCategory} and ${secondCategory}?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `Ratio ${firstCategory}:${secondCategory} = ${formatRatio(
      context.values[0],
      context.values[1]
    )}`
  };
}
function generateContributionQuestion(context) {
  if (context.values.length < 2) {
    return void 0;
  }
  const firstCategory = context.categories[0];
  const secondCategory = context.categories[1];
  const combinedShare = getPercentageShare(
    context.values[0] + context.values[1],
    context.total
  );
  return createNumericQuestion(
    `What is the combined share of ${firstCategory} and ${secondCategory}?`,
    combinedShare,
    `${firstCategory} and ${secondCategory} together contribute approximately ${combinedShare}% of total ${context.numericColumn}.`
  );
}
function getSeriesColumns(context) {
  return context.series?.map(
    (series) => series.column
  ) ?? context.numericColumns;
}
function getPrimarySeriesPair(context) {
  const seriesColumns = getSeriesColumns(context);
  if (seriesColumns.length < 2) {
    return void 0;
  }
  return {
    first: seriesColumns[0],
    second: seriesColumns[1]
  };
}
function getColumnNumericValues(context, column) {
  return context.tableData.map(
    (row) => Number(row[column])
  );
}
function getValueByCategory(context, column, categoryIndex) {
  return Number(
    context.tableData[categoryIndex]?.[column]
  );
}
function getRankedEntries(context, values2 = context.values) {
  return context.categories.map((category, index2) => ({
    category,
    index: index2,
    value: values2[index2]
  })).sort(
    (a, b2) => b2.value - a.value
  );
}
function getValuesExcludingIndex(values2, excludedIndex) {
  return values2.filter(
    (_value, index2) => index2 !== excludedIndex
  );
}
function countAboveThreshold(values2, threshold) {
  return values2.filter(
    (value) => value > threshold
  ).length;
}
function generateSecondHighestQuestion(context) {
  if (context.values.length < 2) {
    return void 0;
  }
  const rankedEntries = getRankedEntries(context);
  const secondHighest = rankedEntries[1];
  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `Which {categoryColumn} recorded the second highest {numericColumn}?`,
        `Identify the {categoryColumn} with the second-largest {numericColumn}.`
      ],
      {
        categoryColumn: context.categoryColumn,
        numericColumn: context.numericColumn
      }
    ),
    context.categories,
    secondHighest.category,
    `${secondHighest.category} had the second highest ${context.numericColumn}.`
  );
}
function generateClosestToAverageQuestion(context) {
  if (!context.values.length) {
    return void 0;
  }
  const closestEntry = context.categories.map((category, index2) => ({
    category,
    value: context.values[index2],
    deviation: Math.abs(
      context.values[index2] - context.average
    )
  })).sort(
    (a, b2) => a.deviation - b2.deviation
  )[0];
  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `Which {categoryColumn} was closest to the average {numericColumn}?`,
        `For which {categoryColumn} was {numericColumn} nearest to its average value?`
      ],
      {
        categoryColumn: context.categoryColumn,
        numericColumn: context.numericColumn
      }
    ),
    context.categories,
    closestEntry.category,
    `${closestEntry.category} was closest to the average ${context.numericColumn}.`
  );
}
function generateMaximumGapQuestion(context) {
  const comparisons = getConsecutiveComparisons(context);
  if (!comparisons.length) {
    return void 0;
  }
  const maximumGap = comparisons.reduce(
    (best, comparison) => comparison.absoluteDifference > best.absoluteDifference ? comparison : best
  );
  return createChoiceQuestion(
    buildComparisonPrompt(
      [
        `Across which consecutive {categoryColumn} values was the gap in {numericColumn} the largest?`,
        `Between which adjacent {categoryColumn}s was the maximum gap in {numericColumn} observed?`
      ],
      {
        categoryColumn: context.categoryColumn,
        numericColumn: context.numericColumn
      }
    ),
    comparisons.map(
      (comparison) => comparison.label
    ),
    maximumGap.label,
    `The largest gap was ${maximumGap.absoluteDifference} between ${maximumGap.fromCategory} and ${maximumGap.toCategory}.`
  );
}
function generateMinimumGapQuestion(context) {
  const comparisons = getConsecutiveComparisons(context);
  if (!comparisons.length) {
    return void 0;
  }
  const minimumGap = comparisons.reduce(
    (best, comparison) => comparison.absoluteDifference < best.absoluteDifference ? comparison : best
  );
  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the gap in ${context.numericColumn} minimum?`,
    comparisons.map(
      (comparison) => comparison.label
    ),
    minimumGap.label,
    `The minimum gap was ${minimumGap.absoluteDifference} between ${minimumGap.fromCategory} and ${minimumGap.toCategory}.`
  );
}
function generateAboveAverageCountQuestion(context) {
  const count = countAboveThreshold(
    context.values,
    context.average
  );
  return createNumericQuestion(
    `How many ${context.categoryColumn}s had ${context.numericColumn} above the average?`,
    count,
    `${count} ${context.categoryColumn} values were above average ${context.numericColumn}.`
  );
}
function generateExcludingTopLeaderQuestion(context) {
  if (context.values.length < 3) {
    return void 0;
  }
  const valuesExcludingHighest = getValuesExcludingIndex(
    context.values,
    context.highestIndex
  );
  const remainingCategories = context.categories.filter(
    (_category, index2) => index2 !== context.highestIndex
  );
  const remainingLeader = remainingCategories[valuesExcludingHighest.indexOf(
    Math.max(
      ...valuesExcludingHighest
    )
  )];
  return createCategoryQuestion(
    `If ${context.categories[context.highestIndex]} is excluded, which ${context.categoryColumn} has the highest ${context.numericColumn}?`,
    remainingCategories,
    remainingLeader,
    `Excluding ${context.categories[context.highestIndex]}, ${remainingLeader} becomes the leader.`
  );
}
function generateGroupedIntervalTotalQuestion(context) {
  if (context.values.length < 4) {
    return void 0;
  }
  const midpoint = Math.floor(
    context.values.length / 2
  );
  const firstGroupTotal = context.values.slice(0, midpoint).reduce(
    (sum, value) => sum + value,
    0
  );
  const secondGroupTotal = context.values.slice(midpoint).reduce(
    (sum, value) => sum + value,
    0
  );
  const difference = Math.abs(
    firstGroupTotal - secondGroupTotal
  );
  return createNumericQuestion(
    `What is the difference between the total ${context.numericColumn} of the first half and second half of the ${context.categoryColumn}s?`,
    difference,
    `The grouped total difference is ${difference}.`
  );
}
function generateSubsetAverageQuestion(context) {
  if (context.values.length < 3) {
    return void 0;
  }
  const sorted = getRankedEntries(context);
  const subset = sorted.slice(0, 3);
  const subsetAverage = Math.round(
    subset.reduce(
      (sum, entry) => sum + entry.value,
      0
    ) / subset.length
  );
  return createNumericQuestion(
    `What is the average ${context.numericColumn} of the top three ${context.categoryColumn}s?`,
    subsetAverage,
    `The average for the top three ${context.categoryColumn}s is ${subsetAverage}.`
  );
}
function generateMaximumDifferenceBetweenSeriesQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const firstValues = getColumnNumericValues(
    context,
    seriesPair.first
  );
  const secondValues = getColumnNumericValues(
    context,
    seriesPair.second
  );
  const differences = firstValues.map(
    (value, index2) => Math.abs(
      value - secondValues[index2]
    )
  );
  const maxIndex = differences.indexOf(
    Math.max(...differences)
  );
  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `In which {categoryColumn} was the difference between {firstSeries} and {secondSeries} maximum?`,
        `Where was the gap between {firstSeries} and {secondSeries} the highest?`
      ],
      {
        categoryColumn: context.categoryColumn,
        firstSeries: seriesPair.first,
        secondSeries: seriesPair.second
      }
    ),
    context.categories,
    context.categories[maxIndex],
    `The maximum inter-series difference occurred at ${context.categories[maxIndex]}.`
  );
}
function generateCombinedTotalByCategoryQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const categoryIndex = randomInt(
    0,
    context.categories.length - 1
  );
  const combinedTotal = getValueByCategory(
    context,
    seriesPair.first,
    categoryIndex
  ) + getValueByCategory(
    context,
    seriesPair.second,
    categoryIndex
  );
  return createNumericQuestion(
    `What was the combined total of ${seriesPair.first} and ${seriesPair.second} in ${context.categories[categoryIndex]}?`,
    combinedTotal,
    `The combined total in ${context.categories[categoryIndex]} was ${combinedTotal}.`
  );
}
function generateRatioBetweenSeriesQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const categoryIndex = randomInt(
    0,
    context.categories.length - 1
  );
  const firstValue = getValueByCategory(
    context,
    seriesPair.first,
    categoryIndex
  );
  const secondValue = getValueByCategory(
    context,
    seriesPair.second,
    categoryIndex
  );
  const generated = generateRatioOptions(
    firstValue,
    secondValue
  );
  return {
    text: `What was the ratio of ${seriesPair.first} to ${seriesPair.second} in ${context.categories[categoryIndex]}?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `The ratio in ${context.categories[categoryIndex]} was ${formatRatio(firstValue, secondValue)}.`
  };
}
function generateConditionalCrossSeriesCountQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const firstValues = getColumnNumericValues(
    context,
    seriesPair.first
  );
  const secondValues = getColumnNumericValues(
    context,
    seriesPair.second
  );
  const threshold = Math.max(
    10,
    Math.round(
      Math.abs(
        firstValues.reduce(
          (sum, value, index2) => sum + (value - secondValues[index2]),
          0
        ) / firstValues.length
      )
    )
  );
  const count = firstValues.filter(
    (value, index2) => value - secondValues[index2] > threshold
  ).length;
  return createNumericQuestion(
    `In how many ${context.categoryColumn}s did ${seriesPair.first} exceed ${seriesPair.second} by more than ${threshold}?`,
    count,
    `${seriesPair.first} exceeded ${seriesPair.second} by more than ${threshold} in ${count} ${context.categoryColumn} values.`
  );
}
function generateRelativeGrowthComparisonQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const firstValues = getColumnNumericValues(
    context,
    seriesPair.first
  );
  const secondValues = getColumnNumericValues(
    context,
    seriesPair.second
  );
  const intervals = getConsecutiveComparisons({
    ...context,
    values: firstValues
  });
  const secondIntervals = getConsecutiveComparisons({
    ...context,
    values: secondValues
  });
  const betterInterval = intervals.find(
    (comparison, index2) => comparison.difference > (secondIntervals[index2]?.difference ?? 0)
  );
  if (!betterInterval) {
    return void 0;
  }
  return createChoiceQuestion(
    `Between which consecutive ${context.categoryColumn}s did ${seriesPair.first} increase more sharply than ${seriesPair.second}?`,
    intervals.map(
      (comparison) => comparison.label
    ),
    betterInterval.label,
    `${seriesPair.first} increased more sharply than ${seriesPair.second} over ${betterInterval.label}.`
  );
}
function generateCrossoverAnalysisQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const firstValues = getColumnNumericValues(
    context,
    seriesPair.first
  );
  const secondValues = getColumnNumericValues(
    context,
    seriesPair.second
  );
  for (let i = 1; i < firstValues.length; i++) {
    const previousGap = firstValues[i - 1] - secondValues[i - 1];
    const currentGap = firstValues[i] - secondValues[i];
    if (previousGap !== 0 && currentGap !== 0 && Math.sign(previousGap) !== Math.sign(currentGap)) {
      const interval2 = `${context.categories[i - 1]} to ${context.categories[i]}`;
      return createChoiceQuestion(
        `Between which interval did ${seriesPair.first} and ${seriesPair.second} cross over each other?`,
        getConsecutiveComparisons(context).map(
          (comparison) => comparison.label
        ),
        interval2,
        `The two series crossed over during ${interval2}.`
      );
    }
  }
  return void 0;
}
function generateComparativeFluctuationQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const getTotalFluctuation = (seriesColumn) => getConsecutiveComparisons({
    ...context,
    values: getColumnNumericValues(
      context,
      seriesColumn
    )
  }).reduce(
    (sum, comparison) => sum + comparison.absoluteDifference,
    0
  );
  const firstFluctuation = getTotalFluctuation(
    seriesPair.first
  );
  const secondFluctuation = getTotalFluctuation(
    seriesPair.second
  );
  const answer = firstFluctuation >= secondFluctuation ? seriesPair.first : seriesPair.second;
  return createChoiceQuestion(
    `Which series showed greater fluctuation across the given ${context.categoryColumn} values?`,
    [
      seriesPair.first,
      seriesPair.second
    ],
    answer,
    `${answer} showed the greater overall fluctuation.`
  );
}
function generateLeastDeviationQuestion(context) {
  const leastDeviationEntry = context.categories.map((category, index2) => ({
    category,
    deviation: Math.abs(
      context.values[index2] - context.average
    )
  })).sort(
    (a, b2) => a.deviation - b2.deviation
  )[0];
  const question = createCategoryQuestion(
    `Which ${context.categoryColumn} had the least deviation from the average ${context.numericColumn}?`,
    context.categories,
    leastDeviationEntry.category,
    `${leastDeviationEntry.category} had the least deviation from the average.`
  );
  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average ${context.numericColumn}.`
      ),
      createReasoningStep(
        "deviation",
        `Measure deviation of each ${context.categoryColumn} from that average.`
      ),
      createReasoningStep(
        "rank",
        "Select the least deviation."
      )
    ],
    3
  );
}
function generateFilteredLowestCrossSeriesQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const filterValues = getColumnNumericValues(
    context,
    seriesPair.second
  );
  const filterAverage = Math.round(
    filterValues.reduce(
      (sum, value) => sum + value,
      0
    ) / filterValues.length
  );
  const eligibleIndices = filterValues.map((value, index2) => ({
    value,
    index: index2
  })).filter(
    ({ value }) => value > filterAverage
  ).map((entry) => entry.index);
  if (!eligibleIndices.length) {
    return void 0;
  }
  const primaryValues = getColumnNumericValues(
    context,
    seriesPair.first
  );
  const lowestPrimaryIndex = eligibleIndices.reduce(
    (bestIndex, currentIndex) => primaryValues[currentIndex] < primaryValues[bestIndex] ? currentIndex : bestIndex
  );
  const eligibleCategories = eligibleIndices.map(
    (index2) => context.categories[index2]
  );
  const question = createCategoryQuestion(
    `Which ${context.categoryColumn} among those where ${seriesPair.second} exceeded its average had the lowest ${seriesPair.first}?`,
    eligibleCategories,
    context.categories[lowestPrimaryIndex],
    `${context.categories[lowestPrimaryIndex]} had the lowest ${seriesPair.first} among the filtered ${context.categoryColumn} values.`
  );
  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average of ${seriesPair.second}.`
      ),
      createReasoningStep(
        "filter",
        `Keep only ${context.categoryColumn} values where ${seriesPair.second} exceeds its average.`
      ),
      createReasoningStep(
        "compare",
        `Compare ${seriesPair.first} across the filtered subset.`
      ),
      createReasoningStep(
        "rank",
        `Select the minimum ${seriesPair.first} from the filtered subset.`
      )
    ],
    4
  );
}
function generateConditionalCombinedRatioQuestion(context) {
  const seriesPair = getPrimarySeriesPair(context);
  if (!seriesPair) {
    return void 0;
  }
  const firstValues = getColumnNumericValues(
    context,
    seriesPair.first
  );
  const secondValues = getColumnNumericValues(
    context,
    seriesPair.second
  );
  const secondAverage = Math.round(
    secondValues.reduce(
      (sum, value) => sum + value,
      0
    ) / secondValues.length
  );
  const filteredIndices = filterCategoryIndices(
    {
      ...context,
      values: secondValues
    },
    (value) => value > secondAverage
  );
  if (filteredIndices.length < 2) {
    return void 0;
  }
  const combinedPrimary = aggregateByIndices(
    firstValues,
    filteredIndices
  );
  const combinedSecondary = aggregateByIndices(
    secondValues,
    filteredIndices
  );
  const generated = generateRatioOptions(
    combinedPrimary,
    combinedSecondary
  );
  const question = {
    text: `What is the ratio of combined ${seriesPair.first} to combined ${seriesPair.second} in ${context.categoryColumn}s where ${seriesPair.second} exceeded its average?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `The required ratio is ${formatRatio(combinedPrimary, combinedSecondary)}.`
  };
  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average of ${seriesPair.second}.`
      ),
      createReasoningStep(
        "filter",
        `Select ${context.categoryColumn} values where ${seriesPair.second} exceeds its average.`
      ),
      createReasoningStep(
        "aggregate",
        `Add ${seriesPair.first} and ${seriesPair.second} separately over the filtered subset.`
      ),
      createReasoningStep(
        "ratio",
        "Form the ratio of the two combined totals."
      )
    ],
    5
  );
}
function getColumnValues(context, numericColumn) {
  return context.tableData.map(
    (row) => Number(row[numericColumn])
  );
}
function getAlternateNumericColumn(context) {
  return context.numericColumns.find(
    (column) => column !== context.numericColumn
  );
}
function getSortedIndices(values2) {
  return values2.map((value, index2) => ({
    value,
    index: index2
  })).sort(
    (a, b2) => b2.value - a.value
  ).map((entry) => entry.index);
}
function generateHighestAboveAverageQuestion(context) {
  if (context.average === 0) {
    return void 0;
  }
  const highestCategory = context.categories[context.highestIndex];
  const percentageAboveAverage = Math.round(
    (context.values[context.highestIndex] - context.average) / context.average * 100
  );
  return createNumericQuestion(
    `By what percentage does ${highestCategory} exceed the average ${context.numericColumn}?`,
    percentageAboveAverage,
    `${highestCategory} exceeds average ${context.numericColumn} by ${percentageAboveAverage}%.`
  );
}
function generateTopTwoCombinedShareQuestion(context) {
  if (context.values.length < 3) {
    return void 0;
  }
  const sortedIndices = getSortedIndices(context.values);
  const firstIndex = sortedIndices[0];
  const secondIndex = sortedIndices[1];
  const firstCategory = context.categories[firstIndex];
  const secondCategory = context.categories[secondIndex];
  const combinedShare = getPercentageShare(
    context.values[firstIndex] + context.values[secondIndex],
    context.total
  );
  return createNumericQuestion(
    `What percentage of total ${context.numericColumn} is contributed together by ${firstCategory} and ${secondCategory}?`,
    combinedShare,
    `${firstCategory} and ${secondCategory} together contribute ${combinedShare}% of total ${context.numericColumn}.`
  );
}
function generateAverageAbsoluteChangeQuestion(context) {
  const comparisons = getConsecutiveComparisons(context);
  if (!comparisons.length) {
    return void 0;
  }
  const totalAbsoluteChange = comparisons.reduce(
    (sum, comparison) => sum + comparison.absoluteDifference,
    0
  );
  const averageAbsoluteChange = Math.round(
    totalAbsoluteChange / comparisons.length
  );
  return createNumericQuestion(
    `What is the average fluctuation per interval in ${context.numericColumn}?`,
    averageAbsoluteChange,
    `Average fluctuation = ${totalAbsoluteChange} / ${comparisons.length} = ${averageAbsoluteChange}.`
  );
}
function generateConditionalGapQuestion(context) {
  if (context.values.length < 4) {
    return void 0;
  }
  const firstPair = context.values[0] + context.values[1];
  const secondPair = context.values[2] + context.values[3];
  const gap = Math.abs(
    firstPair - secondPair
  );
  return createNumericQuestion(
    `What is the difference between the combined ${context.numericColumn} of ${context.categories[0]} and ${context.categories[1]} versus ${context.categories[2]} and ${context.categories[3]}?`,
    gap,
    `Combined totals differ by ${gap}.`
  );
}
function generateCrossColumnCombinedLeaderQuestion(context) {
  const alternateColumn = getAlternateNumericColumn(context);
  if (!alternateColumn) {
    return void 0;
  }
  const alternateValues = getColumnValues(
    context,
    alternateColumn
  );
  const combinedValues = context.values.map(
    (value, index2) => value + alternateValues[index2]
  );
  const highestCombinedIndex = combinedValues.indexOf(
    Math.max(...combinedValues)
  );
  return createCategoryQuestion(
    `Which ${context.categoryColumn} has the highest combined total of ${context.numericColumn} and ${alternateColumn}?`,
    context.categories,
    context.categories[highestCombinedIndex],
    `${context.categories[highestCombinedIndex]} has the highest combined total across ${context.numericColumn} and ${alternateColumn}.`
  );
}
function generateCrossColumnRatioLeaderQuestion(context) {
  const alternateColumn = getAlternateNumericColumn(context);
  if (!alternateColumn) {
    return void 0;
  }
  const alternateValues = getColumnValues(
    context,
    alternateColumn
  );
  const ratios = context.values.map(
    (value, index2) => alternateValues[index2] === 0 ? Number.POSITIVE_INFINITY : value / alternateValues[index2]
  );
  const highestRatioIndex = ratios.indexOf(Math.max(...ratios));
  return createCategoryQuestion(
    `For which ${context.categoryColumn} is the ratio of ${context.numericColumn} to ${alternateColumn} the highest?`,
    context.categories,
    context.categories[highestRatioIndex],
    `${context.categories[highestRatioIndex]} has the highest ${context.numericColumn}:${alternateColumn} ratio.`
  );
}
function generateTrendReversalQuestion(context) {
  const comparisons = getConsecutiveComparisons(context);
  if (comparisons.length < 2) {
    return void 0;
  }
  for (let i = 1; i < comparisons.length; i++) {
    const previous = comparisons[i - 1].difference;
    const current = comparisons[i].difference;
    if (previous !== 0 && current !== 0 && Math.sign(previous) !== Math.sign(current)) {
      const turningCategory = context.categories[i];
      return createCategoryQuestion(
        `At which ${context.categoryColumn} did the trend in ${context.numericColumn} reverse direction?`,
        context.categories.slice(
          1,
          context.categories.length - 1
        ),
        turningCategory,
        `The trend reversed at ${turningCategory}.`
      );
    }
  }
  return void 0;
}
var DI_REASONING_ARCHETYPES = [
  { id: "total", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["table", "bar"], generate: generateTotalQuestion },
  { id: "highest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["table", "bar", "line"], generate: generateHighestQuestion },
  { id: "lowest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["table", "bar", "line"], generate: generateLowestQuestion },
  { id: "difference", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["table", "bar"], generate: generateDifferenceQuestion },
  { id: "line-trend", category: "trend-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineTrendQuestion },
  { id: "line-highest-point", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineHighestPointQuestion },
  { id: "line-lowest-point", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineLowestPointQuestion },
  { id: "pie-largest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["pie"], generate: generateLargestSectorQuestion },
  { id: "pie-smallest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["pie"], generate: generateSmallestSectorQuestion },
  { id: "pie-share", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["pie"], generate: generatePercentageShareQuestion },
  { id: "second-highest", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateSecondHighestQuestion },
  { id: "closest-to-average", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateClosestToAverageQuestion },
  { id: "least-deviation", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateLeastDeviationQuestion },
  { id: "average", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateAverageQuestion },
  { id: "percentage", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generatePercentageQuestion },
  { id: "pie-ratio", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["pie"], generate: generateRatioQuestion },
  { id: "contribution", category: "set-logic", difficulty: "Medium", visualTypes: ["table", "bar", "pie"], generate: generateContributionQuestion },
  { id: "minimum-gap", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateMinimumGapQuestion },
  { id: "above-average-count", category: "conditional-reasoning", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateAboveAverageCountQuestion },
  { id: "line-growth", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineGrowthQuestion },
  { id: "line-maximum-increase", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineMaximumIncreaseQuestion },
  { id: "line-decline", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineDeclineQuestion },
  { id: "series-max-diff", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateMaximumDifferenceBetweenSeriesQuestion },
  { id: "series-combined-total", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateCombinedTotalByCategoryQuestion },
  { id: "series-ratio", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateRatioBetweenSeriesQuestion },
  { id: "highest-above-average", category: "conditional-reasoning", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateHighestAboveAverageQuestion },
  { id: "top-two-combined-share", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "pie"], generate: generateTopTwoCombinedShareQuestion },
  { id: "conditional-gap", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateConditionalGapQuestion },
  { id: "grouped-interval-total", category: "set-logic", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateGroupedIntervalTotalQuestion },
  { id: "subset-average", category: "set-logic", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateSubsetAverageQuestion },
  { id: "excluding-top-leader", category: "conditional-reasoning", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateExcludingTopLeaderQuestion },
  { id: "average-absolute-change", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateAverageAbsoluteChangeQuestion },
  { id: "trend-reversal", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateTrendReversalQuestion },
  { id: "line-fluctuation", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateLineFluctuationQuestion },
  { id: "cross-column-combined-leader", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], requiresMultiSeries: true, generate: generateCrossColumnCombinedLeaderQuestion },
  { id: "cross-column-ratio-leader", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], requiresMultiSeries: true, generate: generateCrossColumnRatioLeaderQuestion },
  { id: "filtered-lowest-cross-series", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateFilteredLowestCrossSeriesQuestion },
  { id: "conditional-combined-ratio", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateConditionalCombinedRatioQuestion },
  { id: "series-conditional-count", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateConditionalCrossSeriesCountQuestion },
  { id: "series-relative-growth", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateRelativeGrowthComparisonQuestion },
  { id: "series-crossover", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateCrossoverAnalysisQuestion },
  { id: "series-comparative-fluctuation", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateComparativeFluctuationQuestion },
  { id: "maximum-gap", category: "comparative-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateMaximumGapQuestion }
];
function getQuestionGeneratorPool(context) {
  const hasMultipleSeries = getSeriesColumns(context).length > 1;
  const archetypes = DI_REASONING_ARCHETYPES.filter(
    (archetype) => archetype.visualTypes.includes(
      context.visualType
    ) && (!archetype.requiresMultiSeries || hasMultipleSeries)
  );
  return {
    Easy: archetypes.filter((archetype) => archetype.difficulty === "Easy").map((archetype) => archetype.generate),
    Medium: archetypes.filter((archetype) => archetype.difficulty === "Medium").map((archetype) => archetype.generate),
    Hard: archetypes.filter((archetype) => archetype.difficulty === "Hard").map((archetype) => archetype.generate)
  };
}
function getDefaultDISetProfile(options) {
  if (options?.setProfile) {
    return options.setProfile;
  }
  if (options?.difficultyDistribution) {
    return "balanced";
  }
  if (options?.targetDifficulty !== void 0 || options?.targetAverageDifficulty !== void 0) {
    return "balanced";
  }
  return "progressive";
}
function getDefaultSlotTargets(count, setProfile) {
  if (setProfile === "uniform") {
    return {
      Easy: 0,
      Medium: count,
      Hard: 0
    };
  }
  if (setProfile === "spike") {
    return {
      Easy: count >= 4 ? 1 : 0,
      Medium: count >= 4 ? count - 2 : count - 1,
      Hard: 1
    };
  }
  if (setProfile === "balanced") {
    return {
      Easy: count >= 4 ? 1 : 0,
      Medium: count >= 3 ? count - 2 : count - 1,
      Hard: 1
    };
  }
  return {
    Easy: Math.max(
      1,
      Math.floor(count / 5)
    ),
    Hard: Math.max(
      1,
      Math.ceil(count / 3)
    ),
    Medium: Math.max(
      0,
      count - Math.max(
        1,
        Math.floor(count / 5)
      ) - Math.max(
        1,
        Math.ceil(count / 3)
      )
    )
  };
}
function getUniformDifficultyLabel(options) {
  const targetScore = options?.targetAverageDifficulty ?? options?.targetDifficulty ?? 5.5;
  return classifyDifficultyLabel(
    targetScore
  );
}
function buildDifficultySlots(count, options) {
  const setProfile = getDefaultDISetProfile(options);
  if (setProfile === "uniform") {
    return {
      setProfile,
      slots: Array.from(
        { length: count },
        () => getUniformDifficultyLabel(
          options
        )
      )
    };
  }
  const targets = options?.difficultyDistribution ? getDifficultyBucketTargets(
    count,
    options.difficultyDistribution
  ) : getDefaultSlotTargets(
    count,
    setProfile
  );
  const slots = [];
  if (setProfile === "spike") {
    slots.push(...Array.from(
      { length: targets.Medium },
      () => "Medium"
    ));
    if (targets.Easy > 0) {
      slots.unshift("Easy");
    }
    if (targets.Hard > 0) {
      slots.push("Hard");
    }
  } else if (setProfile === "balanced") {
    if (targets.Easy > 0) {
      slots.push("Easy");
    }
    slots.push(
      ...Array.from(
        { length: targets.Medium },
        () => "Medium"
      )
    );
    if (targets.Hard > 0) {
      slots.push("Hard");
    }
  } else {
    slots.push(
      ...Array.from(
        { length: targets.Easy },
        () => "Easy"
      ),
      ...Array.from(
        { length: targets.Medium },
        () => "Medium"
      ),
      ...Array.from(
        { length: targets.Hard },
        () => "Hard"
      )
    );
  }
  while (slots.length < count) {
    slots.push("Medium");
  }
  return {
    setProfile,
    slots: slots.slice(0, count)
  };
}
function getSlotTargetScore(slot) {
  switch (slot) {
    case "Easy":
      return 2.5;
    case "Hard":
      return 8.5;
    case "Medium":
    default:
      return 5.5;
  }
}
function buildDIQuestionCandidates(context, generators) {
  return generators.map(
    (generator) => generator(context)
  ).filter(
    (question) => Boolean(question)
  ).map(
    (question) => applyDifficultyMetadata(
      question,
      {
        kind: "di",
        text: question.text,
        explanation: question.explanation,
        visualType: context.visualType,
        rowCount: context.tableData.length,
        numericColumnCount: context.numericColumns.length,
        reasoningSteps: question.reasoningSteps,
        dependencyComplexity: question.dependencyComplexity,
        operationChain: question.operationChain
      }
    )
  );
}
function selectQuestionForSlot(slot, candidates, usedQuestions) {
  const matching = candidates.filter(
    (candidate) => candidate.difficultyLabel === slot && !usedQuestions.has(
      candidate.text
    )
  ).sort(
    (a, b2) => Math.abs(
      a.difficultyScore - getSlotTargetScore(slot)
    ) - Math.abs(
      b2.difficultyScore - getSlotTargetScore(slot)
    )
  );
  if (matching.length) {
    return matching[0];
  }
  return candidates.filter(
    (candidate) => !usedQuestions.has(
      candidate.text
    )
  ).sort(
    (a, b2) => Math.abs(
      a.difficultyScore - getSlotTargetScore(slot)
    ) - Math.abs(
      b2.difficultyScore - getSlotTargetScore(slot)
    )
  )[0];
}
function summarizeDISetDifficulty(questions2, setProfile) {
  const totalDifficulty = questions2.reduce(
    (sum, question) => sum + question.difficultyScore,
    0
  );
  return {
    averageDifficulty: Number(
      (totalDifficulty / questions2.length).toFixed(1)
    ),
    peakDifficulty: Math.max(
      ...questions2.map(
        (question) => question.difficultyScore
      )
    ),
    difficultySpread: setProfile,
    setProfile
  };
}
function generateDIQuestions(tableData, visualType, series, options) {
  const categoryColumn = getCategoryColumn(tableData);
  const numericColumns = series?.length ? series.map(
    (seriesConfig) => seriesConfig.column
  ) : getNumericColumns(tableData);
  if (!categoryColumn || !numericColumns.length) {
    return {
      questions: [],
      averageDifficulty: 0,
      peakDifficulty: 0,
      difficultySpread: getDefaultDISetProfile(
        options
      ),
      setProfile: getDefaultDISetProfile(
        options
      )
    };
  }
  const { slots, setProfile } = buildDifficultySlots(
    5,
    options
  );
  const usedQuestions = /* @__PURE__ */ new Set();
  const selectedQuestions = [];
  slots.forEach((slot, slotIndex) => {
    const numericColumn = numericColumns[slotIndex % numericColumns.length];
    const context = createDIQuestionContext(
      tableData,
      visualType,
      series,
      categoryColumn,
      numericColumns,
      numericColumn
    );
    const generatorPool = getQuestionGeneratorPool(
      context
    );
    const candidates = buildDIQuestionCandidates(
      context,
      generatorPool[slot]
    );
    const selected = selectQuestionForSlot(
      slot,
      candidates,
      usedQuestions
    );
    if (selected) {
      usedQuestions.add(
        selected.text
      );
      selectedQuestions.push(selected);
    }
  });
  if (!selectedQuestions.length) {
    return {
      questions: [],
      averageDifficulty: 0,
      peakDifficulty: 0,
      difficultySpread: setProfile,
      setProfile
    };
  }
  return {
    questions: selectedQuestions,
    ...summarizeDISetDifficulty(
      selectedQuestions,
      setProfile
    )
  };
}

// src/lib/quant/realization.ts
function realizeQuestion(scenario, values2, topic, motif) {
  const normalized = topic.toLowerCase();
  if (motif?.id === "reverse_percentage_inference") {
    return `After a ${values2.p ?? 20}% increase, the ${scenario.metric} of a ${scenario.entity} became ${values2.b}. Find the original value.`;
  }
  if (motif?.id === "successive_percentage_change") {
    return `The ${scenario.metric} of a ${scenario.entity} first increased by ${values2.p ?? 20}% and then decreased by ${values2.q ?? 10}%.
 Find the net percentage change.`;
  }
  if (motif?.id === "contribution_based_growth") {
    return `The ${scenario.metric} of three ${scenario.entity}s contributes ${values2.a}, ${values2.b}, and ${values2.c}. Find the required percentage contribution or growth comparison.`;
  }
  if (motif?.id === "ratio_redistribution") {
    return `The ratio for ${scenario.entity} is ${values2.a}:${values2.b}. After redistribution, find the required ratio-based value.`;
  }
  if (motif?.id === "common_base_comparison") {
    return `Two ${scenario.entity} groups are given in the ratio ${values2.a}:${values2.b}. Compare them after converting to a common base.`;
  }
  if (motif?.id === "conditional_ratio_filtering") {
    return `The ratio among ${scenario.entity} changes under a condition. Apply the condition carefully and find the required value.`;
  }
  if (normalized.includes(
    "percentage"
  )) {
    return `The ${scenario.metric} of a ${scenario.entity} changed from ${values2.a} to ${values2.b}.
    

Find the percentage change.`;
  }
  if (normalized.includes(
    "ratio"
  )) {
    return `The ratio between ${scenario.entity} is ${values2.a}:${values2.b}.

Find the simplified ratio.`;
  }
  return `Find the required value using ${values2.a} and ${values2.b}.`;
}
function buildMotifAwareExplanation(pattern, values2, correctAnswer, motif, reasoningSteps) {
  const motifLead = motif?.inferenceStyle === "hidden" ? "Work backward from the hidden quantity." : motif?.inferenceStyle === "conditional" ? "Apply the condition first, then compute the required value." : "Substitute the known values into the required relation.";
  if (pattern.explanationTemplate) {
    const renderedTemplate = renderExplanation(
      pattern.explanationTemplate,
      values2,
      correctAnswer
    );
    return `${motifLead} ${renderedTemplate}`;
  }
  const operationLead = reasoningSteps.length > 0 ? `Steps: ${reasoningSteps.map((step) => step.detail).join(" ")}` : "Use the given relation directly.";
  return `${motifLead} ${operationLead} Final answer = ${normalizeNumericValue(correctAnswer)}.`;
}

// src/lib/archetypes/quant-archetypes.ts
var FORMULA_QUANT_ARCHETYPES = [
  {
    id: "easy-direct-substitution",
    difficulty: "Easy",
    category: "direct-substitution",
    topicClusters: [
      "percentage",
      "ratio-proportion",
      "profit-loss",
      "averages",
      "si-ci",
      "general-quant"
    ],
    operationChain: [
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Find the required value: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Substitute the given values directly into the required relation."
      )
    ]
  },
  {
    id: "easy-one-step-arithmetic",
    difficulty: "Medium",
    category: "one-step-arithmetic",
    topicClusters: [
      "profit-loss",
      "averages",
      "general-quant"
    ],
    operationChain: [
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Compute the answer directly from the given data: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Form the needed arithmetic expression."
      ),
      createReasoningStep(
        "compare",
        "Evaluate the final one-step result."
      )
    ]
  },
  {
    id: "easy-simple-percentage",
    difficulty: "Easy",
    category: "simple-percentage",
    topicClusters: [
      "percentage",
      "profit-loss"
    ],
    operationChain: [
      "percentage"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "percentage",
        "Convert the given information into a direct percentage calculation."
      )
    ]
  },
  {
    id: "easy-simple-ratio",
    difficulty: "Easy",
    category: "simple-ratio",
    topicClusters: [
      "ratio-proportion"
    ],
    operationChain: [
      "ratio"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "ratio",
        "Apply the direct ratio or proportion relation."
      )
    ]
  },
  {
    id: "medium-successive-percentage",
    difficulty: "Medium",
    category: "successive-percentage",
    topicClusters: [
      "percentage",
      "profit-loss",
      "si-ci"
    ],
    operationChain: [
      "percentage",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      " {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "percentage",
        "Convert each percentage condition into its numeric effect."
      ),
      createReasoningStep(
        "transform",
        "Carry the transformed value forward to the next step."
      ),
      createReasoningStep(
        "compare",
        "Evaluate the resulting quantity."
      )
    ]
  },
  {
    id: "medium-average-transformation",
    difficulty: "Medium",
    category: "average-transformation",
    topicClusters: [
      "averages"
    ],
    operationChain: [
      "aggregate",
      "average",
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "aggregate",
        "Express the total from the average information."
      ),
      createReasoningStep(
        "average",
        "Adjust the average relation using the given change."
      ),
      createReasoningStep(
        "transform",
        "Solve the updated equation."
      )
    ]
  },
  {
    id: "medium-comparison-chain",
    difficulty: "Medium",
    category: "comparison-chain",
    topicClusters: [
      "ratio-proportion",
      "profit-loss",
      "general-quant"
    ],
    operationChain: [
      "compare",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Identify the primary comparison stated in the question."
      ),
      createReasoningStep(
        "transform",
        "Translate that comparison into a solvable equation."
      ),
      createReasoningStep(
        "compare",
        "Evaluate the final required relation."
      )
    ]
  },
  {
    id: "medium-ratio-conversion",
    difficulty: "Medium",
    category: "ratio-conversion",
    topicClusters: [
      "ratio-proportion",
      "percentage"
    ],
    operationChain: [
      "ratio",
      "transform",
      "percentage"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "ratio",
        "Normalize the ratio into comparable units."
      ),
      createReasoningStep(
        "transform",
        "Translate the normalized ratio into actual values."
      ),
      createReasoningStep(
        "percentage",
        "Convert the transformed value into the asked form."
      )
    ]
  },
  {
    id: "medium-multi-step-arithmetic",
    difficulty: "Medium",
    category: "multi-step-arithmetic",
    topicClusters: [
      "profit-loss",
      "averages",
      "si-ci",
      "general-quant"
    ],
    operationChain: [
      "transform",
      "aggregate",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      ": {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Rewrite the givens into usable intermediate quantities."
      ),
      createReasoningStep(
        "aggregate",
        "Combine the intermediate values."
      ),
      createReasoningStep(
        "compare",
        "Extract the asked result from the combined quantity."
      )
    ]
  },
  {
    id: "hard-reverse-percentage",
    difficulty: "Hard",
    category: "reverse-percentage",
    topicClusters: [
      "percentage",
      "profit-loss",
      "si-ci"
    ],
    operationChain: [
      "reverse",
      "percentage",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      ": {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "reverse",
        "Start from the final percentage condition and reverse the change."
      ),
      createReasoningStep(
        "percentage",
        "Translate the reversed state into a percentage equation."
      ),
      createReasoningStep(
        "infer",
        "Infer the original hidden value."
      )
    ]
  },
  {
    id: "hard-hidden-base-inference",
    difficulty: "Hard",
    category: "hidden-base-inference",
    topicClusters: [
      "percentage",
      "profit-loss",
      "averages",
      "si-ci"
    ],
    operationChain: [
      "infer",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "infer",
        "Identify the concealed base or principal quantity."
      ),
      createReasoningStep(
        "transform",
        "Express the hidden base using the given relationships."
      ),
      createReasoningStep(
        "compare",
        "Resolve the asked comparison or value."
      )
    ]
  },
  {
    id: "hard-conditional-ratio-logic",
    difficulty: "Hard",
    category: "conditional-ratio-logic",
    topicClusters: [
      "ratio-proportion",
      "profit-loss"
    ],
    operationChain: [
      "ratio",
      "conditional-selection",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      ": {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "ratio",
        "Normalize the base ratio condition."
      ),
      createReasoningStep(
        "conditional-selection",
        "Apply the condition that changes or filters the ratio relation."
      ),
      createReasoningStep(
        "infer",
        "Infer the final hidden quantity from the conditioned ratio."
      )
    ]
  },
  {
    id: "hard-chained-percentage-ratio",
    difficulty: "Hard",
    category: "chained-percentage-ratio",
    topicClusters: [
      "percentage",
      "ratio-proportion",
      "profit-loss"
    ],
    operationChain: [
      "ratio",
      "percentage",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      ": {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "ratio",
        "Express the quantities in ratio form."
      ),
      createReasoningStep(
        "percentage",
        "Convert the ratio relation into percentage movement."
      ),
      createReasoningStep(
        "transform",
        "Carry the transformed result into the next relation."
      ),
      createReasoningStep(
        "compare",
        "Evaluate the final target value or comparison."
      )
    ]
  },
  {
    id: "hard-comparative-conditional-inference",
    difficulty: "Hard",
    category: "comparative-conditional-inference",
    topicClusters: [
      "averages",
      "profit-loss",
      "si-ci",
      "general-quant"
    ],
    operationChain: [
      "compare",
      "filter",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      ": {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Identify the initial comparison relation."
      ),
      createReasoningStep(
        "filter",
        "Apply the condition that narrows the valid case."
      ),
      createReasoningStep(
        "infer",
        "Infer the intermediate hidden quantity."
      ),
      createReasoningStep(
        "compare",
        "Use that inferred result in the final comparison."
      )
    ]
  },
  {
    id: "hard-nested-operations",
    difficulty: "Hard",
    category: "nested-operations",
    topicClusters: [
      "percentage",
      "ratio-proportion",
      "profit-loss",
      "averages",
      "si-ci",
      "general-quant"
    ],
    operationChain: [
      "transform",
      "aggregate",
      "reverse",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      ": {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Transform the given quantities into intermediate values."
      ),
      createReasoningStep(
        "aggregate",
        "Combine the intermediate states into a usable relation."
      ),
      createReasoningStep(
        "reverse",
        "Reverse the final condition to uncover the missing state."
      ),
      createReasoningStep(
        "infer",
        "Infer the requested answer from the nested chain."
      )
    ]
  }
];
function createFallbackArchetype(difficulty, topicCluster) {
  return {
    id: "fallback-direct-realizer",
    difficulty,
    category: "direct-substitution",
    topicClusters: [
      topicCluster,
      "general-quant"
    ],
    operationChain: ["transform"],
    requiredOperations: ["transform"],
    reasoningDepthRange: [1, 2],
    wordingVariants: ["{baseText}"],
    buildReasoningSteps: () => [
      {
        operation: "transform",
        detail: "Use the validated pattern relation directly."
      }
    ]
  };
}
function getQuantArchetypeCandidates(archetypes, topicCluster, difficulty) {
  return archetypes.filter(
    (archetype) => archetype.difficulty === difficulty && archetype.topicClusters.includes(
      topicCluster
    )
  );
}
function selectQuantArchetype(archetypes, pattern, options, topicCluster, motif, deps) {
  const profileConfig = deps.getExamProfileConfig(
    options?.examProfile
  );
  const requestedDifficulty = getRequestedDifficultyLabel(
    pattern,
    options,
    deps.classifyDifficultyLabel
  );
  const targetDifficultyScore = getTargetDifficultyScore(
    pattern,
    options
  );
  const preferredCandidates = getQuantArchetypeCandidates(
    archetypes,
    topicCluster,
    requestedDifficulty
  ).filter(
    (archetype) => deps.validateArchetypeCompatibility(
      pattern,
      archetype,
      motif,
      topicCluster
    ).valid
  );
  const desiredOperationSpan = requestedDifficulty === "Easy" ? 1 : requestedDifficulty === "Medium" ? targetDifficultyScore >= 5.5 ? 3 : 2 : 4;
  const desiredReasoningDepth = requestedDifficulty === "Easy" ? 1 : requestedDifficulty === "Medium" ? 2.5 : 4;
  if (preferredCandidates.length) {
    return pickWeightedItem(
      preferredCandidates,
      (archetype) => {
        let weight = profileConfig.archetypeWeights[archetype.category] ?? 1;
        if (motif) {
          const preferredOverlap = archetype.operationChain.filter(
            (operation) => motif.preferredOperations.includes(
              operation
            )
          ).length;
          if (preferredOverlap) {
            weight *= 1 + preferredOverlap * 0.3;
          }
          const [minDepth, maxDepth] = motif.reasoningDepthRange;
          const stepCount = archetype.operationChain.length;
          if (stepCount >= minDepth && stepCount <= maxDepth) {
            weight *= 1.25;
          } else {
            weight *= 0.8;
          }
        }
        const operationDistance = Math.abs(
          archetype.operationChain.length - desiredOperationSpan
        );
        weight *= Math.max(
          0.35,
          1.4 - operationDistance * 0.35
        );
        const prototypeDepth = archetype.buildReasoningSteps({
          pattern,
          baseText: "",
          values: {},
          correctAnswer: 0,
          topicCluster
        }).length;
        const depthDistance = Math.abs(
          prototypeDepth - desiredReasoningDepth
        );
        weight *= Math.max(
          0.4,
          1.35 - depthDistance * 0.2
        );
        if (requestedDifficulty === "Easy" && archetype.operationChain.length > 1) {
          weight *= 0.35;
        }
        return weight;
      }
    );
  }
  const fallbackCandidates = getQuantArchetypeCandidates(
    archetypes,
    "general-quant",
    requestedDifficulty
  ).filter(
    (archetype) => deps.validateArchetypeCompatibility(
      pattern,
      archetype,
      motif,
      topicCluster
    ).valid
  );
  if (fallbackCandidates.length) {
    return pickWeightedItem(
      fallbackCandidates,
      (archetype) => profileConfig.archetypeWeights[archetype.category] ?? 1
    );
  }
  return createFallbackArchetype(
    requestedDifficulty,
    topicCluster
  );
}

// src/lib/core/domain-adapters.ts
function getPrimaryQuestion(question) {
  return "questionType" in question && question.questionType === "di" ? question.questions[0] : question;
}
function tokenizeText(value) {
  return value.split(/[^A-Za-z0-9]+/).map((token) => token.trim()).filter(Boolean);
}
function extractArrangementParticipants(arrangement) {
  if (!arrangement) {
    return [];
  }
  return arrangement.split(/[:;|]/).map((part) => part.trim()).filter(
    (part) => part.length > 0 && !/^row\s+\d+$/i.test(part) && !/^\d+$/.test(part)
  ).map(
    (part) => part.replace(/^\d+\s*/, "").trim()
  ).filter(Boolean);
}
function buildValidationReport(question, domain) {
  const primaryQuestion = getPrimaryQuestion(question);
  const warnings = [
    ...primaryQuestion?.debugMetadata?.validationWarnings ?? [],
    ...primaryQuestion?.debugMetadata?.compatibilityWarnings ?? []
  ];
  const uniquenessVerified = primaryQuestion?.debugMetadata?.uniquenessVerified;
  return {
    passed: uniquenessVerified !== false && warnings.length === 0,
    warnings,
    stageResults: [
      {
        stage: `${domain}-scenario`,
        passed: uniquenessVerified !== false && warnings.length === 0,
        diagnostics: warnings,
        metrics: {
          clueCount: primaryQuestion?.debugMetadata?.clueCount ?? 0,
          inferenceDepth: primaryQuestion?.debugMetadata?.inferenceDepth ?? 0
        }
      }
    ],
    metrics: {
      clueCount: primaryQuestion?.debugMetadata?.clueCount ?? 0,
      inferenceDepth: primaryQuestion?.debugMetadata?.inferenceDepth ?? 0,
      uniquenessVerified: uniquenessVerified === true ? 1 : 0
    }
  };
}
function buildStructuralValidityStage() {
  return {
    name: "structural validity",
    execute(context) {
      const diagnostics = [];
      const metrics = {
        entityCount: context.scenario.entities.length,
        constraintCount: context.scenario.constraints.length,
        hasPrompt: context.scenario.content.prompt?.length ? 1 : 0
      };
      if (!context.scenario.entities.length) {
        diagnostics.push(
          "Scenario has no normalized entities."
        );
      }
      if (!context.scenario.content.prompt) {
        diagnostics.push(
          "Scenario has no normalized prompt content."
        );
      }
      return {
        stage: "structural validity",
        passed: diagnostics.length === 0,
        diagnostics,
        metrics
      };
    }
  };
}
function buildSolvabilityStage() {
  return {
    name: "solvability",
    execute(context) {
      const primaryQuestion = getPrimaryQuestion(
        context.realizedQuestion
      );
      const warnings = primaryQuestion?.debugMetadata?.validationWarnings ?? [];
      const failed = warnings.some(
        (warning) => /no valid|unsolved|unsatisfiable|contradicted/i.test(
          warning
        )
      );
      return {
        stage: "solvability",
        passed: !failed,
        diagnostics: failed ? warnings.filter(
          (warning) => /no valid|unsolved|unsatisfiable|contradicted/i.test(
            warning
          )
        ) : [],
        metrics: {
          warningCount: warnings.length
        }
      };
    }
  };
}
function buildUniquenessStage() {
  return {
    name: "uniqueness",
    execute(context) {
      const primaryQuestion = getPrimaryQuestion(
        context.realizedQuestion
      );
      const uniquenessVerified = primaryQuestion?.debugMetadata?.uniquenessVerified;
      const passed = uniquenessVerified !== false;
      return {
        stage: "uniqueness",
        passed,
        diagnostics: passed ? [] : [
          "Scenario did not verify unique solution."
        ],
        metrics: {
          uniquenessVerified: uniquenessVerified === true ? 1 : 0
        }
      };
    }
  };
}
function buildDifficultyCalibrationStage() {
  return {
    name: "difficulty calibration",
    execute(context) {
      const diagnostics = [];
      const reasoningDepth = context.difficultyMetrics.inferenceDepth ?? 0;
      const difficultyScore = context.difficultyMetrics.difficultyScore ?? 0;
      if (difficultyScore <= 0) {
        diagnostics.push(
          "Difficulty score was not calibrated."
        );
      }
      if (reasoningDepth <= 0) {
        diagnostics.push(
          "Reasoning depth is missing from difficulty metrics."
        );
      }
      return {
        stage: "difficulty calibration",
        passed: diagnostics.length === 0,
        diagnostics,
        metrics: {
          difficultyScore,
          reasoningDepth
        }
      };
    }
  };
}
function buildRedundancyAnalysisStage() {
  return {
    name: "redundancy analysis",
    execute(context) {
      const primaryQuestion = getPrimaryQuestion(
        context.realizedQuestion
      );
      const redundancyScore = primaryQuestion?.debugMetadata?.redundancyScore ?? 0;
      const redundancyRatio = primaryQuestion?.debugMetadata?.redundancyRatio ?? 0;
      const diagnostics = [];
      if (redundancyRatio > 0.45) {
        diagnostics.push(
          "Scenario appears overconstrained by redundancy ratio."
        );
      }
      if (redundancyScore >= 8) {
        diagnostics.push(
          "Redundancy score is unusually high."
        );
      }
      return {
        stage: "redundancy analysis",
        passed: diagnostics.length === 0,
        diagnostics,
        metrics: {
          redundancyScore,
          redundancyRatio
        }
      };
    }
  };
}
function buildCoreValidationStages() {
  return [
    buildStructuralValidityStage(),
    buildSolvabilityStage(),
    buildUniquenessStage(),
    buildDifficultyCalibrationStage(),
    buildRedundancyAnalysisStage()
  ];
}
function buildDifficultyMetrics(question, domain, contributions) {
  const primaryQuestion = getPrimaryQuestion(question);
  const reasoningDepth = primaryQuestion?.difficultyMetadata?.reasoningDepth ?? primaryQuestion?.debugMetadata?.inferenceDepth ?? 0;
  const dependencyComplexity = primaryQuestion?.difficultyMetadata?.dependencyComplexity ?? primaryQuestion?.debugMetadata?.deductionDependencyScore ?? 0;
  const solvingTimeEstimate = primaryQuestion?.difficultyMetadata?.estimatedSolveTime ?? 0;
  const distractorComplexity = (primaryQuestion?.optionMetadata ?? []).filter(
    (option) => !option.isCorrect && option.distractorType
  ).length;
  const ambiguityScoreBase = (primaryQuestion?.debugMetadata?.validationWarnings ?? []).length * 0.8 + (primaryQuestion?.debugMetadata?.compatibilityWarnings ?? []).length * 0.6;
  const calculationComplexityBase = domain === "quant" || domain === "di" ? primaryQuestion?.difficultyMetadata?.operationCount ?? 0 : 0;
  const baseMetrics = {
    reasoningDepth,
    dependencyComplexity,
    estimatedSolveTime: solvingTimeEstimate,
    distractorCount: distractorComplexity,
    calculationComplexity: calculationComplexityBase
  };
  const cognitiveLoadBase = reasoningDepth * 0.35 + dependencyComplexity * 0.25 + calculationComplexityBase * 0.2 + distractorComplexity * 0.1 + ambiguityScoreBase * 0.1;
  return {
    difficultyLabel: "difficultyLabel" in question && question.difficultyLabel ? question.difficultyLabel : primaryQuestion?.difficultyLabel,
    difficultyScore: "difficultyScore" in question && typeof question.difficultyScore === "number" ? question.difficultyScore : primaryQuestion?.difficultyScore,
    cognitiveLoad: contributions?.cognitiveLoad ?? Number(
      cognitiveLoadBase.toFixed(2)
    ),
    inferenceDepth: contributions?.inferenceDepth ?? reasoningDepth,
    calculationComplexity: contributions?.calculationComplexity ?? calculationComplexityBase,
    distractorComplexity: contributions?.distractorComplexity ?? distractorComplexity,
    ambiguityScore: contributions?.ambiguityScore ?? Number(
      ambiguityScoreBase.toFixed(2)
    ),
    solvingTimeEstimate: contributions?.solvingTimeEstimate ?? solvingTimeEstimate,
    domainContributions: contributions?.domainContributions,
    metrics: {
      ...baseMetrics,
      cognitiveLoadBase: Number(
        cognitiveLoadBase.toFixed(2)
      ),
      ambiguityScoreBase: Number(
        ambiguityScoreBase.toFixed(2)
      )
    }
  };
}
function buildExplanationResult(question) {
  const primaryQuestion = getPrimaryQuestion(question);
  return {
    text: primaryQuestion?.explanation ?? "",
    reasoningSteps: primaryQuestion?.difficultyMetadata?.reasoningSteps ?? [],
    metadata: {
      hasSeatingExplanation: Boolean(
        primaryQuestion?.seatingExplanationFlow
      ) || Boolean(
        primaryQuestion?.debugMetadata?.seatingExplanationFlow
      )
    }
  };
}
function buildReasoningDifficultyContribution(question) {
  const debugMetadata = question.debugMetadata;
  const inferenceDepth = debugMetadata?.inferenceDepth ?? question.difficultyMetadata?.reasoningDepth ?? 0;
  const eliminationDepth = debugMetadata?.eliminationDepth ?? 0;
  const branchingComplexity = debugMetadata?.branchingComplexity ?? 0;
  const deductionDependencyScore = debugMetadata?.deductionDependencyScore ?? 0;
  const ambiguityScore = Math.max(
    0,
    (debugMetadata?.validationWarnings?.length ?? 0) * 0.75
  );
  return {
    cognitiveLoad: Number(
      (inferenceDepth * 0.45 + eliminationDepth * 0.18 + branchingComplexity * 2 + deductionDependencyScore * 0.2).toFixed(2)
    ),
    inferenceDepth,
    calculationComplexity: 0,
    distractorComplexity: (question.optionMetadata ?? []).filter(
      (option) => !option.isCorrect && option.reasoningTrap
    ).length,
    ambiguityScore: Number(
      ambiguityScore.toFixed(2)
    ),
    solvingTimeEstimate: question.difficultyMetadata?.estimatedSolveTime ?? 0,
    domainContributions: {
      eliminationDepth,
      branchingComplexity,
      deductionDependencyScore
    }
  };
}
function buildQuantDifficultyContribution(question) {
  const difficultyMetadata = question.difficultyMetadata;
  const optionMetadata = question.optionMetadata ?? [];
  const distractorComplexity = optionMetadata.filter(
    (option) => !option.isCorrect && option.distractorType
  ).length;
  const calculationComplexity = difficultyMetadata?.operationCount ?? 0;
  const ambiguityScore = optionMetadata.filter(
    (option) => !option.isCorrect && option.reasoningTrap
  ).length * 0.35;
  return {
    cognitiveLoad: Number(
      (calculationComplexity * 0.42 + (difficultyMetadata?.reasoningDepth ?? 0) * 0.24 + distractorComplexity * 0.16 + ambiguityScore * 0.18).toFixed(2)
    ),
    inferenceDepth: difficultyMetadata?.reasoningDepth ?? 0,
    calculationComplexity,
    distractorComplexity,
    ambiguityScore: Number(
      ambiguityScore.toFixed(2)
    ),
    solvingTimeEstimate: difficultyMetadata?.estimatedSolveTime ?? 0,
    domainContributions: {
      operationCount: calculationComplexity,
      visualComplexity: difficultyMetadata?.visualComplexity ?? 0,
      inferenceComplexity: difficultyMetadata?.inferenceComplexity ?? 0
    }
  };
}
function buildEnglishDifficultyContribution(question) {
  const tokens = tokenizeText(
    question.text ?? ""
  );
  const optionMetadata = question.optionMetadata ?? [];
  const trapDensity = optionMetadata.filter(
    (option) => !option.isCorrect && option.reasoningTrap
  ).length;
  const ambiguityScore = Number(
    (Math.max(tokens.length - 18, 0) * 0.08 + trapDensity * 0.7).toFixed(2)
  );
  return {
    cognitiveLoad: Number(
      (ambiguityScore * 0.42 + trapDensity * 0.28 + (question.difficultyMetadata?.reasoningDepth ?? 0) * 0.16 + tokens.length * 0.05).toFixed(2)
    ),
    inferenceDepth: question.difficultyMetadata?.reasoningDepth ?? 0,
    calculationComplexity: 0,
    distractorComplexity: trapDensity,
    ambiguityScore,
    solvingTimeEstimate: question.difficultyMetadata?.estimatedSolveTime ?? Math.max(
      20,
      tokens.length * 2
    ),
    domainContributions: {
      tokenCount: tokens.length,
      trapDensity
    }
  };
}
function buildDIDifficultyContribution(diSet) {
  const rows = diSet.diData.length;
  const columns = Object.keys(
    diSet.diData[0] ?? {}
  ).length;
  const interpretationComplexity = rows * 0.4 + columns * 0.6;
  const averageQuestion = diSet.questions[0];
  const distractorComplexity = diSet.questions.reduce(
    (total, question) => total + (question.optionMetadata ?? []).filter(
      (option) => !option.isCorrect && option.distractorType
    ).length,
    0
  ) / Math.max(diSet.questions.length, 1);
  return {
    cognitiveLoad: Number(
      (interpretationComplexity * 0.4 + (averageQuestion?.difficultyMetadata?.reasoningDepth ?? 0) * 0.25 + distractorComplexity * 0.2 + (averageQuestion?.difficultyMetadata?.visualComplexity ?? 0) * 0.15).toFixed(2)
    ),
    inferenceDepth: averageQuestion?.difficultyMetadata?.reasoningDepth ?? 0,
    calculationComplexity: Number(
      interpretationComplexity.toFixed(
        2
      )
    ),
    distractorComplexity: Number(
      distractorComplexity.toFixed(2)
    ),
    ambiguityScore: Number(
      ((averageQuestion?.difficultyMetadata?.visualComplexity ?? 0) * 0.4).toFixed(2)
    ),
    solvingTimeEstimate: diSet.questions.reduce(
      (total, question) => total + (question.difficultyMetadata?.estimatedSolveTime ?? 0),
      0
    ) / Math.max(
      diSet.questions.length,
      1
    ),
    domainContributions: {
      rowCount: rows,
      columnCount: columns,
      interpretationComplexity: Number(
        interpretationComplexity.toFixed(
          2
        )
      )
    }
  };
}
function buildScenarioEntities(domain, pattern, question) {
  const primaryQuestion = getPrimaryQuestion(question);
  if (domain === "di") {
    const diSet = question;
    const rows = diSet.diData ?? [];
    const firstRow = rows[0] ?? {};
    const columns = Object.keys(firstRow);
    return [
      ...columns.map((column, index2) => ({
        id: `column-${index2}`,
        type: "di-column",
        label: column
      })),
      ...rows.map((row, index2) => ({
        id: `row-${index2}`,
        type: "di-row",
        label: `Row ${index2 + 1}`,
        value: row
      }))
    ];
  }
  if (domain === "quant") {
    return Object.entries(
      pattern.variables ?? {}
    ).map(
      ([name, value], index2) => ({
        id: `var-${index2}`,
        type: "variable",
        label: name,
        value
      })
    );
  }
  if (domain === "seating-arrangement" || primaryQuestion?.debugMetadata?.arrangementType) {
    return extractArrangementParticipants(
      primaryQuestion?.debugMetadata?.finalArrangement
    ).map(
      (label, index2) => ({
        id: `participant-${index2}`,
        type: "participant",
        label
      })
    );
  }
  if (domain === "english") {
    return tokenizeText(
      primaryQuestion?.text ?? ""
    ).slice(0, 20).map((token, index2) => ({
      id: `token-${index2}`,
      type: "grammar-token",
      label: token
    }));
  }
  return tokenizeText(
    primaryQuestion?.text ?? ""
  ).slice(0, 20).map((token, index2) => ({
    id: `entity-${index2}`,
    type: "reasoning-token",
    label: token
  }));
}
function buildScenarioConstraints(domain, pattern, question) {
  const primaryQuestion = getPrimaryQuestion(question);
  if (domain === "di") {
    const diSet = question;
    return [
      {
        id: "di-visual",
        type: "visual-structure",
        expression: diSet.visualType,
        metadata: {
          title: diSet.title,
          series: diSet.series
        }
      }
    ];
  }
  if (domain === "quant") {
    return [
      {
        id: "quant-formula",
        type: "formula",
        operator: "EQUALS",
        expression: pattern.formula ?? "",
        metadata: {
          variables: Object.keys(
            pattern.variables ?? {}
          )
        }
      }
    ];
  }
  if (domain === "seating-arrangement" || primaryQuestion?.debugMetadata?.arrangementType) {
    return (primaryQuestion?.debugMetadata?.generatedClues ?? []).map((clue, index2) => ({
      id: `constraint-${index2}`,
      type: "seating-relation",
      expression: clue
    }));
  }
  if (domain === "english") {
    return [
      {
        id: "syntax-rules",
        type: "syntax-rule",
        expression: pattern.explanationTemplate ?? pattern.templateVariants?.[0] ?? "grammar transformation"
      }
    ];
  }
  return (primaryQuestion?.difficultyMetadata?.reasoningSteps ?? []).map((step, index2) => ({
    id: `constraint-${index2}`,
    type: "reasoning-relation",
    expression: step
  }));
}
function inferScenarioSubtype(domain, pattern, question) {
  const primaryQuestion = getPrimaryQuestion(question);
  if (domain === "di") {
    return question.visualType ?? "table";
  }
  return primaryQuestion?.debugMetadata?.arrangementType ?? pattern.subtopic ?? pattern.topic ?? domain;
}
function buildUniversalScenario(domain, pattern, question, validationReport, difficultyMetrics, explanationResult) {
  const primaryQuestion = getPrimaryQuestion(question);
  const generationId = primaryQuestion?.debugMetadata?.generationId;
  return {
    id: generationId ? `${domain}:${generationId}:${pattern.id}` : `${domain}:${pattern.id}:${Math.abs(
      (primaryQuestion?.text ?? "").split("").reduce(
        (sum, char2) => sum + char2.charCodeAt(0),
        0
      )
    )}`,
    domain,
    subtype: inferScenarioSubtype(
      domain,
      pattern,
      question
    ),
    metadata: {
      patternId: pattern.id,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      generationDomain: primaryQuestion?.debugMetadata?.generationDomain,
      arrangementType: primaryQuestion?.debugMetadata?.arrangementType,
      orientationType: primaryQuestion?.debugMetadata?.orientationType,
      seed: primaryQuestion?.debugMetadata?.seed
    },
    entities: buildScenarioEntities(
      domain,
      pattern,
      question
    ),
    constraints: buildScenarioConstraints(
      domain,
      pattern,
      question
    ),
    content: {
      stem: primaryQuestion?.text,
      prompt: primaryQuestion?.text,
      options: "options" in primaryQuestion ? primaryQuestion.options : void 0,
      explanation: explanationResult.text,
      artifacts: {
        seatingDiagram: primaryQuestion?.seatingDiagram ?? primaryQuestion?.debugMetadata?.seatingDiagram,
        seatingExplanationFlow: primaryQuestion?.seatingExplanationFlow ?? primaryQuestion?.debugMetadata?.seatingExplanationFlow
      }
    },
    difficulty: {
      label: difficultyMetrics.difficultyLabel,
      score: difficultyMetrics.difficultyScore,
      inferenceDepth: difficultyMetrics.inferenceDepth,
      metrics: difficultyMetrics.metrics
    },
    validation: {
      passed: validationReport.passed,
      warnings: validationReport.warnings,
      metrics: validationReport.metrics
    }
  };
}
function runValidationStages(context, stages) {
  const stageResults = stages.map(
    (stage) => stage.execute(context)
  );
  const legacyReport = buildValidationReport(
    context.realizedQuestion,
    context.domain
  );
  const warnings = [
    .../* @__PURE__ */ new Set([
      ...legacyReport.warnings,
      ...stageResults.flatMap(
        (result) => result.passed ? [] : result.diagnostics
      )
    ])
  ];
  const metrics = stageResults.reduce(
    (accumulator, result) => ({
      ...accumulator,
      ...result.metrics
    }),
    {
      ...legacyReport.metrics
    }
  );
  return {
    passed: legacyReport.passed && stageResults.every(
      (result) => result.passed
    ),
    stageResults,
    warnings,
    metrics
  };
}
function createScenario(domain, pattern, realizedQuestion, customValidationStages = [], difficultyContribution) {
  const difficultyMetrics = buildDifficultyMetrics(
    realizedQuestion,
    domain,
    difficultyContribution
  );
  const explanationResult = buildExplanationResult(
    realizedQuestion
  );
  const provisionalValidationReport = buildValidationReport(
    realizedQuestion,
    domain
  );
  const scenario = buildUniversalScenario(
    domain,
    pattern,
    realizedQuestion,
    provisionalValidationReport,
    difficultyMetrics,
    explanationResult
  );
  const validationReport = runValidationStages(
    {
      domain,
      pattern,
      realizedQuestion,
      scenario,
      difficultyMetrics,
      explanationResult
    },
    [
      ...buildCoreValidationStages(),
      ...customValidationStages
    ]
  );
  return {
    domain,
    pattern,
    scenario: {
      ...scenario,
      validation: {
        passed: validationReport.passed,
        warnings: validationReport.warnings,
        metrics: validationReport.metrics
      }
    },
    realizedQuestion,
    validationReport,
    difficultyMetrics,
    explanationResult
  };
}
function buildQuestionAdapter(domain, createQuestion, config) {
  return {
    domain,
    generationMode: "per-item",
    maxAttemptsMultiplier: config?.maxAttemptsMultiplier,
    minAttempts: config?.minAttempts,
    generateScenario(context) {
      const question = createQuestion(
        context.pattern,
        context.options
      );
      return this.hydrateScenario(
        context.pattern,
        question
      );
    },
    hydrateScenario(pattern, realizedQuestion) {
      return createScenario(
        domain,
        pattern,
        realizedQuestion,
        config?.customValidationStages,
        config?.difficultyContribution?.(
          realizedQuestion
        )
      );
    },
    validateScenario(scenario) {
      return scenario.validationReport;
    },
    realizeScenario(scenario) {
      return scenario.realizedQuestion;
    },
    analyzeDifficulty(scenario) {
      return scenario.difficultyMetrics;
    },
    generateExplanation(scenario) {
      return scenario.explanationResult;
    }
  };
}
function buildReasoningTopologyStage() {
  return {
    name: "topology validation",
    execute(context) {
      const primaryQuestion = getPrimaryQuestion(
        context.realizedQuestion
      );
      const arrangementType = primaryQuestion?.debugMetadata?.arrangementType;
      const finalArrangement = primaryQuestion?.debugMetadata?.finalArrangement;
      const passed = Boolean(arrangementType) && Boolean(finalArrangement);
      return {
        stage: "topology validation",
        passed,
        diagnostics: passed ? [] : [
          "Reasoning topology metadata is incomplete."
        ],
        metrics: {
          hasArrangementType: arrangementType ? 1 : 0,
          hasFinalArrangement: finalArrangement ? 1 : 0
        }
      };
    }
  };
}
function buildQuantEquationStage() {
  return {
    name: "equation solvability",
    execute(context) {
      const hasFormula = typeof context.pattern.formula === "string" && context.pattern.formula.trim().length > 0;
      return {
        stage: "equation solvability",
        passed: hasFormula,
        diagnostics: hasFormula ? [] : [
          "Quant scenario is missing a normalized formula/equation constraint."
        ],
        metrics: {
          hasFormula: hasFormula ? 1 : 0
        }
      };
    }
  };
}
function buildEnglishGrammarStage() {
  return {
    name: "grammar consistency validation",
    execute(context) {
      const tokenCount = context.scenario.entities.filter(
        (entity) => entity.type === "grammar-token"
      ).length;
      const hasRuleConstraint = context.scenario.constraints.some(
        (constraint) => constraint.type === "syntax-rule"
      );
      const passed = tokenCount > 0 && hasRuleConstraint;
      return {
        stage: "grammar consistency validation",
        passed,
        diagnostics: passed ? [] : [
          "English scenario is missing grammar tokens or syntax-rule constraints."
        ],
        metrics: {
          tokenCount,
          hasRuleConstraint: hasRuleConstraint ? 1 : 0
        }
      };
    }
  };
}
function createDomainAdapters(deps) {
  return {
    quant: buildQuestionAdapter(
      "quant",
      deps.createFormulaQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        customValidationStages: [
          buildQuantEquationStage()
        ],
        difficultyContribution: buildQuantDifficultyContribution
      }
    ),
    reasoning: buildQuestionAdapter(
      "reasoning",
      deps.createReasoningQuestionCandidate,
      {
        maxAttemptsMultiplier: 10,
        minAttempts: 16,
        customValidationStages: [
          buildReasoningTopologyStage()
        ],
        difficultyContribution: buildReasoningDifficultyContribution
      }
    ),
    "seating-arrangement": buildQuestionAdapter(
      "seating-arrangement",
      deps.createSeatingQuestionCandidate,
      {
        maxAttemptsMultiplier: 10,
        minAttempts: 16,
        customValidationStages: [
          buildReasoningTopologyStage()
        ],
        difficultyContribution: buildReasoningDifficultyContribution
      }
    ),
    english: buildQuestionAdapter(
      "english",
      deps.createReasoningQuestionCandidate,
      {
        maxAttemptsMultiplier: 10,
        minAttempts: 16,
        customValidationStages: [
          buildEnglishGrammarStage()
        ],
        difficultyContribution: buildEnglishDifficultyContribution
      }
    ),
    di: {
      domain: "di",
      generationMode: "single",
      generateScenario(context) {
        const diSet = deps.createDIQuestionSet(
          context.pattern,
          context.options
        );
        return this.hydrateScenario(
          context.pattern,
          diSet
        );
      },
      hydrateScenario(pattern, realizedQuestion) {
        return createScenario(
          "di",
          pattern,
          realizedQuestion,
          [],
          buildDIDifficultyContribution(
            realizedQuestion
          )
        );
      },
      validateScenario(scenario) {
        return scenario.validationReport;
      },
      realizeScenario(scenario) {
        return scenario.realizedQuestion;
      },
      analyzeDifficulty(scenario) {
        return scenario.difficultyMetrics;
      },
      generateExplanation(scenario) {
        return scenario.explanationResult;
      }
    }
  };
}
function resolveDomainAdapter(registry, domain) {
  return registry[domain] ?? registry.quant;
}

// src/lib/core/reasoning-realism.ts
var REALISM_HEURISTICS = {
  custom: {
    anchorDensityRange: [0.16, 0.34],
    directClueRatioRange: [0.18, 0.36],
    clueDensityRange: [0.45, 0.95],
    interactionRange: [0.48, 0.82],
    branchingComplexityRange: [0.12, 0.5],
    inferenceDepthRange: [3.5, 6.8],
    deductionDependencyRange: [1.2, 4.8]
  },
  ssc: {
    anchorDensityRange: [0.2, 0.36],
    directClueRatioRange: [0.22, 0.4],
    clueDensityRange: [0.52, 0.92],
    interactionRange: [0.45, 0.74],
    branchingComplexityRange: [0.08, 0.3],
    inferenceDepthRange: [3, 5.4],
    deductionDependencyRange: [1, 3.6]
  },
  ibps: {
    anchorDensityRange: [0.16, 0.3],
    directClueRatioRange: [0.15, 0.3],
    clueDensityRange: [0.45, 0.82],
    interactionRange: [0.54, 0.86],
    branchingComplexityRange: [0.18, 0.6],
    inferenceDepthRange: [4.2, 6.8],
    deductionDependencyRange: [2.2, 5.4]
  },
  cat: {
    anchorDensityRange: [0.08, 0.24],
    directClueRatioRange: [0.06, 0.22],
    clueDensityRange: [0.36, 0.72],
    interactionRange: [0.62, 0.94],
    branchingComplexityRange: [0.24, 0.72],
    inferenceDepthRange: [5.6, 8.5],
    deductionDependencyRange: [3.4, 7.2]
  },
  sbi: {
    anchorDensityRange: [0.14, 0.28],
    directClueRatioRange: [0.12, 0.28],
    clueDensityRange: [0.44, 0.8],
    interactionRange: [0.55, 0.88],
    branchingComplexityRange: [0.2, 0.62],
    inferenceDepthRange: [4.6, 7.2],
    deductionDependencyRange: [2.6, 5.8]
  },
  rrb: {
    anchorDensityRange: [0.22, 0.4],
    directClueRatioRange: [0.24, 0.42],
    clueDensityRange: [0.55, 1],
    interactionRange: [0.42, 0.7],
    branchingComplexityRange: [0.05, 0.24],
    inferenceDepthRange: [2.8, 4.8],
    deductionDependencyRange: [0.8, 3]
  }
};
function clamp(value, min, max) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}
function roundScore(value) {
  return Number(
    clamp(value, 0, 10).toFixed(2)
  );
}
function scoreAgainstRange(value, range) {
  const [min, max] = range;
  if (value >= min && value <= max) {
    return 10;
  }
  const distance = value < min ? min - value : value - max;
  const tolerance = Math.max((max - min) * 0.75, 0.08);
  return roundScore(
    10 - distance / tolerance * 10
  );
}
function estimateTemplateRepetitionRatio(generatedClues) {
  if (!generatedClues.length) {
    return 0;
  }
  const normalized = generatedClues.map(
    (clue) => clue.toLowerCase().replace(/\b[a-z][a-z]+\b/g, "x").replace(/\d+/g, "#").replace(/\s+/g, " ").trim()
  );
  const frequencies = normalized.reduce(
    (accumulator, template) => {
      accumulator[template] = (accumulator[template] ?? 0) + 1;
      return accumulator;
    },
    {}
  );
  const repeatedCount = Object.values(
    frequencies
  ).reduce(
    (total, count) => total + Math.max(0, count - 1),
    0
  );
  return repeatedCount / Math.max(generatedClues.length, 1);
}
function getDistinctClueFamilyRatio(clueTypeDistribution) {
  const familyCount = Object.keys(
    clueTypeDistribution
  ).length;
  const total = Object.values(
    clueTypeDistribution
  ).reduce(
    (sum, count) => sum + count,
    0
  );
  return total > 0 ? familyCount / Math.min(total, 6) : 0;
}
function getRealismBand(score) {
  if (score >= 8.5) {
    return "pyq-like";
  }
  if (score >= 6.75) {
    return "strong";
  }
  if (score >= 4.5) {
    return "moderate";
  }
  return "low";
}
function buildSeatingRealismAnalysis(scenario, examProfile = "custom") {
  const heuristics = REALISM_HEURISTICS[examProfile] ?? REALISM_HEURISTICS.custom;
  const penalties = [];
  const matchedHeuristics = [];
  const diagnosticSummary = [];
  const templateRepetitionRatio = estimateTemplateRepetitionRatio(
    scenario.generatedClues
  );
  const clueFamilyRatio = getDistinctClueFamilyRatio(
    scenario.clueTypeDistribution
  );
  const clueNaturalnessBase = scoreAgainstRange(
    scenario.directClueRatio,
    heuristics.directClueRatioRange
  ) * 0.35 + scoreAgainstRange(
    scenario.clueInteractionRatio,
    heuristics.interactionRange
  ) * 0.25 + roundScore(clueFamilyRatio * 10) * 0.2 + scoreAgainstRange(
    1 - templateRepetitionRatio,
    [0.7, 1]
  ) * 0.2;
  let clueNaturalness = roundScore(clueNaturalnessBase);
  if (scenario.redundancyRatio > 0.32) {
    clueNaturalness = roundScore(
      clueNaturalness - 1.2
    );
    penalties.push(
      "Overexplained clue set reduces naturalness."
    );
  }
  if (scenario.directClueRatio > heuristics.directClueRatioRange[1]) {
    penalties.push(
      "Excessive direct placements make the puzzle feel machine-generated."
    );
  } else {
    matchedHeuristics.push(
      "Direct clue ratio stays within PYQ-style bounds."
    );
  }
  if (templateRepetitionRatio > 0.24) {
    penalties.push(
      "Repeated clue templates reduce setter realism."
    );
  } else {
    matchedHeuristics.push(
      "Clue phrasings remain structurally varied."
    );
  }
  if (scenario.repeatedStructureWarnings.length > 0) {
    penalties.push(
      "Structure warnings indicate repeated reasoning patterns."
    );
  }
  if (scenario.directClueCount >= Math.max(
    3,
    Math.ceil(
      scenario.clueCount * 0.6
    )
  )) {
    penalties.push(
      "Direct placements dominate instead of inference-led clues."
    );
  }
  if (scenario.generatedClues.some(
    (clue) => clue.includes(
      "immediately left of"
    )
  ) && scenario.directClueRatio > 0.45) {
    penalties.push(
      "Ordered adjacency is overused relative to richer clue families."
    );
  }
  const anchorDensity = roundScore(
    scoreAgainstRange(
      scenario.anchorDensity,
      heuristics.anchorDensityRange
    )
  );
  if (anchorDensity >= 7.5) {
    matchedHeuristics.push(
      "Anchor density is close to curated exam patterns."
    );
  } else {
    diagnosticSummary.push(
      "Anchor usage is either too sparse for grounding or too dense for elegant deduction."
    );
  }
  const deductionSmoothness = roundScore(
    scoreAgainstRange(
      scenario.clueInteractionRatio,
      heuristics.interactionRange
    ) * 0.4 + scoreAgainstRange(
      scenario.deductionDependencyScore,
      heuristics.deductionDependencyRange
    ) * 0.4 + scoreAgainstRange(
      scenario.inferenceDepth,
      heuristics.inferenceDepthRange
    ) * 0.2
  );
  if (deductionSmoothness >= 7) {
    matchedHeuristics.push(
      "Deduction flow resembles a layered coaching-style solve path."
    );
  } else {
    diagnosticSummary.push(
      "Deduction flow is either too flat or too jumpy compared with curated PYQ heuristics."
    );
  }
  const branchingQuality = roundScore(
    scoreAgainstRange(
      scenario.branchingComplexity,
      heuristics.branchingComplexityRange
    ) * 0.5 + scoreAgainstRange(
      scenario.branchingFactor,
      [0.04, 0.45]
    ) * 0.2 + scoreAgainstRange(
      scenario.eliminationDepth,
      [1, 4]
    ) * 0.3
  );
  if (branchingQuality >= 7) {
    matchedHeuristics.push(
      "Branching and elimination feel exam-like rather than arbitrary."
    );
  } else if (scenario.branchingComplexity > 0.75) {
    penalties.push(
      "Branching feels noisy rather than purposeful."
    );
  }
  const topologyDiversity = roundScore(
    scenario.topologyDiversityScore * 0.4 + scenario.clueDiversityScore * 0.25 + scenario.inferenceDiversityScore * 0.35
  );
  if (topologyDiversity >= 7.25) {
    matchedHeuristics.push(
      "Topology and clue mix differ meaningfully from prior generated structures."
    );
  }
  let overconstraintDetection = roundScore(
    scoreAgainstRange(
      1 - scenario.redundancyRatio,
      [0.72, 1]
    ) * 0.45 + scoreAgainstRange(
      1 - scenario.directClueRatio,
      [0.58, 0.92]
    ) * 0.2 + scoreAgainstRange(
      scenario.originalClueCount - scenario.minimalClueCount,
      [0, 2]
    ) * 0.15 + scoreAgainstRange(
      1 - Math.min(
        scenario.validationRetries / 10,
        1
      ),
      [0.25, 1]
    ) * 0.2
  );
  if (scenario.redundancyRatio > 0.4) {
    overconstraintDetection = roundScore(
      overconstraintDetection - 1.5
    );
    penalties.push(
      "High redundancy ratio suggests overconstraint."
    );
  }
  if (scenario.originalClueCount - scenario.minimalClueCount >= 3) {
    penalties.push(
      "Too many removable clues indicate a non-minimal puzzle."
    );
  } else {
    matchedHeuristics.push(
      "Clue set is close to minimal solvability."
    );
  }
  const pyqHeuristicAlignment = roundScore(
    scoreAgainstRange(
      scenario.anchorDensity,
      heuristics.anchorDensityRange
    ) * 0.2 + scoreAgainstRange(
      scenario.directClueRatio,
      heuristics.directClueRatioRange
    ) * 0.2 + scoreAgainstRange(
      scenario.clueDensity,
      heuristics.clueDensityRange
    ) * 0.15 + scoreAgainstRange(
      scenario.clueInteractionRatio,
      heuristics.interactionRange
    ) * 0.15 + scoreAgainstRange(
      scenario.inferenceDepth,
      heuristics.inferenceDepthRange
    ) * 0.15 + scoreAgainstRange(
      scenario.branchingComplexity,
      heuristics.branchingComplexityRange
    ) * 0.15
  );
  const overallScore = roundScore(
    clueNaturalness * 0.22 + anchorDensity * 0.14 + deductionSmoothness * 0.2 + branchingQuality * 0.15 + topologyDiversity * 0.14 + overconstraintDetection * 0.15
  );
  if (scenario.directClueRatio > 0.5) {
    penalties.push(
      "Excessive direct placements weaken exam realism."
    );
  }
  if (scenario.redundancyScore >= 7.5) {
    penalties.push(
      "Redundancy score is high enough to suggest the puzzle was overspecified."
    );
  }
  if (scenario.generatedClues.filter(
    (clue) => clue.includes(
      "immediately left of"
    ) || clue.includes(
      "adjacent to"
    )
  ).length >= Math.max(
    3,
    Math.ceil(
      scenario.clueCount * 0.55
    )
  )) {
    penalties.push(
      "Adjacency chain behavior is too prominent."
    );
  } else {
    matchedHeuristics.push(
      "Adjacency is present without degenerating into serialization."
    );
  }
  diagnosticSummary.push(
    `PYQ alignment ${pyqHeuristicAlignment.toFixed(
      2
    )}/10 against ${examProfile.toUpperCase()} heuristics.`
  );
  diagnosticSummary.push(
    `Clue density ${scenario.clueDensity.toFixed(
      2
    )}, direct clue ratio ${scenario.directClueRatio.toFixed(
      2
    )}, redundancy ratio ${scenario.redundancyRatio.toFixed(
      2
    )}.`
  );
  return {
    overallScore,
    band: getRealismBand(
      overallScore
    ),
    clueNaturalness,
    anchorDensity,
    deductionSmoothness,
    branchingQuality,
    topologyDiversity,
    overconstraintDetection,
    pyqHeuristicAlignment,
    penalties: [
      ...new Set(penalties)
    ],
    matchedHeuristics: [
      ...new Set(matchedHeuristics)
    ],
    diagnosticSummary
  };
}

// src/lib/core/pattern-extractors.ts
function getPrimaryQuestion2(question) {
  if (!question) {
    return void 0;
  }
  return "questionType" in question && question.questionType === "di" ? question.questions[0] : question;
}
function countBy(values2) {
  return values2.reduce(
    (accumulator, value) => {
      accumulator[value] = (accumulator[value] ?? 0) + 1;
      return accumulator;
    },
    {}
  );
}
function buildDistractorSummary(context) {
  const primaryQuestion = getPrimaryQuestion2(
    context.question
  );
  const distractorValues = (primaryQuestion?.optionMetadata ?? []).filter((option) => !option.isCorrect).map(
    (option) => option.distractorType ?? option.reasoningTrap ?? "generic-distractor"
  );
  const frequencies = countBy(distractorValues);
  return Object.entries(frequencies).map(
    ([label, frequency]) => ({
      type: label,
      label,
      trapType: label,
      frequency
    })
  );
}
function buildMotifSummary(context, fallbackArchetype) {
  const primaryQuestion = getPrimaryQuestion2(
    context.question
  );
  const selectedMotifId = primaryQuestion?.debugMetadata?.selectedMotif;
  const matchedMotif = UNIVERSAL_MOTIFS.find(
    (motif) => motif.id === selectedMotifId
  );
  if (matchedMotif) {
    return [
      {
        motifId: matchedMotif.id,
        domain: matchedMotif.domain,
        archetype: String(
          matchedMotif.archetype
        ),
        confidence: 0.95,
        metadata: {
          generated: "selectedMotif"
        }
      }
    ];
  }
  return [
    {
      motifId: `${context.scenario.domain}:${context.scenario.subtype}`,
      domain: context.scenario.domain,
      archetype: fallbackArchetype,
      confidence: 0.45,
      metadata: {
        inferred: true
      }
    }
  ];
}
var reasoningExtractor = {
  domain: "reasoning",
  extractStructure(context) {
    const tokens = [
      `subtype:${context.scenario.subtype}`,
      `entities:${context.scenario.entities.length}`,
      `constraints:${context.scenario.constraints.length}`,
      ...context.scenario.constraints.map(
        (constraint) => `constraint:${constraint.type}`
      )
    ];
    return {
      domain: "reasoning",
      subtype: context.scenario.subtype,
      entityCount: context.scenario.entities.length,
      constraintCount: context.scenario.constraints.length,
      structureTokens: tokens,
      topology: String(
        context.scenario.metadata?.arrangementType ?? context.scenario.subtype
      ),
      metadata: {
        orientationType: context.scenario.metadata?.orientationType
      }
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad: context.scenario.difficulty.metrics.cognitiveLoadBase ?? 0,
      inferenceDepth: context.scenario.difficulty.inferenceDepth ?? 0,
      calculationComplexity: 0,
      distractorComplexity: context.scenario.difficulty.metrics.distractorCount ?? 0,
      ambiguityScore: context.scenario.difficulty.metrics.ambiguityScoreBase ?? 0,
      solvingTimeEstimate: context.scenario.difficulty.metrics.estimatedSolveTime ?? 0,
      difficultyBand: context.scenario.difficulty.label,
      metadata: {
        arrangementType: context.scenario.metadata?.arrangementType
      }
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context
    );
  },
  extractMotifs(context) {
    const archetype = context.scenario.constraints.some(
      (constraint) => constraint.expression?.toLowerCase().includes("not ")
    ) ? "elimination-chain" : "relative-placement";
    return buildMotifSummary(
      context,
      archetype
    );
  }
};
var quantExtractor = {
  domain: "quant",
  extractStructure(context) {
    const variableNames = context.scenario.entities.map(
      (entity) => entity.label
    );
    return {
      domain: "quant",
      subtype: context.scenario.subtype,
      entityCount: context.scenario.entities.length,
      constraintCount: context.scenario.constraints.length,
      structureTokens: [
        `variables:${variableNames.join(",")}`,
        ...context.scenario.constraints.map(
          (constraint) => `constraint:${constraint.type}`
        )
      ],
      topology: "formula-network",
      metadata: {
        formula: context.scenario.constraints[0]?.expression
      }
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad: context.scenario.difficulty.metrics.cognitiveLoadBase ?? 0,
      inferenceDepth: context.scenario.difficulty.inferenceDepth ?? 0,
      calculationComplexity: context.scenario.difficulty.metrics.calculationComplexity ?? 0,
      distractorComplexity: context.scenario.difficulty.metrics.distractorCount ?? 0,
      ambiguityScore: context.scenario.difficulty.metrics.ambiguityScoreBase ?? 0,
      solvingTimeEstimate: context.scenario.difficulty.metrics.estimatedSolveTime ?? 0,
      difficultyBand: context.scenario.difficulty.label
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context
    );
  },
  extractMotifs(context) {
    return buildMotifSummary(
      context,
      "ratio-trap"
    );
  }
};
var englishExtractor = {
  domain: "english",
  extractStructure(context) {
    return {
      domain: "english",
      subtype: context.scenario.subtype,
      entityCount: context.scenario.entities.length,
      constraintCount: context.scenario.constraints.length,
      structureTokens: [
        ...context.scenario.entities.map(
          (entity) => `token:${entity.label.toLowerCase()}`
        ),
        ...context.scenario.constraints.map(
          (constraint) => `rule:${constraint.type}`
        )
      ],
      topology: "syntax-graph"
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad: context.scenario.difficulty.metrics.cognitiveLoadBase ?? 0,
      inferenceDepth: context.scenario.difficulty.inferenceDepth ?? 0,
      calculationComplexity: 0,
      distractorComplexity: context.scenario.difficulty.metrics.distractorCount ?? 0,
      ambiguityScore: context.scenario.difficulty.metrics.ambiguityScoreBase ?? 0,
      solvingTimeEstimate: context.scenario.difficulty.metrics.estimatedSolveTime ?? 0,
      difficultyBand: context.scenario.difficulty.label
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context
    );
  },
  extractMotifs(context) {
    return buildMotifSummary(
      context,
      "grammar-ambiguity"
    );
  }
};
var diExtractor = {
  domain: "di",
  extractStructure(context) {
    const rowCount = context.scenario.entities.filter(
      (entity) => entity.type === "di-row"
    ).length;
    const columnCount = context.scenario.entities.filter(
      (entity) => entity.type === "di-column"
    ).length;
    return {
      domain: "di",
      subtype: context.scenario.subtype,
      entityCount: context.scenario.entities.length,
      constraintCount: context.scenario.constraints.length,
      structureTokens: [
        `rows:${rowCount}`,
        `columns:${columnCount}`,
        ...context.scenario.constraints.map(
          (constraint) => `constraint:${constraint.type}`
        )
      ],
      topology: "visual-grid",
      metadata: {
        rowCount,
        columnCount
      }
    };
  },
  extractDifficulty(context) {
    return {
      cognitiveLoad: context.scenario.difficulty.metrics.cognitiveLoadBase ?? 0,
      inferenceDepth: context.scenario.difficulty.inferenceDepth ?? 0,
      calculationComplexity: context.scenario.difficulty.metrics.calculationComplexity ?? 0,
      distractorComplexity: context.scenario.difficulty.metrics.distractorCount ?? 0,
      ambiguityScore: context.scenario.difficulty.metrics.ambiguityScoreBase ?? 0,
      solvingTimeEstimate: context.scenario.difficulty.metrics.estimatedSolveTime ?? 0,
      difficultyBand: context.scenario.difficulty.label
    };
  },
  extractDistractors(context) {
    return buildDistractorSummary(
      context
    );
  },
  extractMotifs(context) {
    return buildMotifSummary(
      context,
      "data-interpretation"
    );
  }
};
var PATTERN_EXTRACTORS = {
  reasoning: reasoningExtractor,
  "seating-arrangement": reasoningExtractor,
  quant: quantExtractor,
  english: englishExtractor,
  di: diExtractor
};
function resolvePatternExtractor(domain) {
  return PATTERN_EXTRACTORS[domain] ?? quantExtractor;
}
function extractPatternIntelligence(context) {
  const extractor = resolvePatternExtractor(
    context.scenario.domain
  );
  return {
    domain: extractor.domain,
    structure: extractor.extractStructure(context),
    difficulty: extractor.extractDifficulty(
      context
    ),
    distractors: extractor.extractDistractors(
      context
    ),
    motifs: extractor.extractMotifs(context)
  };
}

// src/lib/core/structural-signatures.ts
function normalizeText(value) {
  return value.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
}
function hashText(value) {
  let hash = 2166136261;
  for (let index2 = 0; index2 < value.length; index2 += 1) {
    hash ^= value.charCodeAt(index2);
    hash = Math.imul(hash, 16777619);
  }
  return `sig_${(hash >>> 0).toString(16)}`;
}
function buildTopologyTokens(scenario, extracted) {
  if (extracted?.structure.structureTokens?.length) {
    return [
      `domain:${extracted.domain}`,
      `subtype:${extracted.structure.subtype}`,
      ...extracted.structure.structureTokens
    ].map(normalizeText);
  }
  return [
    `domain:${scenario.domain}`,
    `subtype:${scenario.subtype}`,
    `entities:${scenario.entities.length}`,
    `constraints:${scenario.constraints.length}`,
    ...scenario.constraints.map(
      (constraint) => `constraint:${constraint.type}`
    )
  ].map(normalizeText);
}
function buildInferenceTokens(scenario, extracted) {
  const difficulty = extracted?.difficulty;
  return [
    `inference:${difficulty?.inferenceDepth ?? scenario.difficulty.inferenceDepth ?? 0}`,
    `cognitive:${difficulty?.cognitiveLoad ?? scenario.difficulty.metrics.cognitiveLoadBase ?? 0}`,
    `ambiguity:${difficulty?.ambiguityScore ?? scenario.difficulty.metrics.ambiguityScoreBase ?? 0}`,
    ...scenario.constraints.map(
      (constraint) => `expr:${normalizeText(
        constraint.expression ?? constraint.type
      )}`
    )
  ];
}
function buildMotifTokens(extracted) {
  return (extracted?.motifs.map(
    (motif) => `${motif.domain}:${motif.archetype}:${motif.motifId}`
  ) ?? ["motif:none"]).map(normalizeText);
}
function buildDistractorTokens(extracted) {
  return (extracted?.distractors.map(
    (distractor) => `${distractor.type}:${distractor.frequency}`
  ) ?? ["distractor:none"]).map(normalizeText);
}
function buildStructuralSignature(scenario, extracted) {
  const topologyTokens = buildTopologyTokens(
    scenario,
    extracted
  );
  const inferenceTokens = buildInferenceTokens(
    scenario,
    extracted
  );
  const motifTokens = buildMotifTokens(extracted);
  const distractorTokens = buildDistractorTokens(extracted);
  return {
    domain: scenario.domain,
    topologyHash: hashText(
      topologyTokens.sort().join("|")
    ),
    inferenceHash: hashText(
      inferenceTokens.sort().join("|")
    ),
    motifHash: hashText(
      motifTokens.sort().join("|")
    ),
    distractorHash: hashText(
      distractorTokens.sort().join("|")
    )
  };
}

// src/lib/core/corpus-alignment.ts
var DEFAULT_DOMAIN_PROFILES = {
  reasoning: {
    clueDensityRange: [0.45, 0.9],
    topologyWeights: {
      linear: 0.32,
      circular: 0.28,
      "double-row": 0.16,
      alternate: 0.14,
      rectangular: 0.1
    },
    inferenceDepthRange: [3.5, 6.8],
    distractorTypeWeights: {
      "generic-distractor": 0.3,
      elimination: 0.22,
      orientation: 0.18,
      adjacency: 0.15
    },
    wordingComplexityRange: [10, 20]
  },
  "seating-arrangement": {
    clueDensityRange: [0.48, 0.9],
    topologyWeights: {
      linear: 0.32,
      circular: 0.28,
      "double-row": 0.16,
      alternate: 0.14,
      rectangular: 0.1
    },
    inferenceDepthRange: [3.8, 7],
    distractorTypeWeights: {
      "generic-distractor": 0.28,
      elimination: 0.26,
      orientation: 0.18,
      adjacency: 0.14
    },
    wordingComplexityRange: [10, 20]
  },
  quant: {
    inferenceDepthRange: [1.8, 4.6],
    distractorTypeWeights: {
      arithmeticSlip: 0.24,
      percentageTrap: 0.22,
      wrongIntermediateValue: 0.18,
      wrongDenominator: 0.14,
      "generic-distractor": 0.12
    },
    wordingComplexityRange: [8, 16],
    formulaComplexityRange: [1.8, 5.4]
  },
  english: {
    inferenceDepthRange: [1.6, 4.2],
    distractorTypeWeights: {
      "generic-distractor": 0.26,
      "grammar-ambiguity": 0.28,
      "modifier-attachment": 0.18
    },
    wordingComplexityRange: [8, 18],
    grammarTrapFrequencyRange: [0.12, 0.38]
  },
  di: {
    inferenceDepthRange: [2.2, 5.6],
    distractorTypeWeights: {
      "generic-distractor": 0.18,
      comparisonTrap: 0.22,
      wrongIntermediateValue: 0.18,
      wrongDenominator: 0.14
    },
    wordingComplexityRange: [7, 15],
    formulaComplexityRange: [1.4, 4.6]
  }
};
var PROFILE_OVERRIDES = {
  default: {},
  custom: {},
  ssc: {
    reasoning: {
      clueDensityRange: [0.52, 0.92],
      inferenceDepthRange: [3, 5.4],
      wordingComplexityRange: [8, 15]
    },
    "seating-arrangement": {
      clueDensityRange: [0.52, 0.92],
      inferenceDepthRange: [3, 5.4],
      wordingComplexityRange: [8, 15]
    },
    quant: {
      formulaComplexityRange: [1.4, 3.4],
      wordingComplexityRange: [7, 13]
    }
  },
  ibps: {
    reasoning: {
      clueDensityRange: [0.45, 0.82],
      inferenceDepthRange: [4.2, 6.8],
      wordingComplexityRange: [10, 18]
    },
    "seating-arrangement": {
      clueDensityRange: [0.45, 0.82],
      inferenceDepthRange: [4.2, 6.8],
      wordingComplexityRange: [10, 18]
    },
    di: {
      formulaComplexityRange: [1.8, 4.8]
    }
  },
  cat: {
    reasoning: {
      clueDensityRange: [0.36, 0.72],
      inferenceDepthRange: [5.6, 8.5],
      wordingComplexityRange: [12, 22]
    },
    "seating-arrangement": {
      clueDensityRange: [0.36, 0.72],
      inferenceDepthRange: [5.6, 8.5],
      wordingComplexityRange: [12, 22]
    },
    quant: {
      formulaComplexityRange: [3.2, 6.8],
      wordingComplexityRange: [10, 18]
    }
  },
  sbi: {
    reasoning: {
      inferenceDepthRange: [4.6, 7.2]
    },
    "seating-arrangement": {
      inferenceDepthRange: [4.6, 7.2]
    }
  },
  rrb: {
    reasoning: {
      clueDensityRange: [0.55, 1],
      inferenceDepthRange: [2.8, 4.8],
      wordingComplexityRange: [7, 14]
    },
    "seating-arrangement": {
      clueDensityRange: [0.55, 1],
      inferenceDepthRange: [2.8, 4.8],
      wordingComplexityRange: [7, 14]
    }
  }
};
function clamp2(value, min, max) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}
function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}
function scoreAgainstRange2(value, range) {
  if (!range) {
    return 10;
  }
  const [min, max] = range;
  if (value >= min && value <= max) {
    return 10;
  }
  const tolerance = Math.max((max - min) * 0.75, 0.08);
  const distance = value < min ? min - value : value - max;
  return round(
    clamp2(
      10 - distance / tolerance * 10,
      0,
      10
    )
  );
}
function getPrimaryQuestion3(question) {
  if (!question) {
    return void 0;
  }
  return "questionType" in question && question.questionType === "di" ? question.questions[0] : question;
}
function getActiveProfile(domain, examProfile) {
  const base = DEFAULT_DOMAIN_PROFILES[domain] ?? DEFAULT_DOMAIN_PROFILES.quant;
  const override = PROFILE_OVERRIDES[examProfile ?? "default"]?.[domain] ?? {};
  return {
    ...base,
    ...override
  };
}
function estimateWordingComplexity(question) {
  const primaryQuestion = getPrimaryQuestion3(question);
  const text2 = primaryQuestion?.text ?? "";
  if (!text2.trim()) {
    return 0;
  }
  const tokens = text2.split(/\s+/).filter(Boolean);
  const avgTokenLength = tokens.reduce(
    (sum, token) => sum + token.length,
    0
  ) / Math.max(tokens.length, 1);
  const clauseCount = text2.split(/[,:;()]/).length;
  return round(
    tokens.length * 0.55 + avgTokenLength * 0.8 + clauseCount * 0.7
  );
}
function estimateFormulaComplexity(extracted) {
  return round(
    extracted.difficulty.calculationComplexity ?? 0
  );
}
function estimateGrammarTrapFrequency(extracted) {
  if (extracted.domain !== "english") {
    return 0;
  }
  const grammarMotifs = extracted.motifs.filter(
    (motif) => motif.archetype.includes(
      "grammar"
    ) || motif.archetype.includes(
      "ambiguity"
    )
  ).length;
  const distractorTotal = extracted.distractors.reduce(
    (sum, distractor) => sum + distractor.frequency,
    0
  );
  if (distractorTotal === 0) {
    return round(grammarMotifs * 0.1);
  }
  const grammarDistractors = extracted.distractors.reduce(
    (sum, distractor) => sum + (distractor.type.toLowerCase().includes("grammar") ? distractor.frequency : 0),
    0
  );
  return round(
    grammarDistractors / distractorTotal * 0.7 + grammarMotifs * 0.15
  );
}
function getTopDistractorPattern(extracted) {
  return [
    ...extracted.distractors
  ].sort(
    (left, right) => right.frequency - left.frequency
  )[0];
}
function buildCorpusAlignmentScore(extracted, question, examProfile) {
  const profile = getActiveProfile(
    extracted.domain,
    examProfile
  );
  const deviations = [];
  const matchedPatterns = [];
  const componentScores = [];
  const clueDensity = extracted.structure.constraintCount / Math.max(
    extracted.structure.entityCount,
    1
  );
  const clueDensityScore = scoreAgainstRange2(
    clueDensity,
    profile.clueDensityRange
  );
  componentScores.push(clueDensityScore);
  if (clueDensityScore >= 7.5) {
    matchedPatterns.push(
      "Clue density aligns with extracted PYQ corpus ranges."
    );
  } else if (profile.clueDensityRange) {
    deviations.push({
      metric: "clue-density",
      actual: round(clueDensity),
      expected: `${profile.clueDensityRange[0]}-${profile.clueDensityRange[1]}`,
      delta: round(
        Math.min(
          Math.abs(
            clueDensity - profile.clueDensityRange[0]
          ),
          Math.abs(
            clueDensity - profile.clueDensityRange[1]
          )
        )
      ),
      message: "Clue density deviates from corpus-calibrated expectations."
    });
  }
  const topology = extracted.structure.topology ?? extracted.structure.subtype;
  const topologyWeight = profile.topologyWeights?.[topology] ?? profile.topologyWeights?.[topology.toLowerCase()];
  const topologyScore = typeof topologyWeight === "number" ? round(
    clamp2(
      topologyWeight * 20,
      0,
      10
    )
  ) : 7;
  componentScores.push(topologyScore);
  if (topologyScore >= 7.5) {
    matchedPatterns.push(
      `Topology ${topology} is well represented in the PYQ-derived distribution.`
    );
  } else {
    deviations.push({
      metric: "topology-frequency",
      actual: topology,
      expected: "higher-frequency corpus topology",
      message: "Topology is less common than the target corpus profile."
    });
  }
  const inferenceDepthScore = scoreAgainstRange2(
    extracted.difficulty.inferenceDepth,
    profile.inferenceDepthRange
  );
  componentScores.push(
    inferenceDepthScore
  );
  if (inferenceDepthScore >= 7.5) {
    matchedPatterns.push(
      "Inference depth tracks the target corpus difficulty curve."
    );
  } else if (profile.inferenceDepthRange) {
    deviations.push({
      metric: "inference-depth",
      actual: extracted.difficulty.inferenceDepth,
      expected: `${profile.inferenceDepthRange[0]}-${profile.inferenceDepthRange[1]}`,
      delta: round(
        Math.min(
          Math.abs(
            extracted.difficulty.inferenceDepth - profile.inferenceDepthRange[0]
          ),
          Math.abs(
            extracted.difficulty.inferenceDepth - profile.inferenceDepthRange[1]
          )
        )
      ),
      message: "Inference depth sits outside the expected corpus band."
    });
  }
  const topDistractor = getTopDistractorPattern(
    extracted
  );
  const distractorScore = topDistractor ? round(
    clamp2(
      (profile.distractorTypeWeights?.[topDistractor.type] ?? 0.35) * 20,
      0,
      10
    )
  ) : 6;
  componentScores.push(
    distractorScore
  );
  if (distractorScore >= 7.5) {
    matchedPatterns.push(
      "Dominant distractor pattern matches extracted corpus tendencies."
    );
  } else if (topDistractor) {
    deviations.push({
      metric: "distractor-pattern",
      actual: topDistractor.type,
      expected: "higher-frequency corpus distractor families",
      message: "Distractor distribution is weaker or less corpus-like than expected."
    });
  }
  const wordingComplexity = estimateWordingComplexity(
    question
  );
  const wordingScore = scoreAgainstRange2(
    wordingComplexity,
    profile.wordingComplexityRange
  );
  componentScores.push(wordingScore);
  if (wordingScore >= 7.5) {
    matchedPatterns.push(
      "Wording complexity resembles the PYQ corpus style."
    );
  } else if (profile.wordingComplexityRange) {
    deviations.push({
      metric: "wording-complexity",
      actual: wordingComplexity,
      expected: `${profile.wordingComplexityRange[0]}-${profile.wordingComplexityRange[1]}`,
      message: "Question wording is simpler or denser than the target corpus."
    });
  }
  if (extracted.domain === "quant" || extracted.domain === "di") {
    const formulaComplexity = estimateFormulaComplexity(
      extracted
    );
    const formulaScore = scoreAgainstRange2(
      formulaComplexity,
      profile.formulaComplexityRange
    );
    componentScores.push(formulaScore);
    if (formulaScore >= 7.5) {
      matchedPatterns.push(
        "Formula/calculation complexity aligns with corpus behavior."
      );
    } else if (profile.formulaComplexityRange) {
      deviations.push({
        metric: "formula-complexity",
        actual: formulaComplexity,
        expected: `${profile.formulaComplexityRange[0]}-${profile.formulaComplexityRange[1]}`,
        message: "Computation load departs from the target corpus distribution."
      });
    }
  }
  if (extracted.domain === "english") {
    const grammarTrapFrequency = estimateGrammarTrapFrequency(
      extracted
    );
    const grammarTrapScore = scoreAgainstRange2(
      grammarTrapFrequency,
      profile.grammarTrapFrequencyRange
    );
    componentScores.push(
      grammarTrapScore
    );
    if (grammarTrapScore >= 7.5) {
      matchedPatterns.push(
        "Grammar trap frequency resembles the curated corpus."
      );
    } else if (profile.grammarTrapFrequencyRange) {
      deviations.push({
        metric: "grammar-trap-frequency",
        actual: grammarTrapFrequency,
        expected: `${profile.grammarTrapFrequencyRange[0]}-${profile.grammarTrapFrequencyRange[1]}`,
        message: "Grammar trap usage is misaligned with the target corpus."
      });
    }
  }
  return {
    score: round(
      componentScores.reduce(
        (sum, score) => sum + score,
        0
      ) / Math.max(
        componentScores.length,
        1
      )
    ),
    deviations,
    matchedPatterns: [
      ...new Set(matchedPatterns)
    ]
  };
}

// src/lib/core/topic-config.ts
var TOPIC_CONFIGS = [
  {
    domain: "quant",
    topic: "Time & Work",
    enabledMotifs: [
      "efficiency-substitution",
      "inverse-work-trap"
    ],
    difficultyDistribution: {
      easy: 25,
      medium: 50,
      hard: 25
    },
    parameterRanges: {
      workerCount: {
        min: 2,
        max: 5
      },
      totalWork: {
        min: 24,
        max: 180
      }
    },
    distractorStrategies: [
      "numeric-offsets"
    ],
    validationRules: [
      "integral-work-rates",
      "avoid-trivial-single-step"
    ],
    generationLimits: {
      maxSteps: 5,
      maxCalculationLength: 4
    }
  },
  {
    domain: "seating-arrangement",
    topic: "Seating Arrangement",
    enabledMotifs: [
      "seating-sparse-anchor",
      "seating-indirect-elimination",
      "seating-orientation-inversion"
    ],
    difficultyDistribution: {
      easy: 20,
      medium: 50,
      hard: 30
    },
    parameterRanges: {
      participantCount: {
        min: 5,
        max: 8
      }
    },
    validationRules: [
      "reject-adjacency-chains",
      "require-unique-solution"
    ],
    generationLimits: {
      maxSteps: 8,
      maxClues: 8
    }
  },
  {
    domain: "english",
    topic: "Error Spotting",
    enabledMotifs: [
      "subject_verb_ambiguity",
      "tense-confusion"
    ],
    difficultyDistribution: {
      easy: 30,
      medium: 45,
      hard: 25
    },
    distractorStrategies: [
      "grammar-trap-mix"
    ],
    validationRules: [
      "single-dominant-error",
      "grammar-consistency"
    ],
    generationLimits: {
      maxSteps: 4
    }
  },
  {
    domain: "di",
    topic: "Data Interpretation",
    enabledMotifs: [
      "percentage-heavy-calculations",
      "approximation-friendly-datasets"
    ],
    difficultyDistribution: {
      easy: 20,
      medium: 55,
      hard: 25
    },
    parameterRanges: {
      rowCount: {
        min: 4,
        max: 7
      },
      valueSpread: "moderate"
    },
    distractorStrategies: [
      "numeric-offsets"
    ],
    validationRules: [
      "stable-series-labels",
      "consistent-units"
    ],
    generationLimits: {
      maxCalculationLength: 4
    }
  }
];
function normalize(value) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function pickOffsets(strategies) {
  if (!strategies?.some(
    (strategy) => strategy === "numeric-offsets" || strategy === "approximation-friendly-datasets"
  )) {
    return void 0;
  }
  return {
    type: "numeric_offsets",
    offsets: [-2, -1, 1, 2]
  };
}
function resolveTopicConfig(domain, topic) {
  const normalizedDomain = normalize(domain);
  const normalizedTopic = normalize(topic);
  return TOPIC_CONFIGS.find(
    (config) => normalize(config.domain) === normalizedDomain && normalize(config.topic) === normalizedTopic
  );
}
function applyTopicConfigToPattern(pattern, topicConfig) {
  if (!topicConfig) {
    return pattern;
  }
  const participantRange = topicConfig.parameterRanges?.["participantCount"];
  const participantCount = typeof participantRange === "number" ? participantRange : typeof participantRange === "object" && participantRange !== null && "max" in participantRange && typeof participantRange.max === "number" ? Number(
    participantRange.max
  ) : pattern.participantCount;
  const maxClues = topicConfig.generationLimits?.maxClues;
  const maxSteps = topicConfig.generationLimits?.maxSteps;
  return {
    ...pattern,
    supportedMotifs: topicConfig.enabledMotifs.length ? topicConfig.enabledMotifs : pattern.supportedMotifs,
    participantCount,
    clueTypes: maxClues && pattern.clueTypes?.length ? pattern.clueTypes.slice(
      0,
      maxClues
    ) : pattern.clueTypes,
    inferenceDepth: maxSteps && typeof pattern.inferenceDepth === "number" ? Math.min(
      pattern.inferenceDepth,
      maxSteps
    ) : pattern.inferenceDepth,
    distractorStrategy: pattern.distractorStrategy ?? pickOffsets(
      topicConfig.distractorStrategies
    ),
    variables: Object.keys(
      topicConfig.parameterRanges ?? {}
    ).length > 0 ? {
      ...pattern.variables,
      ...Object.fromEntries(
        Object.entries(
          topicConfig.parameterRanges ?? {}
        ).filter(
          ([, value]) => typeof value === "object" && value !== null && "min" in value && "max" in value
        )
      )
    } : pattern.variables
  };
}
function applyTopicConfigToOptions(options, topicConfig) {
  if (!topicConfig) {
    return options;
  }
  return {
    ...options,
    difficultyDistribution: options?.difficultyDistribution ?? topicConfig.difficultyDistribution
  };
}

// src/lib/core/difficulty-confidence.ts
function clamp3(value, min, max) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}
function round2(value, digits = 2) {
  return Number(value.toFixed(digits));
}
function classifyDifficulty(score) {
  if (score <= 2.5) {
    return "Easy";
  }
  if (score <= 5.5) {
    return "Medium";
  }
  return "Hard";
}
function getPrimaryQuestion4(question) {
  return "questionType" in question && question.questionType === "di" ? question.questions[0] : question;
}
function buildDifficultyConfidence(question, difficultyMetrics) {
  const primaryQuestion = getPrimaryQuestion4(question);
  const intendedScore = difficultyMetrics.difficultyScore ?? primaryQuestion?.difficultyScore ?? 0;
  const intendedDifficulty = difficultyMetrics.difficultyLabel ?? primaryQuestion?.difficultyLabel ?? classifyDifficulty(intendedScore);
  const domainContributions = difficultyMetrics.domainContributions ?? {};
  const solvingComplexity = difficultyMetrics.cognitiveLoad;
  const eliminationDepth = domainContributions["eliminationDepth"] ?? 0;
  const branchingComplexity = domainContributions["branchingComplexity"] ?? 0;
  const branchingFactor = primaryQuestion?.debugMetadata?.branchingFactor ?? 0;
  const distractorQuality = difficultyMetrics.distractorComplexity;
  const solverTraceLength = primaryQuestion?.debugMetadata?.solverTraceExport?.text?.length ?? primaryQuestion?.debugMetadata?.solverTrace?.length ?? 0;
  const humanSolverSimulation = difficultyMetrics.inferenceDepth * 0.42 + eliminationDepth * 0.28 + branchingComplexity * 2.1 + branchingFactor * 3.2 + distractorQuality * 0.38 + solverTraceLength * 0.12 + difficultyMetrics.calculationComplexity * 0.3 + difficultyMetrics.ambiguityScore * 0.18;
  const predictedScore = round2(
    clamp3(
      humanSolverSimulation,
      0,
      10
    )
  );
  const predictedDifficulty = classifyDifficulty(predictedScore);
  const scoreGap = Math.abs(
    predictedScore - intendedScore
  );
  const labelMatch = predictedDifficulty === intendedDifficulty ? 1 : 0;
  const traceSupport = clamp3(
    solverTraceLength / 10,
    0,
    1
  );
  const signalCoverage = [
    solvingComplexity > 0,
    difficultyMetrics.inferenceDepth > 0,
    distractorQuality > 0,
    eliminationDepth > 0,
    branchingComplexity > 0,
    solverTraceLength > 0
  ].filter(Boolean).length / 6;
  const confidence = round2(
    clamp3(
      9 - scoreGap * 1.45 + labelMatch * 1.1 + traceSupport * 0.9 + signalCoverage * 1.2,
      0,
      10
    )
  );
  return {
    predictedDifficulty,
    confidence,
    explanation: [
      `Intended difficulty ${intendedDifficulty} (${round2(intendedScore, 1)}), predicted ${predictedDifficulty} (${round2(predictedScore, 1)}).`,
      `Signals used: solving complexity ${round2(solvingComplexity, 1)}, elimination depth ${round2(eliminationDepth, 1)}, branching ${round2(branchingComplexity, 2)}, distractor quality ${round2(distractorQuality, 1)}.`,
      `Human-solver simulation combined inference depth ${round2(difficultyMetrics.inferenceDepth, 1)} with solver trace support ${solverTraceLength} and branching factor ${round2(branchingFactor, 2)}.`
    ].join(" ")
  };
}

// src/lib/core/originality-score.ts
function clamp4(value, min, max) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}
function round3(value, digits = 2) {
  return Number(value.toFixed(digits));
}
function normalizeText2(value) {
  return value.toLowerCase().replace(/\d+/g, "#").replace(/\b[a-z][a-z]+\b/g, "x").replace(/\s+/g, " ").trim();
}
function getPrimaryQuestion5(question) {
  if (!question) {
    return void 0;
  }
  return "questionType" in question && question.questionType === "di" ? question.questions[0] : question;
}
function getNormalizedClueTemplates(question) {
  const primaryQuestion = getPrimaryQuestion5(question);
  return (primaryQuestion?.debugMetadata?.generatedClues ?? []).map(normalizeText2);
}
function getRepeatedTemplateRatio(templates) {
  if (!templates.length) {
    return 0;
  }
  const frequencies = templates.reduce(
    (accumulator, template) => {
      accumulator[template] = (accumulator[template] ?? 0) + 1;
      return accumulator;
    },
    {}
  );
  const repeatedCount = Object.values(
    frequencies
  ).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0
  );
  return repeatedCount / templates.length;
}
function getFormulaCompositionPenalty(scenario, extracted) {
  if (extracted.domain !== "quant" && extracted.domain !== "di") {
    return 0;
  }
  const expressions = scenario.constraints.map(
    (constraint) => normalizeText2(
      constraint.expression ?? ""
    )
  ).filter(Boolean);
  if (!expressions.length) {
    return 0;
  }
  return getRepeatedTemplateRatio(
    expressions
  );
}
function getDistractorOrderingPenalty(question) {
  const primaryQuestion = getPrimaryQuestion5(question);
  const distractorOrder = (primaryQuestion?.optionMetadata ?? []).filter((option) => !option.isCorrect).map(
    (option) => option.distractorType ?? option.reasoningTrap ?? "generic-distractor"
  );
  return getRepeatedTemplateRatio(
    distractorOrder.map(
      normalizeText2
    )
  );
}
function getWordingPatternPenalty(question) {
  const primaryQuestion = getPrimaryQuestion5(question);
  const normalizedQuestion = normalizeText2(
    primaryQuestion?.text ?? ""
  );
  if (!normalizedQuestion) {
    return 0;
  }
  const clauseCount = normalizedQuestion.split(
    /[,;:]/
  ).length;
  const repeatedTokens = getRepeatedTemplateRatio(
    normalizedQuestion.split(" ")
  );
  return clamp4(
    repeatedTokens * 0.7 + Math.max(
      0,
      clauseCount - 4
    ) * 0.06,
    0,
    1
  );
}
function buildOriginalityScore(scenario, extracted, signature, corpusAlignment, question) {
  const penalties = [];
  const diagnostics = [
    "PYQ-derived intelligence is treated as calibration guidance only, not as a template source."
  ];
  const clueTemplatePenalty = getRepeatedTemplateRatio(
    getNormalizedClueTemplates(
      question
    )
  );
  const formulaPenalty = getFormulaCompositionPenalty(
    scenario,
    extracted
  );
  const distractorOrderingPenalty = getDistractorOrderingPenalty(
    question
  );
  const wordingPatternPenalty = getWordingPatternPenalty(
    question
  );
  const corpusSimilarityPressure = clamp4(
    Math.max(
      0,
      (corpusAlignment.score - 8.2) / 1.8
    ),
    0,
    1
  );
  const motifHashPenalty = signature.motifHash.endsWith(
    "0"
  ) ? 0.05 : 0;
  const originalityBase = 10 - clueTemplatePenalty * 3 - formulaPenalty * 2.4 - distractorOrderingPenalty * 2 - wordingPatternPenalty * 1.8 - corpusSimilarityPressure * 2.4 - motifHashPenalty;
  if (corpusSimilarityPressure > 0.45) {
    penalties.push(
      "High corpus-alignment pressure suggests the generation may be too close to PYQ-derived structural behavior."
    );
  }
  if (clueTemplatePenalty > 0.22) {
    penalties.push(
      "Repeated clue topology or wording templates reduce originality."
    );
  }
  if (formulaPenalty > 0.2) {
    penalties.push(
      "Formula composition appears too repetitive."
    );
  }
  if (distractorOrderingPenalty > 0.24) {
    penalties.push(
      "Distractor ordering looks mechanically repeated."
    );
  }
  if (wordingPatternPenalty > 0.26) {
    penalties.push(
      "Wording normalization indicates a repeated surface template pattern."
    );
  }
  diagnostics.push(
    `Clue topology penalty ${round3(clueTemplatePenalty, 3)}, formula repetition penalty ${round3(formulaPenalty, 3)}, distractor ordering penalty ${round3(distractorOrderingPenalty, 3)}.`
  );
  diagnostics.push(
    `Corpus alignment pressure ${round3(corpusSimilarityPressure, 3)} while preserving topic weighting and realism guidance only.`
  );
  return {
    score: round3(
      clamp4(
        originalityBase,
        0,
        10
      )
    ),
    penalties,
    diagnostics
  };
}

// src/lib/core/quality-filter.ts
var DEFAULT_QUALITY_THRESHOLDS = {
  requireValidationPass: true,
  minRealismScore: 5.5,
  minDifficultyConfidence: 5.5,
  maxDirectClueRatio: 0.44,
  minStructuralDiversityScore: 0.32,
  maxRepeatedStructureWarnings: 0,
  minDistractorComplexity: 1.5,
  minDistractorTypeCount: 2,
  maxGenericDistractorRatio: 0.7
};
function clamp5(value, min, max) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}
function round4(value, digits = 2) {
  return Number(value.toFixed(digits));
}
function getDifficultyConfidence(difficultyAssessment, proceduralScenario) {
  if (!difficultyAssessment) {
    return 0;
  }
  let score = 0;
  if (typeof difficultyAssessment.difficultyScore === "number") {
    score += 2;
  }
  if (difficultyAssessment.difficultyLabel) {
    score += 1;
  }
  if (typeof difficultyAssessment.inferenceDepth === "number" && difficultyAssessment.inferenceDepth > 0) {
    score += 1.5;
  }
  if (typeof difficultyAssessment.solvingTimeEstimate === "number" && difficultyAssessment.solvingTimeEstimate > 0) {
    score += 1.5;
  }
  if (Object.keys(
    difficultyAssessment.metrics ?? {}
  ).length >= 3) {
    score += 2;
  }
  if (proceduralScenario?.difficulty?.metrics && Object.keys(
    proceduralScenario.difficulty.metrics
  ).length >= 3) {
    score += 1;
  }
  if (typeof proceduralScenario?.difficulty?.score === "number" && typeof difficultyAssessment.difficultyScore === "number") {
    const difference = Math.abs(
      proceduralScenario.difficulty.score - difficultyAssessment.difficultyScore
    );
    score += Math.max(
      0,
      2 - difference / 2
    );
  }
  return round4(clamp5(score, 0, 10));
}
function getDistractorMetrics(extractedPatternIntelligence, difficultyAssessment) {
  const distractors = extractedPatternIntelligence?.distractors ?? [];
  const totalDistractors = distractors.reduce(
    (sum, distractor) => sum + distractor.frequency,
    0
  );
  const genericDistractors = distractors.reduce(
    (sum, distractor) => sum + (distractor.type === "generic-distractor" ? distractor.frequency : 0),
    0
  );
  const genericDistractorRatio = totalDistractors > 0 ? genericDistractors / totalDistractors : 1;
  const distractorTypeCount = distractors.length;
  const distractorComplexity = extractedPatternIntelligence?.difficulty.distractorComplexity ?? difficultyAssessment?.distractorComplexity ?? 0;
  return {
    distractorComplexity: round4(
      distractorComplexity
    ),
    distractorTypeCount,
    genericDistractorRatio: round4(
      genericDistractorRatio
    )
  };
}
function assessProceduralQuality(input, overrides) {
  const thresholds = {
    ...DEFAULT_QUALITY_THRESHOLDS,
    ...overrides
  };
  const rejectionReasons = [];
  const realismScore = input.realismScore ?? 0;
  const structuralDiversityScore = input.structuralDiversityScore ?? 1;
  const repeatedStructureWarnings = input.repeatedStructureWarnings ?? [];
  const directClueRatio = input.directClueRatio ?? 0;
  const difficultyConfidence = getDifficultyConfidence(
    input.difficultyAssessment,
    input.proceduralScenario
  );
  const {
    distractorComplexity,
    distractorTypeCount,
    genericDistractorRatio
  } = getDistractorMetrics(
    input.extractedPatternIntelligence,
    input.difficultyAssessment
  );
  if (thresholds.requireValidationPass && input.validationReport && !input.validationReport.passed) {
    rejectionReasons.push(
      "failed-validation"
    );
  }
  if (realismScore < thresholds.minRealismScore) {
    rejectionReasons.push(
      "low-realism-score"
    );
  }
  if (structuralDiversityScore < thresholds.minStructuralDiversityScore || repeatedStructureWarnings.length > thresholds.maxRepeatedStructureWarnings) {
    rejectionReasons.push(
      "repetitive-structure"
    );
  }
  if (difficultyConfidence < thresholds.minDifficultyConfidence) {
    rejectionReasons.push(
      "low-difficulty-confidence"
    );
  }
  if (directClueRatio > thresholds.maxDirectClueRatio) {
    rejectionReasons.push(
      "excessive-direct-clues"
    );
  }
  if (distractorComplexity < thresholds.minDistractorComplexity || distractorTypeCount < thresholds.minDistractorTypeCount || genericDistractorRatio > thresholds.maxGenericDistractorRatio) {
    rejectionReasons.push(
      "weak-distractors"
    );
  }
  return {
    approved: rejectionReasons.length === 0,
    rejectionReasons,
    qualityMetrics: {
      realismScore: round4(realismScore),
      validationPassed: input.validationReport?.passed === false ? 0 : 1,
      structuralDiversityScore: round4(
        structuralDiversityScore
      ),
      repeatedStructureWarnings: repeatedStructureWarnings.length,
      directClueRatio: round4(
        directClueRatio
      ),
      difficultyConfidence,
      distractorComplexity,
      distractorTypeCount,
      genericDistractorRatio,
      hasStructuralSignature: input.structuralSignature ? 1 : 0
    }
  };
}

// src/lib/generation-cache.ts
import { createHash } from "node:crypto";

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/entity.js
var entityKind = /* @__PURE__ */ Symbol.for("drizzle:entityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/column.js
var Column = class {
  constructor(table, config) {
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.keyAsName = config.keyAsName;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "") return;
    this.config.name = name;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/table.utils.js
var TableName = /* @__PURE__ */ Symbol.for("drizzle:Name");

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
  static [entityKind] = "PgForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
};
var ForeignKey = class {
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/unique-constraint.js
function unique(name) {
  return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [entityKind] = "PgUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
var UniqueOnConstraintBuilder = class {
  static [entityKind] = "PgUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
var UniqueConstraint = class {
  constructor(table, columns, nullsNotDistinct, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  static [entityKind] = "PgUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char2 = arrayString[i];
    if (char2 === "\\") {
      i++;
      continue;
    }
    if (char2 === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char2 === "," || char2 === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char2 = arrayString[i];
    if (char2 === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char2 === "\\") {
      i += 2;
      continue;
    }
    if (char2 === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char2 === "}") {
      return [result, i + 1];
    }
    if (char2 === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  static [entityKind] = "PgColumnBuilder";
  array(size2) {
    return new PgArrayBuilder(this.config.name, this, size2);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife(
        (ref2, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table);
        },
        ref,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table) {
    return new ExtraConfigColumn(table, this.config);
  }
};
var PgColumn = class extends Column {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
  static [entityKind] = "PgColumn";
};
var ExtraConfigColumn = class extends PgColumn {
  static [entityKind] = "ExtraConfigColumn";
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
var IndexedColumn = class {
  static [entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};
var PgArrayBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgArrayBuilder";
  constructor(name, baseBuilder, size2) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size2;
  }
  /** @internal */
  build(table) {
    const baseColumn = this.config.baseBuilder.build(table);
    return new PgArray(
      table,
      this.config,
      baseColumn
    );
  }
};
var PgArray = class _PgArray extends PgColumn {
  constructor(table, config, baseColumn, range) {
    super(table, config);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config.size;
  }
  size;
  static [entityKind] = "PgArray";
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map(
      (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
    );
    if (isNestedArray) return a;
    return makePgArray(a);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/enum.js
var PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgEnumObjectColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumObjectColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumObjectColumn(
      table,
      this.config
    );
  }
};
var PgEnumObjectColumn = class extends PgColumn {
  static [entityKind] = "PgEnumObjectColumn";
  enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
var isPgEnumSym = /* @__PURE__ */ Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table) {
    return new PgEnumColumn(
      table,
      this.config
    );
  }
};
var PgEnumColumn = class extends PgColumn {
  static [entityKind] = "PgEnumColumn";
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/subquery.js
var Subquery = class {
  static [entityKind] = "Subquery";
  constructor(sql2, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
var WithSubquery = class extends Subquery {
  static [entityKind] = "WithSubquery";
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/version.js
var version = "0.45.2";

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = /* @__PURE__ */ Symbol.for("drizzle:ViewBaseConfig");

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/table.js
var Schema = /* @__PURE__ */ Symbol.for("drizzle:Schema");
var Columns = /* @__PURE__ */ Symbol.for("drizzle:Columns");
var ExtraConfigColumns = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = /* @__PURE__ */ Symbol.for("drizzle:OriginalName");
var BaseName = /* @__PURE__ */ Symbol.for("drizzle:BaseName");
var IsAlias = /* @__PURE__ */ Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = /* @__PURE__ */ Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
};
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/sql/sql.js
var FakePrimitiveParam = class {
  static [entityKind] = "FakePrimitiveParam";
};
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
var StringChunk = class {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
    for (const chunk of queryChunks) {
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        this.usedTables.push(
          schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
        );
      }
    }
  }
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  /** @internal */
  usedTables = [];
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var Name = class {
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values2) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values2)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values2[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values2)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values2[p.value.name]);
    }
    return p;
  });
}
var IsDrizzleView = /* @__PURE__ */ Symbol.for("drizzle:IsDrizzleView");
var View = class {
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  /** @internal */
  [IsDrizzleView] = true;
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/alias.js
var ColumnAliasProxyHandler = class {
  constructor(table) {
    this.table = table;
  }
  static [entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
var RelationTableAliasProxyHandler = class {
  constructor(alias) {
    this.alias = alias;
  }
  static [entityKind] = "RelationTableAliasProxyHandler";
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var DrizzleQueryError = class _DrizzleQueryError extends Error {
  constructor(query, params, cause) {
    super(`Failed query: ${query}
params: ${params}`);
    this.query = query;
    this.params = params;
    this.cause = cause;
    Error.captureStackTrace(this, _DrizzleQueryError);
    if (cause) this.cause = cause;
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else if (is(field, Subquery)) {
        decoder = field._.sql.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased) || is(field, Subquery)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values2) {
  const entries = Object.entries(values2).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor") continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b2) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b2
  };
}
function isConfig(data) {
  if (typeof data !== "object" || data === null) return false;
  if (data.constructor.name !== "Object") return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined") return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["schema"];
    if (type !== "object" && type !== "undefined") return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["casing"];
    if (type !== "string" && type !== "undefined") return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0) return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined") return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined") return false;
    return true;
  }
  if (Object.keys(data).length === 0) return true;
  return false;
}
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/int.common.js
var PgIntColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntColumnBaseBuilder";
  generatedAlwaysAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "always",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "always"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
  generatedByDefaultAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "byDefault",
        sequenceName: name,
        sequenceOptions: options
      };
    } else {
      this.config.generatedIdentity = {
        type: "byDefault"
      };
    }
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/bigint.js
var PgBigInt53Builder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgBigInt53Builder";
  constructor(name) {
    super(name, "number", "PgBigInt53");
  }
  /** @internal */
  build(table) {
    return new PgBigInt53(table, this.config);
  }
};
var PgBigInt53 = class extends PgColumn {
  static [entityKind] = "PgBigInt53";
  getSQLType() {
    return "bigint";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var PgBigInt64Builder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgBigInt64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigInt64");
  }
  /** @internal */
  build(table) {
    return new PgBigInt64(
      table,
      this.config
    );
  }
};
var PgBigInt64 = class extends PgColumn {
  static [entityKind] = "PgBigInt64";
  getSQLType() {
    return "bigint";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
function bigint(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (config.mode === "number") {
    return new PgBigInt53Builder(name);
  }
  return new PgBigInt64Builder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/bigserial.js
var PgBigSerial53Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial53Builder";
  constructor(name) {
    super(name, "number", "PgBigSerial53");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial53(
      table,
      this.config
    );
  }
};
var PgBigSerial53 = class extends PgColumn {
  static [entityKind] = "PgBigSerial53";
  getSQLType() {
    return "bigserial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") {
      return value;
    }
    return Number(value);
  }
};
var PgBigSerial64Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial64Builder";
  constructor(name) {
    super(name, "bigint", "PgBigSerial64");
    this.config.hasDefault = true;
  }
  /** @internal */
  build(table) {
    return new PgBigSerial64(
      table,
      this.config
    );
  }
};
var PgBigSerial64 = class extends PgColumn {
  static [entityKind] = "PgBigSerial64";
  getSQLType() {
    return "bigserial";
  }
  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  mapFromDriverValue(value) {
    return BigInt(value);
  }
};
function bigserial(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (config.mode === "number") {
    return new PgBigSerial53Builder(name);
  }
  return new PgBigSerial64Builder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/boolean.js
var PgBooleanBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "PgBoolean");
  }
  /** @internal */
  build(table) {
    return new PgBoolean(table, this.config);
  }
};
var PgBoolean = class extends PgColumn {
  static [entityKind] = "PgBoolean";
  getSQLType() {
    return "boolean";
  }
};
function boolean(name) {
  return new PgBooleanBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/char.js
var PgCharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCharBuilder";
  constructor(name, config) {
    super(name, "string", "PgChar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgChar(
      table,
      this.config
    );
  }
};
var PgChar = class extends PgColumn {
  static [entityKind] = "PgChar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
};
function char(a, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgCharBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/cidr.js
var PgCidrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string", "PgCidr");
  }
  /** @internal */
  build(table) {
    return new PgCidr(table, this.config);
  }
};
var PgCidr = class extends PgColumn {
  static [entityKind] = "PgCidr";
  getSQLType() {
    return "cidr";
  }
};
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/custom.js
var PgCustomColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "PgCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new PgCustomColumn(
      table,
      this.config
    );
  }
};
var PgCustomColumn = class extends PgColumn {
  static [entityKind] = "PgCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapTo = config.customTypeParams.toDriver;
    this.mapFrom = config.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
function customType(customTypeParams) {
  return (a, b2) => {
    const { name, config } = getColumnNameAndConfig(a, b2);
    return new PgCustomColumnBuilder(name, config, customTypeParams);
  };
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/date.common.js
var PgDateColumnBaseBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/date.js
var PgDateBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateBuilder";
  constructor(name) {
    super(name, "date", "PgDate");
  }
  /** @internal */
  build(table) {
    return new PgDate(table, this.config);
  }
};
var PgDate = class extends PgColumn {
  static [entityKind] = "PgDate";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") return new Date(value);
    return value;
  }
  mapToDriverValue(value) {
    return value.toISOString();
  }
};
var PgDateStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgDateStringBuilder";
  constructor(name) {
    super(name, "string", "PgDateString");
  }
  /** @internal */
  build(table) {
    return new PgDateString(
      table,
      this.config
    );
  }
};
var PgDateString = class extends PgColumn {
  static [entityKind] = "PgDateString";
  getSQLType() {
    return "date";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    return value.toISOString().slice(0, -14);
  }
};
function date(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (config?.mode === "date") {
    return new PgDateBuilder(name);
  }
  return new PgDateStringBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/double-precision.js
var PgDoublePrecisionBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number", "PgDoublePrecision");
  }
  /** @internal */
  build(table) {
    return new PgDoublePrecision(
      table,
      this.config
    );
  }
};
var PgDoublePrecision = class extends PgColumn {
  static [entityKind] = "PgDoublePrecision";
  getSQLType() {
    return "double precision";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  }
};
function doublePrecision(name) {
  return new PgDoublePrecisionBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/inet.js
var PgInetBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgInetBuilder";
  constructor(name) {
    super(name, "string", "PgInet");
  }
  /** @internal */
  build(table) {
    return new PgInet(table, this.config);
  }
};
var PgInet = class extends PgColumn {
  static [entityKind] = "PgInet";
  getSQLType() {
    return "inet";
  }
};
function inet(name) {
  return new PgInetBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/integer.js
var PgIntegerBuilder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgIntegerBuilder";
  constructor(name) {
    super(name, "number", "PgInteger");
  }
  /** @internal */
  build(table) {
    return new PgInteger(table, this.config);
  }
};
var PgInteger = class extends PgColumn {
  static [entityKind] = "PgInteger";
  getSQLType() {
    return "integer";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number.parseInt(value);
    }
    return value;
  }
};
function integer(name) {
  return new PgIntegerBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/interval.js
var PgIntervalBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntervalBuilder";
  constructor(name, intervalConfig) {
    super(name, "string", "PgInterval");
    this.config.intervalConfig = intervalConfig;
  }
  /** @internal */
  build(table) {
    return new PgInterval(table, this.config);
  }
};
var PgInterval = class extends PgColumn {
  static [entityKind] = "PgInterval";
  fields = this.config.intervalConfig.fields;
  precision = this.config.intervalConfig.precision;
  getSQLType() {
    const fields = this.fields ? ` ${this.fields}` : "";
    const precision = this.precision ? `(${this.precision})` : "";
    return `interval${fields}${precision}`;
  }
};
function interval(a, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgIntervalBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/json.js
var PgJsonBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonBuilder";
  constructor(name) {
    super(name, "json", "PgJson");
  }
  /** @internal */
  build(table) {
    return new PgJson(table, this.config);
  }
};
var PgJson = class extends PgColumn {
  static [entityKind] = "PgJson";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
function json(name) {
  return new PgJsonBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/jsonb.js
var PgJsonbBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonbBuilder";
  constructor(name) {
    super(name, "json", "PgJsonb");
  }
  /** @internal */
  build(table) {
    return new PgJsonb(table, this.config);
  }
};
var PgJsonb = class extends PgColumn {
  static [entityKind] = "PgJsonb";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "jsonb";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }
};
function jsonb(name) {
  return new PgJsonbBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/line.js
var PgLineBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineBuilder";
  constructor(name) {
    super(name, "array", "PgLine");
  }
  /** @internal */
  build(table) {
    return new PgLineTuple(
      table,
      this.config
    );
  }
};
var PgLineTuple = class extends PgColumn {
  static [entityKind] = "PgLine";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a, b2, c] = value.slice(1, -1).split(",");
    return [Number.parseFloat(a), Number.parseFloat(b2), Number.parseFloat(c)];
  }
  mapToDriverValue(value) {
    return `{${value[0]},${value[1]},${value[2]}}`;
  }
};
var PgLineABCBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineABCBuilder";
  constructor(name) {
    super(name, "json", "PgLineABC");
  }
  /** @internal */
  build(table) {
    return new PgLineABC(
      table,
      this.config
    );
  }
};
var PgLineABC = class extends PgColumn {
  static [entityKind] = "PgLineABC";
  getSQLType() {
    return "line";
  }
  mapFromDriverValue(value) {
    const [a, b2, c] = value.slice(1, -1).split(",");
    return { a: Number.parseFloat(a), b: Number.parseFloat(b2), c: Number.parseFloat(c) };
  }
  mapToDriverValue(value) {
    return `{${value.a},${value.b},${value.c}}`;
  }
};
function line(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (!config?.mode || config.mode === "tuple") {
    return new PgLineBuilder(name);
  }
  return new PgLineABCBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/macaddr.js
var PgMacaddrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string", "PgMacaddr");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr(table, this.config);
  }
};
var PgMacaddr = class extends PgColumn {
  static [entityKind] = "PgMacaddr";
  getSQLType() {
    return "macaddr";
  }
};
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/macaddr8.js
var PgMacaddr8Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string", "PgMacaddr8");
  }
  /** @internal */
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
};
var PgMacaddr8 = class extends PgColumn {
  static [entityKind] = "PgMacaddr8";
  getSQLType() {
    return "macaddr8";
  }
};
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/numeric.js
var PgNumericBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBuilder";
  constructor(name, precision, scale) {
    super(name, "string", "PgNumeric");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumeric(table, this.config);
  }
};
var PgNumeric = class extends PgColumn {
  static [entityKind] = "PgNumeric";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    return String(value);
  }
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
var PgNumericNumberBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericNumberBuilder";
  constructor(name, precision, scale) {
    super(name, "number", "PgNumericNumber");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumericNumber(
      table,
      this.config
    );
  }
};
var PgNumericNumber = class extends PgColumn {
  static [entityKind] = "PgNumericNumber";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapFromDriverValue(value) {
    if (typeof value === "number") return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
var PgNumericBigIntBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBigIntBuilder";
  constructor(name, precision, scale) {
    super(name, "bigint", "PgNumericBigInt");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  /** @internal */
  build(table) {
    return new PgNumericBigInt(
      table,
      this.config
    );
  }
};
var PgNumericBigInt = class extends PgColumn {
  static [entityKind] = "PgNumericBigInt";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    if (this.precision !== void 0 && this.scale !== void 0) {
      return `numeric(${this.precision}, ${this.scale})`;
    } else if (this.precision === void 0) {
      return "numeric";
    } else {
      return `numeric(${this.precision})`;
    }
  }
};
function numeric(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  const mode = config?.mode;
  return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/point.js
var PgPointTupleBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointTupleBuilder";
  constructor(name) {
    super(name, "array", "PgPointTuple");
  }
  /** @internal */
  build(table) {
    return new PgPointTuple(
      table,
      this.config
    );
  }
};
var PgPointTuple = class extends PgColumn {
  static [entityKind] = "PgPointTuple";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x, y] = value.slice(1, -1).split(",");
      return [Number.parseFloat(x), Number.parseFloat(y)];
    }
    return [value.x, value.y];
  }
  mapToDriverValue(value) {
    return `(${value[0]},${value[1]})`;
  }
};
var PgPointObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointObjectBuilder";
  constructor(name) {
    super(name, "json", "PgPointObject");
  }
  /** @internal */
  build(table) {
    return new PgPointObject(
      table,
      this.config
    );
  }
};
var PgPointObject = class extends PgColumn {
  static [entityKind] = "PgPointObject";
  getSQLType() {
    return "point";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      const [x, y] = value.slice(1, -1).split(",");
      return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
    }
    return value;
  }
  mapToDriverValue(value) {
    return `(${value.x},${value.y})`;
  }
};
function point(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (!config?.mode || config.mode === "tuple") {
    return new PgPointTupleBuilder(name);
  }
  return new PgPointObjectBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.js
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
  }
  return new Uint8Array(bytes);
}
function bytesToFloat64(bytes, offset) {
  const buffer2 = new ArrayBuffer(8);
  const view = new DataView(buffer2);
  for (let i = 0; i < 8; i++) {
    view.setUint8(i, bytes[offset + i]);
  }
  return view.getFloat64(0, true);
}
function parseEWKB(hex) {
  const bytes = hexToBytes(hex);
  let offset = 0;
  const byteOrder = bytes[offset];
  offset += 1;
  const view = new DataView(bytes.buffer);
  const geomType = view.getUint32(offset, byteOrder === 1);
  offset += 4;
  let _srid;
  if (geomType & 536870912) {
    _srid = view.getUint32(offset, byteOrder === 1);
    offset += 4;
  }
  if ((geomType & 65535) === 1) {
    const x = bytesToFloat64(bytes, offset);
    offset += 8;
    const y = bytesToFloat64(bytes, offset);
    offset += 8;
    return [x, y];
  }
  throw new Error("Unsupported geometry type");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.js
var PgGeometryBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryBuilder";
  constructor(name) {
    super(name, "array", "PgGeometry");
  }
  /** @internal */
  build(table) {
    return new PgGeometry(
      table,
      this.config
    );
  }
};
var PgGeometry = class extends PgColumn {
  static [entityKind] = "PgGeometry";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    return parseEWKB(value);
  }
  mapToDriverValue(value) {
    return `point(${value[0]} ${value[1]})`;
  }
};
var PgGeometryObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryObjectBuilder";
  constructor(name) {
    super(name, "json", "PgGeometryObject");
  }
  /** @internal */
  build(table) {
    return new PgGeometryObject(
      table,
      this.config
    );
  }
};
var PgGeometryObject = class extends PgColumn {
  static [entityKind] = "PgGeometryObject";
  getSQLType() {
    return "geometry(point)";
  }
  mapFromDriverValue(value) {
    const parsed = parseEWKB(value);
    return { x: parsed[0], y: parsed[1] };
  }
  mapToDriverValue(value) {
    return `point(${value.x} ${value.y})`;
  }
};
function geometry(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (!config?.mode || config.mode === "tuple") {
    return new PgGeometryBuilder(name);
  }
  return new PgGeometryObjectBuilder(name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/real.js
var PgRealBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgRealBuilder";
  constructor(name, length) {
    super(name, "number", "PgReal");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new PgReal(table, this.config);
  }
};
var PgReal = class extends PgColumn {
  static [entityKind] = "PgReal";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    return value;
  };
};
function real(name) {
  return new PgRealBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/serial.js
var PgSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSerial(table, this.config);
  }
};
var PgSerial = class extends PgColumn {
  static [entityKind] = "PgSerial";
  getSQLType() {
    return "serial";
  }
};
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/smallint.js
var PgSmallIntBuilder = class extends PgIntColumnBaseBuilder {
  static [entityKind] = "PgSmallIntBuilder";
  constructor(name) {
    super(name, "number", "PgSmallInt");
  }
  /** @internal */
  build(table) {
    return new PgSmallInt(table, this.config);
  }
};
var PgSmallInt = class extends PgColumn {
  static [entityKind] = "PgSmallInt";
  getSQLType() {
    return "smallint";
  }
  mapFromDriverValue = (value) => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };
};
function smallint(name) {
  return new PgSmallIntBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/smallserial.js
var PgSmallSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSmallSerialBuilder";
  constructor(name) {
    super(name, "number", "PgSmallSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  /** @internal */
  build(table) {
    return new PgSmallSerial(
      table,
      this.config
    );
  }
};
var PgSmallSerial = class extends PgColumn {
  static [entityKind] = "PgSmallSerial";
  getSQLType() {
    return "smallserial";
  }
};
function smallserial(name) {
  return new PgSmallSerialBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/text.js
var PgTextBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgTextBuilder";
  constructor(name, config) {
    super(name, "string", "PgText");
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgText(table, this.config);
  }
};
var PgText = class extends PgColumn {
  static [entityKind] = "PgText";
  enumValues = this.config.enumValues;
  getSQLType() {
    return "text";
  }
};
function text(a, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgTextBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/time.js
var PgTimeBuilder = class extends PgDateColumnBaseBuilder {
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTime");
    this.withTimezone = withTimezone;
    this.precision = precision;
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  static [entityKind] = "PgTimeBuilder";
  /** @internal */
  build(table) {
    return new PgTime(table, this.config);
  }
};
var PgTime = class extends PgColumn {
  static [entityKind] = "PgTime";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
};
function time(a, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/timestamp.js
var PgTimestampBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "date", "PgTimestamp");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestamp(table, this.config);
  }
};
var PgTimestamp = class extends PgColumn {
  static [entityKind] = "PgTimestamp";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") return new Date(this.withTimezone ? value : value + "+0000");
    return value;
  }
  mapToDriverValue = (value) => {
    return value.toISOString();
  };
};
var PgTimestampStringBuilder = class extends PgDateColumnBaseBuilder {
  static [entityKind] = "PgTimestampStringBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "string", "PgTimestampString");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  /** @internal */
  build(table) {
    return new PgTimestampString(
      table,
      this.config
    );
  }
};
var PgTimestampString = class extends PgColumn {
  static [entityKind] = "PgTimestampString";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    const precision = this.precision === void 0 ? "" : `(${this.precision})`;
    return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") return value;
    const shortened = value.toISOString().slice(0, -1).replace("T", " ");
    if (this.withTimezone) {
      const offset = value.getTimezoneOffset();
      const sign = offset <= 0 ? "+" : "-";
      return `${shortened}${sign}${Math.floor(Math.abs(offset) / 60).toString().padStart(2, "0")}`;
    }
    return shortened;
  }
};
function timestamp(a, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  if (config?.mode === "string") {
    return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
  }
  return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/uuid.js
var PgUUIDBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgUUIDBuilder";
  constructor(name) {
    super(name, "string", "PgUUID");
  }
  /**
   * Adds `default gen_random_uuid()` to the column definition.
   */
  defaultRandom() {
    return this.default(sql`gen_random_uuid()`);
  }
  /** @internal */
  build(table) {
    return new PgUUID(table, this.config);
  }
};
var PgUUID = class extends PgColumn {
  static [entityKind] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
};
function uuid(name) {
  return new PgUUIDBuilder(name ?? "");
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/varchar.js
var PgVarcharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVarcharBuilder";
  constructor(name, config) {
    super(name, "string", "PgVarchar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  /** @internal */
  build(table) {
    return new PgVarchar(
      table,
      this.config
    );
  }
};
var PgVarchar = class extends PgColumn {
  static [entityKind] = "PgVarchar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
};
function varchar(a, b2 = {}) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgVarcharBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.js
var PgBinaryVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgBinaryVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgBinaryVector(
      table,
      this.config
    );
  }
};
var PgBinaryVector = class extends PgColumn {
  static [entityKind] = "PgBinaryVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `bit(${this.dimensions})`;
  }
};
function bit(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgBinaryVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.js
var PgHalfVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgHalfVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgHalfVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgHalfVector(
      table,
      this.config
    );
  }
};
var PgHalfVector = class extends PgColumn {
  static [entityKind] = "PgHalfVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `halfvec(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
};
function halfvec(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgHalfVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.js
var PgSparseVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgSparseVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgSparseVector(
      table,
      this.config
    );
  }
};
var PgSparseVector = class extends PgColumn {
  static [entityKind] = "PgSparseVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `sparsevec(${this.dimensions})`;
  }
};
function sparsevec(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgSparseVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js
var PgVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVectorBuilder";
  constructor(name, config) {
    super(name, "array", "PgVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgVector(
      table,
      this.config
    );
  }
};
var PgVector = class extends PgColumn {
  static [entityKind] = "PgVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `vector(${this.dimensions})`;
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
  mapFromDriverValue(value) {
    return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
  }
};
function vector(a, b2) {
  const { name, config } = getColumnNameAndConfig(a, b2);
  return new PgVectorBuilder(name, config);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/columns/all.js
function getPgColumnBuilders() {
  return {
    bigint,
    bigserial,
    boolean,
    char,
    cidr,
    customType,
    date,
    doublePrecision,
    inet,
    integer,
    interval,
    json,
    jsonb,
    line,
    macaddr,
    macaddr8,
    numeric,
    point,
    geometry,
    real,
    serial,
    smallint,
    smallserial,
    text,
    time,
    timestamp,
    uuid,
    varchar,
    bit,
    halfvec,
    sparsevec,
    vector
  };
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = /* @__PURE__ */ Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = /* @__PURE__ */ Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
  /** @internal */
  [Table.Symbol.ExtraConfigColumns] = {};
};
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new PgTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const builtColumnsForExtraConfig = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig) {
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return Object.assign(table, {
    enableRLS: () => {
      table[PgTable.Symbol.EnableRLS] = true;
      return table;
    }
  });
}
var pgTable = (name, columns, extraConfig) => {
  return pgTableWithSchema(name, columns, extraConfig, void 0);
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/primary-keys.js
function primaryKey(...config) {
  if (config[0].columns) {
    return new PrimaryKeyBuilder(config[0].columns, config[0].name);
  }
  return new PrimaryKeyBuilder(config);
}
var PrimaryKeyBuilder = class {
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
};
var PrimaryKey = class {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
var gt = (left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values2) {
  if (Array.isArray(values2)) {
    if (values2.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values2.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values2, column)}`;
}
function notInArray(column, values2) {
  if (Array.isArray(values2)) {
    if (values2.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values2.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values2, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/relations.js
var Relation = class {
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
};
var Relations = class {
  constructor(table, config) {
    this.table = table;
    this.config = config;
  }
  static [entityKind] = "Relations";
};
var One = class _One extends Relation {
  constructor(sourceTable, referencedTable, config, isNullable) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
    this.isNullable = isNullable;
  }
  static [entityKind] = "One";
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  constructor(sourceTable, referencedTable, config) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
  }
  static [entityKind] = "Many";
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey2;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey2) {
            tableConfig.primaryKey.push(...primaryKey2);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey: primaryKey2
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function createOne(sourceTable) {
  return function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  };
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}

// ../../lib/db/src/index.ts
var src_exports = {};
__export(src_exports, {
  attempts: () => attempts,
  bundlePackages: () => bundlePackages,
  bundles: () => bundles,
  categories: () => categories,
  diSets: () => diSets,
  generationJobs: () => generationJobs,
  leaderboard: () => leaderboard,
  packageTests: () => packageTests,
  packages: () => packages,
  patterns: () => patterns,
  questions: () => questions,
  reasoningScenarioCache: () => reasoningScenarioCache,
  responses: () => responses,
  sections: () => sections,
  subcategories: () => subcategories,
  testQuestions: () => testQuestions,
  tests: () => tests,
  topics: () => topics,
  topicsGlobal: () => topicsGlobal,
  userBundles: () => userBundles,
  userPackages: () => userPackages,
  userTestEntitlements: () => userTestEntitlements,
  users: () => users
});

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class _SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/indexes.js
var IndexBuilderOn = class {
  constructor(unique3, name) {
    this.unique = unique3;
    this.name = name;
  }
  static [entityKind] = "PgIndexBuilderOn";
  on(...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if (is(it, SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      false,
      this.name
    );
  }
  onOnly(...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if (is(it, SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = it.defaultConfig;
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name
    );
  }
  /**
   * Specify what index method to use. Choices are `btree`, `hash`, `gist`, `spgist`, `gin`, `brin`, or user-installed access methods like `bloom`. The default method is `btree.
   *
   * If you have the `pg_vector` extension installed in your database, you can use the `hnsw` and `ivfflat` options, which are predefined types.
   *
   * **You can always specify any string you want in the method, in case Drizzle doesn't have it natively in its types**
   *
   * @param method The name of the index method to be used
   * @param columns
   * @returns
   */
  using(method, ...columns) {
    return new IndexBuilder(
      columns.map((it) => {
        if (is(it, SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }),
      this.unique,
      true,
      this.name,
      method
    );
  }
};
var IndexBuilder = class {
  static [entityKind] = "PgIndexBuilder";
  /** @internal */
  config;
  constructor(columns, unique3, only, name, method = "btree") {
    this.config = {
      name,
      columns,
      unique: unique3,
      only,
      method
    };
  }
  concurrently() {
    this.config.concurrently = true;
    return this;
  }
  with(obj) {
    this.config.with = obj;
    return this;
  }
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
};
var Index = class {
  static [entityKind] = "PgIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
};
function index(name) {
  return new IndexBuilderOn(false, name);
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache = class {
  static [entityKind] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(casing) {
    this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
  }
  getColumnCasing(column) {
    if (!column.keyAsName) return column.name;
    const schema = column.table[Table.Symbol.Schema] ?? "public";
    const tableName = column.table[Table.Symbol.OriginalName];
    const key = `${schema}.${tableName}.${column.name}`;
    if (!this.cache[key]) {
      this.cacheTable(column.table);
    }
    return this.cache[key];
  }
  cacheTable(table) {
    const schema = table[Table.Symbol.Schema] ?? "public";
    const tableName = table[Table.Symbol.OriginalName];
    const tableKey = `${schema}.${tableName}`;
    if (!this.cachedTables[tableKey]) {
      for (const column of Object.values(table[Table.Symbol.Columns])) {
        const columnKey = `${tableKey}.${column.name}`;
        this.cache[columnKey] = this.convert(column.name);
      }
      this.cachedTables[tableKey] = true;
    }
  }
  clearCache() {
    this.cache = {};
    this.cachedTables = {};
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/view-base.js
var PgViewBase = class extends View {
  static [entityKind] = "PgViewBase";
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/dialect.js
var PgDialect = class {
  static [entityKind] = "PgDialect";
  /** @internal */
  casing;
  constructor(config) {
    this.casing = new CasingCache(config?.casing);
  }
  async migrate(migrations, session, config) {
    const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationsSchema = typeof config === "string" ? "drizzle" : config.migrationsSchema ?? "drizzle";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
    await session.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`);
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(
      sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`
    );
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for await (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(sql.raw(stmt));
          }
          await tx.execute(
            sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
  escapeName(name) {
    return `"${name.replace(/"/g, '""')}"`;
  }
  escapeParam(num) {
    return `$${num + 1}`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length) return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const onUpdateFnResult = col.onUpdateFn?.();
      const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
      const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, from, joins }) {
    const withSql = this.buildWithCTE(withList);
    const tableName = table[PgTable.Symbol.Name];
    const tableSchema = table[PgTable.Symbol.Schema];
    const origTableName = table[PgTable.Symbol.OriginalName];
    const alias = tableName === origTableName ? void 0 : tableName;
    const tableSql = sql`${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}`;
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: !from })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}update ${tableSql} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, PgColumn)) {
                  return sql.identifier(this.casing.getColumnCasing(c));
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        if (isSingleTable) {
          chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
        } else {
          chunk.push(field);
        }
      } else if (is(field, Subquery)) {
        const entries = Object.entries(field._.selectedFields);
        if (entries.length === 1) {
          const entry = entries[0][1];
          const fieldDecoder = is(entry, SQL) ? entry.decoder : is(entry, Column) ? { mapFromDriverValue: (v) => entry.mapFromDriverValue(v) } : entry.sql.decoder;
          if (fieldDecoder) {
            field._.sql.decoder = fieldDecoder;
          }
        }
        chunk.push(field);
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    for (const [index2, joinMeta] of joins.entries()) {
      if (index2 === 0) {
        joinsArray.push(sql` `);
      }
      const table = joinMeta.table;
      const lateralSql = joinMeta.lateral ? sql` lateral` : void 0;
      const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
      if (is(table, PgTable)) {
        const tableName = table[PgTable.Symbol.Name];
        const tableSchema = table[PgTable.Symbol.Schema];
        const origTableName = table[PgTable.Symbol.OriginalName];
        const alias = tableName === origTableName ? void 0 : joinMeta.alias;
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
        );
      } else if (is(table, View)) {
        const viewName = table[ViewBaseConfig].name;
        const viewSchema = table[ViewBaseConfig].schema;
        const origViewName = table[ViewBaseConfig].originalName;
        const alias = viewName === origViewName ? void 0 : joinMeta.alias;
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : void 0}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
        );
      } else {
        joinsArray.push(
          sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table}${onSql}`
        );
      }
      if (index2 < joins.length - 1) {
        joinsArray.push(sql` `);
      }
    }
    return sql.join(joinsArray);
  }
  buildFromTable(table) {
    if (is(table, Table) && table[Table.Symbol.IsAlias]) {
      let fullName = sql`${sql.identifier(table[Table.Symbol.OriginalName])}`;
      if (table[Table.Symbol.Schema]) {
        fullName = sql`${sql.identifier(table[Table.Symbol.Schema])}.${fullName}`;
      }
      return sql`${fullName} ${sql.identifier(table[Table.Symbol.Name])}`;
    }
    return table;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    lockingClause,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, PgViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    let distinctSql;
    if (distinct) {
      distinctSql = distinct === true ? sql` distinct` : sql` distinct on (${sql.join(distinct.on, sql`, `)})`;
    }
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
    }
    let groupBySql;
    if (groupBy && groupBy.length > 0) {
      groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const lockingClauseSql = sql.empty();
    if (lockingClause) {
      const clauseSql = sql` for ${sql.raw(lockingClause.strength)}`;
      if (lockingClause.config.of) {
        clauseSql.append(
          sql` of ${sql.join(
            Array.isArray(lockingClause.config.of) ? lockingClause.config.of : [lockingClause.config.of],
            sql`, `
          )}`
        );
      }
      if (lockingClause.config.noWait) {
        clauseSql.append(sql` nowait`);
      } else if (lockingClause.config.skipLocked) {
        clauseSql.append(sql` skip locked`);
      }
      lockingClauseSql.append(clauseSql);
    }
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`(${leftSelect.getSQL()}) `;
    const rightChunk = sql`(${rightSelect.getSQL()})`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, PgColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, PgColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)} `;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select: select2, overridingSystemValue_ }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(([_, col]) => !col.shouldDisableInsert());
    const insertOrder = colEntries.map(
      ([, column]) => sql.identifier(this.casing.getColumnCasing(column))
    );
    if (select2) {
      const select22 = valuesOrSelect;
      if (is(select22, SQL)) {
        valuesSqlList.push(select22);
      } else {
        valuesSqlList.push(select22.getSQL());
      }
    } else {
      const values2 = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values2.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
            if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
              valueList.push(defaultValue);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              const newValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
              valueList.push(newValue);
            } else {
              valueList.push(sql`default`);
            }
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values2.length - 1) {
          valuesSqlList.push(sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    const overridingSql = overridingSystemValue_ === true ? sql`overriding system value ` : void 0;
    return sql`${withSql}insert into ${table} ${insertOrder} ${overridingSql}${valuesSql}${onConflictSql}${returningSql}`;
  }
  buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
    const concurrentlySql = concurrently ? sql` concurrently` : void 0;
    const withNoDataSql = withNoData ? sql` with no data` : void 0;
    return sql`refresh materialized view${concurrentlySql} ${view}${withNoDataSql}`;
  }
  prepareTyping(encoder) {
    if (is(encoder, PgJsonb) || is(encoder, PgJson)) {
      return "json";
    } else if (is(encoder, PgNumeric)) {
      return "decimal";
    } else if (is(encoder, PgTime)) {
      return "time";
    } else if (is(encoder, PgTimestamp) || is(encoder, PgTimestampString)) {
      return "timestamp";
    } else if (is(encoder, PgDate) || is(encoder, PgDateString)) {
      return "date";
    } else if (is(encoder, PgUUID)) {
      return "uuid";
    } else {
      return "none";
    }
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      prepareTyping: this.prepareTyping,
      invokeSource
    });
  }
  // buildRelationalQueryWithPK({
  // 	fullSchema,
  // 	schema,
  // 	tableNamesMap,
  // 	table,
  // 	tableConfig,
  // 	queryConfig: config,
  // 	tableAlias,
  // 	isRoot = false,
  // 	joinOn,
  // }: {
  // 	fullSchema: Record<string, unknown>;
  // 	schema: TablesRelationalConfig;
  // 	tableNamesMap: Record<string, string>;
  // 	table: PgTable;
  // 	tableConfig: TableRelationalConfig;
  // 	queryConfig: true | DBQueryConfig<'many', true>;
  // 	tableAlias: string;
  // 	isRoot?: boolean;
  // 	joinOn?: SQL;
  // }): BuildRelationalQueryResult<PgTable, PgColumn> {
  // 	// For { "<relation>": true }, return a table with selection of all columns
  // 	if (config === true) {
  // 		const selectionEntries = Object.entries(tableConfig.columns);
  // 		const selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = selectionEntries.map((
  // 			[key, value],
  // 		) => ({
  // 			dbKey: value.name,
  // 			tsKey: key,
  // 			field: value as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection,
  // 		};
  // 	}
  // 	// let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// let selectionForBuild = selection;
  // 	const aliasedColumns = Object.fromEntries(
  // 		Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]),
  // 	);
  // 	const aliasedRelations = Object.fromEntries(
  // 		Object.entries(tableConfig.relations).map(([key, value]) => [key, aliasedRelation(value, tableAlias)]),
  // 	);
  // 	const aliasedFields = Object.assign({}, aliasedColumns, aliasedRelations);
  // 	let where, hasUserDefinedWhere;
  // 	if (config.where) {
  // 		const whereSql = typeof config.where === 'function' ? config.where(aliasedFields, operators) : config.where;
  // 		where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
  // 		hasUserDefinedWhere = !!where;
  // 	}
  // 	where = and(joinOn, where);
  // 	// const fieldsSelection: { tsKey: string; value: PgColumn | SQL.Aliased; isExtra?: boolean }[] = [];
  // 	let joins: Join[] = [];
  // 	let selectedColumns: string[] = [];
  // 	// Figure out which columns to select
  // 	if (config.columns) {
  // 		let isIncludeMode = false;
  // 		for (const [field, value] of Object.entries(config.columns)) {
  // 			if (value === undefined) {
  // 				continue;
  // 			}
  // 			if (field in tableConfig.columns) {
  // 				if (!isIncludeMode && value === true) {
  // 					isIncludeMode = true;
  // 				}
  // 				selectedColumns.push(field);
  // 			}
  // 		}
  // 		if (selectedColumns.length > 0) {
  // 			selectedColumns = isIncludeMode
  // 				? selectedColumns.filter((c) => config.columns?.[c] === true)
  // 				: Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
  // 		}
  // 	} else {
  // 		// Select all columns if selection is not specified
  // 		selectedColumns = Object.keys(tableConfig.columns);
  // 	}
  // 	// for (const field of selectedColumns) {
  // 	// 	const column = tableConfig.columns[field]! as PgColumn;
  // 	// 	fieldsSelection.push({ tsKey: field, value: column });
  // 	// }
  // 	let initiallySelectedRelations: {
  // 		tsKey: string;
  // 		queryConfig: true | DBQueryConfig<'many', false>;
  // 		relation: Relation;
  // 	}[] = [];
  // 	// let selectedRelations: BuildRelationalQueryResult<PgTable, PgColumn>['selection'] = [];
  // 	// Figure out which relations to select
  // 	if (config.with) {
  // 		initiallySelectedRelations = Object.entries(config.with)
  // 			.filter((entry): entry is [typeof entry[0], NonNullable<typeof entry[1]>] => !!entry[1])
  // 			.map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey]! }));
  // 	}
  // 	const manyRelations = initiallySelectedRelations.filter((r) =>
  // 		is(r.relation, Many)
  // 		&& (schema[tableNamesMap[r.relation.referencedTable[Table.Symbol.Name]]!]?.primaryKey.length ?? 0) > 0
  // 	);
  // 	// If this is the last Many relation (or there are no Many relations), we are on the innermost subquery level
  // 	const isInnermostQuery = manyRelations.length < 2;
  // 	const selectedExtras: {
  // 		tsKey: string;
  // 		value: SQL.Aliased;
  // 	}[] = [];
  // 	// Figure out which extras to select
  // 	if (isInnermostQuery && config.extras) {
  // 		const extras = typeof config.extras === 'function'
  // 			? config.extras(aliasedFields, { sql })
  // 			: config.extras;
  // 		for (const [tsKey, value] of Object.entries(extras)) {
  // 			selectedExtras.push({
  // 				tsKey,
  // 				value: mapColumnsInAliasedSQLToAlias(value, tableAlias),
  // 			});
  // 		}
  // 	}
  // 	// Transform `fieldsSelection` into `selection`
  // 	// `fieldsSelection` shouldn't be used after this point
  // 	// for (const { tsKey, value, isExtra } of fieldsSelection) {
  // 	// 	selection.push({
  // 	// 		dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey]!.name,
  // 	// 		tsKey,
  // 	// 		field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
  // 	// 		relationTableTsKey: undefined,
  // 	// 		isJson: false,
  // 	// 		isExtra,
  // 	// 		selection: [],
  // 	// 	});
  // 	// }
  // 	let orderByOrig = typeof config.orderBy === 'function'
  // 		? config.orderBy(aliasedFields, orderByOperators)
  // 		: config.orderBy ?? [];
  // 	if (!Array.isArray(orderByOrig)) {
  // 		orderByOrig = [orderByOrig];
  // 	}
  // 	const orderBy = orderByOrig.map((orderByValue) => {
  // 		if (is(orderByValue, Column)) {
  // 			return aliasedTableColumn(orderByValue, tableAlias) as PgColumn;
  // 		}
  // 		return mapColumnsInSQLToAlias(orderByValue, tableAlias);
  // 	});
  // 	const limit = isInnermostQuery ? config.limit : undefined;
  // 	const offset = isInnermostQuery ? config.offset : undefined;
  // 	// For non-root queries without additional config except columns, return a table with selection
  // 	if (
  // 		!isRoot
  // 		&& initiallySelectedRelations.length === 0
  // 		&& selectedExtras.length === 0
  // 		&& !where
  // 		&& orderBy.length === 0
  // 		&& limit === undefined
  // 		&& offset === undefined
  // 	) {
  // 		return {
  // 			tableTsKey: tableConfig.tsName,
  // 			sql: table,
  // 			selection: selectedColumns.map((key) => ({
  // 				dbKey: tableConfig.columns[key]!.name,
  // 				tsKey: key,
  // 				field: tableConfig.columns[key] as PgColumn,
  // 				relationTableTsKey: undefined,
  // 				isJson: false,
  // 				selection: [],
  // 			})),
  // 		};
  // 	}
  // 	const selectedRelationsWithoutPK:
  // 	// Process all relations without primary keys, because they need to be joined differently and will all be on the same query level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of initiallySelectedRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length > 0) {
  // 			continue;
  // 		}
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithoutPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 			nestedQueryRelation: relation,
  // 		});
  // 		const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier('data')}`.as(selectedRelationTsKey);
  // 		joins.push({
  // 			on: sql`true`,
  // 			table: new Subquery(builtRelation.sql as SQL, {}, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: true,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	const oneRelations = initiallySelectedRelations.filter((r): r is typeof r & { relation: One } =>
  // 		is(r.relation, One)
  // 	);
  // 	// Process all One relations with PKs, because they can all be joined on the same level
  // 	for (
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationConfigValue,
  // 			relation,
  // 		} of oneRelations
  // 	) {
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const relationTable = schema[relationTableTsName]!;
  // 		if (relationTable.primaryKey.length === 0) {
  // 			continue;
  // 		}
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelation = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationConfigValue,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const field = sql`case when ${sql.identifier(relationTableAlias)} is null then null else json_build_array(${
  // 			sql.join(
  // 				builtRelation.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelation.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: is(builtRelation.sql, SQL)
  // 				? new Subquery(builtRelation.sql, {}, relationTableAlias)
  // 				: aliasedTable(builtRelation.sql, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: is(builtRelation.sql, SQL),
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelation.selection,
  // 		});
  // 	}
  // 	let distinct: PgSelectConfig['distinct'];
  // 	let tableFrom: PgTable | Subquery = table;
  // 	// Process first Many relation - each one requires a nested subquery
  // 	const manyRelation = manyRelations[0];
  // 	if (manyRelation) {
  // 		const {
  // 			tsKey: selectedRelationTsKey,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			relation,
  // 		} = manyRelation;
  // 		distinct = {
  // 			on: tableConfig.primaryKey.map((c) => aliasedTableColumn(c as PgColumn, tableAlias)),
  // 		};
  // 		const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
  // 		const relationTableName = relation.referencedTable[Table.Symbol.Name];
  // 		const relationTableTsName = tableNamesMap[relationTableName]!;
  // 		const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
  // 		const joinOn = and(
  // 			...normalizedRelation.fields.map((field, i) =>
  // 				eq(
  // 					aliasedTableColumn(normalizedRelation.references[i]!, relationTableAlias),
  // 					aliasedTableColumn(field, tableAlias),
  // 				)
  // 			),
  // 		);
  // 		const builtRelationJoin = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table: fullSchema[relationTableTsName] as PgTable,
  // 			tableConfig: schema[relationTableTsName]!,
  // 			queryConfig: selectedRelationQueryConfig,
  // 			tableAlias: relationTableAlias,
  // 			joinOn,
  // 		});
  // 		const builtRelationSelectionField = sql`case when ${
  // 			sql.identifier(relationTableAlias)
  // 		} is null then '[]' else json_agg(json_build_array(${
  // 			sql.join(
  // 				builtRelationJoin.selection.map(({ field }) =>
  // 					is(field, SQL.Aliased)
  // 						? sql`${sql.identifier(relationTableAlias)}.${sql.identifier(field.fieldAlias)}`
  // 						: is(field, Column)
  // 						? aliasedTableColumn(field, relationTableAlias)
  // 						: field
  // 				),
  // 				sql`, `,
  // 			)
  // 		})) over (partition by ${sql.join(distinct.on, sql`, `)}) end`.as(selectedRelationTsKey);
  // 		const isLateralJoin = is(builtRelationJoin.sql, SQL);
  // 		joins.push({
  // 			on: isLateralJoin ? sql`true` : joinOn,
  // 			table: isLateralJoin
  // 				? new Subquery(builtRelationJoin.sql as SQL, {}, relationTableAlias)
  // 				: aliasedTable(builtRelationJoin.sql as PgTable, relationTableAlias),
  // 			alias: relationTableAlias,
  // 			joinType: 'left',
  // 			lateral: isLateralJoin,
  // 		});
  // 		// Build the "from" subquery with the remaining Many relations
  // 		const builtTableFrom = this.buildRelationalQueryWithPK({
  // 			fullSchema,
  // 			schema,
  // 			tableNamesMap,
  // 			table,
  // 			tableConfig,
  // 			queryConfig: {
  // 				...config,
  // 				where: undefined,
  // 				orderBy: undefined,
  // 				limit: undefined,
  // 				offset: undefined,
  // 				with: manyRelations.slice(1).reduce<NonNullable<typeof config['with']>>(
  // 					(result, { tsKey, queryConfig: configValue }) => {
  // 						result[tsKey] = configValue;
  // 						return result;
  // 					},
  // 					{},
  // 				),
  // 			},
  // 			tableAlias,
  // 		});
  // 		selectedRelations.push({
  // 			dbKey: selectedRelationTsKey,
  // 			tsKey: selectedRelationTsKey,
  // 			field: builtRelationSelectionField,
  // 			relationTableTsKey: relationTableTsName,
  // 			isJson: true,
  // 			selection: builtRelationJoin.selection,
  // 		});
  // 		// selection = builtTableFrom.selection.map((item) =>
  // 		// 	is(item.field, SQL.Aliased)
  // 		// 		? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 		// 		: item
  // 		// );
  // 		// selectionForBuild = [{
  // 		// 	dbKey: '*',
  // 		// 	tsKey: '*',
  // 		// 	field: sql`${sql.identifier(tableAlias)}.*`,
  // 		// 	selection: [],
  // 		// 	isJson: false,
  // 		// 	relationTableTsKey: undefined,
  // 		// }];
  // 		// const newSelectionItem: (typeof selection)[number] = {
  // 		// 	dbKey: selectedRelationTsKey,
  // 		// 	tsKey: selectedRelationTsKey,
  // 		// 	field,
  // 		// 	relationTableTsKey: relationTableTsName,
  // 		// 	isJson: true,
  // 		// 	selection: builtRelationJoin.selection,
  // 		// };
  // 		// selection.push(newSelectionItem);
  // 		// selectionForBuild.push(newSelectionItem);
  // 		tableFrom = is(builtTableFrom.sql, PgTable)
  // 			? builtTableFrom.sql
  // 			: new Subquery(builtTableFrom.sql, {}, tableAlias);
  // 	}
  // 	if (selectedColumns.length === 0 && selectedRelations.length === 0 && selectedExtras.length === 0) {
  // 		throw new DrizzleError(`No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`);
  // 	}
  // 	let selection: BuildRelationalQueryResult<PgTable, PgColumn>['selection'];
  // 	function prepareSelectedColumns() {
  // 		return selectedColumns.map((key) => ({
  // 			dbKey: tableConfig.columns[key]!.name,
  // 			tsKey: key,
  // 			field: tableConfig.columns[key] as PgColumn,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	function prepareSelectedExtras() {
  // 		return selectedExtras.map((item) => ({
  // 			dbKey: item.value.fieldAlias,
  // 			tsKey: item.tsKey,
  // 			field: item.value,
  // 			relationTableTsKey: undefined,
  // 			isJson: false,
  // 			selection: [],
  // 		}));
  // 	}
  // 	if (isRoot) {
  // 		selection = [
  // 			...prepareSelectedColumns(),
  // 			...prepareSelectedExtras(),
  // 		];
  // 	}
  // 	if (hasUserDefinedWhere || orderBy.length > 0) {
  // 		tableFrom = new Subquery(
  // 			this.buildSelectQuery({
  // 				table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 				fields: {},
  // 				fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 					path: [],
  // 					field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 				})),
  // 				joins,
  // 				distinct,
  // 			}),
  // 			{},
  // 			tableAlias,
  // 		);
  // 		selectionForBuild = selection.map((item) =>
  // 			is(item.field, SQL.Aliased)
  // 				? { ...item, field: sql`${sql.identifier(tableAlias)}.${sql.identifier(item.field.fieldAlias)}` }
  // 				: item
  // 		);
  // 		joins = [];
  // 		distinct = undefined;
  // 	}
  // 	const result = this.buildSelectQuery({
  // 		table: is(tableFrom, PgTable) ? aliasedTable(tableFrom, tableAlias) : tableFrom,
  // 		fields: {},
  // 		fieldsFlat: selectionForBuild.map(({ field }) => ({
  // 			path: [],
  // 			field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field,
  // 		})),
  // 		where,
  // 		limit,
  // 		offset,
  // 		joins,
  // 		orderBy,
  // 		distinct,
  // 	});
  // 	return {
  // 		tableTsKey: tableConfig.tsName,
  // 		sql: result,
  // 		selection,
  // 	};
  // }
  buildRelationalQueryWithoutPK({
    fullSchema,
    schema,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config.where) {
        const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config.with) {
        selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config.extras) {
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config.limit;
      offset = config.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = getTableUniqueName(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQueryWithoutPK({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`${sql.identifier(relationTableAlias)}.${sql.identifier("data")}`.as(selectedRelationTsKey);
        joins.push({
          on: sql`true`,
          table: new Subquery(builtRelation.sql, {}, relationTableAlias),
          alias: relationTableAlias,
          joinType: "left",
          lateral: true
        });
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({ message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")` });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_build_array(${sql.join(
        selection.map(
          ({ field: field2, tsKey, isJson }) => isJson ? sql`${sql.identifier(`${tableAlias}_${tsKey}`)}.${sql.identifier("data")}` : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_agg(${field}${orderBy.length > 0 ? sql` order by ${sql.join(orderBy, sql`, `)}` : void 0}), '[]'::json)`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [{
            path: [],
            field: sql.raw("*")
          }],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = [];
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, PgTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/select.js
var PgSelectBuilder = class {
  static [entityKind] = "PgSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  constructor(config) {
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    if (config.withList) {
      this.withList = config.withList;
    }
    this.distinct = config.distinct;
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  /**
   * Specify the table, subquery, or other target that you're
   * building a select query against.
   *
   * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM | Postgres from documentation}
   */
  from(source) {
    const isPartialSelect = !!this.fields;
    const src = source;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(src, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(src._.selectedFields).map((key) => [key, src[key]])
      );
    } else if (is(src, PgViewBase)) {
      fields = src[ViewBaseConfig].selectedFields;
    } else if (is(src, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(src);
    }
    return new PgSelectBase({
      table: src,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    }).setToken(this.authToken);
  }
};
var PgSelectQueryBuilderBase = class extends TypedQueryBuilder {
  static [entityKind] = "PgSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  cacheConfig = void 0;
  usedTables = /* @__PURE__ */ new Set();
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields,
      config: this.config
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
    for (const item of extractUsedTable(table)) this.usedTables.add(item);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(joinType, lateral) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      for (const item of extractUsedTable(table)) this.usedTables.add(item);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName, lateral });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "cross":
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left", false);
  /**
   * Executes a `left join lateral` operation by adding subquery to the current query.
   *
   * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join-lateral}
   *
   * @param table the subquery to join.
   * @param on the `on` clause.
   */
  leftJoinLateral = this.createJoin("left", true);
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right", false);
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner", false);
  /**
   * Executes an `inner join lateral` operation, creating a new table by combining rows from two queries that have matching values.
   *
   * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join-lateral}
   *
   * @param table the subquery to join.
   * @param on the `on` clause.
   */
  innerJoinLateral = this.createJoin("inner", true);
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full", false);
  /**
   * Executes a `cross join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
   *
   * @param table the table to join.
   *
   * @example
   *
   * ```ts
   * // Select all users, each user with every pet
   * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
   *   .from(users)
   *   .crossJoin(pets)
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .crossJoin(pets)
   * ```
   */
  crossJoin = this.createJoin("cross", false);
  /**
   * Executes a `cross join lateral` operation by combining rows from two queries into a new table.
   *
   * A `lateral` join allows the right-hand expression to refer to columns from the left-hand side.
   *
   * Calling this method retrieves all rows from both main and joined queries, merging all rows from each query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join-lateral}
   *
   * @param table the query to join.
   */
  crossJoinLateral = this.createJoin("cross", true);
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getPgSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/pg-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/pg-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/pg-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `intersect all` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets including all duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect-all}
   *
   * @example
   *
   * ```ts
   * // Select all products and quantities that are ordered by both regular and VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered
   * })
   * .from(regularCustomerOrders)
   * .intersectAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { intersectAll } from 'drizzle-orm/pg-core'
   *
   * await intersectAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  intersectAll = this.createSetOperator("intersect", true);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/pg-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /**
   * Adds `except all` set operator to the query.
   *
   * Calling this method will retrieve all rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except-all}
   *
   * @example
   *
   * ```ts
   * // Select all products that are ordered by regular customers but not by VIP customers
   * await db.select({
   *   productId: regularCustomerOrders.productId,
   *   quantityOrdered: regularCustomerOrders.quantityOrdered,
   * })
   * .from(regularCustomerOrders)
   * .exceptAll(
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered,
   *   })
   *   .from(vipCustomerOrders)
   * );
   * // or
   * import { exceptAll } from 'drizzle-orm/pg-core'
   *
   * await exceptAll(
   *   db.select({
   *     productId: regularCustomerOrders.productId,
   *     quantityOrdered: regularCustomerOrders.quantityOrdered
   *   })
   *   .from(regularCustomerOrders),
   *   db.select({
   *     productId: vipCustomerOrders.productId,
   *     quantityOrdered: vipCustomerOrders.quantityOrdered
   *   })
   *   .from(vipCustomerOrders)
   * );
   * ```
   */
  exceptAll = this.createSetOperator("except", true);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /**
   * Adds a `for` clause to the query.
   *
   * Calling this method will specify a lock strength for this query that controls how strictly it acquires exclusive access to the rows being queried.
   *
   * See docs: {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE}
   *
   * @param strength the lock strength.
   * @param config the lock configuration.
   */
  for(strength, config = {}) {
    this.config.lockingClause = { strength, config };
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    const usedTables = [];
    usedTables.push(...extractUsedTable(this.config.table));
    if (this.config.joins) {
      for (const it of this.config.joins) usedTables.push(...extractUsedTable(it.table));
    }
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
  $withCache(config) {
    this.cacheConfig = config === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config };
    return this;
  }
};
var PgSelectBase = class extends PgSelectQueryBuilderBase {
  static [entityKind] = "PgSelect";
  /** @internal */
  _prepare(name) {
    const { session, config, dialect, joinsNotNullableMap, authToken, cacheConfig, usedTables } = this;
    if (!session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const { fields } = config;
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const fieldsList = orderSelectedFields(fields);
      const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name, true, void 0, {
        type: "select",
        tables: [...usedTables]
      }, cacheConfig);
      query.joinsNotNullableMap = joinsNotNullableMap;
      return query.setToken(authToken);
    });
  }
  /**
   * Create a prepared statement for this query. This allows
   * the database to remember this query for the given session
   * and call it by name, rather than specifying the full query.
   *
   * {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
   */
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
};
applyMixins(PgSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select2) => ({
      type,
      isAll,
      rightSelect: select2
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var getPgSetOperators = () => ({
  union,
  unionAll,
  intersect,
  intersectAll,
  except,
  exceptAll
});
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var intersectAll = createSetOperator("intersect", true);
var except = createSetOperator("except", false);
var exceptAll = createSetOperator("except", true);

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/query-builder.js
var QueryBuilder = class {
  static [entityKind] = "PgQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, PgDialect) ? dialect : void 0;
    this.dialectConfig = is(dialect, PgDialect) ? void 0 : dialect;
  }
  $with = (alias, selection) => {
    const queryBuilder = this;
    const as = (qb) => {
      if (typeof qb === "function") {
        qb = qb(queryBuilder);
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as };
  };
  with(...queries) {
    const self = this;
    function select2(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        distinct: { on }
      });
    }
    return { select: select2, selectDistinct, selectDistinctOn };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect()
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: { on }
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new PgDialect(this.dialectConfig);
    }
    return this.dialect;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/utils.js
function extractUsedTable(table) {
  if (is(table, PgTable)) {
    return [table[Schema] ? `${table[Schema]}.${table[Table.Symbol.BaseName]}` : table[Table.Symbol.BaseName]];
  }
  if (is(table, Subquery)) {
    return table._.usedTables ?? [];
  }
  if (is(table, SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/delete.js
var PgDeleteBase = class extends QueryPromise {
  constructor(table, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, withList };
  }
  static [entityKind] = "PgDelete";
  config;
  cacheConfig;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * await db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
        type: "delete",
        tables: extractUsedTable(this.config.table)
      }, this.cacheConfig);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/insert.js
var PgInsertBuilder = class {
  constructor(table, session, dialect, withList, overridingSystemValue_) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.overridingSystemValue_ = overridingSystemValue_;
  }
  static [entityKind] = "PgInsertBuilder";
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  overridingSystemValue() {
    this.overridingSystemValue_ = true;
    return this;
  }
  values(values2) {
    values2 = Array.isArray(values2) ? values2 : [values2];
    if (values2.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values2.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new PgInsertBase(
      this.table,
      mappedValues,
      this.session,
      this.dialect,
      this.withList,
      false,
      this.overridingSystemValue_
    ).setToken(this.authToken);
  }
  select(selectQuery) {
    const select2 = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select2, SQL) && !haveSameKeys(this.table[Columns], select2._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new PgInsertBase(this.table, select2, this.session, this.dialect, this.withList, true);
  }
};
var PgInsertBase = class extends QueryPromise {
  constructor(table, values2, session, dialect, withList, select2, overridingSystemValue_) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values: values2, withList, select: select2, overridingSystemValue_ };
  }
  static [entityKind] = "PgInsert";
  config;
  cacheConfig;
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config = {}) {
    if (config.target === void 0) {
      this.config.onConflict = sql`do nothing`;
    } else {
      let targetColumn = "";
      targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
      const whereSql = config.where ? sql` where ${config.where}` : void 0;
      this.config.onConflict = sql`(${sql.raw(targetColumn)})${whereSql} do nothing`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     targetWhere: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config) {
    if (config.where && (config.targetWhere || config.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    const whereSql = config.where ? sql` where ${config.where}` : void 0;
    const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
    const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
    let targetColumn = "";
    targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(this.dialect.casing.getColumnCasing(it))).join(",") : this.dialect.escapeName(this.dialect.casing.getColumnCasing(config.target));
    this.config.onConflict = sql`(${sql.raw(targetColumn)})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
        type: "insert",
        tables: extractUsedTable(this.config.table)
      }, this.cacheConfig);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.js
var PgRefreshMaterializedView = class extends QueryPromise {
  constructor(view, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { view };
  }
  static [entityKind] = "PgRefreshMaterializedView";
  config;
  concurrently() {
    if (this.config.withNoData !== void 0) {
      throw new Error("Cannot use concurrently and withNoData together");
    }
    this.config.concurrently = true;
    return this;
  }
  withNoData() {
    if (this.config.concurrently !== void 0) {
      throw new Error("Cannot use concurrently and withNoData together");
    }
    this.config.withNoData = true;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRefreshMaterializedViewQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues, this.authToken);
    });
  };
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/update.js
var PgUpdateBuilder = class {
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "PgUpdateBuilder";
  authToken;
  setToken(token) {
    this.authToken = token;
    return this;
  }
  set(values2) {
    return new PgUpdateBase(
      this.table,
      mapUpdateSet(this.table, values2),
      this.session,
      this.dialect,
      this.withList
    ).setToken(this.authToken);
  }
};
var PgUpdateBase = class extends QueryPromise {
  constructor(table, set, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table, withList, joins: [] };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  static [entityKind] = "PgUpdate";
  config;
  tableName;
  joinsNotNullableMap;
  cacheConfig;
  from(source) {
    const src = source;
    const tableName = getTableLikeName(src);
    if (typeof tableName === "string") {
      this.joinsNotNullableMap[tableName] = true;
    }
    this.config.from = src;
    return this;
  }
  getTableLikeFields(table) {
    if (is(table, PgTable)) {
      return table[Table.Symbol.Columns];
    } else if (is(table, Subquery)) {
      return table._.selectedFields;
    }
    return table[ViewBaseConfig].selectedFields;
  }
  createJoin(joinType) {
    return (table, on) => {
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (typeof on === "function") {
        const from = this.config.from && !is(this.config.from, SQL) ? this.getTableLikeFields(this.config.from) : void 0;
        on = on(
          new Proxy(
            this.config.table[Table.Symbol.Columns],
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          from && new Proxy(
            from,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * await db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * await db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * await db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * await db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields) {
    if (!fields) {
      fields = Object.assign({}, this.config.table[Table.Symbol.Columns]);
      if (this.config.from) {
        const tableName = getTableLikeName(this.config.from);
        if (typeof tableName === "string" && this.config.from && !is(this.config.from, SQL)) {
          const fromFields = this.getTableLikeFields(this.config.from);
          fields[tableName] = fromFields;
        }
        for (const join of this.config.joins) {
          const tableName2 = getTableLikeName(join.table);
          if (typeof tableName2 === "string" && !is(join.table, SQL)) {
            const fromFields = this.getTableLikeFields(join.table);
            fields[tableName2] = fromFields;
          }
        }
      }
    }
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(name) {
    const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
      type: "insert",
      tables: extractUsedTable(this.config.table)
    }, this.cacheConfig);
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  prepare(name) {
    return this._prepare(name);
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute = (placeholderValues) => {
    return this._prepare().execute(placeholderValues, this.authToken);
  };
  /** @internal */
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(
      this.config.returningFields,
      new SelectionProxyHandler({
        alias: getTableName(this.config.table),
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      })
    ) : void 0;
  }
  $dynamic() {
    return this;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/count.js
var PgCountBuilder = class _PgCountBuilder extends SQL {
  constructor(params) {
    super(_PgCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.mapWith(Number);
    this.session = params.session;
    this.sql = _PgCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  token;
  static [entityKind] = "PgCountBuilder";
  [Symbol.toStringTag] = "PgCountBuilder";
  session;
  static buildEmbeddedCount(source, filters) {
    return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return sql`select count(*) as count from ${source}${sql.raw(" where ").if(filters)}${filters};`;
  }
  /** @intrnal */
  setToken(token) {
    this.token = token;
    return this;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql, this.token)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/query.js
var RelationalQueryBuilder = class {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  static [entityKind] = "PgRelationalQueryBuilder";
  findMany(config) {
    return new PgRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    );
  }
  findFirst(config) {
    return new PgRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
var PgRelationalQuery = class extends QueryPromise {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
  }
  static [entityKind] = "PgRelationalQuery";
  /** @internal */
  _prepare(name) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const { query, builtQuery } = this._toSQL();
      return this.session.prepareQuery(
        builtQuery,
        void 0,
        name,
        true,
        (rawRows, mapColumnValue) => {
          const rows = rawRows.map(
            (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
          );
          if (this.mode === "first") {
            return rows[0];
          }
          return rows;
        }
      );
    });
  }
  prepare(name) {
    return this._prepare(name);
  }
  _getQuery() {
    return this.dialect.buildRelationalQueryWithoutPK({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
  }
  /** @internal */
  getSQL() {
    return this._getQuery().sql;
  }
  _toSQL() {
    const query = this._getQuery();
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  authToken;
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  execute() {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(void 0, this.authToken);
    });
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/query-builders/raw.js
var PgRaw = class extends QueryPromise {
  constructor(execute, sql2, query, mapBatchResult) {
    super();
    this.execute = execute;
    this.sql = sql2;
    this.query = query;
    this.mapBatchResult = mapBatchResult;
  }
  static [entityKind] = "PgRaw";
  /** @internal */
  getSQL() {
    return this.sql;
  }
  getQuery() {
    return this.query;
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/db.js
var PgDatabase = class {
  constructor(dialect, session, schema) {
    this.dialect = dialect;
    this.session = session;
    this._ = schema ? {
      schema: schema.schema,
      fullSchema: schema.fullSchema,
      tableNamesMap: schema.tableNamesMap,
      session
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {},
      session
    };
    this.query = {};
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        this.query[tableName] = new RelationalQueryBuilder(
          schema.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema.fullSchema[tableName],
          columns,
          dialect,
          session
        );
      }
    }
    this.$cache = { invalidate: async (_params) => {
    } };
  }
  static [entityKind] = "PgDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with = (alias, selection) => {
    const self = this;
    const as = (qb) => {
      if (typeof qb === "function") {
        qb = qb(new QueryBuilder(self.dialect));
      }
      return new Proxy(
        new WithSubquery(
          qb.getSQL(),
          selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
          alias,
          true
        ),
        new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      );
    };
    return { as };
  };
  $count(source, filters) {
    return new PgCountBuilder({ source, filters, session: this.session });
  }
  $cache;
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select2(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: { on }
      });
    }
    function update(table) {
      return new PgUpdateBuilder(table, self.session, self.dialect, queries);
    }
    function insert(table) {
      return new PgInsertBuilder(table, self.session, self.dialect, queries);
    }
    function delete_(table) {
      return new PgDeleteBase(table, self.session, self.dialect, queries);
    }
    return { select: select2, selectDistinct, selectDistinctOn, update, insert, delete: delete_ };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: { on }
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table) {
    return new PgUpdateBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(table) {
    return new PgInsertBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(table) {
    return new PgDeleteBase(table, this.session, this.dialect);
  }
  refreshMaterializedView(view) {
    return new PgRefreshMaterializedView(view, this.session, this.dialect);
  }
  authToken;
  execute(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    const builtQuery = this.dialect.sqlToQuery(sequel);
    const prepared = this.session.prepareQuery(
      builtQuery,
      void 0,
      void 0,
      false
    );
    return new PgRaw(
      () => prepared.execute(void 0, this.authToken),
      sequel,
      builtQuery,
      (result) => prepared.mapResult(result, true)
    );
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/cache/core/cache.js
var Cache = class {
  static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
  strategy() {
    return "all";
  }
  static [entityKind] = "NoopCache";
  async get(_key) {
    return void 0;
  }
  async put(_hashedQuery, _response, _tables, _config) {
  }
  async onMutate(_params) {
  }
};
async function hashQuery(sql2, params) {
  const dataToHash = `${sql2}-${JSON.stringify(params)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map((b2) => b2.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/pg-core/session.js
var PgPreparedQuery = class {
  constructor(query, cache, queryMetadata, cacheConfig) {
    this.query = query;
    this.cache = cache;
    this.queryMetadata = queryMetadata;
    this.cacheConfig = cacheConfig;
    if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
      this.cacheConfig = { enable: true, autoInvalidate: true };
    }
    if (!this.cacheConfig?.enable) {
      this.cacheConfig = void 0;
    }
  }
  authToken;
  getQuery() {
    return this.query;
  }
  mapResult(response, _isFromBatch) {
    return response;
  }
  /** @internal */
  setToken(token) {
    this.authToken = token;
    return this;
  }
  static [entityKind] = "PgPreparedQuery";
  /** @internal */
  joinsNotNullableMap;
  /** @internal */
  async queryWithCache(queryString, params, query) {
    if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.cacheConfig && !this.cacheConfig.enable) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
      try {
        const [res] = await Promise.all([
          query(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return res;
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (!this.cacheConfig) {
      try {
        return await query();
      } catch (e) {
        throw new DrizzleQueryError(queryString, params, e);
      }
    }
    if (this.queryMetadata.type === "select") {
      const fromCache = await this.cache.get(
        this.cacheConfig.tag ?? await hashQuery(queryString, params),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (fromCache === void 0) {
        let result;
        try {
          result = await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
        await this.cache.put(
          this.cacheConfig.tag ?? await hashQuery(queryString, params),
          result,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        );
        return result;
      }
      return fromCache;
    }
    try {
      return await query();
    } catch (e) {
      throw new DrizzleQueryError(queryString, params, e);
    }
  }
};
var PgSession = class {
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "PgSession";
  /** @internal */
  execute(query, token) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      const prepared = tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.prepareQuery(
          this.dialect.sqlToQuery(query),
          void 0,
          void 0,
          false
        );
      });
      return prepared.setToken(token).execute(void 0, token);
    });
  }
  all(query) {
    return this.prepareQuery(
      this.dialect.sqlToQuery(query),
      void 0,
      void 0,
      false
    ).all();
  }
  /** @internal */
  async count(sql2, token) {
    const res = await this.execute(sql2, token);
    return Number(
      res[0]["count"]
    );
  }
};
var PgTransaction = class extends PgDatabase {
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "PgTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
  /** @internal */
  getTransactionConfigSQL(config) {
    const chunks = [];
    if (config.isolationLevel) {
      chunks.push(`isolation level ${config.isolationLevel}`);
    }
    if (config.accessMode) {
      chunks.push(config.accessMode);
    }
    if (typeof config.deferrable === "boolean") {
      chunks.push(config.deferrable ? "deferrable" : "not deferrable");
    }
    return sql.raw(chunks.join(" "));
  }
  setTransaction(config) {
    return this.session.execute(sql`set transaction ${this.getTransactionConfigSQL(config)}`);
  }
};

// ../../lib/db/src/index.ts
var sections = pgTable("sections", {
  id: text("id").primaryKey(),
  // uuid, set by application
  name: text("name").notNull().unique()
});
var topics = pgTable("topics", {
  id: text("id").primaryKey(),
  // uuid, set by application
  name: text("name").notNull().unique()
});
var topicsGlobal = pgTable("topics_global", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique()
});
var users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").$type().notNull().default("student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  testsCount: integer("tests_count").notNull().default(0)
});
var bundles = pgTable("bundles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: text("category_id").notNull(),
  price: integer("price").notNull().default(0),
  // Price in cents
  originalPrice: integer("original_price"),
  testsCount: integer("tests_count").notNull().default(0),
  features: jsonb("features").notNull(),
  // Array of features like ["Detailed Solutions", "Performance Analytics", etc.]
  isPopular: integer("is_popular").notNull().default(0),
  // 0 = false, 1 = true
  order: integer("order").notNull().default(0),
  // Display order
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var bundlePackages = pgTable(
  "bundle_packages",
  {
    id: text("id").primaryKey(),
    bundleId: text("bundle_id").notNull().references(() => bundles.id, { onDelete: "cascade" }),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" })
  },
  (t) => ({
    uniqueBundlePackage: unique({ columns: [t.bundleId, t.packageId] })
  })
);
var subcategories = pgTable("subcategories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  /** Languages available for exams in this subcategory, e.g. ["en"], ["en","hi"], ["en","pa"] */
  languages: jsonb("languages")
});
var tests = pgTable("tests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  categoryId: text("category_id").notNull(),
  subcategoryId: text("subcategory_id").notNull().default(""),
  subcategoryName: text("subcategory_name").notNull().default(""),
  access: text("access").$type().notNull().default("free"),
  kind: text("kind").$type().notNull().default("full-length"),
  duration: integer("duration").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  attempts: integer("attempts").notNull().default(0),
  avgScore: integer("avg_score").notNull().default(0),
  difficulty: text("difficulty").$type().notNull(),
  sectionTimingMode: text("section_timing_mode").$type(),
  sectionTimings: jsonb("section_timings"),
  sectionSettings: jsonb("section_settings"),
  sections: jsonb("sections").notNull(),
  /** Languages available for this test, e.g. ["en"], ["en","hi"], ["en","pa"] */
  languages: jsonb("languages"),
  /** Amount in smallest currency unit (paise for INR, cents for USD, etc.) */
  priceCents: integer("price_cents"),
  /** Whether this test is freely accessible without purchase */
  isFree: integer("is_free").notNull().default(0),
  /** For topic-wise tests: FK to the master topics table */
  topicId: text("topic_id"),
  /** For topic-wise tests: resolved topic name (denormalized for quick reads) */
  topicName: text("topic_name"),
  /** Marks awarded for each correct answer (test-level default; question-level override takes precedence) */
  marksPerQuestion: doublePrecision("marks_per_question").default(1),
  /** Marks deducted for each wrong answer (non-negative value, e.g. 0.25 means minus 0.25) */
  negativeMarks: doublePrecision("negative_marks").default(0),
  /** Marks for unattempted questions (usually 0) */
  unattemptedMarks: doublePrecision("unattempted_marks").default(0)
});
var diSets = pgTable("di_sets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var userTestEntitlements = pgTable(
  "user_test_entitlements",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    testId: text("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
    source: text("source").$type().notNull().default("razorpay"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.testId] })
  })
);
var questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  clientId: text("client_id").notNull().default(""),
  testId: text("test_id").notNull(),
  /** Primary question text (English). Nullable — multilingual questions may only have textPa or textHi. */
  text: text("text"),
  options: jsonb("options").notNull(),
  correct: integer("correct").notNull(),
  section: text("section").notNull(),
  topic: text("topic").notNull().default("General"),
  /** FK to sections master table — nullable so existing rows are unaffected */
  sectionId: text("section_id").references(() => sections.id, { onDelete: "set null" }),
  /** FK to topics master table — nullable so existing rows are unaffected */
  topicId: text("topic_id").references(() => topics.id, { onDelete: "set null" }),
  /** FK to topics_global — preferred over topicId for new data; nullable for backward compat */
  globalTopicId: text("global_topic_id").references(() => topicsGlobal.id, { onDelete: "set null" }),
  /** English explanation. Nullable when question is non-English only. */
  explanation: text("explanation"),
  /** Difficulty level for smart question selection */
  difficulty: text("difficulty").$type(),
  // Translation columns — nullable; null means no translation available for that language
  textHi: text("text_hi"),
  optionsHi: jsonb("options_hi"),
  explanationHi: text("explanation_hi"),
  textPa: text("text_pa"),
  optionsPa: jsonb("options_pa"),
  explanationPa: text("explanation_pa"),
  seatingDiagram: jsonb("seating_diagram"),
  seatingExplanationFlow: jsonb("seating_explanation_flow"),
  /** Optional image URL (Firebase Storage) to display above question text */
  imageUrl: text("image_url"),
  /** Question type: 'text' | 'image' | 'di' */
  questionType: text("question_type").$type().notNull().default("text"),
  /** FK to di_sets — populated for DI/Data-Interpretation questions */
  diSetId: integer("di_set_id").references(() => diSets.id, { onDelete: "set null" }),
  /** Optional per-question marks override (null = use test-level default) */
  marks: doublePrecision("marks"),
  /** Optional per-question negative marks override (null = use test-level default) */
  negativeMarks: doublePrecision("negative_marks"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var attempts = pgTable(
  "attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    testId: text("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
    testName: text("test_name").notNull(),
    category: text("category").notNull(),
    score: real("score").notNull(),
    correct: integer("correct").notNull(),
    wrong: integer("wrong").notNull(),
    unanswered: integer("unanswered").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    timeSpent: integer("time_spent").notNull(),
    /** Legacy date column (date-only). Kept for backward-compat with older DB rows. */
    date: date("date"),
    /** "REAL" | "PRACTICE" — null means legacy row, treated as REAL */
    attemptType: text("attempt_type").$type(),
    sectionStats: jsonb("section_stats"),
    sectionTimeSpent: jsonb("section_time_spent"),
    questionReview: jsonb("question_review"),
    /** Marks-based score: sum of +marksPerQuestion for correct and -negativeMarks for wrong */
    actualScore: doublePrecision("actual_score"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    userIdIdx: index("attempts_user_id_idx").on(t.userId),
    testIdIdx: index("attempts_test_id_idx").on(t.testId),
    // Composite index for leaderboard queries: filter by test, order by score
    testIdScoreIdx: index("attempts_test_id_score_idx").on(t.testId, t.score)
  })
);
var packages = pgTable("packages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  originalPriceCents: integer("original_price_cents").notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  finalPriceCents: integer("final_price_cents").notNull(),
  testCount: integer("test_count").notNull().default(0),
  features: jsonb("features"),
  isPopular: integer("is_popular").notNull().default(0),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var packageTests = pgTable(
  "package_tests",
  {
    id: text("id").primaryKey(),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    testId: text("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
    isFree: integer("is_free").notNull().default(0)
  },
  (t) => ({
    uniquePackageTest: unique({ columns: [t.packageId, t.testId] })
  })
);
var userPackages = pgTable(
  "user_packages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    uniqueUserPackage: unique({ columns: [t.userId, t.packageId] })
  })
);
var userBundles = pgTable(
  "user_bundles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    bundleId: text("bundle_id").notNull().references(() => bundles.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    uniqueUserBundle: unique({ columns: [t.userId, t.bundleId] })
  })
);
var responses = pgTable(
  "responses",
  {
    id: serial("id").primaryKey(),
    attemptId: text("attempt_id").notNull().references(() => attempts.id, { onDelete: "cascade" }),
    questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
    selectedOption: integer("selected_option"),
    timeTaken: integer("time_taken").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    uniqueAttemptQuestion: unique().on(t.attemptId, t.questionId),
    attemptIdIdx: index("responses_attempt_id_idx").on(t.attemptId),
    questionIdIdx: index("responses_question_id_idx").on(t.questionId)
  })
);
var testQuestions = pgTable(
  "test_questions",
  {
    id: serial("id").primaryKey(),
    testId: text("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
    questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow()
  },
  (t) => ({
    uniqueTestQuestion: unique().on(t.testId, t.questionId),
    questionIdIdx: index("test_questions_question_id_idx").on(t.questionId),
    testIdIdx: index("test_questions_test_id_idx").on(t.testId)
  })
);
var leaderboard = pgTable(
  "leaderboard",
  {
    testId: text("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    userName: text("user_name").notNull(),
    score: real("score").notNull(),
    rank: integer("rank").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.testId, t.userId] }),
    testIdRankIdx: index("leaderboard_test_id_rank_idx").on(t.testId, t.rank)
  })
);
var patterns = pgTable("patterns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  section: text("section").notNull(),
  topic: text("topic").notNull(),
  subtopic: text("subtopic").notNull(),
  type: text("type").$type().notNull().default("formula"),
  difficulty: text("difficulty").$type(),
  templateVariants: jsonb("template_variants").notNull(),
  formula: text("formula"),
  variables: jsonb("variables").notNull(),
  diPattern: jsonb("di_pattern"),
  distractorStrategy: jsonb(
    "distractor_strategy"
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  explanationTemplate: text(
    "explanation_template"
  )
});
var generationJobs = pgTable(
  "generation_jobs",
  {
    id: text("id").primaryKey(),
    status: text("status").$type().notNull().default("queued"),
    patternId: text("pattern_id"),
    patternSnapshot: jsonb(
      "pattern_snapshot"
    ).notNull(),
    requestPayload: jsonb(
      "request_payload"
    ).notNull(),
    resultPayload: jsonb(
      "result_payload"
    ),
    generationMetadata: jsonb(
      "generation_metadata"
    ),
    errorMessage: text(
      "error_message"
    ),
    queuedAt: timestamp(
      "queued_at"
    ).notNull().defaultNow(),
    startedAt: timestamp(
      "started_at"
    ),
    completedAt: timestamp(
      "completed_at"
    ),
    updatedAt: timestamp(
      "updated_at"
    ).notNull().defaultNow()
  },
  (t) => ({
    statusQueuedAtIdx: index(
      "generation_jobs_status_queued_at_idx"
    ).on(t.status, t.queuedAt)
  })
);
var reasoningScenarioCache = pgTable(
  "reasoning_scenario_cache",
  {
    key: text("key").primaryKey(),
    patternId: text("pattern_id"),
    generationDomain: text("generation_domain"),
    generatorVersion: text(
      "generator_version"
    ).notNull(),
    motifVersion: text(
      "motif_version"
    ).notNull(),
    topologyVersion: text(
      "topology_version"
    ).notNull(),
    requestFingerprint: text(
      "request_fingerprint"
    ).notNull(),
    payload: jsonb("payload").notNull(),
    artifactMetadata: jsonb(
      "artifact_metadata"
    ),
    createdAt: timestamp(
      "created_at"
    ).notNull().defaultNow(),
    lastAccessedAt: timestamp(
      "last_accessed_at"
    ).notNull().defaultNow(),
    hitCount: integer("hit_count").notNull().default(0)
  },
  (t) => ({
    patternIdIdx: index(
      "reasoning_scenario_cache_pattern_id_idx"
    ).on(t.patternId),
    domainPatternIdx: index(
      "reasoning_scenario_cache_domain_pattern_idx"
    ).on(
      t.generationDomain,
      t.patternId
    )
  })
);

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/index.js
import os from "os";
import fs from "fs";

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/query.js
var originCache = /* @__PURE__ */ new Map();
var originStackCache = /* @__PURE__ */ new Map();
var originError = /* @__PURE__ */ Symbol("OriginError");
var CLOSE = {};
var Query = class extends Promise {
  constructor(strings, args, handler, canceller, options = {}) {
    let resolve, reject;
    super((a, b2) => {
      resolve = a;
      reject = b2;
    });
    this.tagged = Array.isArray(strings.raw);
    this.strings = strings;
    this.args = args;
    this.handler = handler;
    this.canceller = canceller;
    this.options = options;
    this.state = null;
    this.statement = null;
    this.resolve = (x) => (this.active = false, resolve(x));
    this.reject = (x) => (this.active = false, reject(x));
    this.active = false;
    this.cancelled = null;
    this.executed = false;
    this.signature = "";
    this[originError] = this.handler.debug ? new Error() : this.tagged && cachedError(this.strings);
  }
  get origin() {
    return (this.handler.debug ? this[originError].stack : this.tagged && originStackCache.has(this.strings) ? originStackCache.get(this.strings) : originStackCache.set(this.strings, this[originError].stack).get(this.strings)) || "";
  }
  static get [Symbol.species]() {
    return Promise;
  }
  cancel() {
    return this.canceller && (this.canceller(this), this.canceller = null);
  }
  simple() {
    this.options.simple = true;
    this.options.prepare = false;
    return this;
  }
  async readable() {
    this.simple();
    this.streaming = true;
    return this;
  }
  async writable() {
    this.simple();
    this.streaming = true;
    return this;
  }
  cursor(rows = 1, fn) {
    this.options.simple = false;
    if (typeof rows === "function") {
      fn = rows;
      rows = 1;
    }
    this.cursorRows = rows;
    if (typeof fn === "function")
      return this.cursorFn = fn, this;
    let prev;
    return {
      [Symbol.asyncIterator]: () => ({
        next: () => {
          if (this.executed && !this.active)
            return { done: true };
          prev && prev();
          const promise = new Promise((resolve, reject) => {
            this.cursorFn = (value) => {
              resolve({ value, done: false });
              return new Promise((r) => prev = r);
            };
            this.resolve = () => (this.active = false, resolve({ done: true }));
            this.reject = (x) => (this.active = false, reject(x));
          });
          this.execute();
          return promise;
        },
        return() {
          prev && prev(CLOSE);
          return { done: true };
        }
      })
    };
  }
  describe() {
    this.options.simple = false;
    this.onlyDescribe = this.options.prepare = true;
    return this;
  }
  stream() {
    throw new Error(".stream has been renamed to .forEach");
  }
  forEach(fn) {
    this.forEachFn = fn;
    this.handle();
    return this;
  }
  raw() {
    this.isRaw = true;
    return this;
  }
  values() {
    this.isRaw = "values";
    return this;
  }
  async handle() {
    !this.executed && (this.executed = true) && await 1 && this.handler(this);
  }
  execute() {
    this.handle();
    return this;
  }
  then() {
    this.handle();
    return super.then.apply(this, arguments);
  }
  catch() {
    this.handle();
    return super.catch.apply(this, arguments);
  }
  finally() {
    this.handle();
    return super.finally.apply(this, arguments);
  }
};
function cachedError(xs) {
  if (originCache.has(xs))
    return originCache.get(xs);
  const x = Error.stackTraceLimit;
  Error.stackTraceLimit = 4;
  originCache.set(xs, new Error());
  Error.stackTraceLimit = x;
  return originCache.get(xs);
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/errors.js
var PostgresError = class extends Error {
  constructor(x) {
    super(x.message);
    this.name = this.constructor.name;
    Object.assign(this, x);
  }
};
var Errors = {
  connection,
  postgres,
  generic,
  notSupported
};
function connection(x, options, socket) {
  const { host, port } = socket || options;
  const error = Object.assign(
    new Error("write " + x + " " + (options.path || host + ":" + port)),
    {
      code: x,
      errno: x,
      address: options.path || host
    },
    options.path ? {} : { port }
  );
  Error.captureStackTrace(error, connection);
  return error;
}
function postgres(x) {
  const error = new PostgresError(x);
  Error.captureStackTrace(error, postgres);
  return error;
}
function generic(code, message) {
  const error = Object.assign(new Error(code + ": " + message), { code });
  Error.captureStackTrace(error, generic);
  return error;
}
function notSupported(x) {
  const error = Object.assign(
    new Error(x + " (B) is not supported"),
    {
      code: "MESSAGE_NOT_SUPPORTED",
      name: x
    }
  );
  Error.captureStackTrace(error, notSupported);
  return error;
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/types.js
var types = {
  string: {
    to: 25,
    from: null,
    // defaults to string
    serialize: (x) => "" + x
  },
  number: {
    to: 0,
    from: [21, 23, 26, 700, 701],
    serialize: (x) => "" + x,
    parse: (x) => +x
  },
  json: {
    to: 114,
    from: [114, 3802],
    serialize: (x) => JSON.stringify(x),
    parse: (x) => JSON.parse(x)
  },
  boolean: {
    to: 16,
    from: 16,
    serialize: (x) => x === true ? "t" : "f",
    parse: (x) => x === "t"
  },
  date: {
    to: 1184,
    from: [1082, 1114, 1184],
    serialize: (x) => (x instanceof Date ? x : new Date(x)).toISOString(),
    parse: (x) => new Date(x)
  },
  bytea: {
    to: 17,
    from: 17,
    serialize: (x) => "\\x" + Buffer.from(x).toString("hex"),
    parse: (x) => Buffer.from(x.slice(2), "hex")
  }
};
var NotTagged = class {
  then() {
    notTagged();
  }
  catch() {
    notTagged();
  }
  finally() {
    notTagged();
  }
};
var Identifier = class extends NotTagged {
  constructor(value) {
    super();
    this.value = escapeIdentifier(value);
  }
};
var Parameter = class extends NotTagged {
  constructor(value, type, array) {
    super();
    this.value = value;
    this.type = type;
    this.array = array;
  }
};
var Builder = class extends NotTagged {
  constructor(first, rest) {
    super();
    this.first = first;
    this.rest = rest;
  }
  build(before, parameters, types2, options) {
    const keyword = builders.map(([x, fn]) => ({ fn, i: before.search(x) })).sort((a, b2) => a.i - b2.i).pop();
    return keyword.i === -1 ? escapeIdentifiers(this.first, options) : keyword.fn(this.first, this.rest, parameters, types2, options);
  }
};
function handleValue(x, parameters, types2, options) {
  let value = x instanceof Parameter ? x.value : x;
  if (value === void 0) {
    x instanceof Parameter ? x.value = options.transform.undefined : value = x = options.transform.undefined;
    if (value === void 0)
      throw Errors.generic("UNDEFINED_VALUE", "Undefined values are not allowed");
  }
  return "$" + types2.push(
    x instanceof Parameter ? (parameters.push(x.value), x.array ? x.array[x.type || inferType(x.value)] || x.type || firstIsString(x.value) : x.type) : (parameters.push(x), inferType(x))
  );
}
var defaultHandlers = typeHandlers(types);
function stringify(q, string, value, parameters, types2, options) {
  for (let i = 1; i < q.strings.length; i++) {
    string += stringifyValue(string, value, parameters, types2, options) + q.strings[i];
    value = q.args[i];
  }
  return string;
}
function stringifyValue(string, value, parameters, types2, o) {
  return value instanceof Builder ? value.build(string, parameters, types2, o) : value instanceof Query ? fragment(value, parameters, types2, o) : value instanceof Identifier ? value.value : value && value[0] instanceof Query ? value.reduce((acc, x) => acc + " " + fragment(x, parameters, types2, o), "") : handleValue(value, parameters, types2, o);
}
function fragment(q, parameters, types2, options) {
  q.fragment = true;
  return stringify(q, q.strings[0], q.args[0], parameters, types2, options);
}
function valuesBuilder(first, parameters, types2, columns, options) {
  return first.map(
    (row) => "(" + columns.map(
      (column) => stringifyValue("values", row[column], parameters, types2, options)
    ).join(",") + ")"
  ).join(",");
}
function values(first, rest, parameters, types2, options) {
  const multi = Array.isArray(first[0]);
  const columns = rest.length ? rest.flat() : Object.keys(multi ? first[0] : first);
  return valuesBuilder(multi ? first : [first], parameters, types2, columns, options);
}
function select(first, rest, parameters, types2, options) {
  typeof first === "string" && (first = [first].concat(rest));
  if (Array.isArray(first))
    return escapeIdentifiers(first, options);
  let value;
  const columns = rest.length ? rest.flat() : Object.keys(first);
  return columns.map((x) => {
    value = first[x];
    return (value instanceof Query ? fragment(value, parameters, types2, options) : value instanceof Identifier ? value.value : handleValue(value, parameters, types2, options)) + " as " + escapeIdentifier(options.transform.column.to ? options.transform.column.to(x) : x);
  }).join(",");
}
var builders = Object.entries({
  values,
  in: (...xs) => {
    const x = values(...xs);
    return x === "()" ? "(null)" : x;
  },
  select,
  as: select,
  returning: select,
  "\\(": select,
  update(first, rest, parameters, types2, options) {
    return (rest.length ? rest.flat() : Object.keys(first)).map(
      (x) => escapeIdentifier(options.transform.column.to ? options.transform.column.to(x) : x) + "=" + stringifyValue("values", first[x], parameters, types2, options)
    );
  },
  insert(first, rest, parameters, types2, options) {
    const columns = rest.length ? rest.flat() : Object.keys(Array.isArray(first) ? first[0] : first);
    return "(" + escapeIdentifiers(columns, options) + ")values" + valuesBuilder(Array.isArray(first) ? first : [first], parameters, types2, columns, options);
  }
}).map(([x, fn]) => [new RegExp("((?:^|[\\s(])" + x + "(?:$|[\\s(]))(?![\\s\\S]*\\1)", "i"), fn]);
function notTagged() {
  throw Errors.generic("NOT_TAGGED_CALL", "Query not called as a tagged template literal");
}
var serializers = defaultHandlers.serializers;
var parsers = defaultHandlers.parsers;
function firstIsString(x) {
  if (Array.isArray(x))
    return firstIsString(x[0]);
  return typeof x === "string" ? 1009 : 0;
}
var mergeUserTypes = function(types2) {
  const user = typeHandlers(types2 || {});
  return {
    serializers: Object.assign({}, serializers, user.serializers),
    parsers: Object.assign({}, parsers, user.parsers)
  };
};
function typeHandlers(types2) {
  return Object.keys(types2).reduce((acc, k) => {
    types2[k].from && [].concat(types2[k].from).forEach((x) => acc.parsers[x] = types2[k].parse);
    if (types2[k].serialize) {
      acc.serializers[types2[k].to] = types2[k].serialize;
      types2[k].from && [].concat(types2[k].from).forEach((x) => acc.serializers[x] = types2[k].serialize);
    }
    return acc;
  }, { parsers: {}, serializers: {} });
}
function escapeIdentifiers(xs, { transform: { column } }) {
  return xs.map((x) => escapeIdentifier(column.to ? column.to(x) : x)).join(",");
}
var escapeIdentifier = function escape(str) {
  return '"' + str.replace(/"/g, '""').replace(/\./g, '"."') + '"';
};
var inferType = function inferType2(x) {
  return x instanceof Parameter ? x.type : x instanceof Date ? 1184 : x instanceof Uint8Array ? 17 : x === true || x === false ? 16 : typeof x === "bigint" ? 20 : Array.isArray(x) ? inferType2(x[0]) : 0;
};
var escapeBackslash = /\\/g;
var escapeQuote = /"/g;
function arrayEscape(x) {
  return x.replace(escapeBackslash, "\\\\").replace(escapeQuote, '\\"');
}
var arraySerializer = function arraySerializer2(xs, serializer, options, typarray) {
  if (Array.isArray(xs) === false)
    return xs;
  if (!xs.length)
    return "{}";
  const first = xs[0];
  const delimiter = typarray === 1020 ? ";" : ",";
  if (Array.isArray(first) && !first.type)
    return "{" + xs.map((x) => arraySerializer2(x, serializer, options, typarray)).join(delimiter) + "}";
  return "{" + xs.map((x) => {
    if (x === void 0) {
      x = options.transform.undefined;
      if (x === void 0)
        throw Errors.generic("UNDEFINED_VALUE", "Undefined values are not allowed");
    }
    return x === null ? "null" : '"' + arrayEscape(serializer ? serializer(x.type ? x.value : x) : "" + x) + '"';
  }).join(delimiter) + "}";
};
var arrayParserState = {
  i: 0,
  char: null,
  str: "",
  quoted: false,
  last: 0
};
var arrayParser = function arrayParser2(x, parser, typarray) {
  arrayParserState.i = arrayParserState.last = 0;
  return arrayParserLoop(arrayParserState, x, parser, typarray);
};
function arrayParserLoop(s, x, parser, typarray) {
  const xs = [];
  const delimiter = typarray === 1020 ? ";" : ",";
  for (; s.i < x.length; s.i++) {
    s.char = x[s.i];
    if (s.quoted) {
      if (s.char === "\\") {
        s.str += x[++s.i];
      } else if (s.char === '"') {
        xs.push(parser ? parser(s.str) : s.str);
        s.str = "";
        s.quoted = x[s.i + 1] === '"';
        s.last = s.i + 2;
      } else {
        s.str += s.char;
      }
    } else if (s.char === '"') {
      s.quoted = true;
    } else if (s.char === "{") {
      s.last = ++s.i;
      xs.push(arrayParserLoop(s, x, parser, typarray));
    } else if (s.char === "}") {
      s.quoted = false;
      s.last < s.i && xs.push(parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i));
      s.last = s.i + 1;
      break;
    } else if (s.char === delimiter && s.p !== "}" && s.p !== '"') {
      xs.push(parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i));
      s.last = s.i + 1;
    }
    s.p = s.char;
  }
  s.last < s.i && xs.push(parser ? parser(x.slice(s.last, s.i + 1)) : x.slice(s.last, s.i + 1));
  return xs;
}
var toCamel = (x) => {
  let str = x[0];
  for (let i = 1; i < x.length; i++)
    str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
  return str;
};
var toPascal = (x) => {
  let str = x[0].toUpperCase();
  for (let i = 1; i < x.length; i++)
    str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
  return str;
};
var toKebab = (x) => x.replace(/_/g, "-");
var fromCamel = (x) => x.replace(/([A-Z])/g, "_$1").toLowerCase();
var fromPascal = (x) => (x.slice(0, 1) + x.slice(1).replace(/([A-Z])/g, "_$1")).toLowerCase();
var fromKebab = (x) => x.replace(/-/g, "_");
function createJsonTransform(fn) {
  return function jsonTransform(x, column) {
    return typeof x === "object" && x !== null && (column.type === 114 || column.type === 3802) ? Array.isArray(x) ? x.map((x2) => jsonTransform(x2, column)) : Object.entries(x).reduce((acc, [k, v]) => Object.assign(acc, { [fn(k)]: jsonTransform(v, column) }), {}) : x;
  };
}
toCamel.column = { from: toCamel };
toCamel.value = { from: createJsonTransform(toCamel) };
fromCamel.column = { to: fromCamel };
var camel = { ...toCamel };
camel.column.to = fromCamel;
toPascal.column = { from: toPascal };
toPascal.value = { from: createJsonTransform(toPascal) };
fromPascal.column = { to: fromPascal };
var pascal = { ...toPascal };
pascal.column.to = fromPascal;
toKebab.column = { from: toKebab };
toKebab.value = { from: createJsonTransform(toKebab) };
fromKebab.column = { to: fromKebab };
var kebab = { ...toKebab };
kebab.column.to = fromKebab;

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/connection.js
import net from "net";
import tls from "tls";
import crypto2 from "crypto";
import Stream from "stream";
import { performance } from "perf_hooks";

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/result.js
var Result = class extends Array {
  constructor() {
    super();
    Object.defineProperties(this, {
      count: { value: null, writable: true },
      state: { value: null, writable: true },
      command: { value: null, writable: true },
      columns: { value: null, writable: true },
      statement: { value: null, writable: true }
    });
  }
  static get [Symbol.species]() {
    return Array;
  }
};

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/queue.js
var queue_default = Queue;
function Queue(initial = []) {
  let xs = initial.slice();
  let index2 = 0;
  return {
    get length() {
      return xs.length - index2;
    },
    remove: (x) => {
      const index3 = xs.indexOf(x);
      return index3 === -1 ? null : (xs.splice(index3, 1), x);
    },
    push: (x) => (xs.push(x), x),
    shift: () => {
      const out = xs[index2++];
      if (index2 === xs.length) {
        index2 = 0;
        xs = [];
      } else {
        xs[index2 - 1] = void 0;
      }
      return out;
    }
  };
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/bytes.js
var size = 256;
var buffer = Buffer.allocUnsafe(size);
var messages = "BCcDdEFfHPpQSX".split("").reduce((acc, x) => {
  const v = x.charCodeAt(0);
  acc[x] = () => {
    buffer[0] = v;
    b.i = 5;
    return b;
  };
  return acc;
}, {});
var b = Object.assign(reset, messages, {
  N: String.fromCharCode(0),
  i: 0,
  inc(x) {
    b.i += x;
    return b;
  },
  str(x) {
    const length = Buffer.byteLength(x);
    fit(length);
    b.i += buffer.write(x, b.i, length, "utf8");
    return b;
  },
  i16(x) {
    fit(2);
    buffer.writeUInt16BE(x, b.i);
    b.i += 2;
    return b;
  },
  i32(x, i) {
    if (i || i === 0) {
      buffer.writeUInt32BE(x, i);
      return b;
    }
    fit(4);
    buffer.writeUInt32BE(x, b.i);
    b.i += 4;
    return b;
  },
  z(x) {
    fit(x);
    buffer.fill(0, b.i, b.i + x);
    b.i += x;
    return b;
  },
  raw(x) {
    buffer = Buffer.concat([buffer.subarray(0, b.i), x]);
    b.i = buffer.length;
    return b;
  },
  end(at = 1) {
    buffer.writeUInt32BE(b.i - at, at);
    const out = buffer.subarray(0, b.i);
    b.i = 0;
    buffer = Buffer.allocUnsafe(size);
    return out;
  }
});
var bytes_default = b;
function fit(x) {
  if (buffer.length - b.i < x) {
    const prev = buffer, length = prev.length;
    buffer = Buffer.allocUnsafe(length + (length >> 1) + x);
    prev.copy(buffer);
  }
}
function reset() {
  b.i = 0;
  return b;
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/connection.js
var connection_default = Connection;
var uid = 1;
var Sync = bytes_default().S().end();
var Flush = bytes_default().H().end();
var SSLRequest = bytes_default().i32(8).i32(80877103).end(8);
var ExecuteUnnamed = Buffer.concat([bytes_default().E().str(bytes_default.N).i32(0).end(), Sync]);
var DescribeUnnamed = bytes_default().D().str("S").str(bytes_default.N).end();
var noop = () => {
};
var retryRoutines = /* @__PURE__ */ new Set([
  "FetchPreparedStatement",
  "RevalidateCachedQuery",
  "transformAssignedExpr"
]);
var errorFields = {
  83: "severity_local",
  // S
  86: "severity",
  // V
  67: "code",
  // C
  77: "message",
  // M
  68: "detail",
  // D
  72: "hint",
  // H
  80: "position",
  // P
  112: "internal_position",
  // p
  113: "internal_query",
  // q
  87: "where",
  // W
  115: "schema_name",
  // s
  116: "table_name",
  // t
  99: "column_name",
  // c
  100: "data type_name",
  // d
  110: "constraint_name",
  // n
  70: "file",
  // F
  76: "line",
  // L
  82: "routine"
  // R
};
function Connection(options, queues = {}, { onopen = noop, onend = noop, onclose = noop } = {}) {
  const {
    sslnegotiation,
    ssl,
    max,
    user,
    host,
    port,
    database,
    parsers: parsers2,
    transform,
    onnotice,
    onnotify,
    onparameter,
    max_pipeline,
    keep_alive,
    backoff: backoff2,
    target_session_attrs
  } = options;
  const sent = queue_default(), id = uid++, backend = { pid: null, secret: null }, idleTimer = timer(end, options.idle_timeout), lifeTimer = timer(end, options.max_lifetime), connectTimer = timer(connectTimedOut, options.connect_timeout);
  let socket = null, cancelMessage, errorResponse = null, result = new Result(), incoming = Buffer.alloc(0), needsTypes = options.fetch_types, backendParameters = {}, statements = {}, statementId = Math.random().toString(36).slice(2), statementCount = 1, closedTime = 0, remaining = 0, hostIndex = 0, retries = 0, length = 0, delay = 0, rows = 0, serverSignature = null, nextWriteTimer = null, terminated = false, incomings = null, results = null, initial = null, ending = null, stream = null, chunk = null, ended = null, nonce = null, query = null, final = null;
  const connection2 = {
    queue: queues.closed,
    idleTimer,
    connect(query2) {
      initial = query2;
      reconnect();
    },
    terminate,
    execute,
    cancel,
    end,
    count: 0,
    id
  };
  queues.closed && queues.closed.push(connection2);
  return connection2;
  async function createSocket() {
    let x;
    try {
      x = options.socket ? await Promise.resolve(options.socket(options)) : new net.Socket();
    } catch (e) {
      error(e);
      return;
    }
    x.on("error", error);
    x.on("close", closed);
    x.on("drain", drain);
    return x;
  }
  async function cancel({ pid, secret }, resolve, reject) {
    try {
      cancelMessage = bytes_default().i32(16).i32(80877102).i32(pid).i32(secret).end(16);
      await connect();
      socket.once("error", reject);
      socket.once("close", resolve);
    } catch (error2) {
      reject(error2);
    }
  }
  function execute(q) {
    if (terminated)
      return queryError(q, Errors.connection("CONNECTION_DESTROYED", options));
    if (stream)
      return queryError(q, Errors.generic("COPY_IN_PROGRESS", "You cannot execute queries during copy"));
    if (q.cancelled)
      return;
    try {
      q.state = backend;
      query ? sent.push(q) : (query = q, query.active = true);
      build(q);
      return write(toBuffer(q)) && !q.describeFirst && !q.cursorFn && sent.length < max_pipeline && (!q.options.onexecute || q.options.onexecute(connection2));
    } catch (error2) {
      sent.length === 0 && write(Sync);
      errored(error2);
      return true;
    }
  }
  function toBuffer(q) {
    if (q.parameters.length >= 65534)
      throw Errors.generic("MAX_PARAMETERS_EXCEEDED", "Max number of parameters (65534) exceeded");
    return q.options.simple ? bytes_default().Q().str(q.statement.string + bytes_default.N).end() : q.describeFirst ? Buffer.concat([describe(q), Flush]) : q.prepare ? q.prepared ? prepared(q) : Buffer.concat([describe(q), prepared(q)]) : unnamed(q);
  }
  function describe(q) {
    return Buffer.concat([
      Parse(q.statement.string, q.parameters, q.statement.types, q.statement.name),
      Describe("S", q.statement.name)
    ]);
  }
  function prepared(q) {
    return Buffer.concat([
      Bind(q.parameters, q.statement.types, q.statement.name, q.cursorName),
      q.cursorFn ? Execute("", q.cursorRows) : ExecuteUnnamed
    ]);
  }
  function unnamed(q) {
    return Buffer.concat([
      Parse(q.statement.string, q.parameters, q.statement.types),
      DescribeUnnamed,
      prepared(q)
    ]);
  }
  function build(q) {
    const parameters = [], types2 = [];
    const string = stringify(q, q.strings[0], q.args[0], parameters, types2, options);
    !q.tagged && q.args.forEach((x) => handleValue(x, parameters, types2, options));
    q.prepare = options.prepare && ("prepare" in q.options ? q.options.prepare : true);
    q.string = string;
    q.signature = q.prepare && types2 + string;
    q.onlyDescribe && delete statements[q.signature];
    q.parameters = q.parameters || parameters;
    q.prepared = q.prepare && q.signature in statements;
    q.describeFirst = q.onlyDescribe || parameters.length && !q.prepared;
    q.statement = q.prepared ? statements[q.signature] : { string, types: types2, name: q.prepare ? statementId + statementCount++ : "" };
    typeof options.debug === "function" && options.debug(id, string, parameters, types2);
  }
  function write(x, fn) {
    chunk = chunk ? Buffer.concat([chunk, x]) : Buffer.from(x);
    if (fn || chunk.length >= 1024)
      return nextWrite(fn);
    nextWriteTimer === null && (nextWriteTimer = setImmediate(nextWrite));
    return true;
  }
  function nextWrite(fn) {
    const x = socket.write(chunk, fn);
    nextWriteTimer !== null && clearImmediate(nextWriteTimer);
    chunk = nextWriteTimer = null;
    return x;
  }
  function connectTimedOut() {
    errored(Errors.connection("CONNECT_TIMEOUT", options, socket));
    socket.destroy();
  }
  async function secure() {
    if (sslnegotiation !== "direct") {
      write(SSLRequest);
      const canSSL = await new Promise((r) => socket.once("data", (x) => r(x[0] === 83)));
      if (!canSSL && ssl === "prefer")
        return connected();
    }
    const options2 = {
      socket,
      servername: net.isIP(socket.host) ? void 0 : socket.host
    };
    if (sslnegotiation === "direct")
      options2.ALPNProtocols = ["postgresql"];
    if (ssl === "require" || ssl === "allow" || ssl === "prefer")
      options2.rejectUnauthorized = false;
    else if (typeof ssl === "object")
      Object.assign(options2, ssl);
    socket.removeAllListeners();
    socket = tls.connect(options2);
    socket.on("secureConnect", connected);
    socket.on("error", error);
    socket.on("close", closed);
    socket.on("drain", drain);
  }
  function drain() {
    !query && onopen(connection2);
  }
  function data(x) {
    if (incomings) {
      incomings.push(x);
      remaining -= x.length;
      if (remaining > 0)
        return;
    }
    incoming = incomings ? Buffer.concat(incomings, length - remaining) : incoming.length === 0 ? x : Buffer.concat([incoming, x], incoming.length + x.length);
    while (incoming.length > 4) {
      length = incoming.readUInt32BE(1);
      if (length >= incoming.length) {
        remaining = length - incoming.length;
        incomings = [incoming];
        break;
      }
      try {
        handle(incoming.subarray(0, length + 1));
      } catch (e) {
        query && (query.cursorFn || query.describeFirst) && write(Sync);
        errored(e);
      }
      incoming = incoming.subarray(length + 1);
      remaining = 0;
      incomings = null;
    }
  }
  async function connect() {
    terminated = false;
    backendParameters = {};
    socket || (socket = await createSocket());
    if (!socket)
      return;
    connectTimer.start();
    if (options.socket)
      return ssl ? secure() : connected();
    socket.on("connect", ssl ? secure : connected);
    if (options.path)
      return socket.connect(options.path);
    socket.ssl = ssl;
    socket.connect(port[hostIndex], host[hostIndex]);
    socket.host = host[hostIndex];
    socket.port = port[hostIndex];
    hostIndex = (hostIndex + 1) % port.length;
  }
  function reconnect() {
    setTimeout(connect, closedTime ? Math.max(0, closedTime + delay - performance.now()) : 0);
  }
  function connected() {
    try {
      statements = {};
      needsTypes = options.fetch_types;
      statementId = Math.random().toString(36).slice(2);
      statementCount = 1;
      lifeTimer.start();
      socket.on("data", data);
      keep_alive && socket.setKeepAlive && socket.setKeepAlive(true, 1e3 * keep_alive);
      const s = StartupMessage();
      write(s);
    } catch (err) {
      error(err);
    }
  }
  function error(err) {
    if (connection2.queue === queues.connecting && options.host[retries + 1])
      return;
    errored(err);
    while (sent.length)
      queryError(sent.shift(), err);
  }
  function errored(err) {
    stream && (stream.destroy(err), stream = null);
    query && queryError(query, err);
    initial && (queryError(initial, err), initial = null);
  }
  function queryError(query2, err) {
    if (query2.reserve)
      return query2.reject(err);
    if (!err || typeof err !== "object")
      err = new Error(err);
    "query" in err || "parameters" in err || Object.defineProperties(err, {
      stack: { value: err.stack + query2.origin.replace(/.*\n/, "\n"), enumerable: options.debug },
      query: { value: query2.string, enumerable: options.debug },
      parameters: { value: query2.parameters, enumerable: options.debug },
      args: { value: query2.args, enumerable: options.debug },
      types: { value: query2.statement && query2.statement.types, enumerable: options.debug }
    });
    query2.reject(err);
  }
  function end() {
    return ending || (!connection2.reserved && onend(connection2), !connection2.reserved && !initial && !query && sent.length === 0 ? (terminate(), new Promise((r) => socket && socket.readyState !== "closed" ? socket.once("close", r) : r())) : ending = new Promise((r) => ended = r));
  }
  function terminate() {
    terminated = true;
    if (stream || query || initial || sent.length)
      error(Errors.connection("CONNECTION_DESTROYED", options));
    clearImmediate(nextWriteTimer);
    if (socket) {
      socket.removeListener("data", data);
      socket.removeListener("connect", connected);
      socket.readyState === "open" && socket.end(bytes_default().X().end());
    }
    ended && (ended(), ending = ended = null);
  }
  async function closed(hadError) {
    incoming = Buffer.alloc(0);
    remaining = 0;
    incomings = null;
    clearImmediate(nextWriteTimer);
    socket.removeListener("data", data);
    socket.removeListener("connect", connected);
    idleTimer.cancel();
    lifeTimer.cancel();
    connectTimer.cancel();
    socket.removeAllListeners();
    socket = null;
    if (initial)
      return reconnect();
    !hadError && (query || sent.length) && error(Errors.connection("CONNECTION_CLOSED", options, socket));
    closedTime = performance.now();
    hadError && options.shared.retries++;
    delay = (typeof backoff2 === "function" ? backoff2(options.shared.retries) : backoff2) * 1e3;
    onclose(connection2, Errors.connection("CONNECTION_CLOSED", options, socket));
  }
  function handle(xs, x = xs[0]) {
    (x === 68 ? DataRow : (
      // D
      x === 100 ? CopyData : (
        // d
        x === 65 ? NotificationResponse : (
          // A
          x === 83 ? ParameterStatus : (
            // S
            x === 90 ? ReadyForQuery : (
              // Z
              x === 67 ? CommandComplete : (
                // C
                x === 50 ? BindComplete : (
                  // 2
                  x === 49 ? ParseComplete : (
                    // 1
                    x === 116 ? ParameterDescription : (
                      // t
                      x === 84 ? RowDescription : (
                        // T
                        x === 82 ? Authentication : (
                          // R
                          x === 110 ? NoData : (
                            // n
                            x === 75 ? BackendKeyData : (
                              // K
                              x === 69 ? ErrorResponse : (
                                // E
                                x === 115 ? PortalSuspended : (
                                  // s
                                  x === 51 ? CloseComplete : (
                                    // 3
                                    x === 71 ? CopyInResponse : (
                                      // G
                                      x === 78 ? NoticeResponse : (
                                        // N
                                        x === 72 ? CopyOutResponse : (
                                          // H
                                          x === 99 ? CopyDone : (
                                            // c
                                            x === 73 ? EmptyQueryResponse : (
                                              // I
                                              x === 86 ? FunctionCallResponse : (
                                                // V
                                                x === 118 ? NegotiateProtocolVersion : (
                                                  // v
                                                  x === 87 ? CopyBothResponse : (
                                                    // W
                                                    /* c8 ignore next */
                                                    UnknownMessage
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    ))(xs);
  }
  function DataRow(x) {
    let index2 = 7;
    let length2;
    let column;
    let value;
    const row = query.isRaw ? new Array(query.statement.columns.length) : {};
    for (let i = 0; i < query.statement.columns.length; i++) {
      column = query.statement.columns[i];
      length2 = x.readInt32BE(index2);
      index2 += 4;
      value = length2 === -1 ? null : query.isRaw === true ? x.subarray(index2, index2 += length2) : column.parser === void 0 ? x.toString("utf8", index2, index2 += length2) : column.parser.array === true ? column.parser(x.toString("utf8", index2 + 1, index2 += length2)) : column.parser(x.toString("utf8", index2, index2 += length2));
      query.isRaw ? row[i] = query.isRaw === true ? value : transform.value.from ? transform.value.from(value, column) : value : row[column.name] = transform.value.from ? transform.value.from(value, column) : value;
    }
    query.forEachFn ? query.forEachFn(transform.row.from ? transform.row.from(row) : row, result) : result[rows++] = transform.row.from ? transform.row.from(row) : row;
  }
  function ParameterStatus(x) {
    const [k, v] = x.toString("utf8", 5, x.length - 1).split(bytes_default.N);
    backendParameters[k] = v;
    if (options.parameters[k] !== v) {
      options.parameters[k] = v;
      onparameter && onparameter(k, v);
    }
  }
  function ReadyForQuery(x) {
    if (query) {
      if (errorResponse) {
        query.retried ? errored(query.retried) : query.prepared && retryRoutines.has(errorResponse.routine) ? retry(query, errorResponse) : errored(errorResponse);
      } else {
        query.resolve(results || result);
      }
    } else if (errorResponse) {
      errored(errorResponse);
    }
    query = results = errorResponse = null;
    result = new Result();
    connectTimer.cancel();
    if (initial) {
      if (target_session_attrs) {
        if (!backendParameters.in_hot_standby || !backendParameters.default_transaction_read_only)
          return fetchState();
        else if (tryNext(target_session_attrs, backendParameters))
          return terminate();
      }
      if (needsTypes) {
        initial.reserve && (initial = null);
        return fetchArrayTypes();
      }
      initial && !initial.reserve && execute(initial);
      options.shared.retries = retries = 0;
      initial = null;
      return;
    }
    while (sent.length && (query = sent.shift()) && (query.active = true, query.cancelled))
      Connection(options).cancel(query.state, query.cancelled.resolve, query.cancelled.reject);
    if (query)
      return;
    connection2.reserved ? !connection2.reserved.release && x[5] === 73 ? ending ? terminate() : (connection2.reserved = null, onopen(connection2)) : connection2.reserved() : ending ? terminate() : onopen(connection2);
  }
  function CommandComplete(x) {
    rows = 0;
    for (let i = x.length - 1; i > 0; i--) {
      if (x[i] === 32 && x[i + 1] < 58 && result.count === null)
        result.count = +x.toString("utf8", i + 1, x.length - 1);
      if (x[i - 1] >= 65) {
        result.command = x.toString("utf8", 5, i);
        result.state = backend;
        break;
      }
    }
    final && (final(), final = null);
    if (result.command === "BEGIN" && max !== 1 && !connection2.reserved)
      return errored(Errors.generic("UNSAFE_TRANSACTION", "Only use sql.begin, sql.reserved or max: 1"));
    if (query.options.simple)
      return BindComplete();
    if (query.cursorFn) {
      result.count && query.cursorFn(result);
      write(Sync);
    }
  }
  function ParseComplete() {
    query.parsing = false;
  }
  function BindComplete() {
    !result.statement && (result.statement = query.statement);
    result.columns = query.statement.columns;
  }
  function ParameterDescription(x) {
    const length2 = x.readUInt16BE(5);
    for (let i = 0; i < length2; ++i)
      !query.statement.types[i] && (query.statement.types[i] = x.readUInt32BE(7 + i * 4));
    query.prepare && (statements[query.signature] = query.statement);
    query.describeFirst && !query.onlyDescribe && (write(prepared(query)), query.describeFirst = false);
  }
  function RowDescription(x) {
    if (result.command) {
      results = results || [result];
      results.push(result = new Result());
      result.count = null;
      query.statement.columns = null;
    }
    const length2 = x.readUInt16BE(5);
    let index2 = 7;
    let start;
    query.statement.columns = Array(length2);
    for (let i = 0; i < length2; ++i) {
      start = index2;
      while (x[index2++] !== 0) ;
      const table = x.readUInt32BE(index2);
      const number = x.readUInt16BE(index2 + 4);
      const type = x.readUInt32BE(index2 + 6);
      query.statement.columns[i] = {
        name: transform.column.from ? transform.column.from(x.toString("utf8", start, index2 - 1)) : x.toString("utf8", start, index2 - 1),
        parser: parsers2[type],
        table,
        number,
        type
      };
      index2 += 18;
    }
    result.statement = query.statement;
    if (query.onlyDescribe)
      return query.resolve(query.statement), write(Sync);
  }
  async function Authentication(x, type = x.readUInt32BE(5)) {
    (type === 3 ? AuthenticationCleartextPassword : type === 5 ? AuthenticationMD5Password : type === 10 ? SASL : type === 11 ? SASLContinue : type === 12 ? SASLFinal : type !== 0 ? UnknownAuth : noop)(x, type);
  }
  async function AuthenticationCleartextPassword() {
    const payload = await Pass();
    write(
      bytes_default().p().str(payload).z(1).end()
    );
  }
  async function AuthenticationMD5Password(x) {
    const payload = "md5" + await md5(
      Buffer.concat([
        Buffer.from(await md5(await Pass() + user)),
        x.subarray(9)
      ])
    );
    write(
      bytes_default().p().str(payload).z(1).end()
    );
  }
  async function SASL() {
    nonce = (await crypto2.randomBytes(18)).toString("base64");
    bytes_default().p().str("SCRAM-SHA-256" + bytes_default.N);
    const i = bytes_default.i;
    write(bytes_default.inc(4).str("n,,n=*,r=" + nonce).i32(bytes_default.i - i - 4, i).end());
  }
  async function SASLContinue(x) {
    const res = x.toString("utf8", 9).split(",").reduce((acc, x2) => (acc[x2[0]] = x2.slice(2), acc), {});
    const saltedPassword = await crypto2.pbkdf2Sync(
      await Pass(),
      Buffer.from(res.s, "base64"),
      parseInt(res.i),
      32,
      "sha256"
    );
    const clientKey = await hmac(saltedPassword, "Client Key");
    const auth = "n=*,r=" + nonce + ",r=" + res.r + ",s=" + res.s + ",i=" + res.i + ",c=biws,r=" + res.r;
    serverSignature = (await hmac(await hmac(saltedPassword, "Server Key"), auth)).toString("base64");
    const payload = "c=biws,r=" + res.r + ",p=" + xor(
      clientKey,
      Buffer.from(await hmac(await sha256(clientKey), auth))
    ).toString("base64");
    write(
      bytes_default().p().str(payload).end()
    );
  }
  function SASLFinal(x) {
    if (x.toString("utf8", 9).split(bytes_default.N, 1)[0].slice(2) === serverSignature)
      return;
    errored(Errors.generic("SASL_SIGNATURE_MISMATCH", "The server did not return the correct signature"));
    socket.destroy();
  }
  function Pass() {
    return Promise.resolve(
      typeof options.pass === "function" ? options.pass() : options.pass
    );
  }
  function NoData() {
    result.statement = query.statement;
    result.statement.columns = [];
    if (query.onlyDescribe)
      return query.resolve(query.statement), write(Sync);
  }
  function BackendKeyData(x) {
    backend.pid = x.readUInt32BE(5);
    backend.secret = x.readUInt32BE(9);
  }
  async function fetchArrayTypes() {
    needsTypes = false;
    const types2 = await new Query([`
      select b.oid, b.typarray
      from pg_catalog.pg_type a
      left join pg_catalog.pg_type b on b.oid = a.typelem
      where a.typcategory = 'A'
      group by b.oid, b.typarray
      order by b.oid
    `], [], execute);
    types2.forEach(({ oid, typarray }) => addArrayType(oid, typarray));
  }
  function addArrayType(oid, typarray) {
    if (!!options.parsers[typarray] && !!options.serializers[typarray]) return;
    const parser = options.parsers[oid];
    options.shared.typeArrayMap[oid] = typarray;
    options.parsers[typarray] = (xs) => arrayParser(xs, parser, typarray);
    options.parsers[typarray].array = true;
    options.serializers[typarray] = (xs) => arraySerializer(xs, options.serializers[oid], options, typarray);
  }
  function tryNext(x, xs) {
    return x === "read-write" && xs.default_transaction_read_only === "on" || x === "read-only" && xs.default_transaction_read_only === "off" || x === "primary" && xs.in_hot_standby === "on" || x === "standby" && xs.in_hot_standby === "off" || x === "prefer-standby" && xs.in_hot_standby === "off" && options.host[retries];
  }
  function fetchState() {
    const query2 = new Query([`
      show transaction_read_only;
      select pg_catalog.pg_is_in_recovery()
    `], [], execute, null, { simple: true });
    query2.resolve = ([[a], [b2]]) => {
      backendParameters.default_transaction_read_only = a.transaction_read_only;
      backendParameters.in_hot_standby = b2.pg_is_in_recovery ? "on" : "off";
    };
    query2.execute();
  }
  function ErrorResponse(x) {
    if (query) {
      (query.cursorFn || query.describeFirst) && write(Sync);
      errorResponse = Errors.postgres(parseError(x));
    } else {
      errored(Errors.postgres(parseError(x)));
    }
  }
  function retry(q, error2) {
    delete statements[q.signature];
    q.retried = error2;
    execute(q);
  }
  function NotificationResponse(x) {
    if (!onnotify)
      return;
    let index2 = 9;
    while (x[index2++] !== 0) ;
    onnotify(
      x.toString("utf8", 9, index2 - 1),
      x.toString("utf8", index2, x.length - 1)
    );
  }
  async function PortalSuspended() {
    try {
      const x = await Promise.resolve(query.cursorFn(result));
      rows = 0;
      x === CLOSE ? write(Close(query.portal)) : (result = new Result(), write(Execute("", query.cursorRows)));
    } catch (err) {
      write(Sync);
      query.reject(err);
    }
  }
  function CloseComplete() {
    result.count && query.cursorFn(result);
    query.resolve(result);
  }
  function CopyInResponse() {
    stream = new Stream.Writable({
      autoDestroy: true,
      write(chunk2, encoding, callback) {
        socket.write(bytes_default().d().raw(chunk2).end(), callback);
      },
      destroy(error2, callback) {
        callback(error2);
        socket.write(bytes_default().f().str(error2 + bytes_default.N).end());
        stream = null;
      },
      final(callback) {
        socket.write(bytes_default().c().end());
        final = callback;
        stream = null;
      }
    });
    query.resolve(stream);
  }
  function CopyOutResponse() {
    stream = new Stream.Readable({
      read() {
        socket.resume();
      }
    });
    query.resolve(stream);
  }
  function CopyBothResponse() {
    stream = new Stream.Duplex({
      autoDestroy: true,
      read() {
        socket.resume();
      },
      /* c8 ignore next 11 */
      write(chunk2, encoding, callback) {
        socket.write(bytes_default().d().raw(chunk2).end(), callback);
      },
      destroy(error2, callback) {
        callback(error2);
        socket.write(bytes_default().f().str(error2 + bytes_default.N).end());
        stream = null;
      },
      final(callback) {
        socket.write(bytes_default().c().end());
        final = callback;
      }
    });
    query.resolve(stream);
  }
  function CopyData(x) {
    stream && (stream.push(x.subarray(5)) || socket.pause());
  }
  function CopyDone() {
    stream && stream.push(null);
    stream = null;
  }
  function NoticeResponse(x) {
    onnotice ? onnotice(parseError(x)) : console.log(parseError(x));
  }
  function EmptyQueryResponse() {
  }
  function FunctionCallResponse() {
    errored(Errors.notSupported("FunctionCallResponse"));
  }
  function NegotiateProtocolVersion() {
    errored(Errors.notSupported("NegotiateProtocolVersion"));
  }
  function UnknownMessage(x) {
    console.error("Postgres.js : Unknown Message:", x[0]);
  }
  function UnknownAuth(x, type) {
    console.error("Postgres.js : Unknown Auth:", type);
  }
  function Bind(parameters, types2, statement = "", portal = "") {
    let prev, type;
    bytes_default().B().str(portal + bytes_default.N).str(statement + bytes_default.N).i16(0).i16(parameters.length);
    parameters.forEach((x, i) => {
      if (x === null)
        return bytes_default.i32(4294967295);
      type = types2[i];
      parameters[i] = x = type in options.serializers ? options.serializers[type](x) : "" + x;
      prev = bytes_default.i;
      bytes_default.inc(4).str(x).i32(bytes_default.i - prev - 4, prev);
    });
    bytes_default.i16(0);
    return bytes_default.end();
  }
  function Parse(str, parameters, types2, name = "") {
    bytes_default().P().str(name + bytes_default.N).str(str + bytes_default.N).i16(parameters.length);
    parameters.forEach((x, i) => bytes_default.i32(types2[i] || 0));
    return bytes_default.end();
  }
  function Describe(x, name = "") {
    return bytes_default().D().str(x).str(name + bytes_default.N).end();
  }
  function Execute(portal = "", rows2 = 0) {
    return Buffer.concat([
      bytes_default().E().str(portal + bytes_default.N).i32(rows2).end(),
      Flush
    ]);
  }
  function Close(portal = "") {
    return Buffer.concat([
      bytes_default().C().str("P").str(portal + bytes_default.N).end(),
      bytes_default().S().end()
    ]);
  }
  function StartupMessage() {
    return cancelMessage || bytes_default().inc(4).i16(3).z(2).str(
      Object.entries(Object.assign(
        {
          user,
          database,
          client_encoding: "UTF8"
        },
        options.connection
      )).filter(([, v]) => v).map(([k, v]) => k + bytes_default.N + v).join(bytes_default.N)
    ).z(2).end(0);
  }
}
function parseError(x) {
  const error = {};
  let start = 5;
  for (let i = 5; i < x.length - 1; i++) {
    if (x[i] === 0) {
      error[errorFields[x[start]]] = x.toString("utf8", start + 1, i);
      start = i + 1;
    }
  }
  return error;
}
function md5(x) {
  return crypto2.createHash("md5").update(x).digest("hex");
}
function hmac(key, x) {
  return crypto2.createHmac("sha256", key).update(x).digest();
}
function sha256(x) {
  return crypto2.createHash("sha256").update(x).digest();
}
function xor(a, b2) {
  const length = Math.max(a.length, b2.length);
  const buffer2 = Buffer.allocUnsafe(length);
  for (let i = 0; i < length; i++)
    buffer2[i] = a[i] ^ b2[i];
  return buffer2;
}
function timer(fn, seconds) {
  seconds = typeof seconds === "function" ? seconds() : seconds;
  if (!seconds)
    return { cancel: noop, start: noop };
  let timer2;
  return {
    cancel() {
      timer2 && (clearTimeout(timer2), timer2 = null);
    },
    start() {
      timer2 && clearTimeout(timer2);
      timer2 = setTimeout(done, seconds * 1e3, arguments);
    }
  };
  function done(args) {
    fn.apply(null, args);
    timer2 = null;
  }
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/subscribe.js
var noop2 = () => {
};
function Subscribe(postgres2, options) {
  const subscribers = /* @__PURE__ */ new Map(), slot = "postgresjs_" + Math.random().toString(36).slice(2), state = {};
  let connection2, stream, ended = false;
  const sql2 = subscribe.sql = postgres2({
    ...options,
    transform: { column: {}, value: {}, row: {} },
    max: 1,
    fetch_types: false,
    idle_timeout: null,
    max_lifetime: null,
    connection: {
      ...options.connection,
      replication: "database"
    },
    onclose: async function() {
      if (ended)
        return;
      stream = null;
      state.pid = state.secret = void 0;
      connected(await init(sql2, slot, options.publications));
      subscribers.forEach((event) => event.forEach(({ onsubscribe }) => onsubscribe()));
    },
    no_subscribe: true
  });
  const end = sql2.end, close = sql2.close;
  sql2.end = async () => {
    ended = true;
    stream && await new Promise((r) => (stream.once("close", r), stream.end()));
    return end();
  };
  sql2.close = async () => {
    stream && await new Promise((r) => (stream.once("close", r), stream.end()));
    return close();
  };
  return subscribe;
  async function subscribe(event, fn, onsubscribe = noop2, onerror = noop2) {
    event = parseEvent(event);
    if (!connection2)
      connection2 = init(sql2, slot, options.publications);
    const subscriber = { fn, onsubscribe };
    const fns = subscribers.has(event) ? subscribers.get(event).add(subscriber) : subscribers.set(event, /* @__PURE__ */ new Set([subscriber])).get(event);
    const unsubscribe = () => {
      fns.delete(subscriber);
      fns.size === 0 && subscribers.delete(event);
    };
    return connection2.then((x) => {
      connected(x);
      onsubscribe();
      stream && stream.on("error", onerror);
      return { unsubscribe, state, sql: sql2 };
    });
  }
  function connected(x) {
    stream = x.stream;
    state.pid = x.state.pid;
    state.secret = x.state.secret;
  }
  async function init(sql3, slot2, publications) {
    if (!publications)
      throw new Error("Missing publication names");
    const xs = await sql3.unsafe(
      `CREATE_REPLICATION_SLOT ${slot2} TEMPORARY LOGICAL pgoutput NOEXPORT_SNAPSHOT`
    );
    const [x] = xs;
    const stream2 = await sql3.unsafe(
      `START_REPLICATION SLOT ${slot2} LOGICAL ${x.consistent_point} (proto_version '1', publication_names '${publications}')`
    ).writable();
    const state2 = {
      lsn: Buffer.concat(x.consistent_point.split("/").map((x2) => Buffer.from(("00000000" + x2).slice(-8), "hex")))
    };
    stream2.on("data", data);
    stream2.on("error", error);
    stream2.on("close", sql3.close);
    return { stream: stream2, state: xs.state };
    function error(e) {
      console.error("Unexpected error during logical streaming - reconnecting", e);
    }
    function data(x2) {
      if (x2[0] === 119) {
        parse(x2.subarray(25), state2, sql3.options.parsers, handle, options.transform);
      } else if (x2[0] === 107 && x2[17]) {
        state2.lsn = x2.subarray(1, 9);
        pong();
      }
    }
    function handle(a, b2) {
      const path = b2.relation.schema + "." + b2.relation.table;
      call("*", a, b2);
      call("*:" + path, a, b2);
      b2.relation.keys.length && call("*:" + path + "=" + b2.relation.keys.map((x2) => a[x2.name]), a, b2);
      call(b2.command, a, b2);
      call(b2.command + ":" + path, a, b2);
      b2.relation.keys.length && call(b2.command + ":" + path + "=" + b2.relation.keys.map((x2) => a[x2.name]), a, b2);
    }
    function pong() {
      const x2 = Buffer.alloc(34);
      x2[0] = "r".charCodeAt(0);
      x2.fill(state2.lsn, 1);
      x2.writeBigInt64BE(BigInt(Date.now() - Date.UTC(2e3, 0, 1)) * BigInt(1e3), 25);
      stream2.write(x2);
    }
  }
  function call(x, a, b2) {
    subscribers.has(x) && subscribers.get(x).forEach(({ fn }) => fn(a, b2, x));
  }
}
function Time(x) {
  return new Date(Date.UTC(2e3, 0, 1) + Number(x / BigInt(1e3)));
}
function parse(x, state, parsers2, handle, transform) {
  const char2 = (acc, [k, v]) => (acc[k.charCodeAt(0)] = v, acc);
  Object.entries({
    R: (x2) => {
      let i = 1;
      const r = state[x2.readUInt32BE(i)] = {
        schema: x2.toString("utf8", i += 4, i = x2.indexOf(0, i)) || "pg_catalog",
        table: x2.toString("utf8", i + 1, i = x2.indexOf(0, i + 1)),
        columns: Array(x2.readUInt16BE(i += 2)),
        keys: []
      };
      i += 2;
      let columnIndex = 0, column;
      while (i < x2.length) {
        column = r.columns[columnIndex++] = {
          key: x2[i++],
          name: transform.column.from ? transform.column.from(x2.toString("utf8", i, i = x2.indexOf(0, i))) : x2.toString("utf8", i, i = x2.indexOf(0, i)),
          type: x2.readUInt32BE(i += 1),
          parser: parsers2[x2.readUInt32BE(i)],
          atttypmod: x2.readUInt32BE(i += 4)
        };
        column.key && r.keys.push(column);
        i += 4;
      }
    },
    Y: () => {
    },
    // Type
    O: () => {
    },
    // Origin
    B: (x2) => {
      state.date = Time(x2.readBigInt64BE(9));
      state.lsn = x2.subarray(1, 9);
    },
    I: (x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      const { row } = tuples(x2, relation.columns, i += 7, transform);
      handle(row, {
        command: "insert",
        relation
      });
    },
    D: (x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      i += 4;
      const key = x2[i] === 75;
      handle(
        key || x2[i] === 79 ? tuples(x2, relation.columns, i += 3, transform).row : null,
        {
          command: "delete",
          relation,
          key
        }
      );
    },
    U: (x2) => {
      let i = 1;
      const relation = state[x2.readUInt32BE(i)];
      i += 4;
      const key = x2[i] === 75;
      const xs = key || x2[i] === 79 ? tuples(x2, relation.columns, i += 3, transform) : null;
      xs && (i = xs.i);
      const { row } = tuples(x2, relation.columns, i + 3, transform);
      handle(row, {
        command: "update",
        relation,
        key,
        old: xs && xs.row
      });
    },
    T: () => {
    },
    // Truncate,
    C: () => {
    }
    // Commit
  }).reduce(char2, {})[x[0]](x);
}
function tuples(x, columns, xi, transform) {
  let type, column, value;
  const row = transform.raw ? new Array(columns.length) : {};
  for (let i = 0; i < columns.length; i++) {
    type = x[xi++];
    column = columns[i];
    value = type === 110 ? null : type === 117 ? void 0 : column.parser === void 0 ? x.toString("utf8", xi + 4, xi += 4 + x.readUInt32BE(xi)) : column.parser.array === true ? column.parser(x.toString("utf8", xi + 5, xi += 4 + x.readUInt32BE(xi))) : column.parser(x.toString("utf8", xi + 4, xi += 4 + x.readUInt32BE(xi)));
    transform.raw ? row[i] = transform.raw === true ? value : transform.value.from ? transform.value.from(value, column) : value : row[column.name] = transform.value.from ? transform.value.from(value, column) : value;
  }
  return { i: xi, row: transform.row.from ? transform.row.from(row) : row };
}
function parseEvent(x) {
  const xs = x.match(/^(\*|insert|update|delete)?:?([^.]+?\.?[^=]+)?=?(.+)?/i) || [];
  if (!xs)
    throw new Error("Malformed subscribe pattern: " + x);
  const [, command, path, key] = xs;
  return (command || "*") + (path ? ":" + (path.indexOf(".") === -1 ? "public." + path : path) : "") + (key ? "=" + key : "");
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/large.js
import Stream2 from "stream";
function largeObject(sql2, oid, mode = 131072 | 262144) {
  return new Promise(async (resolve, reject) => {
    await sql2.begin(async (sql3) => {
      let finish;
      !oid && ([{ oid }] = await sql3`select lo_creat(-1) as oid`);
      const [{ fd }] = await sql3`select lo_open(${oid}, ${mode}) as fd`;
      const lo = {
        writable,
        readable,
        close: () => sql3`select lo_close(${fd})`.then(finish),
        tell: () => sql3`select lo_tell64(${fd})`,
        read: (x) => sql3`select loread(${fd}, ${x}) as data`,
        write: (x) => sql3`select lowrite(${fd}, ${x})`,
        truncate: (x) => sql3`select lo_truncate64(${fd}, ${x})`,
        seek: (x, whence = 0) => sql3`select lo_lseek64(${fd}, ${x}, ${whence})`,
        size: () => sql3`
          select
            lo_lseek64(${fd}, location, 0) as position,
            seek.size
          from (
            select
              lo_lseek64($1, 0, 2) as size,
              tell.location
            from (select lo_tell64($1) as location) tell
          ) seek
        `
      };
      resolve(lo);
      return new Promise(async (r) => finish = r);
      async function readable({
        highWaterMark = 2048 * 8,
        start = 0,
        end = Infinity
      } = {}) {
        let max = end - start;
        start && await lo.seek(start);
        return new Stream2.Readable({
          highWaterMark,
          async read(size2) {
            const l = size2 > max ? size2 - max : size2;
            max -= size2;
            const [{ data }] = await lo.read(l);
            this.push(data);
            if (data.length < size2)
              this.push(null);
          }
        });
      }
      async function writable({
        highWaterMark = 2048 * 8,
        start = 0
      } = {}) {
        start && await lo.seek(start);
        return new Stream2.Writable({
          highWaterMark,
          write(chunk, encoding, callback) {
            lo.write(chunk).then(() => callback(), callback);
          }
        });
      }
    }).catch(reject);
  });
}

// ../../node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/index.js
Object.assign(Postgres, {
  PostgresError,
  toPascal,
  pascal,
  toCamel,
  camel,
  toKebab,
  kebab,
  fromPascal,
  fromCamel,
  fromKebab,
  BigInt: {
    to: 20,
    from: [20],
    parse: (x) => BigInt(x),
    // eslint-disable-line
    serialize: (x) => x.toString()
  }
});
var src_default = Postgres;
function Postgres(a, b2) {
  const options = parseOptions(a, b2), subscribe = options.no_subscribe || Subscribe(Postgres, { ...options });
  let ending = false;
  const queries = queue_default(), connecting = queue_default(), reserved = queue_default(), closed = queue_default(), ended = queue_default(), open = queue_default(), busy = queue_default(), full = queue_default(), queues = { connecting, reserved, closed, ended, open, busy, full };
  const connections = [...Array(options.max)].map(() => connection_default(options, queues, { onopen, onend, onclose }));
  const sql2 = Sql(handler);
  Object.assign(sql2, {
    get parameters() {
      return options.parameters;
    },
    largeObject: largeObject.bind(null, sql2),
    subscribe,
    CLOSE,
    END: CLOSE,
    PostgresError,
    options,
    reserve,
    listen,
    begin,
    close,
    end
  });
  return sql2;
  function Sql(handler2) {
    handler2.debug = options.debug;
    Object.entries(options.types).reduce((acc, [name, type]) => {
      acc[name] = (x) => new Parameter(x, type.to);
      return acc;
    }, typed);
    Object.assign(sql3, {
      types: typed,
      typed,
      unsafe,
      notify,
      array,
      json: json2,
      file
    });
    return sql3;
    function typed(value, type) {
      return new Parameter(value, type);
    }
    function sql3(strings, ...args) {
      const query = strings && Array.isArray(strings.raw) ? new Query(strings, args, handler2, cancel) : typeof strings === "string" && !args.length ? new Identifier(options.transform.column.to ? options.transform.column.to(strings) : strings) : new Builder(strings, args);
      return query;
    }
    function unsafe(string, args = [], options2 = {}) {
      arguments.length === 2 && !Array.isArray(args) && (options2 = args, args = []);
      const query = new Query([string], args, handler2, cancel, {
        prepare: false,
        ...options2,
        simple: "simple" in options2 ? options2.simple : args.length === 0
      });
      return query;
    }
    function file(path, args = [], options2 = {}) {
      arguments.length === 2 && !Array.isArray(args) && (options2 = args, args = []);
      const query = new Query([], args, (query2) => {
        fs.readFile(path, "utf8", (err, string) => {
          if (err)
            return query2.reject(err);
          query2.strings = [string];
          handler2(query2);
        });
      }, cancel, {
        ...options2,
        simple: "simple" in options2 ? options2.simple : args.length === 0
      });
      return query;
    }
  }
  async function listen(name, fn, onlisten) {
    const listener = { fn, onlisten };
    const sql3 = listen.sql || (listen.sql = Postgres({
      ...options,
      max: 1,
      idle_timeout: null,
      max_lifetime: null,
      fetch_types: false,
      onclose() {
        Object.entries(listen.channels).forEach(([name2, { listeners }]) => {
          delete listen.channels[name2];
          Promise.all(listeners.map((l) => listen(name2, l.fn, l.onlisten).catch(() => {
          })));
        });
      },
      onnotify(c, x) {
        c in listen.channels && listen.channels[c].listeners.forEach((l) => l.fn(x));
      }
    }));
    const channels = listen.channels || (listen.channels = {}), exists2 = name in channels;
    if (exists2) {
      channels[name].listeners.push(listener);
      const result2 = await channels[name].result;
      listener.onlisten && listener.onlisten();
      return { state: result2.state, unlisten };
    }
    channels[name] = { result: sql3`listen ${sql3.unsafe('"' + name.replace(/"/g, '""') + '"')}`, listeners: [listener] };
    const result = await channels[name].result;
    listener.onlisten && listener.onlisten();
    return { state: result.state, unlisten };
    async function unlisten() {
      if (name in channels === false)
        return;
      channels[name].listeners = channels[name].listeners.filter((x) => x !== listener);
      if (channels[name].listeners.length)
        return;
      delete channels[name];
      return sql3`unlisten ${sql3.unsafe('"' + name.replace(/"/g, '""') + '"')}`;
    }
  }
  async function notify(channel, payload) {
    return await sql2`select pg_notify(${channel}, ${"" + payload})`;
  }
  async function reserve() {
    const queue = queue_default();
    const c = open.length ? open.shift() : await new Promise((resolve, reject) => {
      const query = { reserve: resolve, reject };
      queries.push(query);
      closed.length && connect(closed.shift(), query);
    });
    move(c, reserved);
    c.reserved = () => queue.length ? c.execute(queue.shift()) : move(c, reserved);
    c.reserved.release = true;
    const sql3 = Sql(handler2);
    sql3.release = () => {
      c.reserved = null;
      onopen(c);
    };
    return sql3;
    function handler2(q) {
      c.queue === full ? queue.push(q) : c.execute(q) || move(c, full);
    }
  }
  async function begin(options2, fn) {
    !fn && (fn = options2, options2 = "");
    const queries2 = queue_default();
    let savepoints = 0, connection2, prepare = null;
    try {
      await sql2.unsafe("begin " + options2.replace(/[^a-z ]/ig, ""), [], { onexecute }).execute();
      return await Promise.race([
        scope(connection2, fn),
        new Promise((_, reject) => connection2.onclose = reject)
      ]);
    } catch (error) {
      throw error;
    }
    async function scope(c, fn2, name) {
      const sql3 = Sql(handler2);
      sql3.savepoint = savepoint;
      sql3.prepare = (x) => prepare = x.replace(/[^a-z0-9$-_. ]/gi);
      let uncaughtError, result;
      name && await sql3`savepoint ${sql3(name)}`;
      try {
        result = await new Promise((resolve, reject) => {
          const x = fn2(sql3);
          Promise.resolve(Array.isArray(x) ? Promise.all(x) : x).then(resolve, reject);
        });
        if (uncaughtError)
          throw uncaughtError;
      } catch (e) {
        await (name ? sql3`rollback to ${sql3(name)}` : sql3`rollback`);
        throw e instanceof PostgresError && e.code === "25P02" && uncaughtError || e;
      }
      if (!name) {
        prepare ? await sql3`prepare transaction '${sql3.unsafe(prepare)}'` : await sql3`commit`;
      }
      return result;
      function savepoint(name2, fn3) {
        if (name2 && Array.isArray(name2.raw))
          return savepoint((sql4) => sql4.apply(sql4, arguments));
        arguments.length === 1 && (fn3 = name2, name2 = null);
        return scope(c, fn3, "s" + savepoints++ + (name2 ? "_" + name2 : ""));
      }
      function handler2(q) {
        q.catch((e) => uncaughtError || (uncaughtError = e));
        c.queue === full ? queries2.push(q) : c.execute(q) || move(c, full);
      }
    }
    function onexecute(c) {
      connection2 = c;
      move(c, reserved);
      c.reserved = () => queries2.length ? c.execute(queries2.shift()) : move(c, reserved);
    }
  }
  function move(c, queue) {
    c.queue.remove(c);
    queue.push(c);
    c.queue = queue;
    queue === open ? c.idleTimer.start() : c.idleTimer.cancel();
    return c;
  }
  function json2(x) {
    return new Parameter(x, 3802);
  }
  function array(x, type) {
    if (!Array.isArray(x))
      return array(Array.from(arguments));
    return new Parameter(x, type || (x.length ? inferType(x) || 25 : 0), options.shared.typeArrayMap);
  }
  function handler(query) {
    if (ending)
      return query.reject(Errors.connection("CONNECTION_ENDED", options, options));
    if (open.length)
      return go(open.shift(), query);
    if (closed.length)
      return connect(closed.shift(), query);
    busy.length ? go(busy.shift(), query) : queries.push(query);
  }
  function go(c, query) {
    return c.execute(query) ? move(c, busy) : move(c, full);
  }
  function cancel(query) {
    return new Promise((resolve, reject) => {
      query.state ? query.active ? connection_default(options).cancel(query.state, resolve, reject) : query.cancelled = { resolve, reject } : (queries.remove(query), query.cancelled = true, query.reject(Errors.generic("57014", "canceling statement due to user request")), resolve());
    });
  }
  async function end({ timeout = null } = {}) {
    if (ending)
      return ending;
    await 1;
    let timer2;
    return ending = Promise.race([
      new Promise((r) => timeout !== null && (timer2 = setTimeout(destroy, timeout * 1e3, r))),
      Promise.all(connections.map((c) => c.end()).concat(
        listen.sql ? listen.sql.end({ timeout: 0 }) : [],
        subscribe.sql ? subscribe.sql.end({ timeout: 0 }) : []
      ))
    ]).then(() => clearTimeout(timer2));
  }
  async function close() {
    await Promise.all(connections.map((c) => c.end()));
  }
  async function destroy(resolve) {
    await Promise.all(connections.map((c) => c.terminate()));
    while (queries.length)
      queries.shift().reject(Errors.connection("CONNECTION_DESTROYED", options));
    resolve();
  }
  function connect(c, query) {
    move(c, connecting);
    c.connect(query);
    return c;
  }
  function onend(c) {
    move(c, ended);
  }
  function onopen(c) {
    if (queries.length === 0)
      return move(c, open);
    let max = Math.ceil(queries.length / (connecting.length + 1)), ready = true;
    while (ready && queries.length && max-- > 0) {
      const query = queries.shift();
      if (query.reserve)
        return query.reserve(c);
      ready = c.execute(query);
    }
    ready ? move(c, busy) : move(c, full);
  }
  function onclose(c, e) {
    move(c, closed);
    c.reserved = null;
    c.onclose && (c.onclose(e), c.onclose = null);
    options.onclose && options.onclose(c.id);
    queries.length && connect(c, queries.shift());
  }
}
function parseOptions(a, b2) {
  if (a && a.shared)
    return a;
  const env = process.env, o = (!a || typeof a === "string" ? b2 : a) || {}, { url, multihost } = parseUrl(a), query = [...url.searchParams].reduce((a2, [b3, c]) => (a2[b3] = c, a2), {}), host = o.hostname || o.host || multihost || url.hostname || env.PGHOST || "localhost", port = o.port || url.port || env.PGPORT || 5432, user = o.user || o.username || url.username || env.PGUSERNAME || env.PGUSER || osUsername();
  o.no_prepare && (o.prepare = false);
  query.sslmode && (query.ssl = query.sslmode, delete query.sslmode);
  "timeout" in o && (console.log("The timeout option is deprecated, use idle_timeout instead"), o.idle_timeout = o.timeout);
  query.sslrootcert === "system" && (query.ssl = "verify-full");
  const ints = ["idle_timeout", "connect_timeout", "max_lifetime", "max_pipeline", "backoff", "keep_alive"];
  const defaults = {
    max: globalThis.Cloudflare ? 3 : 10,
    ssl: false,
    sslnegotiation: null,
    idle_timeout: null,
    connect_timeout: 30,
    max_lifetime,
    max_pipeline: 100,
    backoff,
    keep_alive: 60,
    prepare: true,
    debug: false,
    fetch_types: true,
    publications: "alltables",
    target_session_attrs: null
  };
  return {
    host: Array.isArray(host) ? host : host.split(",").map((x) => x.split(":")[0]),
    port: Array.isArray(port) ? port : host.split(",").map((x) => parseInt(x.split(":")[1] || port)),
    path: o.path || host.indexOf("/") > -1 && host + "/.s.PGSQL." + port,
    database: o.database || o.db || (url.pathname || "").slice(1) || env.PGDATABASE || user,
    user,
    pass: o.pass || o.password || url.password || env.PGPASSWORD || "",
    ...Object.entries(defaults).reduce(
      (acc, [k, d]) => {
        const value = k in o ? o[k] : k in query ? query[k] === "disable" || query[k] === "false" ? false : query[k] : env["PG" + k.toUpperCase()] || d;
        acc[k] = typeof value === "string" && ints.includes(k) ? +value : value;
        return acc;
      },
      {}
    ),
    connection: {
      application_name: env.PGAPPNAME || "postgres.js",
      ...o.connection,
      ...Object.entries(query).reduce((acc, [k, v]) => (k in defaults || (acc[k] = v), acc), {})
    },
    types: o.types || {},
    target_session_attrs: tsa(o, url, env),
    onnotice: o.onnotice,
    onnotify: o.onnotify,
    onclose: o.onclose,
    onparameter: o.onparameter,
    socket: o.socket,
    transform: parseTransform(o.transform || { undefined: void 0 }),
    parameters: {},
    shared: { retries: 0, typeArrayMap: {} },
    ...mergeUserTypes(o.types)
  };
}
function tsa(o, url, env) {
  const x = o.target_session_attrs || url.searchParams.get("target_session_attrs") || env.PGTARGETSESSIONATTRS;
  if (!x || ["read-write", "read-only", "primary", "standby", "prefer-standby"].includes(x))
    return x;
  throw new Error("target_session_attrs " + x + " is not supported");
}
function backoff(retries) {
  return (0.5 + Math.random() / 2) * Math.min(3 ** retries / 100, 20);
}
function max_lifetime() {
  return 60 * (30 + Math.random() * 30);
}
function parseTransform(x) {
  return {
    undefined: x.undefined,
    column: {
      from: typeof x.column === "function" ? x.column : x.column && x.column.from,
      to: x.column && x.column.to
    },
    value: {
      from: typeof x.value === "function" ? x.value : x.value && x.value.from,
      to: x.value && x.value.to
    },
    row: {
      from: typeof x.row === "function" ? x.row : x.row && x.row.from,
      to: x.row && x.row.to
    }
  };
}
function parseUrl(url) {
  if (!url || typeof url !== "string")
    return { url: { searchParams: /* @__PURE__ */ new Map() } };
  let host = url;
  host = host.slice(host.indexOf("://") + 3).split(/[?/]/)[0];
  host = decodeURIComponent(host.slice(host.indexOf("@") + 1));
  const urlObj = new URL(url.replace(host, host.split(",")[0]));
  return {
    url: {
      username: decodeURIComponent(urlObj.username),
      password: decodeURIComponent(urlObj.password),
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      searchParams: urlObj.searchParams
    },
    multihost: host.indexOf(",") > -1 && host
  };
}
function osUsername() {
  try {
    return os.userInfo().username;
  } catch (_) {
    return process.env.USERNAME || process.env.USER || process.env.LOGNAME;
  }
}

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/postgres-js/session.js
var PostgresJsPreparedQuery = class extends PgPreparedQuery {
  constructor(client2, queryString, params, logger2, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper) {
    super({ sql: queryString, params }, cache, queryMetadata, cacheConfig);
    this.client = client2;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger2;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [entityKind] = "PostgresJsPreparedQuery";
  async execute(placeholderValues = {}) {
    return tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = fillPlaceholders(this.params, placeholderValues);
      span?.setAttributes({
        "drizzle.query.text": this.queryString,
        "drizzle.query.params": JSON.stringify(params)
      });
      this.logger.logQuery(this.queryString, params);
      const { fields, queryString: query, client: client2, joinsNotNullableMap, customResultMapper } = this;
      if (!fields && !customResultMapper) {
        return tracer.startActiveSpan("drizzle.driver.execute", () => {
          return this.queryWithCache(query, params, async () => {
            return await client2.unsafe(query, params);
          });
        });
      }
      const rows = await tracer.startActiveSpan("drizzle.driver.execute", () => {
        span?.setAttributes({
          "drizzle.query.text": query,
          "drizzle.query.params": JSON.stringify(params)
        });
        return this.queryWithCache(query, params, async () => {
          return await client2.unsafe(query, params).values();
        });
      });
      return tracer.startActiveSpan("drizzle.mapResponse", () => {
        return customResultMapper ? customResultMapper(rows) : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
      });
    });
  }
  all(placeholderValues = {}) {
    return tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = fillPlaceholders(this.params, placeholderValues);
      span?.setAttributes({
        "drizzle.query.text": this.queryString,
        "drizzle.query.params": JSON.stringify(params)
      });
      this.logger.logQuery(this.queryString, params);
      return tracer.startActiveSpan("drizzle.driver.execute", () => {
        span?.setAttributes({
          "drizzle.query.text": this.queryString,
          "drizzle.query.params": JSON.stringify(params)
        });
        return this.queryWithCache(this.queryString, params, async () => {
          return this.client.unsafe(this.queryString, params);
        });
      });
    });
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};
var PostgresJsSession = class _PostgresJsSession extends PgSession {
  constructor(client2, dialect, schema, options = {}) {
    super(dialect);
    this.client = client2;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
    this.cache = options.cache ?? new NoopCache();
  }
  static [entityKind] = "PostgresJsSession";
  logger;
  cache;
  prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
    return new PostgresJsPreparedQuery(
      this.client,
      query.sql,
      query.params,
      this.logger,
      this.cache,
      queryMetadata,
      cacheConfig,
      fields,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  query(query, params) {
    this.logger.logQuery(query, params);
    return this.client.unsafe(query, params).values();
  }
  queryObjects(query, params) {
    return this.client.unsafe(query, params);
  }
  transaction(transaction, config) {
    return this.client.begin(async (client2) => {
      const session = new _PostgresJsSession(
        client2,
        this.dialect,
        this.schema,
        this.options
      );
      const tx = new PostgresJsTransaction(this.dialect, session, this.schema);
      if (config) {
        await tx.setTransaction(config);
      }
      return transaction(tx);
    });
  }
};
var PostgresJsTransaction = class _PostgresJsTransaction extends PgTransaction {
  constructor(dialect, session, schema, nestedIndex = 0) {
    super(dialect, session, schema, nestedIndex);
    this.session = session;
  }
  static [entityKind] = "PostgresJsTransaction";
  transaction(transaction) {
    return this.session.client.savepoint((client2) => {
      const session = new PostgresJsSession(
        client2,
        this.dialect,
        this.schema,
        this.session.options
      );
      const tx = new _PostgresJsTransaction(this.dialect, session, this.schema);
      return transaction(tx);
    });
  }
};

// ../../node_modules/.pnpm/drizzle-orm@0.45.2_@opentel_0695541276f1953b8f582ac811e479d3/node_modules/drizzle-orm/postgres-js/driver.js
var PostgresJsDatabase = class extends PgDatabase {
  static [entityKind] = "PostgresJsDatabase";
};
function construct(client2, config = {}) {
  const transparentParser = (val) => val;
  for (const type of ["1184", "1082", "1083", "1114", "1182", "1185", "1115", "1231"]) {
    client2.options.parsers[type] = transparentParser;
    client2.options.serializers[type] = transparentParser;
  }
  client2.options.serializers["114"] = transparentParser;
  client2.options.serializers["3802"] = transparentParser;
  const dialect = new PgDialect({ casing: config.casing });
  let logger2;
  if (config.logger === true) {
    logger2 = new DefaultLogger();
  } else if (config.logger !== false) {
    logger2 = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new PostgresJsSession(client2, dialect, schema, { logger: logger2, cache: config.cache });
  const db2 = new PostgresJsDatabase(dialect, session, schema);
  db2.$client = client2;
  db2.$cache = config.cache;
  if (db2.$cache) {
    db2.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db2;
}
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = src_default(params[0]);
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection: connection2, client: client2, ...drizzleConfig } = params[0];
    if (client2) return construct(client2, drizzleConfig);
    if (typeof connection2 === "object" && connection2.url !== void 0) {
      const { url, ...config } = connection2;
      const instance2 = src_default(url, config);
      return construct(instance2, drizzleConfig);
    }
    const instance = src_default(connection2);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
((drizzle2) => {
  function mock(config) {
    return construct({
      options: {
        parsers: {},
        serializers: {}
      }
    }, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));

// src/lib/db.ts
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}
var client = src_default(connectionString);
var db = drizzle(client, { schema: src_exports });

// src/lib/logger.ts
var import_pino = __toESM(require_pino(), 1);
var isProduction = process.env.NODE_ENV === "production";
var logger = (0, import_pino.default)({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']"
  ],
  ...isProduction ? {} : {
    transport: {
      target: "pino-pretty",
      options: { colorize: true }
    }
  }
});

// src/lib/generation-cache.ts
var GENERATOR_CACHE_VERSION = "reasoning-generator-v1";
var MOTIF_CACHE_VERSION = "motif-registry-v1";
var TOPOLOGY_CACHE_VERSION = "topology-contract-v1";
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const entries = Object.entries(
    value
  ).sort(
    ([left], [right]) => left.localeCompare(right)
  );
  return `{${entries.map(
    ([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`
  ).join(",")}}`;
}
function hashText2(value) {
  return createHash("sha256").update(value).digest("hex");
}
function buildPatternFingerprint(pattern) {
  return hashText2(
    stableStringify({
      id: pattern.id,
      type: pattern.type,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      difficulty: pattern.difficulty,
      generationDomain: pattern.generationDomain,
      arrangementType: pattern.arrangementType,
      arrangementTypes: pattern.arrangementTypes,
      orientationType: pattern.orientationType,
      orientationTypes: pattern.orientationTypes,
      participantCount: pattern.participantCount,
      clueTypes: pattern.clueTypes,
      inferenceDepth: pattern.inferenceDepth,
      formula: pattern.formula,
      templateVariants: pattern.templateVariants,
      variables: pattern.variables,
      distractorStrategy: pattern.distractorStrategy,
      explanationTemplate: pattern.explanationTemplate
    })
  );
}
function getRelevantMotifIds(pattern) {
  const supportedMotifs = pattern["supportedMotifs"];
  if (Array.isArray(
    supportedMotifs
  ) && supportedMotifs.length > 0) {
    return supportedMotifs.map(String).sort();
  }
  return [
    pattern.topic,
    pattern.subtopic
  ].filter(Boolean).map(
    (value) => value.toLowerCase()
  ).sort();
}
function inferCacheGenerationDomain(pattern) {
  if (pattern.generationDomain) {
    return pattern.generationDomain;
  }
  if (pattern.type === "di") {
    return "di";
  }
  const combinedText = `${pattern.topic} ${pattern.subtopic}`.toLowerCase();
  if (combinedText.includes(
    "seating"
  )) {
    return "seating-arrangement";
  }
  if (pattern.type === "logic") {
    return "reasoning";
  }
  return "quant";
}
function buildVersionBundle(pattern) {
  const generationDomain = inferCacheGenerationDomain(
    pattern
  );
  const motifVersion = `${MOTIF_CACHE_VERSION}:${hashText2(
    getRelevantMotifIds(pattern).join(
      "|"
    )
  )}`;
  const topologyVersion = `${TOPOLOGY_CACHE_VERSION}:${hashText2(
    stableStringify({
      generationDomain,
      arrangementType: pattern.arrangementType,
      arrangementTypes: pattern.arrangementTypes,
      orientationType: pattern.orientationType,
      orientationTypes: pattern.orientationTypes,
      participantCount: pattern.participantCount,
      clueTypes: pattern.clueTypes,
      inferenceDepth: pattern.inferenceDepth
    })
  )}`;
  return {
    generationDomain,
    generatorVersion: GENERATOR_CACHE_VERSION,
    motifVersion,
    topologyVersion
  };
}
function buildRequestFingerprint(pattern, count, options) {
  return hashText2(
    stableStringify({
      patternFingerprint: buildPatternFingerprint(
        pattern
      ),
      count,
      options: options ?? {}
    })
  );
}
function buildCacheKey(pattern, count, options) {
  const versions = buildVersionBundle(pattern);
  const requestFingerprint = buildRequestFingerprint(
    pattern,
    count,
    options
  );
  return {
    ...versions,
    requestFingerprint,
    key: hashText2(
      [
        versions.generatorVersion,
        versions.motifVersion,
        versions.topologyVersion,
        requestFingerprint
      ].join("|")
    )
  };
}
function buildArtifactMetadata(result) {
  const questions2 = result.questions;
  return {
    cachedQuestionCount: questions2.length,
    selectedMotifs: [
      ...new Set(
        questions2.map(
          (question) => question?.debugMetadata?.selectedMotif
        ).filter(
          (value) => Boolean(value)
        )
      )
    ],
    hasSolverTraces: questions2.some(
      (question) => Array.isArray(
        question?.debugMetadata?.solverTrace
      ) && question.debugMetadata.solverTrace.length > 0
    ),
    hasSvgSnapshots: questions2.some(
      (question) => Boolean(
        question.seatingDiagram ?? question?.debugMetadata?.seatingDiagram
      )
    ),
    hasExplanationFlow: questions2.some(
      (question) => Boolean(
        question.seatingExplanationFlow ?? question?.debugMetadata?.seatingExplanationFlow
      )
    )
  };
}
async function getCachedGenerationResult(pattern, count, options) {
  const cacheIdentity = buildCacheKey(
    pattern,
    count,
    options
  );
  try {
    const rows = await db.select().from(
      reasoningScenarioCache
    ).where(
      eq(
        reasoningScenarioCache.key,
        cacheIdentity.key
      )
    ).limit(1);
    const row = rows[0];
    if (!row) {
      return null;
    }
    await db.update(
      reasoningScenarioCache
    ).set({
      lastAccessedAt: /* @__PURE__ */ new Date(),
      hitCount: sql`${reasoningScenarioCache.hitCount} + 1`
    }).where(
      eq(
        reasoningScenarioCache.key,
        cacheIdentity.key
      )
    );
    logger.info(
      {
        patternId: pattern.id,
        generationDomain: cacheIdentity.generationDomain,
        cacheKey: cacheIdentity.key
      },
      "Generation cache hit"
    );
    return row.payload;
  } catch (error) {
    logger.warn(
      {
        patternId: pattern.id,
        error
      },
      "Generation cache lookup failed; falling back to live generation"
    );
    return null;
  }
}
async function cacheGenerationResult(pattern, count, options, result) {
  const cacheIdentity = buildCacheKey(
    pattern,
    count,
    options
  );
  const artifactMetadata = buildArtifactMetadata(result);
  try {
    await db.insert(reasoningScenarioCache).values({
      key: cacheIdentity.key,
      patternId: pattern.id,
      generationDomain: cacheIdentity.generationDomain,
      generatorVersion: cacheIdentity.generatorVersion,
      motifVersion: cacheIdentity.motifVersion,
      topologyVersion: cacheIdentity.topologyVersion,
      requestFingerprint: cacheIdentity.requestFingerprint,
      payload: result,
      artifactMetadata
    }).onConflictDoUpdate({
      target: reasoningScenarioCache.key,
      set: {
        payload: result,
        artifactMetadata,
        generatorVersion: cacheIdentity.generatorVersion,
        motifVersion: cacheIdentity.motifVersion,
        topologyVersion: cacheIdentity.topologyVersion,
        lastAccessedAt: /* @__PURE__ */ new Date()
      }
    });
    logger.info(
      {
        patternId: pattern.id,
        generationDomain: cacheIdentity.generationDomain,
        cacheKey: cacheIdentity.key,
        artifactMetadata
      },
      "Generation cache stored"
    );
  } catch (error) {
    logger.warn(
      {
        patternId: pattern.id,
        error
      },
      "Generation cache store failed; continuing without cache persistence"
    );
  }
}

// src/lib/reasoning/seating/diversity-engine.ts
var profileRegistry = [];
var topologyRegistry = /* @__PURE__ */ new Map();
var clueRegistry = /* @__PURE__ */ new Map();
var inferenceRegistry = /* @__PURE__ */ new Map();
function round5(value, digits = 3) {
  return Number(
    value.toFixed(digits)
  );
}
function jaccardSimilarity(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection = [...leftSet].filter(
    (token) => rightSet.has(token)
  ).length;
  const union2 = (/* @__PURE__ */ new Set([
    ...leftSet,
    ...rightSet
  ])).size;
  if (union2 === 0) {
    return 0;
  }
  return intersection / union2;
}
function maxSimilarity(target, profiles, selectTokens) {
  let best = 0;
  for (const profile of profiles) {
    best = Math.max(
      best,
      jaccardSimilarity(
        target,
        selectTokens(profile)
      )
    );
  }
  return best;
}
function normalizeScore(similarity, repeats) {
  return round5(
    Math.max(
      0.05,
      1 - similarity * 0.75 - Math.min(repeats, 5) * 0.08
    )
  );
}
function buildProfile(graph) {
  return {
    topologySignature: graph.topologySignature,
    clueSignature: graph.clueSignature,
    inferenceSignature: graph.inferenceSignature,
    topologyTokens: graph.topologyTokens,
    clueTokens: graph.clueTokens,
    inferenceTokens: graph.inferenceTokens
  };
}
function resetStructuralDiversityRegistry() {
  profileRegistry.length = 0;
  topologyRegistry.clear();
  clueRegistry.clear();
  inferenceRegistry.clear();
}
function analyzeStructuralDiversity(graph) {
  const exactTopologyRepeatCount = topologyRegistry.get(
    graph.topologySignature
  ) ?? 0;
  const exactClueRepeatCount = clueRegistry.get(
    graph.clueSignature
  ) ?? 0;
  const exactInferenceRepeatCount = inferenceRegistry.get(
    graph.inferenceSignature
  ) ?? 0;
  const maxTopologySimilarity = round5(
    maxSimilarity(
      graph.topologyTokens,
      profileRegistry,
      (profile) => profile.topologyTokens
    )
  );
  const maxClueSimilarity = round5(
    maxSimilarity(
      graph.clueTokens,
      profileRegistry,
      (profile) => profile.clueTokens
    )
  );
  const maxInferenceSimilarity = round5(
    maxSimilarity(
      graph.inferenceTokens,
      profileRegistry,
      (profile) => profile.inferenceTokens
    )
  );
  const topologyDiversityScore = normalizeScore(
    maxTopologySimilarity,
    exactTopologyRepeatCount
  );
  const clueDiversityScore = normalizeScore(
    maxClueSimilarity,
    exactClueRepeatCount
  );
  const inferenceDiversityScore = normalizeScore(
    maxInferenceSimilarity,
    exactInferenceRepeatCount
  );
  const repeatedAdjacencyChain = graph.repeatedAdjacencySerialization;
  const structuralDiversityScore = round5(
    topologyDiversityScore * 0.4 + clueDiversityScore * 0.3 + inferenceDiversityScore * 0.3
  );
  const warnings = [];
  if (exactTopologyRepeatCount >= 2) {
    warnings.push(
      `Topology signature repeated ${exactTopologyRepeatCount} times in this process.`
    );
  }
  if (exactClueRepeatCount >= 2) {
    warnings.push(
      `Clue signature repeated ${exactClueRepeatCount} times in this process.`
    );
  }
  if (exactInferenceRepeatCount >= 2) {
    warnings.push(
      `Inference signature repeated ${exactInferenceRepeatCount} times in this process.`
    );
  }
  if (repeatedAdjacencyChain) {
    warnings.push(
      "Adjacency-chain serialization pattern detected and penalized."
    );
  }
  const rejected = repeatedAdjacencyChain || structuralDiversityScore < 0.32 || maxTopologySimilarity >= 0.92 || maxClueSimilarity >= 0.95 || maxInferenceSimilarity >= 0.95;
  if (rejected) {
    warnings.push(
      "Structurally repetitive puzzle rejected by diversity analyzer."
    );
  }
  return {
    topologyDiversityScore,
    clueDiversityScore,
    inferenceDiversityScore,
    structuralDiversityScore,
    maxTopologySimilarity,
    maxClueSimilarity,
    maxInferenceSimilarity,
    exactTopologyRepeatCount,
    exactClueRepeatCount,
    exactInferenceRepeatCount,
    repeatedAdjacencyChain,
    rejected,
    warnings
  };
}
function recordStructuralSignature(graph) {
  profileRegistry.push(
    buildProfile(graph)
  );
  topologyRegistry.set(
    graph.topologySignature,
    (topologyRegistry.get(
      graph.topologySignature
    ) ?? 0) + 1
  );
  clueRegistry.set(
    graph.clueSignature,
    (clueRegistry.get(
      graph.clueSignature
    ) ?? 0) + 1
  );
  inferenceRegistry.set(
    graph.inferenceSignature,
    (inferenceRegistry.get(
      graph.inferenceSignature
    ) ?? 0) + 1
  );
}
function getStructuralDiversityScore(graph) {
  return analyzeStructuralDiversity(
    graph
  ).structuralDiversityScore;
}
function getRepeatedStructureWarnings(graph) {
  return analyzeStructuralDiversity(
    graph
  ).warnings;
}

// src/lib/reasoning/blood-relations.ts
var MALE_NAMES = [
  "Aman",
  "Rohit",
  "Nitin",
  "Arjun",
  "Vikas",
  "Sameer",
  "Kunal",
  "Tarun",
  "Mohan",
  "Raghav"
];
var FEMALE_NAMES = [
  "Anita",
  "Riya",
  "Pooja",
  "Neha",
  "Kavya",
  "Meera",
  "Sana",
  "Isha",
  "Tina",
  "Nisha"
];
function pickUniqueNames(count) {
  const malePool = shuffle(
    MALE_NAMES
  );
  const femalePool = shuffle(
    FEMALE_NAMES
  );
  const names = [];
  for (let index2 = 0; index2 < count; index2++) {
    if (index2 % 2 === 0) {
      names.push({
        name: malePool.pop() ?? `Male${index2}`,
        gender: "male"
      });
    } else {
      names.push({
        name: femalePool.pop() ?? `Female${index2}`,
        gender: "female"
      });
    }
  }
  return shuffle(names);
}
function createFamilyMemberMap() {
  const pickedNames = pickUniqueNames(8);
  return {
    gf: {
      id: "gf",
      name: pickedNames[0].name,
      gender: "male"
    },
    gm: {
      id: "gm",
      name: pickedNames[1].name,
      gender: "female",
      spouseId: "gf"
    },
    father: {
      id: "father",
      name: pickedNames[2].name,
      gender: "male",
      fatherId: "gf",
      motherId: "gm",
      spouseId: "mother"
    },
    mother: {
      id: "mother",
      name: pickedNames[3].name,
      gender: "female",
      spouseId: "father"
    },
    aunt: {
      id: "aunt",
      name: pickedNames[4].name,
      gender: "female",
      fatherId: "gf",
      motherId: "gm",
      spouseId: "uncle"
    },
    uncle: {
      id: "uncle",
      name: pickedNames[5].name,
      gender: "male",
      spouseId: "aunt"
    },
    child: {
      id: "child",
      name: pickedNames[6].name,
      gender: random() > 0.5 ? "male" : "female",
      fatherId: "father",
      motherId: "mother"
    },
    cousin: {
      id: "cousin",
      name: pickedNames[7].name,
      gender: random() > 0.5 ? "male" : "female",
      fatherId: "uncle",
      motherId: "aunt"
    }
  };
}
function relationByGender(maleLabel, femaleLabel, member) {
  return member.gender === "male" ? maleLabel : femaleLabel;
}
function getParents(members, memberId) {
  const member = members[memberId];
  if (!member) {
    return [];
  }
  return [
    member.fatherId,
    member.motherId
  ].filter(
    (parentId) => Boolean(parentId)
  );
}
function isSibling(members, firstId, secondId) {
  if (firstId === secondId) {
    return false;
  }
  const first = members[firstId];
  const second = members[secondId];
  return Boolean(
    first && second && first.fatherId && first.fatherId === second.fatherId && first.motherId && first.motherId === second.motherId
  );
}
function getBloodRelation(members, subjectId, targetId) {
  const subject = members[subjectId];
  const target = members[targetId];
  if (!subject || !target) {
    return "relative";
  }
  if (subject.spouseId === targetId) {
    return relationByGender(
      "husband",
      "wife",
      subject
    );
  }
  if (getParents(members, targetId).includes(
    subjectId
  )) {
    return relationByGender(
      "father",
      "mother",
      subject
    );
  }
  if (getParents(members, subjectId).includes(
    targetId
  )) {
    return relationByGender(
      "son",
      "daughter",
      subject
    );
  }
  if (isSibling(
    members,
    subjectId,
    targetId
  )) {
    return relationByGender(
      "brother",
      "sister",
      subject
    );
  }
  const grandparents = getParents(members, targetId).flatMap(
    (parentId) => getParents(
      members,
      parentId
    )
  );
  if (grandparents.includes(subjectId)) {
    return relationByGender(
      "grandfather",
      "grandmother",
      subject
    );
  }
  const subjectParents = getParents(members, subjectId);
  for (const parentId of subjectParents) {
    if (isSibling(
      members,
      parentId,
      targetId
    )) {
      return relationByGender(
        "nephew",
        "niece",
        subject
      );
    }
  }
  const targetParents = getParents(members, targetId);
  for (const parentId of targetParents) {
    if (isSibling(
      members,
      subjectId,
      parentId
    )) {
      return relationByGender(
        "uncle",
        "aunt",
        subject
      );
    }
  }
  if (subjectParents.some(
    (parentId) => targetParents.includes(parentId)
  )) {
    return relationByGender(
      "brother",
      "sister",
      subject
    );
  }
  if (subjectParents.length && targetParents.length && subjectParents.some(
    (parentId) => targetParents.some(
      (targetParentId) => isSibling(
        members,
        parentId,
        targetParentId
      )
    )
  )) {
    return "cousin";
  }
  return "relative";
}
function buildBloodRelationStatements(members, motif) {
  const father = members.father;
  const mother = members.mother;
  const child = members.child;
  const aunt = members.aunt;
  const uncle = members.uncle;
  const cousin = members.cousin;
  const gf = members.gf;
  const gm = members.gm;
  switch (motif.id) {
    case "direct_family_relation":
      return {
        statements: [
          `${father.name} is the father of ${child.name}.`
        ],
        subjectId: "father",
        targetId: "child"
      };
    case "generation_gap_reasoning":
      return {
        statements: [
          `${gf.name} is the father of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`
        ],
        subjectId: "gf",
        targetId: "child"
      };
    case "gender_based_inference":
      return {
        statements: [
          `${child.name} is the ${relationByGender("son", "daughter", child)} of ${mother.name}.`,
          `${mother.name} is the sister of ${aunt.name}.`
        ],
        subjectId: "child",
        targetId: "aunt"
      };
    case "conditional_family_inference":
      return {
        statements: [
          `${father.name} is the husband of ${mother.name}.`,
          `${aunt.name} is the sister of ${father.name}.`,
          `${cousin.name} is the child of ${aunt.name}.`
        ],
        subjectId: "cousin",
        targetId: "mother"
      };
    case "circular_relation_chain":
      return {
        statements: [
          `${uncle.name} is the husband of ${aunt.name}.`,
          `${aunt.name} is the sister of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`
        ],
        subjectId: "uncle",
        targetId: "child"
      };
    case "indirect_relation_deduction":
    default:
      return {
        statements: [
          `${gm.name} is the mother of ${father.name}.`,
          `${father.name} is the father of ${child.name}.`,
          `${aunt.name} is the mother of ${cousin.name}.`,
          `${aunt.name} is the sister of ${father.name}.`
        ],
        subjectId: "cousin",
        targetId: "child"
      };
  }
}
function buildBloodRelationReasoningSteps(members, subjectId, targetId, motif) {
  const subject = members[subjectId];
  const target = members[targetId];
  const steps = [
    createReasoningStep(
      "compare",
      `Track how ${subject.name} is connected to ${target.name} through the family chain.`
    )
  ];
  if (motif.inferenceStyle === "conditional") {
    steps.push(
      createReasoningStep(
        "filter",
        "Use the condition or marriage clue before fixing the final blood relation."
      )
    );
  }
  if (motif.inferenceStyle === "hidden") {
    steps.push(
      createReasoningStep(
        "infer",
        "Infer the indirect family link created by the intermediate relatives."
      )
    );
  }
  steps.push(
    createReasoningStep(
      "compare",
      `Name the exact relation of ${subject.name} to ${target.name}.`
    )
  );
  return steps;
}
function buildBloodRelationDistractors(relation) {
  const distractorMap = {
    father: [
      "uncle",
      "brother",
      "grandfather"
    ],
    mother: [
      "aunt",
      "sister",
      "grandmother"
    ],
    son: [
      "brother",
      "nephew",
      "cousin"
    ],
    daughter: [
      "sister",
      "niece",
      "cousin"
    ],
    brother: [
      "cousin",
      "uncle",
      "son"
    ],
    sister: [
      "cousin",
      "aunt",
      "daughter"
    ],
    grandfather: [
      "father",
      "uncle",
      "brother"
    ],
    grandmother: [
      "mother",
      "aunt",
      "sister"
    ],
    uncle: [
      "father",
      "brother",
      "cousin"
    ],
    aunt: [
      "mother",
      "sister",
      "cousin"
    ],
    nephew: [
      "son",
      "brother",
      "cousin"
    ],
    niece: [
      "daughter",
      "sister",
      "cousin"
    ],
    cousin: [
      "brother",
      "nephew",
      "uncle"
    ],
    relative: [
      "cousin",
      "uncle",
      "brother"
    ]
  };
  return distractorMap[relation] ?? [
    "cousin",
    "uncle",
    "brother"
  ];
}
function buildBloodRelationOptions(relation) {
  const distractors = buildBloodRelationDistractors(
    relation
  );
  const optionMetadata = [
    {
      value: relation,
      isCorrect: true
    },
    ...distractors.map(
      (distractor) => ({
        value: distractor,
        isCorrect: false,
        distractorType: "wrongIntermediateValue",
        likelyMistake: "Stopped the family chain too early or chose a nearby relation.",
        reasoningTrap: "Common family-chain confusion trap."
      })
    )
  ];
  const shuffled = shuffle(
    optionMetadata
  );
  return {
    options: shuffled.map(
      (option) => option.value
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect
    ),
    optionMetadata: shuffled
  };
}
function createBloodRelationScenario(motif) {
  const members = createFamilyMemberMap();
  const scenario = buildBloodRelationStatements(
    members,
    motif
  );
  const relation = getBloodRelation(
    members,
    scenario.subjectId,
    scenario.targetId
  );
  return {
    members,
    ...scenario,
    relation,
    reasoningSteps: buildBloodRelationReasoningSteps(
      members,
      scenario.subjectId,
      scenario.targetId,
      motif
    )
  };
}
function buildBloodRelationStem(scenario, examProfile, wordingStyle) {
  const subject = scenario.members[scenario.subjectId];
  const target = scenario.members[scenario.targetId];
  const intro = wordingStyle === "concise" ? "In a family," : wordingStyle === "inference-heavy" ? "Study the following family clues carefully:" : "Consider the following family information:";
  void examProfile;
  return `${intro} ${scenario.statements.join(" ")} How is ${subject.name} related to ${target.name}?`;
}
function buildBloodRelationExplanation(scenario) {
  const subject = scenario.members[scenario.subjectId];
  const target = scenario.members[scenario.targetId];
  return `Track the chain in order. ${scenario.reasoningSteps.map((step) => step.detail).join(" ")} Therefore, ${subject.name} is the ${scenario.relation} of ${target.name}.`;
}

// src/lib/reasoning/coding-decoding.ts
var CODING_WORD_POOL = [
  "BANK",
  "MIND",
  "TEAM",
  "ROAD",
  "SCALE",
  "PLANT",
  "TRACK",
  "SMART",
  "CREDIT",
  "MARKET"
];
function shiftLetter(char2, shift) {
  const base = char2.charCodeAt(0) - 65;
  const normalized = (base + shift + 26 * 3) % 26;
  return String.fromCharCode(
    normalized + 65
  );
}
function reverseAlphabetLetter(char2) {
  const index2 = char2.charCodeAt(0) - 65;
  return String.fromCharCode(
    90 - index2
  );
}
function pickCodingWord(difficulty) {
  const filteredWords = CODING_WORD_POOL.filter(
    (word) => difficulty === "Easy" ? word.length <= 5 : difficulty === "Hard" ? word.length >= 5 : word.length >= 4
  );
  return pickRandomItem(
    filteredWords.length ? filteredWords : CODING_WORD_POOL
  );
}
function encodeWordByMotif(word, motif, values2) {
  const shift = values2.shift ?? 1;
  switch (motif.id) {
    case "direct_alphabet_shift":
      return word.split("").map(
        (char2) => shiftLetter(char2, shift)
      ).join("");
    case "reverse_alphabet_mapping":
      return word.split("").map(
        (char2) => reverseAlphabetLetter(
          char2
        )
      ).join("");
    case "symbolic_position_encoding":
      return word.split("").map(
        (char2, index2) => index2 % 2 === 0 ? String(
          char2.charCodeAt(0) - 64
        ) : shiftLetter(
          char2,
          shift
        )
      ).join("-");
    case "conditional_letter_mapping":
      return word.split("").map(
        (char2) => /[AEIOU]/.test(char2) ? shiftLetter(
          char2,
          1
        ) : shiftLetter(
          char2,
          -1
        )
      ).join("");
    case "multi_stage_word_transform":
      return word.split("").reverse().map(
        (char2, index2) => shiftLetter(
          char2,
          index2 % 2 === 0 ? 1 : 2
        )
      ).join("");
    case "inference_based_decoding":
      return word.split("").map(
        (char2, index2) => shiftLetter(
          char2,
          index2 + 1
        )
      ).join("");
    default:
      return word.split("").map(
        (char2) => shiftLetter(char2, shift)
      ).join("");
  }
}
function buildCodingQuestionStem(sourceWord, motif, values2, exampleWord, exampleCode) {
  switch (motif.id) {
    case "direct_alphabet_shift":
      return `If each letter is shifted forward by ${values2.shift ?? 1}, how will ${sourceWord} be coded?`;
    case "reverse_alphabet_mapping":
      return `If every letter is replaced by its opposite alphabet letter, how will ${sourceWord} be coded?`;
    case "symbolic_position_encoding":
      return `If odd-position letters are converted into positions and even-position letters are shifted, how will ${sourceWord} be coded?`;
    case "conditional_letter_mapping":
      return `If vowels are moved one step forward and consonants one step backward, how will ${sourceWord} be coded?`;
    case "multi_stage_word_transform":
      return `If the word is first reversed and then alternate letters are shifted, how will ${sourceWord} be coded?`;
    case "inference_based_decoding":
      if (exampleWord && exampleCode) {
        return `If ${exampleWord} is coded as ${exampleCode}, then how will ${sourceWord} be coded?`;
      }
      return `Infer the hidden coding rule and determine the code of ${sourceWord}.`;
    default:
      return `How will ${sourceWord} be coded according to the given rule?`;
  }
}
function buildCodingDistractorOptions(word, correctCode, motif, difficulty, values2) {
  const options = /* @__PURE__ */ new Map();
  options.set(correctCode, {
    value: correctCode,
    isCorrect: true
  });
  const addOption = (value, metadata) => {
    if (!options.has(value)) {
      options.set(value, {
        value,
        isCorrect: false,
        ...metadata
      });
    }
  };
  addOption(
    word.split("").map(
      (char2) => shiftLetter(
        char2,
        -(values2.shift ?? 1)
      )
    ).join(""),
    {
      distractorType: "wrongIntermediateValue",
      likelyMistake: "Applied the shift in the opposite direction.",
      reasoningTrap: "Reverse-direction coding trap."
    }
  );
  addOption(
    word.split("").map(
      (char2) => shiftLetter(
        char2,
        (values2.shift ?? 1) + 1
      )
    ).join(""),
    {
      distractorType: "arithmeticSlip",
      likelyMistake: "Used an off-by-one letter movement.",
      reasoningTrap: "Close-shift coding trap."
    }
  );
  addOption(
    word.split("").reverse().join(""),
    {
      distractorType: "comparisonTrap",
      likelyMistake: "Reordered the word without completing the coding rule.",
      reasoningTrap: "Partial transformation trap."
    }
  );
  if (motif.id === "inference_based_decoding") {
    addOption(
      word.split("").map(
        (char2, index2) => shiftLetter(
          char2,
          index2
        )
      ).join(""),
      {
        distractorType: "wrongIntermediateValue",
        likelyMistake: "Started the inferred shift sequence from the wrong position.",
        reasoningTrap: "Inference-sequence trap."
      }
    );
  }
  while (options.size < 4) {
    addOption(
      word.split("").map(
        (char2, index2) => shiftLetter(
          char2,
          difficulty === "Hard" ? index2 % 2 + 1 : 1
        )
      ).join(""),
      {
        distractorType: "prematureRounding",
        likelyMistake: "Simplified the coding rule too early.",
        reasoningTrap: "Oversimplified coding trap."
      }
    );
  }
  const correctOption = options.get(correctCode);
  const distractors = [
    ...options.values()
  ].filter(
    (option) => !option.isCorrect
  ).slice(0, 3);
  const shuffled = shuffle([
    correctOption,
    ...distractors
  ]);
  return {
    options: shuffled.map(
      (option) => option.value
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect
    ),
    optionMetadata: shuffled
  };
}
function buildCodingExplanation(sourceWord, codedWord) {
  return `Apply the coding rule step by step to ${sourceWord} and obtain ${codedWord}.`;
}

// src/lib/reasoning/direction-sense.ts
var CARDINAL_DIRECTIONS = [
  "North",
  "East",
  "South",
  "West"
];
var DIRECTION_TRAVELERS = [
  "Ravi",
  "Anita",
  "Karan",
  "Neha",
  "Amit",
  "Pooja",
  "Vikas",
  "Meera"
];
function turnFacing(facing, turn) {
  const facingIndex = CARDINAL_DIRECTIONS.indexOf(
    facing
  );
  const offset = turn === "left" ? -1 : turn === "right" ? 1 : 2;
  return CARDINAL_DIRECTIONS[(facingIndex + offset + 4) % 4];
}
function moveAlongFacing(x, y, facing, distance) {
  switch (facing) {
    case "North":
      return { x, y: y + distance };
    case "South":
      return { x, y: y - distance };
    case "East":
      return { x: x + distance, y };
    case "West":
    default:
      return { x: x - distance, y };
  }
}
function pickDirectionDistance(difficulty) {
  if (difficulty === "Easy") {
    return pickRandomItem([
      2,
      3,
      4,
      5,
      6,
      8
    ]);
  }
  if (difficulty === "Hard") {
    return pickRandomItem([
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      12
    ]);
  }
  return pickRandomItem([
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ]);
}
function createDirectionMoveText(move) {
  if (!move.turn) {
    return `walks ${move.distance} m straight`;
  }
  const turnText = move.turn === "back" ? "turns back and walks" : `turns ${move.turn} and walks`;
  return `${turnText} ${move.distance} m`;
}
function formatCoordinate(x, y) {
  return `(${x}, ${y})`;
}
function createDirectionMoves(motif, difficulty) {
  const moveCount = motif.id === "straight_path_distance" ? 1 : motif.id === "simple_turn_tracking" ? 2 : motif.id === "shortest_distance_inference" ? 3 : motif.id === "orientation_shift_chain" ? 4 : difficulty === "Hard" ? 5 : 4;
  const turnPool = motif.id === "straight_path_distance" ? [] : motif.id === "simple_turn_tracking" ? ["left", "right"] : motif.id === "orientation_shift_chain" ? ["left", "right", "back"] : ["left", "right"];
  const moves = [];
  for (let index2 = 0; index2 < moveCount; index2++) {
    const distance = pickDirectionDistance(
      difficulty
    );
    if (!turnPool.length || index2 === 0) {
      moves.push({ distance });
      continue;
    }
    const turn = difficulty === "Hard" && motif.id !== "conditional_movement_reasoning" && motif.id !== "coordinate_inference_chain" && index2 === moveCount - 1 ? "back" : pickRandomItem(turnPool);
    moves.push({
      turn,
      distance,
      note: motif.id === "conditional_movement_reasoning" && index2 >= 2 ? "Track the facing carefully after this turn." : void 0
    });
  }
  return moves;
}
function buildDirectionReasoningTrail(traveler, startFacing, moves) {
  let facing = startFacing;
  let x = 0;
  let y = 0;
  const steps = [];
  moves.forEach((move, index2) => {
    const startingFacing = facing;
    if (move.turn) {
      facing = turnFacing(
        facing,
        move.turn
      );
      steps.push(
        createReasoningStep(
          "transform",
          `${traveler} turns ${move.turn} from ${startingFacing} and now faces ${facing}.`
        )
      );
    }
    const nextPosition = moveAlongFacing(
      x,
      y,
      facing,
      move.distance
    );
    x = nextPosition.x;
    y = nextPosition.y;
    steps.push(
      createReasoningStep(
        index2 === 0 ? "transform" : "infer",
        `${traveler} then moves ${move.distance} m towards ${facing} and reaches ${formatCoordinate(
          x,
          y
        )}.`
      )
    );
  });
  return {
    finalFacing: facing,
    finalX: x,
    finalY: y,
    reasoningSteps: steps
  };
}
function getShortestDistance(x, y) {
  const squaredDistance = x * x + y * y;
  const distance = Math.sqrt(
    squaredDistance
  );
  return Number.isInteger(distance) ? distance : Number(distance.toFixed(1));
}
function chooseDirectionQuestionType(motif, difficulty) {
  if (motif.id === "straight_path_distance") {
    return "distance";
  }
  if (motif.id === "simple_turn_tracking") {
    return difficulty === "Easy" ? "facing" : "distance";
  }
  if (motif.id === "shortest_distance_inference") {
    return "distance";
  }
  if (motif.id === "orientation_shift_chain") {
    return "facing";
  }
  if (motif.id === "conditional_movement_reasoning" || motif.id === "coordinate_inference_chain") {
    return random() > 0.5 ? "coordinates" : "distance";
  }
  return "distance";
}
function createDirectionSenseScenario(motif, difficulty) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const traveler = pickRandomItem(
      DIRECTION_TRAVELERS
    );
    const startFacing = pickRandomItem(
      CARDINAL_DIRECTIONS
    );
    const moves = createDirectionMoves(
      motif,
      difficulty
    );
    const trail = buildDirectionReasoningTrail(
      traveler,
      startFacing,
      moves
    );
    const questionType = chooseDirectionQuestionType(
      motif,
      difficulty
    );
    const shortestDistance = getShortestDistance(
      trail.finalX,
      trail.finalY
    );
    if (questionType === "distance" && motif.id === "shortest_distance_inference" && !Number.isInteger(
      shortestDistance
    )) {
      continue;
    }
    return {
      traveler,
      startFacing,
      moves,
      questionType,
      finalFacing: trail.finalFacing,
      finalX: trail.finalX,
      finalY: trail.finalY,
      shortestDistance,
      correctAnswer: questionType === "facing" ? trail.finalFacing : questionType === "coordinates" ? formatCoordinate(
        trail.finalX,
        trail.finalY
      ) : String(shortestDistance),
      reasoningSteps: trail.reasoningSteps
    };
  }
  const fallback = buildDirectionReasoningTrail(
    "Ravi",
    "North",
    [
      { distance: 4 },
      {
        turn: "right",
        distance: 3
      }
    ]
  );
  return {
    traveler: "Ravi",
    startFacing: "North",
    moves: [
      { distance: 4 },
      { turn: "right", distance: 3 }
    ],
    questionType: "distance",
    finalFacing: fallback.finalFacing,
    finalX: fallback.finalX,
    finalY: fallback.finalY,
    shortestDistance: 5,
    correctAnswer: "5",
    reasoningSteps: fallback.reasoningSteps
  };
}
function buildDirectionSenseStem(scenario, examProfile, wordingStyle) {
  const intro = wordingStyle === "concise" ? `${scenario.traveler} starts facing ${scenario.startFacing}.` : wordingStyle === "inference-heavy" ? `${scenario.traveler} begins at the origin facing ${scenario.startFacing}. Track every turn and movement carefully.` : `${scenario.traveler} is standing at a point facing ${scenario.startFacing}.`;
  const movementText = scenario.moves.map(
    (move, index2) => index2 === 0 ? `${scenario.traveler} ${createDirectionMoveText(
      move
    )}` : `then ${createDirectionMoveText(
      move
    )}`
  ).join(", ") + ".";
  const question = scenario.questionType === "facing" ? `Which direction is ${scenario.traveler} facing at the end?` : scenario.questionType === "coordinates" ? `What are the final coordinates of ${scenario.traveler} from the starting point, taking the start as ${formatCoordinate(
    0,
    0
  )}?` : `What is the shortest distance of ${scenario.traveler} from the starting point?`;
  void examProfile;
  return `${intro} ${movementText} ${question}`;
}
function buildDirectionSenseExplanation(scenario) {
  const conclusion = scenario.questionType === "facing" ? `${scenario.traveler} finally faces ${scenario.finalFacing}.` : scenario.questionType === "coordinates" ? `${scenario.traveler} finally reaches ${formatCoordinate(
    scenario.finalX,
    scenario.finalY
  )}.` : `The final position is ${formatCoordinate(
    scenario.finalX,
    scenario.finalY
  )}, so the shortest distance from the starting point is ${scenario.shortestDistance} m.`;
  return `Track the path in order. ${scenario.reasoningSteps.map((step) => step.detail).join(" ")} ${conclusion}`;
}
function buildDirectionSenseOptions(scenario) {
  const options = /* @__PURE__ */ new Map();
  const correctValue = scenario.correctAnswer;
  options.set(correctValue, {
    value: correctValue,
    isCorrect: true
  });
  const addOption = (value, metadata) => {
    if (value !== correctValue && !options.has(value)) {
      options.set(value, {
        value,
        isCorrect: false,
        ...metadata
      });
    }
  };
  if (scenario.questionType === "facing") {
    addOption(
      turnFacing(
        scenario.finalFacing,
        "back"
      ),
      {
        distractorType: "wrongIntermediateValue",
        likelyMistake: "Tracked the last movement but missed the final orientation change.",
        reasoningTrap: "Final-facing reversal trap."
      }
    );
    addOption(
      turnFacing(
        scenario.finalFacing,
        "left"
      ),
      {
        distractorType: "comparisonTrap",
        likelyMistake: "Confused a right turn with a left turn during the chain.",
        reasoningTrap: "Left-right confusion trap."
      }
    );
    addOption(
      scenario.startFacing,
      {
        distractorType: "cumulativeMistake",
        likelyMistake: "Ignored the cumulative effect of multiple turns.",
        reasoningTrap: "Starting-direction carryover trap."
      }
    );
  } else if (scenario.questionType === "coordinates") {
    addOption(
      formatCoordinate(
        scenario.finalY,
        scenario.finalX
      ),
      {
        distractorType: "comparisonTrap",
        likelyMistake: "Swapped the east-west and north-south coordinates.",
        reasoningTrap: "Axis-swap trap."
      }
    );
    addOption(
      formatCoordinate(
        -scenario.finalX,
        scenario.finalY
      ),
      {
        distractorType: "wrongIntermediateValue",
        likelyMistake: "Handled one horizontal turn in the opposite direction.",
        reasoningTrap: "Sign-direction trap."
      }
    );
    addOption(
      formatCoordinate(
        scenario.finalX,
        -scenario.finalY
      ),
      {
        distractorType: "cumulativeMistake",
        likelyMistake: "Reversed the vertical displacement after the last turn.",
        reasoningTrap: "North-south reversal trap."
      }
    );
  } else {
    const totalPath = scenario.moves.reduce(
      (sum, move) => sum + move.distance,
      0
    );
    addOption(
      String(totalPath),
      {
        distractorType: "cumulativeMistake",
        likelyMistake: "Added the full path length instead of finding the shortest distance.",
        reasoningTrap: "Path-length trap."
      }
    );
    addOption(
      String(
        Math.abs(scenario.finalX) + Math.abs(scenario.finalY)
      ),
      {
        distractorType: "wrongIntermediateValue",
        likelyMistake: "Used horizontal and vertical displacements directly without forming the final distance.",
        reasoningTrap: "Coordinate-sum trap."
      }
    );
    addOption(
      String(
        Math.max(
          Math.abs(scenario.finalX),
          Math.abs(scenario.finalY)
        )
      ),
      {
        distractorType: "comparisonTrap",
        likelyMistake: "Picked the larger displacement component as the answer.",
        reasoningTrap: "Single-axis comparison trap."
      }
    );
  }
  const shuffled = shuffle([
    ...options.values()
  ].slice(0, 4));
  return {
    options: shuffled.map(
      (option) => option.value
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect
    ),
    optionMetadata: shuffled
  };
}

// src/lib/reasoning/inequality.ts
var INEQUALITY_SYMBOL_POOL = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];
function pickInequalitySymbols(count) {
  return shuffle(
    INEQUALITY_SYMBOL_POOL
  ).slice(0, count);
}
function renderInequalityFact(fact) {
  return `${fact.left} ${fact.relation} ${fact.right}`;
}
function buildInequalityDisjointSet(facts, symbols) {
  const parent = /* @__PURE__ */ new Map();
  symbols.forEach((symbol) => {
    parent.set(symbol, symbol);
  });
  const find = (symbol) => {
    const current = parent.get(symbol) ?? symbol;
    if (current !== symbol) {
      const root = find(current);
      parent.set(symbol, root);
      return root;
    }
    return current;
  };
  const union2 = (left, right) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) {
      parent.set(rightRoot, leftRoot);
    }
  };
  facts.filter(
    (fact) => fact.relation === "="
  ).forEach((fact) => {
    union2(fact.left, fact.right);
  });
  return { find };
}
function resolveInequalityRelation(symbols, facts, left, right) {
  const { find } = buildInequalityDisjointSet(
    facts,
    symbols
  );
  const adjacency = /* @__PURE__ */ new Map();
  facts.filter(
    (fact) => fact.relation === ">"
  ).forEach((fact) => {
    const from = find(fact.left);
    const to = find(fact.right);
    if (from === to) {
      return;
    }
    if (!adjacency.has(from)) {
      adjacency.set(
        from,
        /* @__PURE__ */ new Set()
      );
    }
    adjacency.get(from).add(to);
  });
  const hasPath = (from, to) => {
    if (from === to) {
      return true;
    }
    const visited = /* @__PURE__ */ new Set();
    const queue = [from];
    while (queue.length) {
      const current = queue.shift();
      if (current === to) {
        return true;
      }
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);
      const nextNodes = adjacency.get(current);
      if (!nextNodes) {
        continue;
      }
      nextNodes.forEach((node) => {
        if (!visited.has(node)) {
          queue.push(node);
        }
      });
    }
    return false;
  };
  const leftRoot = find(left);
  const rightRoot = find(right);
  if (leftRoot === rightRoot) {
    return "=";
  }
  if (hasPath(leftRoot, rightRoot)) {
    return ">";
  }
  if (hasPath(rightRoot, leftRoot)) {
    return "<";
  }
  return "unknown";
}
function formatInequalityAnswer(left, relation, right) {
  if (relation === "unknown") {
    return "Cannot be determined";
  }
  return `${left} ${relation} ${right}`;
}
function buildInequalityReasoningSteps(facts, queryLeft, queryRight, resolvedRelation) {
  const steps = facts.map(
    (fact) => createReasoningStep(
      "compare",
      `From the statement ${renderInequalityFact(
        fact
      )}, record the direct comparison.`
    )
  );
  if (resolvedRelation === "=") {
    steps.push(
      createReasoningStep(
        "infer",
        `${queryLeft} and ${queryRight} fall in the same equality group.`
      )
    );
  } else if (resolvedRelation === "unknown") {
    steps.push(
      createReasoningStep(
        "infer",
        `The chains do not create a definite link between ${queryLeft} and ${queryRight}, so the relation remains uncertain.`
      )
    );
  } else {
    steps.push(
      createReasoningStep(
        "infer",
        `Combine the linked statements transitively to infer that ${queryLeft} ${resolvedRelation} ${queryRight}.`
      )
    );
  }
  return steps;
}
function createInequalityScenario(motif, difficulty) {
  const symbolCount = motif.id === "direct_inequality_reading" ? 2 : motif.id === "single_chain_deduction" ? 3 : difficulty === "Hard" ? 5 : 4;
  const symbols = pickInequalitySymbols(symbolCount);
  const [a, b2, c, d, e] = symbols;
  let facts = [];
  let queryLeft = a;
  let queryRight = b2;
  let questionStyle = "relation";
  switch (motif.id) {
    case "direct_inequality_reading": {
      const relation = pickRandomItem([
        ">",
        "=",
        "<"
      ]);
      if (relation === "<") {
        facts = [
          {
            left: b2,
            relation: ">",
            right: a
          }
        ];
      } else {
        facts = [
          {
            left: a,
            relation,
            right: b2
          }
        ];
      }
      break;
    }
    case "single_chain_deduction":
      facts = random() > 0.5 ? [
        {
          left: a,
          relation: ">",
          right: b2
        },
        {
          left: b2,
          relation: ">",
          right: c
        }
      ] : [
        {
          left: a,
          relation: "=",
          right: b2
        },
        {
          left: b2,
          relation: ">",
          right: c
        }
      ];
      queryRight = c;
      break;
    case "compound_inequality_linking":
      facts = [
        {
          left: a,
          relation: ">",
          right: b2
        },
        {
          left: b2,
          relation: "=",
          right: c
        },
        {
          left: c,
          relation: ">",
          right: d
        }
      ];
      queryRight = d;
      questionStyle = "conclusion";
      break;
    case "indirect_conclusion_validation":
      facts = [
        {
          left: a,
          relation: ">",
          right: b2
        },
        {
          left: c,
          relation: "=",
          right: b2
        },
        {
          left: d,
          relation: ">",
          right: c
        }
      ];
      queryLeft = d;
      queryRight = a;
      questionStyle = "conclusion";
      break;
    case "uncertain_branch_comparison":
      facts = [
        {
          left: a,
          relation: ">",
          right: b2
        },
        {
          left: b2,
          relation: ">",
          right: c
        },
        {
          left: a,
          relation: ">",
          right: d
        },
        {
          left: d,
          relation: ">",
          right: c
        }
      ];
      queryLeft = b2;
      queryRight = d;
      questionStyle = "conclusion";
      break;
    case "nested_symbolic_reasoning":
      facts = [
        {
          left: a,
          relation: ">",
          right: b2
        },
        {
          left: b2,
          relation: "=",
          right: c
        },
        {
          left: d,
          relation: ">",
          right: c
        },
        {
          left: d,
          relation: ">",
          right: e
        }
      ];
      queryLeft = a;
      queryRight = e;
      questionStyle = "conclusion";
      break;
    default:
      facts = [
        {
          left: a,
          relation: ">",
          right: b2
        },
        {
          left: b2,
          relation: "=",
          right: c
        },
        {
          left: c,
          relation: ">",
          right: d
        }
      ];
      queryRight = d;
      questionStyle = "conclusion";
      break;
  }
  const correctRelation = resolveInequalityRelation(
    symbols,
    facts,
    queryLeft,
    queryRight
  );
  return {
    symbols,
    facts,
    queryLeft,
    queryRight,
    questionStyle,
    correctRelation,
    reasoningSteps: buildInequalityReasoningSteps(
      facts,
      queryLeft,
      queryRight,
      correctRelation
    )
  };
}
function buildInequalityStem(scenario, examProfile, wordingStyle) {
  const intro = wordingStyle === "concise" ? "Study the inequalities." : wordingStyle === "inference-heavy" ? "Analyse the following symbolic comparisons carefully before drawing the final conclusion." : "Consider the following inequality statements.";
  const statementText = scenario.facts.map(renderInequalityFact).join(", ");
  const question = scenario.questionStyle === "conclusion" ? `Which conclusion definitely follows about ${scenario.queryLeft} and ${scenario.queryRight}?` : `What is the correct relation between ${scenario.queryLeft} and ${scenario.queryRight}?`;
  void examProfile;
  return `${intro} ${statementText}. ${question}`;
}
function buildInequalityExplanation(scenario) {
  return `Link the statements step by step. ${scenario.reasoningSteps.map((step) => step.detail).join(" ")} Therefore, ${formatInequalityAnswer(
    scenario.queryLeft,
    scenario.correctRelation,
    scenario.queryRight
  )} is the correct conclusion.`;
}
function buildInequalityOptions(scenario) {
  const correctValue = formatInequalityAnswer(
    scenario.queryLeft,
    scenario.correctRelation,
    scenario.queryRight
  );
  const options = /* @__PURE__ */ new Map();
  options.set(correctValue, {
    value: correctValue,
    isCorrect: true
  });
  const addOption = (value, metadata) => {
    if (value !== correctValue && !options.has(value)) {
      options.set(value, {
        value,
        isCorrect: false,
        ...metadata
      });
    }
  };
  addOption(
    `${scenario.queryLeft} > ${scenario.queryRight}`,
    {
      distractorType: "comparisonTrap",
      likelyMistake: "Read the strongest visible symbol and assumed a direct conclusion.",
      reasoningTrap: "Visible-symbol shortcut trap."
    }
  );
  addOption(
    `${scenario.queryLeft} < ${scenario.queryRight}`,
    {
      distractorType: "wrongIntermediateValue",
      likelyMistake: "Reversed the comparison while chaining the statements.",
      reasoningTrap: "Direction-reversal trap."
    }
  );
  addOption(
    `${scenario.queryLeft} = ${scenario.queryRight}`,
    {
      distractorType: "cumulativeMistake",
      likelyMistake: "Treated a partial equality link as a complete conclusion.",
      reasoningTrap: "Equality-extension trap."
    }
  );
  addOption(
    "Cannot be determined",
    {
      distractorType: "wrongIntermediateValue",
      likelyMistake: "Stopped before completing the full transitive chain.",
      reasoningTrap: "Premature uncertainty trap."
    }
  );
  const shuffled = shuffle(
    [...options.values()].slice(0, 4)
  );
  return {
    options: shuffled.map(
      (option) => option.value
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect
    ),
    optionMetadata: shuffled
  };
}

// src/lib/reasoning/logic-archetypes.ts
var LOGIC_REASONING_ARCHETYPES = [
  {
    id: "easy-direct-inequalities",
    difficulty: "Easy",
    category: "direct-inequalities",
    topicClusters: [
      "inequality"
    ],
    operationChain: [
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the direct inequality and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Read the direct comparison between the required symbols."
      )
    ]
  },
  {
    id: "easy-single-inference-chains",
    difficulty: "Easy",
    category: "single-inference-chains",
    topicClusters: [
      "inequality"
    ],
    operationChain: [
      "compare",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Answer carefully  : {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Read the linked inequality statements in order."
      ),
      createReasoningStep(
        "infer",
        "Infer the final relation through one transitive step."
      )
    ]
  },
  {
    id: "medium-multi-statement-comparison",
    difficulty: "Medium",
    category: "multi-statement-comparison",
    topicClusters: [
      "inequality"
    ],
    operationChain: [
      "compare",
      "aggregate",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Read each comparison and note the common symbols."
      ),
      createReasoningStep(
        "aggregate",
        "Combine the connected statements into one order chain."
      ),
      createReasoningStep(
        "infer",
        "Infer the required final comparison."
      )
    ]
  },
  {
    id: "medium-compound-inequalities",
    difficulty: "Medium",
    category: "compound-inequalities",
    topicClusters: [
      "inequality"
    ],
    operationChain: [
      "compare",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Separate the compound statement into simpler links."
      ),
      createReasoningStep(
        "infer",
        "Use the linked comparisons to infer the hidden relation."
      ),
      createReasoningStep(
        "compare",
        "Verify the final required conclusion."
      )
    ]
  },
  {
    id: "hard-conditional-inequality-logic",
    difficulty: "Hard",
    category: "conditional-inequality-logic",
    topicClusters: [
      "inequality"
    ],
    operationChain: [
      "filter",
      "compare",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "filter",
        "Identify which comparisons can and cannot be linked directly."
      ),
      createReasoningStep(
        "compare",
        "Trace the available branches of the inequality network."
      ),
      createReasoningStep(
        "infer",
        "Infer whether the conclusion is definite or uncertain."
      )
    ]
  },
  {
    id: "hard-nested-inference-chains",
    difficulty: "Hard",
    category: "nested-inference-chains",
    topicClusters: [
      "inequality"
    ],
    operationChain: [
      "aggregate",
      "infer",
      "compare",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "aggregate",
        "Combine the multi-part symbolic statements into connected groups."
      ),
      createReasoningStep(
        "infer",
        "Infer the relation inside each connected group."
      ),
      createReasoningStep(
        "compare",
        "Compare the resulting groups against the asked symbols."
      ),
      createReasoningStep(
        "infer",
        "State whether the final conclusion definitely follows."
      )
    ]
  },
  {
    id: "easy-straight-movement",
    difficulty: "Easy",
    category: "straight-movement",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Move along the stated direction and note the final point."
      )
    ]
  },
  {
    id: "easy-direct-distance",
    difficulty: "Easy",
    category: "direct-distance",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Track the distance directly and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Follow the direct movement sequence."
      ),
      createReasoningStep(
        "compare",
        "Measure the final distance asked."
      )
    ]
  },
  {
    id: "medium-simple-left-right-turns",
    difficulty: "Medium",
    category: "simple-left-right-turns",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Move step by step in the stated directions."
      ),
      createReasoningStep(
        "infer",
        "Update the facing direction after each turn."
      ),
      createReasoningStep(
        "compare",
        "Read the final direction or position asked."
      )
    ]
  },
  {
    id: "medium-multiple-turns",
    difficulty: "Medium",
    category: "multiple-turns",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform",
      "compare",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Record the path segment by segment."
      ),
      createReasoningStep(
        "compare",
        "Compare each turn with the current orientation."
      ),
      createReasoningStep(
        "infer",
        "Infer the final location or facing direction."
      )
    ]
  },
  {
    id: "medium-shortest-distance-inference",
    difficulty: "Medium",
    category: "shortest-distance-inference",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform",
      "aggregate",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Use the path to infer the shortest distance: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Translate each movement into coordinate changes."
      ),
      createReasoningStep(
        "aggregate",
        "Combine the horizontal and vertical shifts."
      ),
      createReasoningStep(
        "infer",
        "Infer the shortest distance from the net displacement."
      )
    ]
  },
  {
    id: "hard-orientation-changes",
    difficulty: "Hard",
    category: "orientation-changes",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform",
      "infer",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Trace each movement in order."
      ),
      createReasoningStep(
        "infer",
        "Update the hidden facing direction after each turn."
      ),
      createReasoningStep(
        "transform",
        "Apply the next movements using the updated orientation."
      ),
      createReasoningStep(
        "compare",
        "Read the final direction or position."
      )
    ]
  },
  {
    id: "hard-conditional-movement-reasoning",
    difficulty: "Hard",
    category: "conditional-movement-reasoning",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "filter",
      "transform",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "filter",
        "Identify where the conditional turn or movement applies."
      ),
      createReasoningStep(
        "transform",
        "Track the path with the condition in place."
      ),
      createReasoningStep(
        "infer",
        "Infer the asked direction or displacement after the full path."
      )
    ]
  },
  {
    id: "hard-coordinate-inference-chains",
    difficulty: "Hard",
    category: "coordinate-inference-chains",
    topicClusters: [
      "direction-sense"
    ],
    operationChain: [
      "transform",
      "aggregate",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Convert each movement into directional coordinates."
      ),
      createReasoningStep(
        "aggregate",
        "Combine all coordinate changes."
      ),
      createReasoningStep(
        "infer",
        "Infer the final location or shortest distance."
      ),
      createReasoningStep(
        "compare",
        "Resolve the exact asked output from the final position."
      )
    ]
  },
  {
    id: "easy-direct-family-relation",
    difficulty: "Easy",
    category: "direct-family-relation",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Read the direct family statement and identify the exact relation."
      )
    ]
  },
  {
    id: "easy-single-chain-relation",
    difficulty: "Easy",
    category: "single-chain-relation",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "compare",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Track the immediate relation from the first statement."
      ),
      createReasoningStep(
        "infer",
        "Infer the asked relation from that single chain."
      )
    ]
  },
  {
    id: "medium-generation-gap-reasoning",
    difficulty: "Medium",
    category: "generation-gap-reasoning",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "compare",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Track the family generations carefully: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Identify the generation of each named person."
      ),
      createReasoningStep(
        "infer",
        "Bridge the generation gap through the chain."
      ),
      createReasoningStep(
        "compare",
        "State the final relation from the completed chain."
      )
    ]
  },
  {
    id: "medium-gender-based-inference",
    difficulty: "Medium",
    category: "gender-based-inference",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "infer",
      "compare",
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "infer",
        "Infer the relevant gender from the statements."
      ),
      createReasoningStep(
        "compare",
        "Place the person correctly in the family chain."
      ),
      createReasoningStep(
        "transform",
        "Convert the chain into the exact relation asked."
      )
    ]
  },
  {
    id: "hard-conditional-family-inference",
    difficulty: "Hard",
    category: "conditional-family-inference",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "filter",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Apply the family condition carefully and solve: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "filter",
        "Apply the conditional family clue before using the chain."
      ),
      createReasoningStep(
        "infer",
        "Infer the hidden family position created by the condition."
      ),
      createReasoningStep(
        "compare",
        "Resolve the exact asked relation."
      )
    ]
  },
  {
    id: "hard-circular-relation-chains",
    difficulty: "Hard",
    category: "circular-relation-chains",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "compare",
      "transform",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Trace each relation link in order."
      ),
      createReasoningStep(
        "transform",
        "Reframe the circular chain into a linear family path."
      ),
      createReasoningStep(
        "infer",
        "Infer the hidden connecting relation."
      ),
      createReasoningStep(
        "compare",
        "State the final relationship precisely."
      )
    ]
  },
  {
    id: "hard-indirect-relation-deduction",
    difficulty: "Hard",
    category: "indirect-relation-deduction",
    topicClusters: [
      "blood-relations"
    ],
    operationChain: [
      "infer",
      "aggregate",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "infer",
        "Infer each hidden relation from the statements."
      ),
      createReasoningStep(
        "aggregate",
        "Combine the inferred links into one family chain."
      ),
      createReasoningStep(
        "compare",
        "Identify the final asked relation."
      )
    ]
  },
  {
    id: "easy-direct-alphabet-shift",
    difficulty: "Easy",
    category: "direct-alphabet-shift",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Apply the direct alphabet shift to each required letter."
      )
    ]
  },
  {
    id: "easy-reverse-alphabet",
    difficulty: "Easy",
    category: "reverse-alphabet",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "reverse"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "reverse",
        "Replace each letter with its opposite alphabet partner."
      )
    ]
  },
  {
    id: "easy-simple-substitution",
    difficulty: "Easy",
    category: "simple-substitution",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Substitute each letter according to the direct coding rule."
      )
    ]
  },
  {
    id: "medium-positional-coding",
    difficulty: "Medium",
    category: "positional-coding",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Translate each letter into its coded positional form."
      ),
      createReasoningStep(
        "compare",
        "Match the transformed sequence to the required answer."
      )
    ]
  },
  {
    id: "medium-mixed-symbol-letter-coding",
    difficulty: "Medium",
    category: "mixed-symbol-letter-coding",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "transform",
      "compare",
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Apply the symbol rule to the required letters."
      ),
      createReasoningStep(
        "compare",
        "Separate the vowels and consonants under the coding condition."
      ),
      createReasoningStep(
        "transform",
        "Reassemble the final coded pattern."
      )
    ]
  },
  {
    id: "medium-conditional-letter-mapping",
    difficulty: "Medium",
    category: "conditional-letter-mapping",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "filter",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "filter",
        "Identify which letters follow each condition."
      ),
      createReasoningStep(
        "transform",
        "Apply the relevant coding rule to each group."
      ),
      createReasoningStep(
        "compare",
        "Check the final coded pattern against the options."
      )
    ]
  },
  {
    id: "hard-multi-stage-coding",
    difficulty: "Hard",
    category: "multi-stage-coding",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "transform",
      "reverse",
      "transform",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Apply the first coding rule to the word."
      ),
      createReasoningStep(
        "reverse",
        "Reverse or reorder the intermediate code as directed."
      ),
      createReasoningStep(
        "transform",
        "Apply the second-stage transformation."
      ),
      createReasoningStep(
        "infer",
        "Infer the final code after both stages."
      )
    ]
  },
  {
    id: "hard-word-transformation-chains",
    difficulty: "Hard",
    category: "word-transformation-chains",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "transform",
      "aggregate",
      "compare",
      "infer"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "transform",
        "Transform each letter using the staged coding rule."
      ),
      createReasoningStep(
        "aggregate",
        "Combine the staged results into one coded sequence."
      ),
      createReasoningStep(
        "compare",
        "Compare the derived code against the pattern."
      ),
      createReasoningStep(
        "infer",
        "Infer the final answer from the full transformation chain."
      )
    ]
  },
  {
    id: "hard-inference-based-decoding",
    difficulty: "Hard",
    category: "inference-based-decoding",
    topicClusters: [
      "coding-decoding"
    ],
    operationChain: [
      "compare",
      "infer",
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the statement carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Study the example pair to spot the coding pattern."
      ),
      createReasoningStep(
        "infer",
        "Infer the hidden decoding rule."
      ),
      createReasoningStep(
        "transform",
        "Apply that rule to the target word."
      )
    ]
  },
  {
    id: "easy-direct-placement",
    difficulty: "Easy",
    category: "direct-placement",
    topicClusters: [
      "seating-arrangement"
    ],
    operationChain: [
      "compare",
      "transform"
    ],
    wordingVariants: [
      "{baseText}",
      "Read the seating clues and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Mark the limited anchor clue first without fixing the whole row immediately."
      ),
      createReasoningStep(
        "transform",
        "Combine the remaining relative clues to complete the row before answering."
      )
    ]
  },
  {
    id: "medium-neighbor-inference",
    difficulty: "Medium",
    category: "neighbor-inference",
    topicClusters: [
      "seating-arrangement"
    ],
    operationChain: [
      "compare",
      "infer",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Track the seating clues carefully and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Identify the strongest anchor clue before linking the neighboring seats."
      ),
      createReasoningStep(
        "infer",
        "Use left-right and neighbor clues together to narrow the possible row."
      ),
      createReasoningStep(
        "compare",
        "Read the final required seat from the completed arrangement."
      )
    ]
  },
  {
    id: "hard-chained-deduction",
    difficulty: "Hard",
    category: "chained-deduction",
    topicClusters: [
      "seating-arrangement"
    ],
    operationChain: [
      "compare",
      "infer",
      "transform",
      "compare"
    ],
    wordingVariants: [
      "{baseText}",
      "Infer the full seating row and answer: {baseText}"
    ],
    buildReasoningSteps: () => [
      createReasoningStep(
        "compare",
        "Start from the most restrictive indirect seating clues."
      ),
      createReasoningStep(
        "infer",
        "Link the relative positions into one consistent row."
      ),
      createReasoningStep(
        "transform",
        "Translate the partial placements into exact seat positions."
      ),
      createReasoningStep(
        "compare",
        "Use the completed row to resolve the asked seat."
      )
    ]
  }
];

// src/lib/reasoning/seating-validator.ts
function getClueOperator(clue) {
  return clue.operator ?? "EQUALS";
}
function applyClueOperator(clue, conditionMet) {
  return getClueOperator(clue) === "NOT_EQUALS" ? !conditionMet : conditionMet;
}
function createMixedFacings(count, primary, secondary) {
  return Array.from(
    { length: count },
    (_value, index2) => index2 % 2 === 0 ? primary : secondary
  );
}
function createLinearSeats(seatCount, orientationType) {
  const facings = orientationType === "south" ? Array.from(
    { length: seatCount },
    () => "south"
  ) : orientationType === "alternate" ? Array.from(
    { length: seatCount },
    (_value, index2) => index2 % 2 === 0 ? "north" : "south"
  ) : orientationType === "mixed" ? createMixedFacings(
    seatCount,
    "north",
    "south"
  ) : Array.from(
    { length: seatCount },
    () => "north"
  );
  return Array.from(
    { length: seatCount },
    (_value, index2) => ({
      index: index2,
      row: 0,
      col: index2,
      facing: facings[index2]
    })
  );
}
function createRingSeats(seatCount, orientationType) {
  const facings = orientationType === "outward" ? Array.from(
    { length: seatCount },
    () => "outward"
  ) : orientationType === "alternate" ? Array.from(
    { length: seatCount },
    (_value, index2) => index2 % 2 === 0 ? "center" : "outward"
  ) : orientationType === "mixed" ? createMixedFacings(
    seatCount,
    "center",
    "outward"
  ) : Array.from(
    { length: seatCount },
    () => "center"
  );
  return Array.from(
    { length: seatCount },
    (_value, index2) => ({
      index: index2,
      row: 0,
      col: index2,
      facing: facings[index2]
    })
  );
}
function createTwoRowSeats(seatCount, arrangementType, orientationType) {
  const colCount = seatCount / 2;
  const seats = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < colCount; col++) {
      let facing;
      if (orientationType === "north" || orientationType === "south") {
        facing = orientationType;
      } else if (arrangementType === "double-row" && orientationType !== "mixed") {
        facing = row === 0 ? "south" : "north";
      } else if (orientationType === "alternate") {
        facing = (row + col) % 2 === 0 ? "north" : "south";
      } else {
        facing = (row === 0 ? col % 2 === 0 : col % 2 === 1) ? "north" : "south";
      }
      seats.push({
        index: row * colCount + col,
        row,
        col,
        facing
      });
    }
  }
  return seats;
}
function buildLayout(arrangementType, orientationType, seatCount) {
  if (arrangementType === "linear") {
    return {
      arrangementType,
      orientationType,
      family: "single-row",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createLinearSeats(
        seatCount,
        orientationType
      )
    };
  }
  if (arrangementType === "circular" || arrangementType === "square" || arrangementType === "rectangular") {
    return {
      arrangementType,
      orientationType,
      family: "ring",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createRingSeats(
        seatCount,
        orientationType
      )
    };
  }
  return {
    arrangementType,
    orientationType,
    family: "two-row",
    seatCount,
    rowCount: 2,
    colCount: seatCount / 2,
    seats: createTwoRowSeats(
      seatCount,
      arrangementType,
      orientationType
    )
  };
}
function getSeat(layout, index2) {
  return layout.seats[index2];
}
function getOppositeNode(index2, layout) {
  if (layout.family === "ring") {
    if (layout.seatCount % 2 !== 0) {
      return void 0;
    }
    return getSeat(
      layout,
      (index2 + layout.seatCount / 2) % layout.seatCount
    );
  }
  if (layout.family === "two-row") {
    const seat = getSeat(
      layout,
      index2
    );
    return getSeat(
      layout,
      (1 - seat.row) * layout.colCount + seat.col
    );
  }
  return void 0;
}
function sameRow(firstIndex, secondIndex, layout) {
  return getSeat(layout, firstIndex).row === getSeat(layout, secondIndex).row;
}
function getRelativeIndex(index2, direction, distance, layout) {
  const seat = getSeat(
    layout,
    index2
  );
  if (layout.family === "single-row" || layout.family === "two-row") {
    const step2 = seat.facing === "south" ? direction === "left" ? 1 : -1 : direction === "left" ? -1 : 1;
    const targetCol = seat.col + step2 * distance;
    if (targetCol < 0 || targetCol >= layout.colCount) {
      return void 0;
    }
    return seat.row * layout.colCount + targetCol;
  }
  const step = seat.facing === "outward" ? direction === "left" ? -distance : distance : direction === "left" ? distance : -distance;
  return (index2 + step + layout.seatCount) % layout.seatCount;
}
function getCircularDistance(firstIndex, secondIndex, layout) {
  const direct = Math.abs(
    firstIndex - secondIndex
  );
  return Math.min(
    direct,
    layout.seatCount - direct
  );
}
function areAdjacent(firstIndex, secondIndex, layout) {
  if (layout.family === "ring") {
    return getCircularDistance(
      firstIndex,
      secondIndex,
      layout
    ) === 1;
  }
  const firstSeat = getSeat(
    layout,
    firstIndex
  );
  const secondSeat = getSeat(
    layout,
    secondIndex
  );
  return firstSeat.row === secondSeat.row && Math.abs(
    firstSeat.col - secondSeat.col
  ) === 1;
}
function getOppositeIndex(index2, layout) {
  return getOppositeNode(
    index2,
    layout
  )?.index;
}
function evaluateClueCondition(arrangement, clue, layout) {
  switch (clue.type) {
    case "absolute":
      return arrangement[clue.index] === clue.person;
    case "end":
      if (layout.family !== "single-row") {
        return false;
      }
      return clue.side === "left" ? arrangement[0] === clue.person : arrangement[arrangement.length - 1] === clue.person;
    case "adjacent": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      if (clue.ordered) {
        return getRelativeIndex(
          leftIndex,
          "right",
          1,
          layout
        ) === rightIndex;
      }
      return areAdjacent(
        leftIndex,
        rightIndex,
        layout
      );
    }
    case "not-adjacent": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return !areAdjacent(
        leftIndex,
        rightIndex,
        layout
      );
    }
    case "offset": {
      const anchorIndex = arrangement.indexOf(
        clue.anchor
      );
      const personIndex = arrangement.indexOf(
        clue.person
      );
      return getRelativeIndex(
        anchorIndex,
        clue.direction,
        clue.distance,
        layout
      ) === personIndex;
    }
    case "distance-gap": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      if (layout.family === "ring") {
        return getCircularDistance(
          leftIndex,
          rightIndex,
          layout
        ) === clue.gap + 1;
      }
      if (!sameRow(
        leftIndex,
        rightIndex,
        layout
      )) {
        return false;
      }
      return Math.abs(
        getSeat(layout, leftIndex).col - getSeat(
          layout,
          rightIndex
        ).col
      ) === clue.gap + 1;
    }
    case "between":
    case "adjacent-both": {
      const middleIndex = arrangement.indexOf(
        clue.middle
      );
      const firstIndex = arrangement.indexOf(clue.first);
      const secondIndex = arrangement.indexOf(clue.second);
      return areAdjacent(
        middleIndex,
        firstIndex,
        layout
      ) && areAdjacent(
        middleIndex,
        secondIndex,
        layout
      ) && firstIndex !== secondIndex;
    }
    case "not-end": {
      if (layout.family !== "single-row") {
        return false;
      }
      const personIndex = arrangement.indexOf(clue.person);
      return personIndex > 0 && personIndex < arrangement.length - 1;
    }
    case "opposite": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return getOppositeIndex(
        leftIndex,
        layout
      ) === rightIndex;
    }
    case "not-opposite": {
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return getOppositeIndex(
        leftIndex,
        layout
      ) !== rightIndex;
    }
    case "same-row": {
      if (layout.family !== "two-row") {
        return false;
      }
      return sameRow(
        arrangement.indexOf(clue.left),
        arrangement.indexOf(
          clue.right
        ),
        layout
      );
    }
    case "different-row": {
      if (layout.family !== "two-row") {
        return false;
      }
      return !sameRow(
        arrangement.indexOf(clue.left),
        arrangement.indexOf(
          clue.right
        ),
        layout
      );
    }
    case "facing": {
      if (layout.family !== "two-row") {
        return false;
      }
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return getOppositeIndex(
        leftIndex,
        layout
      ) === rightIndex;
    }
    case "not-facing": {
      if (layout.family !== "two-row") {
        return false;
      }
      const leftIndex = arrangement.indexOf(clue.left);
      const rightIndex = arrangement.indexOf(clue.right);
      return getOppositeIndex(
        leftIndex,
        layout
      ) !== rightIndex;
    }
    default:
      return false;
  }
}
function matchesClue(arrangement, clue, layout) {
  return applyClueOperator(
    clue,
    evaluateClueCondition(
      arrangement,
      clue,
      layout
    )
  );
}
function getClueWeight(clue) {
  return clue.weight ?? (getClueOperator(clue) === "NOT_EQUALS" ? 2.5 : 1);
}
function getClueId(clue, index2) {
  return `clue-${index2 + 1}:${clue.type}`;
}
function formatArrangementSnapshot(assignment, seatCount) {
  const seats = Array.from(
    { length: seatCount },
    () => "?"
  );
  for (const [
    person,
    seatIndex
  ] of assignment.entries()) {
    seats[seatIndex] = person;
  }
  return seats.join(" | ");
}
function summarizeArrangement(arrangement) {
  return arrangement.join(" | ");
}
function buildInferenceTraceExport(steps) {
  const text2 = steps.map(
    (step) => `${step.stepId}: ${step.deduction} -> ${step.resultingStateSnapshot}`
  );
  return {
    steps,
    text: text2,
    json: JSON.stringify(
      steps,
      null,
      2
    )
  };
}
function exportInferenceTrace(steps) {
  return buildInferenceTraceExport(
    steps
  );
}
function buildStageResult(stage, passed, warnings, diagnostics, metrics) {
  return {
    stage,
    passed,
    warnings,
    diagnostics,
    metrics
  };
}
function countDistinctClueTypes(clues) {
  return new Set(
    clues.map((clue) => clue.type)
  ).size;
}
function buildValidationReport2(participants, arrangement, clues, prompt, layout) {
  const stageResults = [];
  const warnings = [];
  const topologyWarnings = [];
  const uniqueParticipants = new Set(participants);
  const uniqueArrangement = new Set(arrangement);
  const participantCoverage = participants.filter(
    (person) => arrangement.includes(person)
  ).length;
  if (uniqueParticipants.size !== participants.length) {
    topologyWarnings.push(
      "Participant list contained duplicate names."
    );
  }
  if (arrangement.length !== layout.seatCount) {
    topologyWarnings.push(
      "Arrangement length did not match seat count."
    );
  }
  if (uniqueArrangement.size !== arrangement.length) {
    topologyWarnings.push(
      "Arrangement contained duplicate seat assignments."
    );
  }
  if (participantCoverage !== participants.length) {
    topologyWarnings.push(
      "Arrangement did not cover the full participant set."
    );
  }
  const topologyMetrics = {
    participantCount: participants.length,
    seatCount: layout.seatCount,
    arrangementSize: arrangement.length,
    duplicateParticipantCount: participants.length - uniqueParticipants.size,
    duplicateSeatAssignments: arrangement.length - uniqueArrangement.size,
    participantCoverage
  };
  stageResults.push(
    buildStageResult(
      "topology",
      topologyWarnings.length === 0,
      topologyWarnings,
      {
        layoutFamily: layout.family,
        arrangementType: layout.arrangementType,
        orientationType: layout.orientationType
      },
      topologyMetrics
    )
  );
  warnings.push(...topologyWarnings);
  const constraintWarnings = [];
  const failedClues = clues.map((clue, index2) => ({
    clue,
    index: index2,
    satisfied: matchesClue(
      arrangement,
      clue,
      layout
    )
  })).filter(
    (entry) => !entry.satisfied
  );
  if (failedClues.length > 0) {
    constraintWarnings.push(
      "One or more clues contradicted the target arrangement."
    );
  }
  stageResults.push(
    buildStageResult(
      "constraint-consistency",
      constraintWarnings.length === 0,
      constraintWarnings,
      {
        failedClueIndexes: failedClues.map(
          (entry) => entry.index
        ),
        failedClueTypes: failedClues.map(
          (entry) => entry.clue.type
        )
      },
      {
        clueCount: clues.length,
        failedClueCount: failedClues.length
      }
    )
  );
  warnings.push(...constraintWarnings);
  const solveResult = solveSeating(
    participants,
    clues,
    layout.arrangementType,
    layout.orientationType,
    layout.seatCount
  );
  const solvabilityWarnings = [];
  if (solveResult.solutionCount === 0) {
    solvabilityWarnings.push(
      "No valid seating arrangement satisfied the clue set."
    );
  }
  stageResults.push(
    buildStageResult(
      "solvability",
      solvabilityWarnings.length === 0,
      solvabilityWarnings,
      {
        tracePreview: solveResult.trace.slice(
          0,
          3
        )
      },
      {
        solutionCount: solveResult.solutionCount,
        solverComplexity: solveResult.solverComplexity
      }
    )
  );
  warnings.push(...solvabilityWarnings);
  const uniquenessWarnings = [];
  if (solveResult.solutionCount > 1) {
    uniquenessWarnings.push(
      "Clue set produced multiple valid arrangements."
    );
  }
  if (prompt && isPromptDirectlyAnsweredByClue(
    prompt,
    clues,
    layout.arrangementType,
    layout.orientationType,
    layout.seatCount
  )) {
    uniquenessWarnings.push(
      "Prompt answer was directly revealed by a clue."
    );
  }
  stageResults.push(
    buildStageResult(
      "uniqueness",
      uniquenessWarnings.length === 0,
      uniquenessWarnings,
      {
        promptType: prompt?.type
      },
      {
        solutionCount: solveResult.solutionCount,
        promptDirectReveal: uniquenessWarnings.some(
          (warning) => warning.includes(
            "directly revealed"
          )
        ) ? 1 : 0
      }
    )
  );
  warnings.push(...uniquenessWarnings);
  const clueWeightTotal = clues.reduce(
    (sum, clue) => sum + getClueWeight(clue),
    0
  );
  const negativeClueCount = clues.filter(
    (clue) => getClueOperator(clue) === "NOT_EQUALS"
  ).length;
  const difficultyWarnings = [];
  if (clues.length > 0 && clueWeightTotal / clues.length < 1.25) {
    difficultyWarnings.push(
      "Clue set is heavily direct and may be low on elimination depth."
    );
  }
  stageResults.push(
    buildStageResult(
      "inference-difficulty",
      difficultyWarnings.length === 0,
      difficultyWarnings,
      {
        dominantClueTypes: [
          ...new Set(
            clues.map(
              (clue) => clue.type
            )
          )
        ].slice(0, 5)
      },
      {
        clueCount: clues.length,
        clueWeightTotal,
        averageClueWeight: clues.length > 0 ? clueWeightTotal / clues.length : 0,
        negativeClueCount,
        distinctClueTypes: countDistinctClueTypes(
          clues
        )
      }
    )
  );
  warnings.push(...difficultyWarnings);
  const metrics = stageResults.reduce((accumulator, stageResult) => {
    for (const [
      key,
      value
    ] of Object.entries(
      stageResult.metrics
    )) {
      accumulator[`${stageResult.stage}.${key}`] = value;
    }
    return accumulator;
  }, {});
  const validationReport = {
    passed: stageResults.every(
      (stageResult) => stageResult.passed
    ),
    stageResults,
    warnings,
    metrics
  };
  return {
    valid: validationReport.passed,
    warnings,
    solutionCount: solveResult.solutionCount,
    solverComplexity: solveResult.solverComplexity,
    solverTrace: solveResult.trace,
    inferenceSteps: solveResult.inferenceSteps,
    traceExport: solveResult.traceExport,
    validationReport
  };
}
function isPromptDirectlyAnsweredByClue(prompt, clues, arrangementType, orientationType, seatCount) {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount
  );
  return clues.some((clue) => {
    if (prompt.type === "neighbor-left" || prompt.type === "neighbor-right") {
      return clue.type === "adjacent" && clue.ordered && (prompt.type === "neighbor-right" && clue.left === prompt.anchor && clue.right === prompt.correctAnswer || prompt.type === "neighbor-left" && clue.right === prompt.anchor && clue.left === prompt.correctAnswer);
    }
    if (prompt.type === "relative") {
      return clue.type === "offset" && clue.anchor === prompt.anchor && clue.distance === prompt.distance && clue.direction === prompt.direction && clue.person === prompt.correctAnswer;
    }
    if (prompt.type === "opposite") {
      return clue.type === "opposite" && (clue.left === prompt.anchor && clue.right === prompt.correctAnswer || clue.right === prompt.anchor && clue.left === prompt.correctAnswer);
    }
    if (prompt.type === "facing") {
      if (layout.family !== "two-row") {
        return false;
      }
      return clue.type === "facing" && (clue.left === prompt.anchor && clue.right === prompt.correctAnswer || clue.right === prompt.anchor && clue.left === prompt.correctAnswer);
    }
    return false;
  });
}
function evaluatePartialClueCondition(clue, assignment, layout) {
  const getIndex = (name) => assignment.get(name);
  switch (clue.type) {
    case "absolute": {
      const index2 = getIndex(
        clue.person
      );
      return index2 === void 0 ? void 0 : index2 === clue.index;
    }
    case "end": {
      const index2 = getIndex(
        clue.person
      );
      if (index2 === void 0) {
        return void 0;
      }
      if (layout.family !== "single-row") {
        return false;
      }
      return clue.side === "left" ? index2 === 0 : index2 === layout.seatCount - 1;
    }
    case "not-end": {
      const index2 = getIndex(
        clue.person
      );
      if (index2 === void 0) {
        return void 0;
      }
      if (layout.family !== "single-row") {
        return false;
      }
      return index2 > 0 && index2 < layout.seatCount - 1;
    }
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite": {
      const leftIndex = getIndex(
        clue.left
      );
      const rightIndex = getIndex(
        clue.right
      );
      if (leftIndex === void 0 || rightIndex === void 0) {
        return void 0;
      }
      return matchesClue(
        Array.from(
          { length: layout.seatCount },
          () => ""
        ).map(
          (_value, index2) => [...assignment.entries()].find(
            (entry) => entry[1] === index2
          )?.[0] ?? ""
        ),
        clue,
        layout
      );
    }
    case "offset": {
      const anchorIndex = getIndex(
        clue.anchor
      );
      const personIndex = getIndex(
        clue.person
      );
      if (anchorIndex === void 0 || personIndex === void 0) {
        return void 0;
      }
      return getRelativeIndex(
        anchorIndex,
        clue.direction,
        clue.distance,
        layout
      ) === personIndex;
    }
    case "between":
    case "adjacent-both": {
      const middleIndex = getIndex(
        clue.middle
      );
      const firstIndex = getIndex(
        clue.first
      );
      const secondIndex = getIndex(
        clue.second
      );
      if (middleIndex === void 0 || firstIndex === void 0 || secondIndex === void 0) {
        return void 0;
      }
      return areAdjacent(
        middleIndex,
        firstIndex,
        layout
      ) && areAdjacent(
        middleIndex,
        secondIndex,
        layout
      );
    }
    default:
      return void 0;
  }
}
function solveSeating(participants, clues, arrangementType, orientationType, seatCount) {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount
  );
  const solutions = [];
  const inferenceSteps = [];
  let evaluated = 0;
  let stepCounter = 0;
  const assignment = /* @__PURE__ */ new Map();
  const usedSeats = /* @__PURE__ */ new Set();
  const remainingPeople = [
    ...participants
  ];
  if (layout.family === "ring") {
    assignment.set(
      participants[0],
      0
    );
    usedSeats.add(0);
    remainingPeople.shift();
    stepCounter += 1;
    inferenceSteps.push({
      stepId: `step-${stepCounter}`,
      sourceConstraintIds: [],
      deduction: `Anchored ${participants[0]} at seat 1 to remove rotational symmetry.`,
      eliminatedPossibilities: [
        `${participants[0]} != seats 2-${seatCount}`
      ],
      resultingStateSnapshot: formatArrangementSnapshot(
        assignment,
        seatCount
      )
    });
  }
  function backtrack(personIndex) {
    if (solutions.length > 1) {
      return;
    }
    if (personIndex >= remainingPeople.length) {
      evaluated += 1;
      const arrangement = Array.from(
        { length: seatCount },
        () => ""
      );
      for (const [
        person2,
        seatIndex
      ] of assignment.entries()) {
        arrangement[seatIndex] = person2;
      }
      if (clues.every(
        (clue) => matchesClue(
          arrangement,
          clue,
          layout
        )
      )) {
        solutions.push(arrangement);
        stepCounter += 1;
        inferenceSteps.push({
          stepId: `step-${stepCounter}`,
          sourceConstraintIds: clues.map(
            getClueId
          ),
          deduction: `Accepted arrangement ${solutions.length} after all active constraints were satisfied.`,
          eliminatedPossibilities: [],
          resultingStateSnapshot: summarizeArrangement(
            arrangement
          )
        });
      }
      return;
    }
    const person = remainingPeople[personIndex];
    for (let seat = 0; seat < seatCount; seat++) {
      if (usedSeats.has(seat)) {
        continue;
      }
      assignment.set(person, seat);
      usedSeats.add(seat);
      stepCounter += 1;
      inferenceSteps.push({
        stepId: `step-${stepCounter}`,
        sourceConstraintIds: [],
        deduction: `Branching on ${person} at seat ${seat + 1}.`,
        eliminatedPossibilities: [],
        resultingStateSnapshot: formatArrangementSnapshot(
          assignment,
          seatCount
        )
      });
      const clueEvaluations = clues.map(
        (clue, clueIndex) => ({
          clue,
          clueIndex,
          condition: evaluatePartialClueCondition(
            clue,
            assignment,
            layout
          )
        })
      );
      const blockingClues = clueEvaluations.filter(
        (entry) => entry.condition !== void 0 && !applyClueOperator(
          entry.clue,
          entry.condition
        )
      );
      if (blockingClues.length === 0) {
        const propagatedClues = clueEvaluations.filter(
          (entry) => entry.condition === true
        );
        if (propagatedClues.length > 0) {
          stepCounter += 1;
          inferenceSteps.push({
            stepId: `step-${stepCounter}`,
            sourceConstraintIds: propagatedClues.map(
              (entry) => getClueId(
                entry.clue,
                entry.clueIndex
              )
            ),
            deduction: `Propagated ${propagatedClues.length} satisfied partial deduction${propagatedClues.length === 1 ? "" : "s"} from the current branch.`,
            eliminatedPossibilities: [],
            resultingStateSnapshot: formatArrangementSnapshot(
              assignment,
              seatCount
            )
          });
        }
        backtrack(personIndex + 1);
      } else {
        stepCounter += 1;
        inferenceSteps.push({
          stepId: `step-${stepCounter}`,
          sourceConstraintIds: blockingClues.map(
            (entry) => getClueId(
              entry.clue,
              entry.clueIndex
            )
          ),
          deduction: `Detected contradiction for ${person} at seat ${seat + 1}; pruning the branch.`,
          eliminatedPossibilities: [
            `${person} != seat ${seat + 1}`,
            ...blockingClues.map(
              (entry) => `${entry.clue.type} invalidated this partial state`
            )
          ],
          resultingStateSnapshot: formatArrangementSnapshot(
            assignment,
            seatCount
          )
        });
      }
      usedSeats.delete(seat);
      assignment.delete(person);
      if (solutions.length > 1) {
        break;
      }
    }
  }
  backtrack(0);
  const traceExport = buildInferenceTraceExport(
    inferenceSteps
  );
  return {
    solutions,
    solutionCount: solutions.length,
    solverComplexity: evaluated,
    trace: traceExport.text,
    inferenceSteps,
    traceExport
  };
}
function solveSeatingArrangement(participants, clues, arrangementType, orientationType, seatCount) {
  return solveSeating(
    participants,
    clues,
    arrangementType,
    orientationType,
    seatCount
  );
}
function solveLinearSeating(participants, clues, orientationType = "north", seatCount = participants.length) {
  return solveSeating(
    participants,
    clues,
    "linear",
    orientationType,
    seatCount
  );
}
function solveCircularSeating(participants, clues, orientationType = "center", seatCount = participants.length) {
  return solveSeating(
    participants,
    clues,
    "circular",
    orientationType,
    seatCount
  );
}
function validateSeatingScenario(participants, arrangement, clues, prompt, arrangementType, orientationType, seatCount) {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount
  );
  return buildValidationReport2(
    participants,
    arrangement,
    clues,
    prompt,
    layout
  );
}
function validateLinearSeatingScenario(participants, arrangement, clues, prompt, orientationType = "north", seatCount = participants.length) {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "linear",
    orientationType,
    seatCount
  );
}
function validateCircularSeatingScenario(participants, arrangement, clues, prompt, orientationType = "center", seatCount = participants.length) {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "circular",
    orientationType,
    seatCount
  );
}

// src/lib/reasoning/seating/clue-graph.ts
function getClueTypeKey(clue) {
  return clue.type === "adjacent" && clue.ordered ? "adjacent-ordered" : clue.type === "adjacent" ? "adjacent-unordered" : clue.type;
}
function getClueParticipants(clue) {
  switch (clue.type) {
    case "absolute":
    case "end":
    case "not-end":
      return [clue.person];
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite":
      return [clue.left, clue.right];
    case "offset":
      return [clue.anchor, clue.person];
    case "between":
    case "adjacent-both":
      return [
        clue.middle,
        clue.first,
        clue.second
      ];
    default:
      return [];
  }
}
function getClueFamily(clue) {
  switch (clue.type) {
    case "absolute":
    case "end":
    case "not-end":
      return "anchor";
    case "adjacent":
    case "not-adjacent":
    case "between":
    case "adjacent-both":
      return "adjacency";
    case "offset":
    case "distance-gap":
      return "distance";
    case "opposite":
    case "not-opposite":
    case "facing":
    case "not-facing":
      return "orientation";
    case "same-row":
    case "different-row":
      return "row";
    default:
      return clue.type;
  }
}
function buildDistribution(clues) {
  return clues.reduce(
    (accumulator, clue) => {
      const key = getClueTypeKey(
        clue
      );
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    },
    {}
  );
}
function getDirectClueCount(clues) {
  return clues.filter(
    (clue) => clue.type === "absolute" || clue.type === "end" || clue.type === "adjacent" && clue.ordered || clue.type === "offset" && clue.distance === 1
  ).length;
}
function buildEdges(clues) {
  const edges = [];
  for (let leftIndex = 0; leftIndex < clues.length; leftIndex++) {
    for (let rightIndex = leftIndex + 1; rightIndex < clues.length; rightIndex++) {
      const left = clues[leftIndex];
      const right = clues[rightIndex];
      const leftParticipants = getClueParticipants(
        left
      );
      const rightParticipants = getClueParticipants(
        right
      );
      const sharedParticipants = leftParticipants.filter(
        (participant) => rightParticipants.includes(
          participant
        )
      ).length;
      if (sharedParticipants > 0) {
        edges.push({
          from: leftIndex,
          to: rightIndex,
          reason: sharedParticipants > 1 ? "shared-anchor" : "shared-participant",
          weight: sharedParticipants
        });
        continue;
      }
      if (getClueFamily(left) === getClueFamily(right)) {
        edges.push({
          from: leftIndex,
          to: rightIndex,
          reason: "same-family",
          weight: 0.25
        });
      }
    }
  }
  return edges;
}
function getAdjacencyChainLength(clues) {
  const outgoing = /* @__PURE__ */ new Map();
  for (const clue of clues) {
    if (clue.type !== "adjacent" || !clue.ordered) {
      continue;
    }
    const targets = outgoing.get(clue.left) ?? /* @__PURE__ */ new Set();
    targets.add(clue.right);
    outgoing.set(clue.left, targets);
  }
  let longestChain = 0;
  const dfs = (node, seen) => {
    const next = outgoing.get(node);
    if (!next?.size) {
      return 1;
    }
    let longest = 1;
    for (const candidate of next) {
      if (seen.has(candidate)) {
        continue;
      }
      longest = Math.max(
        longest,
        1 + dfs(
          candidate,
          /* @__PURE__ */ new Set([
            ...seen,
            candidate
          ])
        )
      );
    }
    return longest;
  };
  for (const node of outgoing.keys()) {
    longestChain = Math.max(
      longestChain,
      dfs(node, /* @__PURE__ */ new Set([node]))
    );
  }
  return longestChain;
}
function getClueReasoningWeight(clue) {
  if (typeof clue.weight === "number") {
    return clue.weight;
  }
  const operatorWeight = clue.operator === "NOT_EQUALS" ? 2.5 : 1;
  switch (clue.type) {
    case "adjacent":
      return Math.max(
        operatorWeight,
        clue.ordered ? 1 : 1.4
      );
    case "offset":
      return Math.max(
        operatorWeight,
        clue.distance === 1 ? 1.8 : clue.distance === 2 ? 2.3 : 2.7
      );
    case "distance-gap":
      return Math.max(
        operatorWeight,
        2.5
      );
    case "between":
    case "adjacent-both":
      return Math.max(
        operatorWeight,
        3
      );
    case "not-adjacent":
    case "not-opposite":
    case "different-row":
    case "not-facing":
    case "not-end":
      return Math.max(
        operatorWeight,
        3
      );
    case "opposite":
    case "same-row":
    case "facing":
      return Math.max(
        operatorWeight,
        2.3
      );
    case "end":
      return Math.max(
        operatorWeight,
        1.2
      );
    case "absolute":
      return Math.max(
        operatorWeight,
        0.8
      );
    default:
      return Math.max(
        operatorWeight,
        1.5
      );
  }
}
function buildClueGraphAnalysis(clues, arrangementType, orientationType) {
  const edges = buildEdges(clues);
  const maxEdges = clues.length <= 1 ? 1 : clues.length * (clues.length - 1) / 2;
  const density = edges.length / maxEdges;
  const connectedClues = new Set(
    edges.flatMap((edge) => [
      edge.from,
      edge.to
    ])
  ).size;
  const interactionRatio = clues.length === 0 ? 0 : connectedClues / clues.length;
  const adjacencyChainLength = getAdjacencyChainLength(clues);
  const adjacencySerializationScore = clues.filter(
    (clue) => clue.type === "adjacent" && clue.ordered
  ).length / Math.max(clues.length, 1);
  const directClueRatio = getDirectClueCount(clues) / Math.max(clues.length, 1);
  const repeatedAdjacencySerialization = adjacencyChainLength >= 4 || adjacencyChainLength >= 3 && adjacencySerializationScore >= 0.55;
  const clueTypeDistribution = buildDistribution(clues);
  const sortedDistribution = Object.entries(
    clueTypeDistribution
  ).sort(
    ([left], [right]) => left.localeCompare(right)
  );
  const topologyTokens = [
    `layout:${arrangementType}`,
    `orientation:${orientationType}`,
    `chain:${adjacencyChainLength}`,
    `density:${density.toFixed(2)}`,
    `interaction:${interactionRatio.toFixed(2)}`
  ];
  const clueTokens = sortedDistribution.map(
    ([type, count]) => `${type}:${count}`
  );
  const inferenceTokens = clues.map(
    (clue) => `${getClueFamily(clue)}:${getClueReasoningWeight(clue).toFixed(1)}:${clue.operator ?? "EQUALS"}`
  );
  const topologySignature = [
    ...topologyTokens,
    clueTokens.join(",")
  ].join("|");
  const clueSignature2 = [
    `direct:${directClueRatio.toFixed(2)}`,
    clueTokens.join(",")
  ].join("|");
  const inferenceSignature = [
    `adjacency:${adjacencySerializationScore.toFixed(2)}`,
    `direct:${directClueRatio.toFixed(2)}`,
    [...inferenceTokens].sort().join(",")
  ].join("|");
  return {
    density,
    interactionRatio,
    adjacencySerializationScore,
    repeatedAdjacencySerialization,
    adjacencyChainLength,
    directClueRatio,
    clueTypeDistribution,
    clueSignature: clueSignature2,
    inferenceSignature,
    topologyTokens,
    clueTokens,
    inferenceTokens,
    topologySignature
  };
}

// src/lib/reasoning/seating/clue-generator.ts
function getClueParticipants2(clue) {
  switch (clue.type) {
    case "absolute":
    case "end":
    case "not-end":
      return [clue.person];
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite":
      return [clue.left, clue.right];
    case "offset":
      return [clue.anchor, clue.person];
    case "between":
    case "adjacent-both":
      return [
        clue.middle,
        clue.first,
        clue.second
      ];
    default:
      return [];
  }
}
function getDifficultyPreference(clue, difficulty) {
  if (difficulty === "Easy") {
    return clue.type === "absolute" || clue.type === "end" || clue.type === "offset" ? 0.35 : clue.type === "adjacent" && clue.ordered ? 0.2 : 0;
  }
  if (difficulty === "Hard") {
    return [
      "between",
      "adjacent-both",
      "not-adjacent",
      "not-opposite",
      "not-facing",
      "different-row",
      "distance-gap"
    ].includes(clue.type) ? 0.75 : clue.type === "offset" && clue.distance >= 2 ? 0.5 : clue.type === "adjacent" && clue.ordered ? -0.75 : clue.type === "absolute" ? -0.9 : 0;
  }
  return [
    "distance-gap",
    "between",
    "not-adjacent",
    "opposite",
    "facing"
  ].includes(clue.type) ? 0.35 : clue.type === "adjacent" && clue.ordered ? -0.35 : clue.type === "absolute" ? -0.45 : 0;
}
function buildCandidateCluePool(pool, participants, difficulty) {
  const participantFrequency = /* @__PURE__ */ new Map();
  for (const clue of pool) {
    for (const participant of getClueParticipants2(
      clue
    )) {
      participantFrequency.set(
        participant,
        (participantFrequency.get(
          participant
        ) ?? 0) + 1
      );
    }
  }
  const baselineAnalysis = buildClueGraphAnalysis(
    pool,
    "linear",
    "north"
  );
  const candidates = pool.map(
    (clue) => {
      const clueParticipants = getClueParticipants2(clue);
      const interactionPotential = clueParticipants.length === 0 ? 0 : clueParticipants.reduce(
        (sum, participant) => sum + (participantFrequency.get(
          participant
        ) ?? 0),
        0
      ) / clueParticipants.length;
      const participantCoverage = clueParticipants.length / Math.max(
        participants.length,
        1
      );
      const score = getClueReasoningWeight(clue) + getDifficultyPreference(
        clue,
        difficulty
      ) + Math.min(
        interactionPotential / Math.max(
          pool.length,
          1
        ),
        0.85
      ) + participantCoverage - (baselineAnalysis.repeatedAdjacencySerialization && clue.type === "adjacent" && clue.ordered ? 0.75 : 0);
      return {
        clue,
        score,
        interactionPotential,
        participantCoverage
      };
    }
  );
  return candidates.sort(
    (left, right) => right.score - left.score
  );
}

// src/lib/reasoning/seating/redundancy-detector.ts
function getAnchorClueCount(clues) {
  return clues.filter(
    (clue) => clue.type === "absolute" || clue.type === "end" || clue.type === "not-end"
  ).length;
}
function getDirectClueCount2(clues) {
  return clues.filter(
    (clue) => clue.type === "absolute" || clue.type === "end" || clue.type === "adjacent" && clue.ordered || clue.type === "offset" && clue.distance === 1
  ).length;
}
function detectRedundantClues(clues, isClueSetStillValid) {
  const minimized = [...clues];
  const removedClues = [];
  let removedCount = 0;
  for (let index2 = minimized.length - 1; index2 >= 0; index2--) {
    const candidate = minimized.filter(
      (_clue, clueIndex) => clueIndex !== index2
    );
    if (isClueSetStillValid(
      candidate
    )) {
      removedClues.push({
        index: index2,
        clue: minimized[index2]
      });
      minimized.splice(index2, 1);
      removedCount++;
    }
  }
  const minimalClueCount = minimized.length;
  const anchorDensity = minimalClueCount === 0 ? 0 : getAnchorClueCount(
    minimized
  ) / minimalClueCount;
  const directClueRatio = minimalClueCount === 0 ? 0 : getDirectClueCount2(
    minimized
  ) / minimalClueCount;
  const redundancyRatio = clues.length === 0 ? 0 : removedCount / clues.length;
  return {
    minimizedClues: minimized,
    removedClues,
    removedCount,
    originalClueCount: clues.length,
    minimalClueCount,
    redundancyScore: redundancyRatio,
    redundancyRatio,
    anchorDensity,
    directClueRatio
  };
}

// src/lib/reasoning/seating/clue-optimizer.ts
function isAlternateLinearCase(arrangementType, orientationType) {
  return arrangementType === "linear" && orientationType === "alternate";
}
function rotateCandidates(candidates, offset) {
  if (candidates.length === 0) {
    return candidates;
  }
  const pivot = offset % candidates.length;
  return [
    ...candidates.slice(pivot),
    ...candidates.slice(0, pivot)
  ];
}
function clueSignature(clue) {
  return JSON.stringify(clue);
}
function hasExcessiveOrderedAdjacency(clues, nextClue) {
  if (nextClue.type !== "adjacent" || !nextClue.ordered) {
    return false;
  }
  const orderedAdjacencyCount = clues.filter(
    (clue) => clue.type === "adjacent" && clue.ordered
  ).length;
  return orderedAdjacencyCount >= 2;
}
function scoreSubset(clues, arrangementType, orientationType, solverComplexity) {
  const graph = buildClueGraphAnalysis(
    clues,
    arrangementType,
    orientationType
  );
  const reasoningWeight = clues.reduce(
    (sum, clue) => sum + getClueReasoningWeight(clue),
    0
  );
  const sparsityScore = 1 - graph.density;
  const interactionBonus = graph.interactionRatio * 4;
  const serializationPenalty = graph.adjacencySerializationScore * 5;
  const diversityScore = getStructuralDiversityScore(
    graph
  ) * 4;
  return {
    graph,
    score: reasoningWeight + interactionBonus + sparsityScore * 2 + diversityScore - serializationPenalty + Math.min(
      solverComplexity / 12,
      2
    )
  };
}
function optimizeClueSubset(input) {
  let best;
  const attemptCount = Math.min(
    isAlternateLinearCase(
      input.arrangementType,
      input.orientationType
    ) ? 18 : 48,
    Math.max(
      isAlternateLinearCase(
        input.arrangementType,
        input.orientationType
      ) ? 8 : 12,
      input.candidates.length * (isAlternateLinearCase(
        input.arrangementType,
        input.orientationType
      ) ? 1 : 2)
    )
  );
  for (let attempt = 0; attempt < attemptCount; attempt++) {
    const orderedCandidates = rotateCandidates(
      input.candidates,
      attempt
    );
    const selected = [];
    const seen = /* @__PURE__ */ new Set();
    for (const candidate of orderedCandidates) {
      const signature = clueSignature(candidate.clue);
      if (seen.has(signature)) {
        continue;
      }
      if (hasExcessiveOrderedAdjacency(
        selected,
        candidate.clue
      )) {
        continue;
      }
      const trial = [
        ...selected,
        candidate.clue
      ];
      const evaluation2 = input.evaluate(trial);
      const graph = buildClueGraphAnalysis(
        trial,
        input.arrangementType,
        input.orientationType
      );
      const shouldAdd = selected.length < input.minClues || evaluation2.solutionCount === 1 || graph.interactionRatio >= 0.45 || candidate.score >= 2.5;
      if (shouldAdd && !graph.repeatedAdjacencySerialization) {
        selected.push(candidate.clue);
        seen.add(signature);
      }
      if (selected.length >= input.maxClues) {
        break;
      }
    }
    const evaluation = input.evaluate(selected);
    if (selected.length < input.minClues || !evaluation.uniquelySolvable) {
      continue;
    }
    const reduced = detectRedundantClues(
      selected,
      (candidate) => input.evaluate(candidate).uniquelySolvable
    );
    const minimized = reduced.minimizedClues;
    const minimizedEvaluation = input.evaluate(minimized);
    if (!minimizedEvaluation.uniquelySolvable) {
      continue;
    }
    const scored = scoreSubset(
      minimized,
      input.arrangementType,
      input.orientationType,
      minimizedEvaluation.solverComplexity
    );
    if (scored.graph.repeatedAdjacencySerialization) {
      continue;
    }
    if (analyzeStructuralDiversity(
      scored.graph
    ).rejected) {
      continue;
    }
    if (!best || scored.score > best.subsetScore) {
      best = {
        clues: minimized,
        subsetScore: scored.score,
        solverComplexity: minimizedEvaluation.solverComplexity
      };
    }
  }
  const fallbackClues = best?.clues ?? input.candidates.slice(0, input.minClues).map((candidate) => candidate.clue);
  const redundancy = detectRedundantClues(
    fallbackClues,
    (candidate) => input.evaluate(candidate).uniquelySolvable
  );
  const finalClues = redundancy.minimizedClues;
  const finalScore = scoreSubset(
    finalClues,
    input.arrangementType,
    input.orientationType,
    best?.solverComplexity ?? 0
  );
  const diversityAnalysis = analyzeStructuralDiversity(
    finalScore.graph
  );
  if (diversityAnalysis.rejected) {
    const fallbackGraph = buildClueGraphAnalysis(
      fallbackClues,
      input.arrangementType,
      input.orientationType
    );
    const fallbackDiversity = analyzeStructuralDiversity(
      fallbackGraph
    );
    if (!fallbackDiversity.rejected) {
      return {
        clues: fallbackClues,
        clueGraphDensity: fallbackGraph.density,
        clueInteractionRatio: fallbackGraph.interactionRatio,
        redundancyScore: redundancy.redundancyScore,
        redundancyRatio: redundancy.redundancyRatio,
        anchorDensity: redundancy.anchorDensity,
        directClueRatio: redundancy.directClueRatio,
        originalClueCount: redundancy.originalClueCount,
        minimalClueCount: redundancy.minimalClueCount,
        removedRedundantClues: redundancy.removedClues.map(
          (entry) => entry.clue
        ),
        topologyDiversityScore: fallbackDiversity.topologyDiversityScore,
        clueDiversityScore: fallbackDiversity.clueDiversityScore,
        inferenceDiversityScore: fallbackDiversity.inferenceDiversityScore,
        structuralDiversityScore: fallbackDiversity.structuralDiversityScore,
        clueTypeDistribution: fallbackGraph.clueTypeDistribution,
        repeatedStructureWarnings: fallbackDiversity.warnings
      };
    }
  }
  const structuralDiversityScore = diversityAnalysis.structuralDiversityScore;
  const repeatedStructureWarnings = getRepeatedStructureWarnings(
    finalScore.graph
  );
  recordStructuralSignature(
    finalScore.graph
  );
  return {
    clues: finalClues,
    clueGraphDensity: finalScore.graph.density,
    clueInteractionRatio: finalScore.graph.interactionRatio,
    redundancyScore: redundancy.redundancyScore,
    redundancyRatio: redundancy.redundancyRatio,
    anchorDensity: redundancy.anchorDensity,
    directClueRatio: redundancy.directClueRatio,
    originalClueCount: redundancy.originalClueCount,
    minimalClueCount: redundancy.minimalClueCount,
    removedRedundantClues: redundancy.removedClues.map(
      (entry) => entry.clue
    ),
    topologyDiversityScore: diversityAnalysis.topologyDiversityScore,
    clueDiversityScore: diversityAnalysis.clueDiversityScore,
    inferenceDiversityScore: diversityAnalysis.inferenceDiversityScore,
    structuralDiversityScore,
    clueTypeDistribution: finalScore.graph.clueTypeDistribution,
    repeatedStructureWarnings
  };
}

// src/lib/reasoning/seating/uniqueness-validator.ts
function evaluateClueSet(clues, input) {
  const solution = input.solveArrangement(clues);
  const profileSatisfied = input.meetsClueProfile(clues);
  const promptDirectlyAnswered = input.isPromptDirectlyAnsweredByClue(
    input.prompt,
    clues
  );
  return {
    solutionCount: solution.solutionCount,
    solverComplexity: solution.solverComplexity,
    profileSatisfied,
    promptDirectlyAnswered,
    uniquelySolvable: solution.solutionCount === 1 && profileSatisfied && !promptDirectlyAnswered
  };
}

// src/lib/reasoning/seating/inference-dependency-graph.ts
function round6(value, digits = 3) {
  return Number(
    value.toFixed(digits)
  );
}
function getNodeKind(step) {
  if (step.deduction.includes(
    "Anchored"
  )) {
    return "anchor";
  }
  if (step.deduction.includes(
    "Branching on"
  )) {
    return "branch";
  }
  if (step.deduction.includes(
    "Propagated"
  )) {
    return "propagation";
  }
  if (step.deduction.includes(
    "contradiction"
  )) {
    return "contradiction";
  }
  if (step.deduction.includes(
    "Accepted arrangement"
  )) {
    return "acceptance";
  }
  return "deduction";
}
function getKnownSeatCount(snapshot) {
  return snapshot.split("|").map((token) => token.trim()).filter(
    (token) => token.length > 0 && token !== "?"
  ).length;
}
function unique2(values2) {
  return [
    ...new Set(values2.filter(Boolean))
  ];
}
function buildInferenceDependencyGraph(steps) {
  const latestByConstraint = /* @__PURE__ */ new Map();
  const nodes = [];
  let lastStepId;
  let lastBranchId;
  let lastContradictionId;
  for (const step of steps) {
    const kind = getNodeKind(step);
    const prerequisiteIds = [];
    for (const constraintId of step.sourceConstraintIds) {
      const prerequisiteId = latestByConstraint.get(
        constraintId
      );
      if (prerequisiteId && prerequisiteId !== step.stepId) {
        prerequisiteIds.push(
          prerequisiteId
        );
      }
    }
    if (kind === "branch" && lastStepId) {
      prerequisiteIds.push(
        lastStepId
      );
    } else if (kind === "propagation" || kind === "contradiction" || kind === "acceptance" || kind === "deduction") {
      if (lastBranchId) {
        prerequisiteIds.push(
          lastBranchId
        );
      } else if (lastStepId) {
        prerequisiteIds.push(
          lastStepId
        );
      }
    }
    const eliminationChainIds = [];
    if (step.eliminatedPossibilities.length > 0) {
      if (lastBranchId) {
        eliminationChainIds.push(
          lastBranchId
        );
      }
      if (lastContradictionId) {
        eliminationChainIds.push(
          lastContradictionId
        );
      }
    }
    const node = {
      nodeId: step.stepId,
      kind,
      step,
      prerequisiteIds: unique2(
        prerequisiteIds.filter(
          (value) => value !== step.stepId
        )
      ),
      unlockedDeductionIds: [],
      eliminationChainIds: unique2(
        eliminationChainIds.filter(
          (value) => value !== step.stepId
        )
      )
    };
    nodes.push(node);
    for (const constraintId of step.sourceConstraintIds) {
      latestByConstraint.set(
        constraintId,
        step.stepId
      );
    }
    if (kind === "branch") {
      lastBranchId = step.stepId;
    }
    if (kind === "contradiction") {
      lastContradictionId = step.stepId;
    }
    lastStepId = step.stepId;
  }
  const nodeIndex = new Map(
    nodes.map((node) => [
      node.nodeId,
      node
    ])
  );
  for (const node of nodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      nodeIndex.get(prerequisiteId)?.unlockedDeductionIds.push(
        node.nodeId
      );
    }
  }
  const depthMemo = /* @__PURE__ */ new Map();
  const getDepth = (nodeId) => {
    const cached = depthMemo.get(nodeId);
    if (cached !== void 0) {
      return cached;
    }
    const node = nodeIndex.get(nodeId);
    if (!node) {
      return 0;
    }
    const depth = node.prerequisiteIds.length === 0 ? 1 : 1 + Math.max(
      ...node.prerequisiteIds.map(
        getDepth
      )
    );
    depthMemo.set(nodeId, depth);
    return depth;
  };
  const edgeCount = nodes.reduce(
    (sum, node) => sum + node.prerequisiteIds.length,
    0
  );
  const eliminationChainCount = nodes.filter(
    (node) => node.eliminationChainIds.length > 0
  ).length;
  const rootNodeIds = nodes.filter(
    (node) => node.prerequisiteIds.length === 0
  ).map((node) => node.nodeId);
  const inferenceDepth = nodes.length === 0 ? 0 : Math.max(
    ...nodes.map(
      (node) => getDepth(node.nodeId)
    )
  );
  const branchNodes = nodes.filter(
    (node) => node.kind === "branch"
  );
  const averageUnlocks = nodes.length === 0 ? 0 : nodes.reduce(
    (sum, node) => sum + node.unlockedDeductionIds.length,
    0
  ) / nodes.length;
  const knownSeatProgression = nodes.map(
    (node) => getKnownSeatCount(
      node.step.resultingStateSnapshot
    )
  );
  const stateProgressionSpread = knownSeatProgression.length <= 1 ? 0 : Math.max(
    0,
    knownSeatProgression[knownSeatProgression.length - 1] - knownSeatProgression[0]
  );
  const branchingComplexity = round6(
    branchNodes.length + averageUnlocks * 0.8 + eliminationChainCount * 0.6
  );
  const deductionDependencyScore = round6(
    edgeCount / Math.max(nodes.length, 1) * 2.2 + inferenceDepth * 0.7 + eliminationChainCount * 0.5 + stateProgressionSpread * 0.2
  );
  return {
    nodes,
    inferenceDepth,
    branchingComplexity,
    deductionDependencyScore,
    eliminationChainCount,
    edgeCount,
    rootNodeIds
  };
}

// src/lib/reasoning/seating-engine.ts
var PARTICIPANT_POOL = [
  "Aman",
  "Bhavna",
  "Charu",
  "Deepak",
  "Esha",
  "Farhan",
  "Gauri",
  "Harish",
  "Isha",
  "Jatin",
  "Kavya",
  "Lokesh",
  "Megha",
  "Nitin",
  "Pallavi",
  "Rohit",
  "Sneha",
  "Tanvi",
  "Ujjwal",
  "Varsha",
  "Yamini",
  "Zubin"
];
function buildSeatingErrorMetadata(metadata) {
  return buildReasoningErrorMetadata(
    metadata
  );
}
function extractSeatingPatternConfig(pattern) {
  if (!pattern) {
    return {};
  }
  const patternRecord = pattern;
  const arrangementTypes = Array.isArray(
    patternRecord["arrangementTypes"]
  ) ? patternRecord["arrangementTypes"] : typeof patternRecord["arrangementType"] === "string" ? [
    patternRecord["arrangementType"]
  ] : void 0;
  const orientationTypes = Array.isArray(
    patternRecord["orientationTypes"]
  ) ? patternRecord["orientationTypes"] : typeof patternRecord["orientation"] === "string" ? [
    patternRecord["orientation"]
  ] : typeof patternRecord["orientationType"] === "string" ? [
    patternRecord["orientationType"]
  ] : void 0;
  const participantCount = typeof patternRecord["participantCount"] === "number" ? Number(
    patternRecord["participantCount"]
  ) : void 0;
  const clueTypes = Array.isArray(
    patternRecord["clueTypes"]
  ) ? patternRecord["clueTypes"] : void 0;
  const inferenceDepth = typeof patternRecord["inferenceDepth"] === "number" ? Number(
    patternRecord["inferenceDepth"]
  ) : void 0;
  const normalizedText = `${pattern.topic ?? ""} ${pattern.subtopic ?? ""}`.toLowerCase();
  const inferredArrangementTypes = arrangementTypes?.length ? arrangementTypes : normalizedText.includes(
    "double row"
  ) || normalizedText.includes(
    "double-row"
  ) ? [
    "double-row"
  ] : normalizedText.includes(
    "parallel row"
  ) || normalizedText.includes(
    "parallel-row"
  ) ? [
    "parallel-row"
  ] : normalizedText.includes(
    "square"
  ) ? [
    "square"
  ] : normalizedText.includes(
    "rectangular"
  ) ? [
    "rectangular"
  ] : normalizedText.includes(
    "circular"
  ) ? [
    "circular"
  ] : normalizedText.includes(
    "linear"
  ) || normalizedText.includes(
    "row"
  ) ? [
    "linear"
  ] : void 0;
  const inferredOrientationTypes = orientationTypes?.length ? orientationTypes : normalizedText.includes(
    "alternate facing"
  ) ? [
    "alternate"
  ] : normalizedText.includes(
    "mixed orientation"
  ) || normalizedText.includes(
    "mixed facing"
  ) ? [
    "mixed"
  ] : normalizedText.includes(
    "facing centre"
  ) || normalizedText.includes(
    "facing center"
  ) || normalizedText.includes(
    "centre"
  ) || normalizedText.includes(
    "center"
  ) ? [
    "center"
  ] : normalizedText.includes(
    "outward"
  ) ? [
    "outward"
  ] : normalizedText.includes(
    "facing south"
  ) || normalizedText.includes(
    "south facing"
  ) ? [
    "south"
  ] : normalizedText.includes(
    "facing north"
  ) || normalizedText.includes(
    "north facing"
  ) ? [
    "north"
  ] : void 0;
  return {
    arrangementTypes: inferredArrangementTypes,
    orientationTypes: inferredOrientationTypes,
    participantCount,
    clueTypes,
    inferenceDepth
  };
}
function selectParticipants(count) {
  return shuffle(
    PARTICIPANT_POOL
  ).slice(0, count);
}
function getArrangementCandidates(difficulty) {
  if (difficulty === "Easy") {
    return [
      "linear",
      "circular"
    ];
  }
  if (difficulty === "Medium") {
    return [
      "linear",
      "circular",
      "square",
      "rectangular"
    ];
  }
  return [
    "linear",
    "circular",
    "square",
    "rectangular",
    "double-row",
    "parallel-row"
  ];
}
function getArrangementType(difficulty, motif, config) {
  if (config.arrangementTypes?.length) {
    return pickRandomItem(
      config.arrangementTypes
    );
  }
  if (motif.id.includes("row") && difficulty === "Hard") {
    return pickRandomItem([
      "double-row",
      "parallel-row"
    ]);
  }
  return pickRandomItem(
    getArrangementCandidates(
      difficulty
    )
  );
}
function getDefaultParticipantCount(arrangementType, difficulty) {
  switch (arrangementType) {
    case "linear":
      return difficulty === "Easy" ? 5 + randomInt(0, 1) : 6;
    case "circular":
      return difficulty === "Hard" ? 8 : 6;
    case "square":
    case "rectangular":
      return 8;
    case "double-row":
    case "parallel-row":
      return difficulty === "Hard" ? 8 : 6;
    default:
      return 6;
  }
}
function getParticipantCount(arrangementType, difficulty, config) {
  if (config.participantCount && config.participantCount > 3) {
    if (arrangementType === "double-row" || arrangementType === "parallel-row") {
      return config.participantCount % 2 === 0 ? config.participantCount : config.participantCount + 1;
    }
    return config.participantCount;
  }
  return getDefaultParticipantCount(
    arrangementType,
    difficulty
  );
}
function getOrientationCandidates(arrangementType, difficulty) {
  switch (arrangementType) {
    case "linear":
      return difficulty === "Hard" ? [
        "north",
        "south",
        "alternate",
        "mixed"
      ] : [
        "north",
        "south"
      ];
    case "circular":
    case "square":
    case "rectangular":
      return difficulty === "Hard" ? [
        "center",
        "outward",
        "alternate",
        "mixed"
      ] : [
        "center",
        "outward"
      ];
    case "double-row":
      return [
        "mixed",
        "alternate"
      ];
    case "parallel-row":
      return difficulty === "Hard" ? [
        "north",
        "south",
        "mixed"
      ] : [
        "north",
        "south"
      ];
    default:
      return [
        "north"
      ];
  }
}
function getOrientationType(arrangementType, difficulty, config) {
  if (config.orientationTypes?.length) {
    return pickRandomItem(
      config.orientationTypes
    );
  }
  return pickRandomItem(
    getOrientationCandidates(
      arrangementType,
      difficulty
    )
  );
}
function createMixedFacings2(count, primary, secondary) {
  const mixed = Array.from(
    { length: count },
    (_value, index2) => index2 % 2 === 0 ? primary : secondary
  );
  return shuffle(mixed);
}
function createLinearSeats2(seatCount, orientationType) {
  const facings = orientationType === "south" ? Array.from(
    { length: seatCount },
    () => "south"
  ) : orientationType === "alternate" ? Array.from(
    { length: seatCount },
    (_value, index2) => index2 % 2 === 0 ? "north" : "south"
  ) : orientationType === "mixed" ? createMixedFacings2(
    seatCount,
    "north",
    "south"
  ) : Array.from(
    { length: seatCount },
    () => "north"
  );
  return Array.from(
    { length: seatCount },
    (_value, index2) => ({
      index: index2,
      row: 0,
      col: index2,
      facing: facings[index2],
      label: `Seat ${index2 + 1}`
    })
  );
}
function createRingSeats2(seatCount, arrangementType, orientationType) {
  const facings = orientationType === "outward" ? Array.from(
    { length: seatCount },
    () => "outward"
  ) : orientationType === "alternate" ? Array.from(
    { length: seatCount },
    (_value, index2) => index2 % 2 === 0 ? "center" : "outward"
  ) : orientationType === "mixed" ? createMixedFacings2(
    seatCount,
    "center",
    "outward"
  ) : Array.from(
    { length: seatCount },
    () => "center"
  );
  const seatLabelPrefix = arrangementType === "square" ? "Square seat" : arrangementType === "rectangular" ? "Rectangular seat" : "Seat";
  return Array.from(
    { length: seatCount },
    (_value, index2) => ({
      index: index2,
      row: 0,
      col: index2,
      facing: facings[index2],
      label: `${seatLabelPrefix} ${index2 + 1}`
    })
  );
}
function createTwoRowSeats2(seatCount, arrangementType, orientationType) {
  const colCount = seatCount / 2;
  const seats = [];
  const topLabel = arrangementType === "double-row" ? "Front row" : "Top row";
  const bottomLabel = arrangementType === "double-row" ? "Back row" : "Bottom row";
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < colCount; col++) {
      let facing;
      if (orientationType === "north" || orientationType === "south") {
        facing = orientationType;
      } else if (arrangementType === "double-row" && orientationType !== "mixed") {
        facing = row === 0 ? "south" : "north";
      } else if (orientationType === "alternate") {
        facing = (row + col) % 2 === 0 ? "north" : "south";
      } else {
        facing = (row === 0 ? col % 2 === 0 : col % 2 === 1) ? "north" : "south";
      }
      seats.push({
        index: row * colCount + col,
        row,
        col,
        facing,
        label: `${row === 0 ? topLabel : bottomLabel} ${col + 1}`
      });
    }
  }
  return seats;
}
function buildLayout2(arrangementType, orientationType, seatCount) {
  if (arrangementType === "linear") {
    return {
      arrangementType,
      orientationType,
      family: "single-row",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createLinearSeats2(
        seatCount,
        orientationType
      )
    };
  }
  if (arrangementType === "circular" || arrangementType === "square" || arrangementType === "rectangular") {
    return {
      arrangementType,
      orientationType,
      family: "ring",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createRingSeats2(
        seatCount,
        arrangementType,
        orientationType
      )
    };
  }
  return {
    arrangementType,
    orientationType,
    family: "two-row",
    seatCount,
    rowCount: 2,
    colCount: seatCount / 2,
    seats: createTwoRowSeats2(
      seatCount,
      arrangementType,
      orientationType
    )
  };
}
function getSeat2(layout, index2) {
  return layout.seats[index2];
}
function getOppositeNode2(index2, layout) {
  if (layout.family === "ring") {
    if (layout.seatCount % 2 !== 0) {
      return void 0;
    }
    return getSeat2(
      layout,
      (index2 + layout.seatCount / 2) % layout.seatCount
    );
  }
  if (layout.family === "two-row") {
    const seat = getSeat2(
      layout,
      index2
    );
    return getSeat2(
      layout,
      (1 - seat.row) * layout.colCount + seat.col
    );
  }
  return void 0;
}
function isTwoRowLayout(layout) {
  return layout.family === "two-row";
}
function getRelativeIndex2(index2, direction, distance, layout) {
  const seat = getSeat2(
    layout,
    index2
  );
  if (layout.family === "single-row" || layout.family === "two-row") {
    const step2 = seat.facing === "south" ? direction === "left" ? 1 : -1 : direction === "left" ? -1 : 1;
    const targetCol = seat.col + step2 * distance;
    if (targetCol < 0 || targetCol >= layout.colCount) {
      return void 0;
    }
    return seat.row * layout.colCount + targetCol;
  }
  const step = seat.facing === "outward" ? direction === "left" ? -distance : distance : direction === "left" ? distance : -distance;
  return (index2 + step + layout.seatCount) % layout.seatCount;
}
function getCircularDistance2(firstIndex, secondIndex, layout) {
  const direct = Math.abs(
    firstIndex - secondIndex
  );
  return Math.min(
    direct,
    layout.seatCount - direct
  );
}
function areAdjacent2(firstIndex, secondIndex, layout) {
  if (layout.family === "ring") {
    return getCircularDistance2(
      firstIndex,
      secondIndex,
      layout
    ) === 1;
  }
  const firstSeat = getSeat2(
    layout,
    firstIndex
  );
  const secondSeat = getSeat2(
    layout,
    secondIndex
  );
  return firstSeat.row === secondSeat.row && Math.abs(
    firstSeat.col - secondSeat.col
  ) === 1;
}
function getOppositeIndex2(index2, layout) {
  return getOppositeNode2(
    index2,
    layout
  )?.index;
}
function sameRow2(firstIndex, secondIndex, layout) {
  return getSeat2(layout, firstIndex).row === getSeat2(layout, secondIndex).row;
}
function buildAbsoluteClues(arrangement) {
  return arrangement.map(
    (person, index2) => ({
      type: "absolute",
      person,
      index: index2
    })
  );
}
function buildEndClues(arrangement) {
  return [
    {
      type: "end",
      person: arrangement[0],
      side: "left"
    },
    {
      type: "end",
      person: arrangement[arrangement.length - 1],
      side: "right"
    }
  ];
}
function buildAdjacentClues(arrangement, layout) {
  const clues = [];
  for (let index2 = 0; index2 < arrangement.length; index2++) {
    const rightIndex = getRelativeIndex2(
      index2,
      "right",
      1,
      layout
    );
    if (rightIndex === void 0) {
      continue;
    }
    if (layout.family !== "ring" && !sameRow2(
      index2,
      rightIndex,
      layout
    )) {
      continue;
    }
    clues.push({
      type: "adjacent",
      left: arrangement[index2],
      right: arrangement[rightIndex],
      ordered: true
    });
    clues.push({
      type: "adjacent",
      left: arrangement[index2],
      right: arrangement[rightIndex],
      ordered: false
    });
  }
  return clues;
}
function buildNotAdjacentClues(arrangement, layout) {
  const clues = [];
  for (let first = 0; first < arrangement.length; first++) {
    for (let second = first + 1; second < arrangement.length; second++) {
      if (!areAdjacent2(
        first,
        second,
        layout
      )) {
        clues.push({
          type: "not-adjacent",
          left: arrangement[first],
          right: arrangement[second]
        });
      }
    }
  }
  return clues;
}
function buildOffsetClues(arrangement, layout) {
  const clues = [];
  const maxDistance = layout.family === "ring" ? Math.min(
    3,
    Math.floor(
      layout.seatCount / 2
    )
  ) : Math.min(3, layout.colCount - 1);
  for (let index2 = 0; index2 < arrangement.length; index2++) {
    for (let distance = 1; distance <= maxDistance; distance++) {
      for (const direction of [
        "left",
        "right"
      ]) {
        const targetIndex = getRelativeIndex2(
          index2,
          direction,
          distance,
          layout
        );
        if (targetIndex === void 0 || targetIndex === index2) {
          continue;
        }
        clues.push({
          type: "offset",
          anchor: arrangement[index2],
          person: arrangement[targetIndex],
          distance,
          direction
        });
      }
    }
  }
  return clues;
}
function buildDistanceGapClues(arrangement, layout) {
  const clues = [];
  for (let first = 0; first < arrangement.length; first++) {
    for (let second = first + 1; second < arrangement.length; second++) {
      let gap;
      if (layout.family === "ring") {
        gap = getCircularDistance2(
          first,
          second,
          layout
        ) - 1;
      } else if (sameRow2(
        first,
        second,
        layout
      )) {
        gap = Math.abs(
          getSeat2(
            layout,
            first
          ).col - getSeat2(
            layout,
            second
          ).col
        ) - 1;
      } else {
        continue;
      }
      if (gap === 1 || gap === 2) {
        clues.push({
          type: "distance-gap",
          left: arrangement[first],
          right: arrangement[second],
          gap
        });
      }
    }
  }
  return clues;
}
function buildBetweenClues(arrangement, layout) {
  const clues = [];
  for (let index2 = 0; index2 < arrangement.length; index2++) {
    const leftIndex = getRelativeIndex2(
      index2,
      "left",
      1,
      layout
    );
    const rightIndex = getRelativeIndex2(
      index2,
      "right",
      1,
      layout
    );
    if (leftIndex === void 0 || rightIndex === void 0) {
      continue;
    }
    clues.push({
      type: "between",
      middle: arrangement[index2],
      first: arrangement[leftIndex],
      second: arrangement[rightIndex]
    });
    clues.push({
      type: "adjacent-both",
      middle: arrangement[index2],
      first: arrangement[leftIndex],
      second: arrangement[rightIndex]
    });
  }
  return clues;
}
function buildNotEndClues(arrangement) {
  return arrangement.slice(1, -1).map(
    (person) => ({
      type: "not-end",
      person
    })
  );
}
function buildOppositeClues(arrangement, layout) {
  const clues = [];
  for (let index2 = 0; index2 < arrangement.length; index2++) {
    const oppositeIndex = getOppositeIndex2(
      index2,
      layout
    );
    if (oppositeIndex === void 0 || oppositeIndex <= index2) {
      continue;
    }
    clues.push({
      type: "opposite",
      left: arrangement[index2],
      right: arrangement[oppositeIndex]
    });
  }
  return clues;
}
function buildNotOppositeClues(arrangement, layout) {
  const clues = [];
  for (let first = 0; first < arrangement.length; first++) {
    for (let second = first + 1; second < arrangement.length; second++) {
      const oppositeIndex = getOppositeIndex2(
        first,
        layout
      );
      if (oppositeIndex !== second) {
        clues.push({
          type: "not-opposite",
          left: arrangement[first],
          right: arrangement[second]
        });
      }
    }
  }
  return clues;
}
function buildRowClues(arrangement, layout) {
  const clues = [];
  if (!isTwoRowLayout(layout)) {
    return clues;
  }
  for (let first = 0; first < arrangement.length; first++) {
    for (let second = first + 1; second < arrangement.length; second++) {
      if (sameRow2(
        first,
        second,
        layout
      )) {
        clues.push({
          type: "same-row",
          left: arrangement[first],
          right: arrangement[second]
        });
      } else {
        clues.push({
          type: "different-row",
          left: arrangement[first],
          right: arrangement[second]
        });
      }
      const oppositeIndex = getOppositeIndex2(
        first,
        layout
      );
      if (oppositeIndex === second) {
        clues.push({
          type: "facing",
          left: arrangement[first],
          right: arrangement[second]
        });
      } else {
        clues.push({
          type: "not-facing",
          left: arrangement[first],
          right: arrangement[second]
        });
      }
    }
  }
  return clues;
}
function dedupeClues(clues) {
  const seen = /* @__PURE__ */ new Set();
  return clues.filter((clue) => {
    const key = JSON.stringify(clue);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function isDirectClue(clue) {
  return clue.type === "absolute" || clue.type === "end";
}
function getEliminationContribution(clue) {
  switch (clue.type) {
    case "not-end":
    case "not-opposite":
    case "not-adjacent":
    case "different-row":
    case "not-facing":
      return 1;
    case "distance-gap":
    case "between":
    case "adjacent-both":
    case "same-row":
    case "facing":
      return 2;
    default:
      return 0;
  }
}
function getClueOperator2(clue) {
  return clue.operator ?? "EQUALS";
}
function getClueWeight2(clue) {
  return clue.weight ?? (getClueOperator2(clue) === "NOT_EQUALS" ? 2.5 : 1);
}
function getDirectClueLimit(difficulty) {
  return difficulty === "Easy" ? 1 : 0;
}
function isAlternateLinearLayout(layout) {
  return layout.arrangementType === "linear" && layout.orientationType === "alternate";
}
function getMinimumRelationalClues(difficulty, layout) {
  if (difficulty === "Hard") {
    if (isAlternateLinearLayout(
      layout
    )) {
      return 5;
    }
    return layout.family === "two-row" ? 5 : 6;
  }
  if (difficulty === "Medium") {
    return layout.family === "ring" ? 4 : 4;
  }
  return 3;
}
function getTargetClueRange(difficulty, layout) {
  if (difficulty === "Easy") {
    return layout.family === "ring" ? [4, 5] : [4, 5];
  }
  if (difficulty === "Hard") {
    if (isAlternateLinearLayout(
      layout
    )) {
      return [5, 6];
    }
    return layout.family === "two-row" ? [6, 8] : [6, 8];
  }
  return layout.family === "two-row" ? [5, 7] : [5, 6];
}
function isHighComplexitySeatingConfig(config) {
  return (config.arrangementTypes?.length ?? 0) >= 3 || (config.orientationTypes?.length ?? 0) >= 4 || (config.participantCount ?? 0) >= 8;
}
function getMaxSeatingGenerationAttempts(difficulty, config) {
  if (difficulty === "Hard" && isHighComplexitySeatingConfig(
    config
  )) {
    return 90;
  }
  if (difficulty === "Hard") {
    return 180;
  }
  if (difficulty === "Medium") {
    return 120;
  }
  return 80;
}
function getEmergencyFallbackAttempts(difficulty, config) {
  if (difficulty === "Hard" && isHighComplexitySeatingConfig(
    config
  )) {
    return 36;
  }
  return difficulty === "Hard" ? 72 : 120;
}
function getConfiguredClueRange(difficulty, layout, config) {
  const [baseMin, baseMax] = getTargetClueRange(
    difficulty,
    layout
  );
  if (difficulty === "Hard" && isHighComplexitySeatingConfig(
    config
  )) {
    return [
      Math.min(baseMin, 5),
      Math.min(baseMax, 6)
    ];
  }
  return [baseMin, baseMax];
}
function getDirectClueCount3(clues) {
  return clues.filter(isDirectClue).length;
}
function getRelationalClueCount(clues) {
  return clues.length - getDirectClueCount3(clues);
}
function getDeductionDepth(clues) {
  return clues.reduce(
    (sum, clue) => {
      const baseWeight = getClueWeight2(clue);
      switch (clue.type) {
        case "adjacent":
          return sum + Math.max(
            baseWeight,
            clue.ordered ? 1 : 2
          );
        case "offset":
          return sum + Math.max(
            baseWeight,
            clue.distance >= 3 ? 3 : 2
          );
        case "distance-gap":
        case "between":
        case "adjacent-both":
        case "same-row":
        case "facing":
        case "opposite":
          return sum + Math.max(baseWeight, 2);
        case "not-adjacent":
        case "not-opposite":
        case "not-end":
        case "different-row":
        case "not-facing":
          return sum + Math.max(baseWeight, 1);
        default:
          return sum + baseWeight;
      }
    },
    0
  );
}
function getEliminationDepth(clues) {
  return clues.reduce(
    (sum, clue) => sum + getEliminationContribution(
      clue
    ),
    0
  );
}
function hasEliminationClue(clues) {
  return clues.some(
    (clue) => [
      "not-adjacent",
      "not-opposite",
      "not-end",
      "different-row",
      "not-facing"
    ].includes(clue.type)
  );
}
function hasDirectionalClue(clues) {
  return clues.some(
    (clue) => clue.type === "adjacent" && clue.ordered || clue.type === "offset" || clue.type === "opposite" || clue.type === "facing"
  );
}
function meetsClueProfile(clues, difficulty, layout) {
  return getDirectClueCount3(clues) <= getDirectClueLimit(
    difficulty
  ) && getRelationalClueCount(clues) >= getMinimumRelationalClues(
    difficulty,
    layout
  ) && (difficulty !== "Hard" || hasEliminationClue(clues)) && hasDirectionalClue(clues);
}
function buildPromptCandidates(arrangement, layout) {
  const prompts = [];
  for (let index2 = 0; index2 < arrangement.length; index2++) {
    const anchor = arrangement[index2];
    for (const direction of [
      "left",
      "right"
    ]) {
      const neighborIndex = getRelativeIndex2(
        index2,
        direction,
        1,
        layout
      );
      if (neighborIndex !== void 0 && (layout.family === "ring" || sameRow2(
        index2,
        neighborIndex,
        layout
      ))) {
        prompts.push({
          type: direction === "left" ? "neighbor-left" : "neighbor-right",
          anchor,
          prompt: `Who sits immediately to the ${direction} of ${anchor}?`,
          correctAnswer: arrangement[neighborIndex]
        });
      }
      for (const distance of [
        2,
        3
      ]) {
        const targetIndex = getRelativeIndex2(
          index2,
          direction,
          distance,
          layout
        );
        if (targetIndex === void 0) {
          continue;
        }
        prompts.push({
          type: "relative",
          anchor,
          distance,
          direction,
          prompt: `Who sits ${distance === 2 ? "second" : "third"} to the ${direction} of ${anchor}?`,
          correctAnswer: arrangement[targetIndex]
        });
      }
    }
    const oppositeIndex = getOppositeIndex2(
      index2,
      layout
    );
    if (oppositeIndex !== void 0) {
      prompts.push({
        type: "opposite",
        anchor,
        prompt: layout.family === "two-row" ? `Who sits facing ${anchor}?` : `Who sits opposite ${anchor}?`,
        correctAnswer: arrangement[oppositeIndex]
      });
    }
    if (layout.family === "two-row") {
      const facingIndex = getOppositeIndex2(
        index2,
        layout
      );
      if (facingIndex !== void 0) {
        prompts.push({
          type: "facing",
          anchor,
          prompt: `Who sits directly facing ${anchor}?`,
          correctAnswer: arrangement[facingIndex]
        });
      }
    }
  }
  return shuffle(prompts);
}
function filterCluesByPattern(clues, config) {
  if (!config.clueTypes?.length) {
    return clues;
  }
  const types2 = new Set(
    config.clueTypes
  );
  return clues.filter((clue) => {
    if (clue.type === "adjacent" && types2.has("neighbor")) {
      return true;
    }
    if (clue.type === "offset" && types2.has("left-right")) {
      return true;
    }
    if (clue.type === "distance-gap" && types2.has("distance")) {
      return true;
    }
    if (isDirectClue(clue) && types2.has(
      "direct-position"
    )) {
      return true;
    }
    return types2.has(clue.type);
  });
}
function getCluePool(arrangement, motif, layout, config) {
  const absolute = layout.family === "single-row" ? buildAbsoluteClues(
    arrangement
  ) : [];
  const ends = layout.family === "single-row" ? buildEndClues(arrangement) : [];
  const adjacent = buildAdjacentClues(
    arrangement,
    layout
  );
  const notAdjacent = buildNotAdjacentClues(
    arrangement,
    layout
  );
  const offsets = buildOffsetClues(
    arrangement,
    layout
  );
  const gaps = buildDistanceGapClues(
    arrangement,
    layout
  );
  const between2 = buildBetweenClues(
    arrangement,
    layout
  );
  const notEnd = layout.family === "single-row" ? buildNotEndClues(
    arrangement
  ) : [];
  const opposite = layout.family !== "single-row" ? buildOppositeClues(
    arrangement,
    layout
  ) : [];
  const notOpposite = layout.family !== "single-row" ? buildNotOppositeClues(
    arrangement,
    layout
  ) : [];
  const rowClues = isTwoRowLayout(layout) ? buildRowClues(
    arrangement,
    layout
  ) : [];
  let orderedPool;
  if (motif.id === "direct_clue_linear") {
    orderedPool = [
      ...shuffle(offsets),
      ...shuffle(
        adjacent.filter(
          (clue) => clue.type === "adjacent" && clue.ordered
        )
      ),
      ...shuffle(gaps),
      ...shuffle(rowClues),
      ...shuffle(between2),
      ...shuffle(opposite),
      ...shuffle(notEnd),
      ...shuffle(ends),
      ...shuffle(absolute)
    ];
  } else if (motif.id === "neighbor_clue_linear" || motif.id.includes("neighbor")) {
    orderedPool = [
      ...shuffle(adjacent),
      ...shuffle(between2),
      ...shuffle(gaps),
      ...shuffle(rowClues),
      ...shuffle(
        offsets.filter(
          (clue) => clue.type === "offset" && clue.distance <= 2
        )
      ),
      ...shuffle(notAdjacent),
      ...shuffle(notOpposite),
      ...shuffle(notEnd)
    ];
  } else {
    orderedPool = [
      ...shuffle(offsets),
      ...shuffle(between2),
      ...shuffle(gaps),
      ...shuffle(opposite),
      ...shuffle(rowClues),
      ...shuffle(
        adjacent.filter(
          (clue) => clue.type === "adjacent" && clue.ordered
        )
      ),
      ...shuffle(
        adjacent.filter(
          (clue) => clue.type === "adjacent" && !clue.ordered
        )
      ),
      ...shuffle(notAdjacent),
      ...shuffle(notOpposite),
      ...shuffle(notEnd),
      ...shuffle(ends)
    ];
  }
  return dedupeClues(
    filterCluesByPattern(
      orderedPool,
      config
    )
  );
}
function solveArrangement(participants, clues, layout) {
  if (layout.arrangementType === "linear") {
    return solveLinearSeating(
      participants,
      clues,
      layout.orientationType,
      layout.seatCount
    );
  }
  if (layout.arrangementType === "circular") {
    return solveCircularSeating(
      participants,
      clues,
      layout.orientationType,
      layout.seatCount
    );
  }
  return solveSeatingArrangement(
    participants,
    clues,
    layout.arrangementType,
    layout.orientationType,
    layout.seatCount
  );
}
function buildClueSet(participants, arrangement, motif, difficulty, layout, prompt, config) {
  const pool = getCluePool(
    arrangement,
    motif,
    layout,
    config
  );
  const [minClues, maxClues] = getConfiguredClueRange(
    difficulty,
    layout,
    config
  );
  const candidates = buildCandidateCluePool(
    pool,
    participants,
    difficulty
  );
  return optimizeClueSubset({
    candidates,
    minClues,
    maxClues,
    difficulty,
    arrangementType: layout.arrangementType,
    orientationType: layout.orientationType,
    prompt,
    evaluate: (candidateClues) => evaluateClueSet(
      candidateClues,
      {
        prompt,
        solveArrangement: (clues) => solveArrangement(
          participants,
          clues,
          layout
        ),
        meetsClueProfile: (clues) => meetsClueProfile(
          clues,
          difficulty,
          layout
        ),
        isPromptDirectlyAnsweredByClue: (nextPrompt, clues) => isPromptDirectlyAnsweredByClue(
          nextPrompt,
          clues,
          layout.arrangementType,
          layout.orientationType,
          layout.seatCount
        )
      }
    )
  });
}
function analyzeClueSet(clues, layout, participants, difficulty, prompt) {
  const graphAnalysis = buildClueGraphAnalysis(
    clues,
    layout.arrangementType,
    layout.orientationType
  );
  const redundancy = detectRedundantClues(
    clues,
    (candidateClues) => evaluateClueSet(
      candidateClues,
      {
        prompt,
        solveArrangement: (nextClues) => solveArrangement(
          participants,
          nextClues,
          layout
        ),
        meetsClueProfile: (nextClues) => meetsClueProfile(
          nextClues,
          difficulty,
          layout
        ),
        isPromptDirectlyAnsweredByClue: (nextPrompt, nextClues) => isPromptDirectlyAnsweredByClue(
          nextPrompt,
          nextClues,
          layout.arrangementType,
          layout.orientationType,
          layout.seatCount
        )
      }
    ).uniquelySolvable
  );
  const structuralDiversityScore = getStructuralDiversityScore(
    graphAnalysis
  );
  const diversityAnalysis = analyzeStructuralDiversity(
    graphAnalysis
  );
  const repeatedStructureWarnings = getRepeatedStructureWarnings(
    graphAnalysis
  );
  recordStructuralSignature(
    graphAnalysis
  );
  return {
    clueGraphDensity: graphAnalysis.density,
    clueDensity: clues.length > 0 && participants.length > 0 ? clues.length / participants.length : 0,
    clueInteractionRatio: graphAnalysis.interactionRatio,
    redundancyScore: redundancy.redundancyScore,
    redundancyRatio: redundancy.redundancyRatio,
    anchorDensity: redundancy.anchorDensity,
    directClueRatio: redundancy.directClueRatio,
    originalClueCount: redundancy.originalClueCount,
    minimalClueCount: redundancy.minimalClueCount,
    removedRedundantClues: redundancy.removedClues.map(
      (entry) => entry.clue
    ),
    topologyDiversityScore: diversityAnalysis.topologyDiversityScore,
    clueDiversityScore: diversityAnalysis.clueDiversityScore,
    inferenceDiversityScore: diversityAnalysis.inferenceDiversityScore,
    structuralDiversityScore,
    clueTypeDistribution: graphAnalysis.clueTypeDistribution,
    repeatedStructureWarnings
  };
}
function createPrompt(arrangement, clues, layout) {
  const promptCandidates = buildPromptCandidates(
    arrangement,
    layout
  ).filter(
    (prompt) => !isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      layout.arrangementType,
      layout.orientationType,
      layout.seatCount
    )
  );
  return promptCandidates[0] ?? buildPromptCandidates(
    arrangement,
    layout
  )[0];
}
function formatFinalArrangement(arrangement, layout) {
  if (layout.family === "single-row") {
    return arrangement.join(" | ");
  }
  if (layout.family === "ring") {
    return arrangement.map(
      (person, index2) => `${index2 + 1}:${person}`
    ).join(" | ");
  }
  const top = arrangement.slice(0, layout.colCount).join(" | ");
  const bottom = arrangement.slice(layout.colCount).join(" | ");
  return `Row 1: ${top}; Row 2: ${bottom}`;
}
function clueToDebugText(clue) {
  const operatorLabel = getClueOperator2(clue) === "NOT_EQUALS" ? "[NOT_EQUALS] " : "";
  switch (clue.type) {
    case "absolute":
      return `${operatorLabel}${clue.person} at seat ${clue.index + 1}`;
    case "end":
      return `${operatorLabel}${clue.person} at ${clue.side} end`;
    case "adjacent":
      return operatorLabel + (clue.ordered ? `${clue.left} immediately left of ${clue.right}` : `${clue.left} adjacent to ${clue.right}`);
    case "not-adjacent":
      return `${operatorLabel}${clue.left} not adjacent to ${clue.right}`;
    case "offset":
      return `${operatorLabel}${clue.person} ${clue.distance} ${clue.direction} of ${clue.anchor}`;
    case "distance-gap":
      return `${operatorLabel}${clue.gap} gap between ${clue.left} and ${clue.right}`;
    case "between":
      return `${operatorLabel}${clue.middle} between ${clue.first} and ${clue.second}`;
    case "adjacent-both":
      return `${operatorLabel}${clue.middle} adjacent to both ${clue.first} and ${clue.second}`;
    case "not-end":
      return `${operatorLabel}${clue.person} not at end`;
    case "opposite":
      return `${operatorLabel}${clue.left} opposite ${clue.right}`;
    case "not-opposite":
      return `${operatorLabel}${clue.left} not opposite ${clue.right}`;
    case "same-row":
      return `${operatorLabel}${clue.left} same row as ${clue.right}`;
    case "different-row":
      return `${operatorLabel}${clue.left} different row from ${clue.right}`;
    case "facing":
      return `${operatorLabel}${clue.left} faces ${clue.right}`;
    case "not-facing":
      return `${operatorLabel}${clue.left} does not face ${clue.right}`;
    default:
      return "seating clue";
  }
}
function buildSolverTrace(clues, layout) {
  return [
    `Arrangement type: ${layout.arrangementType}`,
    `Orientation type: ${layout.orientationType}`,
    ...clues.map(
      (clue, index2) => `Clue ${index2 + 1}: ${clueToDebugText(clue)}`
    )
  ];
}
function buildScenarioFromValidatedState(participants, arrangement, layout, clues, prompt, warnings, solverComplexity, clueAnalysis, validationReport, solverInferenceSteps, solverTrace, generationAttemptMetrics) {
  const directClueCount = getDirectClueCount3(clues);
  const relationalClueCount = getRelationalClueCount(clues);
  const inferenceDependencyGraph = buildInferenceDependencyGraph(
    solverInferenceSteps
  );
  const deductionDepth = Math.max(
    3,
    Math.max(
      getDeductionDepth(clues),
      inferenceDependencyGraph.inferenceDepth
    )
  );
  const eliminationDepth = Math.max(
    getEliminationDepth(clues),
    inferenceDependencyGraph.eliminationChainCount
  );
  const weightedInferenceDepth = clues.reduce(
    (sum, clue) => sum + getClueWeight2(clue),
    0
  );
  const branchDecisionCount = solverInferenceSteps.filter(
    (step) => step.deduction.includes(
      "Branching on"
    )
  ).length;
  const branchingFactor = participants.length > 0 ? branchDecisionCount / participants.length : 0;
  return {
    participants,
    arrangement,
    arrangementType: layout.arrangementType,
    orientationType: layout.orientationType,
    seatFacings: layout.seats.map(
      (seat) => seat.facing
    ),
    seatLabels: layout.seats.map(
      (seat) => seat.label
    ),
    clues,
    prompt,
    clueCount: clues.length,
    inferenceDepth: Math.max(
      3,
      Math.min(
        Math.round(
          Math.max(
            weightedInferenceDepth,
            inferenceDependencyGraph.inferenceDepth
          ) + relationalClueCount - directClueCount + inferenceDependencyGraph.deductionDependencyScore * 0.35
        ),
        10
      )
    ),
    branchingComplexity: inferenceDependencyGraph.branchingComplexity,
    deductionDependencyScore: inferenceDependencyGraph.deductionDependencyScore,
    solverComplexity,
    validationWarnings: warnings,
    directClueCount,
    indirectClueCount: relationalClueCount,
    relationalClueCount,
    deductionDepth,
    eliminationDepth,
    clueGraphDensity: clueAnalysis.clueGraphDensity,
    clueDensity: clueAnalysis.clueDensity,
    clueInteractionRatio: clueAnalysis.clueInteractionRatio,
    redundancyScore: clueAnalysis.redundancyScore,
    redundancyRatio: clueAnalysis.redundancyRatio,
    anchorDensity: clueAnalysis.anchorDensity,
    directClueRatio: clueAnalysis.directClueRatio,
    originalClueCount: clueAnalysis.originalClueCount,
    minimalClueCount: clueAnalysis.minimalClueCount,
    removedRedundantClues: clueAnalysis.removedRedundantClues,
    topologyDiversityScore: clueAnalysis.topologyDiversityScore,
    clueDiversityScore: clueAnalysis.clueDiversityScore,
    inferenceDiversityScore: clueAnalysis.inferenceDiversityScore,
    structuralDiversityScore: clueAnalysis.structuralDiversityScore,
    clueTypeDistribution: clueAnalysis.clueTypeDistribution,
    repeatedStructureWarnings: clueAnalysis.repeatedStructureWarnings,
    uniquenessVerified: !warnings.some(
      (warning) => warning.includes(
        "multiple valid"
      ) || warning.includes(
        "No valid seating arrangement"
      ) || warning.includes(
        "contradicted"
      )
    ),
    validationRetries: generationAttemptMetrics.validationRetries,
    uniquenessFailures: generationAttemptMetrics.uniquenessFailures,
    branchingFactor,
    validationReport,
    solverInferenceSteps,
    solverTraceExport: exportInferenceTrace(
      solverInferenceSteps
    ),
    inferenceDependencyGraph,
    finalArrangement: formatFinalArrangement(
      arrangement,
      layout
    ),
    generatedClues: clues.map(
      clueToDebugText
    ),
    solverTrace: solverTrace.length > 0 ? solverTrace : buildSolverTrace(
      clues,
      layout
    )
  };
}
function validateScenario(participants, arrangement, clues, prompt, layout) {
  if (layout.arrangementType === "linear") {
    return validateLinearSeatingScenario(
      participants,
      arrangement,
      clues,
      prompt,
      layout.orientationType,
      layout.seatCount
    );
  }
  if (layout.arrangementType === "circular") {
    return validateCircularSeatingScenario(
      participants,
      arrangement,
      clues,
      prompt,
      layout.orientationType,
      layout.seatCount
    );
  }
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    layout.arrangementType,
    layout.orientationType,
    layout.seatCount
  );
}
function buildEmergencyScenario(motif, difficulty, config) {
  const arrangementType = config.arrangementTypes?.[0] ?? "linear";
  const participantCount = getParticipantCount(
    arrangementType,
    difficulty,
    config
  );
  const orientationType = config.orientationTypes?.[0] ?? (arrangementType === "circular" ? "center" : arrangementType === "double-row" ? "mixed" : "north");
  const layout = buildLayout2(
    arrangementType,
    orientationType,
    participantCount
  );
  const fallbackAttempts = getEmergencyFallbackAttempts(
    difficulty,
    config
  );
  for (let attempt = 0; attempt < fallbackAttempts; attempt++) {
    const participants = selectParticipants(
      participantCount
    );
    const arrangement = shuffle(participants);
    const fallbackClues = [];
    if (layout.family === "ring") {
      for (let index2 = 0; index2 < arrangement.length; index2++) {
        const nextIndex = (index2 + 1) % arrangement.length;
        fallbackClues.push({
          type: "adjacent",
          left: arrangement[index2],
          right: arrangement[nextIndex],
          ordered: true
        });
      }
      if (arrangement.length % 2 === 0) {
        fallbackClues.push({
          type: "opposite",
          left: arrangement[0],
          right: arrangement[arrangement.length / 2]
        });
      }
    } else if (layout.family === "two-row") {
      const rowSize = layout.colCount;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < rowSize - 1; col++) {
          const leftIndex = row * rowSize + col;
          const rightIndex = leftIndex + 1;
          fallbackClues.push({
            type: "adjacent",
            left: arrangement[leftIndex],
            right: arrangement[rightIndex],
            ordered: true
          });
          fallbackClues.push({
            type: "same-row",
            left: arrangement[leftIndex],
            right: arrangement[rightIndex]
          });
        }
      }
      for (let col = 0; col < rowSize; col++) {
        fallbackClues.push({
          type: "facing",
          left: arrangement[col],
          right: arrangement[rowSize + col]
        });
      }
      if (rowSize >= 3) {
        fallbackClues.push({
          type: "different-row",
          left: arrangement[0],
          right: arrangement[rowSize + 1]
        });
        fallbackClues.push({
          type: "offset",
          anchor: arrangement[0],
          person: arrangement[2],
          distance: 2,
          direction: "right"
        });
        fallbackClues.push({
          type: "offset",
          anchor: arrangement[rowSize],
          person: arrangement[rowSize + 2],
          distance: 2,
          direction: "right"
        });
      }
    } else {
      for (let index2 = 0; index2 < arrangement.length - 1; index2++) {
        fallbackClues.push({
          type: "adjacent",
          left: arrangement[index2],
          right: arrangement[index2 + 1],
          ordered: true
        });
      }
      if (arrangement.length >= 5) {
        fallbackClues.push({
          type: "offset",
          anchor: arrangement[0],
          person: arrangement[2],
          distance: 2,
          direction: "right"
        });
      }
    }
    const dedupedClues = dedupeClues(fallbackClues);
    const prompt = createPrompt(
      arrangement,
      dedupedClues,
      layout
    );
    const clueAnalysis = analyzeClueSet(
      dedupedClues,
      layout,
      participants,
      difficulty,
      prompt
    );
    const validation = validateScenario(
      participants,
      arrangement,
      dedupedClues,
      prompt,
      layout
    );
    if (validation.valid) {
      return buildScenarioFromValidatedState(
        participants,
        arrangement,
        layout,
        dedupedClues,
        prompt,
        [
          `Emergency seating fallback used for motif ${motif.id} at ${difficulty} difficulty.`
        ],
        validation.solverComplexity,
        clueAnalysis,
        validation.validationReport,
        validation.inferenceSteps,
        validation.solverTrace,
        {
          validationRetries: 0,
          uniquenessFailures: 0
        }
      );
    }
  }
  throw new ReasoningEngineError({
    code: "SEATING_FALLBACK_UNSOLVABLE",
    phase: "validation",
    message: `Unable to produce a uniquely solvable fallback for ${arrangementType} seating.`,
    metadata: buildSeatingErrorMetadata({
      arrangementType,
      layoutFamily: layout.family,
      motif: motif.id,
      inferenceDepth: config.inferenceDepth ?? difficulty,
      clueCount: 0,
      difficulty,
      participantCount
    })
  });
}
function createSeatingScenarioInternal(motif, difficulty, pattern) {
  const config = extractSeatingPatternConfig(
    pattern
  );
  const maxAttempts = getMaxSeatingGenerationAttempts(
    difficulty,
    config
  );
  let validationRetries = 0;
  let uniquenessFailures = 0;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const arrangementType = getArrangementType(
      difficulty,
      motif,
      config
    );
    const participantCount = getParticipantCount(
      arrangementType,
      difficulty,
      config
    );
    const orientationType = getOrientationType(
      arrangementType,
      difficulty,
      config
    );
    const layout = buildLayout2(
      arrangementType,
      orientationType,
      participantCount
    );
    const participants = selectParticipants(
      participantCount
    );
    const arrangement = shuffle(participants);
    const promptSeed = pickRandomItem(
      buildPromptCandidates(
        arrangement,
        layout
      )
    );
    const clueResult = buildClueSet(
      participants,
      arrangement,
      motif,
      difficulty,
      layout,
      promptSeed,
      config
    );
    const clues = clueResult.clues;
    const prompt = createPrompt(
      arrangement,
      clues,
      layout
    );
    const validation = validateScenario(
      participants,
      arrangement,
      clues,
      prompt,
      layout
    );
    if (validation.valid && meetsClueProfile(
      clues,
      difficulty,
      layout
    ) && !clueResult.repeatedStructureWarnings.some(
      (warning) => warning.includes(
        "rejected"
      )
    )) {
      return buildScenarioFromValidatedState(
        participants,
        arrangement,
        layout,
        clues,
        prompt,
        validation.warnings,
        validation.solverComplexity,
        {
          clueGraphDensity: clueResult.clueGraphDensity,
          clueInteractionRatio: clueResult.clueInteractionRatio,
          redundancyScore: clueResult.redundancyScore,
          redundancyRatio: clueResult.redundancyRatio,
          anchorDensity: clueResult.anchorDensity,
          directClueRatio: clueResult.directClueRatio,
          originalClueCount: clueResult.originalClueCount,
          minimalClueCount: clueResult.minimalClueCount,
          removedRedundantClues: clueResult.removedRedundantClues,
          topologyDiversityScore: clueResult.topologyDiversityScore,
          clueDiversityScore: clueResult.clueDiversityScore,
          inferenceDiversityScore: clueResult.inferenceDiversityScore,
          structuralDiversityScore: clueResult.structuralDiversityScore,
          clueTypeDistribution: clueResult.clueTypeDistribution,
          repeatedStructureWarnings: clueResult.repeatedStructureWarnings
        },
        validation.validationReport,
        validation.inferenceSteps,
        validation.solverTrace,
        {
          validationRetries,
          uniquenessFailures
        }
      );
    }
    validationRetries += 1;
    if (validation.solutionCount !== 1) {
      uniquenessFailures += 1;
    }
  }
  return buildEmergencyScenario(
    motif,
    difficulty,
    config
  );
}
function createLinearSeatingScenario(motif, difficulty, pattern) {
  const forcedPattern = {
    ...pattern,
    arrangementType: "linear"
  };
  return createSeatingScenarioInternal(
    motif,
    difficulty,
    forcedPattern
  );
}
function createAnySeatingScenario(motif, difficulty, pattern) {
  return createSeatingScenarioInternal(
    motif,
    difficulty,
    pattern
  );
}

// src/lib/reasoning/seating-realizer.ts
function ordinal(value) {
  switch (value) {
    case 1:
      return "first";
    case 2:
      return "second";
    case 3:
      return "third";
    case 4:
      return "fourth";
    case 5:
      return "fifth";
    case 6:
      return "sixth";
    default:
      return `${value}th`;
  }
}
function arrangementLead(scenario, examProfile, wordingStyle) {
  const personCount = scenario.participants.length;
  const orientationText = scenario.orientationType === "center" ? "facing the centre" : scenario.orientationType === "outward" ? "facing outward" : scenario.orientationType === "alternate" ? "with alternate facing directions" : scenario.orientationType === "mixed" ? "with mixed facing directions" : `facing ${scenario.orientationType}`;
  const intro = scenario.arrangementType === "linear" ? `${personCount} persons are seated in a straight line, ${orientationText}.` : scenario.arrangementType === "circular" ? `${personCount} persons are seated around a circular table, ${orientationText}.` : scenario.arrangementType === "square" ? `${personCount} persons are seated around a square table, ${orientationText}.` : scenario.arrangementType === "rectangular" ? `${personCount} persons are seated around a rectangular table, ${orientationText}.` : scenario.arrangementType === "double-row" ? `${personCount} persons are seated in two rows facing each other, ${orientationText}.` : `${personCount} persons are seated in two parallel rows, ${orientationText}.`;
  if (examProfile === "ssc" || wordingStyle === "concise") {
    return intro;
  }
  if (examProfile === "cat" || wordingStyle === "inference-heavy") {
    return `${intro} Use the relational clues to infer the complete arrangement.`;
  }
  return `${intro} Read the clues carefully and determine the arrangement.`;
}
function clueToText(clue, scenario) {
  const seatSideWord = scenario.arrangementType === "linear" || scenario.arrangementType === "parallel-row" || scenario.arrangementType === "double-row" ? "sits" : "is seated";
  switch (clue.type) {
    case "absolute":
      return `${clue.person} ${seatSideWord} ${ordinal(clue.index + 1)} from the left end.`;
    case "end":
      return clue.side === "left" ? `${clue.person} ${seatSideWord} at the extreme left end.` : `${clue.person} ${seatSideWord} at the extreme right end.`;
    case "adjacent":
      return clue.ordered ? `${clue.left} sits immediately to the left of ${clue.right}.` : `${clue.left} is an immediate neighbour of ${clue.right}.`;
    case "not-adjacent":
      return `${clue.left} is not an immediate neighbour of ${clue.right}.`;
    case "offset":
      return `${clue.person} sits ${clue.distance === 1 ? "immediately" : clue.distance === 2 ? "second" : "third"} to the ${clue.direction} of ${clue.anchor}.`;
    case "distance-gap":
      return `${clue.gap === 1 ? "Only one person" : "Two persons"} sit${clue.gap === 1 ? "s" : ""} between ${clue.left} and ${clue.right}.`;
    case "between":
      return `${clue.middle} sits between ${clue.first} and ${clue.second}.`;
    case "adjacent-both":
      return `${clue.middle} is an immediate neighbour of both ${clue.first} and ${clue.second}.`;
    case "not-end":
      return `${clue.person} is not sitting at any extreme end.`;
    case "opposite":
      return scenario.arrangementType === "double-row" ? `${clue.left} sits facing ${clue.right}.` : `${clue.left} sits opposite ${clue.right}.`;
    case "not-opposite":
      return scenario.arrangementType === "double-row" ? `${clue.left} does not sit facing ${clue.right}.` : `${clue.left} does not sit opposite ${clue.right}.`;
    case "same-row":
      return `${clue.left} sits in the same row as ${clue.right}.`;
    case "different-row":
      return `${clue.left} does not sit in the same row as ${clue.right}.`;
    case "facing":
      return `${clue.left} sits directly facing ${clue.right}.`;
    case "not-facing":
      return `${clue.left} does not sit directly facing ${clue.right}.`;
    default:
      return "Use the seating clue carefully.";
  }
}
function reasoningForClue(clue, scenario) {
  switch (clue.type) {
    case "absolute":
    case "end":
      return createReasoningStep(
        "compare",
        clueToText(clue, scenario)
      );
    case "adjacent":
    case "distance-gap":
    case "between":
    case "adjacent-both":
    case "same-row":
    case "facing":
    case "opposite":
      return createReasoningStep(
        "infer",
        clueToText(clue, scenario)
      );
    case "offset":
      return createReasoningStep(
        "transform",
        clueToText(clue, scenario)
      );
    case "not-end":
    case "not-adjacent":
    case "not-opposite":
    case "different-row":
    case "not-facing":
      return createReasoningStep(
        "filter",
        clueToText(clue, scenario)
      );
    default:
      return createReasoningStep(
        "infer",
        clueToText(clue, scenario)
      );
  }
}
function buildSeatingStem(scenario, examProfile, wordingStyle) {
  const clueLead = arrangementLead(
    scenario,
    examProfile,
    wordingStyle
  );
  const clueText = scenario.clues.map(
    (clue) => clueToText(clue, scenario)
  ).join(" ");
  return `${clueLead} ${clueText} ${scenario.prompt.prompt}`;
}
function buildSeatingExplanation(scenario) {
  const orderedReasoning = [
    ...scenario.clues.map(
      (clue) => reasoningForClue(
        clue,
        scenario
      )
    ),
    createReasoningStep(
      "infer",
      scenario.arrangementType === "linear" ? "Combine the left-right, neighbour, and elimination clues to narrow the row to one valid arrangement." : scenario.arrangementType === "double-row" || scenario.arrangementType === "parallel-row" ? "Combine the row, facing, and positional clues to lock both rows into one valid arrangement." : "Combine the relational and orientation clues to narrow the arrangement to one valid layout."
    ),
    createReasoningStep(
      "compare",
      `After arranging all positions consistently, ${scenario.prompt.correctAnswer} satisfies the asked position.`
    )
  ];
  return {
    text: orderedReasoning.map(
      (step, index2) => `${index2 + 1}. ${step.detail}`
    ).join(" "),
    reasoningSteps: orderedReasoning
  };
}
function buildSeatingOptions(scenario) {
  const correctAnswer = scenario.prompt.correctAnswer;
  const options = shuffle([
    correctAnswer,
    ...scenario.participants.filter(
      (participant) => participant !== correctAnswer
    )
  ]).slice(0, 4);
  if (!options.includes(correctAnswer)) {
    options[options.length - 1] = correctAnswer;
  }
  const shuffled = shuffle(options);
  return {
    options: shuffled,
    correct: shuffled.indexOf(correctAnswer),
    optionMetadata: shuffled.map(
      (value) => ({
        value,
        isCorrect: value === correctAnswer
      })
    )
  };
}

// src/lib/reasoning/seating-arrangement.ts
function allowsLinearFallback(pattern) {
  if (!pattern) {
    return true;
  }
  const text2 = `${pattern.topic} ${pattern.subtopic}`.toLowerCase();
  return ![
    "circular",
    "square",
    "rectangular",
    "double row",
    "double-row",
    "parallel row",
    "parallel-row"
  ].some(
    (token) => text2.includes(token)
  );
}
function createSeatingScenario(motif, difficulty, pattern) {
  const canFallbackToLinear = allowsLinearFallback(pattern);
  try {
    return createAnySeatingScenario(
      motif,
      difficulty,
      pattern
    );
  } catch {
    if (canFallbackToLinear) {
      try {
        const linearScenario = createLinearSeatingScenario(
          motif,
          difficulty,
          pattern
        );
        return {
          ...linearScenario,
          validationWarnings: [
            ...linearScenario.validationWarnings,
            "Primary seating generation fallback used a linear arrangement path."
          ]
        };
      } catch {
      }
    }
    const safeMotifs = [
      motif,
      seatingArrangementMotifs.find(
        (entry) => entry.id === "neighbor_clue_linear"
      ),
      seatingArrangementMotifs.find(
        (entry) => entry.id === "relative_position_clue"
      ),
      seatingArrangementMotifs.find(
        (entry) => entry.id === "direct_clue_linear"
      )
    ].filter(
      (entry) => Boolean(entry)
    );
    const safeDifficulties = difficulty === "Hard" ? ["Medium", "Easy"] : difficulty === "Medium" ? ["Easy"] : ["Easy"];
    for (const safeMotif of safeMotifs) {
      for (const safeDifficulty of safeDifficulties) {
        try {
          const fallbackScenario = canFallbackToLinear ? createLinearSeatingScenario(
            safeMotif,
            safeDifficulty,
            pattern
          ) : createAnySeatingScenario(
            safeMotif,
            safeDifficulty,
            pattern
          );
          return {
            ...fallbackScenario,
            validationWarnings: [
              ...fallbackScenario.validationWarnings,
              `Primary seating generation fallback used motif ${safeMotif.id} at ${safeDifficulty} difficulty.`
            ]
          };
        } catch {
          continue;
        }
      }
    }
  }
  const lastResortMotif = seatingArrangementMotifs.find(
    (entry) => entry.id === "neighbor_clue_linear"
  ) ?? seatingArrangementMotifs[0] ?? motif;
  const linearFallback = createLinearSeatingScenario(
    lastResortMotif,
    "Easy",
    pattern
  );
  return {
    ...linearFallback,
    validationWarnings: [
      ...linearFallback.validationWarnings,
      "Requested seating profile could not be generated reliably; returned a stable linear fallback."
    ]
  };
}
function buildSeatingStemForQuestion(scenario, examProfile, wordingStyle) {
  return buildSeatingStem(
    scenario,
    examProfile,
    wordingStyle
  );
}
function buildSeatingExplanationForQuestion(scenario) {
  return buildSeatingExplanation(
    scenario
  );
}
function buildSeatingOptionsForQuestion(scenario) {
  return buildSeatingOptions(
    scenario
  );
}

// src/lib/reasoning/seating-diagram.ts
function getQuestionTarget(prompt) {
  return {
    label: prompt.anchor,
    promptType: prompt.type,
    answerLabel: prompt.correctAnswer
  };
}
function buildSeatingDiagramData(scenario) {
  const questionTarget = getQuestionTarget(
    scenario.prompt
  );
  return {
    arrangementType: scenario.arrangementType,
    orientationType: scenario.orientationType,
    seats: scenario.arrangement.map(
      (label, position) => ({
        label,
        position,
        facing: scenario.seatFacings[position],
        highlighted: label === questionTarget.label,
        isAnswer: label === questionTarget.answerLabel,
        row: scenario.arrangementType === "double-row" || scenario.arrangementType === "parallel-row" ? Math.floor(
          position / (scenario.arrangement.length / 2)
        ) : 0,
        col: scenario.arrangementType === "double-row" || scenario.arrangementType === "parallel-row" ? position % (scenario.arrangement.length / 2) : position,
        seatLabel: scenario.seatLabels[position]
      })
    ),
    seatLabels: scenario.seatLabels,
    questionTarget,
    rowCount: scenario.arrangementType === "double-row" || scenario.arrangementType === "parallel-row" ? 2 : 1,
    colCount: scenario.arrangementType === "double-row" || scenario.arrangementType === "parallel-row" ? scenario.arrangement.length / 2 : scenario.arrangement.length
  };
}

// src/lib/reasoning/seating-explanation-flow.ts
function getLayoutFamily(scenario) {
  if (scenario.arrangementType === "double-row" || scenario.arrangementType === "parallel-row") {
    return "two-row";
  }
  if (scenario.arrangementType === "circular" || scenario.arrangementType === "square" || scenario.arrangementType === "rectangular") {
    return "ring";
  }
  return "single-row";
}
function getColCount(scenario) {
  return getLayoutFamily(scenario) === "two-row" ? scenario.arrangement.length / 2 : scenario.arrangement.length;
}
function parseSnapshotLabels(snapshot, seatCount) {
  const labels = snapshot.split("|").map((token) => token.trim()).filter(Boolean);
  if (labels.length === seatCount) {
    return labels;
  }
  return Array.from(
    { length: seatCount },
    (_value, index2) => labels[index2] ?? "?"
  );
}
function buildSnapshotFromLabels(scenario, labels) {
  const colCount = getColCount(
    scenario
  );
  return {
    arrangementType: scenario.arrangementType,
    orientationType: scenario.orientationType,
    seats: labels.map(
      (label, position) => ({
        label,
        position,
        facing: scenario.seatFacings[position],
        highlighted: label !== "?" && label === scenario.prompt.anchor,
        isAnswer: label !== "?" && label === scenario.prompt.correctAnswer,
        row: getLayoutFamily(
          scenario
        ) === "two-row" ? Math.floor(
          position / colCount
        ) : 0,
        col: getLayoutFamily(
          scenario
        ) === "two-row" ? position % colCount : position,
        seatLabel: scenario.seatLabels[position]
      })
    ),
    seatLabels: scenario.seatLabels,
    questionTarget: {
      label: scenario.prompt.anchor,
      promptType: scenario.prompt.type,
      answerLabel: scenario.prompt.correctAnswer
    },
    rowCount: getLayoutFamily(scenario) === "two-row" ? 2 : 1,
    colCount
  };
}
function normalizeConstraintRefs(sourceConstraintIds) {
  if (!sourceConstraintIds.length) {
    return "";
  }
  const refs = sourceConstraintIds.map(
    (value) => value.replace(":", " ")
  ).join(", ");
  return ` Reference clues used: ${refs}.`;
}
function classifyTraceStep(step) {
  if (step.deduction.includes(
    "Anchored"
  )) {
    return "reference";
  }
  if (step.deduction.includes(
    "Branching on"
  )) {
    return "case-analysis";
  }
  if (step.deduction.includes(
    "contradiction"
  ) || step.eliminatedPossibilities.length > 0) {
    return "elimination";
  }
  if (step.deduction.includes(
    "Accepted arrangement"
  )) {
    return "final-arrangement";
  }
  return "inference";
}
function titleForTraceStep(type, index2) {
  switch (type) {
    case "reference":
      return `Reference ${index2}`;
    case "case-analysis":
      return `Case Analysis ${index2}`;
    case "elimination":
      return `Elimination ${index2}`;
    case "final-arrangement":
      return "Final Arrangement";
    default:
      return `Inference ${index2}`;
  }
}
function toHumanExplanation(step, type) {
  if (type === "reference") {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} This gives us the first stable reference point for the arrangement.`;
  }
  if (type === "case-analysis") {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} At this stage we test the possible seat choice and keep the remaining arrangement flexible until the next clue confirms or rejects it.`;
  }
  if (type === "elimination") {
    const eliminated = step.eliminatedPossibilities.length > 0 ? ` Eliminated possibilities: ${step.eliminatedPossibilities.join("; ")}.` : "";
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)}${eliminated} This is the standard SSC/Banking elimination move where an invalid case is removed before proceeding further.`;
  }
  if (type === "final-arrangement") {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} The arrangement is now fixed, so the asked position can be read directly from the completed figure.`;
  }
  return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} This deduction locks more positions and reduces the remaining uncertainty step by step.`;
}
function buildBranches(step, scenario) {
  if (!step.deduction.includes(
    "Branching on"
  )) {
    return [];
  }
  const snapshot = buildSnapshotFromLabels(
    scenario,
    parseSnapshotLabels(
      step.resultingStateSnapshot,
      scenario.arrangement.length
    )
  );
  return [
    {
      id: `${step.stepId}-candidate`,
      label: "Current Case",
      status: "candidate",
      text: "This is the working case being tested against the remaining clues.",
      arrangementSnapshot: snapshot
    }
  ];
}
function buildTraceDrivenSteps(scenario) {
  return scenario.solverInferenceSteps.map(
    (step, index2) => {
      const type = classifyTraceStep(step);
      return {
        type,
        title: titleForTraceStep(
          type,
          index2 + 1
        ),
        text: toHumanExplanation(
          step,
          type
        ),
        arrangementSnapshot: buildSnapshotFromLabels(
          scenario,
          parseSnapshotLabels(
            step.resultingStateSnapshot,
            scenario.arrangement.length
          )
        ),
        branches: type === "case-analysis" ? buildBranches(
          step,
          scenario
        ) : void 0
      };
    }
  );
}
function buildSummary(scenario) {
  const eliminationCount = scenario.solverInferenceSteps.filter(
    (step) => step.eliminatedPossibilities.length > 0
  ).length;
  const branchCount = scenario.solverInferenceSteps.filter(
    (step) => step.deduction.includes(
      "Branching on"
    )
  ).length;
  return `Start from the fixed reference, test the progressive deductions in the same order as the solver trace, and remove the contradictory cases one by one. This solution uses ${branchCount} branch test${branchCount === 1 ? "" : "s"} and ${eliminationCount} elimination move${eliminationCount === 1 ? "" : "s"} before reaching the final arrangement.`;
}
function buildSeatingExplanationFlow(scenario) {
  const steps = buildTraceDrivenSteps(
    scenario
  );
  if (!steps.some(
    (step) => step.type === "final-arrangement"
  )) {
    steps.push({
      type: "final-arrangement",
      title: "Final Arrangement",
      text: `After applying the full inference chain in order, the final arrangement is fixed and ${scenario.prompt.correctAnswer} is obtained for the asked position.`,
      arrangementSnapshot: buildSnapshotFromLabels(
        scenario,
        scenario.arrangement
      )
    });
  }
  return {
    summary: buildSummary(
      scenario
    ),
    steps
  };
}

// src/lib/core/generator-engine.ts
function buildGenerationMetrics(overrides) {
  return {
    generationDurationMs: overrides.generationDurationMs ?? 0,
    validationRetries: overrides.validationRetries ?? 0,
    uniquenessFailures: overrides.uniquenessFailures ?? 0,
    branchingFactor: overrides.branchingFactor ?? 0,
    branchingComplexity: overrides.branchingComplexity,
    clueDensity: overrides.clueDensity ?? 0,
    inferenceDepth: overrides.inferenceDepth ?? 0,
    redundancyScore: overrides.redundancyScore ?? 0,
    deductionDependencyScore: overrides.deductionDependencyScore,
    redundancyRatio: overrides.redundancyRatio,
    anchorDensity: overrides.anchorDensity,
    directClueRatio: overrides.directClueRatio
  };
}
function logGenerationMetrics(pattern, metrics, question) {
  console.info(
    "Generation metrics",
    {
      patternId: pattern.id,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      generationId: question.debugMetadata?.generationId,
      generationDomain: question.debugMetadata?.generationDomain,
      selectedMotif: question.debugMetadata?.selectedMotif,
      difficultyLabel: question.difficultyLabel,
      metrics
    }
  );
}
function attachGenerationMetrics(pattern, question, overrides) {
  const generationMetrics = buildGenerationMetrics({
    inferenceDepth: question.difficultyMetadata?.reasoningDepth ?? 0,
    ...overrides
  });
  const enrichedQuestion = {
    ...question,
    generationMetrics,
    debugMetadata: question.debugMetadata ? {
      ...question.debugMetadata,
      generationMetrics
    } : question.debugMetadata
  };
  logGenerationMetrics(
    pattern,
    generationMetrics,
    enrichedQuestion
  );
  return enrichedQuestion;
}
function inferGenerationDomain(pattern) {
  if (pattern.generationDomain) {
    return pattern.generationDomain;
  }
  if (pattern.section.toLowerCase().trim() === "english") {
    return "english";
  }
  if (pattern.type === "di") {
    return "di";
  }
  const topicCluster = inferQuantTopicCluster(pattern);
  if (topicCluster === "seating-arrangement") {
    return "seating-arrangement";
  }
  if (pattern.type === "logic") {
    return "reasoning";
  }
  return "quant";
}
var UNIVERSAL_QUANT_ARCHETYPES = [
  ...LOGIC_REASONING_ARCHETYPES,
  ...FORMULA_QUANT_ARCHETYPES
];
function createFormulaQuestionCandidate(pattern, options) {
  const generationStartedAt = Date.now();
  const examProfile = options?.examProfile ?? "custom";
  const requestedDifficulty = getRequestedDifficultyLabel(
    pattern,
    options,
    classifyDifficultyLabel
  );
  const targetDifficultyScore = getTargetDifficultyScore(
    pattern,
    options
  );
  const topicCluster = inferQuantTopicCluster(pattern);
  const compatibilityWarnings = [];
  let fallbackReason;
  const selectedMotif = pickMotif(
    topicCluster,
    pattern,
    options
  );
  const patternMotifCompatibility = selectedMotif ? validatePatternCompatibility(
    pattern,
    topicCluster,
    selectedMotif,
    requestedDifficulty
  ) : null;
  const motif = patternMotifCompatibility?.valid ? selectedMotif : null;
  if (selectedMotif && !patternMotifCompatibility?.valid) {
    compatibilityWarnings.push(
      ...(patternMotifCompatibility?.issues ?? []).map((issue) => issue.reason)
    );
    fallbackReason = "Selected motif was incompatible with the pattern contract.";
  }
  const arithmeticDifficulty = requestedDifficulty;
  const values2 = generateValues(
    pattern.variables,
    arithmeticDifficulty,
    motif
  );
  const scenario = generateScenario(
    pattern.topic
  );
  const archetype = selectQuantArchetype(
    FORMULA_QUANT_ARCHETYPES,
    pattern,
    options,
    topicCluster,
    motif,
    {
      getExamProfileConfig,
      validateArchetypeCompatibility,
      classifyDifficultyLabel
    }
  );
  const archetypeCompatibility = validateArchetypeCompatibility(
    pattern,
    archetype,
    motif,
    topicCluster
  );
  const effectiveArchetype = archetypeCompatibility.valid ? archetype : createFallbackArchetype(
    requestedDifficulty,
    topicCluster
  );
  if (!archetypeCompatibility.valid) {
    compatibilityWarnings.push(
      ...archetypeCompatibility.issues.map(
        (issue) => issue.reason
      )
    );
    fallbackReason = fallbackReason ?? "Archetype was incompatible with the selected pattern/motif combination.";
  }
  const realizationValues = {
    ...values2,
    entity: scenario.entity,
    metric: scenario.metric,
    context: scenario.context
  };
  const validTemplates = pattern.templateVariants.filter(
    (template) => validateQuestionRealization(
      [template],
      realizationValues
    ).valid
  );
  const fallbackText = realizeQuestion(
    scenario,
    values2,
    pattern.topic,
    motif
  );
  const text2 = validTemplates.length ? renderNamedTemplate(
    pickRandomTemplate(
      validTemplates
    ),
    realizationValues
  ) || fallbackText : fallbackText;
  if (!validTemplates.length) {
    compatibilityWarnings.push(
      "Pattern templates were missing required placeholders for realization."
    );
    fallbackReason = fallbackReason ?? "Question realizer fell back to safe wording.";
  }
  const formulaCompatibility = validateFormulaReferences(
    pattern.formula,
    values2
  );
  const formulaToEvaluate = formulaCompatibility.valid ? pattern.formula : Object.keys(values2)[0] ?? "0";
  if (!formulaCompatibility.valid) {
    compatibilityWarnings.push(
      ...formulaCompatibility.issues.map(
        (issue) => issue.reason
      )
    );
    fallbackReason = fallbackReason ?? "Pattern formula referenced unavailable variables.";
  }
  const correctAnswer = evaluateFormula(
    formulaToEvaluate,
    values2
  );
  const quantContext = {
    pattern,
    baseText: text2,
    values: values2,
    correctAnswer,
    topicCluster
  };
  const reasoningSteps = alignReasoningStepsWithMotif(
    effectiveArchetype.buildReasoningSteps(
      quantContext
    ),
    motif
  );
  const explanation = buildMotifAwareExplanation(
    pattern,
    values2,
    correctAnswer,
    motif,
    reasoningSteps
  );
  const generated = generateNumericOptions(
    correctAnswer,
    {
      examProfile,
      topicCluster,
      difficulty: requestedDifficulty,
      distractorStrategy: pattern.distractorStrategy,
      distractorHints: motif?.commonDistractors,
      reasoningDepth: reasoningSteps.length,
      operationChain: effectiveArchetype.operationChain
    }
  );
  const examRealismMetadata = buildExamRealismMetadata(
    examProfile,
    effectiveArchetype,
    generated.optionMetadata
  );
  const activeGenerationContext = getGenerationContext();
  const enrichedQuestion = attachReasoningTrace(
    {
      text: buildQuantPrompt(
        effectiveArchetype,
        quantContext,
        examProfile
      ),
      options: generated.options,
      correct: generated.correct,
      explanation,
      section: pattern.section,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      optionMetadata: generated.optionMetadata,
      examRealismMetadata,
      debugMetadata: {
        selectedPattern: pattern.id,
        seed: activeGenerationContext?.seed,
        generationId: activeGenerationContext?.generationId,
        generationDomain: "quant",
        selectedMotif: motif?.id,
        selectedArchetype: effectiveArchetype.id,
        fallbackReason,
        compatibilityWarnings
      }
    },
    reasoningSteps,
    Math.max(
      reasoningSteps.length,
      effectiveArchetype.operationChain.length
    ),
    effectiveArchetype.operationChain
  );
  const finalizedQuestion = applyDifficultyMetadata(
    enrichedQuestion,
    {
      kind: "formula",
      text: enrichedQuestion.text,
      formula: formulaToEvaluate,
      values: values2,
      explanation,
      difficultyHint: requestedDifficulty,
      targetDifficultyScore,
      reasoningSteps: enrichedQuestion.reasoningSteps,
      dependencyComplexity: enrichedQuestion.dependencyComplexity,
      operationChain: enrichedQuestion.operationChain
    }
  );
  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs: Date.now() - generationStartedAt,
      inferenceDepth: finalizedQuestion.difficultyMetadata.reasoningDepth
    }
  );
}
function createReasoningQuestionCandidate(pattern, options) {
  const generationStartedAt = Date.now();
  const examProfile = options?.examProfile ?? "custom";
  const requestedDifficulty = getRequestedDifficultyLabel(
    pattern,
    options,
    classifyDifficultyLabel
  );
  const targetDifficultyScore = getTargetDifficultyScore(
    pattern,
    options
  );
  const topicCluster = inferQuantTopicCluster(pattern);
  const compatibilityWarnings = [];
  let fallbackReason;
  const selectedMotif = pickMotif(
    topicCluster,
    pattern,
    options
  ) ?? ALL_MOTIFS.find(
    (entry) => entry.topicCluster === topicCluster
  ) ?? ALL_MOTIFS[0];
  const patternMotifCompatibility = selectedMotif ? validatePatternCompatibility(
    pattern,
    topicCluster,
    selectedMotif,
    requestedDifficulty
  ) : null;
  const motif = selectedMotif;
  if (selectedMotif && !patternMotifCompatibility?.valid) {
    compatibilityWarnings.push(
      ...(patternMotifCompatibility?.issues ?? []).map((issue) => issue.reason)
    );
    fallbackReason = "Selected motif was incompatible with the logic pattern contract.";
  }
  const archetype = selectQuantArchetype(
    UNIVERSAL_QUANT_ARCHETYPES,
    pattern,
    options,
    topicCluster,
    motif,
    {
      getExamProfileConfig,
      validateArchetypeCompatibility,
      classifyDifficultyLabel
    }
  );
  const archetypeCompatibility = validateArchetypeCompatibility(
    pattern,
    archetype,
    motif,
    topicCluster
  );
  const effectiveArchetype = archetypeCompatibility.valid ? archetype : createFallbackArchetype(
    requestedDifficulty,
    topicCluster
  );
  if (!archetypeCompatibility.valid) {
    compatibilityWarnings.push(
      ...archetypeCompatibility.issues.map(
        (issue) => issue.reason
      )
    );
    fallbackReason = fallbackReason ?? "Archetype was incompatible with the logic pattern/motif combination.";
  }
  const values2 = generateValues(
    pattern.variables,
    requestedDifficulty,
    motif
  );
  let baseText = "";
  let explanation = "";
  let optionBundle;
  let customReasoningSteps;
  if (topicCluster === "blood-relations") {
    const bloodScenario = createBloodRelationScenario(
      motif
    );
    const profileConfig = getExamProfileConfig(
      examProfile
    );
    baseText = buildBloodRelationStem(
      bloodScenario,
      examProfile,
      profileConfig.wordingStyle
    );
    explanation = buildBloodRelationExplanation(
      bloodScenario
    );
    optionBundle = buildBloodRelationOptions(
      bloodScenario.relation
    );
    customReasoningSteps = bloodScenario.reasoningSteps;
  } else if (topicCluster === "inequality") {
    const inequalityScenario = createInequalityScenario(
      motif,
      requestedDifficulty
    );
    const profileConfig = getExamProfileConfig(
      examProfile
    );
    baseText = buildInequalityStem(
      inequalityScenario,
      examProfile,
      profileConfig.wordingStyle
    );
    explanation = buildInequalityExplanation(
      inequalityScenario
    );
    optionBundle = buildInequalityOptions(
      inequalityScenario
    );
    customReasoningSteps = inequalityScenario.reasoningSteps;
  } else if (topicCluster === "direction-sense") {
    const directionScenario = createDirectionSenseScenario(
      motif,
      requestedDifficulty
    );
    const profileConfig = getExamProfileConfig(
      examProfile
    );
    baseText = buildDirectionSenseStem(
      directionScenario,
      examProfile,
      profileConfig.wordingStyle
    );
    explanation = buildDirectionSenseExplanation(
      directionScenario
    );
    optionBundle = buildDirectionSenseOptions(
      directionScenario
    );
    customReasoningSteps = directionScenario.reasoningSteps;
  } else {
    const sourceWord = pickCodingWord(
      requestedDifficulty
    );
    const codedWord = encodeWordByMotif(
      sourceWord,
      motif,
      values2
    );
    const exampleWord = requestedDifficulty === "Hard" ? pickCodingWord("Medium") : void 0;
    const exampleCode = exampleWord ? encodeWordByMotif(
      exampleWord,
      motif,
      values2
    ) : void 0;
    baseText = buildCodingQuestionStem(
      sourceWord,
      motif,
      values2,
      exampleWord,
      exampleCode
    );
    optionBundle = buildCodingDistractorOptions(
      sourceWord,
      codedWord,
      motif,
      requestedDifficulty,
      values2
    );
    explanation = buildCodingExplanation(
      sourceWord,
      codedWord
    );
  }
  const quantContext = {
    pattern,
    baseText,
    values: values2,
    correctAnswer: 0,
    topicCluster
  };
  const reasoningSteps = alignReasoningStepsWithMotif(
    customReasoningSteps ?? effectiveArchetype.buildReasoningSteps(
      quantContext
    ),
    motif
  );
  const activeGenerationContext = getGenerationContext();
  explanation = topicCluster === "blood-relations" || topicCluster === "inequality" || topicCluster === "direction-sense" ? explanation : `${buildMotifAwareExplanation(
    pattern,
    values2,
    0,
    motif,
    reasoningSteps
  ).replace(
    "Final answer = 0.",
    ""
  ).trim()} ${explanation}`.trim();
  const enrichedQuestion = attachReasoningTrace(
    {
      text: buildQuantPrompt(
        effectiveArchetype,
        quantContext,
        examProfile
      ),
      options: optionBundle.options,
      correct: optionBundle.correct,
      explanation,
      section: pattern.section,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      optionMetadata: optionBundle.optionMetadata,
      examRealismMetadata: buildExamRealismMetadata(
        examProfile,
        effectiveArchetype,
        optionBundle.optionMetadata
      ),
      debugMetadata: {
        selectedPattern: pattern.id,
        seed: activeGenerationContext?.seed,
        generationId: activeGenerationContext?.generationId,
        generationDomain: "reasoning",
        selectedMotif: selectedMotif?.id,
        selectedArchetype: effectiveArchetype.id,
        fallbackReason,
        compatibilityWarnings
      }
    },
    reasoningSteps,
    Math.max(
      reasoningSteps.length,
      effectiveArchetype.operationChain.length
    ),
    effectiveArchetype.operationChain
  );
  const finalizedQuestion = applyDifficultyMetadata(
    enrichedQuestion,
    {
      kind: "logic",
      text: enrichedQuestion.text,
      explanation,
      difficultyHint: requestedDifficulty,
      targetDifficultyScore,
      reasoningSteps: enrichedQuestion.reasoningSteps,
      dependencyComplexity: enrichedQuestion.dependencyComplexity,
      operationChain: enrichedQuestion.operationChain
    }
  );
  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs: Date.now() - generationStartedAt,
      inferenceDepth: finalizedQuestion.difficultyMetadata.reasoningDepth
    }
  );
}
function createSeatingQuestionCandidate(pattern, options) {
  const generationStartedAt = Date.now();
  const examProfile = options?.examProfile ?? "custom";
  const requestedDifficulty = getRequestedDifficultyLabel(
    pattern,
    options,
    classifyDifficultyLabel
  );
  const targetDifficultyScore = getTargetDifficultyScore(
    pattern,
    options
  );
  const topicCluster = inferQuantTopicCluster(pattern);
  const compatibilityWarnings = [];
  let fallbackReason;
  const selectedMotif = pickMotif(
    topicCluster,
    pattern,
    options
  ) ?? ALL_MOTIFS.find(
    (entry) => entry.topicCluster === topicCluster
  ) ?? ALL_MOTIFS[0];
  const patternMotifCompatibility = selectedMotif ? validatePatternCompatibility(
    pattern,
    topicCluster,
    selectedMotif,
    requestedDifficulty
  ) : null;
  const motif = selectedMotif;
  if (selectedMotif && !patternMotifCompatibility?.valid) {
    compatibilityWarnings.push(
      ...(patternMotifCompatibility?.issues ?? []).map((issue) => issue.reason)
    );
    fallbackReason = "Selected motif was incompatible with the seating pattern contract.";
  }
  const archetype = selectQuantArchetype(
    UNIVERSAL_QUANT_ARCHETYPES,
    pattern,
    options,
    topicCluster,
    motif,
    {
      getExamProfileConfig,
      validateArchetypeCompatibility,
      classifyDifficultyLabel
    }
  );
  const archetypeCompatibility = validateArchetypeCompatibility(
    pattern,
    archetype,
    motif,
    topicCluster
  );
  const effectiveArchetype = archetypeCompatibility.valid ? archetype : createFallbackArchetype(
    requestedDifficulty,
    topicCluster
  );
  if (!archetypeCompatibility.valid) {
    compatibilityWarnings.push(
      ...archetypeCompatibility.issues.map(
        (issue) => issue.reason
      )
    );
    fallbackReason = fallbackReason ?? "Archetype was incompatible with the seating pattern/motif combination.";
  }
  const seatingScenario = createSeatingScenario(
    motif,
    requestedDifficulty,
    pattern
  );
  const profileConfig = getExamProfileConfig(examProfile);
  const seatingExplanation = buildSeatingExplanationForQuestion(
    seatingScenario
  );
  const baseText = buildSeatingStemForQuestion(
    seatingScenario,
    examProfile,
    profileConfig.wordingStyle
  );
  const optionBundle = buildSeatingOptionsForQuestion(
    seatingScenario
  );
  const seatingDiagram = buildSeatingDiagramData(
    seatingScenario
  );
  const seatingExplanationFlow = buildSeatingExplanationFlow(
    seatingScenario
  );
  const realismAnalysis = buildSeatingRealismAnalysis(
    seatingScenario,
    examProfile
  );
  compatibilityWarnings.push(
    ...seatingScenario.validationWarnings
  );
  const quantContext = {
    pattern,
    baseText,
    values: {},
    correctAnswer: 0,
    topicCluster
  };
  const reasoningSteps = alignReasoningStepsWithMotif(
    seatingExplanation.reasoningSteps,
    motif
  );
  const activeGenerationContext = getGenerationContext();
  const examRealismMetadata = buildExamRealismMetadata(
    examProfile,
    effectiveArchetype,
    optionBundle.optionMetadata
  );
  const enrichedQuestion = attachReasoningTrace(
    {
      text: buildQuantPrompt(
        effectiveArchetype,
        quantContext,
        examProfile
      ),
      options: optionBundle.options,
      correct: optionBundle.correct,
      explanation: seatingExplanation.text,
      section: pattern.section,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      optionMetadata: optionBundle.optionMetadata,
      examRealismMetadata: {
        ...examRealismMetadata,
        realismScore: realismAnalysis.overallScore,
        realismBand: realismAnalysis.band,
        realismSignals: realismAnalysis.matchedHeuristics,
        realismPenalties: realismAnalysis.penalties
      },
      seatingDiagram,
      seatingExplanationFlow,
      debugMetadata: {
        selectedPattern: pattern.id,
        seed: activeGenerationContext?.seed,
        generationId: activeGenerationContext?.generationId,
        generationDomain: "seating-arrangement",
        selectedMotif: selectedMotif?.id,
        selectedArchetype: effectiveArchetype.id,
        fallbackReason,
        compatibilityWarnings,
        participantCount: seatingScenario.participants.length,
        clueCount: seatingScenario.clueCount,
        inferenceDepth: seatingScenario.inferenceDepth,
        solverComplexity: seatingScenario.solverComplexity,
        validationWarnings: seatingScenario.validationWarnings,
        directClueCount: seatingScenario.directClueCount,
        indirectClueCount: seatingScenario.indirectClueCount,
        relationalClueCount: seatingScenario.relationalClueCount,
        deductionDepth: seatingScenario.deductionDepth,
        eliminationDepth: seatingScenario.eliminationDepth,
        validationRetries: seatingScenario.validationRetries,
        uniquenessFailures: seatingScenario.uniquenessFailures,
        branchingFactor: seatingScenario.branchingFactor,
        branchingComplexity: seatingScenario.branchingComplexity,
        deductionDependencyScore: seatingScenario.deductionDependencyScore,
        clueGraphDensity: seatingScenario.clueGraphDensity,
        clueDensity: seatingScenario.clueDensity,
        clueInteractionRatio: seatingScenario.clueInteractionRatio,
        redundancyScore: seatingScenario.redundancyScore,
        redundancyRatio: seatingScenario.redundancyRatio,
        anchorDensity: seatingScenario.anchorDensity,
        directClueRatio: seatingScenario.directClueRatio,
        originalClueCount: seatingScenario.originalClueCount,
        minimalClueCount: seatingScenario.minimalClueCount,
        removedRedundantClues: seatingScenario.removedRedundantClues.map(
          (clue) => JSON.stringify(clue)
        ),
        topologyDiversityScore: seatingScenario.topologyDiversityScore,
        clueDiversityScore: seatingScenario.clueDiversityScore,
        inferenceDiversityScore: seatingScenario.inferenceDiversityScore,
        structuralDiversityScore: seatingScenario.structuralDiversityScore,
        clueTypeDistribution: seatingScenario.clueTypeDistribution,
        repeatedStructureWarnings: seatingScenario.repeatedStructureWarnings,
        arrangementType: seatingScenario.arrangementType,
        orientationType: seatingScenario.orientationType,
        uniquenessVerified: seatingScenario.uniquenessVerified,
        finalArrangement: seatingScenario.finalArrangement,
        generatedClues: seatingScenario.generatedClues,
        solverTrace: seatingScenario.solverTrace,
        solverInferenceSteps: seatingScenario.solverInferenceSteps,
        solverTraceExport: seatingScenario.solverTraceExport,
        inferenceDependencyGraph: seatingScenario.inferenceDependencyGraph,
        realismAnalysis,
        seatingDiagram,
        seatingExplanationFlow
      }
    },
    reasoningSteps,
    Math.max(
      reasoningSteps.length,
      effectiveArchetype.operationChain.length
    ),
    effectiveArchetype.operationChain
  );
  const finalizedQuestion = applyDifficultyMetadata(
    enrichedQuestion,
    {
      kind: "logic",
      text: enrichedQuestion.text,
      explanation: seatingExplanation.text,
      difficultyHint: requestedDifficulty,
      targetDifficultyScore,
      reasoningSteps: enrichedQuestion.reasoningSteps,
      dependencyComplexity: enrichedQuestion.dependencyComplexity,
      operationChain: enrichedQuestion.operationChain
    }
  );
  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs: Date.now() - generationStartedAt,
      validationRetries: seatingScenario.validationRetries,
      uniquenessFailures: seatingScenario.uniquenessFailures,
      branchingFactor: seatingScenario.branchingFactor,
      branchingComplexity: seatingScenario.branchingComplexity,
      clueDensity: seatingScenario.clueDensity,
      inferenceDepth: seatingScenario.inferenceDepth,
      redundancyScore: seatingScenario.redundancyScore,
      deductionDependencyScore: seatingScenario.deductionDependencyScore,
      redundancyRatio: seatingScenario.redundancyRatio,
      anchorDensity: seatingScenario.anchorDensity,
      directClueRatio: seatingScenario.directClueRatio,
      realismScore: realismAnalysis.overallScore
    }
  );
}
function createDIQuestionSet(pattern, options) {
  const tableData = generateDISet(pattern);
  const visualType = pattern.diPattern?.visualType ?? "table";
  const series = pattern.diPattern ? getSeriesConfig(
    pattern.diPattern,
    tableData,
    visualType
  ) : void 0;
  const diQuestionSet = generateDIQuestions(
    tableData,
    visualType,
    series,
    options
  );
  return {
    questionType: "di",
    visualType,
    diData: tableData,
    series,
    title: pattern.diPattern?.title ?? pattern.topic,
    questions: diQuestionSet.questions,
    averageDifficulty: diQuestionSet.averageDifficulty,
    peakDifficulty: diQuestionSet.peakDifficulty,
    difficultySpread: diQuestionSet.difficultySpread,
    setProfile: diQuestionSet.setProfile
  };
}
function analyzeQuestionArtifacts(scenario, question, difficultyMetrics, examProfile) {
  const extractedPatternIntelligence = extractPatternIntelligence({
    scenario: scenario.scenario,
    question
  });
  const structuralSignature = buildStructuralSignature(
    scenario.scenario,
    extractedPatternIntelligence
  );
  const corpusAlignment = buildCorpusAlignmentScore(
    extractedPatternIntelligence,
    question,
    examProfile
  );
  const originalityScore = buildOriginalityScore(
    scenario.scenario,
    extractedPatternIntelligence,
    structuralSignature,
    corpusAlignment,
    question
  );
  const difficultyConfidence = buildDifficultyConfidence(
    question,
    difficultyMetrics
  );
  return {
    extractedPatternIntelligence,
    structuralSignature,
    corpusAlignment,
    originalityScore,
    difficultyConfidence
  };
}
function buildDebugMetadataWithAnalysis(question, baseDebugMetadata, analysis) {
  return {
    ...question.debugMetadata ?? {},
    ...baseDebugMetadata,
    extractedPatternIntelligence: analysis.extractedPatternIntelligence,
    structuralSignature: analysis.structuralSignature,
    corpusAlignment: analysis.corpusAlignment,
    originalityScore: analysis.originalityScore,
    difficultyConfidence: analysis.difficultyConfidence
  };
}
function materializeAdapterQuestion(adapter, context) {
  const scenario = adapter.generateScenario(context);
  const validationReport = adapter.validateScenario(
    scenario
  );
  const realizedQuestion = adapter.realizeScenario(
    scenario
  );
  const difficultyMetrics = adapter.analyzeDifficulty(
    scenario
  );
  const explanationResult = adapter.generateExplanation(
    scenario
  );
  const analysis = analyzeQuestionArtifacts(
    scenario,
    realizedQuestion,
    difficultyMetrics,
    context.options?.examProfile
  );
  const primaryRealizedQuestion = "questionType" in realizedQuestion && realizedQuestion.questionType === "di" ? realizedQuestion.questions[0] : realizedQuestion;
  const qualityAssessment = assessProceduralQuality(
    {
      validationReport,
      realismScore: primaryRealizedQuestion?.examRealismMetadata?.realismScore,
      structuralDiversityScore: primaryRealizedQuestion?.debugMetadata?.structuralDiversityScore,
      repeatedStructureWarnings: primaryRealizedQuestion?.debugMetadata?.repeatedStructureWarnings,
      directClueRatio: primaryRealizedQuestion?.debugMetadata?.directClueRatio,
      difficultyAssessment: difficultyMetrics,
      proceduralScenario: scenario.scenario,
      structuralSignature: analysis.structuralSignature
    },
    context.options?.qualityThresholds
  );
  const enrichedDebugMetadata = buildDebugMetadataWithAnalysis(
    realizedQuestion,
    {
      proceduralScenario: scenario.scenario,
      validationReportDetail: validationReport,
      difficultyAssessment: difficultyMetrics,
      qualityAssessment
    },
    analysis
  );
  return {
    scenario,
    validationReport,
    realizedQuestion: "debugMetadata" in realizedQuestion ? {
      ...explanationResult.text && "explanation" in realizedQuestion && !realizedQuestion.explanation ? {
        ...realizedQuestion,
        explanation: explanationResult.text
      } : realizedQuestion,
      debugMetadata: enrichedDebugMetadata
    } : realizedQuestion,
    difficultyMetrics
  };
}
function generateQuestionsWithAdapter(adapter, pattern, count, options) {
  if (adapter.generationMode === "single") {
    const singleResult = materializeAdapterQuestion(
      adapter,
      {
        pattern,
        count,
        options
      }
    );
    return [
      singleResult.realizedQuestion
    ];
  }
  const questions2 = [];
  const attempted = [];
  const maxAttempts = Math.max(
    count * (adapter.maxAttemptsMultiplier ?? 10),
    adapter.minAttempts ?? 16
  );
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidateResult = materializeAdapterQuestion(
      adapter,
      {
        pattern,
        count,
        options
      }
    );
    const candidate = candidateResult.realizedQuestion;
    attempted.push(candidate);
    if (validateDifficultyTarget(
      candidate.difficultyScore,
      options
    ) || !options?.targetDifficulty) {
      questions2.push(candidate);
    }
    if (questions2.length >= count) {
      break;
    }
  }
  return buildDifficultyBalancedSet(
    questions2.length ? questions2 : attempted,
    count,
    options
  );
}
function getDomainAdapterRegistry() {
  return createDomainAdapters({
    createFormulaQuestionCandidate,
    createReasoningQuestionCandidate,
    createSeatingQuestionCandidate,
    createDIQuestionSet
  });
}
async function generateFromPattern(pattern, count, options) {
  const topicConfig = resolveTopicConfig(
    inferGenerationDomain(pattern),
    pattern.topic
  );
  const effectivePattern = applyTopicConfigToPattern(
    pattern,
    topicConfig
  );
  const effectiveOptions = applyTopicConfigToOptions(
    options,
    topicConfig
  );
  const cacheEligible = count > 0;
  const generationContext = effectiveOptions?.generationContext ?? createGenerationContext(
    effectiveOptions?.seed
  );
  return runWithGenerationContext(
    generationContext,
    async () => {
      try {
        if (cacheEligible) {
          const cachedResult = await getCachedGenerationResult(
            effectivePattern,
            count,
            effectiveOptions
          );
          if (cachedResult) {
            return cachedResult;
          }
        }
        resetStructuralDiversityRegistry();
        const generationDomain = inferGenerationDomain(
          effectivePattern
        );
        const domainAdapters = getDomainAdapterRegistry();
        const adapter = resolveDomainAdapter(
          domainAdapters,
          generationDomain
        );
        const responseBase = {
          generationContext: {
            seed: generationContext.seed,
            generationId: generationContext.generationId,
            timestamp: generationContext.timestamp
          }
        };
        let result;
        result = {
          ...responseBase,
          questions: generateQuestionsWithAdapter(
            adapter,
            effectivePattern,
            count,
            effectiveOptions
          )
        };
        await cacheGenerationResult(
          effectivePattern,
          count,
          effectiveOptions,
          result
        );
        return result;
      } catch (error) {
        const structuredError = isReasoningEngineError(error) ? error : new ReasoningEngineError({
          code: "GENERATION_FAILED",
          phase: "realization",
          message: error instanceof Error ? error.message : "Unknown generator failure.",
          metadata: buildReasoningErrorMetadata({
            patternId: pattern.id,
            topic: pattern.topic,
            subtopic: pattern.subtopic,
            count
          }),
          cause: error
        });
        console.error(
          "Reasoning engine failure",
          {
            code: structuredError.code,
            phase: structuredError.phase,
            metadata: structuredError.metadata,
            message: structuredError.message
          }
        );
        throw structuredError;
      }
    }
  );
}

// src/lib/patterns/percentage.ts
var PERCENTAGE_PATTERNS = [];

// src/lib/patterns/seating.ts
var SEATING_PATTERNS = [
  {
    id: "seating-linear-easy",
    type: "logic",
    generationDomain: "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Linear Seating",
    difficulty: "Easy",
    supportedQuestionTypes: [
      "logic"
    ],
    templateVariants: [
      "Read the seating arrangement carefully."
    ],
    variables: {},
    arrangementType: "linear",
    orientationTypes: [
      "north",
      "south"
    ],
    participantCount: 5,
    clueTypes: [
      "left-right",
      "neighbor",
      "distance",
      "direct-position"
    ],
    inferenceDepth: 2
  },
  {
    id: "seating-linear-medium",
    type: "logic",
    generationDomain: "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Linear Seating",
    difficulty: "Medium",
    supportedQuestionTypes: [
      "logic"
    ],
    templateVariants: [
      "Solve the seating arrangement carefully."
    ],
    variables: {},
    arrangementType: "linear",
    orientationTypes: [
      "north",
      "south",
      "alternate"
    ],
    participantCount: 6,
    clueTypes: [
      "left-right",
      "neighbor",
      "distance",
      "not-adjacent",
      "between"
    ],
    inferenceDepth: 4
  },
  {
    id: "seating-circular-medium",
    type: "logic",
    generationDomain: "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Circular Seating",
    difficulty: "Medium",
    supportedQuestionTypes: [
      "logic"
    ],
    templateVariants: [
      "Read the circular seating clues carefully."
    ],
    variables: {},
    arrangementTypes: [
      "circular",
      "square",
      "rectangular"
    ],
    orientationTypes: [
      "center",
      "outward"
    ],
    participantCount: 6,
    clueTypes: [
      "neighbor",
      "left-right",
      "distance",
      "opposite",
      "not-opposite"
    ],
    inferenceDepth: 5
  },
  {
    id: "seating-hard-mixed",
    type: "logic",
    generationDomain: "seating-arrangement",
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Mixed and Double Row Seating",
    difficulty: "Hard",
    supportedQuestionTypes: [
      "logic"
    ],
    templateVariants: [
      "Use the seating clues to infer the complete arrangement."
    ],
    variables: {},
    arrangementTypes: [
      "circular",
      "double-row",
      "parallel-row"
    ],
    orientationTypes: [
      "alternate",
      "mixed",
      "center",
      "north"
    ],
    participantCount: 6,
    clueTypes: [
      "neighbor",
      "left-right",
      "distance",
      "between",
      "adjacent-both",
      "not-adjacent",
      "opposite",
      "facing"
    ],
    inferenceDepth: 6
  }
];

// src/lib/patterns/index.ts
var ALL_PATTERNS = [
  ...PERCENTAGE_PATTERNS,
  ...SEATING_PATTERNS
];

// profile-seating-generation.ts
async function main() {
  const pattern = ALL_PATTERNS.find(
    (entry) => entry.id === "seating-hard-mixed"
  );
  if (!pattern) {
    throw new Error(
      "seating-hard-mixed pattern not found"
    );
  }
  const startedAt = Date.now();
  const result = await generateFromPattern(
    pattern,
    1,
    {}
  );
  const question = result.questions[0];
  console.log(
    JSON.stringify(
      {
        elapsedMs: Date.now() - startedAt,
        questionCount: result.questions.length,
        selectedMotif: question?.debugMetadata?.selectedMotif,
        arrangementType: question?.debugMetadata?.arrangementType,
        participantCount: question?.debugMetadata?.participantCount,
        clueCount: question?.debugMetadata?.clueCount,
        text: question?.text
      },
      null,
      2
    )
  );
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
