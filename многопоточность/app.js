const { fork } = require('child_process');
const { Worker } = require('worker_threads');
const { PerformanceObserver } = require('perf_hooks');

const performanceObserver = new PerformanceObserver((items) => {
	items.getEntries().forEach((entry) => {
  	console.log(entry.name, entry.duration);
	})
});
performanceObserver.observe({ entryTypes: ['measure'] });

const workerHandler = (array) => {
	return new Promise((resolve, reject) => {
		performance.mark('workerStart');

		const worker = new Worker('./worker.js', { workerData: { array } });

		worker.on('message', (msg) => {
			performance.mark('workerEnd');
			performance.measure('worker', 'workerStart', 'workerEnd');
			resolve(msg);
		});

		worker.on('error', (err) => {
			reject(err);
		});

		worker.on('exit', () => {
			resolve();
		});
	});
};

const forkHandler = (array) => {
	return new Promise((resolve, reject) => {
		performance.mark('forkStart');
		
		const forkProcess = fork('./fork.js');

		forkProcess.send(array);
		
		forkProcess.on('message', (msg) => {
			performance.mark('forkEnd');
			performance.measure('fork', 'forkStart', 'forkEnd');
			resolve(msg);
		});

		forkProcess.on('close', (code) => {
      console.log("🚀 ~ file: app.js forkProcess.on ~ code", code);
			resolve(code);
		});
	});
};

const main = async () => {
	try {
		await workerHandler([2,4,12,45,21]);
		await forkHandler([2,4,12,45,21]);
	} catch (error) {
		console.log(error);
	}
};

main();
