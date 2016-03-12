(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rx'), require('socket.io-client')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rx', 'socket.io-client'], factory) :
	(factory((global.cycleSocket = global.cycleSocket || {}),global.rx,global.io));
}(this, function (exports,rx,io) { 'use strict';

	io = 'default' in io ? io['default'] : io;

	function makeSocketDriver(uri, opts) {
		const conn = io(uri, opts);
		const observables = {};

		return function socketDriver(outgoing$) {
			outgoing$.doOnNext(({ eventType, data }) => conn.emit(eventType, data)).subscribe();

			function createOrPutObservable(eventType) {
				if (typeof observables[eventType] === 'undefined') {
					const observable = rx.Observable.create(
						observer => {
							const cb = observer.onNext.bind(observer);
							console.log('listening to socket on', eventType);
							conn.on(eventType, function respond() {
								observer.onNext.apply(observer, arguments);
							});

							return function disposeSub() {
								console.log('disposed on', eventType);
								conn.off(eventType, cb);
								delete observables[eventType];
							};
						}
					);
					observables[eventType] = {
						sub: observable,
						share: observable.share()
					};
				}
				return observables[eventType];
			}

			return {
				on: eventType => createOrPutObservable(eventType).share,
				replaySub: (eventType, count) => {
					const stream = createOrPutObservable(eventType).share.replay(null, count);
					const connection = stream.connect();
					return rx.Observable.create(
						observer => {
							stream.subscribe(observer);
							return function dispose() {
								connection.dispose();
							};
						}
					);
				}
			};
		};
	}

	exports.makeSocketDriver = makeSocketDriver;

}));