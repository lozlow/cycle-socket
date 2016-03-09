import { Observable } from 'rx';
import io from 'socket.io-client';

export function makeSocketDriver(uri, opts) {
	const conn = io(uri);
	const observables = {};

	return function socketDriver(outgoing$) {
		outgoing$.subscribe(e => console.log('got outgoing val', e));

		return {
			on: eventType => {
				if (typeof observables[eventType] === 'undefined') {
					observables[eventType] = Observable.create(
						function(observer) {
							const cb = observer.onNext.bind(observer);
							console.log('listening to socket');
							conn.on(eventType, function() {
								observer.onNext.apply(observer, arguments);
							});

							return function disposeSub() {
								console.log('disposed');
								conn.off(eventType, cb);
								delete observables[eventType];
							};
						}
					).share();
				}
				return observables[eventType];
			}
		};
	};
}
