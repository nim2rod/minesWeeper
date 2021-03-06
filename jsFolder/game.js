'use strict'
var EMPTY = ''
var FLAG = '馃弫'
var MINE = '馃挬'



var isMarkedCounter = 0
var isShownCounter = 0
var isMineCounter = 0

var gBestScore = ''
var gSafeNum = 3
var gLife = 3
var gTimer = 0
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
    MINES: 2
}
/// 诇讛讜住讬祝 讘砖讜专转 body         oncontextmenu="return false;"
////   oncontextmenu="return false;"

function playerLevel(matSize, minesNumber) {
    gLevel.SIZE = matSize
    gLevel.MINES = minesNumber
}

function easyLevel() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    init()
}
function mediumLevel() {
    gLevel.SIZE = 8
    gLevel.MINES = 12
    init()
}

function expertLevel() {
    gLevel.SIZE = 12
    gLevel.MINES = 30
    init()
}

function init() {
    gBoard = buildboard(gLevel.SIZE, gLevel.SIZE)           // board
    renderBoard(gBoard)

    clearInterval(timerSet)                                 // timer
    gTimer = 0
    document.querySelector('.timer').innerText = gTimer

    isMineCounter = 0                                       // 讗讬驻讜住讬诐
    isMarkedCounter = 0
    isShownCounter = 0
    gSafeNum = 3
    gLife = 3
    gBestScore = ''
    gHintNum = 3
    gHintOn = false

    gGame.isOn = true

    var elSmile = document.querySelector('.smile')          //住诪讬讬诇讬
    elSmile.innerHTML = '馃檪'
    var elgameOver = document.querySelector('.game-over')   // 诪讜讚诇 讛驻住讚
    elgameOver.style.display = 'none'

    var elGameWin = document.querySelector('.win-game')     // 诪讜讚诇 谞爪讞讜谉
    elGameWin.style.display = 'none'

    var elLife = document.querySelector('.life1')           //诇讘讘讜转 讞讬讬诐
    elLife.style.display = 'inline-block'
    var elLife2 = document.querySelector('.life2')          //诇讘讘讜转 讞讬讬诐
    elLife2.style.display = 'inline-block'
    var elLife3 = document.querySelector('.life3')          //诇讘讘讜转 讞讬讬诐
    elLife3.style.display = 'inline-block'
    var elClick = document.querySelector('.safe-click')     //砖讬谞讜讬 诪住驻专 注诇 讛诪住讱
    elClick.innerHTML = `Safe Click -${gSafeNum}-`
    var elBestScore = document.querySelector('.best-score') //best score
    elBestScore.innerHTML = `BEST SCORE: ${gBestScore}`
    var elHint = document.querySelector(`.hint1`) //诇讛讞讝讬专 诇诪住讱 讗讬讬拽讜谉 砖诇 讛专诪讝
    elHint.style.display = 'inline-block'
    var elHint = document.querySelector(`.hint2`) //诇讛讞讝讬专 诇诪住讱 讗讬讬拽讜谉 砖诇 讛专诪讝
    elHint.style.display = 'inline-block'
    var elHint = document.querySelector(`.hint3`) //诇讛讞讝讬专 诇诪住讱 讗讬讬拽讜谉 砖诇 讛专诪讝
    elHint.style.display = 'inline-block'


    console.log(gBoard)
}

