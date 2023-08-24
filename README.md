# JS_Game
一.系統摘要
► 此網頁遊戲是款敏捷遊戲，是使用HTML、CSS及JavaScript來撰寫。
► 遊戲玩法：
遊戲視窗內會持續出現「窮」字並不斷的往「我」字移動；玩家需利用滑鼠控制「我」在時限內(目前設定30秒)不能被「窮」追上且碰到。遊戲有分初級、中級和高級，隨著級別的上升，「窮」移動的速度會越來越快。
► 系統功能：
    ① 如果滑鼠超果遊戲視窗，「我」也會隨著滑鼠相對的位置做出移動。
	② 有分初級中級高級的難易度供玩家選擇。

二.系統開發平台
本網頁是利用Visual Studio Code和在Windows環境下開發。本網頁使用HTML、CSS及JavaScript撰寫而成。

三.程式說明
此網站由HTML、CSS和JavaScript三個檔案所構成。
 0812233-project.html：負責建立網頁的主結構(不多做內容說明)。
 project.css：負責美化網頁(不多做內容說明)。
 project.js:
玩家選擇的遊戲難易度(初級、中級、高級)，我們利用getLevel函數讀取玩家選擇的難易度。點擊Button(開始遊戲)會觸發activateGame這個函數，而activateGame函數會依序呼叫initCursorPos、moveCursor、countTime、addEnemy、moveEnemy、detectTouch這些函數。而countTime、addEnemy、moveEnemy、detectTouch這四個函數會去用setInterval去設定重複執行函數的時間。
以下為遊戲開始所執行函數的流程圖及功能：
當玩家達到通關標準或是通關失敗(被「窮」追到)，則會觸發gameOver函數；gameOver函數會終止所有Timer並顯示遊戲結果(破關成功顯示「😆一生富貴😆」；破關失敗顯示「😰窮困潦倒😰」)和Button(再玩一次)。點擊「再玩一次」會觸發restartGame函數，restartGame函數會叫用clearEnemy函數來清空遊戲視窗內所有「窮」字，並重新初始畫面。
