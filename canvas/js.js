window.onload = function() {
		drawChess();
	}
	//画logo
function drawChess() {
	var chess = document.getElementById("chess");
	var context = chess.getContext('2d');
	var logo = new Image();
	logo.src = "image/bg2.png";
	logo.onload = function() {
			context.drawImage(logo, 0, 0, 450, 450);
			drawChessBoard();
		}
		//黑白棋切换
	var me = true;
	var over = false;
	//棋盘矩阵
	var chessStep = [];
	for (var i = 0; i < 15; i++) {
		chessStep[i] = [];
		for (var j = 0; j < 15; j++) {
			chessStep[i][j] = 0;
		}
	}
	//胜利数组算法
	var count = 0;
	var wins = [];
	//初始化三维数组
	for (var i = 0; i < 15; i++) {
		wins[i] = [];
		for (var j = 0; j < 15; j++) {
			wins[i][j] = [];
		}
	}

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i][j + k][count] = true;
			}
			count++;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[j + k][i][count] = true;
			}
			count++;
		}
	}
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i + k][j + k][count] = true;
			}
			count++;
		}
	}
	for (var i = 0; i < 11; i++) {
		for (var j = 14; j > 3; j--) {
			for (var k = 0; k < 5; k++) {
				wins[i + k][j - k][count] = true;
			}
			count++;
		}
	}
	console.log(count);
	//计算胜负手
	var mywins = [];
	var computerwins = [];
	for (var i = 0; i < count; i++) {
		mywins[i] = 0;
		computerwins[i] = 0;
	}
	//画棋盘
	var drawChessBoard = function() {
		for (var i = 0; i < 15; i++) {
			context.beginPath()
			context.moveTo(15 + i * 30, 15);
			context.lineTo(15 + i * 30, 435);
			context.strokeStyle = "#646464";
			context.stroke();
			context.closePath();
			context.beginPath()
			context.moveTo(15, 15 + i * 30);
			context.lineTo(435, 15 + i * 30);
			context.strokeStyle = "#BFBFBF";
			context.stroke();
			context.closePath()
		}
	}
	
	var oneStep = function(i, j, me) {
		context.beginPath();
		context.arc(15 + i * 30, 15 + j * 30, 10, 0, 2 * Math.PI);
		context.closePath();
		var gradient = context.createRadialGradient(15 + i * 30, 15 + j * 30, 13, 15 + i * 30, 15 + j * 30, 0);
		if (me) {
			gradient.addColorStop(0, "#0A0A0A");
			gradient.addColorStop(1, "#636766")
		} else {
			gradient.addColorStop(0, "#D1D1D1");
			gradient.addColorStop(1, "#F9F9F9");
		}
		context.fillStyle = gradient;
		context.fill();
	}
	chess.onclick = function(e) {
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / 30);
		var j = Math.floor(y / 30);
		if (over) {
			return;
		}
		if (!me) {
			return;
		}
		if (chessStep[i][j] == 0) {
			oneStep(i, j, me);
			chessStep[i][j] = 1;
			for (var k = 0; k < count; k++) {
				if (wins[i][j][k]) {
					mywins[k]++;
					computerwins[k] = 6;
					if (mywins[k] == 5) {
						window.alert("你赢了");
						over = true;
					}
				}
			}
			if (!over) {
				me = !me;
				computerAI()
			}
		}
	}
	var computerAI = function() {
		var myscore = [];
		var computerscore = [];
		var max = 0;
		var u = 0;
		var v = 0;
		for (var i = 0; i < 15; i++) {
			myscore[i]= [];
			computerscore[i]= [];
			for (var j = 0; j < 15; j++) {
				myscore[i][j] = 0;
				computerscore[i][j] = 0;
			}
		}
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if (chessStep[i][j] == 0) {
					for (k = 0; k < count; k++) {
						if (wins[i][j][k]) {
							if (mywins[k] == 1) {
								myscore[i][j] += 200;
							} else if (mywins[k] == 2) {
								myscore[i][j] += 400;
							} else if (mywins[k] == 3) {
								myscore[i][j] += 2000;
							} else if (mywins[k] == 4) {
								myscore[i][j] += 10000;
							}
							if (computerwins[k] == 1) {
								computerscore[i][j] += 220;
							} else if (computerwins[k] == 2) {
								computerscore[i][j] += 420;
							} else if (computerwins[k] == 3) {
								computerscore[i][j] += 2100;
							} else if (computerwins[k] == 4) {
								computerscore[i][j] += 20000;
							}
						}
					}
					if (myscore[i][j] > max) {
						max = myscore[i][j];
						u = i;
						v = j;
					} else if (myscore[i][j] == max) {
						if (computerscore[i][j] > computerscore[u][v]) {
							u = i;
							v = j;
						}
					}
					if (computerscore[i][j] > max) {
						max = computerscore[i][j];
						u = i;
						v = j;
					} else if (computerscore[i][j] == max) {
						if (myscore[i][j] > myscore[u][v]) {
							u = i;
							v = j;
						}
					}
				}
			}
		}
		oneStep(u, v, false);
		chessStep[u][v] = 2;
		for (var k = 0; k < count; k++) {
			if (wins[u][v][k]) {
				computerwins[k]++;
				mywins[k] = 6;
				if (computerwins[k] == 5) {
					window.alert("机器人赢了");
					over = true;
				}
			}
		}
		if(!over){
			me=!me;
		}
	}
}