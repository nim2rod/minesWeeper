'use strict'
var EMPTY = ''
var FLAG = '🏁'
var MINE = '💩'

var isMarkedCounter = 0
var isShownCounter = 0
var isMineCounter = 0

var gBestScore = ''
var gSafeNum = 3
var gLife = 3
var gTimer = 0
var gTimerIsOn = false
var elTimer
var timerSet
var gHintNum = 3
var gHintOn = false

var gBoard = []
var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    WIDTH_CELL: '70px',
    FONT_SIZE: '1em'
}
/// להוסיף בשורת body        
////   oncontextmenu="return false;"

function playerLevel(matSize, minesNumber) {
    gLevel.SIZE = matSize
    gLevel.MINES = minesNumber
}

function easyLevel() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gLevel.WIDTH_CELL = '70px'
    gLevel.FONT_SIZE = '1em'
    init()
}

function mediumLevel() {
    gLevel.SIZE = 8
    gLevel.MINES = 12
    gLevel.WIDTH_CELL = '52px'
    gLevel.FONT_SIZE = '1em'
    init()
}

function expertLevel() {
    gLevel.SIZE = 12
    gLevel.MINES = 30
    gLevel.WIDTH_CELL = '37px'
    gLevel.FONT_SIZE = '0.8em'
    init()
}

function init() {
    gBoard = buildboard(gLevel.SIZE, gLevel.SIZE)           // board
    renderBoard(gBoard)

    const doc = document.querySelectorAll('.cell')
    doc.forEach((cell) => {
        cell.style.height = gLevel.WIDTH_CELL
        cell.style.width = gLevel.WIDTH_CELL
    })

    const size = document.querySelectorAll('.cell')
    size.forEach((cell) => {
        cell.style['font-size'] = gLevel.FONT_SIZE
    })

    clearInterval(timerSet)                                 // timer
    gTimer = 0
    gTimerIsOn = false
    document.querySelector('.timer').innerText = gTimer

    isMineCounter = 0                                       // איפוסים
    isMarkedCounter = 0
    isShownCounter = 0
    gSafeNum = 3
    gLife = 3
    // gBestScore = ''
    gHintNum = 3
    gHintOn = false

    gGame.isOn = true

    var elSmile = document.querySelector('.smile')          //סמיילי
    elSmile.innerHTML = '🙂'

    var elgameOver = document.querySelector('.game-over')   // מודל הפסד
    elgameOver.style.display = 'none'
    var elGameWin = document.querySelector('.win-game')     // מודל נצחון
    elGameWin.style.display = 'none'

    var elLife = document.querySelector('.life1')           //לבבות חיים
    elLife.style.display = 'inline-block'
    var elLife2 = document.querySelector('.life2')          //לבבות חיים
    elLife2.style.display = 'inline-block'
    var elLife3 = document.querySelector('.life3')          //לבבות חיים
    elLife3.style.display = 'inline-block'

    var elClick = document.querySelector('.safe-click')     //שינוי מספר על המסך
    elClick.innerHTML = `Safe Click -${gSafeNum}-`
    var elBestScore = document.querySelector('.best-score') //best score
    elBestScore.innerHTML = `MINIMUM TIME: ${gBestScore}`
    var elHint = document.querySelector(`.hint1`) //להחזיר למסך אייקון של הרמז
    elHint.style.display = 'inline-block'
    var elHint = document.querySelector(`.hint2`) //להחזיר למסך אייקון של הרמז
    elHint.style.display = 'inline-block'
    var elHint = document.querySelector(`.hint3`) //להחזיר למסך אייקון של הרמז
    elHint.style.display = 'inline-block'


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
            if (currCell.isMine) {   //// פה משהו נראה מיותר
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

function rightClicked(i, j) {
    if (!gGame.isOn) return
    renderTimer()

    var locationFlag = { i: i, j: j }

    if (!gBoard[i][j].isMarked) {   // אם התא לא מדוגל
        if (gBoard[i][j].isShown) return //  אבל כן חשוף - דלגג
        // אם לא חשוף ולא מדוגל ונלחץ קליק ימני
        gBoard[i][j].isMarked = true  // 
        isMarkedCounter++
        renderCell(locationFlag, FLAG)

    } else if (gBoard[i][j].isMarked) {  // אם התא מדוגל
        gBoard[i][j].isMarked = false // 
        gBoard[i][j].isShown = false
        isMarkedCounter--
        renderCell(locationFlag, EMPTY, false)
    }
}

function revealsMinesLose() {
    // var locationCell = { i: i, j: j }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) renderCell({ i: i, j: j }, MINE)
        }
    }
}

