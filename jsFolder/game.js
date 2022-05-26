'use strict'
var EMPTY = ''
var FLAG = '🏁'
var MINE = '💩'  

// var audio = src('sounds/win.wav');
// audio.play();


var isMarkedCounter = 0
var isShownCounter = 0
var isMineCounter = 0

var gLife = 3
var gTimer = 0
var elTimer
var timerSet

var gBoard = []
var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}
/// להוסיף בשורת body
////   oncontextmenu="return false;"

function playerLevel(matSize,minesNumber){
gLevel.SIZE = matSize
gLevel.MINES = minesNumber
}

function easyLevel(){
    gTimer = 0
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gBoard = buildboard(gLevel.SIZE, gLevel.SIZE  )
    renderBoard(gBoard)
    isMineCounter = 0
    isMarkedCounter = 0
    isShownCounter = 0
    gGame.isOn = true
    var elgameOver = document.querySelector('.game-over')
        elgameOver.style.display = 'none'
    var elSmile = document.querySelector('.smile') //סמיילי
    elSmile.innerHTML = '🙂'
    gLife = 3

    var elLife = document.querySelector('.life1') //לבבות חיים
    elLife.style.display = 'block'
    var elLife2 = document.querySelector('.life2') //לבבות חיים
    elLife2.style.display = 'block'
    var elLife3 = document.querySelector('.life3') //לבבות חיים
    elLife3.style.display = 'block'

}
function mediumLevel(){
    gTimer = 0
    gLevel.SIZE = 8
    gLevel.MINES = 12
    gBoard = buildboard(gLevel.SIZE, gLevel.SIZE  )
    renderBoard(gBoard)
    isMineCounter = 0
    isMarkedCounter = 0
    isShownCounter = 0
    gGame.isOn = true
    var elgameOver = document.querySelector('.game-over')
        elgameOver.style.display = 'none'
        var elSmile = document.querySelector('.smile') //סמיילי
        elSmile.innerHTML = '🙂'
        
        gLife = 3
        var elLife = document.querySelector('.life1') //לבבות חיים
        elLife.style.display = 'block'
        var elLife2 = document.querySelector('.life2') //לבבות חיים
        elLife2.style.display = 'block'
        var elLife3 = document.querySelector('.life3') //לבבות חיים
        elLife3.style.display = 'block'
}

function expertLevel(){
    gTimer = 0
    gLevel.SIZE = 12
    gLevel.MINES = 30
    gBoard = buildboard(gLevel.SIZE, gLevel.SIZE  )
    renderBoard(gBoard)
    isMineCounter = 0
    isMarkedCounter = 0
    isShownCounter = 0
    gGame.isOn = true
    var elgameOver = document.querySelector('.game-over')
        elgameOver.style.display = 'none'
        var elSmile = document.querySelector('.smile') //סמיילי
        elSmile.innerHTML = '🙂'
        
        gLife = 3
        var elLife = document.querySelector('.life1') //לבבות חיים
        elLife.style.display = 'block'
        var elLife2 = document.querySelector('.life2') //לבבות חיים
        elLife2.style.display = 'block'
        var elLife3 = document.querySelector('.life3') //לבבות חיים
        elLife3.style.display = 'block'
}

function init() {
    // var sizeQuest = +prompt('choose the size of your playboard!: 4 , 8 or 12')
    // var minesNum 
    // if(sizeQuest === 4) minesNum = 2
    // if(sizeQuest === 8) minesNum = 12
    // if(sizeQuest === 12) minesNum = 30
    // if((sizeQuest !== 4) &&  (sizeQuest !== 8) && (sizeQuest !== 12)){
    //      alert('only 4, 8 or 12🐹, we will start with 4 then')
    //      sizeQuest = 4
    //      minesNum = 2
    // }
    // gLevel.SIZE = 4
    // gLevel.MINES = 2
    // playerLevel(sizeQuest , minesNum)
    gBoard = buildboard(gLevel.SIZE, gLevel.SIZE  )
    renderBoard(gBoard)

    isMineCounter = 0
   isMarkedCounter = 0
   isShownCounter = 0

    gGame.isOn = true

    var elSmile = document.querySelector('.smile') //סמיילי
    elSmile.innerHTML = '🙂'

    console.log(gBoard)
}

