const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #line = '';

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let string = chunk.toString();
    let lines;

    if (string.endsWith(os.EOL)) {
      lines = string.split(os.EOL);
      lines[0] = this.#line + lines[0];
      this.#line = '';
    } else if (string.includes(os.EOL)) {
      lines = string.split(os.EOL);
      lines[0] = this.#line + lines[0];
      this.#line = lines.pop();
    } else {
      this.#line += string;
    }

    if (lines) {
      lines.forEach((line) => {
        this.push(line);
      });
    }

    callback();
  }

  _flush(callback) {
    if (this.#line) {
      this.push(this.#line);
    }
    callback();
  }
}

module.exports = LineSplitStream;
