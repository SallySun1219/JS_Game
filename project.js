'use strict';
var sbw = 7; // screen border width
var sqw = 30; // square width
var sw = 1200; // screen width
var sh = 600; // screen height
var hsqw = sqw / 2;
var count = 0;
var speed;
var countTimer;
var addEnemyTimer;
var moveEnemyTimer;
var detectTouchTimer;
var countLimit = 30;  //設定遊戲時長(堅持多久過關)

/*------------------------------------------------------------
                        startGame()
            設定起始遊戲畫面，並由裡面的案件啟動遊戲。
-------------------------------------------------------------*/
function startGame() {
    var screen;
    var screenPosition;
    var screenLeft;
    var screenTop;
    var startNode;
    var s1, s2, s3, s4, s5,s6;
    var bodyNode;

    document.write('<div class="screen">');
    document.write('</div>');

    screen = document.getElementsByClassName("screen")[0]; //獲取包含screen類名的所有元素

    screenPosition = getPosition(screen);  //取得左上角的座標位置
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;
    // Start bar
    startNode = document.createElement("div");

    startNode.className = "bar";
    startNode.style.width = sw + "px";
    startNode.style.height = (sh / 3) + "px";
    startNode.style.left = screenLeft + "px";
    startNode.style.top = (screenTop + sh / 3) + "px";

    // Set difficulty
    s1 = "<br><span style='font-weight:bolder'>別讓「窮」追上你</span><br>";
    s2 = "<span style='color:#4c4851;font-weight:bold'>";
    s3 = "<input class=\"form-check-input\" type=\'radio\' name=\'level\' checked>初級 &nbsp;&nbsp;&nbsp;";
    s4 = "<input class=\"form-check-input\" type=\'radio\' name=\'level\'>中級 &nbsp;&nbsp;&nbsp;";
    s5 = "<input class=\"form-check-input\" type=\'radio\' name=\'level\'>高級</span><br>";
    s6 = "<button id=\'new\' onclick=\'activateGame();\'>開始遊戲</button>";

    startNode.innerHTML = s1 + s2 + s3 + s4 + s5 + s6;
    bodyNode = document.getElementsByTagName("body");
    bodyNode[0].appendChild(startNode);

    initCursorPos();
}

/*------------------------------------------------------------
                        getLevel()
                    判斷選擇的遊戲等級。
-------------------------------------------------------------*/
function getLevel() {
    var levelArray;
    var i;

    levelArray = document.getElementsByName("level");
    for (i = 0; i < levelArray.length; i++) {
        if (levelArray[i].checked) {
            speed = 2 * i + 2;
            break;
        }
    }
}

/*------------------------------------------------------------
                        activateGame()
                先清空start bar，再開始執行遊戲。
-------------------------------------------------------------*/
function activateGame() {
    var startNode;

    // get level
    getLevel();

    // clear start bar
    startNode = document.getElementsByClassName("bar")[0];
    startNode.outerHTML = '';

    // activate game
    initCursorPos();
    moveCursor();
    countTimer = setInterval(countTime, 1000);
    addEnemyTimer = setInterval(addEnemy, 250);
    moveEnemyTimer = setInterval(moveEnemy, 20);
    detectTouchTimer = setInterval(detectTouch, 10);
}

/*------------------------------------------------------------
                        countTime()
                計時器，計算遊戲持續多久Game Over。
-------------------------------------------------------------*/
function countTime() {
    var tNode;

    tNode = document.getElementsByClassName("time")[0];

    count++;
    tNode.innerHTML = count + " sec.";

    // win
    if (count >= countLimit) {
        gameOver();
    }

}

/*------------------------------------------------------------
                        initTime()
                 初始化count，計時器歸零。
-------------------------------------------------------------*/
function initTime() {
    var tNode;

    tNode = document.getElementsByClassName("time")[0];

    count = 0;
    tNode.innerHTML = count + " sec.";    
}

/*------------------------------------------------------------
                        initCursorPos()
                     初始化游標，讓"我"置中。
-------------------------------------------------------------*/
function initCursorPos() {
    var square;
    var screen;
    var screenPosition;
    var screenLeft;
    var screenTop;

    square = document.getElementsByClassName("cursor")[0];
    screen = document.getElementsByClassName("screen")[0];
	square.innerText = "我";
    
    screenPosition = getPosition(screen);
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;
    square.style.left= (screenLeft + sw/2 - hsqw) + 'px';
	square.style.top= (screenTop + sh/2 - hsqw) +'px';
}

