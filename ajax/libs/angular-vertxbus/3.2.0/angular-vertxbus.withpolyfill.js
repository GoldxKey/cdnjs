/*! angular-vertxbus - v3.2.0 - 2015-10-31
* http://github.com/knalli/angular-vertxbus
* Copyright (c) 2015 Jan Philipp; Licensed MIT */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
"use strict";

_dereq_(186);

_dereq_(187);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"186":186,"187":187}],2:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],3:[function(_dereq_,module,exports){
var isObject = _dereq_(37);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"37":37}],4:[function(_dereq_,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = _dereq_(78)
  , toIndex  = _dereq_(74)
  , toLength = _dereq_(77);

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , $$    = arguments
    , end   = $$.length > 2 ? $$[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"74":74,"77":77,"78":78}],5:[function(_dereq_,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = _dereq_(78)
  , toIndex  = _dereq_(74)
  , toLength = _dereq_(77);
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this, true)
    , length = toLength(O.length)
    , $$     = arguments
    , $$len  = $$.length
    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
    , end    = $$len > 2 ? $$[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"74":74,"77":77,"78":78}],6:[function(_dereq_,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_(76)
  , toLength  = _dereq_(77)
  , toIndex   = _dereq_(74);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"74":74,"76":76,"77":77}],7:[function(_dereq_,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = _dereq_(16)
  , isObject = _dereq_(37)
  , IObject  = _dereq_(33)
  , toObject = _dereq_(78)
  , toLength = _dereq_(77)
  , isArray  = _dereq_(35)
  , SPECIES  = _dereq_(81)('species');
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var ASC = function(original, length){
  var C;
  if(isArray(original) && isObject(C = original.constructor)){
    C = C[SPECIES];
    if(C === null)C = undefined;
  } return new (C === undefined ? Array : C)(length);
};
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? ASC($this, length) : IS_FILTER ? ASC($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"16":16,"33":33,"35":35,"37":37,"77":77,"78":78,"81":81}],8:[function(_dereq_,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = _dereq_(45)
  , toObject = _dereq_(78)
  , IObject  = _dereq_(33);

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = _dereq_(23)(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"23":23,"33":33,"45":45,"78":78}],9:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_(10)
  , TAG = _dereq_(81)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"10":10,"81":81}],10:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],11:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_(45)
  , hide         = _dereq_(30)
  , ctx          = _dereq_(16)
  , species      = _dereq_(64)
  , strictNew    = _dereq_(65)
  , defined      = _dereq_(18)
  , forOf        = _dereq_(26)
  , step         = _dereq_(43)
  , ID           = _dereq_(79)('id')
  , $has         = _dereq_(29)
  , isObject     = _dereq_(37)
  , isExtensible = Object.isExtensible || isObject
  , SUPPORT_DESC = _dereq_(71)
  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _dereq_(50)(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _dereq_(41)(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    species(C);
    species(_dereq_(15)[NAME]); // for wrapper
  }
};
},{"15":15,"16":16,"18":18,"26":26,"29":29,"30":30,"37":37,"41":41,"43":43,"45":45,"50":50,"64":64,"65":65,"71":71,"79":79}],12:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = _dereq_(26)
  , classof = _dereq_(9);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"26":26,"9":9}],13:[function(_dereq_,module,exports){
'use strict';
var hide         = _dereq_(30)
  , anObject     = _dereq_(3)
  , strictNew    = _dereq_(65)
  , forOf        = _dereq_(26)
  , method       = _dereq_(7)
  , WEAK         = _dereq_(79)('weak')
  , isObject     = _dereq_(37)
  , $has         = _dereq_(29)
  , isExtensible = Object.isExtensible || isObject
  , find         = method(5)
  , findIndex    = method(6)
  , id           = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return find(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = findIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _dereq_(50)(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"26":26,"29":29,"3":3,"30":30,"37":37,"50":50,"65":65,"7":7,"79":79}],14:[function(_dereq_,module,exports){
'use strict';
var global     = _dereq_(28)
  , $def       = _dereq_(17)
  , forOf      = _dereq_(26)
  , strictNew  = _dereq_(65);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    _dereq_(57)(proto, KEY,
      KEY == 'delete' ? function(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'has' ? function has(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'get' ? function get(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
      : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !_dereq_(23)(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _dereq_(50)(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!_dereq_(42)(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || inst.forEach(function(val, key){
      buggyZero = 1 / key === -Infinity;
    });
    // fix converting -0 key to +0
    if(buggyZero){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    // + fix .add & .set for chaining
    if(buggyZero || chain !== inst)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  _dereq_(72)(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"17":17,"23":23,"26":26,"28":28,"42":42,"50":50,"57":57,"65":65,"72":72}],15:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],16:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_(2);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"2":2}],17:[function(_dereq_,module,exports){
var global     = _dereq_(28)
  , core       = _dereq_(15)
  , hide       = _dereq_(30)
  , $redef     = _dereq_(57)
  , PROTOTYPE  = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"15":15,"28":28,"30":30,"57":57}],18:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],19:[function(_dereq_,module,exports){
var isObject = _dereq_(37)
  , document = _dereq_(28).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"28":28,"37":37}],20:[function(_dereq_,module,exports){
// all enumerable object keys, includes symbols
var $ = _dereq_(45);
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"45":45}],21:[function(_dereq_,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],22:[function(_dereq_,module,exports){
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[_dereq_(81)('match')] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"81":81}],23:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],24:[function(_dereq_,module,exports){
'use strict';
module.exports = function(KEY, length, exec){
  var defined  = _dereq_(18)
    , SYMBOL   = _dereq_(81)(KEY)
    , original = ''[KEY];
  if(_dereq_(23)(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    _dereq_(57)(String.prototype, KEY, exec(defined, SYMBOL, original));
    _dereq_(30)(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"18":18,"23":23,"30":30,"57":57,"81":81}],25:[function(_dereq_,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = _dereq_(3);
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)result += 'g';
  if(that.ignoreCase)result += 'i';
  if(that.multiline)result += 'm';
  if(that.unicode)result += 'u';
  if(that.sticky)result += 'y';
  return result;
};
},{"3":3}],26:[function(_dereq_,module,exports){
var ctx         = _dereq_(16)
  , call        = _dereq_(39)
  , isArrayIter = _dereq_(34)
  , anObject    = _dereq_(3)
  , toLength    = _dereq_(77)
  , getIterFn   = _dereq_(82);
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"16":16,"3":3,"34":34,"39":39,"77":77,"82":82}],27:[function(_dereq_,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = _dereq_(76)
  , getNames  = _dereq_(45).getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"45":45,"76":76}],28:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],29:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],30:[function(_dereq_,module,exports){
var $          = _dereq_(45)
  , createDesc = _dereq_(56);
module.exports = _dereq_(71) ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"45":45,"56":56,"71":71}],31:[function(_dereq_,module,exports){
module.exports = _dereq_(28).document && document.documentElement;
},{"28":28}],32:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],33:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_(10);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"10":10}],34:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators = _dereq_(44)
  , ITERATOR  = _dereq_(81)('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"44":44,"81":81}],35:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_(10);
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"10":10}],36:[function(_dereq_,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = _dereq_(37)
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"37":37}],37:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],38:[function(_dereq_,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = _dereq_(37)
  , cof      = _dereq_(10)
  , MATCH    = _dereq_(81)('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"10":10,"37":37,"81":81}],39:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_(3);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"3":3}],40:[function(_dereq_,module,exports){
'use strict';
var $ = _dereq_(45)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_(30)(IteratorPrototype, _dereq_(81)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: _dereq_(56)(1,next)});
  _dereq_(72)(Constructor, NAME + ' Iterator');
};
},{"30":30,"45":45,"56":56,"72":72,"81":81}],41:[function(_dereq_,module,exports){
'use strict';
var LIBRARY         = _dereq_(47)
  , $def            = _dereq_(17)
  , $redef          = _dereq_(57)
  , hide            = _dereq_(30)
  , has             = _dereq_(29)
  , SYMBOL_ITERATOR = _dereq_(81)('iterator')
  , Iterators       = _dereq_(44)
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  _dereq_(40)(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = _dereq_(45).getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    _dereq_(72)(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      keys:    IS_SET            ? _default : createMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"17":17,"29":29,"30":30,"40":40,"44":44,"45":45,"47":47,"57":57,"72":72,"81":81}],42:[function(_dereq_,module,exports){
var SYMBOL_ITERATOR = _dereq_(81)('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"81":81}],43:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],44:[function(_dereq_,module,exports){
module.exports = {};
},{}],45:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],46:[function(_dereq_,module,exports){
var $         = _dereq_(45)
  , toIObject = _dereq_(76);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"45":45,"76":76}],47:[function(_dereq_,module,exports){
module.exports = false;
},{}],48:[function(_dereq_,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],49:[function(_dereq_,module,exports){
var global    = _dereq_(28)
  , macrotask = _dereq_(73).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = _dereq_(10)(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"10":10,"28":28,"73":73}],50:[function(_dereq_,module,exports){
var $redef = _dereq_(57);
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"57":57}],51:[function(_dereq_,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = _dereq_(17)
    , fn   = (_dereq_(15).Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * _dereq_(23)(function(){ fn(1); }), 'Object', exp);
};
},{"15":15,"17":17,"23":23}],52:[function(_dereq_,module,exports){
var $         = _dereq_(45)
  , toIObject = _dereq_(76)
  , isEnum    = $.isEnum;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"45":45,"76":76}],53:[function(_dereq_,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = _dereq_(45)
  , anObject = _dereq_(3)
  , Reflect  = _dereq_(28).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"28":28,"3":3,"45":45}],54:[function(_dereq_,module,exports){
'use strict';
var path      = _dereq_(55)
  , invoke    = _dereq_(32)
  , aFunction = _dereq_(2);
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that  = this
      , $$    = arguments
      , $$len = $$.length
      , j = 0, k = 0, args;
    if(!holder && !$$len)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
    while($$len > k)args.push($$[k++]);
    return invoke(fn, args, that);
  };
};
},{"2":2,"32":32,"55":55}],55:[function(_dereq_,module,exports){
module.exports = _dereq_(28);
},{"28":28}],56:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],57:[function(_dereq_,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = _dereq_(28)
  , hide      = _dereq_(30)
  , SRC       = _dereq_(79)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

_dereq_(15).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"15":15,"28":28,"30":30,"79":79}],58:[function(_dereq_,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],59:[function(_dereq_,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],60:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_(45).getDesc
  , isObject = _dereq_(37)
  , anObject = _dereq_(3);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_(16)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"16":16,"3":3,"37":37,"45":45}],61:[function(_dereq_,module,exports){
var global = _dereq_(28)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"28":28}],62:[function(_dereq_,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],63:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = _dereq_(3)
  , aFunction = _dereq_(2)
  , SPECIES   = _dereq_(81)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"2":2,"3":3,"81":81}],64:[function(_dereq_,module,exports){
'use strict';
var $       = _dereq_(45)
  , SPECIES = _dereq_(81)('species');
module.exports = function(C){
  if(_dereq_(71) && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"45":45,"71":71,"81":81}],65:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],66:[function(_dereq_,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = _dereq_(75)
  , defined   = _dereq_(18);
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"18":18,"75":75}],67:[function(_dereq_,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = _dereq_(38)
  , defined  = _dereq_(18);

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"18":18,"38":38}],68:[function(_dereq_,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = _dereq_(77)
  , repeat   = _dereq_(69)
  , defined  = _dereq_(18);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"18":18,"69":69,"77":77}],69:[function(_dereq_,module,exports){
'use strict';
var toInteger = _dereq_(75)
  , defined   = _dereq_(18);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"18":18,"75":75}],70:[function(_dereq_,module,exports){
// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

var $def    = _dereq_(17)
  , defined = _dereq_(18)
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

module.exports = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $def($def.P + $def.F * _dereq_(23)(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};
},{"17":17,"18":18,"23":23}],71:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_(23)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"23":23}],72:[function(_dereq_,module,exports){
var def = _dereq_(45).setDesc
  , has = _dereq_(29)
  , TAG = _dereq_(81)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"29":29,"45":45,"81":81}],73:[function(_dereq_,module,exports){
'use strict';
var ctx                = _dereq_(16)
  , invoke             = _dereq_(32)
  , html               = _dereq_(31)
  , cel                = _dereq_(19)
  , global             = _dereq_(28)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_dereq_(10)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"10":10,"16":16,"19":19,"28":28,"31":31,"32":32}],74:[function(_dereq_,module,exports){
var toInteger = _dereq_(75)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"75":75}],75:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],76:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_(33)
  , defined = _dereq_(18);
