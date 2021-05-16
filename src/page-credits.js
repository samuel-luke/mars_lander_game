Lander.pages['page-credits'] = (function(screens) {

	function initialize() {
		document.getElementById('id-credits-back').addEventListener(
			'click',
			function() { screens.showScreen('page-mainmenu'); });
	}

	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}

	return {
		initialize : initialize,
		run : run
	};
}(Lander.screens));