/*------------------------------------------------------------
                        getPosition()
                   取得物件左上角的座標位置。     
-------------------------------------------------------------*/
function getPosition(element) {
    var x = 0;
    var y = 0;

    while ( element ) {
      x += element.offsetLeft - element.scrollLeft + element.clientLeft;
      y += element.offsetTop - element.scrollLeft + element.clientTop;
      element = element.offsetParent;
    }
  
    return { x: x, y: y };
}

/*------------------------------------------------------------
                        moveCursor()
                 使"我"字隨著滑鼠移動而移動。    
-------------------------------------------------------------*/
function moveCursor() {
    var s;

    s = document.getElementsByClassName("screen")[0];
    if (window.addEventListener) {
	    // DOM method for binding an event
	    window.addEventListener("mousemove", newCursor, false);
    } else if (window.attachEvent) {
	    // IE-exclusive method for binding an event
	    window.attachEvent("onmousemove", newCursor);
    } else {
        window.onmousemove = newCursor;
    }
}

/*------------------------------------------------------------
                        newCursor()
        即使游標超過遊戲畫面，"我"字也不會移動到超過遊戲視窗。    
-------------------------------------------------------------*/
function newCursor(e) {
    var square, screen;
    var screenPosition, screenLeft, screenTop;
    var adjLeft, adjTop;

	e = e || window.event;
	square = document.getElementsByClassName("cursor")[0];
    screen = document.getElementsByClassName("screen")[0];
    
    screenPosition = getPosition(screen);
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;

    // control left/right border
    if (e.clientX < screenLeft + hsqw) {
        adjLeft = screenLeft;
    } else if (e.clientX > screenLeft + sw - hsqw) {
        adjLeft = screenLeft + sw - sqw; 
    } else {
        adjLeft = e.clientX - hsqw;
    }

    // control top/down border
    if (e.clientY < screenTop + hsqw) {
        adjTop = screenTop;
    } else if (e.clientY > screenTop + sh - hsqw) {
        adjTop = screenTop + sh - sqw;
    } else {
        adjTop = e.clientY - hsqw;
    }
    
    
    square.style.left= adjLeft + 'px';
	square.style.top= adjTop +'px';
    
    // show position
    /*
    var pos = getPosition(screen);
    var msg = "client:" + "(" + e.clientX + "," + e.clientY + ")" + "<br>" + "offset:" + "(" + e.offsetX + "," + e.offsetY + ")" + "<br>";
    msg += "position:" + "(" + pos["x"] + "," + pos["y"] + ")" + "<br>";
    var note = document.getElementsByClassName("note")[0];
    note.innerHTML = msg;
    */
}

/*---------------------------------------------------------------
                      rand(lower, upper)
隨機產生一個數使其在lower與upper的範圍中(如果lower>upper則回傳NaN)。     
----------------------------------------------------------------*/
function rand(lower, upper) {
    if (lower > upper)
        return NaN;
	return Math.floor(Math.random()*(upper-lower+1)) + lower;
}

