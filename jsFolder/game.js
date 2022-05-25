'use strict'
var EMPTY = '0'
var FLAG = '^1'
var MINE = '*'

var gBoard =[]
var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
}

function init() {
    gBoard = buildboard(4,4)
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
}



function buildboard(rowsNum,colNum) {
    //צור מטריצה בפנקציה נפרדת
    var board = createMat(rowsNum, colNum)

    // מלא את הערכים במטריצה באובייקטים של תא
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var buildCell = { minesAroundCount: 0,
                 isShown: false,
                 isMine: false,
                 isMarked: false
                }

            board[i][j] = buildCell
        }
    }
    // set mines menualy
    board[0][1].isMine = true
    board[0][1].isShown = true
    board[1][2].isMine = true
    board[1][2].isShown = true

    // board[0][1].minesAroundCount = setMinesNegsCount(board,0,1)
    // setMinesNegsCount(gboard)
    console.log(board)
    return board
}



function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            // פה מוסיפים קלאס בהמשך
            // פותחים טייבל דאטא
            strHTML += `<td class="cell">`
            if(currCell.isMine){ 
                strHTML += `${MINE}`
            } else{
            strHTML += `${EMPTY}`
        }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.mines-board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount2(iIndx,jIndx){
    var mineNeibCount2 = 0

    for (var i = (iIndx-1); i <= iIndx+1; i++) {
        if((i < 0) || (i >= gBoard.length)) continue
        for (var j = (jIndx-1); j <= (jIndx+1); j++) {
            if (i === iIndx && j === jIndx) continue;
            if((j < 0) || (j >= gBoard[0].length)) continue
            if(gBoard[i][j].isMine) mineNeibCount2++
        }
    }
    
    return mineNeibCount2

}


function setMinesNegsCount(board){  /// רץ על כל המטריצה ושולח זוג קורדינטות לבדוק כמה שכנים
    
    for (var i = 0; i < board.length; i++) {
        
        for (var j = 0; j < board[0].length; j++) {
           
        var minesNeibCount = 0
         minesNeibCount = setMinesNegsCount2(i,j)
        board[i][j].minesAroundCount = minesNeibCount
        }
    }
}

