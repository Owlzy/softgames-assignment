/**
 * @class
 * @classdesc - Logs with prefix
 */
export default class Logger {

    constructor(prefix, trace = false) {
        this._prefix = prefix;
        this._trace = trace;
    }

    log(...args) {
        if (Logger.LOG) {
            console.log("[LOG]" + this._prefix + " : ", args);
            if (this._trace && Error && Error.captureStackTrace) {
                // strip relevant part of stack trace and log it
                const obj = {};
                Error.captureStackTrace(obj);
                let arr = obj.stack.split(/\r?\n/);
                arr = arr.splice(2, arr.length - 1);
                console.log(arr.join("\n"));
            }
        }
    }

}

Logger.LOG = true;