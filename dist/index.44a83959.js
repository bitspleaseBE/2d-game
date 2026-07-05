// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"aAwE2":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "7b4fa47c44a83959";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"6JHOc":[function(require,module,exports) {
var _gameJs = require("./game.js");
var _assetsJs = require("./assets.js");
var _splashJs = require("./screens/splash.js");
var _indexJs = require("./screens/index.js");
var _settingsJs = require("./utils/settings.js");
var _rngJs = require("./utils/rng.js");
// Entry point of the game
// - Initialize the game engine
// - Load assets (images, sounds, etc.)
// - Set up the game loop
// - Handle global game state (e.g., current level, player lives, score)
// - Transition between different screens (welcome, game, game over, high score)
class GameEngine {
    constructor(containerId){
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = (0, _settingsJs.canvasSettings).width;
        this.canvas.height = (0, _settingsJs.canvasSettings).height;
        this.canvas.style.display = "block";
        this.canvas.style.margin = "auto";
        this.container.appendChild(this.canvas);
        this.currentScreen = "splash";
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    async initialize() {
        try {
            console.log("Initializing game...");
            const totalAssets = 34;
            let loadedAssets = 0;
            const onProgress = (src, img)=>{
                loadedAssets++;
                const progress = Math.floor(loadedAssets / totalAssets * 100);
                (0, _splashJs.updateSplashScreenProgress)(progress);
            };
            const playerAssets = await (0, _assetsJs.loadPlayerAssets)(onProgress);
            const levelAssets = await (0, _assetsJs.loadLevelAssets)(onProgress);
            const guardAssets = await (0, _assetsJs.loadGuardAssets)(onProgress);
            const powerupsAssets = await (0, _assetsJs.loadPowerUpsAssets)(onProgress);
            this.assets = {
                playerAssets,
                levelAssets,
                guardAssets,
                powerupsAssets
            };
            this.game = new (0, _gameJs.Game)(this.container.id, this.canvas, this.context, this.assets, {
                onGameOver: ()=>this.showScreen("gameOver"),
                onLevelCompleted: ()=>this.showScreen("levelCompleted"),
                onGameWon: ()=>this.showScreen("gameWon")
            });
            this.showScreen("welcome");
            this.setupGameControls();
        } catch (error) {
            console.error("Error initializing game:", error);
            // Re-throw so the splash screen can surface the failure instead of
            // transitioning to a welcome screen backed by an uninitialized game.
            throw error;
        }
    }
    setupGameControls() {
        window.addEventListener("keydown", (event)=>{
            switch(event.key){
                case (0, _settingsJs.controlSettings).esc:
                    if (this.game && this.game.started) this.game.pause();
                    this.showScreen("welcome");
                    break;
            }
        });
    }
    async showScreen(screen) {
        console.log("Showing screen:", screen);
        switch(screen){
            case "splash":
                (0, _splashJs.showSplashScreen)(this.initialize.bind(this), ()=>this.showScreen("welcome"));
                break;
            case "welcome":
                (0, _indexJs.showWelcomeScreen)(()=>this.startGame(), this.game && this.game.started ? ()=>this.continueGame() : null, ()=>this.highScore(), ()=>this.gameOver(), ()=>this.story());
                break;
            case "story":
                (0, _indexJs.showStoryScreen)(()=>this.showScreen("welcome"));
                break;
            case "game":
                console.log("Starting game...");
                if (!this.game) {
                    console.error("Cannot start game: assets are still loading or failed to load.");
                    return;
                }
                if (!this.game.started) this.game.start();
                else this.game.continue();
                break;
            case "gameOver":
                this.game.pause();
                this.game.started = false;
                (0, _indexJs.showGameOverScreen)(this.game.score, ()=>this.startGame(), ()=>this.showScreen("welcome"));
                break;
            case "gameWon":
                (0, _indexJs.showGameWonScreen)(this.game.score, ()=>this.startGame(), ()=>this.showScreen("welcome"));
                break;
            case "highScore":
                (0, _indexJs.showHighScoreScreen)(()=>this.showScreen("welcome"));
                break;
            case "levelCompleted":
                (0, _indexJs.showLevelCompletedScreen)(this.game.score, ()=>this.startGame(), ()=>this.showScreen("welcome"));
                break;
            default:
                console.error("Unknown screen:", screen);
        }
    }
    story() {
        this.currentScreen = "story";
        this.showScreen(this.currentScreen);
    }
    startGame() {
        this.currentScreen = "game";
        this.showScreen(this.currentScreen);
    }
    continueGame() {
        this.currentScreen = "game";
        this.showScreen(this.currentScreen);
    }
    gameOver() {
        this.currentScreen = "gameOver";
        this.showScreen(this.currentScreen);
    }
    highScore() {
        this.currentScreen = "highScore";
        this.showScreen(this.currentScreen);
    }
}
const gameEngine = new GameEngine("game-container");
gameEngine.showScreen("splash");
// Exposed for automated (Playwright) tests to inspect game state.
// setSeed makes randomness reproducible mid-run; ?seed=N in the URL
// seeds the RNG at load time.
window.__wandertrap = gameEngine;
window.__wandertrap.setSeed = (0, _rngJs.setSeed);

},{"./game.js":"7sRy4","./assets.js":"2MtDO","./screens/splash.js":"kNfRL","./screens/index.js":"2Rkrn","./utils/settings.js":"hBndc","./utils/rng.js":"7uRsi"}],"7sRy4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Main game logic
// - Initialize the game board (labyrinth)
// - Handle player input (movement, interactions)
// - Update game state (player position, lives, score)
// - Check for collisions (with obstacles, powerups, explosives, guards)
// - Handle level completion (transition to next level or game over)
// - Render the game board and entities (player, obstacles, powerups, guards)
parcelHelpers.export(exports, "Game", ()=>Game);
var _settingsJs = require("./utils/settings.js");
var _playerJs = require("./entities/player.js");
var _playerJsDefault = parcelHelpers.interopDefault(_playerJs);
var _levelDataJs = require("./levels/level-data.js");
var _levelDataJsDefault = parcelHelpers.interopDefault(_levelDataJs);
var _canvasJs = require("./utils/canvas.js");
var _gameJs = require("./utils/game.js");
var _rngJs = require("./utils/rng.js");
var _wallJs = require("./entities/wall.js");
var _wallJsDefault = parcelHelpers.interopDefault(_wallJs);
var _explosiveJs = require("./entities/explosive.js");
var _explosiveJsDefault = parcelHelpers.interopDefault(_explosiveJs);
var _guardJs = require("./entities/guard.js");
var _guardJsDefault = parcelHelpers.interopDefault(_guardJs);
var _obstacleJs = require("./entities/obstacle.js");
var _obstacleJsDefault = parcelHelpers.interopDefault(_obstacleJs);
var _powerupJs = require("./entities/powerup.js");
var _powerupJsDefault = parcelHelpers.interopDefault(_powerupJs);
var _exitJs = require("./entities/exit.js");
var _exitJsDefault = parcelHelpers.interopDefault(_exitJs);
class Game {
    constructor(containerId, canvas, context, assets, callbacks = {}){
        this.container = document.getElementById(containerId);
        this.canvas = canvas;
        this.context = context;
        this.player = null;
        this.board = [];
        this.entities = [];
        this.walls = [];
        this.exit = null;
        this.lives = (0, _settingsJs.playerSettings).initialLives;
        this.score = 0;
        this.currentLevel = (0, _settingsJs.gameSettings).initialLevel;
        this.isGameOver = false;
        this.started = false;
        this.paused = false;
        this.assets = assets;
        this.explosives = [];
        this.guards = [];
        this.obstacles = [];
        this.powerups = [];
        this.playerStart = {
            x: 0,
            y: 0
        };
        this.onGameOver = callbacks.onGameOver || (()=>{});
        this.onLevelCompleted = callbacks.onLevelCompleted || (()=>{});
        this.onGameWon = callbacks.onGameWon || (()=>{});
        this.rafId = null;
        this.inputSetup = false;
    }
    initializeBoard() {
        const level = (0, _levelDataJsDefault.default).getLevel(this.currentLevel);
        if (level) {
            this.walls = [];
            this.exit = null;
            this.board = level.layout;
            for(let y = 0; y < level.layout.length; y++)for(let x = 0; x < level.layout[y].length; x++){
                if (level.layout[y][x] === "#") this.walls.push(new (0, _wallJsDefault.default)(x * (0, _settingsJs.canvasSettings).cellWidth, y * (0, _settingsJs.canvasSettings).cellHeight, "normal", this.assets.levelAssets));
                if (level.layout[y][x] === "X") this.exit = new (0, _exitJsDefault.default)(x * (0, _settingsJs.canvasSettings).cellWidth, y * (0, _settingsJs.canvasSettings).cellHeight, this.assets.levelAssets);
            }
        }
    }
    initializePlayer() {
        const level = (0, _levelDataJsDefault.default).getLevel(this.currentLevel);
        if (level) for(let y = 0; y < level.layout.length; y++){
            for(let x = 0; x < level.layout[y].length; x++)if (level.layout[y][x] === "P") {
                this.playerStart = {
                    x: x * (0, _settingsJs.canvasSettings).cellWidth,
                    y: y * (0, _settingsJs.canvasSettings).cellHeight
                };
                this.player = new (0, _playerJsDefault.default)(this.playerStart.x, this.playerStart.y, this.assets.playerAssets);
                this.setupInput();
                return;
            }
        }
    }
    setupInput() {
        // Only register the listener once; initializePlayer runs again on every
        // level change and would otherwise stack duplicate handlers
        if (this.inputSetup) return;
        this.inputSetup = true;
        let actionTimeout;
        const debounceAction = (callback, delay)=>{
            return ()=>{
                clearTimeout(actionTimeout);
                actionTimeout = setTimeout(()=>{
                    this.player.action = "idle";
                }, delay);
                callback();
            };
        };
        window.addEventListener("keydown", (event)=>{
            if (!this.started || this.paused || this.isGameOver) return;
            // Stop the space bar (and arrow keys) from scrolling the page
            if (event.key === " " || event.key.startsWith("Arrow")) event.preventDefault();
            switch(event.key){
                case (0, _settingsJs.controlSettings).up:
                    debounceAction(()=>this.movePlayer("up"), 1000)();
                    break;
                case (0, _settingsJs.controlSettings).down:
                    debounceAction(()=>this.movePlayer("down"), 1000)();
                    break;
                case (0, _settingsJs.controlSettings).left:
                    debounceAction(()=>this.movePlayer("left"), 1000)();
                    break;
                case (0, _settingsJs.controlSettings).right:
                    debounceAction(()=>this.movePlayer("right"), 1000)();
                    break;
                case (0, _settingsJs.controlSettings).attack:
                    debounceAction(()=>this.playerAttack(), 250)();
                    break;
                case (0, _settingsJs.controlSettings).pick:
                    debounceAction(()=>this.player.pick(), 150)();
                    break;
                case (0, _settingsJs.controlSettings).axe:
                    debounceAction(()=>this.player.axe(), 150)();
                    break;
                case (0, _settingsJs.controlSettings).potion:
                    debounceAction(()=>this.player.potion(), 500)();
                    break;
            }
        });
    }
    movePlayer(direction) {
        const next = this.player.checkCollision(direction);
        const hitBox = this.player.getHitBox();
        const current = this.player.getPosition();
        const nextHitBox = {
            x: next.x + (hitBox.x - current.x),
            y: next.y + (hitBox.y - current.y),
            width: hitBox.width,
            height: hitBox.height
        };
        const blocked = next.x < 0 || next.y < 0 || next.x > this.canvas.width - (0, _settingsJs.canvasSettings).cellWidth || next.y > this.canvas.height - (0, _settingsJs.canvasSettings).cellHeight || this.walls.some((wall)=>(0, _gameJs.isColliding)(nextHitBox, wall.getHitBox())) || this.obstacles.some((obstacle)=>(0, _gameJs.isColliding)(nextHitBox, obstacle.getHitBox()));
        if (blocked) {
            // Face the direction anyway so the player can turn in place
            this.player.movement = direction;
            this.player.action = "idle";
            return;
        }
        switch(direction){
            case "up":
                this.player.moveUp();
                break;
            case "down":
                this.player.moveDown();
                break;
            case "left":
                this.player.moveLeft();
                break;
            case "right":
                this.player.moveRight();
                break;
        }
    }
    playerAttack() {
        this.player.attack();
        const attackBox = this.player.getAttackBox();
        // Damage guards caught in the swing and remove any that are defeated
        this.guards = this.guards.filter((guard)=>{
            if ((0, _gameJs.isColliding)(attackBox, guard.getHitBox())) {
                const defeated = guard.takeDamage(this.player.attackPower);
                if (defeated) {
                    this.score += (0, _settingsJs.gameSettings).scoreIncrement;
                    return false;
                }
            }
            return true;
        });
        // Chop down obstacles (trees, boulders) that are struck
        this.obstacles = this.obstacles.filter((obstacle)=>{
            if ((0, _gameJs.isColliding)(attackBox, obstacle.getHitBox())) {
                obstacle.takeDamage(this.player.attackPower);
                return !obstacle.isDestroyed();
            }
            return true;
        });
    }
    initializeEntities() {
        const level = (0, _levelDataJsDefault.default).getLevel(this.currentLevel);
        if (level) {
            this.explosives = [];
            this.guards = [];
            this.obstacles = [];
            this.powerups = [];
            for(let y = 0; y < level.layout.length; y++)for(let x = 0; x < level.layout[y].length; x++){
                const cell = level.layout[y][x];
                const position = {
                    x: x * (0, _settingsJs.canvasSettings).cellWidth,
                    y: y * (0, _settingsJs.canvasSettings).cellHeight
                };
                switch(cell){
                    case "E":
                        this.explosives.push(new (0, _explosiveJsDefault.default)(position.x, position.y, this.assets));
                        break;
                    case "G":
                        const randomOrc = (0, _rngJs.randomInt)(1, 3);
                        this.guards.push(new (0, _guardJsDefault.default)(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets));
                        break;
                    case "O":
                        this.obstacles.push(new (0, _obstacleJsDefault.default)(position.x, position.y, "boulder", this.assets.levelAssets));
                        break;
                    case "T":
                        this.obstacles.push(new (0, _obstacleJsDefault.default)(position.x, position.y, "tree", this.assets.levelAssets));
                        break;
                    case "C":
                        const randomPowerup = (0, _rngJs.randomInt)(1, 2);
                        this.powerups.push(new (0, _powerupJsDefault.default)(position.x, position.y, randomPowerup == 1 ? "health" : "mana", this.assets.powerupsAssets));
                        break;
                }
            }
        }
    }
    updateGameState() {
        this.checkCollisions();
        this.checkPlayerDeath();
        if (this.isGameOver) return;
        this.player.update();
        this.explosives.forEach((explosive)=>explosive.update());
        this.guards.forEach((guard)=>guard.update(this.player.getHitBox(), this.walls));
        this.obstacles.forEach((obstacle)=>obstacle.update());
        this.powerups.forEach((powerup)=>powerup.update());
        this.checkLevelCompletion();
    }
    checkPlayerDeath() {
        if (this.player.getHealth() > 0) return;
        this.lives -= 1;
        if (this.lives <= 0) {
            this.isGameOver = true;
            this.started = false;
            this.onGameOver(this.score);
            return;
        }
        this.player.respawn(this.playerStart.x, this.playerStart.y);
    }
    checkCollisions() {
        const playerPosition = this.player.getHitBox();
        this.explosives.forEach((explosive, index)=>{
            if ((0, _gameJs.isColliding)(playerPosition, explosive.getHitBox())) {
                if (explosive.isActive()) ;
                else if (!explosive.isHidden()) {
                    this.player.collectExplosive(explosive);
                    this.explosives.splice(index, 1);
                }
            }
        });
        this.guards.forEach((guard)=>{
            if ((0, _gameJs.isColliding)(playerPosition, guard.getHitBox())) this.player.takeDamage(guard.damage);
        });
        this.obstacles.forEach((obstacle, index)=>{
            (0, _gameJs.isColliding)(playerPosition, obstacle.getHitBox());
        });
        this.powerups.forEach((powerup, index)=>{
            if ((0, _gameJs.isColliding)(this.player.getPickupRange(), powerup.getHitBox())) {
                const effect = powerup.collect();
                this.player.applyPowerup(effect);
                this.powerups.splice(index, 1);
                this.score += (0, _settingsJs.gameSettings).scoreIncrement;
            }
        });
    }
    checkLevelCompletion() {
        if (!this.isLevelComplete()) return;
        this.score += (0, _settingsJs.gameSettings).scoreIncrement;
        const nextLevel = (0, _levelDataJsDefault.default).getLevel(this.currentLevel + 1);
        if (nextLevel) {
            this.currentLevel += 1;
            this.initializeBoard();
            this.initializePlayer();
            this.initializeEntities();
            this.pause();
            this.onLevelCompleted(this.score);
        } else {
            // Last level cleared: the player won the game
            this.isGameOver = true;
            this.started = false;
            this.onGameWon(this.score);
        }
    }
    isLevelComplete() {
        // A level is complete when the player reaches the exit
        return this.exit && (0, _gameJs.isColliding)(this.player.getHitBox(), this.exit.getHitBox());
    }
    render() {
        // Render the game board and entities (player, obstacles, powerups, guards)
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the grid
        this.drawGrid();
        // Draw the walls
        this.walls.forEach((wall)=>wall.draw(this.context));
        // Draw the entities
        this.obstacles.forEach((obstacle)=>obstacle.draw(this.context));
        this.powerups.forEach((powerup)=>powerup.draw(this.context));
        this.guards.forEach((guard)=>guard.draw(this.context));
        this.explosives.forEach((explosive)=>explosive.draw(this.context));
        // Draw the exit
        if (this.exit) this.exit.draw(this.context);
        // Draw the player
        this.player.draw(this.context);
        // Draw the HUD on top of everything
        this.drawHUD();
    }
    drawHUD() {
        const ctx = this.context;
        ctx.save();
        // Background strip
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(8, 8, 300, 40);
        ctx.font = "bold 18px monospace";
        ctx.textBaseline = "middle";
        // Score
        ctx.fillStyle = "#ffd54f";
        ctx.fillText(`Score: ${this.score}`, 18, 28);
        // Lives
        ctx.fillStyle = "#ff5252";
        ctx.fillText(`${"\u2665".repeat(Math.max(0, this.lives))}`, 160, 28);
        // Health bar
        const health = Math.max(0, this.player.getHealth());
        ctx.fillStyle = "#444";
        ctx.fillRect(226, 20, 70, 14);
        ctx.fillStyle = health > 30 ? "#4caf50" : "#c62828";
        ctx.fillRect(226, 20, health / 100 * 70, 14);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(226, 20, 70, 14);
        ctx.restore();
    }
    drawGrid() {
        // Create a gradient for the background
        const gradient = this.context.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2);
        gradient.addColorStop(0, "#3E8948"); // Center color (lighter green)
        gradient.addColorStop(1, "#1A3B1F"); // Edge color (darker green)
        // Fill background with gradient
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Set grid style
        this.context.strokeStyle = "rgba(0, 255, 0, 0.1)";
        this.context.lineWidth = 1;
        // Draw grid lines
        this.context.beginPath();
        // Vertical lines
        for(let x = 0; x <= this.canvas.width; x += (0, _settingsJs.canvasSettings).cellWidth){
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
        }
        // Horizontal lines
        for(let y = 0; y <= this.canvas.height; y += (0, _settingsJs.canvasSettings).cellHeight){
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
        }
        this.context.stroke();
    }
    gameLoop() {
        // Main game loop
        if (this.isGameOver || this.paused) return;
        this.updateGameState();
        if (this.isGameOver || this.paused) return;
        this.render();
        this.rafId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    pause() {
        this.paused = true;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
    start() {
        // Fresh run: reset all progress
        this.started = true;
        this.paused = false;
        this.isGameOver = false;
        this.lives = (0, _settingsJs.playerSettings).initialLives;
        this.score = 0;
        this.currentLevel = (0, _settingsJs.gameSettings).initialLevel;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        (0, _canvasJs.clearContainer)(this.container);
        this.container.appendChild(this.canvas);
        this.initializeBoard();
        this.initializePlayer();
        this.initializeEntities();
        this.gameLoop();
    }
    continue() {
        this.started = true;
        this.paused = false;
        (0, _canvasJs.clearContainer)(this.container);
        this.container.appendChild(this.canvas);
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.gameLoop();
    }
    // ---------------------------------------------------------------------
    // Test hooks
    // The methods below exist so automated (Playwright) tests can build exact
    // scenarios and advance the simulation deterministically. They are not
    // part of regular gameplay and should not be called from game code.
    // ---------------------------------------------------------------------
    // Advance the simulation a fixed number of frames, synchronously and
    // independently of requestAnimationFrame, then render the result
    step(frames = 1) {
        if (!this.player) return;
        for(let i = 0; i < frames; i++){
            if (this.isGameOver) break;
            this.updateGameState();
        }
        if (!this.isGameOver) this.render();
    }
    // Place the player at an exact pixel position
    teleportPlayer(x, y) {
        this.player.setPosition(x, y);
    }
    // Add a guard at an exact pixel position
    spawnGuard(x, y, type = "orc1") {
        const guard = new (0, _guardJsDefault.default)(x, y, type, this.assets.guardAssets);
        this.guards.push(guard);
        return guard;
    }
    // Jump straight to a given level with a fresh board
    startAtLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.initializeBoard();
        this.initializePlayer();
        this.initializeEntities();
    }
}
exports.default = Game;

},{"./utils/settings.js":"hBndc","./entities/player.js":"1uqza","./levels/level-data.js":"57eJ8","./utils/canvas.js":"TkAKd","./utils/game.js":"jBBaN","./utils/rng.js":"7uRsi","./entities/wall.js":"d9RxC","./entities/explosive.js":"590U3","./entities/guard.js":"bFjVQ","./entities/obstacle.js":"14cf6","./entities/powerup.js":"7DUBa","./entities/exit.js":"lIWLe","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hBndc":[function(require,module,exports) {
// Game settings and configurations
// - This file contains global settings and configurations for the game
// - These settings can be adjusted to change the game's behavior and appearance
// Canvas settings
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "canvasSettings", ()=>canvasSettings);
parcelHelpers.export(exports, "playerSettings", ()=>playerSettings);
parcelHelpers.export(exports, "gameSettings", ()=>gameSettings);
parcelHelpers.export(exports, "entitySettings", ()=>entitySettings);
parcelHelpers.export(exports, "soundSettings", ()=>soundSettings);
parcelHelpers.export(exports, "controlSettings", ()=>controlSettings);
const canvasSettings = {
    width: 1280,
    height: 640,
    backgroundColor: "#2c2c2c",
    cellWidth: 64,
    cellHeight: 64
};
const playerSettings = {
    initialLives: 3,
    speed: 5,
    color: "#ff69b4"
};
const gameSettings = {
    initialLevel: 1,
    maxLevels: 5,
    scoreIncrement: 100
};
const entitySettings = {
    enemyWidth: 91,
    enemyHeight: 91,
    obstacleColor: "#c62828",
    powerupColor: "#1565c0",
    guardColor: "#ff69b4",
    explosiveColor: "#ffd54f",
    exitColor: "#4caf50"
};
const soundSettings = {
    mute: false,
    volume: 0.5
};
const controlSettings = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    attack: " ",
    esc: "Escape",
    pick: "p",
    axe: "x",
    potion: "u"
}; // Add more settings as needed for other aspects of the game

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"1uqza":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _settingsJs = require("../utils/settings.js");
class Player extends (0, _entityJsDefault.default) {
    #health;
    #speed;
    #isHurt = false;
    #hurtInterval = null;
    constructor(x, y, assets){
        super(x, y, "player", assets);
        this.#health = 100;
        this.#speed = 5;
        this.attackPower = 50;
        this.explosives = [];
        this.keys = [];
        this.powerups = [];
        this.currentFrame = 0;
        this.frameCount = 0;
        this.movement = "down";
        this.action = "idle";
        this.visible = true;
    }
    selectSprites(assets) {
        return {
            movement: assets.playerMovement,
            actions: assets.playerActions
        };
    }
    getPickupRange() {
        return {
            x: this._position.x,
            y: this._position.y,
            width: this._width,
            height: this._height
        };
    }
    getHitBox() {
        return {
            x: this._position.x + this._width * 0.25,
            y: this._position.y + this._height * 0.25,
            width: this._width * 0.5,
            height: this._height * 0.5
        };
    }
    // Area in front of the player that an attack sweeps over
    getAttackBox() {
        const hitBox = this.getHitBox();
        const reach = this._width * 0.6;
        switch(this.movement){
            case "up":
                return {
                    x: hitBox.x,
                    y: hitBox.y - reach,
                    width: hitBox.width,
                    height: reach
                };
            case "down":
                return {
                    x: hitBox.x,
                    y: hitBox.y + hitBox.height,
                    width: hitBox.width,
                    height: reach
                };
            case "left":
                return {
                    x: hitBox.x - reach,
                    y: hitBox.y,
                    width: reach,
                    height: hitBox.height
                };
            case "right":
            default:
                return {
                    x: hitBox.x + hitBox.width,
                    y: hitBox.y,
                    width: reach,
                    height: hitBox.height
                };
        }
    }
    getHealth() {
        return this.#health;
    }
    takeDamage(amount) {
        // Ignore hits during the invulnerability window after being hurt
        if (this.#isHurt || this.#health <= 0) return;
        this.#health -= amount;
        this.hurtAnimation();
    }
    respawn(x, y) {
        this._position = {
            x,
            y
        };
        this.#health = 100;
        this.#isHurt = false;
        if (this.#hurtInterval) {
            clearInterval(this.#hurtInterval);
            this.#hurtInterval = null;
        }
        this.visible = true;
        this.action = "idle";
        this.movement = "down";
    }
    moveLeft() {
        this._position.x -= this.#speed;
        this.action = "walk";
        this.movement = "left";
    }
    moveRight() {
        this._position.x += this.#speed;
        this.action = "walk";
        this.movement = "right";
    }
    moveUp() {
        this._position.y -= this.#speed;
        this.action = "walk";
        this.movement = "up";
    }
    moveDown() {
        this._position.y += this.#speed;
        this.action = "walk";
        this.movement = "down";
    }
    attack() {
        this.action = "attack";
    // Implement attack logic here
    }
    pick() {
        this.action = "pick";
    // TODO: Implement actual object detection and picking logic
    // This would involve checking for collisions with pickable entities
    // and handling the pickup if a valid object is found
    }
    axe() {
        this.action = "axe";
    // Implement axe logic here
    }
    potion() {
        this.action = "potion";
    // Implement potion logic here
    }
    collectExplosive(explosive) {
        this.explosives.push(explosive);
    }
    collectKey(key) {
        this.keys.push(key);
    }
    collectPowerup(powerup) {
        this.powerups.push(powerup);
    }
    applyPowerup(effect) {
        this.powerups.push(effect);
        if (effect === "health") this.#health = Math.min(100, this.#health + 25);
    }
    update() {
        this.frameCount++;
        if (this.frameCount >= 10) {
            // Adjust frame rate as needed
            let frames_per_action = 6;
            if (this.action === "walk" || this.action === "idle" || this.action === "jump") frames_per_action = 6;
            else if (this.action === "attack" || this.action === "duck") frames_per_action = 4;
            else if (this.action === "pick" || this.action === "axe" || this.action === "potion") frames_per_action = 4;
            this.currentFrame = (this.currentFrame + 1) % frames_per_action;
            this.frameCount = 0;
        }
    }
    // Add a new method to check for collisions before moving
    checkCollision(direction) {
        const nextPosition = {
            ...this._position
        };
        switch(direction){
            case "left":
                nextPosition.x -= this.#speed;
                break;
            case "right":
                nextPosition.x += this.#speed;
                break;
            case "up":
                nextPosition.y -= this.#speed;
                break;
            case "down":
                nextPosition.y += this.#speed;
                break;
        }
        return nextPosition;
    }
    hurtAnimation() {
        if (this.#isHurt) return;
        this.#isHurt = true;
        this.action = "idle"; // Freeze the player
        let flickerCount = 0;
        const maxFlickers = 10;
        const flickerDuration = 100; // milliseconds
        this.#hurtInterval = setInterval(()=>{
            this.visible = !this.visible; // Toggle visibility
            flickerCount++;
            if (flickerCount >= maxFlickers) {
                clearInterval(this.#hurtInterval);
                this.#hurtInterval = null;
                this.#isHurt = false;
                this.visible = true; // Ensure player is visible after flickering
            }
        }, flickerDuration);
    }
    draw(ctx) {
        if (!this.visible) return;
        let spriteHeight = 32;
        let spriteWidth = 32;
        let spriteX = 0;
        let spriteY = 0;
        let spriteSheet = this._sprites.movement;
        // mapping the sprite sheet to the actions
        switch(this.action){
            case "walk":
                switch(this.movement){
                    case "left":
                        spriteY = 4 * spriteHeight;
                        break;
                    case "right":
                        spriteY = 4 * spriteHeight;
                        break;
                    case "up":
                        spriteY = 2 * spriteHeight;
                        break;
                    case "down":
                        spriteY = 0 * spriteHeight;
                        break;
                }
                break;
            case "crawl":
                switch(this.movement){
                    case "down":
                        spriteY = 0 * spriteHeight;
                        break;
                    case "left":
                        spriteY = 9 * spriteHeight;
                        break;
                    case "right":
                        spriteY = 9 * spriteHeight;
                        break;
                    case "up":
                        spriteY = 0 * spriteHeight;
                        break;
                }
                break;
            case "attack":
                switch(this.movement){
                    case "down":
                        spriteY = 6 * spriteHeight;
                        break;
                    case "left":
                        spriteY = 7 * spriteHeight;
                        break;
                    case "right":
                        spriteY = 7 * spriteHeight;
                        break;
                    case "up":
                        spriteY = 8 * spriteHeight;
                        break;
                }
                break;
            case "pick":
                spriteHeight = 48;
                spriteWidth = 48;
                spriteSheet = this._sprites.actions;
                switch(this.movement){
                    case "down":
                        spriteY = 1 * spriteHeight;
                        break;
                    case "left":
                        spriteY = 0 * spriteHeight;
                        break;
                    case "right":
                        spriteY = 0 * spriteHeight;
                        break;
                    case "up":
                        spriteY = 2 * spriteHeight;
                        break;
                }
                break;
            case "axe":
                spriteHeight = 48;
                spriteWidth = 48;
                spriteSheet = this._sprites.actions;
                spriteX = 3 * spriteWidth;
                spriteY = 10 * spriteHeight;
                break;
            case "potion":
                spriteHeight = 48;
                spriteWidth = 48;
                spriteSheet = this._sprites.actions;
                // spriteY = 11 * spriteHeight;
                switch(this.movement){
                    case "down":
                        spriteY = 9 * spriteHeight;
                        break;
                    case "left":
                        spriteY = 9 * spriteHeight;
                        break;
                    case "right":
                        spriteY = 9 * spriteHeight;
                        break;
                    case "up":
                        spriteY = 10 * spriteHeight;
                        break;
                }
                break;
            case "idle":
            default:
                switch(this.movement){
                    case "down":
                        spriteY = 0 * spriteHeight;
                        break;
                    case "left":
                        spriteY = 1 * spriteHeight;
                        break;
                    case "right":
                        spriteY = 1 * spriteHeight;
                        break;
                    case "up":
                        spriteY = 2 * spriteHeight;
                        break;
                }
                break;
        }
        spriteX = this.currentFrame * spriteWidth;
        ctx.save();
        if (this.movement === "left") {
            ctx.scale(-1, 1);
            ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, -this._position.x - this._width, this._position.y, (0, _settingsJs.canvasSettings).cellWidth, (0, _settingsJs.canvasSettings).cellHeight);
        } else ctx.drawImage(spriteSheet, spriteX, spriteY, spriteWidth, spriteHeight, this._position.x, this._position.y, (0, _settingsJs.canvasSettings).cellWidth, (0, _settingsJs.canvasSettings).cellHeight);
        ctx.restore();
    // this.drawBoundingBox(ctx);
    }
    drawBoundingBox(ctx) {
        // Hitbox
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(this._position.x + this._width * 0.25, this._position.y + this._height * 0.25, this._width * 0.5, this._height * 0.5);
        ctx.restore();
        ctx.save();
        // Pickup range
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.strokeRect(this._position.x, this._position.y, this._width, this._height);
        ctx.restore();
    }
}
exports.default = Player;

},{"./entity.js":"4kBdl","../utils/settings.js":"hBndc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4kBdl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _settingsJs = require("../utils/settings.js");
class Entity {
    _position;
    _width;
    _height;
    _sprites;
    _type;
    constructor(x, y, type, assets, width = (0, _settingsJs.canvasSettings).cellWidth, height = (0, _settingsJs.canvasSettings).cellHeight){
        this._position = {
            x,
            y
        };
        this._width = width;
        this._height = height;
        this._type = type;
        this._sprites = this.selectSprites(assets);
    }
    getPosition() {
        return {
            ...this._position
        };
    }
    setPosition(x, y) {
        this._position = {
            x,
            y
        };
    }
    getType() {
        return this._type;
    }
    getHitBox() {
        return {
            x: this._position.x,
            y: this._position.y,
            width: this._width,
            height: this._height
        };
    }
    selectSprites(assets) {
        // This method should be overridden by subclasses to select appropriate sprites
        return {};
    }
    update() {
    // Abstract method to be implemented by subclasses
    }
    draw(ctx) {
    // Abstract method to be implemented by subclasses
    }
}
exports.default = Entity;

},{"../utils/settings.js":"hBndc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"57eJ8":[function(require,module,exports) {
// Level data
// - Define the structure of each level (layout of the labyrinth)
// - Specify positions of obstacles, powerups, explosives, guards
// - Include metadata (level number, difficulty, etc.)
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class LevelData {
    constructor(){
        this.levels = [];
    }
    addLevel(level) {
        this.levels.push(level);
    }
    getLevel(levelNumber) {
        return this.levels[levelNumber - 1] || null;
    }
}
class Level {
    constructor(number, difficulty, layout, theme){
        this.number = number;
        this.difficulty = difficulty;
        this.layout = layout;
        this.theme = theme;
    }
}
// Example usage:
const levelData = new LevelData();
// Add levels
levelData.addLevel(new Level(1, "easy", [
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        "P",
        "T",
        " ",
        " ",
        " ",
        " ",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        " ",
        "#",
        "#",
        "#",
        " ",
        " ",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        "O",
        "#",
        "X",
        "#",
        " ",
        "C",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        "#",
        "#",
        " ",
        "#",
        " ",
        "G",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        " ",
        "C",
        "G",
        " ",
        "E",
        " ",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ],
    [
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T",
        "T"
    ]
]));
levelData.addLevel(new Level(2, "easy", [
    [
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#"
    ],
    [
        "#",
        "P",
        " ",
        " ",
        "#",
        "G",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#"
    ],
    [
        "#",
        " ",
        "#",
        " ",
        "#",
        " ",
        "#",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        " ",
        "#"
    ],
    [
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        " ",
        "#",
        "#",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#"
    ],
    [
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#"
    ],
    [
        "#",
        "X",
        " ",
        "G",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#"
    ],
    [
        "#",
        " ",
        "#",
        " ",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        "#",
        "G",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        "#"
    ],
    [
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#"
    ],
    [
        "#",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        "#"
    ],
    [
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#"
    ]
]));
levelData.addLevel(new Level(3, "medium", [
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "P",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        "#",
        "#",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        " ",
        "#",
        " ",
        "C",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "E",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        " ",
        "#",
        " ",
        "G",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "C",
        "G",
        " ",
        "E",
        " ",
        "X",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ]
]));
levelData.addLevel(new Level(4, "hard", [
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "P",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        "#",
        "#",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        " ",
        "#",
        " ",
        "C",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "E",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        " ",
        "#",
        " ",
        "G",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "C",
        "G",
        " ",
        "E",
        " ",
        "X",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ]
]));
levelData.addLevel(new Level(5, "expert", [
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "P",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        "#",
        "#",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "#",
        " ",
        "#",
        " ",
        "C",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "E",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        " ",
        "#",
        " ",
        "G",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        " ",
        "C",
        "G",
        " ",
        "E",
        " ",
        "X",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        "#",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ],
    [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ]
]));
exports.default = levelData;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"TkAKd":[function(require,module,exports) {
// helper functions for the canvas
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clearCanvas", ()=>clearCanvas);
parcelHelpers.export(exports, "clearContainer", ()=>clearContainer);
function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function clearContainer(container) {
    container.innerHTML = "";
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jBBaN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "isColliding", ()=>isColliding);
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7uRsi":[function(require,module,exports) {
// Seedable random number generator (mulberry32)
// - Drop-in replacement for Math.random so game runs can be reproduced
// - Pass ?seed=123 in the URL (used by automated tests) for deterministic runs
// - Without a seed the generator is seeded randomly, as before
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setSeed", ()=>setSeed);
// Returns a float in [0, 1), like Math.random
parcelHelpers.export(exports, "random", ()=>random);
// Returns an integer in [min, max] (inclusive)
parcelHelpers.export(exports, "randomInt", ()=>randomInt);
let state = 0;
function mulberry32() {
    state |= 0;
    state = state + 0x6d2b79f5 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function setSeed(seed) {
    state = seed | 0;
}
function random() {
    return mulberry32();
}
function randomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}
function initialSeed() {
    if (typeof window !== "undefined") {
        const seedParam = new URLSearchParams(window.location.search).get("seed");
        if (seedParam !== null && seedParam !== "" && !Number.isNaN(Number(seedParam))) return Number(seedParam);
    }
    return Math.floor(Math.random() * 2 ** 31);
}
setSeed(initialSeed());

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d9RxC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _settingsJs = require("../utils/settings.js");
// Wall entity class
// - Represents the walls in the game
// - Defines properties such as position, width, height
// - May include methods for rendering the wall
// - Could include collision detection logic specific to walls
// - Might have different types of walls (e.g., breakable, unbreakable)
// - Could include methods for special wall behaviors (e.g., secret passages)
class Wall extends (0, _entityJsDefault.default) {
    #type;
    constructor(x, y, type, assets){
        super(x, y);
        this.#type = type; // 'normal', 'breakable', 'secret'
        this._sprite = assets.rock;
    }
    getType() {
        return this.#type;
    }
    update() {
    // Update wall state if needed (e.g., for breakable walls)
    }
    draw(ctx) {
        const spriteX = 0;
        let spriteY = 0;
        // Select sprite based on wall type
        switch(this.#type){
            case "breakable":
                spriteY = (0, _settingsJs.canvasSettings).cellHeight;
                break;
            case "secret":
                spriteY = (0, _settingsJs.canvasSettings).cellHeight * 2;
                break;
            default:
                spriteY = 0;
        }
        ctx.drawImage(this._sprite, spriteX, spriteY, this._width, this._height, this._position.x, this._position.y, this._width, this._height);
    }
}
exports.default = Wall;

},{"./entity.js":"4kBdl","../utils/settings.js":"hBndc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"590U3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
// Explosive entity
// - Properties: position, isHidden (under obstacle), isActive
// - Methods: detonate (trigger explosion), checkCollision (with player)
// - Handle explosion effects (reduce player lives, visual effects)
class Explosive extends (0, _entityJsDefault.default) {
    #isHidden;
    #isActive;
    constructor(x, y, assets){
        super(x, y);
        this.#isHidden = true;
        this.#isActive = false;
        this._sprite = assets.explosiveSprite;
    }
    isHidden() {
        return this.#isHidden;
    }
    isActive() {
        return this.#isActive;
    }
    reveal() {
        this.#isHidden = false;
    }
    detonate() {
        this.#isActive = true;
        // Implement explosion logic here
        console.log("Explosive detonated!");
    }
    checkCollision(entity) {
    // Implement collision detection logic
    // Return true if colliding, false otherwise
    }
    update() {
    // Update explosive state if needed
    }
    draw(ctx) {
        if (!this.#isHidden) ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
    }
}
exports.default = Explosive;

},{"./entity.js":"4kBdl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bFjVQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _settingsJs = require("../utils/settings.js");
var _gameJs = require("../utils/game.js");
var _rngJs = require("../utils/rng.js");
// Guard entity class
// - Represents the guards in the game
// - Can move towards the player
// - Can detect the player's position
// - Can attack the player
// - Can be defeated by the player
// - Can drop powerups when defeated
// - Can drop explosives when defeated
// - Can drop keys when defeated
// - Can drop keys when defeated
class Guard extends (0, _entityJsDefault.default) {
    #speed;
    #detectionRange;
    #currentSprite;
    #health;
    constructor(x, y, type, assets){
        super(x, y, type, assets, (0, _settingsJs.entitySettings).enemyWidth, (0, _settingsJs.entitySettings).enemyHeight);
        this.action = "idle";
        this.movement = [
            "down",
            "up",
            "left",
            "right"
        ][(0, _rngJs.randomInt)(0, 3)];
        this.damage = 10;
        this.#health = 100;
        this.#speed = 1;
        this.#detectionRange = 5 * (0, _settingsJs.canvasSettings).cellWidth;
        this.#currentSprite = this._sprites.idle;
        this.frameCount = 0;
        this.currentFrame = 0;
    }
    selectSprites(assets) {
        return {
            attack: assets[`${this._type}_Attack`],
            death: assets[`${this._type}_Death`],
            hurt: assets[`${this._type}_Hurt`],
            idle: assets[`${this._type}_Idle`],
            run: assets[`${this._type}_Run`],
            runAttack: assets[`${this._type}_Run_Attack`],
            walk: assets[`${this._type}_Walk`],
            walkAttack: assets[`${this._type}_Walk_Attack`]
        };
    }
    moveTowards(target, walls) {
        const dx = target.x - this._position.x;
        const dy = target.y - this._position.y;
        // Determine primary direction
        if (Math.abs(dx) > Math.abs(dy)) this.movement = dx > 0 ? "right" : "left";
        else this.movement = dy > 0 ? "down" : "up";
        // Check if movement is possible (not blocked by a wall)
        const nextPosition = {
            ...this._position,
            width: (0, _settingsJs.canvasSettings).cellWidth / 2,
            height: (0, _settingsJs.canvasSettings).cellHeight / 2
        };
        switch(this.movement){
            case "up":
                nextPosition.y -= this.#speed;
                break;
            case "down":
                nextPosition.y += this.#speed;
                break;
            case "left":
                nextPosition.x -= this.#speed;
                break;
            case "right":
                nextPosition.x += this.#speed;
                break;
        }
        const willCollideWithWalls = walls.some((wall)=>(0, _gameJs.isColliding)(nextPosition, wall.getHitBox()));
        const willCollideWithPlayer = (0, _gameJs.isColliding)(nextPosition, target);
        if (willCollideWithPlayer) {
            // Determine guard's facing direction based on target position
            if (Math.abs(dx) > Math.abs(dy)) this.movement = dx > 0 ? "right" : "left";
            else this.movement = dy > 0 ? "down" : "up";
            this.attack();
        } else if (!willCollideWithWalls) {
            this._position = nextPosition;
            this.walk();
        } else this.idle();
    }
    detectPlayer(playerPosition, walls) {
        const dx = playerPosition.x - this._position.x;
        const dy = playerPosition.y - this._position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= this.#detectionRange) {
            // Check if there's a clear line of sight
            const step = {
                x: dx / distance,
                y: dy / distance
            };
            let checkPosition = {
                ...this._position,
                width: (0, _settingsJs.canvasSettings).cellWidth / 2,
                height: (0, _settingsJs.canvasSettings).cellHeight / 2
            };
            for(let i = 0; i < distance; i += (0, _settingsJs.canvasSettings).cellWidth / 2){
                checkPosition.x += step.x * ((0, _settingsJs.canvasSettings).cellWidth / 2);
                checkPosition.y += step.y * ((0, _settingsJs.canvasSettings).cellWidth / 2);
                if (walls.some((wall)=>(0, _gameJs.isColliding)(checkPosition, wall.getHitBox()))) return false; // Wall blocking the line of sight
            }
            return true; // Clear line of sight to the player
        }
        return false; // Player out of detection range
    }
    idle() {
        this.action = "idle";
        this.#currentSprite = this._sprites.idle;
    }
    walk() {
        this.action = "walk";
        this.#currentSprite = this._sprites.walk;
    }
    attack() {
        this.action = "attack";
        this.#currentSprite = this._sprites.attack;
    }
    hurt() {
        this.action = "hurt";
        this.#currentSprite = this._sprites.hurt;
    }
    // Apply damage from the player. Returns true when the guard is defeated.
    takeDamage(amount) {
        if (this.#health <= 0) return false;
        this.#health -= amount;
        if (this.#health <= 0) {
            this.defeat();
            return true;
        }
        this.hurt();
        return false;
    }
    isDefeated() {
        return this.#health <= 0;
    }
    defeat() {
        this.action = "dead";
        this.#currentSprite = this._sprites.death;
    // Return dropped items (powerups, explosives, keys)
    }
    lookAround() {
        this.action = "idle";
        this.#currentSprite = this._sprites.idle;
        const directions = [
            "up",
            "right",
            "down",
            "left"
        ];
        const currentIndex = directions.indexOf(this.movement);
        if (currentIndex !== -1) this.movement = directions[(currentIndex + 1) % 4];
        else this.movement = "up";
    }
    update(playerPosition, walls) {
        const frames_per_action = 4;
        const frames_per_look = 180; // Look around every 60 frames (about 1 second at 60 FPS)
        const max_frame_count = this.action === "idle" ? 180 : 20;
        this.frameCount++;
        if (this.frameCount >= max_frame_count) {
            this.frameCount = 0;
            this.currentFrame = (this.currentFrame + 1) % frames_per_action;
        }
        if (this.detectPlayer(playerPosition, walls)) this.moveTowards(playerPosition, walls);
        else if (this.frameCount % frames_per_look === 0) this.lookAround();
        else this.idle();
    }
    draw(ctx) {
        let spriteHeight = 64;
        let spriteWidth = 64;
        let spriteX = this.currentFrame * spriteWidth;
        let spriteY = 0;
        // Determine spriteY based on movement direction
        switch(this.movement){
            case "down":
                spriteY = 0 * spriteHeight;
                break;
            case "up":
                spriteY = 1 * spriteHeight;
                break;
            case "left":
                spriteY = 2 * spriteHeight;
                break;
            case "right":
                spriteY = 3 * spriteHeight;
                break;
        }
        ctx.drawImage(this.#currentSprite, spriteX, spriteY, spriteWidth, spriteHeight, this._position.x - 10, this._position.y - 10, this._width, this._height);
    }
}
exports.default = Guard;

},{"./entity.js":"4kBdl","../utils/settings.js":"hBndc","../utils/game.js":"jBBaN","../utils/rng.js":"7uRsi","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"14cf6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _rngJs = require("../utils/rng.js");
// Obstacle entity class
// - Represents the obstacles in the game
// - Can be destroyed by the player
// - Can drop powerups when destroyed
// - Can drop explosives when destroyed
// - Can drop keys when destroyed
// - Can drop keys when destroyed
class Obstacle extends (0, _entityJsDefault.default) {
    #health;
    constructor(x, y, type, assets){
        super(x, y, type, assets);
        this.#health = 100;
        if (type === "boulder") this._sprite = assets.rock;
        else if (type === "tree") {
            const randomTree = (0, _rngJs.randomInt)(1, 2);
            this._sprite = assets[`palm${randomTree}`];
        }
    }
    takeDamage(amount) {
        this.#health -= amount;
        if (this.#health <= 0) return this.destroy();
        return null;
    }
    isDestroyed() {
        return this.#health <= 0;
    }
    destroy() {
        // Implement destruction logic
        console.log("Obstacle destroyed!");
    // Return dropped items (powerups, explosives, keys)
    }
    update() {
    // Update obstacle state if needed
    }
    draw(ctx) {
        if (this.#health > 0) ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
    }
}
exports.default = Obstacle;

},{"./entity.js":"4kBdl","../utils/rng.js":"7uRsi","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7DUBa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
// Powerup entity class
// - Represents the powerups in the game
// - Can be collected by the player
// - Can be dropped by guards
// - Can be dropped by obstacles
// - Properties: position, type, collected
// - Methods: collect (mark as collected), update, draw
class Powerup extends (0, _entityJsDefault.default) {
    #collected;
    constructor(x, y, type, assets){
        super(x, y, type, assets);
        this.#collected = false;
    }
    selectSprites(assets) {
        switch(this._type){
            case "health":
                return {
                    crystal: assets.redCrystal
                };
            case "speed":
                return {
                    crystal: assets.blueCrystal
                };
            case "strength":
                return {
                    crystal: assets.greenCrystal
                };
            case "invincibility":
                return {
                    crystal: assets.yellowCrystal
                };
            default:
                return {
                    crystal: assets.blueCrystal
                };
        }
    }
    collect() {
        if (!this.#collected) {
            this.#collected = true;
            return this._type;
        }
        return null;
    }
    // ... rest of the Powerup class methods ...
    draw(ctx) {
        if (!this.#collected) ctx.drawImage(this._sprites.crystal, this._position.x, this._position.y, this._width, this._height);
    }
}
exports.default = Powerup;

},{"./entity.js":"4kBdl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lIWLe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _rngJs = require("../utils/rng.js");
// Exit entity class
// - Represents the exit in the game
// - Can be collected by the player
// - Properties: position
// - Methods: collect (mark as collected), update, draw
class Exit extends (0, _entityJsDefault.default) {
    constructor(x, y, assets){
        super(x, y, "exit", assets);
        this._sprite = assets.yellowRuin;
        this._sparkles = this._createSparkles();
    }
    _createSparkles() {
        const sparkleCount = 20;
        const sparkles = [];
        for(let i = 0; i < sparkleCount; i++)sparkles.push({
            x: this._position.x + (0, _rngJs.random)() * this._width,
            y: this._position.y + (0, _rngJs.random)() * this._height,
            vy: -0.5 + (0, _rngJs.random)() * 0.5 // vertical velocity
        });
        return sparkles;
    }
    _updateSparkles() {
        for (const sparkle of this._sparkles){
            sparkle.y += sparkle.vy;
            if (sparkle.y < this._position.y) sparkle.y = this._position.y + this._height;
        }
    }
    draw(ctx) {
        // Draw a semi-transparent dark rectangle over the current cell
        // Create a radial gradient
        const gradient = ctx.createRadialGradient(this._position.x + this._width / 2, this._position.y + this._height / 2, 0, this._position.x + this._width / 2, this._position.y + this._height / 2, Math.max(this._width, this._height) / 2);
        gradient.addColorStop(0, "rgba(255, 255, 200, 0.5)"); // Lighter in the middle
        gradient.addColorStop(1, "rgba(255, 255, 200, 0.1)"); // Darker at the edges
        ctx.fillStyle = gradient;
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
        // Draw the exit sprite
        ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
        // Update and draw sparkles
        this._updateSparkles();
        const sparkleSize = 1;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (const sparkle of this._sparkles){
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
exports.default = Exit;

},{"./entity.js":"4kBdl","../utils/rng.js":"7uRsi","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2MtDO":[function(require,module,exports) {
// handle the assets
// Load player sprite sheets
// Load enemy sprite sheets
// Load powerup sprite sheets
// Load explosive sprite sheets
// Load guard sprite sheets
// Load obstacle images
// NOTE: asset URLs must be written inline as `new URL('literal', import.meta.url)`.
// Parcel only bundles the referenced file when the first argument is a string
// literal at the call site. Wrapping it in a helper (variable argument) defeats
// static analysis, leaving an unbundled `file://` path that the browser blocks.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "loadPlayerAssets", ()=>loadPlayerAssets);
parcelHelpers.export(exports, "loadGuardAssets", ()=>loadGuardAssets);
parcelHelpers.export(exports, "loadLevelAssets", ()=>loadLevelAssets);
parcelHelpers.export(exports, "loadPowerUpsAssets", ()=>loadPowerUpsAssets);
function loadImage(src, onProgress) {
    return new Promise((resolve, reject)=>{
        try {
            const img = new Image();
            img.src = src;
            img.onload = ()=>{
                onProgress(src, img);
                resolve(img);
            };
            img.onerror = (error)=>{
                console.error("Error loading image:", src, error);
                reject(new Error(`Failed to load image: ${src}`));
            };
        } catch (error) {
            console.error("Error loading image:", src, error);
            reject(new Error(`Unexpected error loading image: ${src}`));
        }
    });
}
async function loadPlayerAssets(onProgress) {
    console.log("Loading player assets...");
    const playerMovement = await loadImage(new URL(require("93fa132a23469ad3")).href, onProgress);
    const playerActions = await loadImage(new URL(require("24d061bc9070758b")).href, onProgress);
    return {
        playerMovement,
        playerActions
    };
}
async function loadGuardAssets(onProgress) {
    console.log("Loading guard assets...");
    // ORC 1
    const orc1_Attack = await loadImage(new URL(require("da839ad1c17fe6f0")).href, onProgress);
    const orc1_Death = await loadImage(new URL(require("e0bc205cb3c5c0bf")).href, onProgress);
    const orc1_Hurt = await loadImage(new URL(require("9fcd0329138ebc13")).href, onProgress);
    const orc1_Idle = await loadImage(new URL(require("fff618a47255eb1a")).href, onProgress);
    const orc1_Run = await loadImage(new URL(require("9f26a3e4a159b554")).href, onProgress);
    const orc1_Run_Attack = await loadImage(new URL(require("2222dfe21f9016a6")).href, onProgress);
    const orc1_Walk = await loadImage(new URL(require("37fab219c2e3438d")).href, onProgress);
    const orc1_Walk_Attack = await loadImage(new URL(require("297e02e827843629")).href, onProgress);
    // ORC 2
    const orc2_Attack = await loadImage(new URL(require("6c2f82508ca9a3bb")).href, onProgress);
    const orc2_Death = await loadImage(new URL(require("47ee9c0f63ff8828")).href, onProgress);
    const orc2_Hurt = await loadImage(new URL(require("4b946ae5fc174647")).href, onProgress);
    const orc2_Idle = await loadImage(new URL(require("301431c8769f658")).href, onProgress);
    const orc2_Run = await loadImage(new URL(require("f462afe302c8f41b")).href, onProgress);
    const orc2_Run_Attack = await loadImage(new URL(require("cd1068d2a2c15560")).href, onProgress);
    const orc2_Walk = await loadImage(new URL(require("37ea3b9efefea7e6")).href, onProgress);
    const orc2_Walk_Attack = await loadImage(new URL(require("f524f9f30597b7c3")).href, onProgress);
    // ORC 3
    const orc3_Attack = await loadImage(new URL(require("4af006d8495d5804")).href, onProgress);
    const orc3_Death = await loadImage(new URL(require("4bfabeb171e83a78")).href, onProgress);
    const orc3_Hurt = await loadImage(new URL(require("a88858287bda9b00")).href, onProgress);
    const orc3_Idle = await loadImage(new URL(require("8aa376bb259420aa")).href, onProgress);
    const orc3_Run = await loadImage(new URL(require("f060f8a5fdaac71f")).href, onProgress);
    const orc3_Run_Attack = await loadImage(new URL(require("1926d3b5d1463658")).href, onProgress);
    const orc3_Walk = await loadImage(new URL(require("798831562a8c99b4")).href, onProgress);
    const orc3_Walk_Attack = await loadImage(new URL(require("d7a60630e255c457")).href, onProgress);
    return {
        orc1_Attack,
        orc1_Death,
        orc1_Hurt,
        orc1_Idle,
        orc1_Run,
        orc1_Run_Attack,
        orc1_Walk,
        orc1_Walk_Attack,
        orc2_Attack,
        orc2_Death,
        orc2_Hurt,
        orc2_Idle,
        orc2_Run,
        orc2_Run_Attack,
        orc2_Walk,
        orc2_Walk_Attack,
        orc3_Attack,
        orc3_Death,
        orc3_Hurt,
        orc3_Idle,
        orc3_Run,
        orc3_Run_Attack,
        orc3_Walk,
        orc3_Walk_Attack
    };
}
async function loadLevelAssets(onProgress) {
    console.log("Loading level assets...");
    const rock = await loadImage(new URL(require("1090cc123f927509")).href, onProgress);
    const tree1 = await loadImage(new URL(require("3f5ed577d5909e0d")).href, onProgress);
    const tree2 = await loadImage(new URL(require("58ff784648728cf8")).href, onProgress);
    const tree3 = await loadImage(new URL(require("6d9a56da4d55f52c")).href, onProgress);
    const palm1 = await loadImage(new URL(require("693e9f0751fa86d2")).href, onProgress);
    const palm2 = await loadImage(new URL(require("bc4f5cc8883c7693")).href, onProgress);
    const sandRuin = await loadImage(new URL(require("80e7c00fdd98ae89")).href, onProgress);
    const snowRuin = await loadImage(new URL(require("a7b3d39a650d1b88")).href, onProgress);
    const yellowRuin = await loadImage(new URL(require("d558afb41645e81d")).href, onProgress);
    return {
        rock,
        tree1,
        tree2,
        tree3,
        palm1,
        palm2,
        sandRuin,
        snowRuin,
        yellowRuin
    };
}
async function loadPowerUpsAssets(onProgress) {
    console.log("Loading powerups assets...");
    const greenCrystal = await loadImage(new URL(require("3d27847b46809984")).href, onProgress);
    const redCrystal = await loadImage(new URL(require("d64a48fa1826a640")).href, onProgress);
    const blueCrystal = await loadImage(new URL(require("66d083ceb4ac7a4e")).href, onProgress);
    const yellowCrystal = await loadImage(new URL(require("9ae2d2d58e4ae0ee")).href, onProgress);
    return {
        greenCrystal,
        redCrystal,
        blueCrystal,
        yellowCrystal
    };
}

},{"93fa132a23469ad3":"b9nou","24d061bc9070758b":"kYVSU","da839ad1c17fe6f0":"fncWE","e0bc205cb3c5c0bf":"2LeDo","9fcd0329138ebc13":"aZY6N","fff618a47255eb1a":"4gAdv","9f26a3e4a159b554":"2cwK4","2222dfe21f9016a6":"knb3E","37fab219c2e3438d":"eGy9D","297e02e827843629":"54hki","6c2f82508ca9a3bb":"d6fML","47ee9c0f63ff8828":"cquXn","4b946ae5fc174647":"4rHea","301431c8769f658":"8MUvf","f462afe302c8f41b":"lTjNI","cd1068d2a2c15560":"jY0H7","37ea3b9efefea7e6":"aWofU","f524f9f30597b7c3":"afDNE","4af006d8495d5804":"he3z7","4bfabeb171e83a78":"9fl4N","a88858287bda9b00":"dNbts","8aa376bb259420aa":"i9DT0","f060f8a5fdaac71f":"fG8bj","1926d3b5d1463658":"5MSBS","798831562a8c99b4":"fzXLE","d7a60630e255c457":"bMo3R","1090cc123f927509":"3Ukfr","3f5ed577d5909e0d":"iXpK1","58ff784648728cf8":"cwnaC","6d9a56da4d55f52c":"jXnPG","693e9f0751fa86d2":"1fs7o","bc4f5cc8883c7693":"i7jn0","80e7c00fdd98ae89":"lQQEY","a7b3d39a650d1b88":"jkJ9x","d558afb41645e81d":"jyGU7","3d27847b46809984":"kAqHG","d64a48fa1826a640":"gWXxV","66d083ceb4ac7a4e":"aYPiB","9ae2d2d58e4ae0ee":"9uNQt","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"b9nou":[function(require,module,exports) {
module.exports = require("59afba6ea444a216").getBundleURL("aAnGP") + "Player.89df9642.png" + "?" + Date.now();

},{"59afba6ea444a216":"lgJ39"}],"lgJ39":[function(require,module,exports) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ("" + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return "/";
}
function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, "$1") + "/";
}
// TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ("" + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error("Origin not found");
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"kYVSU":[function(require,module,exports) {
module.exports = require("b530c5f1e0795902").getBundleURL("aAnGP") + "Player_Actions.640ec72d.png" + "?" + Date.now();

},{"b530c5f1e0795902":"lgJ39"}],"fncWE":[function(require,module,exports) {
module.exports = require("7bebed16121566e2").getBundleURL("aAnGP") + "orc1_attack_full.34377da9.png" + "?" + Date.now();

},{"7bebed16121566e2":"lgJ39"}],"2LeDo":[function(require,module,exports) {
module.exports = require("84fb28ca811647f").getBundleURL("aAnGP") + "orc1_death_full.416a7e96.png" + "?" + Date.now();

},{"84fb28ca811647f":"lgJ39"}],"aZY6N":[function(require,module,exports) {
module.exports = require("5a1772f193e9e94e").getBundleURL("aAnGP") + "orc1_hurt_full.07b11101.png" + "?" + Date.now();

},{"5a1772f193e9e94e":"lgJ39"}],"4gAdv":[function(require,module,exports) {
module.exports = require("8916b60356e9f109").getBundleURL("aAnGP") + "orc1_idle_full.1e8cad53.png" + "?" + Date.now();

},{"8916b60356e9f109":"lgJ39"}],"2cwK4":[function(require,module,exports) {
module.exports = require("2a7a5848b1fbd23c").getBundleURL("aAnGP") + "orc1_run_full.3ed1c471.png" + "?" + Date.now();

},{"2a7a5848b1fbd23c":"lgJ39"}],"knb3E":[function(require,module,exports) {
module.exports = require("fc3c84290219b322").getBundleURL("aAnGP") + "orc1_run_attack_front_full.637aaa3d.png" + "?" + Date.now();

},{"fc3c84290219b322":"lgJ39"}],"eGy9D":[function(require,module,exports) {
module.exports = require("23fb3b55dc999612").getBundleURL("aAnGP") + "orc1_walk_full.7327abd8.png" + "?" + Date.now();

},{"23fb3b55dc999612":"lgJ39"}],"54hki":[function(require,module,exports) {
module.exports = require("c37c4d0419d8c36e").getBundleURL("aAnGP") + "orc1_walk_attack_front_full.26d7ffca.png" + "?" + Date.now();

},{"c37c4d0419d8c36e":"lgJ39"}],"d6fML":[function(require,module,exports) {
module.exports = require("997aed43d61de1c4").getBundleURL("aAnGP") + "orc2_attack_full.5d55d5be.png" + "?" + Date.now();

},{"997aed43d61de1c4":"lgJ39"}],"cquXn":[function(require,module,exports) {
module.exports = require("f3f94ed1f1dda05").getBundleURL("aAnGP") + "orc2_death_full.71c106fc.png" + "?" + Date.now();

},{"f3f94ed1f1dda05":"lgJ39"}],"4rHea":[function(require,module,exports) {
module.exports = require("63366ed6b54d4861").getBundleURL("aAnGP") + "orc2_hurt_full.6883191c.png" + "?" + Date.now();

},{"63366ed6b54d4861":"lgJ39"}],"8MUvf":[function(require,module,exports) {
module.exports = require("41a871a655c7d0e5").getBundleURL("aAnGP") + "orc2_idle_full.10649502.png" + "?" + Date.now();

},{"41a871a655c7d0e5":"lgJ39"}],"lTjNI":[function(require,module,exports) {
module.exports = require("308fd37f428b7bb9").getBundleURL("aAnGP") + "orc2_run_full.d549ca5a.png" + "?" + Date.now();

},{"308fd37f428b7bb9":"lgJ39"}],"jY0H7":[function(require,module,exports) {
module.exports = require("bbef9922df28b32a").getBundleURL("aAnGP") + "orc2_run_attack_full.adf2fe89.png" + "?" + Date.now();

},{"bbef9922df28b32a":"lgJ39"}],"aWofU":[function(require,module,exports) {
module.exports = require("f5d6110a9506bb61").getBundleURL("aAnGP") + "orc2_walk_full.5b172897.png" + "?" + Date.now();

},{"f5d6110a9506bb61":"lgJ39"}],"afDNE":[function(require,module,exports) {
module.exports = require("ea7aa875f42242d4").getBundleURL("aAnGP") + "orc2_walk_attack_full.32a7b7fd.png" + "?" + Date.now();

},{"ea7aa875f42242d4":"lgJ39"}],"he3z7":[function(require,module,exports) {
module.exports = require("e5e14d289bfdabd0").getBundleURL("aAnGP") + "orc3_attack_full.3880e5cd.png" + "?" + Date.now();

},{"e5e14d289bfdabd0":"lgJ39"}],"9fl4N":[function(require,module,exports) {
module.exports = require("f3fe2338f0fce651").getBundleURL("aAnGP") + "orc3_death_full.8891ac64.png" + "?" + Date.now();

},{"f3fe2338f0fce651":"lgJ39"}],"dNbts":[function(require,module,exports) {
module.exports = require("17e5c844da74082").getBundleURL("aAnGP") + "orc3_hurt_full.b0d56607.png" + "?" + Date.now();

},{"17e5c844da74082":"lgJ39"}],"i9DT0":[function(require,module,exports) {
module.exports = require("cf8aece6cc75c3ed").getBundleURL("aAnGP") + "orc3_idle_full.a7d1fdf6.png" + "?" + Date.now();

},{"cf8aece6cc75c3ed":"lgJ39"}],"fG8bj":[function(require,module,exports) {
module.exports = require("b4f1024050032737").getBundleURL("aAnGP") + "orc3_run_full.5d7f6900.png" + "?" + Date.now();

},{"b4f1024050032737":"lgJ39"}],"5MSBS":[function(require,module,exports) {
module.exports = require("cd2d46b823c9fc2b").getBundleURL("aAnGP") + "orc3_run_attack_full.86d6c3fa.png" + "?" + Date.now();

},{"cd2d46b823c9fc2b":"lgJ39"}],"fzXLE":[function(require,module,exports) {
module.exports = require("35425eb199dd73d6").getBundleURL("aAnGP") + "orc3_walk_full.3e4b1c96.png" + "?" + Date.now();

},{"35425eb199dd73d6":"lgJ39"}],"bMo3R":[function(require,module,exports) {
module.exports = require("4789fa1a7eb3f7ec").getBundleURL("aAnGP") + "orc3_walk_attack_full.46776ad5.png" + "?" + Date.now();

},{"4789fa1a7eb3f7ec":"lgJ39"}],"3Ukfr":[function(require,module,exports) {
module.exports = require("b5aa8aaf9302a118").getBundleURL("aAnGP") + "Rock6_1.7bba883a.png" + "?" + Date.now();

},{"b5aa8aaf9302a118":"lgJ39"}],"iXpK1":[function(require,module,exports) {
module.exports = require("25a52dc75a382c0e").getBundleURL("aAnGP") + "Tree1.e05f2c99.png" + "?" + Date.now();

},{"25a52dc75a382c0e":"lgJ39"}],"cwnaC":[function(require,module,exports) {
module.exports = require("4b73380b0412dfef").getBundleURL("aAnGP") + "Tree2.a46fb43d.png" + "?" + Date.now();

},{"4b73380b0412dfef":"lgJ39"}],"jXnPG":[function(require,module,exports) {
module.exports = require("83da82ef92c92fbc").getBundleURL("aAnGP") + "Tree3.826af1fd.png" + "?" + Date.now();

},{"83da82ef92c92fbc":"lgJ39"}],"1fs7o":[function(require,module,exports) {
module.exports = require("c847ba28193751af").getBundleURL("aAnGP") + "Palm_tree1_2.405e5051.png" + "?" + Date.now();

},{"c847ba28193751af":"lgJ39"}],"i7jn0":[function(require,module,exports) {
module.exports = require("84aac258d2873666").getBundleURL("aAnGP") + "Palm_tree2_2.2dae9864.png" + "?" + Date.now();

},{"84aac258d2873666":"lgJ39"}],"lQQEY":[function(require,module,exports) {
module.exports = require("5a2d54e811bdc200").getBundleURL("aAnGP") + "Sand_ruins3.1f0a3c59.png" + "?" + Date.now();

},{"5a2d54e811bdc200":"lgJ39"}],"jkJ9x":[function(require,module,exports) {
module.exports = require("d7584db4a4d9b947").getBundleURL("aAnGP") + "Snow_ruins3.0b4f0802.png" + "?" + Date.now();

},{"d7584db4a4d9b947":"lgJ39"}],"jyGU7":[function(require,module,exports) {
module.exports = require("79a6f32243245a3e").getBundleURL("aAnGP") + "Yellow_ruins3.e4eb5c38.png" + "?" + Date.now();

},{"79a6f32243245a3e":"lgJ39"}],"kAqHG":[function(require,module,exports) {
module.exports = require("f6b1d88be3588622").getBundleURL("aAnGP") + "Green_crystal2.18620c22.png" + "?" + Date.now();

},{"f6b1d88be3588622":"lgJ39"}],"gWXxV":[function(require,module,exports) {
module.exports = require("de3274c789035aa").getBundleURL("aAnGP") + "Red_crystal2.bbb9761d.png" + "?" + Date.now();

},{"de3274c789035aa":"lgJ39"}],"aYPiB":[function(require,module,exports) {
module.exports = require("ca884f5db4bf1cf2").getBundleURL("aAnGP") + "Blue_crystal2.33de1225.png" + "?" + Date.now();

},{"ca884f5db4bf1cf2":"lgJ39"}],"9uNQt":[function(require,module,exports) {
module.exports = require("b88e1a35592b6077").getBundleURL("aAnGP") + "Yellow_crystal2.0ed15310.png" + "?" + Date.now();

},{"b88e1a35592b6077":"lgJ39"}],"kNfRL":[function(require,module,exports) {
// Splash screen
// - Display game logo or animation
// - Briefly show before transitioning to the welcome screen
// - Style: background color, logo/animation size and position
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showSplashScreen", ()=>showSplashScreen);
parcelHelpers.export(exports, "updateSplashScreenProgress", ()=>updateSplashScreenProgress);
function showSplashScreen(initialise, onComplete) {
    const splashScreen = document.createElement("div");
    splashScreen.id = "splash-screen";
    splashScreen.style.position = "absolute";
    splashScreen.style.top = "0";
    splashScreen.style.left = "0";
    splashScreen.style.width = "100%";
    splashScreen.style.height = "100%";
    splashScreen.style.backgroundColor = "#000";
    splashScreen.style.display = "flex";
    splashScreen.style.justifyContent = "center";
    splashScreen.style.alignItems = "center";
    splashScreen.style.color = "#fff";
    splashScreen.style.fontSize = "24px";
    splashScreen.innerText = "Loading... 0%";
    document.body.appendChild(splashScreen);
    initialise().then(()=>{
        onComplete();
        document.body.removeChild(splashScreen);
    }).catch((error)=>{
        console.error("Failed to initialize game:", error);
        splashScreen.innerText = "Failed to load game. Please refresh the page.";
    });
}
function updateSplashScreenProgress(progress) {
    console.log("Updating splash screen progress:", progress);
    const splashScreen = document.getElementById("splash-screen");
    if (splashScreen) splashScreen.innerText = `Loading... ${progress}%`;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2Rkrn":[function(require,module,exports) {
// handle the screens
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showWelcomeScreen", ()=>(0, _welcomeJs.showWelcomeScreen));
parcelHelpers.export(exports, "showGameOverScreen", ()=>(0, _gameOverJs.showGameOverScreen));
parcelHelpers.export(exports, "showGameWonScreen", ()=>(0, _gameWonJs.showGameWonScreen));
parcelHelpers.export(exports, "showHighScoreScreen", ()=>(0, _highScoreJs.showHighScoreScreen));
parcelHelpers.export(exports, "showLevelCompletedScreen", ()=>(0, _levelCompletedJs.showLevelCompletedScreen));
parcelHelpers.export(exports, "showStoryScreen", ()=>(0, _storyJs.showStoryScreen));
var _welcomeJs = require("./welcome.js");
var _gameOverJs = require("./game-over.js");
var _gameWonJs = require("./game-won.js");
var _highScoreJs = require("./high-score.js");
var _levelCompletedJs = require("./level-completed.js");
var _storyJs = require("./story.js");

},{"./welcome.js":"cZkQX","./game-over.js":"92Yef","./game-won.js":"12l5K","./high-score.js":"4usRq","./level-completed.js":"9FY8c","./story.js":"2HIwu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cZkQX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Welcome screen logic
// - Display game title
// - Provide buttons to start the game, view high scores, and adjust sound settings
// - Style: background color, text color, font size, button styles
// - Include sound control (mute/unmute button)
parcelHelpers.export(exports, "showWelcomeScreen", ()=>showWelcomeScreen);
var _themeJs = require("../utils/theme.js");
function showWelcomeScreen(onStartGame, onContinueGame, onViewHighScores, onExit, onStory) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const welcomeScreen = document.createElement("div");
    welcomeScreen.id = "welcome-screen";
    const title = document.createElement("h1");
    title.textContent = "Welcome to Wandertrap!";
    title.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
    title.style.background = "linear-gradient(45deg, #FFD700, #FFA500)";
    title.style.WebkitBackgroundClip = "text";
    title.style.WebkitTextFillColor = "transparent";
    title.style.display = "inline-block";
    welcomeScreen.appendChild(title);
    const subtitle = document.createElement("h2");
    subtitle.textContent = "Theo got lost...";
    subtitle.style.color = (0, _themeJs.theme).colors.primary;
    subtitle.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    subtitle.style.fontFamily = (0, _themeJs.theme).fonts.subtitle;
    subtitle.style.marginBottom = "30px";
    welcomeScreen.appendChild(subtitle);
    if (onContinueGame) {
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.onclick = onContinueGame;
        welcomeScreen.appendChild(continueButton);
        (0, _themeJs.styleButton)(continueButton, (0, _themeJs.theme).colors.secondary);
    }
    const startButton = document.createElement("button");
    startButton.textContent = "New Game";
    startButton.onclick = onStartGame;
    welcomeScreen.appendChild(startButton);
    const storyButton = document.createElement("button");
    storyButton.textContent = "Story";
    storyButton.onclick = onStory;
    welcomeScreen.appendChild(storyButton);
    (0, _themeJs.styleButton)(storyButton, (0, _themeJs.theme).colors.primary);
    const highScoresButton = document.createElement("button");
    highScoresButton.textContent = "High Scores";
    highScoresButton.onclick = onViewHighScores;
    welcomeScreen.appendChild(highScoresButton);
    const exitButton = document.createElement("button");
    exitButton.textContent = "Exit";
    exitButton.onclick = onExit;
    welcomeScreen.appendChild(exitButton);
    container.appendChild(welcomeScreen);
    // Apply styles
    (0, _themeJs.applyContainerStyles)(container);
    title.style.fontSize = (0, _themeJs.theme).fontSize.title;
    title.style.marginBottom = "20px";
    (0, _themeJs.styleButton)(startButton);
    (0, _themeJs.styleButton)(highScoresButton);
    (0, _themeJs.styleButton)(exitButton);
}

},{"../utils/theme.js":"6OzmZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6OzmZ":[function(require,module,exports) {
// Theme configuration for the game
// This file contains styles and colors used across different screens
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "theme", ()=>theme);
// Helper function to apply common styles to a container
parcelHelpers.export(exports, "applyContainerStyles", ()=>applyContainerStyles);
// Helper function to style a button
parcelHelpers.export(exports, "styleButton", ()=>styleButton);
const theme = {
    colors: {
        background: "#1a0d00",
        text: "#d4af37",
        primary: "#8B4513",
        secondary: "#2e8b57",
        accent: "#ff4500"
    },
    fonts: {
        main: '"Luminari", "Papyrus", fantasy',
        subtitle: '"Arial", sans-serif'
    },
    fontSize: {
        title: "52px",
        subtitle: "28px",
        button: "24px"
    },
    spacing: {
        padding: "25px"
    },
    button: {
        minWidth: "265px",
        padding: "15px 35px",
        borderRadius: "4px"
    }
};
function applyContainerStyles(container) {
    container.style.backgroundColor = theme.colors.background;
    container.style.color = theme.colors.text;
    container.style.fontFamily = theme.fonts.main;
    container.style.textAlign = "center";
    container.style.padding = theme.spacing.padding;
}
function styleButton(button, color = theme.colors.primary) {
    button.style.display = "block";
    button.style.margin = "20px auto";
    button.style.padding = theme.button.padding;
    button.style.fontSize = theme.fontSize.button;
    button.style.cursor = "pointer";
    button.style.backgroundColor = color;
    button.style.color = theme.colors.text;
    button.style.border = "2px solid " + theme.colors.text;
    button.style.borderRadius = theme.button.borderRadius;
    button.style.textTransform = "uppercase";
    button.style.letterSpacing = "2px";
    button.style.boxShadow = "0 0 10px rgba(212, 175, 55, 0.5)";
    button.style.transition = "all 0.3s ease";
    button.style.minWidth = theme.button.minWidth;
    // Add hover effect
    button.addEventListener("mouseover", ()=>{
        button.style.transform = "scale(1.1)";
    });
    button.addEventListener("mouseout", ()=>{
        button.style.transform = "scale(1)";
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"92Yef":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Game Over screen
// - Display "Game Over" message
// - Show final score
// - Provide options to restart the game or go to the high score screen
// - Style: background color, text color, font size, button styles
parcelHelpers.export(exports, "showGameOverScreen", ()=>showGameOverScreen);
var _themeJs = require("../utils/theme.js");
function showGameOverScreen(finalScore, onTryAgain, onMainMenu) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "game-over-screen";
    const title = document.createElement("h1");
    title.textContent = "Game Over";
    gameOverScreen.appendChild(title);
    const message = document.createElement("p");
    message.textContent = "Theo ran out of lives. Better luck next time!";
    gameOverScreen.appendChild(message);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Your Score: ${finalScore}`;
    gameOverScreen.appendChild(scoreDisplay);
    const tryAgainButton = document.createElement("button");
    tryAgainButton.textContent = "Try Again";
    tryAgainButton.onclick = onTryAgain;
    gameOverScreen.appendChild(tryAgainButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = onMainMenu;
    gameOverScreen.appendChild(mainMenuButton);
    container.appendChild(gameOverScreen);
    // Apply styles
    (0, _themeJs.applyContainerStyles)(container);
    title.style.fontSize = (0, _themeJs.theme).fontSize.title;
    title.style.marginBottom = "20px";
    message.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    message.style.marginBottom = "20px";
    scoreDisplay.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    (0, _themeJs.styleButton)(tryAgainButton, (0, _themeJs.theme).colors.primary);
    (0, _themeJs.styleButton)(mainMenuButton, (0, _themeJs.theme).colors.secondary);
}

},{"../utils/theme.js":"6OzmZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"12l5K":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Game Won screen
// - Shown when the player clears the final level
// - Displays the final score and options to play again or return to the menu
parcelHelpers.export(exports, "showGameWonScreen", ()=>showGameWonScreen);
var _themeJs = require("../utils/theme.js");
function showGameWonScreen(finalScore, onPlayAgain, onMainMenu) {
    const container = document.getElementById("game-container");
    container.innerHTML = "";
    const gameWonScreen = document.createElement("div");
    gameWonScreen.id = "game-won-screen";
    const title = document.createElement("h1");
    title.textContent = "You Escaped the Wandertrap!";
    gameWonScreen.appendChild(title);
    const message = document.createElement("p");
    message.textContent = "Theo found his way out. Well played!";
    gameWonScreen.appendChild(message);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Final Score: ${finalScore}`;
    gameWonScreen.appendChild(scoreDisplay);
    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.onclick = onPlayAgain;
    gameWonScreen.appendChild(playAgainButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = onMainMenu;
    gameWonScreen.appendChild(mainMenuButton);
    container.appendChild(gameWonScreen);
    (0, _themeJs.applyContainerStyles)(container);
    title.style.fontSize = (0, _themeJs.theme).fontSize.title;
    title.style.marginBottom = "20px";
    message.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    message.style.marginBottom = "20px";
    scoreDisplay.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    (0, _themeJs.styleButton)(playAgainButton, (0, _themeJs.theme).colors.accent);
    (0, _themeJs.styleButton)(mainMenuButton, (0, _themeJs.theme).colors.secondary);
}

},{"../utils/theme.js":"6OzmZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4usRq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showHighScoreScreen", ()=>showHighScoreScreen);
var _themeJs = require("../utils/theme.js");
var _dateJs = require("../utils/date.js");
// High Score screen
// - Display list of high scores
// - Allow player to enter their name if they achieved a high score
// - Provide options to return to the welcome screen or start a new game
// - Style: background color, text color, font size, list styles, button styles
const highScores = [
    {
        name: "Player1",
        score: 1000,
        timestamp: "2023-10-01 10:00"
    },
    {
        name: "Player2",
        score: 900,
        timestamp: "2023-10-02 11:00"
    },
    {
        name: "Player3",
        score: 800,
        timestamp: "2023-10-03 12:00"
    },
    {
        name: "Player4",
        score: 700,
        timestamp: "2023-10-04 13:00"
    },
    {
        name: "Player5",
        score: 600,
        timestamp: "2023-10-05 14:00"
    },
    {
        name: "Player6",
        score: 500,
        timestamp: "2023-10-06 15:00"
    },
    {
        name: "Player7",
        score: 400,
        timestamp: "2023-10-07 16:00"
    },
    {
        name: "Player8",
        score: 300,
        timestamp: "2023-10-08 17:00"
    },
    {
        name: "Player9",
        score: 200,
        timestamp: "2023-10-09 18:00"
    },
    {
        name: "Player10",
        score: 100,
        timestamp: "2023-10-10 19:00"
    }
];
function showHighScoreScreen(onBack) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const highScoreScreen = document.createElement("div");
    highScoreScreen.id = "high-score-screen";
    const title = document.createElement("h1");
    title.textContent = "High Scores";
    highScoreScreen.appendChild(title);
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = [
        "Name",
        "Score",
        "Timestamp"
    ];
    headers.forEach((headerText)=>{
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    highScores.forEach((score)=>{
        const row = document.createElement("tr");
        Object.values(score).forEach((text, index)=>{
            const cell = document.createElement("td");
            if (index === 2) cell.textContent = (0, _dateJs.timeAgo)(text);
            else cell.textContent = text;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    highScoreScreen.appendChild(table);
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.onclick = onBack;
    highScoreScreen.appendChild(backButton);
    container.appendChild(highScoreScreen);
    // Apply styles
    (0, _themeJs.applyContainerStyles)(container);
    title.style.fontSize = (0, _themeJs.theme).fontSize.title;
    title.style.marginBottom = "20px";
    title.style.color = (0, _themeJs.theme).colors.primary;
    table.style.margin = "20px auto";
    table.style.borderRadius = "10px";
    table.style.borderCollapse = "collapse";
    table.style.width = "80%";
    table.style.backgroundColor = (0, _themeJs.theme).colors.background;
    table.style.color = (0, _themeJs.theme).colors.text;
    const trs = table.querySelectorAll("tr");
    trs.forEach((tr, index)=>{
        if (index === 0) {
            tr.style.borderTopLeftRadius = "10px";
            tr.style.borderTopRightRadius = "10px";
        }
    });
    const ths = table.querySelectorAll("th");
    ths.forEach((th)=>{
        th.style.border = `1px solid ${(0, _themeJs.theme).colors.primary}`;
        // th.style.borderRadius = `10px 10px 0 0`;
        th.style.padding = "12px";
        th.style.backgroundColor = (0, _themeJs.theme).colors.secondary;
        th.style.color = (0, _themeJs.theme).colors.text;
        th.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    });
    const tds = table.querySelectorAll("td");
    tds.forEach((td)=>{
        td.style.border = `1px solid ${(0, _themeJs.theme).colors.secondary}`;
        td.style.padding = "10px";
        td.style.fontSize = (0, _themeJs.theme).fontSize.button;
    });
    // Alternating row colors for better readability
    const rows = table.querySelectorAll("tr:not(:first-child)");
    rows.forEach((row, index)=>{
        row.style.backgroundColor = index % 2 === 0 ? (0, _themeJs.theme).colors.background : (0, _themeJs.theme).colors.secondary + "33"; // 33 for 20% opacity
    });
    (0, _themeJs.styleButton)(backButton, (0, _themeJs.theme).colors.primary);
}

},{"../utils/theme.js":"6OzmZ","../utils/date.js":"5EBGj","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5EBGj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "timeAgo", ()=>timeAgo);
function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const secondsAgo = Math.floor((now - past) / 1000);
    const intervals = [
        {
            label: "year",
            seconds: 31536000
        },
        {
            label: "month",
            seconds: 2592000
        },
        {
            label: "week",
            seconds: 604800
        },
        {
            label: "day",
            seconds: 86400
        },
        {
            label: "hour",
            seconds: 3600
        },
        {
            label: "minute",
            seconds: 60
        },
        {
            label: "second",
            seconds: 1
        }
    ];
    for (const interval of intervals){
        const count = Math.floor(secondsAgo / interval.seconds);
        if (count >= 1) return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
    return "just now";
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9FY8c":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showLevelCompletedScreen", ()=>showLevelCompletedScreen);
var _themeJs = require("../utils/theme.js");
function showLevelCompletedScreen(currentScore, onNextLevel, onMainMenu) {
    const container = document.getElementById("game-container");
    container.innerHTML = "";
    const levelCompletedScreen = document.createElement("div");
    levelCompletedScreen.id = "level-completed-screen";
    const title = document.createElement("h1");
    title.textContent = "Level Completed!";
    levelCompletedScreen.appendChild(title);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Current Score: ${currentScore}`;
    levelCompletedScreen.appendChild(scoreDisplay);
    const nextLevelButton = document.createElement("button");
    nextLevelButton.textContent = "Next Level";
    nextLevelButton.onclick = onNextLevel;
    levelCompletedScreen.appendChild(nextLevelButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = onMainMenu;
    levelCompletedScreen.appendChild(mainMenuButton);
    container.appendChild(levelCompletedScreen);
    // Apply styles
    (0, _themeJs.applyContainerStyles)(container);
    title.style.fontSize = (0, _themeJs.theme).fontSize.title;
    title.style.marginBottom = "20px";
    scoreDisplay.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    (0, _themeJs.styleButton)(nextLevelButton, (0, _themeJs.theme).colors.accent);
    (0, _themeJs.styleButton)(mainMenuButton, (0, _themeJs.theme).colors.secondary);
}

},{"../utils/theme.js":"6OzmZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2HIwu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Story screen
parcelHelpers.export(exports, "showStoryScreen", ()=>showStoryScreen);
var _themeJs = require("../utils/theme.js");
function showStoryScreen(onBack) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const storyScreen = document.createElement("div");
    storyScreen.id = "story-screen";
    // Remove book and pages
    const textContainer = document.createElement("div");
    textContainer.id = "text-container";
    textContainer.style.textAlign = "center";
    storyScreen.appendChild(textContainer);
    const paragraphs = [
        "Meet Theo\u2014a brilliant but clumsy game designer with a passion for crafting the most intricate fantasy campaigns.",
        "One fateful evening, while putting the finishing touches on his masterpiece labyrinth, Theo accidentally spills a can of energy drink onto his keyboard.",
        'Sparks fly, screens flash, and before he can say "critical hit," he\'s zapped into the very world he created!',
        "Blinking in disbelief, Theo finds himself standing at the entrance of his own labyrinth, a sprawling maze filled with mind-bending puzzles, hidden traps, and mythical creatures.",
        "But he's not alone in there.",
        "His former friend-turned-rival, Max, a fellow gamer notorious for stealing ideas, has hacked into Theo's game to claim the labyrinth as his own.",
        "The power surge pulled Max into the game too, but with a devious advantage\u2014he now controls the Minotaur, the maze's most formidable guardian.",
        'Max taunts Theo through ethereal echoes: "Good luck finding your way out, Theo! This maze is mine now, and the Minotaur is eager to meet you!"',
        "Determined to reclaim his creation and return to the real world, Theo must navigate through multiple levels of his labyrinth, solving his own riddles and overcoming challenges he designed to be unbeatable.",
        "Along the way, he'll encounter quirky NPCs, unexpected allies, and maybe even a friendly dragon with a knack for sarcasm.",
        "Can Theo outsmart Max, defeat the Minotaur, and escape the labyrinth?",
        "The twists and turns of his own imagination stand between him and freedom.",
        "Grab your wits, summon your courage, and step into the maze\u2014an epic adventure awaits!"
    ];
    paragraphs.forEach((text, index)=>{
        const paragraph = document.createElement("p");
        paragraph.innerHTML = text;
        paragraph.style.opacity = 0;
        paragraph.style.display = "none";
        paragraph.style.transition = "opacity 1s";
        paragraph.style.fontSize = "28px";
        textContainer.appendChild(paragraph);
    });
    const buttonContainer = document.createElement("div");
    buttonContainer.style.textAlign = "center";
    buttonContainer.style.marginTop = "20px";
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = showNextParagraph;
    buttonContainer.appendChild(nextButton);
    const skipButton = document.createElement("button");
    skipButton.textContent = "Skip";
    skipButton.onclick = onBack;
    buttonContainer.appendChild(skipButton);
    storyScreen.appendChild(buttonContainer);
    container.appendChild(storyScreen);
    // Apply styles
    (0, _themeJs.applyContainerStyles)(container);
    styleStoryScreen(storyScreen, textContainer);
    (0, _themeJs.styleButton)(nextButton, (0, _themeJs.theme).colors.primary);
    (0, _themeJs.styleButton)(skipButton, (0, _themeJs.theme).colors.primary);
    let currentParagraph = 0;
    function showNextParagraph() {
        if (currentParagraph < paragraphs.length) {
            if (currentParagraph > 0) {
                textContainer.children[currentParagraph - 1].style.opacity = 0;
                textContainer.children[currentParagraph - 1].style.display = "none";
            }
            textContainer.children[currentParagraph].style.display = "block";
            textContainer.children[currentParagraph].style.opacity = 1;
            currentParagraph++;
        }
    }
    // Automatically show paragraphs with a delay
    function autoShowParagraphs() {
        if (currentParagraph < paragraphs.length) {
            if (currentParagraph > 0) {
                textContainer.children[currentParagraph - 1].style.opacity = 0;
                textContainer.children[currentParagraph - 1].style.display = "none";
            }
            textContainer.children[currentParagraph].style.display = "block";
            textContainer.children[currentParagraph].style.opacity = 1;
            currentParagraph++;
            setTimeout(autoShowParagraphs, 5000); // Adjust delay as needed
        }
    }
    autoShowParagraphs();
}
function styleStoryScreen(storyScreen, textContainer) {
    storyScreen.style.position = "relative";
    storyScreen.style.height = "100vh";
    textContainer.style.margin = "50px auto";
    textContainer.style.height = "200px";
    textContainer.style.width = "70%";
    textContainer.style.backgroundColor = (0, _themeJs.theme).colors.primary;
    textContainer.style.color = (0, _themeJs.theme).colors.text;
    textContainer.style.padding = "20px";
    textContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    textContainer.style.borderRadius = "10px";
}

},{"../utils/theme.js":"6OzmZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["aAwE2","6JHOc"], "6JHOc", "parcelRequire6d7b")

//# sourceMappingURL=index.44a83959.js.map
