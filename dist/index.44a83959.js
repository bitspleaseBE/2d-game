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
            const totalAssets = 51;
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
            const itemAssets = await (0, _assetsJs.loadItemAssets)(onProgress);
            this.assets = {
                playerAssets,
                levelAssets,
                guardAssets,
                powerupsAssets,
                itemAssets
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
var _soundJs = require("./utils/sound.js");
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
var _dropJs = require("./entities/drop.js");
var _dropJsDefault = parcelHelpers.interopDefault(_dropJs);
var _doorJs = require("./entities/door.js");
var _doorJsDefault = parcelHelpers.interopDefault(_doorJs);
var _itemsJs = require("./items.js");
var _themeManifestJs = require("./assets/theme-manifest.js");
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
        this.themeAssets = (0, _themeManifestJs.resolveThemeAssets)(this.assets.levelAssets);
        this.explosives = [];
        this.guards = [];
        this.obstacles = [];
        this.powerups = [];
        this.playerStart = {
            x: 0,
            y: 0
        };
        this.notifications = [];
        this.drops = [];
        this.doors = [];
        this.inventoryOpen = false;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.inventorySlotRects = [];
        this.onGameOver = callbacks.onGameOver || (()=>{});
        this.onLevelCompleted = callbacks.onLevelCompleted || (()=>{});
        this.onGameWon = callbacks.onGameWon || (()=>{});
        this.rafId = null;
        this.inputSetup = false;
        this.pressedDirections = new Set();
        this.lastFrameTime = null;
        this.pendingGameOverMs = null;
        // Remaining time before the player may swing again
        this.attackCooldownMs = 0;
        // Fog of war (per-level option): explored[row][col] persists until the
        // next level; the fog canvas is an offscreen buffer composited per frame
        this.fogEnabled = false;
        this.explored = [];
        this.fogCanvas = null;
    }
    initializeBoard() {
        const level = (0, _levelDataJsDefault.default).getLevel(this.currentLevel);
        if (level) {
            this.walls = [];
            this.doors = [];
            this.exit = null;
            this.board = level.layout;
            this.themeAssets = (0, _themeManifestJs.resolveThemeAssets)(this.assets.levelAssets, level.theme);
            this.fogEnabled = level.fogOfWar;
            this.explored = level.layout.map((row)=>row.map(()=>false));
            if (this.fogEnabled) this.notify("Fog of war \u2014 explore to reveal the map!");
            for(let y = 0; y < level.layout.length; y++)for(let x = 0; x < level.layout[y].length; x++){
                if (level.layout[y][x] === "#") this.walls.push(new (0, _wallJsDefault.default)(x * (0, _settingsJs.canvasSettings).cellWidth, y * (0, _settingsJs.canvasSettings).cellHeight, "normal", this.themeAssets));
                if (level.layout[y][x] === "D") this.doors.push(new (0, _doorJsDefault.default)(x * (0, _settingsJs.canvasSettings).cellWidth, y * (0, _settingsJs.canvasSettings).cellHeight, this.assets.itemAssets));
                if (level.layout[y][x] === "X") this.exit = new (0, _exitJsDefault.default)(x * (0, _settingsJs.canvasSettings).cellWidth, y * (0, _settingsJs.canvasSettings).cellHeight, this.themeAssets);
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
                const previousPlayer = this.player;
                this.player = new (0, _playerJsDefault.default)(this.playerStart.x, this.playerStart.y, this.assets.playerAssets);
                // The pack and equipped gear travel with the player from level
                // to level; a fresh run starts empty (start() clears the player)
                if (previousPlayer) {
                    this.player.inventory = {
                        ...previousPlayer.inventory
                    };
                    this.player.equipment = {
                        ...previousPlayer.equipment
                    };
                }
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
                    this.player.setWalking(false);
                }, delay);
                callback();
            };
        };
        const directionForKey = (key)=>{
            switch(key){
                case (0, _settingsJs.controlSettings).up:
                    return "up";
                case (0, _settingsJs.controlSettings).down:
                    return "down";
                case (0, _settingsJs.controlSettings).left:
                    return "left";
                case (0, _settingsJs.controlSettings).right:
                    return "right";
                default:
                    return null;
            }
        };
        window.addEventListener("keydown", (event)=>{
            if (!this.started || this.paused || this.isGameOver) return;
            // Stop the space bar (and arrow keys) from scrolling the page
            if (event.key === " " || event.key.startsWith("Arrow")) event.preventDefault();
            if (event.key === (0, _settingsJs.controlSettings).inventory) {
                this.toggleInventory();
                return;
            }
            // The world is frozen while the inventory is open
            if (this.inventoryOpen) return;
            const direction = directionForKey(event.key);
            if (direction) {
                this.pressedDirections.add(direction);
                return;
            }
            switch(event.key){
                case (0, _settingsJs.controlSettings).attack:
                    debounceAction(()=>this.playerAttack(), 250)();
                    break;
                case (0, _settingsJs.controlSettings).pick:
                    debounceAction(()=>this.playerPick(), 150)();
                    break;
                case (0, _settingsJs.controlSettings).axe:
                    debounceAction(()=>this.playerAxe(), 250)();
                    break;
                case (0, _settingsJs.controlSettings).potion:
                    debounceAction(()=>this.playerDrinkPotion(), 500)();
                    break;
            }
        });
        window.addEventListener("keyup", (event)=>{
            const direction = directionForKey(event.key);
            if (direction) this.pressedDirections.delete(direction);
        });
        // Mouse support for the inventory screen (hover = tooltip, click = use)
        this.canvas.addEventListener("mousemove", (event)=>{
            const rect = this.canvas.getBoundingClientRect();
            this.mouse = {
                x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
                y: (event.clientY - rect.top) * (this.canvas.height / rect.height)
            };
        });
        this.canvas.addEventListener("click", ()=>{
            if (!this.inventoryOpen) return;
            const slot = this.inventorySlotRects.find((r)=>this.mouse.x >= r.x && this.mouse.x <= r.x + r.size && this.mouse.y >= r.y && this.mouse.y <= r.y + r.size);
            if (slot && slot.itemId) this.activateInventoryItem(slot.itemId);
        });
    }
    toggleInventory() {
        if (!this.started || this.paused || this.isGameOver) return;
        this.inventoryOpen = !this.inventoryOpen;
        this.pressedDirections.clear();
    }
    // Click on an inventory slot: equip/unequip gear, drink potions
    activateInventoryItem(itemId) {
        const item = (0, _itemsJs.itemCatalog)[itemId];
        if (item.kind === "weapon" || item.kind === "rune") {
            const result = this.player.equip(itemId);
            if (result === "equipped") this.notify(`${item.name} equipped`);
            if (result === "unequipped") this.notify(`${item.name} unequipped`);
        } else if (item.kind === "potion") this.playerDrinkPotion();
    }
    playerDrinkPotion() {
        if (this.player.useItem("potion")) {
            this.player.potion(); // drink animation
            (0, _soundJs.sfx).gulp();
            this.notify(`You drank a Health Potion (+${(0, _itemsJs.itemCatalog).potion.healAmount} health)`);
        } else this.notifyOnce("You have no potions \u2014 defeated guards sometimes drop them.");
    }
    getMovementVector() {
        const x = (this.pressedDirections.has("right") ? 1 : 0) - (this.pressedDirections.has("left") ? 1 : 0);
        const y = (this.pressedDirections.has("down") ? 1 : 0) - (this.pressedDirections.has("up") ? 1 : 0);
        if (x === 0 && y === 0) return {
            x: 0,
            y: 0
        };
        const length = Math.hypot(x, y);
        return {
            x: x / length,
            y: y / length
        };
    }
    canPlayerMoveTo(next) {
        const hitBox = this.player.getHitBox();
        const current = this.player.getPosition();
        const nextHitBox = {
            x: next.x + (hitBox.x - current.x),
            y: next.y + (hitBox.y - current.y),
            width: hitBox.width,
            height: hitBox.height
        };
        return !(next.x < 0 || next.y < 0 || next.x > this.canvas.width - (0, _settingsJs.canvasSettings).cellWidth || next.y > this.canvas.height - (0, _settingsJs.canvasSettings).cellHeight || this.walls.some((wall)=>(0, _gameJs.isColliding)(nextHitBox, wall.getHitBox())) || this.lockedDoors().some((door)=>(0, _gameJs.isColliding)(nextHitBox, door.getHitBox())) || this.obstacles.some((obstacle)=>(0, _gameJs.isColliding)(nextHitBox, obstacle.getHitBox())));
    }
    // Doors that still block passage (an opened door is a free corridor)
    lockedDoors() {
        return this.doors.filter((door)=>door.locked);
    }
    applyMovementInput(deltaMs) {
        const vector = this.getMovementVector();
        if (vector.x === 0 && vector.y === 0) {
            this.player.setWalking(false);
            return;
        }
        const distance = this.player.getSpeed() * (deltaMs / 1000);
        const deltaX = vector.x * distance;
        const deltaY = vector.y * distance;
        if (Math.abs(deltaX) > Math.abs(deltaY)) this.player.setMovement(deltaX > 0 ? "right" : "left");
        else this.player.setMovement(deltaY > 0 ? "down" : "up");
        const current = this.player.getPosition();
        let moved = false;
        const nextX = {
            x: current.x + deltaX,
            y: current.y
        };
        if (deltaX !== 0 && this.canPlayerMoveTo(nextX)) {
            this.player.moveBy(deltaX, 0);
            moved = true;
        }
        const afterX = this.player.getPosition();
        const nextY = {
            x: afterX.x,
            y: afterX.y + deltaY
        };
        if (deltaY !== 0 && this.canPlayerMoveTo(nextY)) {
            this.player.moveBy(0, deltaY);
            moved = true;
        }
        this.player.setWalking(moved);
    }
    movePlayer(direction, deltaMs = 1000 / 60) {
        const distance = this.player.getSpeed() * (deltaMs / 1000);
        const next = this.player.checkCollision(direction, distance);
        this.player.setMovement(direction);
        if (!this.canPlayerMoveTo(next)) {
            this.player.setWalking(false);
            return;
        }
        switch(direction){
            case "up":
                this.player.moveUp(distance);
                break;
            case "down":
                this.player.moveDown(distance);
                break;
            case "left":
                this.player.moveLeft(distance);
                break;
            case "right":
                this.player.moveRight(distance);
                break;
        }
    }
    playerAttack() {
        // Ignore swings while the previous one is still recovering, so holding
        // the key down (auto-repeat) cannot land a hit every keyboard event
        if (this.attackCooldownMs > 0) return;
        this.attackCooldownMs = (0, _settingsJs.combatSettings).attackCooldownMs;
        this.player.attack();
        (0, _soundJs.sfx).swing();
        if (!this.player.isActionActive("attack")) return;
        const attackBox = this.player.getAttackBox();
        // Damage guards caught in the swing; defeated guards play their death
        // animation before updateGameState removes them. Survivors are knocked
        // back away from the swing and show their health bar for a few seconds.
        this.guards.forEach((guard)=>{
            if (guard.isDefeated()) return;
            if ((0, _gameJs.isColliding)(attackBox, guard.getHitBox())) {
                guard.takeDamage(this.player.attackPower, this.player.movement);
                if (guard.consumeDefeatAward()) {
                    (0, _soundJs.sfx).guardDown();
                    this.score += guard.isBoss() ? (0, _settingsJs.bossSettings).scoreValue : (0, _settingsJs.gameSettings).scoreIncrement;
                    this.spawnDrop(guard.getPosition());
                } else (0, _soundJs.sfx).hit();
            }
        });
        // Chop down obstacles (trees, boulders) that are struck
        const obstaclesBefore = this.obstacles.length;
        this.obstacles = this.obstacles.filter((obstacle)=>{
            if ((0, _gameJs.isColliding)(attackBox, obstacle.getHitBox())) {
                obstacle.takeDamage(this.player.attackPower);
                return !obstacle.isDestroyed();
            }
            return true;
        });
        if (this.obstacles.length < obstaclesBefore) (0, _soundJs.sfx).chop();
    }
    playerAxe() {
        if (this.attackCooldownMs > 0) return;
        this.attackCooldownMs = (0, _settingsJs.combatSettings).attackCooldownMs;
        this.player.axe();
        (0, _soundJs.sfx).swing();
        if (!this.player.isActionActive("axe")) return;
        const attackBox = this.player.getAttackBox();
        const obstaclesBefore = this.obstacles.length;
        this.obstacles = this.obstacles.filter((obstacle)=>{
            if ((0, _gameJs.isColliding)(attackBox, obstacle.getHitBox())) {
                obstacle.takeDamage(this.player.attackPower);
                return !obstacle.isDestroyed();
            }
            return true;
        });
        if (this.obstacles.length < obstaclesBefore) (0, _soundJs.sfx).chop();
    }
    // Pick: disarm an armed explosive trap the player is standing near,
    // before its fuse runs out
    playerPick() {
        this.player.pick();
        const playerBox = this.player.getHitBox();
        const px = playerBox.x + playerBox.width / 2;
        const py = playerBox.y + playerBox.height / 2;
        const index = this.explosives.findIndex((explosive)=>{
            if (!explosive.isArmed()) return false;
            const center = explosive.getCenter();
            return Math.hypot(px - center.x, py - center.y) <= (0, _settingsJs.entitySettings).explosiveTriggerRange;
        });
        if (index === -1) return;
        this.explosives.splice(index, 1);
        this.score += (0, _settingsJs.gameSettings).disarmScore;
        (0, _soundJs.sfx).disarm();
        this.notify(`Trap disarmed! +${(0, _settingsJs.gameSettings).disarmScore} points`);
    }
    initializeEntities() {
        const level = (0, _levelDataJsDefault.default).getLevel(this.currentLevel);
        if (level) {
            this.explosives = [];
            this.guards = [];
            this.obstacles = [];
            this.powerups = [];
            this.drops = [];
            for(let y = 0; y < level.layout.length; y++)for(let x = 0; x < level.layout[y].length; x++){
                const cell = level.layout[y][x];
                const position = {
                    x: x * (0, _settingsJs.canvasSettings).cellWidth,
                    y: y * (0, _settingsJs.canvasSettings).cellHeight
                };
                switch(cell){
                    case "E":
                        this.explosives.push(new (0, _explosiveJsDefault.default)(position.x, position.y));
                        break;
                    case "G":
                        const randomOrc = (0, _rngJs.randomInt)(1, 3);
                        this.guards.push(new (0, _guardJsDefault.default)(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets));
                        break;
                    case "B":
                        // A boss: bigger, tougher and harder-hitting than a guard
                        this.guards.push(new (0, _guardJsDefault.default)(position.x, position.y, `orc${(0, _rngJs.randomInt)(1, 3)}`, this.assets.guardAssets, {
                            boss: true
                        }));
                        break;
                    case "O":
                        this.obstacles.push(new (0, _obstacleJsDefault.default)(position.x, position.y, "boulder", this.themeAssets));
                        break;
                    case "T":
                        this.obstacles.push(new (0, _obstacleJsDefault.default)(position.x, position.y, "tree", this.themeAssets));
                        break;
                    case "C":
                        const powerupTypes = Object.keys((0, _powerupJs.powerupDescriptions));
                        const randomPowerup = (0, _rngJs.randomInt)(1, powerupTypes.length);
                        this.powerups.push(new (0, _powerupJsDefault.default)(position.x, position.y, powerupTypes[randomPowerup - 1], this.assets.powerupsAssets));
                        break;
                }
            }
        }
    }
    // Something a defeated guard leaves behind on the ground
    spawnDrop({ x, y }) {
        let itemId;
        // While any door is still locked and no key is in reach (carried or on
        // the ground), the defeated guard always carries one. This also covers
        // levels with several locked doors: each door gets its key in turn.
        const keyInReach = this.player.hasItem("key") || this.drops.some((drop)=>drop.getType() === "key");
        if (this.lockedDoors().length > 0 && !keyInReach) itemId = "key";
        else itemId = (0, _itemsJs.guardDropPool)[(0, _rngJs.randomInt)(1, (0, _itemsJs.guardDropPool).length) - 1];
        this.drops.push(new (0, _dropJsDefault.default)(x, y, itemId, this.assets.itemAssets));
    }
    // Queue a short-lived message shown at the top of the canvas (e.g. what a
    // picked-up item does); it fades out during its last second on screen
    notify(text) {
        this.notifications.push({
            text,
            msLeft: (0, _settingsJs.powerupSettings).notificationDurationMs
        });
    }
    // Like notify, but skipped while the same message is still on screen
    // (for messages that would otherwise repeat every frame)
    notifyOnce(text) {
        if (!this.notifications.some((n)=>n.text === text)) this.notify(text);
    }
    // Mark every cell within the light radius of the player as explored
    revealAroundPlayer() {
        if (!this.fogEnabled) return;
        const center = this.playerCenter();
        for(let y = 0; y < this.explored.length; y++)for(let x = 0; x < this.explored[y].length; x++){
            if (this.explored[y][x]) continue;
            const cellCenterX = x * (0, _settingsJs.canvasSettings).cellWidth + (0, _settingsJs.canvasSettings).cellWidth / 2;
            const cellCenterY = y * (0, _settingsJs.canvasSettings).cellHeight + (0, _settingsJs.canvasSettings).cellHeight / 2;
            const distance = Math.hypot(cellCenterX - center.x, cellCenterY - center.y);
            if (distance <= (0, _settingsJs.fogSettings).revealRadius) this.explored[y][x] = true;
        }
    }
    playerCenter() {
        const position = this.player.getPosition();
        return {
            x: position.x + (0, _settingsJs.canvasSettings).cellWidth / 2,
            y: position.y + (0, _settingsJs.canvasSettings).cellHeight / 2
        };
    }
    isCellExplored(col, row) {
        return Boolean(this.explored[row] && this.explored[row][col]);
    }
    updateGameState(deltaMs = 1000 / 60) {
        this.attackCooldownMs = Math.max(0, this.attackCooldownMs - deltaMs);
        this.applyMovementInput(deltaMs);
        this.revealAroundPlayer();
        this.checkCollisions();
        this.checkPlayerDeath(deltaMs);
        if (this.isGameOver) return;
        this.notifications = this.notifications.filter((n)=>{
            n.msLeft -= deltaMs;
            return n.msLeft > 0;
        });
        this.player.update(deltaMs);
        this.updateExplosives(deltaMs);
        // Locked doors block guards (and their line of sight) like walls
        const guardBlockers = [
            ...this.walls,
            ...this.lockedDoors()
        ];
        this.guards.forEach((guard)=>guard.update(this.player.getHitBox(), guardBlockers, deltaMs));
        this.guards = this.guards.filter((guard)=>!guard.isReadyToRemove());
        this.obstacles.forEach((obstacle)=>obstacle.update());
        this.powerups.forEach((powerup)=>powerup.update());
        this.drops.forEach((drop)=>drop.update(deltaMs));
        this.checkDoorUnlock();
        this.checkLockedDoorHint();
        this.checkLevelCompletion();
    }
    // Rectangle around a door: touching it means "at the door", one cell of
    // margin means "in front of the door"
    static inflateBox(box, margin) {
        return {
            x: box.x - margin,
            y: box.y - margin,
            width: box.width + margin * 2,
            height: box.height + margin * 2
        };
    }
    // Walking up to a locked door while carrying a key opens it
    checkDoorUnlock() {
        if (!this.player.hasItem("key")) return;
        const playerBox = this.player.getHitBox();
        for (const door of this.lockedDoors()){
            // The player is stopped flush against the door, so allow a small gap
            const atDoor = (0, _gameJs.isColliding)(playerBox, Game.inflateBox(door.getHitBox(), 10));
            if (atDoor) {
                this.player.removeItem("key");
                door.unlock();
                (0, _soundJs.sfx).unlock();
                this.notify("You unlocked the door with your key!");
                return;
            }
        }
    }
    // Approaching a locked door without the key explains what is missing,
    // before the player even touches it
    checkLockedDoorHint() {
        if (this.player.hasItem("key")) return;
        const playerBox = this.player.getHitBox();
        const nearDoor = this.lockedDoors().some((door)=>(0, _gameJs.isColliding)(playerBox, Game.inflateBox(door.getHitBox(), (0, _settingsJs.canvasSettings).cellWidth)));
        if (!nearDoor) return;
        const keyOnGround = this.drops.some((drop)=>drop.getType() === "key");
        this.notifyOnce(keyOnGround ? "The door is locked \u2014 pick up the key first!" : "The door is locked \u2014 defeat a guard to find the key.");
    }
    checkPlayerDeath(deltaMs = 1000 / 60) {
        if (this.player.getHealth() > 0) return;
        if (this.pendingGameOverMs !== null) {
            this.pendingGameOverMs -= deltaMs;
            if (this.pendingGameOverMs <= 0) {
                this.isGameOver = true;
                this.started = false;
                this.pendingGameOverMs = null;
                this.onGameOver(this.score);
            }
            return;
        }
        this.lives -= 1;
        if (this.lives <= 0) {
            this.player.defeat();
            this.pendingGameOverMs = 700;
            (0, _soundJs.sfx).gameOver();
            return;
        }
        this.player.respawn(this.playerStart.x, this.playerStart.y);
    }
    // Hidden traps arm when the player comes close, burn a fuse, then blast
    // everything (player and guards) inside the radius exactly once
    updateExplosives(deltaMs) {
        const playerHitBox = this.player.getHitBox();
        this.explosives.forEach((explosive)=>{
            const wasHidden = explosive.isHidden();
            explosive.update(playerHitBox, deltaMs);
            if (wasHidden && explosive.isArmed()) {
                (0, _soundJs.sfx).fuse();
                this.notifyOnce("A trap springs \u2014 run, or disarm it with 'p'!");
            }
            const blast = explosive.consumeBlast();
            if (!blast) return;
            (0, _soundJs.sfx).explosion();
            const inBlast = (box)=>{
                const cx = box.x + box.width / 2;
                const cy = box.y + box.height / 2;
                return Math.hypot(cx - blast.x, cy - blast.y) <= blast.radius;
            };
            if (inBlast(playerHitBox)) this.damagePlayer((0, _settingsJs.entitySettings).explosivePlayerDamage);
            this.guards.forEach((guard)=>{
                if (guard.isDefeated()) return;
                if (inBlast(guard.getHitBox())) {
                    guard.takeDamage((0, _settingsJs.entitySettings).explosiveGuardDamage);
                    if (guard.consumeDefeatAward()) {
                        this.score += guard.isBoss() ? (0, _settingsJs.bossSettings).scoreValue : (0, _settingsJs.gameSettings).scoreIncrement;
                        this.spawnDrop(guard.getPosition());
                    }
                }
            });
        });
        this.explosives = this.explosives.filter((explosive)=>!explosive.isDone());
    }
    // Route all player damage through one place so the hurt sound plays
    // only when damage actually lands (not while invincible or flashing)
    damagePlayer(amount) {
        const healthBefore = this.player.getHealth();
        this.player.takeDamage(amount);
        if (this.player.getHealth() < healthBefore) (0, _soundJs.sfx).hurt();
    }
    checkCollisions() {
        const playerPosition = this.player.getHitBox();
        this.guards.forEach((guard)=>{
            if (guard.isDefeated()) return;
            if ((0, _gameJs.isColliding)(playerPosition, guard.getHitBox())) this.damagePlayer(guard.damage);
        });
        this.obstacles.forEach((obstacle, index)=>{
            (0, _gameJs.isColliding)(playerPosition, obstacle.getHitBox());
        });
        this.powerups.forEach((powerup, index)=>{
            if ((0, _gameJs.isColliding)(this.player.getPickupRange(), powerup.getHitBox())) {
                const effect = powerup.collect();
                this.player.applyPowerup(effect);
                if ((0, _powerupJs.powerupDescriptions)[effect]) this.notify((0, _powerupJs.powerupDescriptions)[effect]);
                this.powerups.splice(index, 1);
                this.score += (0, _settingsJs.gameSettings).scoreIncrement;
                (0, _soundJs.sfx).pickup();
            }
        });
        // Items dropped by defeated guards go into the inventory
        this.drops = this.drops.filter((drop)=>{
            if ((0, _gameJs.isColliding)(this.player.getPickupRange(), drop.getHitBox())) {
                this.player.addItem(drop.getType());
                this.notifyPickup(drop.getType());
                (0, _soundJs.sfx).pickup();
                return false;
            }
            return true;
        });
    }
    notifyPickup(itemId) {
        const item = (0, _itemsJs.itemCatalog)[itemId];
        this.notify(`You picked up ${item.article} ${item.name} \u{2014} press 'i' to inspect your inventory.`);
    }
    checkLevelCompletion() {
        if (!this.isLevelComplete()) return;
        this.score += (0, _settingsJs.gameSettings).scoreIncrement;
        (0, _soundJs.sfx).levelComplete();
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
        // Draw the walls and doors
        this.walls.forEach((wall)=>wall.draw(this.context));
        this.doors.forEach((door)=>door.draw(this.context));
        // Draw the entities
        this.obstacles.forEach((obstacle)=>obstacle.draw(this.context));
        this.powerups.forEach((powerup)=>powerup.draw(this.context));
        this.drops.forEach((drop)=>drop.draw(this.context));
        this.guards.forEach((guard)=>guard.draw(this.context));
        this.explosives.forEach((explosive)=>explosive.draw(this.context));
        // Draw the exit
        if (this.exit) this.exit.draw(this.context);
        // Draw the player
        this.player.draw(this.context);
        // Fog of war covers the world but never the HUD
        this.drawFog();
        // Draw the HUD on top of everything
        this.drawHUD();
        // The inventory screen covers the frozen world; notifications (e.g.
        // "equipped") stay visible above it
        if (this.inventoryOpen) this.drawInventory();
        this.drawNotifications();
    }
    drawNotifications() {
        const ctx = this.context;
        ctx.save();
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        this.notifications.forEach((notification, i)=>{
            // Fade out over the last second on screen
            ctx.globalAlpha = Math.min(1, notification.msLeft / 1000);
            const y = 72 + i * 30;
            const width = ctx.measureText(notification.text).width + 24;
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(this.canvas.width / 2 - width / 2, y - 13, width, 26);
            ctx.fillStyle = "#ffd54f";
            ctx.fillText(notification.text, this.canvas.width / 2, y);
        });
        ctx.restore();
    }
    // Full-screen inventory: equipment slots on top, carried items below.
    // Hovering a slot shows the item's description; clicking equips or drinks.
    drawInventory() {
        const ctx = this.context;
        const panelWidth = 640;
        const panelHeight = 400;
        const panelX = (this.canvas.width - panelWidth) / 2;
        const panelY = (this.canvas.height - panelHeight) / 2;
        const slotSize = 56;
        this.inventorySlotRects = [];
        ctx.save();
        // Dim the frozen world behind the panel
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Panel
        ctx.fillStyle = "#20222c";
        ctx.strokeStyle = "#ffd54f";
        ctx.lineWidth = 2;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        // Title bar
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "#ffd54f";
        ctx.fillText("Inventory", panelX + 24, panelY + 30);
        ctx.font = "14px monospace";
        ctx.fillStyle = "#999";
        ctx.textAlign = "right";
        ctx.fillText("press 'i' to close", panelX + panelWidth - 24, panelY + 30);
        ctx.textAlign = "left";
        // Equipment slots
        const equipY = panelY + 84;
        [
            {
                label: "Weapon",
                slot: "weapon"
            },
            {
                label: "Rune",
                slot: "rune"
            }
        ].forEach((equip, i)=>{
            const x = panelX + 24 + i * 170;
            ctx.font = "bold 14px monospace";
            ctx.fillStyle = "#80d8ff";
            ctx.fillText(equip.label, x, equipY - 12);
            this.drawInventorySlot(x, equipY, slotSize, this.player.equipment[equip.slot], 0);
        });
        // Carried items
        const gridY = equipY + slotSize + 44;
        ctx.font = "bold 14px monospace";
        ctx.fillStyle = "#80d8ff";
        ctx.fillText("Items", panelX + 24, gridY - 12);
        const entries = this.player.getInventoryEntries();
        if (entries.length === 0) {
            ctx.font = "14px monospace";
            ctx.fillStyle = "#999";
            ctx.fillText("Nothing yet \u2014 defeat guards to find weapons, runes and potions.", panelX + 24, gridY + 28);
        }
        entries.forEach((entry, i)=>{
            const columns = 9;
            const x = panelX + 24 + i % columns * (slotSize + 10);
            const y = gridY + Math.floor(i / columns) * (slotSize + 10);
            this.drawInventorySlot(x, y, slotSize, entry.id, entry.count);
        });
        // Footer hint
        ctx.font = "14px monospace";
        ctx.fillStyle = "#999";
        ctx.fillText("Click a weapon or rune to equip it \u2014 click a potion to drink it.", panelX + 24, panelY + panelHeight - 24);
        this.drawInventoryTooltip();
        ctx.restore();
    }
    drawInventorySlot(x, y, size, itemId, count) {
        const ctx = this.context;
        this.inventorySlotRects.push({
            x,
            y,
            size,
            itemId
        });
        const hovered = this.mouse.x >= x && this.mouse.x <= x + size && this.mouse.y >= y && this.mouse.y <= y + size;
        const item = itemId ? (0, _itemsJs.itemCatalog)[itemId] : null;
        const equipped = item && this.player.equipment[item.kind] === itemId;
        ctx.fillStyle = "#2c2f3d";
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = hovered ? "#ffd54f" : equipped ? "#80d8ff" : "#4a4e63";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
        if (!item) return;
        ctx.drawImage(this.assets.itemAssets[item.icon], x + 6, y + 6, size - 12, size - 12);
        if (count > 1) {
            ctx.font = "bold 13px monospace";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "right";
            ctx.fillText(`x${count}`, x + size - 4, y + size - 9);
            ctx.textAlign = "left";
        }
        if (equipped) {
            ctx.font = "bold 11px monospace";
            ctx.fillStyle = "#80d8ff";
            ctx.fillText("ON", x + 4, y + 10);
        }
    }
    drawInventoryTooltip() {
        const hoveredSlot = this.inventorySlotRects.find((r)=>r.itemId && this.mouse.x >= r.x && this.mouse.x <= r.x + r.size && this.mouse.y >= r.y && this.mouse.y <= r.y + r.size);
        if (!hoveredSlot) return;
        const ctx = this.context;
        const item = (0, _itemsJs.itemCatalog)[hoveredSlot.itemId];
        const hint = item.kind === "weapon" || item.kind === "rune" ? "Click to equip or take off" : item.kind === "potion" ? "Click to drink" : null;
        const lines = [
            item.name,
            item.description
        ];
        if (hint) lines.push(hint);
        ctx.font = "14px monospace";
        const boxWidth = Math.max(...lines.map((l)=>ctx.measureText(l).width)) + 24;
        const boxHeight = lines.length * 20 + 16;
        // Keep the tooltip on screen, above-right of the cursor when possible
        const boxX = Math.min(this.mouse.x + 14, this.canvas.width - boxWidth - 4);
        const boxY = Math.max(4, this.mouse.y - boxHeight - 6);
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.strokeStyle = "#ffd54f";
        ctx.lineWidth = 1;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        lines.forEach((line, i)=>{
            ctx.fillStyle = i === 0 ? "#ffd54f" : i === lines.length - 1 && hint ? "#80d8ff" : "#eee";
            ctx.font = i === 0 ? "bold 14px monospace" : "14px monospace";
            ctx.fillText(line, boxX + 12, boxY + 18 + i * 20);
        });
    }
    drawHUD() {
        const ctx = this.context;
        ctx.save();
        // Background strip
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(8, 8, 452, 40);
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
        // Keys and potions carried, as icons with a count
        const icons = this.assets.itemAssets;
        const iconSize = 26;
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "#fff";
        ctx.drawImage(icons.key, 306, 15, iconSize, iconSize);
        ctx.fillText(`${this.player.inventory.key || 0}`, 306 + iconSize + 2, 28);
        ctx.drawImage(icons.potion, 356, 15, iconSize, iconSize);
        ctx.fillText(`${this.player.inventory.potion || 0}`, 356 + iconSize + 2, 28);
        // Reminder that the inventory exists
        ctx.font = "14px monospace";
        ctx.fillStyle = "#aaa";
        ctx.fillText("(i)", 412, 28);
        // Active powerup effects with their remaining time
        const effects = this.player.getActiveEffects();
        if (effects.length > 0) {
            ctx.font = "bold 14px monospace";
            ctx.fillStyle = "#80d8ff";
            const label = effects.map((e)=>`${e.name} ${e.secondsLeft}s`).join("  ");
            ctx.fillText(label, 18, 62);
        }
        ctx.restore();
    }
    drawGrid() {
        const floorPattern = this.themeAssets.floor ? this.context.createPattern(this.themeAssets.floor, "repeat") : null;
        this.context.fillStyle = floorPattern || this.themeAssets.floorFallback;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // Fog of war: unexplored cells are pitch black, explored cells outside
    // the light radius stay dimly visible (map memory), and a soft torchlight
    // circle follows the player. Composed on an offscreen canvas so the
    // torch can be erased out of the fog without touching the world below.
    drawFog() {
        if (!this.fogEnabled) return;
        if (!this.fogCanvas) {
            this.fogCanvas = document.createElement("canvas");
            this.fogCanvas.width = this.canvas.width;
            this.fogCanvas.height = this.canvas.height;
        }
        const fogCtx = this.fogCanvas.getContext("2d");
        fogCtx.clearRect(0, 0, this.fogCanvas.width, this.fogCanvas.height);
        for(let y = 0; y < this.explored.length; y++)for(let x = 0; x < this.explored[y].length; x++){
            const alpha = this.explored[y][x] ? (0, _settingsJs.fogSettings).exploredAlpha : (0, _settingsJs.fogSettings).unexploredAlpha;
            fogCtx.fillStyle = `rgba(8, 8, 16, ${alpha})`;
            fogCtx.fillRect(x * (0, _settingsJs.canvasSettings).cellWidth, y * (0, _settingsJs.canvasSettings).cellHeight, (0, _settingsJs.canvasSettings).cellWidth, (0, _settingsJs.canvasSettings).cellHeight);
        }
        // Erase a soft-edged torchlight circle around the player
        const center = this.playerCenter();
        const radius = (0, _settingsJs.fogSettings).revealRadius;
        const torch = fogCtx.createRadialGradient(center.x, center.y, radius * 0.5, center.x, center.y, radius);
        torch.addColorStop(0, "rgba(0, 0, 0, 1)");
        torch.addColorStop(1, "rgba(0, 0, 0, 0)");
        fogCtx.globalCompositeOperation = "destination-out";
        fogCtx.fillStyle = torch;
        fogCtx.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
        fogCtx.globalCompositeOperation = "source-over";
        this.context.drawImage(this.fogCanvas, 0, 0);
    }
    gameLoop(timestamp = performance.now()) {
        // Main game loop
        if (this.isGameOver || this.paused) return;
        if (this.lastFrameTime === null) this.lastFrameTime = timestamp;
        const deltaMs = Math.min(50, timestamp - this.lastFrameTime);
        this.lastFrameTime = timestamp;
        if (this.inventoryOpen) // The world stands still while the player inspects the inventory, but
        // messages keep fading and the screen keeps rendering for hover effects
        this.notifications = this.notifications.filter((n)=>{
            n.msLeft -= deltaMs;
            return n.msLeft > 0;
        });
        else this.updateGameState(deltaMs);
        if (this.isGameOver || this.paused) return;
        this.render();
        this.rafId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    pause() {
        this.paused = true;
        this.inventoryOpen = false;
        this.pressedDirections.clear();
        this.lastFrameTime = null;
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
        this.notifications = [];
        this.player = null; // a fresh run starts with an empty pack
        this.inventoryOpen = false;
        this.pendingGameOverMs = null;
        this.attackCooldownMs = 0;
        this.pressedDirections.clear();
        this.lastFrameTime = null;
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
        this.lastFrameTime = null;
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
    step(frames = 1, deltaMs = 1000 / 60) {
        if (!this.player) return;
        for(let i = 0; i < frames; i++){
            if (this.isGameOver) break;
            this.updateGameState(deltaMs);
        }
        if (!this.isGameOver) this.render();
    }
    // Place the player at an exact pixel position
    teleportPlayer(x, y) {
        this.player.setPosition(x, y);
    }
    // Add a guard (or boss) at an exact pixel position
    spawnGuard(x, y, type = "orc1", options = {}) {
        const guard = new (0, _guardJsDefault.default)(x, y, type, this.assets.guardAssets, options);
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

},{"./utils/settings.js":"hBndc","./utils/sound.js":"6QCfZ","./entities/player.js":"1uqza","./levels/level-data.js":"57eJ8","./utils/canvas.js":"TkAKd","./utils/game.js":"jBBaN","./utils/rng.js":"7uRsi","./entities/wall.js":"d9RxC","./entities/explosive.js":"590U3","./entities/guard.js":"bFjVQ","./entities/obstacle.js":"14cf6","./entities/powerup.js":"7DUBa","./entities/exit.js":"lIWLe","./entities/drop.js":"3BhaU","./entities/door.js":"8XUaB","./items.js":"8gP9P","./assets/theme-manifest.js":"d5R3E","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hBndc":[function(require,module,exports) {
// Game settings and configurations
// - This file contains global settings and configurations for the game
// - These settings can be adjusted to change the game's behavior and appearance
// Canvas settings
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "canvasSettings", ()=>canvasSettings);
parcelHelpers.export(exports, "playerSettings", ()=>playerSettings);
parcelHelpers.export(exports, "gameSettings", ()=>gameSettings);
parcelHelpers.export(exports, "powerupSettings", ()=>powerupSettings);
parcelHelpers.export(exports, "combatSettings", ()=>combatSettings);
parcelHelpers.export(exports, "bossSettings", ()=>bossSettings);
parcelHelpers.export(exports, "fogSettings", ()=>fogSettings);
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
    speed: 300,
    respawnProtectionMs: 2000,
    color: "#ff69b4"
};
const gameSettings = {
    initialLevel: 1,
    maxLevels: 10,
    scoreIncrement: 100,
    disarmScore: 50
};
const powerupSettings = {
    healAmount: 25,
    speedBoost: 180,
    speedDurationMs: 10000,
    strengthMultiplier: 2,
    strengthDurationMs: 10000,
    invincibilityDurationMs: 10000,
    notificationDurationMs: 4000
};
const combatSettings = {
    attackCooldownMs: 400,
    knockbackSpeed: 300,
    knockbackDurationMs: 120,
    healthBarVisibleMs: 3000
};
const bossSettings = {
    health: 300,
    damage: 20,
    speed: 45,
    width: 128,
    height: 128,
    detectionRangeCells: 6,
    scoreValue: 500
};
const fogSettings = {
    revealRadius: 160,
    exploredAlpha: 0.55,
    unexploredAlpha: 1
};
const entitySettings = {
    enemyWidth: 91,
    enemyHeight: 91,
    obstacleColor: "#c62828",
    powerupColor: "#1565c0",
    guardColor: "#ff69b4",
    explosiveColor: "#ffd54f",
    exitColor: "#4caf50",
    explosiveTriggerRange: 96,
    explosiveFuseMs: 1500,
    explosiveBlastRadius: 96,
    explosivePlayerDamage: 30,
    explosiveGuardDamage: 100
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
    potion: "u",
    inventory: "i"
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

},{}],"6QCfZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sfx", ()=>sfx);
var _settingsJs = require("./settings.js");
// Tiny synthesized sound effects via the Web Audio API — no audio assets
// needed. The AudioContext is created lazily on the first sound, which always
// happens after a user gesture (a key press or button click), so autoplay
// policies never block it. Every call is wrapped so a missing/blocked audio
// backend can never break the game.
let ctx = null;
function getContext() {
    if ((0, _settingsJs.soundSettings).mute) return null;
    try {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            ctx = new AudioCtx();
        }
        if (ctx.state === "suspended") ctx.resume().catch(()=>{});
        return ctx;
    } catch  {
        return null;
    }
}
// Play a simple tone: oscillator + exponential decay envelope
function tone({ type = "square", from = 440, to = from, duration = 0.1, volume = 0.3, delay = 0 }) {
    const audio = getContext();
    if (!audio) return;
    try {
        const t0 = audio.currentTime + delay;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, t0);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
        gain.gain.setValueAtTime(volume * (0, _settingsJs.soundSettings).volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        osc.connect(gain).connect(audio.destination);
        osc.start(t0);
        osc.stop(t0 + duration);
    } catch  {
    // Audio is best-effort; never let it break gameplay
    }
}
// A burst of filtered noise, for impacts and explosions
function noise({ duration = 0.3, volume = 0.4, delay = 0 }) {
    const audio = getContext();
    if (!audio) return;
    try {
        const t0 = audio.currentTime + delay;
        const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < data.length; i++)data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = audio.createBufferSource();
        src.buffer = buffer;
        const gain = audio.createGain();
        gain.gain.setValueAtTime(volume * (0, _settingsJs.soundSettings).volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        src.connect(gain).connect(audio.destination);
        src.start(t0);
    } catch  {
    // best-effort
    }
}
const sfx = {
    swing: ()=>tone({
            type: "sawtooth",
            from: 300,
            to: 80,
            duration: 0.08,
            volume: 0.15
        }),
    hit: ()=>tone({
            type: "square",
            from: 150,
            to: 60,
            duration: 0.12,
            volume: 0.25
        }),
    hurt: ()=>tone({
            type: "triangle",
            from: 220,
            to: 110,
            duration: 0.25,
            volume: 0.3
        }),
    pickup: ()=>{
        tone({
            type: "sine",
            from: 660,
            to: 880,
            duration: 0.08,
            volume: 0.25
        });
        tone({
            type: "sine",
            from: 880,
            to: 1320,
            duration: 0.1,
            volume: 0.2,
            delay: 0.08
        });
    },
    fuse: ()=>tone({
            type: "square",
            from: 1200,
            to: 1200,
            duration: 0.05,
            volume: 0.08
        }),
    explosion: ()=>{
        noise({
            duration: 0.5,
            volume: 0.5
        });
        tone({
            type: "sine",
            from: 100,
            to: 30,
            duration: 0.5,
            volume: 0.4
        });
    },
    guardDown: ()=>tone({
            type: "sawtooth",
            from: 200,
            to: 40,
            duration: 0.35,
            volume: 0.3
        }),
    unlock: ()=>{
        tone({
            type: "square",
            from: 500,
            to: 500,
            duration: 0.06,
            volume: 0.2
        });
        tone({
            type: "square",
            from: 750,
            to: 750,
            duration: 0.1,
            volume: 0.2,
            delay: 0.08
        });
    },
    disarm: ()=>tone({
            type: "sine",
            from: 900,
            to: 300,
            duration: 0.25,
            volume: 0.2
        }),
    gulp: ()=>{
        tone({
            type: "sine",
            from: 300,
            to: 150,
            duration: 0.1,
            volume: 0.25
        });
        tone({
            type: "sine",
            from: 350,
            to: 180,
            duration: 0.12,
            volume: 0.25,
            delay: 0.12
        });
    },
    chop: ()=>tone({
            type: "square",
            from: 120,
            to: 50,
            duration: 0.15,
            volume: 0.3
        }),
    levelComplete: ()=>{
        [
            523,
            659,
            784,
            1047
        ].forEach((f, i)=>tone({
                type: "triangle",
                from: f,
                to: f,
                duration: 0.15,
                volume: 0.25,
                delay: i * 0.12
            }));
    },
    gameOver: ()=>{
        [
            392,
            330,
            262,
            196
        ].forEach((f, i)=>tone({
                type: "triangle",
                from: f,
                to: f,
                duration: 0.25,
                volume: 0.25,
                delay: i * 0.2
            }));
    }
};

},{"./settings.js":"hBndc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1uqza":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _settingsJs = require("../utils/settings.js");
var _animatorJs = require("./animator.js");
var _animatorJsDefault = parcelHelpers.interopDefault(_animatorJs);
var _spriteManifestJs = require("../assets/sprite-manifest.js");
var _itemsJs = require("../items.js");
class Player extends (0, _entityJsDefault.default) {
    #health;
    #baseSpeed;
    #attackPower;
    #isHurt = false;
    #hurtInterval = null;
    #effectMs = {
        speed: 0,
        strength: 0,
        invincibility: 0
    };
    constructor(x, y, assets){
        super(x, y, "player", assets);
        this.#health = 100;
        this.#baseSpeed = (0, _settingsJs.playerSettings).speed;
        this.#attackPower = 50;
        this.powerups = [];
        // Item ids (see items.js) mapped to how many the player carries; the pack
        // survives level changes (see Game.initializePlayer) but not a new run
        this.inventory = {};
        // One weapon and one rune can be equipped at a time
        this.equipment = {
            weapon: null,
            rune: null
        };
        this.weaponId = "axe";
        this.animator = new (0, _animatorJsDefault.default)((0, _spriteManifestJs.playerSpriteManifest));
        this.currentFrame = 0;
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
    get attackPower() {
        let power = this.#attackPower;
        // Equipped weapon and rune bonuses
        for (const equippedId of Object.values(this.equipment)){
            const bonus = equippedId && (0, _itemsJs.itemCatalog)[equippedId].attackBonus;
            if (bonus) power += bonus;
        }
        if (this.#effectMs.strength > 0) power *= (0, _settingsJs.powerupSettings).strengthMultiplier;
        return power;
    }
    getSpeed() {
        let speed = this.#baseSpeed;
        if (this.#effectMs.speed > 0) speed += (0, _settingsJs.powerupSettings).speedBoost;
        const rune = this.equipment.rune;
        if (rune && (0, _itemsJs.itemCatalog)[rune].speedBonus) speed += (0, _itemsJs.itemCatalog)[rune].speedBonus;
        return speed;
    }
    getActiveEffects() {
        return Object.entries(this.#effectMs).filter(([, ms])=>ms > 0).map(([name, ms])=>({
                name,
                secondsLeft: Math.ceil(ms / 1000),
                msLeft: ms
            }));
    }
    hasEffect(name) {
        return this.#effectMs[name] > 0;
    }
    takeDamage(amount) {
        if (this.#effectMs.invincibility > 0) return;
        if (this.#isHurt || this.#health <= 0) return;
        if (this.equipment.rune === "runeWarding") amount = Math.ceil(amount / 2);
        this.#health = Math.max(0, this.#health - amount);
        if (this.#health <= 0) {
            this.defeat();
            return;
        }
        this.hurtAnimation();
    }
    respawn(x, y) {
        this._position = {
            x,
            y
        };
        this.#health = 100;
        // A short shield after respawning: a guard standing on the spawn point
        // could otherwise drain the fresh life before the player can react
        this.#effectMs = {
            speed: 0,
            strength: 0,
            invincibility: (0, _settingsJs.playerSettings).respawnProtectionMs
        };
        this.#isHurt = false;
        if (this.#hurtInterval) {
            clearInterval(this.#hurtInterval);
            this.#hurtInterval = null;
        }
        this.visible = true;
        this.movement = "down";
        this.animator.play("idle", {
            restart: true,
            direction: "down"
        });
        this.#syncAnimationState();
    }
    setMovement(direction) {
        if (direction) {
            this.movement = direction;
            this.animator.setDirection(direction);
        }
    }
    setWalking(isWalking) {
        this.animator.setState(isWalking ? "walk" : "idle");
        this.#syncAnimationState();
    }
    moveBy(deltaX, deltaY) {
        this._position.x += deltaX;
        this._position.y += deltaY;
        if (deltaX !== 0 || deltaY !== 0) {
            this.setMovement(Math.abs(deltaX) > Math.abs(deltaY) ? deltaX > 0 ? "right" : "left" : deltaY > 0 ? "down" : "up");
            this.setWalking(true);
        }
    }
    moveLeft(distance = this.getSpeed() / 60) {
        this.moveBy(-distance, 0);
    }
    moveRight(distance = this.getSpeed() / 60) {
        this.moveBy(distance, 0);
    }
    moveUp(distance = this.getSpeed() / 60) {
        this.moveBy(0, -distance);
    }
    moveDown(distance = this.getSpeed() / 60) {
        this.moveBy(0, distance);
    }
    attack() {
        this.animator.play("attack", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    pick() {
        this.animator.play("pick", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    axe() {
        const weapon = (0, _spriteManifestJs.playerSpriteManifest).weapons[this.weaponId];
        this.animator.play(weapon?.actionState || "axe", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    potion() {
        this.animator.play("potion", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    defeat() {
        this.animator.play("defeated", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    isDefeated() {
        return this.#health <= 0;
    }
    isActionActive(action = this.action) {
        return this.animator.isActiveWindow(action);
    }
    // --- Inventory ---------------------------------------------------------
    addItem(itemId) {
        this.inventory[itemId] = (this.inventory[itemId] || 0) + 1;
    }
    hasItem(itemId) {
        return (this.inventory[itemId] || 0) > 0;
    }
    removeItem(itemId) {
        if (!this.hasItem(itemId)) return false;
        this.inventory[itemId] -= 1;
        if (this.inventory[itemId] === 0) delete this.inventory[itemId];
        return true;
    }
    // Carried items in catalog order, for the inventory screen
    getInventoryEntries() {
        return Object.keys((0, _itemsJs.itemCatalog)).filter((id)=>this.hasItem(id)).map((id)=>({
                id,
                count: this.inventory[id]
            }));
    }
    // Consume one item and apply its effect. Returns true when consumed.
    useItem(itemId) {
        const item = (0, _itemsJs.itemCatalog)[itemId];
        if (!item || !this.hasItem(itemId)) return false;
        if (item.kind === "potion") {
            this.removeItem(itemId);
            this.#health = Math.min(100, this.#health + item.healAmount);
            return true;
        }
        return false;
    }
    // Equip a weapon or rune from the inventory, or take it off when it is
    // already worn. Returns "equipped", "unequipped" or null when the item
    // cannot be equipped.
    equip(itemId) {
        const item = (0, _itemsJs.itemCatalog)[itemId];
        if (!item || item.kind !== "weapon" && item.kind !== "rune") return null;
        if (!this.hasItem(itemId)) return null;
        if (this.equipment[item.kind] === itemId) {
            this.equipment[item.kind] = null;
            return "unequipped";
        }
        this.equipment[item.kind] = itemId;
        return "equipped";
    }
    applyPowerup(effect) {
        if (!effect) return;
        this.powerups.push(effect);
        switch(effect){
            case "health":
                this.#health = Math.min(100, this.#health + (0, _settingsJs.powerupSettings).healAmount);
                break;
            case "speed":
                this.#effectMs.speed = (0, _settingsJs.powerupSettings).speedDurationMs;
                break;
            case "strength":
                this.#effectMs.strength = (0, _settingsJs.powerupSettings).strengthDurationMs;
                break;
            case "invincibility":
                this.#effectMs.invincibility = (0, _settingsJs.powerupSettings).invincibilityDurationMs;
                break;
        }
    }
    update(deltaMs = 1000 / 60) {
        for (const name of Object.keys(this.#effectMs))this.#effectMs[name] = Math.max(0, this.#effectMs[name] - deltaMs);
        this.animator.update(deltaMs);
        this.#syncAnimationState();
    }
    checkCollision(direction, distance = this.getSpeed() / 60) {
        const nextPosition = {
            ...this._position
        };
        switch(direction){
            case "left":
                nextPosition.x -= distance;
                break;
            case "right":
                nextPosition.x += distance;
                break;
            case "up":
                nextPosition.y -= distance;
                break;
            case "down":
                nextPosition.y += distance;
                break;
        }
        return nextPosition;
    }
    hurtAnimation() {
        if (this.#isHurt) return;
        this.#isHurt = true;
        let flickerCount = 0;
        const maxFlickers = 10;
        const flickerDuration = 100;
        this.#hurtInterval = setInterval(()=>{
            this.visible = !this.visible;
            flickerCount++;
            if (flickerCount >= maxFlickers) {
                clearInterval(this.#hurtInterval);
                this.#hurtInterval = null;
                this.#isHurt = false;
                this.visible = true;
            }
        }, flickerDuration);
    }
    draw(ctx) {
        if (!this.visible) return;
        const frame = this.animator.getFrame(this.movement);
        const spriteSheet = this._sprites[frame.sheet];
        const pixelScale = (0, _settingsJs.canvasSettings).cellWidth / 32;
        const destWidth = frame.frameWidth * pixelScale;
        const destHeight = frame.frameHeight * pixelScale;
        const offsetX = ((0, _settingsJs.canvasSettings).cellWidth - destWidth) / 2;
        const offsetY = ((0, _settingsJs.canvasSettings).cellHeight - destHeight) / 2;
        ctx.save();
        if (frame.flip) {
            ctx.scale(-1, 1);
            ctx.drawImage(spriteSheet, frame.sourceX, frame.sourceY, frame.frameWidth, frame.frameHeight, -(this._position.x + offsetX) - destWidth, this._position.y + offsetY, destWidth, destHeight);
        } else ctx.drawImage(spriteSheet, frame.sourceX, frame.sourceY, frame.frameWidth, frame.frameHeight, this._position.x + offsetX, this._position.y + offsetY, destWidth, destHeight);
        ctx.restore();
    }
    #syncAnimationState() {
        this.action = this.animator.state;
        this.currentFrame = this.animator.frame;
    }
}
exports.default = Player;

},{"./entity.js":"4kBdl","../utils/settings.js":"hBndc","./animator.js":"hma7Y","../assets/sprite-manifest.js":"kdgDE","../items.js":"8gP9P","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4kBdl":[function(require,module,exports) {
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

},{"../utils/settings.js":"hBndc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hma7Y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Animator {
    constructor(manifest){
        this.manifest = manifest;
        this.state = manifest.defaultState || "idle";
        this.direction = manifest.defaultDirection || "down";
        this.elapsedMs = 0;
        this.frame = 0;
        this.complete = false;
    }
    #definition(state = this.state) {
        const weaponStates = Object.values(this.manifest.weapons || {}).flatMap((weapon)=>Object.entries(weapon.states || {}));
        const weaponState = weaponStates.find(([name])=>name === state);
        return weaponState ? weaponState[1] : this.manifest.states[state];
    }
    setDirection(direction) {
        if (direction) this.direction = direction;
    }
    play(state, { restart = false, direction = null } = {}) {
        if (direction) this.setDirection(direction);
        if (!restart && this.state === state) return;
        this.state = state;
        this.elapsedMs = 0;
        this.frame = 0;
        this.complete = false;
    }
    setState(state, options = {}) {
        const current = this.#definition();
        if (current?.oneShot && !this.complete && !options.force) return;
        this.play(state, options);
    }
    update(deltaMs) {
        const definition = this.#definition();
        if (!definition || this.complete && definition.holdLast) return;
        this.elapsedMs += deltaMs;
        const frameDuration = definition.frameDurationMs || 120;
        const frameCount = definition.frames || 1;
        const nextFrame = Math.floor(this.elapsedMs / frameDuration);
        if (definition.oneShot && nextFrame >= frameCount) {
            this.complete = true;
            if (definition.holdLast) {
                this.frame = frameCount - 1;
                return;
            }
            this.play(definition.returnTo || this.manifest.defaultState || "idle", {
                restart: true
            });
            return;
        }
        this.frame = nextFrame % frameCount;
    }
    isComplete(state = this.state) {
        return this.state === state && this.complete;
    }
    isActiveWindow(state = this.state) {
        const definition = this.#definition(state);
        if (!definition || this.state !== state) return false;
        const start = definition.activeStartMs ?? 0;
        const end = definition.activeEndMs ?? Number.POSITIVE_INFINITY;
        return this.elapsedMs >= start && this.elapsedMs <= end;
    }
    getFrame(direction = this.direction) {
        const definition = this.#definition();
        const rows = definition.rows || {};
        const row = rows[direction] ?? rows.down ?? 0;
        return {
            state: this.state,
            sheet: definition.sheet,
            frameWidth: definition.frameWidth,
            frameHeight: definition.frameHeight,
            sourceX: this.frame * definition.frameWidth,
            sourceY: row * definition.frameHeight,
            flip: direction === "left" && Boolean(definition.flipLeft)
        };
    }
}
exports.default = Animator;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kdgDE":[function(require,module,exports) {
// Sprite sheet metadata. Keep animation layout here so adding a new hero
// weapon or generated sheet does not require rewriting entity draw code.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "directions", ()=>directions);
parcelHelpers.export(exports, "playerSpriteManifest", ()=>playerSpriteManifest);
parcelHelpers.export(exports, "guardSpriteManifest", ()=>guardSpriteManifest);
const directions = {
    down: "down",
    up: "up",
    left: "left",
    right: "right"
};
const playerSpriteManifest = {
    defaultState: "idle",
    defaultDirection: directions.down,
    sheets: {
        movement: "movement",
        actions: "actions"
    },
    states: {
        idle: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 6,
            frameDurationMs: 150,
            rows: {
                down: 0,
                left: 1,
                right: 1,
                up: 2
            },
            flipLeft: true
        },
        walk: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 6,
            frameDurationMs: 90,
            rows: {
                down: 0,
                left: 4,
                right: 4,
                up: 2
            },
            flipLeft: true
        },
        attack: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 4,
            frameDurationMs: 80,
            rows: {
                down: 6,
                left: 7,
                right: 7,
                up: 8
            },
            flipLeft: true,
            oneShot: true,
            returnTo: "idle",
            activeStartMs: 0,
            activeEndMs: 220
        },
        pick: {
            sheet: "actions",
            frameWidth: 48,
            frameHeight: 48,
            frames: 2,
            frameDurationMs: 120,
            rows: {
                down: 1,
                left: 0,
                right: 0,
                up: 2
            },
            flipLeft: true,
            oneShot: true,
            returnTo: "idle"
        },
        potion: {
            sheet: "actions",
            frameWidth: 48,
            frameHeight: 48,
            frames: 2,
            frameDurationMs: 130,
            rows: {
                down: 9,
                left: 9,
                right: 9,
                up: 10
            },
            flipLeft: true,
            oneShot: true,
            returnTo: "idle"
        },
        defeated: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 6,
            frameDurationMs: 130,
            rows: {
                down: 9,
                left: 9,
                right: 9,
                up: 9
            },
            flipLeft: true,
            oneShot: true,
            holdLast: true
        }
    },
    weapons: {
        axe: {
            actionState: "axe",
            states: {
                axe: {
                    sheet: "actions",
                    frameWidth: 48,
                    frameHeight: 48,
                    frames: 2,
                    frameDurationMs: 110,
                    rows: {
                        down: 10,
                        left: 10,
                        right: 10,
                        up: 10
                    },
                    flipLeft: true,
                    oneShot: true,
                    returnTo: "idle",
                    activeStartMs: 0,
                    activeEndMs: 210
                }
            }
        }
    }
};
const guardSpriteManifest = {
    defaultState: "idle",
    defaultDirection: directions.down,
    states: {
        idle: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 4,
            frameDurationMs: 180,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            }
        },
        walk: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 6,
            frameDurationMs: 95,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            }
        },
        attack: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 8,
            frameDurationMs: 65,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            },
            oneShot: true,
            returnTo: "idle"
        },
        hurt: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 6,
            frameDurationMs: 70,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            },
            oneShot: true,
            returnTo: "idle"
        },
        dead: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 8,
            frameDurationMs: 80,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            },
            oneShot: true,
            holdLast: true
        }
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8gP9P":[function(require,module,exports) {
// Item catalog
// - Single source of truth for every item that can live in the player's
//   inventory: pickups, guard drops, weapons and runes
// - `icon` refers to a key in the itemAssets loaded by assets.js
// - Weapons and runes are equipped from the inventory screen (one of each);
//   their bonuses are applied by the Player while equipped
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "itemCatalog", ()=>itemCatalog);
parcelHelpers.export(exports, "guardDropPool", ()=>guardDropPool);
const itemCatalog = {
    key: {
        name: "Key",
        article: "a",
        kind: "key",
        icon: "key",
        description: "Unlocks a locked door \u2014 walk into the door while carrying it."
    },
    potion: {
        name: "Health Potion",
        article: "a",
        kind: "potion",
        icon: "potion",
        healAmount: 50,
        description: "Restores 50 health. Press 'u' or click it here to drink one."
    },
    explosive: {
        name: "Explosive",
        article: "an",
        kind: "explosive",
        icon: "explosive",
        description: "Unstable and powerful. No use for it yet \u2014 handle with care."
    },
    steelSword: {
        name: "Steel Sword",
        article: "a",
        kind: "weapon",
        icon: "steelSword",
        attackBonus: 25,
        description: "A sturdy blade. +25 attack power while equipped."
    },
    warAxe: {
        name: "War Axe",
        article: "a",
        kind: "weapon",
        icon: "warAxe",
        attackBonus: 50,
        description: "Heavy and brutal. +50 attack power while equipped."
    },
    runeHaste: {
        name: "Rune of Haste",
        article: "a",
        kind: "rune",
        icon: "runeHaste",
        speedBonus: 120,
        description: "Ancient stone humming with energy. Move faster while equipped."
    },
    runeMight: {
        name: "Rune of Might",
        article: "a",
        kind: "rune",
        icon: "runeMight",
        attackBonus: 25,
        description: "Burns with orcish rage. +25 attack power while equipped."
    },
    runeWarding: {
        name: "Rune of Warding",
        article: "a",
        kind: "rune",
        icon: "runeWarding",
        description: "A protective sigil. Halves all damage taken while equipped."
    }
};
const guardDropPool = [
    "potion",
    "potion",
    "steelSword",
    "warAxe",
    "runeHaste",
    "runeMight",
    "runeWarding"
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"57eJ8":[function(require,module,exports) {
// Level data
// - Define the structure of each level (layout of the labyrinth)
// - Specify positions of obstacles, powerups, explosives, guards
// - Include metadata (level number, difficulty, name)
//
// Layout legend:
//   '#' wall          ' ' floor         'P' player spawn   'X' exit
//   'T' tree (solid, choppable)         'O' boulder (solid, choppable)
//   'G' guard         'B' boss          'C' crystal        'E' explosive
//   'D' locked door (a defeated guard drops the key)
//
// Every layout is 10 rows of exactly 20 characters. Trees and boulders can
// be chopped down (2 hits), so they make soft walls: a shortcut for players
// willing to stop and swing, a detour for those who keep running.
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
    constructor(number, difficulty, layout, name, options = {}){
        this.number = number;
        this.difficulty = difficulty;
        this.layout = layout;
        this.name = name;
        this.theme = options.theme || "forest";
        // With fog of war on, only explored parts of the map are visible
        this.fogOfWar = Boolean(options.fogOfWar);
    }
}
// Rows are written as strings for readability and converted to the
// character arrays the game consumes
const parse = (rows)=>rows.map((row)=>row.split(""));
const levelData = new LevelData();
// 1. The Glade — tutorial: a small maze inside a forest clearing. One tree
// blocks a corridor (teaches chopping), one boulder guards a dead end.
levelData.addLevel(new Level(1, "easy", parse([
    "TTTTTTTTTTTTTTTTTTTT",
    "T##################T",
    "T#  G #PT     C   #T",
    "T# ## #   ####### #T",
    "T#    #O#  C # ## #T",
    "T# ## # ##   #    #T",
    "T#  # #    #   ## #T",
    "T# ## E ##G# X ## #T",
    "T##################T",
    "TTTTTTTTTTTTTTTTTTTT"
]), "The Glade", {
    theme: "forest"
}));
// 2. The Gatehouse — first locked door: defeat a guard to find the key
levelData.addLevel(new Level(2, "easy", parse([
    "####################",
    "#P  #G  #####      #",
    "# # # #   #   #### #",
    "#     # # ## #     #",
    "#########    #D#####",
    "#X G    ######     #",
    "# # ###    #G##### #",
    "#     ###    #   # #",
    "#   #     ##   #   #",
    "####################"
]), "The Gatehouse", {
    theme: "forest"
}));
// 3. The Orchard — rows of trees form choppable gates between corridors:
// chop straight through or walk around via the side openings
levelData.addLevel(new Level(3, "medium", parse([
    "####################",
    "#P  TT   C  TT    C#",
    "#   TT      TT     #",
    "##T####T######T##T##",
    "#   G     E    G   #",
    "#C  TT      TT     #",
    "##T####T######T# ###",
    "#   G     C  G     #",
    "#  TTT      TT    X#",
    "####################"
]), "The Orchard", {
    theme: "forest"
}));
// 4. The Quarry — boulders plug the wall gaps: every shortcut costs two
// swings of the axe, every detour risks a patrol
levelData.addLevel(new Level(4, "medium", parse([
    "####################",
    "#P   #  C  O  G   C#",
    "#    O     #       #",
    "## ###### ####O### #",
    "#  G   #     C   G #",
    "#    O #  E #      #",
    "# #### ##O### ###O##",
    "#  C      #     G  #",
    "#    G    O   C   X#",
    "####################"
]), "The Quarry", {
    theme: "desert"
}));
// 5. The Warden — the first boss guards the open eastern arena. It is slow:
// keep moving, land a swing, and step away before it closes in.
levelData.addLevel(new Level(5, "medium", parse([
    "####################",
    "#P #  C    #      C#",
    "#  # ## ## #  ### ##",
    "# G#  #  # #       #",
    "#  ## # ###    B   #",
    "#     #            #",
    "# ###### ###   ### #",
    "# C #  G   #       #",
    "#   #      ##  X   #",
    "####################"
]), "The Warden", {
    theme: "desert"
}));
// 6. Twin Halls — two halls behind two locked doors: the guards of each
// hall carry the key to the next
levelData.addLevel(new Level(6, "hard", parse([
    "####################",
    "#P   #  G   #  C  G#",
    "#  C #      #      #",
    "# G  #  E   #  ##  #",
    "#    D      D  ## X#",
    "#  ###      #      #",
    "#    #  C   #   G  #",
    "# ## #      # ###  #",
    "#  G #   G  #  C   #",
    "####################"
]), "Twin Halls", {
    theme: "snow"
}));
// 7. The Serpent — one long winding corridor walked in the dark: fog of
// war hides what waits beyond the next bend. Gates of trees and boulders
// plug the wall gaps.
levelData.addLevel(new Level(7, "hard", parse([
    "####################",
    "#P  C      G      G#",
    "################## #",
    "#    G     C      T#",
    "#T##################",
    "# G     E     C    #",
    "##################O#",
    "#  G     C    G    #",
    "#X                T#",
    "####################"
]), "The Serpent", {
    theme: "snow",
    fogOfWar: true
}));
// 8. The Crossroads — four guarded quadrants around a central plaza where
// a boss patrols the loot
levelData.addLevel(new Level(8, "hard", parse([
    "####################",
    "#P   #   C  #     G#",
    "#  G #      #  C   #",
    "#### ## ## ## # ####",
    "#      G           #",
    "#  C     B      E  #",
    "#### ## ## ## # ####",
    "#  G #      #   G  #",
    "#    # C    #    X #",
    "####################"
]), "The Crossroads", {
    theme: "dungeon"
}));
// 9. The Gauntlet — four chambers in a row, each sealed by a locked door;
// every chamber's guards carry the next key
levelData.addLevel(new Level(9, "expert", parse([
    "####################",
    "#P  #C  G#   G# C  #",
    "#   #    #    #    #",
    "# G D  G D  E D  G #",
    "#   #    #    #    #",
    "## ## ## # ## ## ###",
    "#C  #  G #  G #   G#",
    "#   #    #    #  ###",
    "# G #  C #  C #  X##",
    "####################"
]), "The Gauntlet", {
    theme: "dungeon",
    fogOfWar: true
}));
// 10. The Throne — the final boss waits in an inner sanctum behind a locked
// door, with the exit at its back. Sneak past it or bring it down for glory.
levelData.addLevel(new Level(10, "expert", parse([
    "####################",
    "#P   #     C    G  #",
    "# G  # ##########  #",
    "#    # #      X##  #",
    "## # # #  B    ## C#",
    "#  # # #       ##  #",
    "#  #   ####D##### G#",
    "#E ## G    C     ###",
    "#C     ##     G   T#",
    "####################"
]), "The Throne", {
    theme: "dungeon",
    fogOfWar: true
}));
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
        this._sprite = assets.wall;
    }
    getType() {
        return this.#type;
    }
    update() {
    // Update wall state if needed (e.g., for breakable walls)
    }
    draw(ctx) {
        ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
    }
}
exports.default = Wall;

},{"./entity.js":"4kBdl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"590U3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _settingsJs = require("../utils/settings.js");
// Explosive entity — a hidden trap
// - Starts hidden. When the player comes close it reveals itself and arms:
//   a short fuse starts burning (the bomb flashes faster and faster).
// - When the fuse runs out it detonates, damaging the player AND any guards
//   inside the blast radius. The game reads the blast via consumeBlast().
// - An armed trap can be disarmed with the pick action before it blows.
// - Drawn procedurally (bomb + fuse spark + expanding blast), no sprite needed.
const EXPLOSION_ANIMATION_MS = 350;
class Explosive extends (0, _entityJsDefault.default) {
    #state = "hidden";
    #fuseMs = (0, _settingsJs.entitySettings).explosiveFuseMs;
    #explosionMs = EXPLOSION_ANIMATION_MS;
    #blastConsumed = false;
    constructor(x, y){
        super(x, y, "explosive");
    }
    isHidden() {
        return this.#state === "hidden";
    }
    isArmed() {
        return this.#state === "armed";
    }
    isExploding() {
        return this.#state === "exploding";
    }
    // Finished exploding; safe to remove from the game
    isDone() {
        return this.#state === "done";
    }
    getCenter() {
        return {
            x: this._position.x + this._width / 2,
            y: this._position.y + this._height / 2
        };
    }
    // The blast is applied exactly once, on the frame the fuse runs out.
    // Returns the blast circle on that frame, null otherwise.
    consumeBlast() {
        if (this.#state !== "exploding" || this.#blastConsumed) return null;
        this.#blastConsumed = true;
        return {
            ...this.getCenter(),
            radius: (0, _settingsJs.entitySettings).explosiveBlastRadius
        };
    }
    update(playerHitBox, deltaMs = 1000 / 60) {
        switch(this.#state){
            case "hidden":
                {
                    if (!playerHitBox) break;
                    const center = this.getCenter();
                    const px = playerHitBox.x + playerHitBox.width / 2;
                    const py = playerHitBox.y + playerHitBox.height / 2;
                    const distance = Math.hypot(px - center.x, py - center.y);
                    if (distance <= (0, _settingsJs.entitySettings).explosiveTriggerRange) this.#state = "armed";
                    break;
                }
            case "armed":
                this.#fuseMs -= deltaMs;
                if (this.#fuseMs <= 0) this.#state = "exploding";
                break;
            case "exploding":
                this.#explosionMs -= deltaMs;
                if (this.#explosionMs <= 0) this.#state = "done";
                break;
        }
    }
    draw(ctx) {
        if (this.#state === "hidden" || this.#state === "done") return;
        const center = this.getCenter();
        ctx.save();
        if (this.#state === "armed") {
            // Bomb body
            ctx.fillStyle = "#1c1c1c";
            ctx.beginPath();
            ctx.arc(center.x, center.y + 6, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();
            // Fuse
            ctx.strokeStyle = "#8B4513";
            ctx.beginPath();
            ctx.moveTo(center.x, center.y - 10);
            ctx.quadraticCurveTo(center.x + 10, center.y - 20, center.x + 14, center.y - 14);
            ctx.stroke();
            // Spark, flickering
            ctx.fillStyle = Math.floor(this.#fuseMs / 130) % 2 === 0 ? "#ffd54f" : "#ff7043";
            ctx.beginPath();
            ctx.arc(center.x + 14, center.y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            // Red warning flash that speeds up as the fuse burns down
            const flashPeriodMs = this.#fuseMs > (0, _settingsJs.entitySettings).explosiveFuseMs / 2 ? 330 : 130;
            if (this.#fuseMs % flashPeriodMs < flashPeriodMs / 2) {
                ctx.fillStyle = "rgba(255, 40, 40, 0.25)";
                ctx.beginPath();
                ctx.arc(center.x, center.y, (0, _settingsJs.entitySettings).explosiveBlastRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Expanding blast rings
            const progress = 1 - this.#explosionMs / EXPLOSION_ANIMATION_MS;
            const radius = (0, _settingsJs.entitySettings).explosiveBlastRadius * progress;
            const alpha = 1 - progress;
            ctx.fillStyle = `rgba(255, 160, 30, ${alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, 240, 120, ${alpha})`;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
exports.default = Explosive;

},{"./entity.js":"4kBdl","../utils/settings.js":"hBndc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bFjVQ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _settingsJs = require("../utils/settings.js");
var _gameJs = require("../utils/game.js");
var _rngJs = require("../utils/rng.js");
var _animatorJs = require("./animator.js");
var _animatorJsDefault = parcelHelpers.interopDefault(_animatorJs);
var _spriteManifestJs = require("../assets/sprite-manifest.js");
class Guard extends (0, _entityJsDefault.default) {
    #speed;
    #detectionRange;
    #health;
    #maxHealth;
    #currentSprite;
    #defeatAwarded = false;
    // Time the health bar stays visible after the last hit
    #healthBarMs = 0;
    // Active knockback push: direction vector plus remaining duration
    #knockback = null;
    #isBoss;
    constructor(x, y, type, assets, { boss = false } = {}){
        super(x, y, type, assets, boss ? (0, _settingsJs.bossSettings).width : (0, _settingsJs.entitySettings).enemyWidth, boss ? (0, _settingsJs.bossSettings).height : (0, _settingsJs.entitySettings).enemyHeight);
        this.#isBoss = boss;
        this.animator = new (0, _animatorJsDefault.default)((0, _spriteManifestJs.guardSpriteManifest));
        this.movement = [
            "down",
            "up",
            "left",
            "right"
        ][(0, _rngJs.randomInt)(0, 3)];
        this.animator.setDirection(this.movement);
        this.action = "idle";
        this.damage = boss ? (0, _settingsJs.bossSettings).damage : 10;
        this.#maxHealth = boss ? (0, _settingsJs.bossSettings).health : 100;
        this.#health = this.#maxHealth;
        this.#speed = boss ? (0, _settingsJs.bossSettings).speed : 60; // pixels per second
        this.#detectionRange = (boss ? (0, _settingsJs.bossSettings).detectionRangeCells : 5) * (0, _settingsJs.canvasSettings).cellWidth;
        this.#currentSprite = this._sprites.idle;
        this.currentFrame = 0;
    }
    isBoss() {
        return this.#isBoss;
    }
    // The sprite frame has generous transparent padding, so contact damage
    // uses a tighter box that matches the visible body instead of the full
    // drawn rectangle
    getHitBox() {
        const insetX = this._width * 0.2;
        const insetY = this._height * 0.2;
        return {
            x: this._position.x + insetX,
            y: this._position.y + insetY,
            width: this._width - insetX * 2,
            height: this._height - insetY * 2
        };
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
    #setSpriteForAction(action) {
        switch(action){
            case "attack":
                this.#currentSprite = this._sprites.attack;
                break;
            case "dead":
                this.#currentSprite = this._sprites.death;
                break;
            case "hurt":
                this.#currentSprite = this._sprites.hurt;
                break;
            case "walk":
                this.#currentSprite = this._sprites.walk;
                break;
            case "idle":
            default:
                this.#currentSprite = this._sprites.idle;
                break;
        }
    }
    #syncAnimationState() {
        this.action = this.animator.state;
        this.currentFrame = this.animator.frame;
        this.#setSpriteForAction(this.action);
    }
    moveTowards(target, walls, deltaMs = 1000 / 60) {
        if (this.isDefeated()) return;
        const dx = target.x - this._position.x;
        const dy = target.y - this._position.y;
        if (Math.abs(dx) > Math.abs(dy)) this.movement = dx > 0 ? "right" : "left";
        else this.movement = dy > 0 ? "down" : "up";
        this.animator.setDirection(this.movement);
        const distance = this.#speed * (deltaMs / 1000);
        const nextPosition = {
            ...this._position,
            width: (0, _settingsJs.canvasSettings).cellWidth / 2,
            height: (0, _settingsJs.canvasSettings).cellHeight / 2
        };
        switch(this.movement){
            case "up":
                nextPosition.y -= distance;
                break;
            case "down":
                nextPosition.y += distance;
                break;
            case "left":
                nextPosition.x -= distance;
                break;
            case "right":
                nextPosition.x += distance;
                break;
        }
        const willCollideWithWalls = walls.some((wall)=>(0, _gameJs.isColliding)(nextPosition, wall.getHitBox()));
        const willCollideWithPlayer = (0, _gameJs.isColliding)(nextPosition, target);
        if (willCollideWithPlayer) this.attack();
        else if (!willCollideWithWalls) {
            this._position = {
                x: nextPosition.x,
                y: nextPosition.y
            };
            this.walk();
        } else this.idle();
    }
    detectPlayer(playerPosition, walls) {
        if (this.isDefeated()) return false;
        const dx = playerPosition.x - this._position.x;
        const dy = playerPosition.y - this._position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= this.#detectionRange) {
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
                checkPosition.y += step.y * ((0, _settingsJs.canvasSettings).cellHeight / 2);
                if (walls.some((wall)=>(0, _gameJs.isColliding)(checkPosition, wall.getHitBox()))) return false;
            }
            return true;
        }
        return false;
    }
    idle() {
        this.animator.setState("idle");
        this.#syncAnimationState();
    }
    walk() {
        this.animator.setState("walk");
        this.#syncAnimationState();
    }
    attack() {
        this.animator.play("attack", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    hurt() {
        this.animator.play("hurt", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    // Apply damage from the player. `fromDirection` is the direction the
    // player was facing, so the guard is knocked back away from the swing.
    takeDamage(amount, fromDirection = null) {
        if (this.#health <= 0) return false;
        this.#health = Math.max(0, this.#health - amount);
        this.#healthBarMs = (0, _settingsJs.combatSettings).healthBarVisibleMs;
        if (this.#health <= 0) {
            this.defeat();
            return true;
        }
        // Bosses are too heavy to be pushed around
        if (fromDirection && !this.#isBoss) {
            const push = {
                up: {
                    x: 0,
                    y: -1
                },
                down: {
                    x: 0,
                    y: 1
                },
                left: {
                    x: -1,
                    y: 0
                },
                right: {
                    x: 1,
                    y: 0
                }
            }[fromDirection];
            if (push) this.#knockback = {
                ...push,
                msLeft: (0, _settingsJs.combatSettings).knockbackDurationMs
            };
        }
        this.hurt();
        return false;
    }
    getHealth() {
        return this.#health;
    }
    getMaxHealth() {
        return this.#maxHealth;
    }
    isHealthBarVisible() {
        // A boss always shows its health bar, so the danger (and progress
        // against it) is visible before the first hit lands
        return !this.isDefeated() && (this.#isBoss || this.#healthBarMs > 0);
    }
    isDefeated() {
        return this.#health <= 0;
    }
    consumeDefeatAward() {
        if (!this.isDefeated() || this.#defeatAwarded) return false;
        this.#defeatAwarded = true;
        return true;
    }
    isReadyToRemove() {
        return this.isDefeated() && this.animator.isComplete("dead");
    }
    defeat() {
        this.#health = 0;
        this.animator.play("dead", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    lookAround() {
        const directions = [
            "up",
            "right",
            "down",
            "left"
        ];
        const currentIndex = directions.indexOf(this.movement);
        this.movement = currentIndex !== -1 ? directions[(currentIndex + 1) % 4] : "up";
        this.animator.setDirection(this.movement);
        this.idle();
    }
    update(playerPosition, walls, deltaMs = 1000 / 60) {
        this.animator.update(deltaMs);
        this.#syncAnimationState();
        this.#healthBarMs = Math.max(0, this.#healthBarMs - deltaMs);
        if (this.isDefeated()) return;
        // A knockback push overrides normal movement while it lasts
        if (this.#knockback) {
            this.#applyKnockback(walls, deltaMs);
            return;
        }
        if (this.detectPlayer(playerPosition, walls)) this.moveTowards(playerPosition, walls, deltaMs);
        else this.idle();
    }
    #applyKnockback(walls, deltaMs) {
        const distance = (0, _settingsJs.combatSettings).knockbackSpeed * (deltaMs / 1000);
        const nextPosition = {
            x: this._position.x + this.#knockback.x * distance,
            y: this._position.y + this.#knockback.y * distance,
            width: (0, _settingsJs.canvasSettings).cellWidth / 2,
            height: (0, _settingsJs.canvasSettings).cellHeight / 2
        };
        const blocked = walls.some((wall)=>(0, _gameJs.isColliding)(nextPosition, wall.getHitBox()));
        if (!blocked) this._position = {
            x: nextPosition.x,
            y: nextPosition.y
        };
        this.#knockback.msLeft -= deltaMs;
        if (this.#knockback.msLeft <= 0 || blocked) this.#knockback = null;
    }
    draw(ctx) {
        const frame = this.animator.getFrame(this.movement);
        ctx.drawImage(this.#currentSprite, frame.sourceX, frame.sourceY, frame.frameWidth, frame.frameHeight, this._position.x - 10, this._position.y - 10, this._width, this._height);
        this.#drawHealthBar(ctx);
    }
    // Small health bar above the guard, visible for a few seconds after a hit.
    // A boss bar is wider and permanently visible.
    #drawHealthBar(ctx) {
        if (!this.isHealthBarVisible()) return;
        const barWidth = this.#isBoss ? 96 : 48;
        const barHeight = this.#isBoss ? 8 : 6;
        const barX = this._position.x + (this._width - barWidth) / 2 - 10;
        const barY = this._position.y - 20;
        const ratio = this.#health / this.#maxHealth;
        ctx.save();
        // Fade out during the last second on screen (boss bars never fade)
        ctx.globalAlpha = this.#isBoss ? 1 : Math.min(1, this.#healthBarMs / 1000);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        ctx.fillStyle = "#555";
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = ratio > 0.5 ? "#4caf50" : ratio > 0.25 ? "#ff9800" : "#c62828";
        ctx.fillRect(barX, barY, barWidth * ratio, barHeight);
        ctx.restore();
    }
}
exports.default = Guard;

},{"./entity.js":"4kBdl","../utils/settings.js":"hBndc","../utils/game.js":"jBBaN","../utils/rng.js":"7uRsi","./animator.js":"hma7Y","../assets/sprite-manifest.js":"kdgDE","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"14cf6":[function(require,module,exports) {
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
        if (type === "boulder") this._sprite = assets.boulder;
        else if (type === "tree") {
            const trees = assets.trees || [
                assets.palm1,
                assets.palm2
            ].filter(Boolean);
            this._sprite = trees.length ? trees[(0, _rngJs.randomInt)(1, trees.length) - 1] : assets.boulder;
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
parcelHelpers.export(exports, "powerupDescriptions", ()=>powerupDescriptions);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
const powerupDescriptions = {
    health: "Red Crystal \u2014 restores 25 health",
    speed: "Blue Crystal \u2014 speed boost for 10 seconds!",
    strength: "Green Crystal \u2014 double attack power for 10 seconds!",
    invincibility: "Yellow Crystal \u2014 invincible for 10 seconds!"
};
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
        this._sprite = assets.exit || assets.yellowRuin;
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

},{"./entity.js":"4kBdl","../utils/rng.js":"7uRsi","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3BhaU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
var _itemsJs = require("../items.js");
// Drop entity class
// - An item lying on the ground after a guard is defeated
// - Bobs gently so it stands out from the scenery
// - Picked up (into the player's inventory) on contact; see Game.checkCollisions
class Drop extends (0, _entityJsDefault.default) {
    #ageMs = 0;
    constructor(x, y, itemId, itemAssets){
        super(x, y, itemId, itemAssets);
    }
    selectSprites(assets) {
        return {
            icon: assets[(0, _itemsJs.itemCatalog)[this._type].icon]
        };
    }
    update(deltaMs = 1000 / 60) {
        this.#ageMs += deltaMs;
    }
    draw(ctx) {
        // Drawn smaller than a full cell so it reads as loot, not scenery
        const size = 40;
        const bob = Math.sin(this.#ageMs / 300) * 3;
        ctx.drawImage(this._sprites.icon, this._position.x + (this._width - size) / 2, this._position.y + (this._height - size) / 2 + bob, size, size);
    }
}
exports.default = Drop;

},{"./entity.js":"4kBdl","../items.js":"8gP9P","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8XUaB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _entityJs = require("./entity.js");
var _entityJsDefault = parcelHelpers.interopDefault(_entityJs);
// Door entity class
// - A locked wooden door that blocks a corridor inside the maze ('D' tile)
// - Blocks the player and guards like a wall while locked
// - Walking into it while carrying a key unlocks it (see Game.checkDoorUnlock);
//   once open it disappears and the corridor is free
class Door extends (0, _entityJsDefault.default) {
    constructor(x, y, assets){
        super(x, y, "door", assets);
        this.locked = true;
    }
    selectSprites(assets) {
        return {
            door: assets.door
        };
    }
    unlock() {
        this.locked = false;
    }
    draw(ctx) {
        if (!this.locked) return; // an opened door leaves a free passage
        ctx.drawImage(this._sprites.door, this._position.x, this._position.y, this._width, this._height);
        // A padlock signals that the door needs a key
        const lockX = this._position.x + this._width / 2 - 9;
        const lockY = this._position.y + this._height / 2 - 2;
        ctx.save();
        // Shackle
        ctx.strokeStyle = "#cfd8dc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(lockX + 9, lockY + 2, 6, Math.PI, 0);
        ctx.stroke();
        // Body
        ctx.fillStyle = "#ffd54f";
        ctx.fillRect(lockX, lockY + 2, 18, 14);
        // Keyhole
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(lockX + 7, lockY + 6, 4, 7);
        ctx.restore();
    }
}
exports.default = Door;

},{"./entity.js":"4kBdl","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d5R3E":[function(require,module,exports) {
// Per-level visual theme registry.
// Theme entries point at keys in the loaded level-assets object.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DEFAULT_THEME", ()=>DEFAULT_THEME);
parcelHelpers.export(exports, "THEMES", ()=>THEMES);
parcelHelpers.export(exports, "getTheme", ()=>getTheme);
parcelHelpers.export(exports, "resolveThemeAssets", ()=>resolveThemeAssets);
const DEFAULT_THEME = "forest";
const THEMES = {
    forest: {
        name: "Forest",
        floor: "grassTile",
        wall: "wall",
        trees: [
            "palm1",
            "palm2",
            "tree1",
            "tree2",
            "tree3"
        ],
        boulder: "boulder",
        exit: "yellowRuin",
        floorFallback: "#2f7d3b"
    },
    desert: {
        name: "Desert Ruins",
        floor: "desertFloor",
        wall: "desertWall",
        trees: [
            "desertTree1",
            "desertTree2"
        ],
        boulder: "desertBoulder",
        exit: "desertExit",
        floorFallback: "#b8904d"
    },
    snow: {
        name: "Frozen Halls",
        floor: "snowFloor",
        wall: "snowWall",
        trees: [
            "snowTree1",
            "snowTree2"
        ],
        boulder: "snowBoulder",
        exit: "snowExit",
        floorFallback: "#d8e7ef"
    },
    dungeon: {
        name: "Dungeon Depths",
        floor: "dungeonFloor",
        wall: "dungeonWall",
        trees: [
            "dungeonObstacle1",
            "dungeonObstacle2"
        ],
        boulder: "dungeonBoulder",
        exit: "dungeonExit",
        floorFallback: "#27262d"
    }
};
const assetFromTheme = (levelAssets, theme, fallbackTheme, key)=>levelAssets[theme[key]] || levelAssets[fallbackTheme[key]];
function getTheme(themeId) {
    return THEMES[themeId] || THEMES[DEFAULT_THEME];
}
function resolveThemeAssets(levelAssets, themeId = DEFAULT_THEME) {
    const theme = getTheme(themeId);
    const fallbackTheme = THEMES[DEFAULT_THEME];
    const trees = theme.trees.map((key)=>levelAssets[key]).filter(Boolean);
    return {
        id: THEMES[themeId] ? themeId : DEFAULT_THEME,
        name: theme.name,
        floor: assetFromTheme(levelAssets, theme, fallbackTheme, "floor"),
        wall: assetFromTheme(levelAssets, theme, fallbackTheme, "wall"),
        trees: trees.length ? trees : fallbackTheme.trees.map((key)=>levelAssets[key]).filter(Boolean),
        boulder: assetFromTheme(levelAssets, theme, fallbackTheme, "boulder"),
        exit: assetFromTheme(levelAssets, theme, fallbackTheme, "exit"),
        floorFallback: theme.floorFallback || fallbackTheme.floorFallback
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2MtDO":[function(require,module,exports) {
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
parcelHelpers.export(exports, "loadItemAssets", ()=>loadItemAssets);
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
    const grassTile = await loadImage(new URL(require("1d5dcd0f193cb1ce")).href, onProgress);
    const wall = await loadImage(new URL(require("e544f926ea4eae58")).href, onProgress);
    const boulder = await loadImage(new URL(require("c7cde1bd730e6a2")).href, onProgress);
    const rock = await loadImage(new URL(require("1090cc123f927509")).href, onProgress);
    const tree1 = await loadImage(new URL(require("3f5ed577d5909e0d")).href, onProgress);
    const tree2 = await loadImage(new URL(require("58ff784648728cf8")).href, onProgress);
    const tree3 = await loadImage(new URL(require("6d9a56da4d55f52c")).href, onProgress);
    const palm1 = await loadImage(new URL(require("cf0bb9cdce36df0b")).href, onProgress);
    const palm2 = await loadImage(new URL(require("af258d76c374145f")).href, onProgress);
    const sandRuin = await loadImage(new URL(require("80e7c00fdd98ae89")).href, onProgress);
    const snowRuin = await loadImage(new URL(require("a7b3d39a650d1b88")).href, onProgress);
    const yellowRuin = await loadImage(new URL(require("4b942e3d0fe21af6")).href, onProgress);
    const desertFloor = await loadImage(new URL(require("ef04bc5083c079cc")).href, onProgress);
    const desertWall = await loadImage(new URL(require("6878513b9faf2986")).href, onProgress);
    const desertTree1 = await loadImage(new URL(require("bc79d6f290e43a80")).href, onProgress);
    const desertTree2 = await loadImage(new URL(require("3cb4e84e63f16db9")).href, onProgress);
    const desertBoulder = await loadImage(new URL(require("b7e208cdba694b64")).href, onProgress);
    const desertExit = await loadImage(new URL(require("79f3a39fe9166a77")).href, onProgress);
    const snowFloor = await loadImage(new URL(require("74aef0ff01d35eed")).href, onProgress);
    const snowWall = await loadImage(new URL(require("bcb8f883f78c181d")).href, onProgress);
    const snowTree1 = await loadImage(new URL(require("cc85696959d39ebe")).href, onProgress);
    const snowTree2 = await loadImage(new URL(require("8a9de24e04381f43")).href, onProgress);
    const snowBoulder = await loadImage(new URL(require("fa5a6a619bb370b5")).href, onProgress);
    const snowExit = await loadImage(new URL(require("bc748784e8c30387")).href, onProgress);
    const dungeonFloor = await loadImage(new URL(require("4c85499cec1fe247")).href, onProgress);
    const dungeonWall = await loadImage(new URL(require("30dc4b9275317af2")).href, onProgress);
    const dungeonObstacle1 = await loadImage(new URL(require("9473da643103b312")).href, onProgress);
    const dungeonObstacle2 = await loadImage(new URL(require("ddf8915e74bf87b9")).href, onProgress);
    const dungeonBoulder = await loadImage(new URL(require("2ee19a9caa29b665")).href, onProgress);
    const dungeonExit = await loadImage(new URL(require("5cab7d9201f88a17")).href, onProgress);
    return {
        grassTile,
        wall,
        boulder,
        rock,
        tree1,
        tree2,
        tree3,
        palm1,
        palm2,
        sandRuin,
        snowRuin,
        yellowRuin,
        desertFloor,
        desertWall,
        desertTree1,
        desertTree2,
        desertBoulder,
        desertExit,
        snowFloor,
        snowWall,
        snowTree1,
        snowTree2,
        snowBoulder,
        snowExit,
        dungeonFloor,
        dungeonWall,
        dungeonObstacle1,
        dungeonObstacle2,
        dungeonBoulder,
        dungeonExit
    };
}
async function loadItemAssets(onProgress) {
    console.log("Loading item assets...");
    const key = await loadImage(new URL(require("a5ba75c51d5504f7")).href, onProgress);
    const potion = await loadImage(new URL(require("d14d64b10e5d3b17")).href, onProgress);
    const explosive = await loadImage(new URL(require("900784a7c2730965")).href, onProgress);
    const steelSword = await loadImage(new URL(require("1151ba85fd7a4a86")).href, onProgress);
    const warAxe = await loadImage(new URL(require("d570f7b0415d629f")).href, onProgress);
    const runeHaste = await loadImage(new URL(require("865739fa4646a4a3")).href, onProgress);
    const runeMight = await loadImage(new URL(require("fb58bc3bec541d12")).href, onProgress);
    const runeWarding = await loadImage(new URL(require("b4b968b0b026b42e")).href, onProgress);
    // Not an inventory item, but generated by the same tool: the locked door tile
    const door = await loadImage(new URL(require("8c995fa55a1ef06d")).href, onProgress);
    return {
        key,
        potion,
        explosive,
        steelSword,
        warAxe,
        runeHaste,
        runeMight,
        runeWarding,
        door
    };
}
async function loadPowerUpsAssets(onProgress) {
    console.log("Loading powerups assets...");
    const greenCrystal = await loadImage(new URL(require("3d27847b46809984")).href, onProgress);
    const redCrystal = await loadImage(new URL(require("2a8d51d362a28a5a")).href, onProgress);
    const blueCrystal = await loadImage(new URL(require("426b380674b42f96")).href, onProgress);
    const yellowCrystal = await loadImage(new URL(require("9ae2d2d58e4ae0ee")).href, onProgress);
    return {
        greenCrystal,
        redCrystal,
        blueCrystal,
        yellowCrystal
    };
}

},{"93fa132a23469ad3":"b9nou","24d061bc9070758b":"kYVSU","da839ad1c17fe6f0":"fncWE","e0bc205cb3c5c0bf":"2LeDo","9fcd0329138ebc13":"aZY6N","fff618a47255eb1a":"4gAdv","9f26a3e4a159b554":"2cwK4","2222dfe21f9016a6":"knb3E","37fab219c2e3438d":"eGy9D","297e02e827843629":"54hki","6c2f82508ca9a3bb":"d6fML","47ee9c0f63ff8828":"cquXn","4b946ae5fc174647":"4rHea","301431c8769f658":"8MUvf","f462afe302c8f41b":"lTjNI","cd1068d2a2c15560":"jY0H7","37ea3b9efefea7e6":"aWofU","f524f9f30597b7c3":"afDNE","4af006d8495d5804":"he3z7","4bfabeb171e83a78":"9fl4N","a88858287bda9b00":"dNbts","8aa376bb259420aa":"i9DT0","f060f8a5fdaac71f":"fG8bj","1926d3b5d1463658":"5MSBS","798831562a8c99b4":"fzXLE","d7a60630e255c457":"bMo3R","1d5dcd0f193cb1ce":"26Zo6","e544f926ea4eae58":"iF5hM","c7cde1bd730e6a2":"cXfG8","1090cc123f927509":"3Ukfr","3f5ed577d5909e0d":"iXpK1","58ff784648728cf8":"cwnaC","6d9a56da4d55f52c":"jXnPG","cf0bb9cdce36df0b":"bG74D","af258d76c374145f":"74YJz","80e7c00fdd98ae89":"lQQEY","a7b3d39a650d1b88":"jkJ9x","4b942e3d0fe21af6":"d9SAV","ef04bc5083c079cc":"7mv1Z","6878513b9faf2986":"8K5FP","bc79d6f290e43a80":"iGkio","3cb4e84e63f16db9":"lDsOK","b7e208cdba694b64":"djXHd","79f3a39fe9166a77":"kktpJ","74aef0ff01d35eed":"iw4jJ","bcb8f883f78c181d":"eX1hi","cc85696959d39ebe":"b6nPp","8a9de24e04381f43":"fsLCy","fa5a6a619bb370b5":"4K8XV","bc748784e8c30387":"cs4tf","4c85499cec1fe247":"6xGJQ","30dc4b9275317af2":"7tpoG","9473da643103b312":"7coCV","ddf8915e74bf87b9":"byxh4","2ee19a9caa29b665":"enjv0","5cab7d9201f88a17":"5AKUg","a5ba75c51d5504f7":"04CyO","d14d64b10e5d3b17":"iTkbG","900784a7c2730965":"kr7ve","1151ba85fd7a4a86":"imXnd","d570f7b0415d629f":"jPYxu","865739fa4646a4a3":"5X7zw","fb58bc3bec541d12":"gFt5D","b4b968b0b026b42e":"lkXLI","8c995fa55a1ef06d":"1ToI4","3d27847b46809984":"kAqHG","2a8d51d362a28a5a":"9J8Br","426b380674b42f96":"iwGdJ","9ae2d2d58e4ae0ee":"9uNQt","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"b9nou":[function(require,module,exports) {
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

},{"4789fa1a7eb3f7ec":"lgJ39"}],"26Zo6":[function(require,module,exports) {
module.exports = require("2675bf9f17f4deff").getBundleURL("aAnGP") + "grass_tile.63710fbe.png" + "?" + Date.now();

},{"2675bf9f17f4deff":"lgJ39"}],"iF5hM":[function(require,module,exports) {
module.exports = require("59658cf52c7beaa3").getBundleURL("aAnGP") + "stone_wall.3b737783.png" + "?" + Date.now();

},{"59658cf52c7beaa3":"lgJ39"}],"cXfG8":[function(require,module,exports) {
module.exports = require("6c935de5cb20817").getBundleURL("aAnGP") + "boulder.6af06052.png" + "?" + Date.now();

},{"6c935de5cb20817":"lgJ39"}],"3Ukfr":[function(require,module,exports) {
module.exports = require("b5aa8aaf9302a118").getBundleURL("aAnGP") + "Rock6_1.7bba883a.png" + "?" + Date.now();

},{"b5aa8aaf9302a118":"lgJ39"}],"iXpK1":[function(require,module,exports) {
module.exports = require("25a52dc75a382c0e").getBundleURL("aAnGP") + "Tree1.e05f2c99.png" + "?" + Date.now();

},{"25a52dc75a382c0e":"lgJ39"}],"cwnaC":[function(require,module,exports) {
module.exports = require("4b73380b0412dfef").getBundleURL("aAnGP") + "Tree2.a46fb43d.png" + "?" + Date.now();

},{"4b73380b0412dfef":"lgJ39"}],"jXnPG":[function(require,module,exports) {
module.exports = require("83da82ef92c92fbc").getBundleURL("aAnGP") + "Tree3.826af1fd.png" + "?" + Date.now();

},{"83da82ef92c92fbc":"lgJ39"}],"bG74D":[function(require,module,exports) {
module.exports = require("8be36100caa17a17").getBundleURL("aAnGP") + "palm_a.1270a151.png" + "?" + Date.now();

},{"8be36100caa17a17":"lgJ39"}],"74YJz":[function(require,module,exports) {
module.exports = require("2158a225651f3dc2").getBundleURL("aAnGP") + "palm_b.3ae9328a.png" + "?" + Date.now();

},{"2158a225651f3dc2":"lgJ39"}],"lQQEY":[function(require,module,exports) {
module.exports = require("5a2d54e811bdc200").getBundleURL("aAnGP") + "Sand_ruins3.1f0a3c59.png" + "?" + Date.now();

},{"5a2d54e811bdc200":"lgJ39"}],"jkJ9x":[function(require,module,exports) {
module.exports = require("d7584db4a4d9b947").getBundleURL("aAnGP") + "Snow_ruins3.0b4f0802.png" + "?" + Date.now();

},{"d7584db4a4d9b947":"lgJ39"}],"d9SAV":[function(require,module,exports) {
module.exports = require("f6fe50e58e8fedab").getBundleURL("aAnGP") + "exit_ruin.0d420dd3.png" + "?" + Date.now();

},{"f6fe50e58e8fedab":"lgJ39"}],"7mv1Z":[function(require,module,exports) {
module.exports = require("54635e7b2ca4709c").getBundleURL("aAnGP") + "floor.0bbfb544.png" + "?" + Date.now();

},{"54635e7b2ca4709c":"lgJ39"}],"8K5FP":[function(require,module,exports) {
module.exports = require("818c8e26a0fa5fae").getBundleURL("aAnGP") + "wall.5d494604.png" + "?" + Date.now();

},{"818c8e26a0fa5fae":"lgJ39"}],"iGkio":[function(require,module,exports) {
module.exports = require("3c7ece1fedb824df").getBundleURL("aAnGP") + "tree_1.2b56d562.png" + "?" + Date.now();

},{"3c7ece1fedb824df":"lgJ39"}],"lDsOK":[function(require,module,exports) {
module.exports = require("ea7c360192673a66").getBundleURL("aAnGP") + "tree_2.9f85f3ac.png" + "?" + Date.now();

},{"ea7c360192673a66":"lgJ39"}],"djXHd":[function(require,module,exports) {
module.exports = require("5941717143b58257").getBundleURL("aAnGP") + "boulder.bc7f1f8f.png" + "?" + Date.now();

},{"5941717143b58257":"lgJ39"}],"kktpJ":[function(require,module,exports) {
module.exports = require("4f95cb931fd497f5").getBundleURL("aAnGP") + "exit.6fa79a1d.png" + "?" + Date.now();

},{"4f95cb931fd497f5":"lgJ39"}],"iw4jJ":[function(require,module,exports) {
module.exports = require("a35e1ea0c3f52980").getBundleURL("aAnGP") + "floor.f95b6eb2.png" + "?" + Date.now();

},{"a35e1ea0c3f52980":"lgJ39"}],"eX1hi":[function(require,module,exports) {
module.exports = require("e612b16897774314").getBundleURL("aAnGP") + "wall.09499add.png" + "?" + Date.now();

},{"e612b16897774314":"lgJ39"}],"b6nPp":[function(require,module,exports) {
module.exports = require("93e722e26d2ff862").getBundleURL("aAnGP") + "tree_1.3b30e16c.png" + "?" + Date.now();

},{"93e722e26d2ff862":"lgJ39"}],"fsLCy":[function(require,module,exports) {
module.exports = require("857c90d8cb0d4669").getBundleURL("aAnGP") + "tree_2.d6782b0f.png" + "?" + Date.now();

},{"857c90d8cb0d4669":"lgJ39"}],"4K8XV":[function(require,module,exports) {
module.exports = require("db4fa505026ca621").getBundleURL("aAnGP") + "boulder.42ffddab.png" + "?" + Date.now();

},{"db4fa505026ca621":"lgJ39"}],"cs4tf":[function(require,module,exports) {
module.exports = require("b46007950dc04b13").getBundleURL("aAnGP") + "exit.65a3bbe8.png" + "?" + Date.now();

},{"b46007950dc04b13":"lgJ39"}],"6xGJQ":[function(require,module,exports) {
module.exports = require("e6fb4abff87f0665").getBundleURL("aAnGP") + "floor.57ec2539.png" + "?" + Date.now();

},{"e6fb4abff87f0665":"lgJ39"}],"7tpoG":[function(require,module,exports) {
module.exports = require("add0643a5e7fa982").getBundleURL("aAnGP") + "wall.32004326.png" + "?" + Date.now();

},{"add0643a5e7fa982":"lgJ39"}],"7coCV":[function(require,module,exports) {
module.exports = require("a49b8f9ad48e4b82").getBundleURL("aAnGP") + "obstacle_1.603daa90.png" + "?" + Date.now();

},{"a49b8f9ad48e4b82":"lgJ39"}],"byxh4":[function(require,module,exports) {
module.exports = require("89844af4c58a45fb").getBundleURL("aAnGP") + "obstacle_2.552e8bc9.png" + "?" + Date.now();

},{"89844af4c58a45fb":"lgJ39"}],"enjv0":[function(require,module,exports) {
module.exports = require("9ae66daa07eb04f").getBundleURL("aAnGP") + "boulder.773484af.png" + "?" + Date.now();

},{"9ae66daa07eb04f":"lgJ39"}],"5AKUg":[function(require,module,exports) {
module.exports = require("398d64d2fd3c60ad").getBundleURL("aAnGP") + "exit.e1114455.png" + "?" + Date.now();

},{"398d64d2fd3c60ad":"lgJ39"}],"04CyO":[function(require,module,exports) {
module.exports = require("6db897c9d2656c50").getBundleURL("aAnGP") + "key.843913e9.png" + "?" + Date.now();

},{"6db897c9d2656c50":"lgJ39"}],"iTkbG":[function(require,module,exports) {
module.exports = require("f59b545bc58552b1").getBundleURL("aAnGP") + "potion.75bf7793.png" + "?" + Date.now();

},{"f59b545bc58552b1":"lgJ39"}],"kr7ve":[function(require,module,exports) {
module.exports = require("6e6b6af1a7a9e5e3").getBundleURL("aAnGP") + "explosive.6e1a6b86.png" + "?" + Date.now();

},{"6e6b6af1a7a9e5e3":"lgJ39"}],"imXnd":[function(require,module,exports) {
module.exports = require("11d54df61439d3a4").getBundleURL("aAnGP") + "sword_steel.a6a16a95.png" + "?" + Date.now();

},{"11d54df61439d3a4":"lgJ39"}],"jPYxu":[function(require,module,exports) {
module.exports = require("8a526e99c9864b94").getBundleURL("aAnGP") + "axe_war.4354af3b.png" + "?" + Date.now();

},{"8a526e99c9864b94":"lgJ39"}],"5X7zw":[function(require,module,exports) {
module.exports = require("fffd45939eeb7415").getBundleURL("aAnGP") + "rune_haste.804dfb4c.png" + "?" + Date.now();

},{"fffd45939eeb7415":"lgJ39"}],"gFt5D":[function(require,module,exports) {
module.exports = require("569da5a8d93cb4c2").getBundleURL("aAnGP") + "rune_might.53f59920.png" + "?" + Date.now();

},{"569da5a8d93cb4c2":"lgJ39"}],"lkXLI":[function(require,module,exports) {
module.exports = require("e2acc41bb21edb48").getBundleURL("aAnGP") + "rune_warding.532f8ad3.png" + "?" + Date.now();

},{"e2acc41bb21edb48":"lgJ39"}],"1ToI4":[function(require,module,exports) {
module.exports = require("d034bf1a557e1fec").getBundleURL("aAnGP") + "door.07133bdd.png" + "?" + Date.now();

},{"d034bf1a557e1fec":"lgJ39"}],"kAqHG":[function(require,module,exports) {
module.exports = require("f6b1d88be3588622").getBundleURL("aAnGP") + "Green_crystal2.18620c22.png" + "?" + Date.now();

},{"f6b1d88be3588622":"lgJ39"}],"9J8Br":[function(require,module,exports) {
module.exports = require("2797bb0f8cdaa3cb").getBundleURL("aAnGP") + "health_crystal.0d30a58e.png" + "?" + Date.now();

},{"2797bb0f8cdaa3cb":"lgJ39"}],"iwGdJ":[function(require,module,exports) {
module.exports = require("ddb42533b60a1ac4").getBundleURL("aAnGP") + "mana_crystal.65e68033.png" + "?" + Date.now();

},{"ddb42533b60a1ac4":"lgJ39"}],"9uNQt":[function(require,module,exports) {
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
    const controlsHint = document.createElement("p");
    controlsHint.textContent = "Arrows: move \xb7 Space: sword \xb7 X: axe \xb7 P: disarm trap \xb7 U: potion \xb7 Esc: pause";
    controlsHint.style.color = (0, _themeJs.theme).colors.text;
    controlsHint.style.fontFamily = (0, _themeJs.theme).fonts.subtitle;
    controlsHint.style.fontSize = "18px";
    controlsHint.style.opacity = "0.8";
    controlsHint.style.marginTop = "30px";
    welcomeScreen.appendChild(controlsHint);
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
var _scoreEntryJs = require("./score-entry.js");
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
    (0, _scoreEntryJs.appendScoreEntry)(gameOverScreen, finalScore);
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

},{"../utils/theme.js":"6OzmZ","./score-entry.js":"con8N","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"con8N":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Shared "save your score" widget for the game-over and game-won screens.
// Renders a name input + save button when the score makes the top-10;
// otherwise renders nothing.
parcelHelpers.export(exports, "appendScoreEntry", ()=>appendScoreEntry);
var _themeJs = require("../utils/theme.js");
var _storageJs = require("../utils/storage.js");
function appendScoreEntry(parent, score) {
    if (!(0, _storageJs.qualifiesForHighScore)(score)) return;
    const wrapper = document.createElement("div");
    wrapper.id = "score-entry";
    const label = document.createElement("p");
    label.textContent = "You made the high scores! Enter your name:";
    label.style.fontSize = (0, _themeJs.theme).fontSize.button;
    label.style.marginBottom = "10px";
    wrapper.appendChild(label);
    const input = document.createElement("input");
    input.id = "score-name-input";
    input.type = "text";
    input.maxLength = 16;
    input.placeholder = "Your name";
    input.style.padding = "10px";
    input.style.fontSize = (0, _themeJs.theme).fontSize.button;
    input.style.fontFamily = (0, _themeJs.theme).fonts.subtitle;
    input.style.textAlign = "center";
    input.style.backgroundColor = (0, _themeJs.theme).colors.background;
    input.style.color = (0, _themeJs.theme).colors.text;
    input.style.border = `2px solid ${(0, _themeJs.theme).colors.text}`;
    input.style.borderRadius = (0, _themeJs.theme).button.borderRadius;
    wrapper.appendChild(input);
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Score";
    (0, _themeJs.styleButton)(saveButton, (0, _themeJs.theme).colors.secondary);
    saveButton.onclick = ()=>{
        (0, _storageJs.addHighScore)(input.value.trim(), score);
        label.textContent = "Score saved!";
        input.remove();
        saveButton.remove();
    };
    wrapper.appendChild(saveButton);
    parent.appendChild(wrapper);
}

},{"../utils/theme.js":"6OzmZ","../utils/storage.js":"a8FLS","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"a8FLS":[function(require,module,exports) {
// Persistent high scores, stored in localStorage.
// Every accessor is wrapped so a blocked/absent localStorage (private
// browsing, storage quota) degrades to an empty list instead of crashing.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getHighScores", ()=>getHighScores);
// True when a score would make the top-10 list
parcelHelpers.export(exports, "qualifiesForHighScore", ()=>qualifiesForHighScore);
parcelHelpers.export(exports, "addHighScore", ()=>addHighScore);
const STORAGE_KEY = "wandertrap.highScores";
const MAX_SCORES = 10;
function getHighScores() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const scores = raw ? JSON.parse(raw) : [];
        return Array.isArray(scores) ? scores : [];
    } catch  {
        return [];
    }
}
function qualifiesForHighScore(score) {
    if (score <= 0) return false;
    const scores = getHighScores();
    if (scores.length < MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
}
function addHighScore(name, score) {
    const scores = getHighScores();
    scores.push({
        name: (name || "Anonymous").slice(0, 16),
        score,
        timestamp: new Date().toISOString()
    });
    scores.sort((a, b)=>b.score - a.score);
    const top = scores.slice(0, MAX_SCORES);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
    } catch  {
    // Storage unavailable; the score just isn't persisted
    }
    return top;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"12l5K":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Game Won screen
// - Shown when the player clears the final level
// - Displays the final score and options to play again or return to the menu
parcelHelpers.export(exports, "showGameWonScreen", ()=>showGameWonScreen);
var _themeJs = require("../utils/theme.js");
var _scoreEntryJs = require("./score-entry.js");
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
    (0, _scoreEntryJs.appendScoreEntry)(gameWonScreen, finalScore);
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

},{"../utils/theme.js":"6OzmZ","./score-entry.js":"con8N","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4usRq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// High Score screen
// - Displays the top-10 scores persisted in localStorage
// - Scores are recorded from the game-over / game-won screens
parcelHelpers.export(exports, "showHighScoreScreen", ()=>showHighScoreScreen);
var _themeJs = require("../utils/theme.js");
var _dateJs = require("../utils/date.js");
var _storageJs = require("../utils/storage.js");
function showHighScoreScreen(onBack) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const highScoreScreen = document.createElement("div");
    highScoreScreen.id = "high-score-screen";
    const title = document.createElement("h1");
    title.textContent = "High Scores";
    highScoreScreen.appendChild(title);
    const highScores = (0, _storageJs.getHighScores)();
    let table = null;
    if (highScores.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No scores yet \u2014 escape the Wandertrap to set one!";
        empty.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
        empty.style.margin = "40px 0";
        highScoreScreen.appendChild(empty);
    } else {
        table = document.createElement("table");
        const headerRow = document.createElement("tr");
        const headers = [
            "Name",
            "Score",
            "When"
        ];
        headers.forEach((headerText)=>{
            const header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);
        highScores.forEach((entry)=>{
            const row = document.createElement("tr");
            [
                entry.name,
                entry.score,
                (0, _dateJs.timeAgo)(entry.timestamp)
            ].forEach((text)=>{
                const cell = document.createElement("td");
                cell.textContent = text;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        highScoreScreen.appendChild(table);
    }
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
    if (table) {
        table.style.margin = "20px auto";
        table.style.borderRadius = "10px";
        table.style.borderCollapse = "collapse";
        table.style.width = "80%";
        table.style.backgroundColor = (0, _themeJs.theme).colors.background;
        table.style.color = (0, _themeJs.theme).colors.text;
        const ths = table.querySelectorAll("th");
        ths.forEach((th)=>{
            th.style.border = `1px solid ${(0, _themeJs.theme).colors.primary}`;
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
    }
    (0, _themeJs.styleButton)(backButton, (0, _themeJs.theme).colors.primary);
}

},{"../utils/theme.js":"6OzmZ","../utils/date.js":"5EBGj","../utils/storage.js":"a8FLS","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5EBGj":[function(require,module,exports) {
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
    // The game is already paused (animations frozen on the last rendered
    // frame); keep the canvas in place and lay a modal over it instead of
    // clearing the container like the full-page screens do.
    const existing = document.getElementById("level-completed-screen");
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.id = "level-completed-screen";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "rgba(0, 0, 0, 0.45)";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.webkitBackdropFilter = "blur(8px)";
    overlay.style.zIndex = "10";
    const modal = document.createElement("div");
    modal.style.backgroundColor = (0, _themeJs.theme).colors.background;
    modal.style.color = (0, _themeJs.theme).colors.text;
    modal.style.fontFamily = (0, _themeJs.theme).fonts.main;
    modal.style.textAlign = "center";
    modal.style.padding = (0, _themeJs.theme).spacing.padding;
    modal.style.border = "2px solid " + (0, _themeJs.theme).colors.text;
    modal.style.borderRadius = (0, _themeJs.theme).button.borderRadius;
    modal.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.5)";
    const title = document.createElement("h1");
    title.textContent = "Level Completed!";
    title.style.fontSize = (0, _themeJs.theme).fontSize.title;
    title.style.marginBottom = "20px";
    modal.appendChild(title);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Current Score: ${currentScore}`;
    scoreDisplay.style.fontSize = (0, _themeJs.theme).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    modal.appendChild(scoreDisplay);
    const closeModal = (callback)=>()=>{
            overlay.remove();
            callback();
        };
    const nextLevelButton = document.createElement("button");
    nextLevelButton.textContent = "Next Level";
    nextLevelButton.onclick = closeModal(onNextLevel);
    modal.appendChild(nextLevelButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = closeModal(onMainMenu);
    modal.appendChild(mainMenuButton);
    (0, _themeJs.styleButton)(nextLevelButton, (0, _themeJs.theme).colors.accent);
    (0, _themeJs.styleButton)(mainMenuButton, (0, _themeJs.theme).colors.secondary);
    overlay.appendChild(modal);
    container.appendChild(overlay);
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
