import TimeSource from 'timeSource';

export default class Animation {
    static get HEIGHT() { return 2; }

    constructor(fromPole, toPole, ring, speedOpt) {
        this._fromPole = fromPole;
        this._toPole = toPole;
        this._ring = ring;

        // distance per second
        this._speed = speedOpt || 1.5;
        this._timeSource = new TimeSource();

        this._startMilis = this._currentTimeMilis();
        this._durationMilis = 3*1000/this._speed;

        this._fromHeight = fromPole.top();
        this._toHeight = toPole.top();

        let upDistance = Animation.HEIGHT-this._fromHeight;
        let horizontalDistance = this._distance(fromPole, toPole);
        let downDistance = Animation.HEIGHT-this._toHeight;
        let totalDistance = upDistance+horizontalDistance+downDistance;

        this._horizontalMoveStartTime = this._durationMilis*upDistance/totalDistance;
        this._downMoveStartTime = this._durationMilis*(upDistance+horizontalDistance)/totalDistance;

        this._promiseResolved = false;
        this.completed = new Promise((resolve) => {
            this._resolve = resolve;
        });
    }

    startStop() {
      return this._timeSource.startStop();
    }

    update() {
        if (this._timeSource.isPaused()) return true;

        let elapsedTime = this._currentTimeMilis() - this._startMilis;

        if (elapsedTime > this._durationMilis) {
            // animation ended
            let {x,z} = this._toPole.position();
            this._ring.position(x, this._toHeight, z);

            if (!this._promiseResolved) {
                let animation = this;
                this._resolve({
                    end() { animation._promiseResolved = true; }
                });
            }
            else {
                return false;
            }
        }
        else if (elapsedTime > this._downMoveStartTime) {
            // move down
            let h = this._interpolate(elapsedTime-this._downMoveStartTime,
              this._durationMilis-this._downMoveStartTime);

            let delta = (Animation.HEIGHT-this._toHeight)*h;
            let y = Animation.HEIGHT - delta;

            let {x,z} = this._toPole.position();
            this._ring.position(x, y, z);
        }
        else if (elapsedTime > this._horizontalMoveStartTime) {
            // move horizontally
            let {x:fx, z:fz} = this._fromPole.position();
            let {x:tx, z:tz} = this._toPole.position();

            let d = this._interpolate(elapsedTime-this._horizontalMoveStartTime,
            this._downMoveStartTime-this._horizontalMoveStartTime);
            let nx = (tx - fx)*d + fx;
            let nz = (tz - fz)*d + fz;

            this._ring.position(nx, Animation.HEIGHT, nz);
        }
        else {
            // move up
            let h = this._interpolate(elapsedTime,
                this._horizontalMoveStartTime);

            let delta = (Animation.HEIGHT-this._fromHeight)*h;
            let y = this._fromHeight + delta;

            let {x,z} = this._fromPole.position();
            this._ring.position(x, y, z);
        }

        return true;
    }

    _interpolate(time, totalTime) {
        time = Math.min(time, totalTime);
        let p = -Math.PI/2 + Math.PI * time/totalTime;
        return 0.5*(Math.sin(p)+1);
    }

    _distance(poleA, poleB) {
        var { x:xa, z:za } = poleA.position();
        var { x:xb, z:zb } = poleB.position();

        return Math.sqrt((xb-xa)*(xb-xa) + (zb-za)*(zb-za));
    }

    _currentTimeMilis() {
        return this._timeSource.time();
    }
}
