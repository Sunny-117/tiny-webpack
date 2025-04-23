class Semaphore {
  constructor(available) {
    this.available = available;
    this.waiters = [];
    this._continue = this._continue.bind(this);
  }

  take(callback) {
    if (this.available > 0) {
      this.available--;
      callback();
    } else {
      this.waiters.push(callback);
    }
  }

  leave() {
    this.available++;
    if (this.waiters.length > 0) {
      process.nextTick(this._continue);
    }
  }

  _continue() {
    if (this.available > 0) {
      if (this.waiters.length > 0) {
        this.available--;
        const callback = this.waiters.pop();
        callback();
      }
    }
  }
}
