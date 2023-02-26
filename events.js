const EventEmitter = require('events');

const myEmitter = new events.EventEmitter();

const log = (payload) => {
	console.log('Log:', payload);
};

myEmitter.addListener('my_event', log);
// myEmitter.on('my_event', log);

myEmitter.emit('my_event', 'payload');

myEmitter.removeListener('my_event', log);
// myEmitter.off('my_event', log);
// myEmitter.removeAllListeners('my_event);

myEmitter.once('off', () => {
	console.log('1 раз, не больше');
});
myEmitter.emit('off');
myEmitter.emit('off');


