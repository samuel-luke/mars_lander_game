Lander.input = (function() {
    'use strict';
    
    function initialize() {
        if (localStorage.getItem('rotateClockwise') === null) {
            localStorage.setItem('rotateClockwise', 'ArrowRight');
        }
        if (localStorage.getItem('rotateCounterClockwise') === null) {
            localStorage.setItem('rotateCounterClockwise', 'ArrowLeft');
        }
        if (localStorage.getItem('thrust') === null) {
            localStorage.setItem('thrust', 'ArrowUp');
        }
        
        Lander.input.rotateClockwise = localStorage.getItem('rotateClockwise');
        Lander.input.rotateCounterClockwise = localStorage.getItem('rotateCounterClockwise');
        Lander.input.thrust = localStorage.getItem('thrust');
    }

    function Keyboard() {
        let that = {
            keys : {},
            handlers : [],
            elapsedTime : 0,
        };

        function keyPress(e) {
            that.keys[e.key] = e.timeStamp;
        }
        function keyRelease(e) {
            delete that.keys[e.key];
        }

        that.registerCommand = function(key, handler) {
			that.handlers.push({ key : key, handler : handler});
		};

        that.update = function(elapsedTime) {
            that.elapsedTime = elapsedTime;
			for (let key = 0; key < that.handlers.length; key++) {
				if (typeof that.keys[that.handlers[key].key] !== 'undefined') {
					that.handlers[key].handler(elapsedTime);
				}
			}
		};

        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);

        return that;
    }

    return {
        Keyboard : Keyboard,
        initialize : initialize,
	};
}());