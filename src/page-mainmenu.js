Lander.pages['page-mainmenu'] = (function(screens) {

	function initialize() {
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { screens.showScreen('page-game'); }
		);

		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { screens.showScreen('page-highscores'); }
		);

		document.getElementById('id-controls').addEventListener(
			'click',
			function() { screens.showScreen('page-controls'); }
		);

		document.getElementById('id-credits').addEventListener(
			'click',
			function() { screens.showScreen('page-credits'); }
		);
	}

	function run() {
	}

	return {
		initialize : initialize,
		run : run
	};
}(Lander.screens));