function winTrueLoseFalse(trueOrFalse) {
    if (trueOrFalse) {  //נצחון
        console.log('winner')
        var audio = new Audio('sounds/win.wav')
        audio.play()

        console.log('gtimer', gTimer);
        console.log('gBestScore', gBestScore);
        if (gBestScore > gTimer || !gBestScore) gBestScore = gTimer
        var elBestScore = document.querySelector('.best-score') //best score
        elBestScore.innerHTML = `MINIMUM TIME: ${gBestScore}`
        clearInterval(timerSet)
        gTimer = 0
        gTimerIsOn = false
        var elWinGame = document.querySelector('.win-game')
        elWinGame.style.display = 'block'

        var elSmile = document.querySelector('.smile') //סמיילי
        elSmile.innerHTML = '🥳'

    } else if (trueOrFalse === false) {  // הפסד
        revealsMinesLose()
        var audio = new Audio('sounds/lose2.wav')
        audio.play()
        gGame.isOn = false
        clearInterval(timerSet)
        gTimer = 0
        gTimerIsOn = false
        console.log('loser')
        var elgameOver = document.querySelector('.game-over')
        elgameOver.style.display = 'block'
        var elSmile = document.querySelector('.smile') //סמיילי
        elSmile.innerHTML = '😵'
    }
}

function checkIfWin() {
    if ((isShownCounter === gLevel.SIZE ** 2) && (isMarkedCounter <= gLevel.MINES)) {
        winTrueLoseFalse(true)

    }
}

