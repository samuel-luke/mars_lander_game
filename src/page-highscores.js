Lander.pages['page-highscores'] = (function(screens) {

	function initialize() {
		Lander.pages['page-game'].initialize();

		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() {
				screens.showScreen('page-mainmenu'); 
			});
	}

	function displayScores() {
		document.getElementById('highscore1').innerHTML = localStorage.getItem('score1');
		document.getElementById('highscore2').innerHTML = localStorage.getItem('score2');
		document.getElementById('highscore3').innerHTML = localStorage.getItem('score3');
		document.getElementById('highscore4').innerHTML = localStorage.getItem('score4');
		document.getElementById('highscore5').innerHTML = localStorage.getItem('score5');
	}

	function run() {
		displayScores();
	}

	return {
		initialize : initialize,
		run : run
	};
}(Lander.screens));
