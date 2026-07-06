
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire6d7b"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire6d7b"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("aKzDW", function(module, exports) {

$parcel$export(module.exports, "register", () => $7d39d93f9098a310$export$6503ec6e8aabbaf, (v) => $7d39d93f9098a310$export$6503ec6e8aabbaf = v);
var $7d39d93f9098a310$export$6503ec6e8aabbaf;
var $7d39d93f9098a310$export$f7ad0328861e2f03;
"use strict";
var $7d39d93f9098a310$var$mapping = new Map();
function $7d39d93f9098a310$var$register(baseUrl, manifest) {
    for(var i = 0; i < manifest.length - 1; i += 2)$7d39d93f9098a310$var$mapping.set(manifest[i], {
        baseUrl: baseUrl,
        path: manifest[i + 1]
    });
}
function $7d39d93f9098a310$var$resolve(id) {
    var resolved = $7d39d93f9098a310$var$mapping.get(id);
    if (resolved == null) throw new Error("Could not resolve bundle with id " + id);
    return new URL(resolved.path, resolved.baseUrl).toString();
}
$7d39d93f9098a310$export$6503ec6e8aabbaf = $7d39d93f9098a310$var$register;
$7d39d93f9098a310$export$f7ad0328861e2f03 = $7d39d93f9098a310$var$resolve;

});

var $e53a0e409675cac7$exports = {};

(parcelRequire("aKzDW")).register(new URL("", import.meta.url).toString(), JSON.parse('["dSoMB","index.9cecde61.js","1mQMr","Player.6815690b.png","8h40I","Player_Actions.216a44f2.png","42nZQ","orc1_attack_full.e8901cb7.png","gPFhH","orc1_death_full.517faac9.png","4OUCa","orc1_hurt_full.0a03d073.png","24yvH","orc1_idle_full.683e0cd2.png","5AoH0","orc1_run_full.2113618a.png","cdO99","orc1_run_attack_front_full.9a790d5e.png","fVJn4","orc1_walk_full.9e2eb048.png","1dOuf","orc1_walk_attack_front_full.f403533d.png","9Xc3G","orc2_attack_full.db2a51f4.png","iGJjO","orc2_death_full.23681610.png","aJfYV","orc2_hurt_full.1ebea2f5.png","lDO06","orc2_idle_full.f0324bca.png","9FmaI","orc2_run_full.f809ff84.png","0pZXI","orc2_run_attack_full.3dfd3a4d.png","864J2","orc2_walk_full.f2efa2bf.png","98NfM","orc2_walk_attack_full.3bf0e99a.png","7TEuo","orc3_attack_full.e28e8832.png","fNlIn","orc3_death_full.064e76d1.png","hQZMc","orc3_hurt_full.027c67f8.png","byaVM","orc3_idle_full.14825eb4.png","1n9e9","orc3_run_full.efd4d5ee.png","5VtDn","orc3_run_attack_full.05b141e4.png","aTFVv","orc3_walk_full.7c14215e.png","g4X5Z","orc3_walk_attack_full.4012527d.png","6oup5","grass_tile.0ef9c22b.png","jHfKK","stone_wall.0a23402b.png","huEoj","boulder.59ccd34c.png","c2Dxq","Rock6_1.b0f82242.png","amwb3","Tree1.6aac84d7.png","kbFmz","Tree2.983a0b0c.png","iqJSO","Tree3.9139b26c.png","ke4WZ","palm_a.f2f937b7.png","3zQzg","palm_b.11aa6298.png","7dbDV","Sand_ruins3.3ff5aa66.png","PBh1v","Snow_ruins3.205e00ea.png","iPeX7","exit_ruin.aa60df04.png","dpUyt","floor.0198c309.png","94UGV","wall.d6e9cc70.png","bX5fc","tree_1.5292babc.png","khG44","tree_2.92b00b72.png","kVnNa","boulder.15164de8.png","9Ak2P","exit.e13f7e57.png","hRMLU","floor.12d92a2e.png","gAOHG","wall.4225af43.png","4jqY0","tree_1.7ae3f386.png","iAz1U","tree_2.d855a676.png","8gOxn","boulder.36a18f78.png","h5UDo","exit.7804ab62.png","J5onq","floor.98d4367b.png","3cCzV","wall.9c6b72f5.png","bTUTZ","obstacle_1.d463bbb4.png","2El9Z","obstacle_2.28d3a5e4.png","e6oYp","boulder.128e4b61.png","ewsFq","exit.69493db7.png","8EeiM","key.2af3611f.png","b9iYn","potion.7fdd369b.png","551iB","explosive.c6be1a55.png","di786","sword_steel.f1d046ab.png","5yEs4","axe_war.0a837580.png","iSKlL","rune_haste.6c91306a.png","hLSBd","rune_might.38be4919.png","71xMP","rune_warding.ef8a6b94.png","5dWgO","door.9871e447.png","cXZha","Green_crystal2.5f080818.png","9PqMQ","health_crystal.b327dfeb.png","8RL0u","mana_crystal.ea6ee675.png","2G2gW","Yellow_crystal2.13460b75.png"]'));


//# sourceMappingURL=index.runtime.f199ff77.js.map