module.exports = function(it){
  return IObject(defined(it));
};
},{"18":18,"33":33}],77:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_(75)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"75":75}],78:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_(18);
module.exports = function(it){
  return Object(defined(it));
};
},{"18":18}],79:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],80:[function(_dereq_,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _dereq_(81)('unscopables');
if([][UNSCOPABLES] == undefined)_dereq_(30)(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  [][UNSCOPABLES][key] = true;
};
},{"30":30,"81":81}],81:[function(_dereq_,module,exports){
var store  = _dereq_(61)('wks')
  , Symbol = _dereq_(28).Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || _dereq_(79))('Symbol.' + name));
};
},{"28":28,"61":61,"79":79}],82:[function(_dereq_,module,exports){
var classof   = _dereq_(9)
  , ITERATOR  = _dereq_(81)('iterator')
  , Iterators = _dereq_(44);
module.exports = _dereq_(15).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"15":15,"44":44,"81":81,"9":9}],83:[function(_dereq_,module,exports){
'use strict';
var $                = _dereq_(45)
  , SUPPORT_DESC     = _dereq_(71)
  , createDesc       = _dereq_(56)
  , html             = _dereq_(31)
  , cel              = _dereq_(19)
  , has              = _dereq_(29)
  , cof              = _dereq_(10)
  , $def             = _dereq_(17)
  , invoke           = _dereq_(32)
  , arrayMethod      = _dereq_(7)
  , IE_PROTO         = _dereq_(79)('__proto__')
  , isObject         = _dereq_(37)
  , anObject         = _dereq_(3)
  , aFunction        = _dereq_(2)
  , toObject         = _dereq_(78)
  , toIObject        = _dereq_(76)
  , toInteger        = _dereq_(75)
  , toIndex          = _dereq_(74)
  , toLength         = _dereq_(77)
  , IObject          = _dereq_(33)
  , fails            = _dereq_(23)
  , ObjectProto      = Object.prototype
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , $indexOf         = _dereq_(6)(false)
  , factories        = {}
  , IE8_DOM_DEFINE;

if(!SUPPORT_DESC){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !SUPPORT_DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = _slice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(_slice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
var buggySlice = fails(function(){
  if(html)_slice.call(html);
});

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$def($def.P + $def.F * (IObject != Object), 'Array', {
  join: function(){
    return _join.apply(IObject(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {isArray: _dereq_(35)});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};
var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(arrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(arrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(arrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(arrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(arrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize($indexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && fails(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"10":10,"17":17,"19":19,"2":2,"23":23,"29":29,"3":3,"31":31,"32":32,"33":33,"35":35,"37":37,"45":45,"56":56,"6":6,"7":7,"71":71,"74":74,"75":75,"76":76,"77":77,"78":78,"79":79}],84:[function(_dereq_,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var $def = _dereq_(17);

$def($def.P, 'Array', {copyWithin: _dereq_(4)});

_dereq_(80)('copyWithin');
},{"17":17,"4":4,"80":80}],85:[function(_dereq_,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $def = _dereq_(17);

$def($def.P, 'Array', {fill: _dereq_(5)});

_dereq_(80)('fill');
},{"17":17,"5":5,"80":80}],86:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var KEY    = 'findIndex'
  , $def   = _dereq_(17)
  , forced = true
  , $find  = _dereq_(7)(6);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_(80)(KEY);
},{"17":17,"7":7,"80":80}],87:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var KEY    = 'find'
  , $def   = _dereq_(17)
  , forced = true
  , $find  = _dereq_(7)(5);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_(80)(KEY);
},{"17":17,"7":7,"80":80}],88:[function(_dereq_,module,exports){
'use strict';
var ctx         = _dereq_(16)
  , $def        = _dereq_(17)
  , toObject    = _dereq_(78)
  , call        = _dereq_(39)
  , isArrayIter = _dereq_(34)
  , toLength    = _dereq_(77)
  , getIterFn   = _dereq_(82);
$def($def.S + $def.F * !_dereq_(42)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"16":16,"17":17,"34":34,"39":39,"42":42,"77":77,"78":78,"82":82}],89:[function(_dereq_,module,exports){
'use strict';
var setUnscope = _dereq_(80)
  , step       = _dereq_(43)
  , Iterators  = _dereq_(44)
  , toIObject  = _dereq_(76);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
_dereq_(41)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"41":41,"43":43,"44":44,"76":76,"80":80}],90:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(17);

// WebKit Array.of isn't generic
$def($def.S + $def.F * _dereq_(23)(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , $$     = arguments
      , $$len  = $$.length
      , result = new (typeof this == 'function' ? this : Array)($$len);
    while($$len > index)result[index] = $$[index++];
    result.length = $$len;
    return result;
  }
});
},{"17":17,"23":23}],91:[function(_dereq_,module,exports){
_dereq_(64)(Array);
},{"64":64}],92:[function(_dereq_,module,exports){
'use strict';
var $             = _dereq_(45)
  , isObject      = _dereq_(37)
  , HAS_INSTANCE  = _dereq_(81)('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"37":37,"45":45,"81":81}],93:[function(_dereq_,module,exports){
var setDesc    = _dereq_(45).setDesc
  , createDesc = _dereq_(56)
  , has        = _dereq_(29)
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || _dereq_(71) && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"29":29,"45":45,"56":56,"71":71}],94:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_(11);

// 23.1 Map Objects
_dereq_(14)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"11":11,"14":14}],95:[function(_dereq_,module,exports){
// 20.2.2.3 Math.acosh(x)
var $def   = _dereq_(17)
  , log1p  = _dereq_(48)
  , sqrt   = Math.sqrt
  , $acosh = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$def($def.S + $def.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"17":17,"48":48}],96:[function(_dereq_,module,exports){
// 20.2.2.5 Math.asinh(x)
var $def = _dereq_(17);

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$def($def.S, 'Math', {asinh: asinh});
},{"17":17}],97:[function(_dereq_,module,exports){
// 20.2.2.7 Math.atanh(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"17":17}],98:[function(_dereq_,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $def = _dereq_(17)
  , sign = _dereq_(62);

$def($def.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"17":17,"62":62}],99:[function(_dereq_,module,exports){
// 20.2.2.11 Math.clz32(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"17":17}],100:[function(_dereq_,module,exports){
// 20.2.2.12 Math.cosh(x)
var $def = _dereq_(17)
  , exp  = Math.exp;

$def($def.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"17":17}],101:[function(_dereq_,module,exports){
// 20.2.2.14 Math.expm1(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {expm1: _dereq_(21)});
},{"17":17,"21":21}],102:[function(_dereq_,module,exports){
// 20.2.2.16 Math.fround(x)
var $def  = _dereq_(17)
  , sign  = _dereq_(62)
  , pow   = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$def($def.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"17":17,"62":62}],103:[function(_dereq_,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $def = _dereq_(17)
  , abs  = Math.abs;

$def($def.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum   = 0
      , i     = 0
      , $$    = arguments
      , $$len = $$.length
      , larg  = 0
      , arg, div;
    while(i < $$len){
      arg = abs($$[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"17":17}],104:[function(_dereq_,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $def  = _dereq_(17)
  , $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$def($def.S + $def.F * _dereq_(23)(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"17":17,"23":23}],105:[function(_dereq_,module,exports){
// 20.2.2.21 Math.log10(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"17":17}],106:[function(_dereq_,module,exports){
// 20.2.2.20 Math.log1p(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {log1p: _dereq_(48)});
},{"17":17,"48":48}],107:[function(_dereq_,module,exports){
// 20.2.2.22 Math.log2(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"17":17}],108:[function(_dereq_,module,exports){
// 20.2.2.28 Math.sign(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {sign: _dereq_(62)});
},{"17":17,"62":62}],109:[function(_dereq_,module,exports){
// 20.2.2.30 Math.sinh(x)
var $def  = _dereq_(17)
  , expm1 = _dereq_(21)
  , exp   = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$def($def.S + $def.F * _dereq_(23)(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"17":17,"21":21,"23":23}],110:[function(_dereq_,module,exports){
// 20.2.2.33 Math.tanh(x)
var $def  = _dereq_(17)
  , expm1 = _dereq_(21)
  , exp   = Math.exp;

$def($def.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"17":17,"21":21}],111:[function(_dereq_,module,exports){
// 20.2.2.34 Math.trunc(x)
var $def = _dereq_(17);

$def($def.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"17":17}],112:[function(_dereq_,module,exports){
'use strict';
var $          = _dereq_(45)
  , global     = _dereq_(28)
  , has        = _dereq_(29)
  , cof        = _dereq_(10)
  , isObject   = _dereq_(37)
  , fails      = _dereq_(23)
  , NUMBER     = 'Number'
  , $Number    = global[NUMBER]
  , Base       = $Number
  , proto      = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF = cof($.create(proto)) == NUMBER;
var toPrimitive = function(it){
  var fn, val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to number");
};
var toNumber = function(it){
  if(isObject(it))it = toPrimitive(it);
  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
    var binary = false;
    switch(it.charCodeAt(1)){
      case 66 : case 98  : binary = true;
      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
    }
  } return +it;
};
if(!($Number('0o1') && $Number('0b1'))){
  $Number = function Number(it){
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(_dereq_(71) ? $.getNames(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), function(key){
    if(has(Base, key) && !has($Number, key)){
      $.setDesc($Number, key, $.getDesc(Base, key));
    }
  });
  $Number.prototype = proto;
  proto.constructor = $Number;
  _dereq_(57)(global, NUMBER, $Number);
}
},{"10":10,"23":23,"28":28,"29":29,"37":37,"45":45,"57":57,"71":71}],113:[function(_dereq_,module,exports){
// 20.1.2.1 Number.EPSILON
var $def = _dereq_(17);

$def($def.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"17":17}],114:[function(_dereq_,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $def      = _dereq_(17)
  , _isFinite = _dereq_(28).isFinite;

$def($def.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"17":17,"28":28}],115:[function(_dereq_,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $def = _dereq_(17);

$def($def.S, 'Number', {isInteger: _dereq_(36)});
},{"17":17,"36":36}],116:[function(_dereq_,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $def = _dereq_(17);

$def($def.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"17":17}],117:[function(_dereq_,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $def      = _dereq_(17)
  , isInteger = _dereq_(36)
  , abs       = Math.abs;

$def($def.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"17":17,"36":36}],118:[function(_dereq_,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $def = _dereq_(17);

$def($def.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"17":17}],119:[function(_dereq_,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $def = _dereq_(17);

$def($def.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"17":17}],120:[function(_dereq_,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $def = _dereq_(17);

$def($def.S, 'Number', {parseFloat: parseFloat});
},{"17":17}],121:[function(_dereq_,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $def = _dereq_(17);

$def($def.S, 'Number', {parseInt: parseInt});
},{"17":17}],122:[function(_dereq_,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = _dereq_(17);

$def($def.S + $def.F, 'Object', {assign: _dereq_(8)});
},{"17":17,"8":8}],123:[function(_dereq_,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = _dereq_(37);

_dereq_(51)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"37":37,"51":51}],124:[function(_dereq_,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = _dereq_(76);

_dereq_(51)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"51":51,"76":76}],125:[function(_dereq_,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
_dereq_(51)('getOwnPropertyNames', function(){
  return _dereq_(27).get;
});
},{"27":27,"51":51}],126:[function(_dereq_,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = _dereq_(78);

_dereq_(51)('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"51":51,"78":78}],127:[function(_dereq_,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = _dereq_(37);

_dereq_(51)('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"37":37,"51":51}],128:[function(_dereq_,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = _dereq_(37);

_dereq_(51)('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"37":37,"51":51}],129:[function(_dereq_,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = _dereq_(37);

_dereq_(51)('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"37":37,"51":51}],130:[function(_dereq_,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = _dereq_(17);
$def($def.S, 'Object', {
  is: _dereq_(59)
});
},{"17":17,"59":59}],131:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_(78);

_dereq_(51)('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"51":51,"78":78}],132:[function(_dereq_,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = _dereq_(37);

_dereq_(51)('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"37":37,"51":51}],133:[function(_dereq_,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = _dereq_(37);

_dereq_(51)('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"37":37,"51":51}],134:[function(_dereq_,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = _dereq_(17);
$def($def.S, 'Object', {setPrototypeOf: _dereq_(60).set});
},{"17":17,"60":60}],135:[function(_dereq_,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = _dereq_(9)
  , test    = {};
test[_dereq_(81)('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  _dereq_(57)(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"57":57,"81":81,"9":9}],136:[function(_dereq_,module,exports){
'use strict';
var $          = _dereq_(45)
  , LIBRARY    = _dereq_(47)
  , global     = _dereq_(28)
  , ctx        = _dereq_(16)
  , classof    = _dereq_(9)
  , $def       = _dereq_(17)
  , isObject   = _dereq_(37)
  , anObject   = _dereq_(3)
  , aFunction  = _dereq_(2)
  , strictNew  = _dereq_(65)
  , forOf      = _dereq_(26)
  , setProto   = _dereq_(60).set
  , same       = _dereq_(59)
  , species    = _dereq_(64)
  , SPECIES    = _dereq_(81)('species')
  , speciesConstructor = _dereq_(63)
  , RECORD     = _dereq_(79)('record')
  , asap       = _dereq_(49)
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && _dereq_(71)){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  _dereq_(50)(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (speciesConstructor(this, P))(function(res, rej){
        react.res = res;
        react.rej = rej;
      });
      aFunction(react.res);
      aFunction(react.rej);
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
_dereq_(72)(P, PROMISE);
species(P);
species(Wrapper = _dereq_(15)[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && _dereq_(42)(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"15":15,"16":16,"17":17,"2":2,"26":26,"28":28,"3":3,"37":37,"42":42,"45":45,"47":47,"49":49,"50":50,"59":59,"60":60,"63":63,"64":64,"65":65,"71":71,"72":72,"79":79,"81":81,"9":9}],137:[function(_dereq_,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $def   = _dereq_(17)
  , _apply = Function.apply;

$def($def.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"17":17}],138:[function(_dereq_,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = _dereq_(45)
  , $def      = _dereq_(17)
  , aFunction = _dereq_(2)
  , anObject  = _dereq_(3)
  , isObject  = _dereq_(37)
  , bind      = Function.bind || _dereq_(15).Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$def($def.S + $def.F * _dereq_(23)(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"15":15,"17":17,"2":2,"23":23,"3":3,"37":37,"45":45}],139:[function(_dereq_,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = _dereq_(45)
  , $def     = _dereq_(17)
  , anObject = _dereq_(3);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$def($def.S + $def.F * _dereq_(23)(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"17":17,"23":23,"3":3,"45":45}],140:[function(_dereq_,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $def     = _dereq_(17)
  , getDesc  = _dereq_(45).getDesc
  , anObject = _dereq_(3);

$def($def.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"17":17,"3":3,"45":45}],141:[function(_dereq_,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $def     = _dereq_(17)
  , anObject = _dereq_(3);
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
_dereq_(40)(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$def($def.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"17":17,"3":3,"40":40}],142:[function(_dereq_,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = _dereq_(45)
  , $def     = _dereq_(17)
  , anObject = _dereq_(3);

$def($def.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"17":17,"3":3,"45":45}],143:[function(_dereq_,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $def     = _dereq_(17)
  , getProto = _dereq_(45).getProto
  , anObject = _dereq_(3);

$def($def.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"17":17,"3":3,"45":45}],144:[function(_dereq_,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = _dereq_(45)
  , has      = _dereq_(29)
  , $def     = _dereq_(17)
  , isObject = _dereq_(37)
  , anObject = _dereq_(3);

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$def($def.S, 'Reflect', {get: get});
},{"17":17,"29":29,"3":3,"37":37,"45":45}],145:[function(_dereq_,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $def = _dereq_(17);

$def($def.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"17":17}],146:[function(_dereq_,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $def          = _dereq_(17)
  , anObject      = _dereq_(3)
  , $isExtensible = Object.isExtensible;

$def($def.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"17":17,"3":3}],147:[function(_dereq_,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $def = _dereq_(17);

$def($def.S, 'Reflect', {ownKeys: _dereq_(53)});
},{"17":17,"53":53}],148:[function(_dereq_,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $def               = _dereq_(17)
  , anObject           = _dereq_(3)
  , $preventExtensions = Object.preventExtensions;

$def($def.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"17":17,"3":3}],149:[function(_dereq_,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $def     = _dereq_(17)
  , setProto = _dereq_(60);

if(setProto)$def($def.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"17":17,"60":60}],150:[function(_dereq_,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = _dereq_(45)
  , has        = _dereq_(29)
  , $def       = _dereq_(17)
  , createDesc = _dereq_(56)
  , anObject   = _dereq_(3)
  , isObject   = _dereq_(37);

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$def($def.S, 'Reflect', {set: set});
},{"17":17,"29":29,"3":3,"37":37,"45":45,"56":56}],151:[function(_dereq_,module,exports){
var $        = _dereq_(45)
  , global   = _dereq_(28)
  , isRegExp = _dereq_(38)
  , $flags   = _dereq_(25)
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(_dereq_(71) && (!CORRECT_NEW || _dereq_(23)(function(){
  re2[_dereq_(81)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  _dereq_(57)(global, 'RegExp', $RegExp);
}

_dereq_(64)($RegExp);
},{"23":23,"25":25,"28":28,"38":38,"45":45,"57":57,"64":64,"71":71,"81":81}],152:[function(_dereq_,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = _dereq_(45);
if(_dereq_(71) && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: _dereq_(25)
});
},{"25":25,"45":45,"71":71}],153:[function(_dereq_,module,exports){
// @@match logic
_dereq_(24)('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"24":24}],154:[function(_dereq_,module,exports){
// @@replace logic
_dereq_(24)('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"24":24}],155:[function(_dereq_,module,exports){
// @@search logic
_dereq_(24)('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"24":24}],156:[function(_dereq_,module,exports){
// @@split logic
_dereq_(24)('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"24":24}],157:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_(11);

// 23.2 Set Objects
_dereq_(14)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"11":11,"14":14}],158:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(17)
  , $at  = _dereq_(66)(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"17":17,"66":66}],159:[function(_dereq_,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $def      = _dereq_(17)
  , toLength  = _dereq_(77)
  , context   = _dereq_(67)
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$def($def.P + $def.F * _dereq_(22)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , $$   = arguments
      , endPosition = $$.length > 1 ? $$[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"17":17,"22":22,"67":67,"77":77}],160:[function(_dereq_,module,exports){
var $def    = _dereq_(17)
  , toIndex = _dereq_(74)
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res   = []
      , $$    = arguments
      , $$len = $$.length
      , i     = 0
      , code;
    while($$len > i){
      code = +$$[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"17":17,"74":74}],161:[function(_dereq_,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $def     = _dereq_(17)
  , context  = _dereq_(67)
  , INCLUDES = 'includes';

$def($def.P + $def.F * _dereq_(22)(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"17":17,"22":22,"67":67}],162:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_(66)(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_(41)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"41":41,"66":66}],163:[function(_dereq_,module,exports){
var $def      = _dereq_(17)
  , toIObject = _dereq_(76)
  , toLength  = _dereq_(77);

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl   = toIObject(callSite.raw)
      , len   = toLength(tpl.length)
      , $$    = arguments
      , $$len = $$.length
      , res   = []
      , i     = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < $$len)res.push(String($$[i]));
    } return res.join('');
  }
});
},{"17":17,"76":76,"77":77}],164:[function(_dereq_,module,exports){
var $def = _dereq_(17);

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: _dereq_(69)
});
},{"17":17,"69":69}],165:[function(_dereq_,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $def        = _dereq_(17)
  , toLength    = _dereq_(77)
  , context     = _dereq_(67)
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$def($def.P + $def.F * _dereq_(22)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , $$     = arguments
      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"17":17,"22":22,"67":67,"77":77}],166:[function(_dereq_,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
_dereq_(70)('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"70":70}],167:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = _dereq_(45)
  , global         = _dereq_(28)
  , has            = _dereq_(29)
  , SUPPORT_DESC   = _dereq_(71)
  , $def           = _dereq_(17)
  , $redef         = _dereq_(57)
  , $fails         = _dereq_(23)
  , shared         = _dereq_(61)
  , setTag         = _dereq_(72)
  , uid            = _dereq_(79)
  , wks            = _dereq_(81)
  , keyOf          = _dereq_(46)
  , $names         = _dereq_(27)
  , enumKeys       = _dereq_(20)
  , isArray        = _dereq_(35)
  , anObject       = _dereq_(3)
  , toIObject      = _dereq_(76)
  , createDesc     = _dereq_(56)
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = SUPPORT_DESC && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(SUPPORT_DESC && !_dereq_(47)){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag(global.JSON, 'JSON', true);
},{"17":17,"20":20,"23":23,"27":27,"28":28,"29":29,"3":3,"35":35,"45":45,"46":46,"47":47,"56":56,"57":57,"61":61,"71":71,"72":72,"76":76,"79":79,"81":81}],168:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_(45)
  , weak         = _dereq_(13)
  , isObject     = _dereq_(37)
  , has          = _dereq_(29)
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = _dereq_(14)('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    _dereq_(57)(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"13":13,"14":14,"29":29,"37":37,"45":45,"57":57}],169:[function(_dereq_,module,exports){
'use strict';
var weak = _dereq_(13);

// 23.4 WeakSet Objects
_dereq_(14)('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"13":13,"14":14}],170:[function(_dereq_,module,exports){
'use strict';
var $def      = _dereq_(17)
  , $includes = _dereq_(6)(true);
$def($def.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_(80)('includes');
},{"17":17,"6":6,"80":80}],171:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_(17);

$def($def.P, 'Map', {toJSON: _dereq_(12)('Map')});
},{"12":12,"17":17}],172:[function(_dereq_,module,exports){
// http://goo.gl/XkBrjD
var $def     = _dereq_(17)
  , $entries = _dereq_(52)(true);

$def($def.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"17":17,"52":52}],173:[function(_dereq_,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = _dereq_(45)
  , $def       = _dereq_(17)
  , ownKeys    = _dereq_(53)
  , toIObject  = _dereq_(76)
  , createDesc = _dereq_(56);

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"17":17,"45":45,"53":53,"56":56,"76":76}],174:[function(_dereq_,module,exports){
// http://goo.gl/XkBrjD
var $def    = _dereq_(17)
  , $values = _dereq_(52)(false);

$def($def.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"17":17,"52":52}],175:[function(_dereq_,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = _dereq_(17)
  , $re  = _dereq_(58)(/[\\^$*+?.()|[\]{}]/g, '\\$&');
$def($def.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"17":17,"58":58}],176:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_(17);

$def($def.P, 'Set', {toJSON: _dereq_(12)('Set')});
},{"12":12,"17":17}],177:[function(_dereq_,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = _dereq_(17)
  , $at  = _dereq_(66)(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"17":17,"66":66}],178:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(17)
  , $pad = _dereq_(68);
$def($def.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"17":17,"68":68}],179:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(17)
  , $pad = _dereq_(68);
$def($def.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"17":17,"68":68}],180:[function(_dereq_,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
_dereq_(70)('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"70":70}],181:[function(_dereq_,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
_dereq_(70)('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"70":70}],182:[function(_dereq_,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = _dereq_(45)
  , $def    = _dereq_(17)
  , $Array  = _dereq_(15).Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = _dereq_(16)(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$def($def.S, 'Array', statics);
},{"15":15,"16":16,"17":17,"45":45}],183:[function(_dereq_,module,exports){
_dereq_(89);
var global      = _dereq_(28)
  , hide        = _dereq_(30)
  , Iterators   = _dereq_(44)
  , ITERATOR    = _dereq_(81)('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NL && !(ITERATOR in NLProto))hide(NLProto, ITERATOR, ArrayValues);
if(HTC && !(ITERATOR in HTCProto))hide(HTCProto, ITERATOR, ArrayValues);
},{"28":28,"30":30,"44":44,"81":81,"89":89}],184:[function(_dereq_,module,exports){
var $def  = _dereq_(17)
  , $task = _dereq_(73);
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"17":17,"73":73}],185:[function(_dereq_,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = _dereq_(28)
  , $def       = _dereq_(17)
  , invoke     = _dereq_(32)
  , partial    = _dereq_(54)
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"17":17,"28":28,"32":32,"54":54}],186:[function(_dereq_,module,exports){
_dereq_(83);
_dereq_(167);
_dereq_(122);
_dereq_(130);
_dereq_(134);
_dereq_(135);
_dereq_(123);
_dereq_(133);
_dereq_(132);
_dereq_(128);
_dereq_(129);
_dereq_(127);
_dereq_(124);
_dereq_(126);
_dereq_(131);
_dereq_(125);
_dereq_(93);
_dereq_(92);
_dereq_(112);
_dereq_(113);
_dereq_(114);
_dereq_(115);
_dereq_(116);
_dereq_(117);
_dereq_(118);
_dereq_(119);
_dereq_(120);
_dereq_(121);
_dereq_(95);
_dereq_(96);
_dereq_(97);
_dereq_(98);
_dereq_(99);
_dereq_(100);
_dereq_(101);
_dereq_(102);
_dereq_(103);
_dereq_(104);
_dereq_(105);
_dereq_(106);
_dereq_(107);
_dereq_(108);
_dereq_(109);
_dereq_(110);
_dereq_(111);
_dereq_(160);
_dereq_(163);
_dereq_(166);
_dereq_(162);
_dereq_(158);
_dereq_(159);
_dereq_(161);
_dereq_(164);
_dereq_(165);
_dereq_(88);
_dereq_(90);
_dereq_(89);
_dereq_(91);
_dereq_(84);
_dereq_(85);
_dereq_(87);
_dereq_(86);
_dereq_(151);
_dereq_(152);
_dereq_(153);
_dereq_(154);
_dereq_(155);
_dereq_(156);
_dereq_(136);
_dereq_(94);
_dereq_(157);
_dereq_(168);
_dereq_(169);
_dereq_(137);
_dereq_(138);
_dereq_(139);
_dereq_(140);
_dereq_(141);
_dereq_(144);
_dereq_(142);
_dereq_(143);
_dereq_(145);
_dereq_(146);
_dereq_(147);
_dereq_(148);
_dereq_(150);
_dereq_(149);
_dereq_(170);
_dereq_(177);
_dereq_(178);
_dereq_(179);
_dereq_(180);
_dereq_(181);
_dereq_(175);
_dereq_(173);
_dereq_(174);
_dereq_(172);
_dereq_(171);
_dereq_(176);
_dereq_(182);
_dereq_(185);
_dereq_(184);
_dereq_(183);
module.exports = _dereq_(15);
},{"100":100,"101":101,"102":102,"103":103,"104":104,"105":105,"106":106,"107":107,"108":108,"109":109,"110":110,"111":111,"112":112,"113":113,"114":114,"115":115,"116":116,"117":117,"118":118,"119":119,"120":120,"121":121,"122":122,"123":123,"124":124,"125":125,"126":126,"127":127,"128":128,"129":129,"130":130,"131":131,"132":132,"133":133,"134":134,"135":135,"136":136,"137":137,"138":138,"139":139,"140":140,"141":141,"142":142,"143":143,"144":144,"145":145,"146":146,"147":147,"148":148,"149":149,"15":15,"150":150,"151":151,"152":152,"153":153,"154":154,"155":155,"156":156,"157":157,"158":158,"159":159,"160":160,"161":161,"162":162,"163":163,"164":164,"165":165,"166":166,"167":167,"168":168,"169":169,"170":170,"171":171,"172":172,"173":173,"174":174,"175":175,"176":176,"177":177,"178":178,"179":179,"180":180,"181":181,"182":182,"183":183,"184":184,"185":185,"83":83,"84":84,"85":85,"86":86,"87":87,"88":88,"89":89,"90":90,"91":91,"92":92,"93":93,"94":94,"95":95,"96":96,"97":97,"98":98,"99":99}],187:[function(_dereq_,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

/*! angular-vertxbus - v3.2.0 - 2015-10-31
* http://github.com/knalli/angular-vertxbus
* Copyright (c) 2015 Jan Philipp; Licensed MIT */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var moduleName = 'knalli.angular-vertxbus';

exports.moduleName = moduleName;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _module2.default;

},{"./module":15}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventBusDelegate = require('./service/delegate/EventBusDelegate');

var _EventBusDelegate2 = _interopRequireDefault(_EventBusDelegate);

var _NoopDelegate = require('./service/delegate/NoopDelegate');

var _NoopDelegate2 = _interopRequireDefault(_NoopDelegate);

var _Delegator = require('./service/Delegator');

var _Delegator2 = _interopRequireDefault(_Delegator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @ngdoc service
 * @module knalli.angular-vertxbus
 * @name knalli.angular-vertxbus.vertxEventBusServiceProvider
 * @description
 * This is the configuration provider for {@link knalli.angular-vertxbus.vertxEventBusService}.
 */

var DEFAULTS = {
  enabled: true,
  debugEnabled: false,
  loginRequired: false,
  prefix: 'vertx-eventbus.',
  sockjsStateInterval: 10000,
  messageBuffer: 10000
};

var VertxEventBusServiceProvider = function VertxEventBusServiceProvider() {
  var _this = this;

  // options (globally, application-wide)
  var options = angular.extend({}, DEFAULTS);

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#enable
   *
   * @description
   * Enables or disables the service. This setup is immutable.
   *
   * @param {boolean} [value=true] service is enabled on startup
   * @returns {object} this
   */
  this.enable = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.enabled : arguments[0];

    options.enabled = value === true;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#useDebug
   *
   * @description
   * Enables a verbose mode in which certain events will be logged to `$log`.
   *
   * @param {boolean} [value=false] verbose mode (using `$log`)
   * @returns {object} this
   */
  this.useDebug = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.debugEnabled : arguments[0];

    options.debugEnabled = value === true;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#usePrefix
   *
   * @description
   * Overrides the default prefix which will be used for emitted events.
   *
   * @param {string} [value='vertx-eventbus.'] prefix used in event names
   * @returns {object} this
   */
  this.usePrefix = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.prefix : arguments[0];

    options.prefix = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#requireLogin
   *
   *
   * @description
   * Defines whether a login is being required or not.
   *
   * @param {boolean} [value=false] defines requirement of a valid session
   * @returns {object} this
   */
  this.requireLogin = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.loginRequired : arguments[0];

    options.loginRequired = value === true;
    return _this;
  };

  /**
   * @ngdoc method
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#useSockJsStateInterval
   *
   *
   * @description
   * Overrides the interval of checking the connection is still valid (required for reconnecting automatically).
   *
   * @param {boolean} [value=10000] interval of checking the underlying connection's state (in ms)
   * @returns {object} this
   */
  this.useSockJsStateInterval = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.sockjsStateInterval : arguments[0];

    options.sockjsStateInterval = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#useMessageBuffer
   *
   * @description
   * Enables buffering of (sending) messages.
   *
   * The setting defines the total amount of buffered messages (`0` no buffering). A message will be buffered if
   * connection is still in progress, the connection is stale or a login is required/pending.
   *
   * @param {boolean} [value=0] allowed total amount of messages in the buffer
   * @returns {object} this
   */
  this.useMessageBuffer = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.messageBuffer : arguments[0];

    options.messageBuffer = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#useLoginInterceptor
   *
   * @description
   * Defines a login interceptor corresponding for the option `loginRequired`.
   *
   * The argument must be a valid function reference with four arguments
   * - send (an at runtime injected function for actual sending: i.e. `send(address, message, next)`
   * - username (the used username)
   * - password (the used password)
   * - next (the callback function reference)
   *
   * @param {function} a function with params `(send, username, password, next)`
   * @returns {object} this
   */
  this.useLoginInterceptor = function (value) {
    options.loginInterceptor = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
   * @name .#configureLoginInterceptor
   *
   * @description
   * Configures and defines a login interceptor corresponding for the option #requireLogin().
   *
   * This utilizes #useLoginInterceptor and is available as a convenient method.
   *
   * At default, the created request will look similar like vertx.basicauthmanager.login.
   *
   * @param {string} the address to send
   * @param {function=} optional a builder for creating the message body
   * @returns {object} this
   */
  this.configureLoginInterceptor = function (address, argumentsBuilder) {
    if (!argumentsBuilder) {
      // Legacy fallback: create a message like in Vert.x 2
      argumentsBuilder = function (username, password) {
        return {
          action: 'findone',
          collection: 'users',
          matcher: {
            username: username,
            password: password
          }
        };
      };
    }
    return _this.useLoginInterceptor(function (send, username, password, next) {
      send(address, argumentsBuilder(username, password), next);
    });
  };

  /**
   * @ngdoc service
   * @module knalli.angular-vertxbus
   * @name knalli.angular-vertxbus.vertxEventBusService
   * @description
   * A service utilizing an underlying Vert.x Event Bus
   *
   * The advanced features of this service are:
   *  - broadcasting the connection changes (vertx-eventbus.system.connected, vertx-eventbus.system.disconnected) on $rootScope
   *  - registering all handlers again when a reconnect had been required
   *  - supporting a promise when using send()
   *  - adding aliases on (registerHandler), un (unregisterHandler) and emit (publish)
   *
   * Basic usage:
   * <pre>
   * module.controller('MyController', function('vertxEventService') {
  *   vertxEventService.on('my.address', function(message) {
  *     console.log("JSON Message received: ", message)
  *   });
  *   vertxEventService.publish('my.other.address', {type: 'foo', data: 'bar'});
  * });
   * </pre>
   *
   * Note the additional {@link knalli.angular-vertxbus.vertxEventBusServiceProvider configuration} of the module itself.
   *
   * @requires knalli.angular-vertxbus.vertxEventBus
   * @requires $rootScope
   * @requires $q
   * @requires $interval
   * @requires $log
   */
  /* @ngInject */
  this.$get = function ($rootScope, $q, $interval, vertxEventBus, $log) {
    // Current options (merged defaults with application-wide settings)
    var instanceOptions = angular.extend({}, vertxEventBus.getOptions(), options);
    if (instanceOptions.enabled) {
      return new _Delegator2.default(new _EventBusDelegate2.default($rootScope, $interval, $log, $q, vertxEventBus, instanceOptions), $log);
    } else {
      return new _Delegator2.default(new _NoopDelegate2.default());
    }
  };
  this.$get.$inject = ["$rootScope", "$q", "$interval", "vertxEventBus", "$log"];
};

exports.default = VertxEventBusServiceProvider;

},{"./service/Delegator":8,"./service/delegate/EventBusDelegate":10,"./service/delegate/NoopDelegate":11}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventBusAdapter = require('./adapter/EventBusAdapter');

var _EventBusAdapter2 = _interopRequireDefault(_EventBusAdapter);

var _NoopAdapter = require('./adapter/NoopAdapter');

var _NoopAdapter2 = _interopRequireDefault(_NoopAdapter);

var _ConnectionConfigHolder = require('./support/ConnectionConfigHolder');

var _ConnectionConfigHolder2 = _interopRequireDefault(_ConnectionConfigHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @ngdoc service
 * @module knalli.angular-vertxbus
 * @name knalli.angular-vertxbus.vertxEventBusProvider
 * @description
 * An AngularJS wrapper for projects using the VertX Event Bus
 */

var DEFAULTS = {
  enabled: true,
  debugEnabled: false,
  initialConnectEnabled: true,
  urlServer: location.protocol + '//' + location.hostname + ((function () {
    if (location.port) {
      return ':' + location.port;
    }
  })() || ''),
  urlPath: '/eventbus',
  reconnectEnabled: true,
  sockjsReconnectInterval: 10000,
  sockjsOptions: {}
};

var VertxEventBusWrapperProvider = function VertxEventBusWrapperProvider() {
  var _this = this;

  // options (globally, application-wide)
  var options = angular.extend({}, DEFAULTS);

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#enable
   *
   * @description
   * Enables or disables the service. This setup is immutable.
   *
   * @param {boolean} [value=true] service is enabled on startup
   * @returns {object} this
   */
  this.enable = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.enabled : arguments[0];

    options.enabled = value === true;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#disableAutoConnect
   *
   * @description
   * Disables the auto connection feature.
   *
   * This feature will be only available if `enable == true`.
   *
   * @param {boolean} [value=true] auto connect on startup
   * @returns {object} this
   */
  this.disableAutoConnect = function () {
    options.initialConnectEnabled = false;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#useDebug
   *
   * @description
   * Enables a verbose mode in which certain events will be logged to `$log`.
   *
   * @param {boolean} [value=false] verbose mode (using `$log`)
   * @returns {object} this
   */
  this.useDebug = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.debugEnabled : arguments[0];

    options.debugEnabled = value === true;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#useUrlServer
   *
   * @description
   * Overrides the url part "server" for connecting. The default is based on
   * - `location.protocol`
   * - `location.hostname`
   * - `location.port`
   *
   * i.e. `http://domain.tld` or `http://domain.tld:port`
   *
   * @param {boolean} [value=$computed] server to connect (default based on `location.protocol`, `location.hostname` and `location.port`)
   * @returns {object} this
   */
  this.useUrlServer = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.urlServer : arguments[0];

    options.urlServer = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#useUrlPath
   *
   * @description
   * Overrides the url part "path" for connection.
   *
   * @param {boolean} [value='/eventbus'] path to connect
   * @returns {object} this
   */
  this.useUrlPath = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.urlPath : arguments[0];

    options.urlPath = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#useReconnect
   *
   * @description
   * Enables or disables the automatic reconnect handling.
   *
   * @param {boolean} [value=true] if a disconnect was being noted, a reconnect will be enforced automatically
   * @returns {object} this
   */
  this.useReconnect = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.reconnectEnabled : arguments[0];

    options.reconnectEnabled = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#useSockJsReconnectInterval
   *
   * @description
   * Overrides the timeout for reconnecting after a disconnect was found.
   *
   * @param {boolean} [value=10000] time between a disconnect and the next try to reconnect (in ms)
   * @returns {object} this
   */
  this.useSockJsReconnectInterval = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.sockjsReconnectInterval : arguments[0];

    options.sockjsReconnectInterval = value;
    return _this;
  };

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
   * @name .#useSockJsOptions
   *
   * @description
   * Sets additional params for the `SockJS` instance.
   *
   * Internally, it will be applied (as `options`) like `new SockJS(url, undefined, options)`.
   *
   * @param {boolean} [value={}]  optional params for raw SockJS options
   * @returns {object} this
   */
  this.useSockJsOptions = function () {
    var value = arguments.length <= 0 || arguments[0] === undefined ? DEFAULTS.sockjsOptions : arguments[0];

    options.sockjsOptions = value;
    return _this;
  };

  /**
   * @ngdoc service
   * @module knalli.angular-vertxbus
   * @name knalli.angular-vertxbus.vertxEventBus
   * @description
   * A stub representing the Vert.x EventBus (core functionality)
   *
   * Because the Event Bus cannot handle a reconnect (because of the underlaying SockJS), a
   * new instance of the bus have to be created.
   * This stub ensures only one object holding the current active instance of the bus.
   *
   * The stub supports theses Vert.x Event Bus APIs:
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_close close()}
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_login login(username, password, replyHandler)}
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_send send(address, message, handler)}
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_publish publish(address, message)}
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_registerHandler registerHandler(adress, handler)}
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_unregisterHandler unregisterHandler(address, handler)}
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_readyState readyState()}
   *
   * Furthermore, the stub supports theses extra APIs:
   *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_reconnect reconnect()}
   *
   * @requires $timeout
   * @requires $log
   */
  /* @ngInject */
  this.$get = function ($timeout, $log, $q) {
    // Current options (merged defaults with application-wide settings)
    var instanceOptions = angular.extend({}, DEFAULTS, options);
    if (instanceOptions.enabled && vertx && vertx.EventBus) {
      if (instanceOptions.debugEnabled) {
        $log.debug('[Vert.x EB Stub] Enabled');
      }

      // aggregate server connection params
      instanceOptions.connectionConfig = new _ConnectionConfigHolder2.default({
        urlServer: instanceOptions.urlServer,
        urlPath: instanceOptions.urlPath
      });
      delete instanceOptions.urlServer;
      delete instanceOptions.urlPath;

      return new _EventBusAdapter2.default(vertx.EventBus, $timeout, $log, $q, instanceOptions);
    } else {
      if (instanceOptions.debugEnabled) {
        $log.debug('[Vert.x EB Stub] Disabled');
      }
      return new _NoopAdapter2.default(vertx.EventBus, $q);
    }
  };
  this.$get.$inject = ["$timeout", "$log", "$q"];
};

exports.default = VertxEventBusWrapperProvider;

},{"./adapter/EventBusAdapter":6,"./adapter/NoopAdapter":7,"./support/ConnectionConfigHolder":12}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseAdapter = (function () {
  function BaseAdapter($q) {
    _classCallCheck(this, BaseAdapter);

    this.$q = $q;
  }

  _createClass(BaseAdapter, [{
    key: "configureConnection",
    value: function configureConnection() {}
  }, {
    key: "connect",
    value: function connect() {
      return this.$q.reject();
    }
  }, {
    key: "reconnect",
    value: function reconnect() {}
  }, {
    key: "close",
    value: function close() {}
  }, {
    key: "login",
    value: function login() {}
  }, {
    key: "send",
    value: function send() {}
  }, {
    key: "publish",
    value: function publish() {}
  }, {
    key: "registerHandler",
    value: function registerHandler() {}
  }, {
    key: "unregisterHandler",
    value: function unregisterHandler() {}
  }, {
    key: "readyState",
    value: function readyState() {}
  }, {
    key: "getOptions",
    value: function getOptions() {
      return {};
    }

    // empty: can be overriden by externals

  }, {
    key: "onopen",
    value: function onopen() {}

    // empty: can be overriden by externals

  }, {
    key: "onclose",
    value: function onclose() {}
  }]);

  return BaseAdapter;
})();

exports.default = BaseAdapter;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../config.js');

var _BaseAdapter2 = require('./BaseAdapter');

var _BaseAdapter3 = _interopRequireDefault(_BaseAdapter2);

var _ConnectionConfigHolder = require('./../support/ConnectionConfigHolder');

var _ConnectionConfigHolder2 = _interopRequireDefault(_ConnectionConfigHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @ngdoc service
 * @module vertx
 * @name vertx.EventBus
 *
 * @description
 * This is the interface of `vertx.EventBus`. It is not included.
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#close
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#login
 *
 * @param {string} username credential's username
 * @param {string} password credential's password
 * @param {function=} replyHandler optional callback
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#send
 *
 * @param {string} address target address
 * @param {object} message payload message
 * @param {function=} replyHandler optional callback
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#publish
 *
 * @param {string} address target address
 * @param {object} message payload message
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#registerHandler
 *
 * @param {string} address target address
 * @param {function} handler callback handler
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#unregisterHandler
 *
 * @param {string} address target address
 * @param {function} handler callback handler to be removed
 */

/**
 * @ngdoc method
 * @module vertx
 * @methodOf vertx.EventBus
 * @name .#readyState
 *
 * @returns {number} value of vertxbus connection states
 */

var EventBusAdapter = (function (_BaseAdapter) {
  _inherits(EventBusAdapter, _BaseAdapter);

  function EventBusAdapter(EventBus, $timeout, $log, $q, _ref) {
    _classCallCheck(this, EventBusAdapter);

    var enabled = _ref.enabled;
    var debugEnabled = _ref.debugEnabled;
    var initialConnectEnabled = _ref.initialConnectEnabled;
    var connectionConfig = _ref.connectionConfig;
    var reconnectEnabled = _ref.reconnectEnabled;
    var sockjsReconnectInterval = _ref.sockjsReconnectInterval;
    var sockjsOptions = _ref.sockjsOptions;

    // actual EventBus type

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(EventBusAdapter).call(this, $q));

    _this3.EventBus = EventBus;
    _this3.$timeout = $timeout;
    _this3.$log = $log;
    _this3.$q = $q;
    _this3.options = {
      enabled: enabled,
      debugEnabled: debugEnabled,
      initialConnectEnabled: initialConnectEnabled,
      connectionConfig: connectionConfig,
      reconnectEnabled: reconnectEnabled,
      sockjsReconnectInterval: sockjsReconnectInterval,
      sockjsOptions: sockjsOptions
    };
    _this3.disconnectTimeoutEnabled = true;
    if (initialConnectEnabled) {
      // asap create connection
      _this3.connect();
    }
    return _this3;
  }

  /**
   * @ngdoc method
   * @module knalli.angular-vertxbus
   * @methodOf knalli.angular-vertxbus.vertxEventBus
   * @name .#configureConnect
   *
   * @description
   * Reconfigure the connection details.
   *
   * @param {string} urlServer see {@link knalli.angular-vertxbus.vertxEventBusProvider#methods_useUrlServer vertxEventBusProvider.useUrlServer()}
   * @param {string} [urlPath=/eventbus] see {@link knalli.angular-vertxbus.vertxEventBusProvider#methods_useUrlPath vertxEventBusProvider.useUrlPath()}
   */

  _createClass(EventBusAdapter, [{
    key: 'configureConnection',
    value: function configureConnection(urlServer) {
      var urlPath = arguments.length <= 1 || arguments[1] === undefined ? '/eventbus' : arguments[1];

      this.options.connectionConfig = new _ConnectionConfigHolder2.default({ urlServer: urlServer, urlPath: urlPath });
      return this;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this = this;

      // connect promise
      var deferred = this.$q.defer();
      // currently valid url
      var url = '' + this.options.connectionConfig.urlServer + this.options.connectionConfig.urlPath;
      if (this.options.debugEnabled) {
        this.$log.debug('[Vert.x EB Stub] Enabled: connecting \'' + url + '\'');
      }
      // Because we have rebuild an EventBus object (because it have to rebuild a SockJS object)
      // we must wrap the object. Therefore, we have to mimic the behavior of onopen and onclose each time.
      this.instance = new this.EventBus(url, undefined, this.options.sockjsOptions);
      this.instance.onopen = function () {
        if (_this.options.debugEnabled) {
          _this.$log.debug('[Vert.x EB Stub] Connected');
        }
        if (angular.isFunction(_this.onopen)) {
          _this.onopen();
        }
        deferred.resolve();
      };
      // instance onClose handler
      this.instance.onclose = function () {
        if (_this.options.debugEnabled) {
          _this.$log.debug('[Vert.x EB Stub] Reconnect in ' + _this.options.sockjsReconnectInterval + 'ms');
        }
        if (angular.isFunction(_this.onclose)) {
          _this.onclose();
        }
        _this.instance = undefined;

        if (!_this.disconnectTimeoutEnabled) {
          // reconnect required asap
          if (_this.options.debugEnabled) {
            _this.$log.debug('[Vert.x EB Stub] Reconnect immediately');
          }
          _this.disconnectTimeoutEnabled = true;
          _this.connect();
        } else if (_this.options.reconnectEnabled) {
          // automatic reconnect after timeout
          if (_this.options.debugEnabled) {
            _this.$log.debug('[Vert.x EB Stub] Reconnect in ' + _this.options.sockjsReconnectInterval + 'ms');
          }
          _this.$timeout(function () {
            return _this.connect();
          }, _this.options.sockjsReconnectInterval);
        }
      };
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#reconnect
     *
     * @description
     * Reconnects the underlying connection.
     *
     * Unless a connection is open, it will connect using a new one.
     *
     * If a connection is already open, it will close this one and opens a new one. If `immediately` is `true`, the
     * default timeout for reconnect will be skipped.
     *
     * @param {boolean} [immediately=false] optionally enforce a reconnect asap instead of using the timeout
     */

  }, {
    key: 'reconnect',
    value: function reconnect() {
      var immediately = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (this.instance && this.instance.readyState() === this.EventBus.OPEN) {
        if (immediately) {
          this.disconnectTimeoutEnabled = false;
        }
        this.instance.close();
      } else {
        this.connect();
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#close
     *
     * @description
     * Closes the underlying connection.
     *
     * Note: If automatic reconnection is active, a new connection will be established after the {@link knalli.angular-vertxbus.vertxEventBusProvider#methods_useReconnect reconnect timeout}.
     *
     * See also:
     * - {@link vertx.EventBus#methods_close vertx.EventBus.close()}
     */

  }, {
    key: 'close',
    value: function close() {
      if (this.instance) {
        this.instance.close();
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#login
     *
     * @description
     * Sends a login request against the vertxbus
     *
     * See also:
     * - {@link vertx.EventBus#methods_login vertx.EventBus.login()}
     *
     * @param {string} username credential's username
     * @param {string} password credential's password
     * @param {function=} replyHandler optional callback
     */

  }, {
    key: 'login',
    value: function login(username, password, replyHandler) {
      if (this.instance) {
        if (!this.instance.login) {
          this.$log.error('[Vert.x EB Stub] Attempted to call vertx.EventBus.login(), but that was not found. Are you using v3 already? Have a look at vertx.EventBusServiceProvider.useLoginInterceptor');
          replyHandler();
          return;
        }
        this.instance.login(username, password, replyHandler);
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#send
     *
     * @description
     * Sends a message
     *
     * See also:
     * - {@link vertx.EventBus#methods_send vertx.EventBus.send()}
     *
     * @param {string} address target address
     * @param {object} message payload message
     * @param {function=} replyHandler optional callback
     * @param {function=} failureHandler optional callback (since Vert.x 3.0.0)
     */

  }, {
    key: 'send',
    value: function send(address, message, replyHandler, failureHandler) {
      if (this.instance) {
        this.instance.send(address, message, replyHandler, failureHandler);
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#publish
     *
     * @description
     * Publishes a message
     *
     * See also:
     * - {@link vertx.EventBus#methods_publish vertx.EventBus.publish()}
     *
     * @param {string} address target address
     * @param {object} message payload message
     */

  }, {
    key: 'publish',
    value: function publish(address, message) {
      if (this.instance) {
        this.instance.publish(address, message);
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#registerHandler
     *
     * @description
     * Registers a listener
     *
     * See also:
     * - {@link vertx.EventBus#methods_registerHandler vertx.EventBus.registerHandler()}
     *
     * @param {string} address target address
     * @param {function} handler callback handler
     */

  }, {
    key: 'registerHandler',
    value: function registerHandler(address, handler) {
      var _this2 = this;

      if (this.instance) {
        this.instance.registerHandler(address, handler);
        // and return the deregister callback
        var deconstructor = function deconstructor() {
          _this2.unregisterHandler(address, handler);
        };
        deconstructor.displayName = _config.moduleName + '.wrapper.eventbus.registerHandler.deconstructor';
        return deconstructor;
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#unregisterHandler
     *
     * @description
     * Removes a registered a listener
     *
     * See also:
     * - {@link vertx.EventBus#methods_unregisterHandler vertx.EventBus.unregisterHandler()}
     *
     * @param {string} address target address
     * @param {function} handler callback handler to be removed
     */

  }, {
    key: 'unregisterHandler',
    value: function unregisterHandler(address, handler) {
      if (this.instance && this.instance.readyState() === this.EventBus.OPEN) {
        this.instance.unregisterHandler(address, handler);
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBus
     * @name .#readyState
     *
     * @description
     * Returns the current connection state
     *
     * See also:
     * - {@link vertx.EventBus#methods_readyState vertx.EventBus.readyState()}
     *
     * @returns {number} value of vertxbus connection states
     */

  }, {
    key: 'readyState',
    value: function readyState() {
      if (this.instance) {
        return this.instance.readyState();
      } else {
        return this.EventBus.CLOSED;
      }
    }

    // private

  }, {
    key: 'getOptions',
    value: function getOptions() {
      // clone options
      return angular.extend({}, this.options);
    }
  }]);

  return EventBusAdapter;
})(_BaseAdapter3.default);

exports.default = EventBusAdapter;

},{"../../config.js":1,"./../support/ConnectionConfigHolder":12,"./BaseAdapter":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseAdapter2 = require('./BaseAdapter');

var _BaseAdapter3 = _interopRequireDefault(_BaseAdapter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NoopAdapter = (function (_BaseAdapter) {
  _inherits(NoopAdapter, _BaseAdapter);

  function NoopAdapter(EventBus, $q) {
    _classCallCheck(this, NoopAdapter);

    // actual EventBus type

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NoopAdapter).call(this, $q));

    _this.EventBus = EventBus;
    return _this;
  }

  return NoopAdapter;
})(_BaseAdapter3.default);

exports.default = NoopAdapter;

},{"./BaseAdapter":5}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Delegator = (function () {
  function Delegator(delegate, $log) {
    var _this = this;

    _classCallCheck(this, Delegator);

    this.delegate = delegate;
    this.$log = $log;
    this.handlers = [];
    this.delegate.observe({
      afterEventbusConnected: function afterEventbusConnected() {
        return _this.afterEventbusConnected();
      }
    });
  }

  _createClass(Delegator, [{
    key: 'afterEventbusConnected',
    value: function afterEventbusConnected() {
      for (var address in this.handlers) {
        var callbacks = this.handlers[address];
        if (callbacks && callbacks.length) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var callback = _step.value;

              this.delegate.registerHandler(address, callback);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }
  }, {
    key: 'registerHandler',
    value: function registerHandler(address, callback) {
      var _this2 = this;

      if (!this.handlers[address]) {
        this.handlers[address] = [];
      }
      this.handlers[address].push(callback);
      var unregisterFn = null;
      if (this.delegate.isConnectionOpen()) {
        this.delegate.registerHandler(address, callback);
        unregisterFn = function () {
          return _this2.delegate.unregisterHandler(address, callback);
        };
      }
      // and return the deregister callback
      var deconstructor = function deconstructor() {
        if (unregisterFn) {
          unregisterFn();
          unregisterFn = undefined;
        }
        // Remove from internal map
        if (_this2.handlers[address]) {
          var index = _this2.handlers[address].indexOf(callback);
          if (index > -1) {
            _this2.handlers[address].splice(index, 1);
          }
          if (_this2.handlers[address].length < 1) {
            _this2.handlers[address] = undefined;
          }
        }
      };
      deconstructor.displayName = _config.moduleName + '.service.registerHandler.deconstructor';
      return deconstructor;
    }
  }, {
    key: 'on',
    value: function on(address, callback) {
      return this.registerHandler(address, callback);
    }
  }, {
    key: 'addListener',
    value: function addListener(address, callback) {
      return this.registerHandler(address, callback);
    }
  }, {
    key: 'unregisterHandler',
    value: function unregisterHandler(address, callback) {
      // Remove from internal map
      if (this.handlers[address]) {
        var index = this.handlers[address].indexOf(callback);
        if (index > -1) {
          this.handlers[address].splice(index, 1);
        }
        if (this.handlers[address].length < 1) {
          this.handlers[address] = undefined;
        }
      }
      // Remove from real instance
      if (this.delegate.isConnectionOpen()) {
        this.delegate.unregisterHandler(address, callback);
      }
    }
  }, {
    key: 'un',
    value: function un(address, callback) {
      return this.unregisterHandler(address, callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(address, callback) {
      return this.unregisterHandler(address, callback);
    }
  }, {
    key: 'send',
    value: function send(address, message) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      // FALLBACK: signature change since 2.0
      if (!angular.isObject(options)) {
        this.$log.error(_config.moduleName + ': Signature of vertxEventBusService.send() has been changed!');
        return this.send(address, message, {
          timeout: arguments[2] !== undefined ? arguments[2] : 10000,
          expectReply: arguments[3] !== undefined ? arguments[3] : true
        });
      }

      return this.delegate.send(address, message, options.timeout, options.expectReply);
    }
  }, {
    key: 'publish',
    value: function publish(address, message) {
      return this.delegate.publish(address, message);
    }
  }, {
    key: 'emit',
    value: function emit(address, message) {
      return this.publish(address, message);
    }
  }, {
    key: 'getConnectionState',
    value: function getConnectionState() {
      return this.delegate.getConnectionState();
    }
  }, {
    key: 'readyState',
    value: function readyState() {
      return this.getConnectionState();
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      return this.delegate.isEnabled();
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this.delegate.isConnected();
    }
  }, {
    key: 'login',
    value: function login(username, password, timeout) {
      return this.delegate.login(username, password, timeout);
    }
  }]);

  return Delegator;
})();

exports.default = Delegator;

},{"../../config":1}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseDelegate = (function () {
  function BaseDelegate() {
    _classCallCheck(this, BaseDelegate);
  }

  _createClass(BaseDelegate, [{
    key: "getConnectionState",
    value: function getConnectionState() {
      return 3; // CLOSED
    }
  }, {
    key: "isConnectionOpen",
    value: function isConnectionOpen() {
      return false;
    }
  }, {
    key: "isValidSession",
    value: function isValidSession() {
      return false;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return false;
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return false;
    }
  }, {
    key: "send",
    value: function send() {}
  }, {
    key: "publish",
    value: function publish() {}
  }]);

  return BaseDelegate;
})();

exports.default = BaseDelegate;

},{}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../../config');

var _Queue = require('./../../support/Queue');

var _Queue2 = _interopRequireDefault(_Queue);

var _SimpleMap = require('./../../support/SimpleMap');

var _SimpleMap2 = _interopRequireDefault(_SimpleMap);

var _BaseDelegate2 = require('./BaseDelegate');

var _BaseDelegate3 = _interopRequireDefault(_BaseDelegate2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @ngdoc event
 * @module knalli.angular-vertxbus
 * @eventOf knalli.angular-vertxbus.vertxEventBusService
 * @eventType broadcast on $rootScope
 * @name disconnected
 *
 * @description
 * After a connection was being terminated.
 *
 * Event name is `prefix + 'system.disconnected'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
 */

/**
 * @ngdoc event
 * @module knalli.angular-vertxbus
 * @eventOf knalli.angular-vertxbus.vertxEventBusService
 * @eventType broadcast on $rootScope
 * @name connected
 *
 * @description
 * After a connection was being established
 *
 * Event name is `prefix + 'system.connected'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
 */

/**
 * @ngdoc event
 * @module knalli.angular-vertxbus
 * @eventOf knalli.angular-vertxbus.vertxEventBusService
 * @eventType broadcast on $rootScope
 * @name login-succeeded
 *
 * @description
 * After a login has been validated successfully
 *
 * Event name is `prefix + 'system.login.succeeded'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
 *
 * @param {object} data data
 * @param {boolean} data.status must be `'ok'`
 */

/**
 * @ngdoc event
 * @module knalli.angular-vertxbus
 * @eventOf knalli.angular-vertxbus.vertxEventBusService
 * @eventType broadcast on $rootScope
 * @name login-failed
 *
 * @description
 * After a login has been destroyed or was invalidated
 *
 * Event name is `prefix + 'system.login.failed'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
 *
 * @param {object} data data
 * @param {boolean} data.status must be not`'ok'`
 */

var EventBusDelegate = (function (_BaseDelegate) {
  _inherits(EventBusDelegate, _BaseDelegate);

  function EventBusDelegate($rootScope, $interval, $log, $q, eventBus, _ref) {
    _classCallCheck(this, EventBusDelegate);

    var enabled = _ref.enabled;
    var debugEnabled = _ref.debugEnabled;
    var prefix = _ref.prefix;
    var sockjsStateInterval = _ref.sockjsStateInterval;
    var messageBuffer = _ref.messageBuffer;
    var loginRequired = _ref.loginRequired;
    var loginInterceptor = _ref.loginInterceptor;

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(EventBusDelegate).call(this));

    _this7.$rootScope = $rootScope;
    _this7.$interval = $interval;
    _this7.$log = $log;
    _this7.$q = $q;
    _this7.eventBus = eventBus;
    _this7.options = {
      enabled: enabled,
      debugEnabled: debugEnabled,
      prefix: prefix,
      sockjsStateInterval: sockjsStateInterval,
      messageBuffer: messageBuffer,
      loginRequired: loginRequired
    };
    _this7.loginInterceptor = loginInterceptor;
    _this7.connectionState = _this7.eventBus.EventBus.CLOSED;
    _this7.states = {
      connected: false,
      validSession: false
    };
    _this7.observers = [];
    // internal store of buffered messages
    _this7.messageQueue = new _Queue2.default(_this7.options.messageBuffer);
    // internal map of callbacks
    _this7.callbackMap = new _SimpleMap2.default();
    // asap
    _this7.initialize();
    return _this7;
  }

  // internal

  _createClass(EventBusDelegate, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.eventBus.onopen = function () {
        return _this.onEventbusOpen();
      };
      this.eventBus.onclose = function () {
        return _this.onEventbusClose();
      };

      // Update the current connection state periodically.
      var connectionIntervalCheck = function connectionIntervalCheck() {
        return _this.getConnectionState(true);
      };
      connectionIntervalCheck.displayName = 'connectionIntervalCheck';
      this.$interval(function () {
        return connectionIntervalCheck();
      }, this.options.sockjsStateInterval);
    }

    // internal

  }, {
    key: 'onEventbusOpen',
    value: function onEventbusOpen() {
      var connectionStateFlipped = false;
      this.getConnectionState(true);
      if (!this.states.connected) {
        this.states.connected = true;
        connectionStateFlipped = true;
      }
      // Ensure all events will be re-attached
      this.afterEventbusConnected();
      // Everything is online and registered again, let's notify everybody
      if (connectionStateFlipped) {
        this.$rootScope.$broadcast(this.options.prefix + 'system.connected');
      }
      this.$rootScope.$digest(); // explicitly
      // consume message queue?
      if (this.options.messageBuffer && this.messageQueue.size()) {
        while (this.messageQueue.size()) {
          var fn = this.messageQueue.first();
          if (angular.isFunction(fn)) {
            fn();
          }
        }
        this.$rootScope.$digest();
      }
    }

    // internal

  }, {
    key: 'onEventbusClose',
    value: function onEventbusClose() {
      this.getConnectionState(true);
      if (this.states.connected) {
        this.states.connected = false;
        this.$rootScope.$broadcast(this.options.prefix + 'system.disconnected');
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#observe
     *
     * @description
     * Adds an observer
     *
     * @param {object} observer observer
     * @param {function=} observer.afterEventbusConnected will be called after establishing a new connection
     */

  }, {
    key: 'observe',
    value: function observe(observer) {
      this.observers.push(observer);
    }

    // internal

  }, {
    key: 'afterEventbusConnected',
    value: function afterEventbusConnected() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.observers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var observer = _step.value;

          if (angular.isFunction(observer.afterEventbusConnected)) {
            observer.afterEventbusConnected();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#registerHandler
     *
     * @description
     * Registers a callback handler for the specified address match.
     *
     * @param {string} address target address
     * @param {function} callback handler with params `(message, replyTo)`
     * @returns {function=} deconstructor
     */

  }, {
    key: 'registerHandler',
    value: function registerHandler(address, callback) {
      var _this2 = this;

      if (!angular.isFunction(callback)) {
        return;
      }
      if (this.options.debugEnabled) {
        this.$log.debug('[Vert.x EB Service] Register handler for ' + address);
      }
      var callbackWrapper = function callbackWrapper(message, replyTo) {
        callback(message, replyTo);
        _this2.$rootScope.$digest();
      };
      callbackWrapper.displayName = _config.moduleName + '.service.delegate.live.registerHandler.callbackWrapper';
      this.callbackMap.put(callback, callbackWrapper);
      return this.eventBus.registerHandler(address, callbackWrapper);
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#unregisterHandler
     *
     * @description
     * Removes a callback handler for the specified address match.
     *
     * @param {string} address target address
     * @param {function} callback handler with params `(message, replyTo)`
     */

  }, {
    key: 'unregisterHandler',
    value: function unregisterHandler(address, callback) {
      if (!angular.isFunction(callback)) {
        return;
      }
      if (this.options.debugEnabled) {
        this.$log.debug('[Vert.x EB Service] Unregister handler for ' + address);
      }
      this.eventBus.unregisterHandler(address, this.callbackMap.get(callback));
      this.callbackMap.remove(callback);
    }
    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#send
     *
     * @description
     * Sends a message to the specified address (using {@link knalli.angular-vertxbus.vertxEventBus#methods_send vertxEventBus.send()}).
     *
     * @param {string} address target address
     * @param {object} message payload message
     * @param {number=} [timeout=10000] timeout (in ms) after which the promise will be rejected
     * @param {boolean=} [expectReply=true] if false, the promise will be resolved directly and
     *                                       no replyHandler will be created
     * @returns {object} promise
     */

  }, {
    key: 'send',
    value: function send(address, message) {
      var _this3 = this;

      var timeout = arguments.length <= 2 || arguments[2] === undefined ? 10000 : arguments[2];
      var expectReply = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      var deferred = this.$q.defer();
      var next = function next() {
        if (expectReply) {
          (function () {
            // Register timeout for promise rejecting
            var timer = _this3.$interval(function () {
              if (_this3.options.debugEnabled) {
                _this3.$log.debug('[Vert.x EB Service] send(\'' + address + '\') timed out');
              }
              deferred.reject();
            }, timeout, 1);
            // Send message
            // TODO after dropping support for Vert.x < v3, this can be enriched with failureHandler
            _this3.eventBus.send(address, message, function (reply) {
              _this3.$interval.cancel(timer); // because it's resolved
              deferred.resolve(reply);
            });
          })();
        } else {
          _this3.eventBus.send(address, message);
          deferred.resolve(); // we don't care
        }
      };
      next.displayName = _config.moduleName + '.service.delegate.live.send.next';
      if (!this.ensureOpenAuthConnection(next)) {
        deferred.reject();
      }
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#publish
     *
     * @description
     * Publishes a message to the specified address (using {@link knalli.angular-vertxbus.vertxEventBus#methods_publish vertxEventBus.publish()}).
     *
     * @param {string} address target address
     * @param {object} message payload message
     * @returns {boolean} false if cannot be send or queued
     */

  }, {
    key: 'publish',
    value: function publish(address, message) {
      var _this4 = this;

      return this.ensureOpenAuthConnection(function () {
        return _this4.eventBus.publish(address, message);
      });
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#login
     *
     * @description
     * Sends a login request.
     *
     * See also
     * - {@link knalli.angular-vertxbus.vertxEventBus#methods_login vertxEventBus.login()}
     *
     * @param {string} username credential's username
     * @param {string} password credential's password
     * @param {number=} [timeout=5000] timeout
     * @returns {object} promise
     */

  }, {
    key: 'login',
    value: function login() {
      var username = arguments.length <= 0 || arguments[0] === undefined ? this.options.username : arguments[0];

      var _this5 = this;

      var password = arguments.length <= 1 || arguments[1] === undefined ? this.options.password : arguments[1];
      var timeout = arguments.length <= 2 || arguments[2] === undefined ? 5000 : arguments[2];

      var deferred = this.$q.defer();
      var next = function next(reply) {
        reply = reply || {};
        if (reply.status === 'ok') {
          _this5.states.validSession = true;
          deferred.resolve(reply);
          _this5.$rootScope.$broadcast(_this5.options.prefix + 'system.login.succeeded', { status: reply.status });
        } else {
          _this5.states.validSession = false;
          deferred.reject(reply);
          _this5.$rootScope.$broadcast(_this5.options.prefix + 'system.login.failed', { status: reply.status });
        }
      };
      next.displayName = _config.moduleName + '.service.delegate.live.login.next';

      if (this.loginInterceptor) {
        // reference to a direct sender
        var send = function send(address, message, reply) {
          _this5.eventBus.send(address, message, reply);
        };
        this.loginInterceptor(send, username, password, next);
      } else {
        // Legacy way like Vert.x 2
        this.eventBus.login(username, password, next);
      }

      this.$interval(function () {
        return deferred.reject();
      }, timeout, 1);
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#ensureOpenConnection
     *
     * @description
     * Ensures the callback will be performed with an open connection.
     *
     * Unless an open connection was found, the callback will be queued in the message buffer (if available).
     *
     * @param {function} fn callback
     * @returns {boolean} false if the callback cannot be performed or queued
     */

  }, {
    key: 'ensureOpenConnection',
    value: function ensureOpenConnection(fn) {
      if (this.isConnectionOpen()) {
        fn();
        return true;
      } else if (this.options.messageBuffer) {
        this.messageQueue.push(fn);
        return true;
      }
      return false;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#ensureOpenAuthConnection
     *
     * @description
     * Ensures the callback will be performed with a valid session.
     *
     * Unless `loginRequired` is enabled, this will be simple forward.
     *
     * Unless a valid session exist (but required), the callback will be not invoked.
     *
     * @param {function} fn callback
     * @returns {boolean} false if the callback cannot be performed or queued
     */

  }, {
    key: 'ensureOpenAuthConnection',
    value: function ensureOpenAuthConnection(fn) {
      var _this6 = this;

      if (!this.options.loginRequired) {
        // easy: no login required
        return this.ensureOpenConnection(fn);
      } else {
        var fnWrapper = function fnWrapper() {
          if (_this6.states.validSession) {
            fn();
            return true;
          } else {
            // ignore this message
            if (_this6.options.debugEnabled) {
              _this6.$log.debug('[Vert.x EB Service] Message was not sent because login is required');
            }
            return false;
          }
        };
        fnWrapper.displayName = _config.moduleName + '.service.delegate.live.ensureOpenAuthConnection.fnWrapper';
        return this.ensureOpenConnection(fnWrapper);
      }
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#getConnectionState
     *
     * @description
     * Returns the current connection state. The state is being cached internally.
     *
     * @param {boolean=} [immediate=false] if true, the connection state will be queried directly.
     * @returns {number} state type of vertx.EventBus
     */

  }, {
    key: 'getConnectionState',
    value: function getConnectionState(immediate) {
      if (this.options.enabled) {
        if (immediate) {
          this.connectionState = this.eventBus.readyState();
        }
      } else {
        this.connectionState = this.eventBus.EventBus.CLOSED;
      }
      return this.connectionState;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#isConnectionOpen
     *
     * @description
     * Returns true if the current connection state ({@link knalli.angular-vertxbus.vertxEventBusService#methods_getConnectionState getConnectionState()}) is `OPEN`.
     *
     * @returns {boolean} connection open state
     */

  }, {
    key: 'isConnectionOpen',
    value: function isConnectionOpen() {
      return this.getConnectionState() === this.eventBus.EventBus.OPEN;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#isValidSession
     *
     * @description
     * Returns true if the session is valid
     *
     * @returns {boolean} state
     */

  }, {
    key: 'isValidSession',
    value: function isValidSession() {
      return this.states.validSession;
    }

    // internal

  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this.states.connected;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#isEnabled
     *
     * @description
     * Returns true if service is being enabled.
     *
     * @returns {boolean} state
     */

  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      return this.options.enabled;
    }

    /**
     * @ngdoc method
     * @module knalli.angular-vertxbus
     * @methodOf knalli.angular-vertxbus.vertxEventBusService
     * @name .#isConnectionOpen
     *
     * @description
     * Returns the current amount of messages in the internal buffer.
     *
     * @returns {number} amount
     */

  }, {
    key: 'getMessageQueueLength',
    value: function getMessageQueueLength() {
      return this.messageQueue.size();
    }
  }]);

  return EventBusDelegate;
})(_BaseDelegate3.default);

exports.default = EventBusDelegate;

},{"../../../config":1,"./../../support/Queue":13,"./../../support/SimpleMap":14,"./BaseDelegate":9}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseDelegate2 = require('./BaseDelegate');

var _BaseDelegate3 = _interopRequireDefault(_BaseDelegate2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NoopDelegate = (function (_BaseDelegate) {
  _inherits(NoopDelegate, _BaseDelegate);

  function NoopDelegate() {
    _classCallCheck(this, NoopDelegate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(NoopDelegate).apply(this, arguments));
  }

  return NoopDelegate;
})(_BaseDelegate3.default);

exports.default = NoopDelegate;

},{"./BaseDelegate":9}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConnectionConfigHolder = (function () {
  function ConnectionConfigHolder(_ref) {
    _classCallCheck(this, ConnectionConfigHolder);

    var urlServer = _ref.urlServer;
    var urlPath = _ref.urlPath;

    this._urlServer = urlServer;
    this._urlPath = urlPath;
  }

  _createClass(ConnectionConfigHolder, [{
    key: "urlServer",
    get: function get() {
      return this._urlServer;
    }
  }, {
    key: "urlPath",
    get: function get() {
      return this._urlPath;
    }
  }]);

  return ConnectionConfigHolder;
})();

exports.default = ConnectionConfigHolder;

},{}],13:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 Simple queue implementation

 FIFO: #push() + #first()
 LIFO: #push() + #last()
 */

var Queue = (function () {
  function Queue() {
    _classCallCheck(this, Queue);

    var maxSize = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

    this.maxSize = maxSize;
    this.items = [];
  }

  _createClass(Queue, [{
    key: "push",
    value: function push(item) {
      this.items.push(item);
      return this.recalibrateBufferSize();
    }
  }, {
    key: "recalibrateBufferSize",
    value: function recalibrateBufferSize() {
      while (this.items.length > this.maxSize) {
        this.first();
      }
      return this;
    }
  }, {
    key: "last",
    value: function last() {
      return this.items.pop();
    }
  }, {
    key: "first",
    value: function first() {
      return this.items.shift(0);
    }
  }, {
    key: "size",
    value: function size() {
      return this.items.length;
    }
  }]);

  return Queue;
})();

exports.default = Queue;

},{}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 Simple Map implementation

 This implementation allows usage of non serializable keys for values.
 */

var SimpleMap = (function () {
  function SimpleMap() {
    _classCallCheck(this, SimpleMap);

    this.clear();
  }

  // Stores the value under the key.
  // Chainable

  _createClass(SimpleMap, [{
    key: "put",
    value: function put(key, value) {
      var idx = this._indexForKey(key);
      if (idx > -1) {
        this.values[idx] = value;
      } else {
        this.keys.push(key);
        this.values.push(value);
      }
      return this;
    }

    // Returns value for key, otherwise undefined.

  }, {
    key: "get",
    value: function get(key) {
      var idx = this._indexForKey(key);
      if (idx > -1) {
        return this.values[idx];
      }
    }

    // Returns true if the key exists.

  }, {
    key: "containsKey",
    value: function containsKey(key) {
      var idx = this._indexForKey(key);
      return idx > -1;
    }

    // Returns true if the value exists.

  }, {
    key: "containsValue",
    value: function containsValue(value) {
      var idx = this._indexForValue(value);
      return idx > -1;
    }

    // Removes the key and its value.

  }, {
    key: "remove",
    value: function remove(key) {
      var idx = this._indexForKey(key);
      if (idx > -1) {
        this.keys[idx] = undefined;
        this.values[idx] = undefined;
      }
    }

    // Clears all keys and values.

  }, {
    key: "clear",
    value: function clear() {
      this.keys = [];
      this.values = [];
      return this;
    }

    // Returns index of key, otherwise -1.

  }, {
    key: "_indexForKey",
    value: function _indexForKey(key) {
      for (var i in this.keys) {
        if (key === this.keys[i]) {
          return i;
        }
      }
      return -1;
    }
  }, {
    key: "_indexForValue",
    value: function _indexForValue(value) {
      for (var i in this.values) {
        if (value === this.values[i]) {
          return i;
        }
      }
      return -1;
    }
  }]);

  return SimpleMap;
})();

exports.default = SimpleMap;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _VertxEventBusWrapperProvider = require('./lib/VertxEventBusWrapperProvider');

var _VertxEventBusWrapperProvider2 = _interopRequireDefault(_VertxEventBusWrapperProvider);

var _VertxEventBusServiceProvider = require('./lib/VertxEventBusServiceProvider');

var _VertxEventBusServiceProvider2 = _interopRequireDefault(_VertxEventBusServiceProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @ngdoc overview
 * @module knalli.angular-vertxbus
 * @name knalli.angular-vertxbus
 * @description
 *
 * Client side library using VertX Event Bus as an Angular Service module
 *
 * You have to define the module dependency, this module is named `knalli.angular-vertxbus`.
 *
 * <pre>
 *   angular.module('app', ['knalli.angular-vertxbus'])
 *     .controller('MyCtrl', function(vertxEventBus, vertxEventBusService) {
 *
 *       // using the EventBus directly
 *       vertxEventBus.send('my.address', {data: 123}, function (reply) {
 *         // your reply comes here
 *       });
 *
 *       // using the service
 *       vertxEventBusService.send('my.address', {data: 123}, {timeout: 500})
 *         .then(function (reply) {
 *           // your reply comes here
 *         })
 *         .catch(function (err) {
 *           // something went wrong, no connection, no login, timed out, or so
 *         });
 *     });
 * </pre>
 *
 * The module itself provides following components:
 * - {@link knalli.angular-vertxbus.vertxEventBus vertxEventBus}: a low level wrapper around `vertx.EventBus`
 * - {@link knalli.angular-vertxbus.vertxEventBusService vertxEventBusService}: a high level service around the wrapper
 *
 * While the wrapper only provides one single instance (even on reconnects), the service supports automatically
 * reconnect management, authorization and a clean promise based api.
 *
 * If you are looking for a low integration of `vertxbus.EventBus` as an AngularJS component, the wrapper will be your
 * choice. The only difference (and requirement for the wrapper actually) is how it will manage and replace the
 * underlying instance of the current `vertx.EventBus`.
 *
 * However, if you are looking for a simple, clean and promised based high api, the service is much better you.
 */
exports.default = angular.module(_config.moduleName, ['ng']).provider('vertxEventBus', _VertxEventBusWrapperProvider2.default).provider('vertxEventBusService', _VertxEventBusServiceProvider2.default).name;

},{"./config":1,"./lib/VertxEventBusServiceProvider":3,"./lib/VertxEventBusWrapperProvider":4}]},{},[2]);
