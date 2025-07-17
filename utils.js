export class Logger {
  isVerbose = false;

  log (message) {
    if (this.isVerbose) {
      console.log(message);
    }
  }

  raiseException (message) {
    console.error(message);
    process.exit(1);
  }
}