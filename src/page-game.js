Lander.pages['page-game'] = (function(gameModel, screens, graphics, input) {
	let keyboard = input.Keyboard();

	let imageFire = new Image();
    imageFire.src = '../assets/fire.png';
    let imageSmoke = new Image();
    imageSmoke.src = '../assets/smoke-2.png';
    let imageSnow = new Image();
	imageSnow.src = '../assets/snowflake.png';
	
	// All one-time game page initialization is performed here.
	function initialize() {
		Lander.canvas = document.getElementById('main-canvas');
		Lander.context = Lander.canvas.getContext('2d');
		Lander.background = document.getElementById('background-canvas');
		Lander.bgcontext = Lander.background.getContext('2d');
		Lander.previousTime = performance.now();
		Lander.momentum = {x : 0, y : 0};
		Lander.fuel = 20000;
		Lander.level = 1;
		Lander.death = false;
		Lander.victory = false;
		Lander.animationTime = 1000;
		Lander.points = [];
		Lander.thrusting = 0;
		Lander.inputBuffer = {};
		Lander.landing_zone_1 = {};
		Lander.landing_zone_2 = {};
		Lander.intersectionCircle = {radius : 0, center : { x : 0, y: 0}};

		if (localStorage.getItem('score1') === null) {
            localStorage.setItem('score1', 10000);
		}
		
		if (localStorage.getItem('score2') === null) {
            localStorage.setItem('score2', 5000);
		}
		
		if (localStorage.getItem('score3') === null) {
            localStorage.setItem('score3', 3000);
		}
		
		if (localStorage.getItem('score4') === null) {
            localStorage.setItem('score4', 2000);
		}
		
		if (localStorage.getItem('score5') === null) {
            localStorage.setItem('score5', 1000);
        }

		keyboard.registerCommand('ArrowRight', rotateClockwise);
		keyboard.registerCommand('ArrowLeft', rotateCounterClockwise);
		keyboard.registerCommand('ArrowUp', thrust);

		Lander.canvas_size = 1000;
		Lander.level1_distance = 100;
		Lander.level2_distance = 75;
		Lander.safe_landing_angle = 5;
		Lander.safe_landing_speed = 2.0;
		Lander.gravity = -.0001;
		Lander.thrustRate = .00015;
		Lander.rotationRate = .05;
	

		Lander.myCharacter = function(imageSource, x, y, width, height, angle) {
			let image = new Image();
			image.isReady = false;
			image.onload = function() {
				this.isReady = true;
			};
			image.src = imageSource;
			return {
				image: image,
				x : x, 
				y : y,
				width : width,
				height : height,
				angle : angle,
			};
		}('../assets/lander.png', getRandomInt(200, 800), 100, 50, 50, 90);
		
	}

	function rotateClockwise(elapsedTime) {
		Lander.myCharacter.angle += (Lander.rotationRate * elapsedTime)
		if (Lander.myCharacter.angle > 360) Lander.myCharacter.angle = 360 - Lander.myCharacter.angle;
    }
	
    function rotateCounterClockwise(elapsedTime) {
		Lander.myCharacter.angle -= (Lander.rotationRate * elapsedTime)
		if (Lander.myCharacter.angle < 0) Lander.myCharacter.angle = 360 + Lander.myCharacter.angle;
	}
	
	let particleSystemThrust = ParticleSystemLinear(graphics, {
        image: imageSmoke,
        center: {x: 300, y: 300},
        size: {mean: 3, stdev: 1},
        speed: { mean: 0, stdev: 0.1},
        lifetime: { mean: 500, stdev: 100}
    });

    function thrust(elapsedTime) {
		Lander.thrusting += elapsedTime;

		let thrustX = Math.sin(Lander.myCharacter.angle*Math.PI/180);
		let thrustY = Math.cos(Lander.myCharacter.angle*Math.PI/180);
		Lander.fuel -= elapsedTime;

        Lander.momentum.x += (thrustX * Lander.thrustRate * elapsedTime);
		Lander.momentum.y += (thrustY * -Lander.thrustRate * elapsedTime);
    }

	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
	}

	// Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
	function lineCircleIntersection(pt1, pt2, circle) {
		let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
		let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
		let b = -2 * (v1.x * v2.x + v1.y * v2.y);
		let c =  2 * (v1.x * v1.x + v1.y * v1.y);
		let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
		if (isNaN(d)) { // no intercept
			return false;
		}
		// These represent the unit distance of point one and two on the line
		let u1 = (b - d) / c;  
		let u2 = (b + d) / c;
		if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
			return true;
		}
		if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
			return true;
		}
		return false;
	}


	function update(elapsedTime) {


		Lander.intersectionCircle.center.x = Lander.myCharacter.x;
		Lander.intersectionCircle.center.y = Lander.myCharacter.y;
		if (
			(lineCircleIntersection({x : Lander.landing_zone_1.x1, y : Lander.landing_zone_1.y1}, {x : Lander.landing_zone_1.x2, y : Lander.landing_zone_1.y2}, Lander.intersectionCircle)) ||
			(lineCircleIntersection({x : Lander.landing_zone_2.x1, y : Lander.landing_zone_2.y1}, {x : Lander.landing_zone_2.x2, y : Lander.landing_zone_2.y2}, Lander.intersectionCircle))
		) {
			if (
				(Lander.myCharacter.angle > 355 || Lander.myCharacter.angle < 5) &&
				(Lander.fuel > 0) &&
				(Lander.momentum.y < .1)
			) {
				victory();
				return;
			} else {
				death();
				return;
			}
		} else {
			Lander.momentum.y -= (Lander.gravity * elapsedTime);
	
			Lander.myCharacter.x += (Lander.momentum.x * elapsedTime);
			Lander.myCharacter.y += (Lander.momentum.y * elapsedTime);
		}

		for (let i = 0; i < Lander.points.length - 1; i++) {
			if (
				(lineCircleIntersection({x : Lander.points[i].x, y : 1000 - Lander.points[i].y}, {x :Lander.points[i + 1].x, y : 1000 - Lander.points[i + 1].y}, Lander.intersectionCircle))
			) {
				death();
				return;
			}
		}

		particleSystemThrust.center.x = Lander.myCharacter.x + (Lander.momentum.x * 5 * elapsedTime);
		particleSystemThrust.center.y = Lander.myCharacter.y + (Lander.momentum.y * 5 * elapsedTime);

		particleSystemThrust.update(elapsedTime);
	}

	function victory() {
		let score = Lander.fuel;

		if (score > localStorage.getItem('score1')) localStorage.setItem('score1', score);
		else if (score > localStorage.getItem('score2')) localStorage.setItem('score2', score);
		else if (score > localStorage.getItem('score3')) localStorage.setItem('score3', score);
		else if (score > localStorage.getItem('score4')) localStorage.setItem('score4', score);
		else if (score > localStorage.getItem('score5')) localStorage.setItem('score5', score);

		Lander.victory = true;
		Lander.level += 1;
	}

	function death() {
		Lander.death = true;
	}


	function render(elapsedTime) {
		Lander.context.clearRect(0,0,Lander.canvas.width,Lander.canvas.height);

		Lander.context.font = "30px Impact";
		Lander.context.textAlign = "center";

		if (Lander.fuel > 0) {
			Lander.context.fillStyle = "green";
		} else { Lander.context.fillStyle = "white"; }
		Lander.context.fillText("Fuel: " + Lander.fuel.toFixed(0) + " ms", Lander.canvas.width - 200, 100);

		if (Lander.momentum.y < .1) {
			Lander.context.fillStyle = "green";
		} else { Lander.context.fillStyle = "white"; }
		Lander.context.fillText("Speed: " + (Lander.momentum.y * 20).toFixed(2) + " m/s", Lander.canvas.width - 200, 200);

		if ((Lander.myCharacter.angle > 355 || Lander.myCharacter.angle < 5)) {
			Lander.context.fillStyle = "green";
		} else { Lander.context.fillStyle = "white"; }
		Lander.context.fillText("Angle: " + Lander.myCharacter.angle.toFixed(0) + " degrees", Lander.canvas.width - 200, 300);

		if (Lander.thrusting > 0) {
			particleSystemThrust.render();
			Lander.thrusting -= 2 * elapsedTime;
		}
		renderCharacter(Lander.myCharacter);
	}
	
	function renderCharacter(character) {
		if (character.image.isReady) {
			Lander.context.save();
			Lander.context.translate(character.x, character.y);
			Lander.context.rotate(character.angle*Math.PI/180);
			Lander.context.translate(-character.x, -character.y);
			Lander.context.drawImage(
				character.image,
				character.x - character.width / 2,
				character.y - character.width / 2,
				character.height,
				character.width,
			);
			Lander.context.restore();
		}
	}

	let particleSystem = ParticleSystem(graphics, {
        image: imageFire,
        center: {x: 300, y: 300},
        size: {mean: 10, stdev: 3},
        speed: { mean: 0, stdev: 0.2},
        lifetime: { mean: 1000, stdev: 250}
    });

    let particleSystem2 = ParticleSystem(graphics, {
        image: imageSmoke,
        center: {x: 300, y: 300},
        size: {mean: 5, stdev: 3},
        speed: { mean: 0, stdev: 0.1},
        lifetime: { mean: 2000, stdev: 500}
	});

	function gameLoop(time) {
		let elapsedTime = time - Lander.previousTime;
		Lander.previousTime = time;

		if (Lander.victory) {
			Lander.context.clearRect(0,0,Lander.canvas.width,Lander.canvas.height);
			Lander.context.font = "70px Impact";
			Lander.context.textAlign = "center";
			Lander.context.fillStyle = "green";
			Lander.context.fillStyle = "black";
			Lander.context.strokeText("Victory!", Lander.canvas.width/2, Lander.canvas.height/2);
			Lander.context.fillText("Victory!", Lander.canvas.width/2, Lander.canvas.height/2);

			if (Lander.animationTime <= 0) {
				console.log("Victory!");
				return;
			};
		}	
		else if (Lander.death) {
			Lander.context.clearRect(0,0,Lander.canvas.width,Lander.canvas.height);
			Lander.context.font = "70px Impact";
			Lander.context.textAlign = "center";
			Lander.context.fillStyle = "black";
			Lander.context.fillText("You Died!", Lander.canvas.width/2, Lander.canvas.height/2);

			if (Lander.animationTime <= 0) {
				console.log("You Died!");
				return;
			};
			particleSystem.center.x = Lander.myCharacter.x;
			particleSystem.center.y = Lander.myCharacter.y;

			particleSystem2.center.x = Lander.myCharacter.x;
			particleSystem2.center.y = Lander.myCharacter.y;
			
			particleSystem.update(elapsedTime);
			particleSystem2.update(elapsedTime);

			particleSystem.render();
			particleSystem2.render();
			Lander.animationTime -= elapsedTime;
		} 
		else {
			processInput(elapsedTime);
			update(elapsedTime);
			render(elapsedTime);
		}
		
		requestAnimationFrame(gameLoop);
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function generateTerrain(color) {
		let startX1 = getRandomInt(100, 400);
		let endX1 = startX1 + Lander.level1_distance;
		let Y1 = getRandomInt(50, 500);
		
		let startX2 = getRandomInt(500, 800);
		let endX2 = startX2 + Lander.level1_distance;
		let Y2 = getRandomInt(50, 500);
		

		Lander.landing_zone_1 = {x1 : startX1, y1 : 1000 - Y1, x2 : endX1, y2 : 1000 - Y1};
		Lander.landing_zone_2 = {x1 : startX2, y1 : 1000 - Y2, x2 : endX2, y2 : 1000 - Y2};
		Lander.intersectionCircle = {radius : Lander.myCharacter.width / 2, center: {x : Lander.myCharacter.x, y : Lander.myCharacter.y}}

		Lander.points.push({x : 0, y : getRandomInt(50, 500), safe : false});
		Lander.points.push({x : startX1, y : Y1, safe : true});
		Lander.points.push({x : endX1, y : Y1, safe : true});
		Lander.points.push({x : (endX1 + startX2) / 2, y : (Y1 + Y2) / 2, safe : false});
		Lander.points.push({x : startX2, y : Y2, safe : true});
		Lander.points.push({x : endX2, y : Y2, safe : true});
		Lander.points.push({x : 1000, y : getRandomInt(50, 500), safe : false});

		generateTerrainStep(0, .3);

		Lander.bgcontext.beginPath();
		Lander.bgcontext.moveTo(Lander.points[0].x, 1000 - Lander.points[0].y);
		for (let i = 1; i < Lander.points.length; i++) {
			Lander.bgcontext.lineTo(Lander.points[i].x, 1000 - Lander.points[i].y)
		}
		Lander.bgcontext.lineWidth = 3;
		Lander.bgcontext.stroke();

		Lander.bgcontext.beginPath();
		Lander.bgcontext.moveTo(0, 1000);
		for (let i = 0; i < Lander.points.length; i++) {
			Lander.bgcontext.lineTo(Lander.points[i].x, 1000 - Lander.points[i].y)
		}
		Lander.bgcontext.lineTo(1000, 1000);
		Lander.bgcontext.closePath();
		Lander.bgcontext.fillStyle = color;
		Lander.bgcontext.fill();
	}

	function generateTerrainStep(depth, s) {
		if (depth > 6) return;
		let len = Lander.points.length - 1;

		let new_points = [];
		for (let i = 0; i < len; i++) {
			let first_point = Lander.points[i];
			let second_point = Lander.points[i + 1];
			new_points.push({x : first_point.x, y : first_point.y, safe : first_point.safe});
			let midpointX = (first_point.x + second_point.x) / 2;
			let midpointY = ((first_point.y + second_point.y) / 2) + (Random.nextGaussian(0, 1) * s * Math.abs(second_point.x - first_point.x));

			if (!Lander.points[i].safe || !Lander.points[i + 1].safe) {
				new_points.push({x : midpointX, y : midpointY, safe : false});
			}
		}
		new_points.push(Lander.points[len])
		Lander.points = new_points;

		generateTerrainStep(depth + 1, s)
	}

	function generateBackgroundTerrain(color) {
		let array = [];
		array.push({x : 0, y : getRandomInt(150, 600), safe : false});
		array.push({x : 1000, y : getRandomInt(150, 600), safe : false});

		array = generateBackgroundTerrainStep(0, .3, array);

		Lander.bgcontext.beginPath();
		Lander.bgcontext.moveTo(0, 1000);
		for (let i = 0; i < array.length; i++) {
			Lander.bgcontext.lineTo(array[i].x, 1000 - array[i].y)
		}
		Lander.bgcontext.lineTo(1000, 1000);
		Lander.bgcontext.closePath();
		Lander.bgcontext.fillStyle = color;
		Lander.bgcontext.fill();
	}

	function generateBackgroundTerrainStep(depth, s, array) {
		if (depth > 8) return array;
		let len = array.length - 1;

		let new_points = [];
		for (let i = 0; i < len; i++) {
			let first_point = array[i];
			let second_point = array[i + 1];
			new_points.push({x : first_point.x, y : first_point.y, safe : first_point.safe});
			let midpointX = (first_point.x + second_point.x) / 2;
			let midpointY = ((first_point.y + second_point.y) / 2) + (Random.nextGaussian(0, 1) * s * Math.abs(second_point.x - first_point.x));

			if (!array[i].safe || !array[i + 1].safe) {
				new_points.push({x : midpointX, y : midpointY, safe : false});
			}
		}
		new_points.push(array[len])
		array = new_points;

		return generateBackgroundTerrainStep(depth + 1, s, array)
	}

	function run() {
		initialize();
		
		let backgroundImage = new Image();
		backgroundImage.src = '../assets/night.jpg'
		
		backgroundImage.onload = function() {
			Lander.bgcontext.drawImage(backgroundImage, 0, 0, 1000, 1000);
			generateBackgroundTerrain("#52301c");
			generateBackgroundTerrain("#704328");
			generateTerrain("#d48c61");
		}

		input.initialize();

		requestAnimationFrame(gameLoop);
	}

	return {
		initialize : initialize,
		run : run
	};
}(Lander.model, Lander.screens, Lander.graphics, Lander.input));
