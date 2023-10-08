class EventEmitter {
  listeners = {};  // key-value pair

  _newEvent(eventName, fn) {
    if (!this.listeners[`${eventName}`]) {
      this.listeners[`${eventName}`] = [];
    }
    this.listeners[`${eventName}`].push({function: fn, once: false })
  }

  _deleteEvent(eventName, fn) {
    const arrEvents = this.listeners[`${eventName}`];
    for (let i = 0; i < arrEvents.length; i++) {
      if (arrEvents[i].function === fn) {
        arrEvents.splice(i, 1);
      }
    }
  }

  addListener(eventName, fn) {
    this._newEvent(eventName, fn)
  }

  on(eventName, fn) {
    this._newEvent(eventName, fn)
  }

  removeListener(eventName, fn) {
    this._deleteEvent(eventName, fn);
  }

  off(eventName, fn) { 
    this._deleteEvent(eventName, fn);
  }

  once(eventName, fn) {
    if (!this.listeners[`${eventName}`]) {
      this.listeners[`${eventName}`] = [];
    }
    this.listeners[`${eventName}`].push({function: fn, once: true})
  }

  emit(eventName, ...rest) { 
    if (this.listeners[`${eventName}`]) {
      this.listeners[`${eventName}`].forEach(event => {
        if (event.once) {
          event.function(...rest)
          const index = this.listeners[`${eventName}`].indexOf(event);
          this.listeners[`${eventName}`].splice(index, 1);
        } else {
          event.function(...rest);
        }
      });
    }
    
    
  }

  listenerCount(eventName) {
    return this.listeners[`${eventName}`].length;
  }

  rawListeners(eventName) { 
    return this.listeners[`${eventName}`].map(function (item, index, array) {
      return item.function;
    });;
  }
}

const myEmitter = new EventEmitter();

function c1() {
  console.log('c1');
}

function c2() {
  console.log('c2');
}

myEmitter.on('eventOne', c1); // Register for eventOne
myEmitter.on('eventOne', c2); // Register for eventOne

// Register eventOnce for one time execution
myEmitter.once('eventOnce', () => console.log('once 1'));
myEmitter.once('init', () => console.log('once 2'));

// Register for 'status' event with parameters
myEmitter.on('status', (code, msg) => console.log(`Got ${code} and ${msg}`));


myEmitter.emit('eventOne');

// Emit 'eventOnce' -> After this the eventOnce will be
// removed/unregistered automatically
myEmitter.emit('eventOnce');


myEmitter.emit('eventOne');
myEmitter.emit('init');
myEmitter.emit('init'); // Will not be fired
myEmitter.emit('eventOne');
myEmitter.emit('status', 200, 'ok');

// Get listener's count
console.log(myEmitter.listenerCount('eventOne'));

// Get array of rawListeners//
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners('eventOne'));

// Get listener's count after remove one or all listeners of 'eventOne'
myEmitter.off('eventOne', c1);
console.log(myEmitter.listenerCount('eventOne'));
myEmitter.off('eventOne', c2);
console.log(myEmitter.listenerCount('eventOne'));

async function asyncFunc(...args) {
  const result = await fetch(...args);
  return result;
}

class WithTime extends EventEmitter {
  execute(asyncFunc, ...args) {
    const startDate = Date.now();
    const result = asyncFunc(...args);
    result.then(response => { console.log(response) }).then(() => console.log(`Time: ${Date.now() - startDate}`)).then(() => withTime.emit('end'));
   }
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

console.log(withTime.rawListeners("end"));

withTime.emit('begin');
withTime.execute(asyncFunc, 'http://example.com/movies.json');