function buildboard(rowsNum, colNum) {
    //צור מטריצה בפנקציה נפרדת
    var board = createMat(rowsNum, colNum)

    // מלא את הערכים במטריצה באובייקטים של תא
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var buildCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = buildCell
        }
    }

    return board
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // פה מוסיפים קלאס
            // פותחים טייבל דאטא
            strHTML += `<td class="cell ${cellClass}" onclick="cellClicked(2,${i},${j})" oncontextmenu="rightClicked(${i},${j})" >`
            if (currCell.isMine) {
                strHTML += `${EMPTY}`
            } else {
                strHTML += `${EMPTY}`
            }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.mines-board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount2(iIndx, jIndx) {
    var mineNeibCount2 = 0

    for (var i = (iIndx - 1); i <= iIndx + 1; i++) {
        if ((i < 0) || (i >= gBoard.length)) continue
        for (var j = (jIndx - 1); j <= (jIndx + 1); j++) {
            if (i === iIndx && j === jIndx) continue;
            if ((j < 0) || (j >= gBoard[0].length)) continue
            if (gBoard[i][j].isMine) mineNeibCount2++
        }
    }

    return mineNeibCount2

}


function setMinesNegsCount(board) {  /// רץ על כל המטריצה ושולח זוג קורדינטות לבדוק כמה שכנים

    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[0].length; j++) {

            var minesNeibCount = 0
            minesNeibCount = setMinesNegsCount2(i, j)
            board[i][j].minesAroundCount = minesNeibCount
        }
    }
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function rightClicked(i,j){
    if(!gGame.isOn) return
    renderTimer()
   
    var locationFlag = { i: i, j: j }

    if(!gBoard[i][j].isMarked){   // אם התא לא מדוגל
        if(gBoard[i][j].isShown) return //  אבל כן חשוף - דלגג
                                        // אם לא חשוף ולא מדוגל ונלחץ קליק ימני
        gBoard[i][j].isMarked = true  // 
        isMarkedCounter++
        renderCell(locationFlag,FLAG)

    } else if(gBoard[i][j].isMarked){  // אם התא מדוגל
        gBoard[i][j].isMarked = false // 
        gBoard[i][j].isShown = false
        isMarkedCounter--
        renderCell(locationFlag,EMPTY,false)
    } 
}
function revealsMinesLose(){
    // var locationCell = { i: i, j: j }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if(gBoard[i][j].isMine)  renderCell({ i: i , j: j }, MINE)
        }
    }
}

function winTrueLoseFalse(trueOrFalse){
    if(trueOrFalse){  //נצחון
    
        console.log('winner')

        clearInterval(timerSet)
        var elWinGame = document.querySelector('.win-game')
        elWinGame.style.display = 'block'
        
        var elSmile = document.querySelector('.smile') //סמיילי
        elSmile.innerHTML = '🥳'

    }else if(trueOrFalse === false){  // הפסד
        revealsMinesLose()
        gGame.isOn = false
        clearInterval(timerSet)
        console.log('loser')
        var elgameOver = document.querySelector('.game-over')
        elgameOver.style.display = 'block'
        var elSmile = document.querySelector('.smile') //סמיילי
        elSmile.innerHTML = '😵'
    }
}
// && (isMarkedCounter === gLevel.MINES)
function checkIfWin(){
    if((isShownCounter === gLevel.SIZE**2)  ){
        winTrueLoseFalse(true)
        
    }
}