function buildboard(rowsNum, colNum) {
    //爪讜专 诪讟专讬爪讛 讘驻谞拽爪讬讛 谞驻专讚转
    var board = createMat(rowsNum, colNum)

    // 诪诇讗 讗转 讛注专讻讬诐 讘诪讟专讬爪讛 讘讗讜讘讬讬拽讟讬诐 砖诇 转讗
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
            // 驻讛 诪讜住讬驻讬诐 拽诇讗住
            // 驻讜转讞讬诐 讟讬讬讘诇 讚讗讟讗
            strHTML += `<td class="cell ${cellClass}" onclick="cellClicked(2,${i},${j})" oncontextmenu="rightClicked(${i},${j})" >`
            if (currCell.isMine) {   //// 驻讛 诪砖讛讜 谞专讗讛 诪讬讜转专
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


function setMinesNegsCount(board) {  /// 专抓 注诇 讻诇 讛诪讟专讬爪讛 讜砖讜诇讞 讝讜讙 拽讜专讚讬谞讟讜转 诇讘讚讜拽 讻诪讛 砖讻谞讬诐

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

    if (!gBoard[i][j].isMarked) {   // 讗诐 讛转讗 诇讗 诪讚讜讙诇
        if (gBoard[i][j].isShown) return //  讗讘诇 讻谉 讞砖讜祝 - 讚诇讙讙
        // 讗诐 诇讗 讞砖讜祝 讜诇讗 诪讚讜讙诇 讜谞诇讞抓 拽诇讬拽 讬诪谞讬
        gBoard[i][j].isMarked = true  // 
        isMarkedCounter++
        renderCell(locationFlag, FLAG)

    } else if (gBoard[i][j].isMarked) {  // 讗诐 讛转讗 诪讚讜讙诇
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
    if (trueOrFalse) {  //谞爪讞讜谉

        console.log('winner')

        var audio = new Audio('sounds/win.wav')
        audio.play()

        if (gBestScore < gTimer) gBestScore = gTimer
        var elBestScore = document.querySelector('.best-score') //best score
        elBestScore.innerHTML = `BEST SCORE: ${gBestScore}`
        clearInterval(timerSet)
        gTimer = 0
        var elWinGame = document.querySelector('.win-game')
        elWinGame.style.display = 'block'

        var elSmile = document.querySelector('.smile') //住诪讬讬诇讬
        elSmile.innerHTML = '馃コ'

    } else if (trueOrFalse === false) {  // 讛驻住讚
        revealsMinesLose()
        var audio = new Audio('sounds/lose2.wav')
        audio.play()
        gGame.isOn = false
        clearInterval(timerSet)
        gTimer = 0
        console.log('loser')
        var elgameOver = document.querySelector('.game-over')
        elgameOver.style.display = 'block'
        var elSmile = document.querySelector('.smile') //住诪讬讬诇讬
        elSmile.innerHTML = '馃樀'
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
    if (isMineCounter === 0) {   //讗诐 讗讬谉 诪讜拽砖讬诐
        locateMines(i, j)       //驻讬讝讜专 诪讜拽砖讬诐 讘诇讞讬爪讛 讛专讗砖讜谞讛
        setMinesNegsCount(gBoard)
    }
    if (gHintOn) {
        hintImplement(i, j)
        return
    }
    renderTimer()   ///// 转驻注讬诇 讗转 讛讟讬讬诪专
    var locationCell = { i: i, j: j }
    if (gBoard[i][j].isMarked) return
    if ((gBoard[i][j].isMine) && (!gBoard[i][j].isShown)) {   //注诇讬讬讛 注诇 诪讜拽砖
        renderCell({ i: i, j: j }, MINE)
        var audio = new Audio('sounds/mine.wav')
        audio.play()


        var elLife = document.querySelector(`.life${gLife}`) //诇讘讘讜转 讞讬讬诐
        console.log('glife: ', gLife)
        elLife.style.display = 'none'
        gLife--
        if (gLife === 0) winTrueLoseFalse(false)  /// 讗诐 谞讙诪专讜 讛讞讬讬诐 讗讝 讛驻住讚 诪砖讞拽
    }
    // class="cell ${cellClass}"
    if (!gBoard[i][j].isMine) {    // 讗诐 诇讗 诪讜拽砖
        if (gBoard[i][j].minesAroundCount > 0) {  //讗诐 讬砖 砖讻谉 诪讜拽砖 -  讞讜砖祝 转讗 讗讞讚
            renderCell(locationCell, gBoard[i][j].minesAroundCount)
        }

        if (gBoard[i][j].minesAroundCount === 0) {   //讗诐 讗讬谉 砖讻谉 诪讜拽砖 -    讛
            // isShownCounter++
            for (var k = (i - 1); k <= (i + 1); k++) {  //       专抓 注诇 讛砖讻谞讬诐 诇讟讜讘转 讞砖讬驻讛 
                if ((k < 0) || (k >= gBoard.length)) continue  // 诪讜讜讚讗 砖诇讗 讬讜爪讗 诪讛诪讟专讬爪讛

                for (var l = (j - 1); l <= (j + 1); l++) {
                    if ((l < 0) || (l >= gBoard[0].length)) continue   // 诪讜讜讚讗 砖诇讗 讬讜爪讗 诪讛诪讟专讬爪讛

                    if (gBoard[k][l].isShown) continue        // 讗诐 诪讚讜讙诇 讗讜 讞砖讜祝 讻讘专 讗讝 讚诇讙
                    if (gBoard[k][l].isMarked) continue

                    // if (gBoard[k][l].isMine) renderCell({ i: k, j: l }, '**')  // 砖讜专讛 讞住专转 诪砖诪注讜转
                    ///////////// 注爪讜专 讻讗谉谉谉谉谉谉谉谉谉
                    if (!gBoard[k][l].isMine) {    // 讘讜讚拽 讗转 讛砖讻谞讬诐 砖诇 讛砖讻谉-- 转谞讗讬 诪讬讜转专 诇讚注转讬 
                        if (gBoard[k][l].minesAroundCount) renderCell({ i: k, j: l }, gBoard[k][l].minesAroundCount)  // 讙讚讜诇 诪讗驻住 转专讗讛 诪住驻专
                        if (!gBoard[k][l].minesAroundCount) {
                            renderCell({ i: k, j: l }, '--')  //// 砖讜讜讛 诇讗驻住 - 转专讗讛 住讬诪谉 专讬拽
                            cellClicked(elCell, k, l)
                        }
                    }

                }
            }

            renderCell(locationCell, '--')  // 诇讛讞诇讬祝 诇转诪讜谞讛 讗讜 爪讘注 讗讞专 诇专讬拽
        }

    }
}

function renderCell(location, value, trueFalse = true) {
    if ((value !== FLAG) && (gBoard[location.i][location.j].isShown === true)) return
    var cellSelector = '.' + getClassName(location)    /// 专讬谞讚讜专
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

    gBoard[location.i][location.j].isShown = trueFalse  // 砖诐 注专讱 讘讜诇讬讗谞讬 讘讗讬讝 砖讜讗讜

    if (trueFalse) {
        // if(gBoard[location.i][location.j].isShown)
        isShownCounter++

    } else {  ///讛诪拽专讛 讛讬讞讬讚讬 讝讛 诇讛讜专讬讚 讚讙诇 诇讛讞讝讬专 诇诪爪讘 讛拽讜讚诐
        isShownCounter--
    }
    checkIfWin()
    console.log('isShownCounter: ', isShownCounter)
    console.log('isMarkedCounter: ', isMarkedCounter)

}

function renderTimer() {
    if (gTimer !== 0) {
        console.log('whyyyy')
        return
    } else {
        console.log('start timer')
        elTimer = document.querySelector('.timer')
        timerSet = setInterval(timerCounting, 1000)
    }
}

function timerCounting() {
    gTimer += 1
    // gTimer = +gTimer.toFixed(2)
    elTimer.innerText = gTimer
    // console.log('gtimer: ',gTimer)
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
    var safe = '馃'

    var cellSelector = '.' + getClassName(locationSafe)    /// 专讬谞讚讜专
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = safe



    setTimeout(function () {
        renderSafeCellBack(locationSafe);
    }, 700)
    gSafeNum--
}

function renderSafeCellBack(location) {
    console.log('render safe back ', location)
    var cellSelector = '.' + getClassName(location)    ///   专讬谞讚讜专 讞讝专讛 砖诇 讛转讗
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = EMPTY

    var elClick = document.querySelector('.safe-click') //砖讬谞讜讬 诪住驻专 注诇 讛诪住讱
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
  

    for (var k = (i - 1); k <= (i + 1); k++) {  //       专抓 注诇 讛砖讻谞讬诐 诇讟讜讘转 讞砖讬驻讛 
        if ((k < 0) || (k >= gBoard.length)) continue  // 诪讜讜讚讗 砖诇讗 讬讜爪讗 诪讛诪讟专讬爪讛

        for (var l = (j - 1); l <= (j + 1); l++) {
            if ((l < 0) || (l >= gBoard[0].length)) continue   // 诪讜讜讚讗 砖诇讗 讬讜爪讗 诪讛诪讟专讬爪讛

            if (gBoard[k][l].isShown) continue        // 讗诐 诪讚讜讙诇 讗讜 讞砖讜祝 讻讘专 讗讝 讚诇讙
            if (gBoard[k][l].isMarked) continue

            if (gBoard[k][l].isMine) {
                var cellSelector = '.' + 'cell-' + k + '-' + l   /// 专讬谞讚讜专
                var elCell = document.querySelector(cellSelector)
                elCell.innerHTML = MINE

                // setTimeout(function () {
                //     renderHintCellBack(k, l);
                // }, 900)
            } else if (gBoard[k][l].minesAroundCount === 0) {

                var cellSelector = '.' + 'cell-' + k + '-' + l   /// 专讬谞讚讜专
                var elCell = document.querySelector(cellSelector)
                elCell.innerHTML = '--'

                // setTimeout(function () {
                //     renderHintCellBack(k, l);
                // }, 900)

            } else if (gBoard[k][l].minesAroundCount > 0) {
                var cellSelector = '.' + 'cell-' + k + '-' + l   /// 专讬谞讚讜专
                var elCell = document.querySelector(cellSelector)
                elCell.innerHTML = gBoard[k][l].minesAroundCount
            }
        }
    
    }

    setTimeout(function () {
        renderHintCellsBack(i, j);
    }, 900)
    var elHint = document.querySelector(`.hint${gHintNum}`) //诇讛讜专讬讚 诪讛诪住讱 讗讬讬拽讜谉 砖诇 讛专诪讝
    console.log('gHintNum: ', gHintNum)
    elHint.style.display = 'none'

    console.log('hintImplement is on')
    gHintNum--
    gHintOn = false

}



function renderHintCellsBack(i, j){
    for (var k = (i - 1); k <= (i + 1); k++) {  //       专抓 注诇 讛砖讻谞讬诐 诇讟讜讘转 讞砖讬驻讛 
        if ((k < 0) || (k >= gBoard.length)) continue  // 诪讜讜讚讗 砖诇讗 讬讜爪讗 诪讛诪讟专讬爪讛

        for (var l = (j - 1); l <= (j + 1); l++) {
            if ((l < 0) || (l >= gBoard[0].length)) continue

            var cellSelector = '.' + 'cell-' + k + '-' + l   /// 专讬谞讚讜专
            var elCell = document.querySelector(cellSelector)
            elCell.innerHTML = ``
        }
    }
}   