/*------------------------------------------------------------
                         addEnemy()
                隨機產生"窮"字使其當障礙物。    
-------------------------------------------------------------*/
function addEnemy() {
    var square, screen;
    var squarePosition, squareLeft, squareTop;
    var squareCenterX, squareCenterY;
    var screenPosition, screenLeft, screenTop;
    var enemyX, enemyY, select;
    var leftX, rightX, topY, downY;
    var enemyLeft, enemyTop;
    var enemyNode, textNode;

	square = document.getElementsByClassName("cursor")[0];
    screen = document.getElementsByClassName("screen")[0];

    // square position
    squarePosition = getPosition(square);
    squareLeft = squarePosition.x;
    squareTop = squarePosition.y;
    squareCenterX = squareLeft + hsqw;
    squareCenterY = squareTop + hsqw;

    // screen position
    screenPosition = getPosition(screen);
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;
    
    // enemy position
    // screenLeft + hsqw <= x <= screenLeft + sw - hsqw
    // screenTop + hsqw <= y <= screenTop + sh - hsqw
    // 使enmey不會直接產生在游標上導致Game ove導致Game over
    leftX = rand(screenLeft + hsqw, squareCenterX - 2 * sqw);
    rightX = rand(squareCenterX + 2 * sqw, screenLeft + sw - hsqw);
    topY = rand(screenTop + hsqw, squareCenterY - 2 * sqw);
    downY = rand(squareCenterY + 2 * sqw, screenTop + sh - hsqw);

    if (isNaN(leftX)) {
        enemyX = rightX;
    } else if (isNaN(rightX)) {
        enemyX = leftX;
    } else {
        select = rand(0, 1);
        if (select) {
            enemyX = leftX;
        } else {
            enemyX = rightX;
        }
    }

    if (isNaN(topY)) {
        enemyY = downY;
    } else if (isNaN(downY)) {
        enemyY = topY;
    } else {
        select = rand(0, 1);
        if (select) {
            enemyY = topY;
        } else {
            enemyY = downY;
        }
    }
    enemyLeft = enemyX - hsqw;
    enemyTop = enemyY - hsqw;

    enemyNode = document.createElement("div");
    enemyNode.className = "enemy";
    enemyNode.style.left = enemyLeft + "px";
    enemyNode.style.top = enemyTop + "px";
    textNode = document.createTextNode("窮");
    enemyNode.appendChild(textNode);

    screen.appendChild(enemyNode);
}

/*------------------------------------------------------------
                         moveEnemy()
              產生的"窮"字會往游標方向("我")移動。    
-------------------------------------------------------------*/
function moveEnemy() {
    var square, screen;
    var runEnemy;
    var screenPosition, screenLeft, screenTop;
    var sqli, sqti, reli, reti, dirX, dirY;
    var l, r, i;
    var destX, destY;

    square = document.getElementsByClassName("cursor")[0];
    screen = document.getElementsByClassName("screen")[0];
    runEnemy = document.getElementsByClassName("enemy");

    screenPosition = getPosition(screen);
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;

    for(i=0; i<runEnemy.length; i++){
        sqli = parseInt(square.style.left.substr(0, square.style.left.length - 2));
        sqti = parseInt(square.style.top.substr(0, square.style.top.length - 2));
        reli = parseInt(runEnemy[i].style.left.substr(0, runEnemy[i].style.left.length - 2));
        reti = parseInt(runEnemy[i].style.top.substr(0, runEnemy[i].style.top.length - 2));
        dirX = sqli - reli;
        dirY = sqti - reti;
        l = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
        r = rand(speed,speed+2);
        destX = reli + Math.round(r * dirX / l);
        destY = reti + Math.round(r * dirY / l);

        // detect if the enemy touches the border
        if (destX < screenLeft){
            destX = screenLeft; 
        }else if (destX > screenLeft + sw - sqw){
            destX = screenLeft + sw - sqw;
        }

        if(destY < screenTop){
            destY = screenTop;
        }else if (destY > screenTop + sh - sqw){
            destY = screenTop + sh - sqw;
        }

        runEnemy[i].style.left = destX + 'px';
        runEnemy[i].style.top = destY + 'px';
    }
}

/*------------------------------------------------------------
                         detectTouch()
                如果"窮"接觸到了"我"，即遊戲結束。    
-------------------------------------------------------------*/
function detectTouch() {
    var square, runEnemy;
    var sqli, sqti, reli, reti, dirX, dirY;
    var l, i;

    square = document.getElementsByClassName("cursor")[0];
    runEnemy = document.getElementsByClassName("enemy");

    for(i=0; i<runEnemy.length; i++){
        sqli = parseInt(square.style.left.substr(0, square.style.left.length - 2));
        sqti = parseInt(square.style.top.substr(0, square.style.top.length - 2));
        reli = parseInt(runEnemy[i].style.left.substr(0, runEnemy[i].style.left.length - 2));
        reti = parseInt(runEnemy[i].style.top.substr(0, runEnemy[i].style.top.length - 2));
        dirX = sqli - reli;
        dirY = sqti - reti;
        l = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));
        if (l < hsqw) {
            gameOver();
            break;
        }
    }
}