function locateMines(iIndx,jIndx){
    var minesNum = gLevel.MINES
    var matLength = gLevel.SIZE
    for (var i = 0 ; i < minesNum ; i++) {
        var randNumI = getRandomInt(0, matLength)
        var randNumJ = getRandomInt(0, matLength)
        if(randNumI === iIndx && randNumJ === jIndx){
            randNumI = getRandomInt(0, matLength)
            randNumJ = getRandomInt(0, matLength)
        }
        gBoard[randNumI][randNumJ].isMine = true
        isMineCounter++
    }
}
function cellClicked(elCell, i, j) {
    console.log('click')
    console.log(gBoard)
    if(!gGame.isOn) return
    if(isMineCounter === 0){
        locateMines(i,j)
        setMinesNegsCount(gBoard)
    }
    renderTimer()
    var locationCell = { i: i, j: j }
    if(gBoard[i][j].isMarked)return
    if (gBoard[i][j].isMine){   //הפסד - עליה על מוקש
        renderCell({ i: i , j: j }, MINE)
        
        
      
        var elLife = document.querySelector(`.life${gLife}`) //לבבות חיים
        console.log('glife: ',gLife)   ///         יש בעיה בספירה של glife
        elLife.style.display = 'none'
        gLife --
        

        if(gLife === 0)  winTrueLoseFalse(false)
    }
    // class="cell ${cellClass}"
    if (!gBoard[i][j].isMine) {
        if (gBoard[i][j].minesAroundCount > 0) {  // חושף תא אחד
            renderCell(locationCell, gBoard[i][j].minesAroundCount)
        }

        if (gBoard[i][j].minesAroundCount === 0) {   // רץ על השכנים לטובת חשיפה
            // isShownCounter++
            for (var k = (i - 1); k <= (i + 1); k++) {
                if ((k < 0) || (k >= gBoard.length)) continue  // מוודא שלא יוצא מהמטריצה

                for (var l=(j-1) ; l<=(j+1) ; l++) {
                    if ((l<0) || (l>=gBoard[0].length)) continue   // מוודא שלא יוצא מהמטריצה

                    if(gBoard[k][l].isShown) continue        // אם מדוגל או חשוף כבר אז דלג
                    if(gBoard[k][l].isMarked) continue

                    // if (gBoard[k][l].isMine) renderCell({ i: k, j: l }, '**')  // שורה חסרת משמעות
                    
                    if (!gBoard[k][l].isMine){
                        if(gBoard[k][l].minesAroundCount) renderCell({ i: k, j: l },gBoard[k][l].minesAroundCount )  // גדול מאפס תראה מספר
                        if(!gBoard[k][l].minesAroundCount) renderCell({ i: k, j: l } , '--' )  //// שווה לאפס - תראה סימן ריק
                     } 
                    
                }
            }

            renderCell(locationCell, '--')  // להחליף לתמונה או צבע אחר לריק
        }

    }
}

function renderCell(location, value, trueFalse = true) {
    if((value !== FLAG) && (gBoard[location.i][location.j].isShown === true)) return
    var cellSelector = '.' + getClassName(location)    /// רינדור
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

    gBoard[location.i][location.j].isShown = trueFalse  // שם ערך בוליאני באיז שואו

    if(trueFalse) {
        // if(gBoard[location.i][location.j].isShown)
        isShownCounter++
       
    } else{  ///המקרה היחידי זה להוריד דגל להחזיר למצב הקודם
        isShownCounter--
    }
    checkIfWin()
    console.log('isShownCounter: ',isShownCounter)
    console.log('isMarkedCounter: ',isMarkedCounter)
   
}

function renderTimer(){
    if(gTimer !== 0) {
        return
    } else{
        console.log('start timer')
        elTimer = document.querySelector('.timer')
   timerSet = setInterval(timerCounting,1000)
    }   
}

function timerCounting(){
    gTimer += 1.0
    // gTimer = +gTimer.toFixed(2)
    elTimer.innerHTML = gTimer
} 