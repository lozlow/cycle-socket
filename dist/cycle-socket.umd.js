!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("rx"),require("socket.io-client")):"function"==typeof define&&define.amd?define(["exports","rx","socket.io-client"],n):n(e.cycleSocket=e.cycleSocket||{},e.rx,e.io)}(this,function(e,n,t){"use strict";function o(e,o){var r=t(e,o),i={};return function(e){function t(e){if("undefined"==typeof i[e]){var t=n.Observable.create(function(n){var t=n.onNext.bind(n);return console.log("listening to socket on",e),r.on(e,function(){n.onNext.apply(n,arguments)}),function(){console.log("disposed on",e),r.off(e,t),delete i[e]}});i[e]={sub:t,share:t.share()}}return i[e]}return e.doOnNext(function(e){var n=e.eventType,t=e.data;return r.emit(n,t)}).subscribe(),{on:function(e){return t(e).share},replaySub:function(e,o){var r=t(e).share.replay(null,o),i=r.connect();return n.Observable.create(function(e){return r.subscribe(e),function(){i.dispose()}})}}}}t="default"in t?t["default"]:t,e.makeSocketDriver=o});