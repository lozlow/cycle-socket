import { Observable } from 'rx';
import io from 'socket.io-client';

function makeSocketDriver(uri, opts) {
	var conn = io(uri, opts);
	var observables = {};

	return function socketDriver(outgoing$) {
		outgoing$.doOnNext(function (_ref) {
			var eventType = _ref.eventType;
			var data = _ref.data;
			return conn.emit(eventType, data);
		}).subscribe();

		function createOrPutObservable(eventType) {
			if (typeof observables[eventType] === 'undefined') {
				var observable = Observable.create(function (observer) {
					var cb = observer.onNext.bind(observer);
					console.log('listening to socket on', eventType);
					conn.on(eventType, function respond() {
						observer.onNext.apply(observer, arguments);
					});

					return function disposeSub() {
						console.log('disposed on', eventType);
						conn.off(eventType, cb);
						delete observables[eventType];
					};
				});
				observables[eventType] = {
					sub: observable,
					share: observable.share()
				};
			}
			return observables[eventType];
		}

		return {
			on: function on(eventType) {
				return createOrPutObservable(eventType).share;
			},
			replaySub: function replaySub(eventType, count) {
				var stream = createOrPutObservable(eventType).share.replay(null, count);
				var connection = stream.connect();
				return Observable.create(function (observer) {
					stream.subscribe(observer);
					return function dispose() {
						connection.dispose();
					};
				});
			}
		};
	};
}

export { makeSocketDriver };