/*------------------------------------------------------------
                         gameOver()
            遊戲結束，結束所有Timer且顯示End bar。    
-------------------------------------------------------------*/
function gameOver() {
    var screen, screenPosition, screenLeft, screenTop;
    var endNode, bodyNode;

    window.removeEventListener("mousemove", newCursor, false);
    clearInterval(countTimer);
    clearInterval(addEnemyTimer);
    clearInterval(moveEnemyTimer);
    clearInterval(detectTouchTimer);

    screen = document.getElementsByClassName("screen")[0];
    screenPosition = getPosition(screen);
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;
    // End bar
    endNode = document.createElement("div");
    endNode.className = "bar";
    endNode.style.width = sw + "px";
    endNode.style.height = (sh / 3) + "px";
    endNode.style.left = screenLeft + "px";
    endNode.style.top = (screenTop + sh / 3) + "px";
    if (count < countLimit)
        endNode.innerHTML = '<br><span style=\'color:#372f3b;font-weight:bold\'>😰 窮困潦倒 😰</span><br><br><button id=\'new\' onclick=\'restartGame();\'>再玩一次</button>';
    else
        endNode.innerHTML = '<br><span style=\'color:#ffd8e6;font-weight:bold\'>😆 一生富貴 😆</span><br><br><button id=\'new\' onclick=\'restartGame();\'>再玩一次</button>';
    bodyNode = document.getElementsByTagName("body");
    bodyNode[0].appendChild(endNode);
}

/*------------------------------------------------------------
                         clearEnemy()
                 清空畫面("窮")，使畫面初始化。   
-------------------------------------------------------------*/
function clearEnemy() {
    var screen;
    var bodyNode, divNode;

    screen = document.getElementsByClassName("screen")[0];
    screen.remove();
    bodyNode = document.getElementsByTagName("body")[0];
    divNode = document.createElement('div');
    divNode.className = 'screen';
    bodyNode.appendChild(divNode);
}

/*------------------------------------------------------------
                         restartGame()
          清空End bar、"窮"和計時器規0，並重新啟動遊戲。   
-------------------------------------------------------------*/
function restartGame() {
    var endNode, startNode, bodyNode;
    var screen, screenPosition, screenLeft, screenTop;
    var s1, s2, s3, s4, s5, s6;

    // clear end bar
    endNode = document.getElementsByClassName("bar")[0];
    endNode.outerHTML = '';
    // clear enemies
    clearEnemy();

    // set level
    screen = document.getElementsByClassName("screen")[0];

    screenPosition = getPosition(screen);
    screenLeft = screenPosition.x;
    screenTop = screenPosition.y;
    // Start bar
    startNode = document.createElement("div");

    startNode.className = "bar";
    startNode.style.width = sw + "px";
    startNode.style.height = (sh / 3) + "px";
    startNode.style.left = screenLeft + "px";
    startNode.style.top = (screenTop + sh / 3) + "px";

    // Set difficulty
    s1 = "<br><span style='font-weight:bolder'>別讓「窮」追上你</span><br>";
    s2 = "<span style='color:#4c4851;font-weight:bold'>";
    s3 = "<input class=\"form-check-input\" type=\'radio\' name=\'level\' checked>初級 &nbsp;&nbsp;&nbsp;";
    s4 = "<input class=\"form-check-input\" type=\'radio\' name=\'level\'>中級 &nbsp;&nbsp;&nbsp;";
    s5 = "<input class=\"form-check-input\" type=\'radio\' name=\'level\'>高級</span><br>";
    s6 = "<button id=\'new\' onclick=\'activateGame();\'>開始遊戲</button>";

    startNode.innerHTML = s1 + s2 + s3 + s4 + s5 + s6;
    bodyNode = document.getElementsByTagName("body");
    bodyNode[0].appendChild(startNode);    
    initCursorPos();
    initTime();
    /*
    // activate game
    initTime();
    initCursorPos();
    moveCursor();
    countTimer = setInterval(countTime, 1000);
    addEnemyTimer = setInterval(addEnemy, 250);
    moveEnemyTimer = setInterval(moveEnemy, 20);
    detectTouchTimer = setInterval(detectTouch, 20);
    */
}

document.write('<header><h1>窮追不捨</h1></header>');
document.write('<div class="time">' + count + ' sec.</div>');
document.write('<div class="cursor"></div>');

//document.write('<div class="note"></div>');

startGame();
