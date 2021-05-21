

export default class TimeSource {
    constructor() {
        this._accumulated = 0;
        this._startTime = this._now();
        this._paused = false;

        // this.startStop();
    }

    startStop() {
        if (this._paused) {
            this._startTime = this._now();
            this._paused = false;
        }
        else {
            this._accumulated += (this._now() - this._startTime);
            this._paused = true;
        }

        return !this._paused;
    }

    isPaused() { return this._paused; }

    time() {
        if (this._paused) {
            return this._accumulated;
        }
        else {
            return this._accumulated + (this._now() - this._startTime);
        }
    }

    _now() {
        return (new Date()).valueOf();
    }
}
