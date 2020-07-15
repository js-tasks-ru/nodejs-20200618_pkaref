const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #totalSize = 0;
  #sizeLimit = 0;

  constructor(options) {
    super(options);

    this.#sizeLimit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.#totalSize += chunk.toString().length;

    if (this.#totalSize > this.#sizeLimit) {
      callback(new LimitExceededError());
      return;
    }

    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