function locateMines(iIndx, jIndx) {
    var minesNum = gLevel.MINES
    var matLength = gLevel.SIZE
    for (var i = 0; i < minesNum; i++) {
        var randNumI = getRandomInt(0, matLength)
        var randNumJ = getRandomInt(0, matLength)
        if (randNumI === iIndx && randNumJ === jIndx) {
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

    if (!gGame.isOn) return
    if (isMineCounter === 0) {   //אם אין מוקשים
        locateMines(i, j)       //פיזור מוקשים בלחיצה הראשונה
        setMinesNegsCount(gBoard)
    }
    if (gHintOn) {
        hintImplement(i, j)
        return
    }
    renderTimer()   ///// תפעיל את הטיימר
    var locationCell = { i: i, j: j }
    if (gBoard[i][j].isMarked) return
    if ((gBoard[i][j].isMine) && (!gBoard[i][j].isShown)) {   //עלייה על מוקש
        renderCell({ i: i, j: j }, MINE)
        var audio = new Audio('sounds/mine.wav')
        audio.play()

        var elLife = document.querySelector(`.life${gLife}`) //לבבות חיים
        console.log('glife: ', gLife)
        elLife.style.display = 'none'
        gLife--
        if (gLife === 0) winTrueLoseFalse(false)  /// אם נגמרו החיים אז הפסד משחק
    }
    // class="cell ${cellClass}"
    if (!gBoard[i][j].isMine) {    // אם לא מוקש
        if (gBoard[i][j].minesAroundCount > 0) {  //אם יש שכן מוקש -  חושף תא אחד
            renderCell(locationCell, gBoard[i][j].minesAroundCount)
        }

        if (gBoard[i][j].minesAroundCount === 0) {   //אם אין שכן מוקש -    ה
            // isShownCounter++
            for (var k = (i - 1); k <= (i + 1); k++) {  //       רץ על השכנים לטובת חשיפה 
                if ((k < 0) || (k >= gBoard.length)) continue  // מוודא שלא יוצא מהמטריצה

                for (var l = (j - 1); l <= (j + 1); l++) {
                    if ((l < 0) || (l >= gBoard[0].length)) continue   // מוודא שלא יוצא מהמטריצה

                    if (gBoard[k][l].isShown) continue        // אם מדוגל או חשוף כבר אז דלג
                    if (gBoard[k][l].isMarked) continue

                    if (!gBoard[k][l].isMine) {    // בודק את השכנים של השכן-- תנאי מיותר לדעתי 
                        if (gBoard[k][l].minesAroundCount) renderCell({ i: k, j: l }, gBoard[k][l].minesAroundCount)  // גדול מאפס תראה מספר
                        if (!gBoard[k][l].minesAroundCount) {
                            renderCell({ i: k, j: l }, '--')  //// שווה לאפס - תראה סימן ריק
                            cellClicked(elCell, k, l)
                        }
                    }

                }
            }

            renderCell(locationCell, '--')  // להחליף לתמונה או צבע אחר לריק
        }

    }
}

function renderCell(location, value, trueFalse = true) {
    if ((value !== FLAG) && (gBoard[location.i][location.j].isShown === true)) return
    var cellSelector = '.' + getClassName(location)    /// רינדור
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

    gBoard[location.i][location.j].isShown = trueFalse  // שם ערך בוליאני באיז שואו

    if (trueFalse) {
        // if(gBoard[location.i][location.j].isShown)
        isShownCounter++

    } else {  ///המקרה היחידי זה להוריד דגל להחזיר למצב הקודם
        isShownCounter--
    }
    checkIfWin()
    console.log('isShownCounter: ', isShownCounter)
    console.log('isMarkedCounter: ', isMarkedCounter)
}

function renderTimer() {
    if (gTimerIsOn) return
    if (gTimer !== 0) {
        return
    } else {
        console.log('start timer')
        gTimerIsOn = true
        elTimer = document.querySelector('.timer')
        timerSet = setInterval(timerCounting, 1000)
    }
}

function timerCounting() {
    gTimer += 1
    elTimer.innerText = gTimer
}

function safeClick() {
    if (!gGame.isOn) return
    if (gSafeNum < 1) return
    var locationSafe = getRandomCell()
    if ((gBoard[locationSafe.i][locationSafe.j].isMine === true) || (gBoard[locationSafe.i][locationSafe.j].isShown === true)) {
        safeClick()
        return
    } else {
        console.log('unShown cell: ', locationSafe.i, ' ', locationSafe.j)
    }
    /// check how many neibors - store in var
    // var neiborsNum = gBoard[locationSafe.i][locationSafe.j].minesAroundCount
    // render cell with SAFE 
    var safe = '🤙'

    var cellSelector = '.' + getClassName(locationSafe)    /// רינדור
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = safe



    setTimeout(function () {
        renderSafeCellBack(locationSafe);
    }, 700)
    gSafeNum--
}

function renderSafeCellBack(location) {
    console.log('render safe back ', location)
    var cellSelector = '.' + getClassName(location)    ///   רינדור חזרה של התא
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = EMPTY

    var elClick = document.querySelector('.safe-click') //שינוי מספר על המסך
    elClick.innerHTML = `Safe Click -${gSafeNum}-`
}


function getRandomCell() {
    var matLength = gLevel.SIZE
    var randNumI = getRandomInt(0, matLength)
    var randNumJ = getRandomInt(0, matLength)
    var location = { i: randNumI, j: randNumJ }
    return location
}

function hintOn() {
    if (gHintNum < 1) return
    console.log('hintNum:', gHintNum)

    gHintOn = true
    console.log('hintON is on')
}

function hintImplement(i, j) {


    for (var k = (i - 1); k <= (i + 1); k++) {  //       רץ על השכנים לטובת חשיפה 
        if ((k < 0) || (k >= gBoard.length)) continue  // מוודא שלא יוצא מהמטריצה

        for (var l = (j - 1); l <= (j + 1); l++) {
            if ((l < 0) || (l >= gBoard[0].length)) continue   // מוודא שלא יוצא מהמטריצה

            if (gBoard[k][l].isShown) continue        // אם מדוגל או חשוף כבר אז דלג
            if (gBoard[k][l].isMarked) continue

            if (gBoard[k][l].isMine) {
                var cellSelector = '.' + 'cell-' + k + '-' + l   /// רינדור
                var elCell = document.querySelector(cellSelector)
                elCell.innerHTML = MINE

                // setTimeout(function () {
                //     renderHintCellBack(k, l);
                // }, 900)
            } else if (gBoard[k][l].minesAroundCount === 0) {

                var cellSelector = '.' + 'cell-' + k + '-' + l   /// רינדור
                var elCell = document.querySelector(cellSelector)
                elCell.innerHTML = '--'

                // setTimeout(function () {
                //     renderHintCellBack(k, l);
                // }, 900)

            } else if (gBoard[k][l].minesAroundCount > 0) {
                var cellSelector = '.' + 'cell-' + k + '-' + l   /// רינדור
                var elCell = document.querySelector(cellSelector)
                elCell.innerHTML = gBoard[k][l].minesAroundCount
            }
        }

    }

    setTimeout(function () {
        renderHintCellsBack(i, j);
    }, 900)
    var elHint = document.querySelector(`.hint${gHintNum}`) //להוריד מהמסך אייקון של הרמז
    console.log('gHintNum: ', gHintNum)
    elHint.style.display = 'none'

    console.log('hintImplement is on')
    gHintNum--
    gHintOn = false

}

function renderHintCellsBack(i, j) {
    for (var k = (i - 1); k <= (i + 1); k++) {  //       רץ על השכנים לטובת חשיפה 
        if ((k < 0) || (k >= gBoard.length)) continue  // מוודא שלא יוצא מהמטריצה

        for (var l = (j - 1); l <= (j + 1); l++) {
            if ((l < 0) || (l >= gBoard[0].length)) continue

            var cellSelector = '.' + 'cell-' + k + '-' + l   /// רינדור
            var elCell = document.querySelector(cellSelector)
            elCell.innerHTML = ``
        }
    }
}   