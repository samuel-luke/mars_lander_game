Lander.pages['page-controls'] = (function(screens, input) {

	function initialize() {
		input.initialize();

		document.getElementById('id-controls-rotateCW').addEventListener(
			'click',
			function() {
				$(document).keydown(function(event){
					localStorage.setItem('rotateClockwise', (String.fromCharCode(event.which)));
					Lander.input.rotateClockwise = (String.fromCharCode(event.which)); 
					document.getElementById('id-controls-rotateCW').innerHTML = ("Rotate Clockwise: " + Lander.input.rotateClockwise);
					$(document).unbind("keydown");
				});
			}
		);

		document.getElementById('id-controls-rotateCCW').addEventListener(
			'click',
			function() {
				$(document).keydown(function(event){
					localStorage.setItem('rotateCounterClockwise', (String.fromCharCode(event.which)));
					Lander.input.rotateCounterClockwise = (String.fromCharCode(event.which)); 
					document.getElementById('id-controls-rotateCCW').innerHTML = ("Rotate Counter Clockwise: " + Lander.input.rotateCounterClockwise);
					$(document).unbind("keydown");
				});
			}
		);
		
		document.getElementById('id-controls-thrust').addEventListener(
			'click',
			function() {
				$(document).keydown(function(event){
					localStorage.setItem('thrust', (String.fromCharCode(event.which)));
					Lander.input.thrust = (String.fromCharCode(event.which)); 
					document.getElementById('id-controls-thrust').innerHTML = ("Thrust: " + Lander.input.thrust);
					$(document).unbind("keydown");
				});
			}
		);

		document.getElementById('id-controls-back').addEventListener(
			'click',
			function() { screens.showScreen('page-mainmenu'); }
		);
	}

	function run() {
		initialize();

		document.getElementById('id-controls-rotateCW').innerHTML = ("Rotate Clockwise: " + Lander.input.rotateClockwise);
		document.getElementById('id-controls-rotateCCW').innerHTML = ("Rotate Counter Clockwise: " + Lander.input.rotateCounterClockwise);
		document.getElementById('id-controls-thrust').innerHTML = ("Thrust: " + Lander.input.thrust);
	}

	return {
		initialize : initialize,
		run : run
	};
}(Lander.screens, Lander.input));
