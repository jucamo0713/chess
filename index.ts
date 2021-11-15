//deveulve una matriz 8x8 con todos los campos en false
const tablePossibleMovementsBase = (): Array<Array<boolean>> => {
    let board: Array<Array<boolean>> = [];
    for (let i = 0; i < 8; i++) {
        let aux: Array<boolean> = [];
        for (let j = 0; j < 8; j++) {
            aux.push(false);
        }
        board.push(aux);
    }
    return board;
}
//devuelve una copia de una mtriz 2 x2 enviada
const transferArray = (array: Array<Array<any>>): Array<Array<any>> => {
    let transfer: Array<Array<any>> = [];
    for (let i = 0; i < array.length; i++) {
        transfer.push([]);
        for (let j = 0; j < array.length; j++) {
            transfer[i].push(array[i][j]);
        }
    }
    return transfer;
}
//verifica si el jugador esta en jaque
const verifyCheck = (board: Array<Array<number>>, blackOrWhite: boolean/* false for white and true for black*/): boolean => {
    let kingPosition: number[] = [-1, -1];
    let king: number = (blackOrWhite ? -1 : 1);
    for (let i: number = 0; i < 8; i++) {
        for (let j: number = 0; j < 8; j++) {
            if (board[i][j] == king) {
                kingPosition = [i, j];
                break;
            }
        }
        if (kingPosition[0] != -1) {
            break;
        }
    }
    //primera columna de validacion de colisiones
    //segunda columna de valor de verificacion
    let tableOfValidate: { validate: boolean[], value: number[] };
    tableOfValidate = {
        validate: [true, true, true, true, true, true, true, true],
        value: [0, 0, 0, 0, 0, 0, 0, 0]
    };
    for (
        //vertical abajo
        let vB: number = kingPosition[0] + 1,
            //vertical arriba
            vT: number = kingPosition[0] - 1,
            //horizontal derecha
            hR: number = kingPosition[1] + 1,
            //horizontal izquierda
            hL: number = kingPosition[1] - 1,
            //Repeticiones
            count: number = 1;
        tableOfValidate.validate.includes(true) || count <= 2;
        vB++, vT--, hR++, hL--, count++) {
        tableOfValidate.validate[0] = tableOfValidate.validate[0] ? vB < 8 : false;
        tableOfValidate.validate[1] = tableOfValidate.validate[1] ? vT >= 0 : false;
        tableOfValidate.validate[2] = tableOfValidate.validate[2] ? hR < 8 : false;
        tableOfValidate.validate[3] = tableOfValidate.validate[3] ? hL >= 0 : false;
        tableOfValidate.validate[4] = tableOfValidate.validate[4] ? vT >= 0 && hR < 8 : false;
        tableOfValidate.validate[5] = tableOfValidate.validate[5] ? vT >= 0 && hL >= 0 : false;
        tableOfValidate.validate[6] = tableOfValidate.validate[6] ? vB < 8 && hR < 8 : false;
        tableOfValidate.validate[7] = tableOfValidate.validate[7] ? vB < 8 && hL >= 0 : false;
        tableOfValidate.value[0] = (tableOfValidate.validate[0]) ? board[vB][kingPosition[1]] * king : 0;//abajo
        tableOfValidate.value[1] = (tableOfValidate.validate[1]) ? board[vT][kingPosition[1]] * king : 0;//arriba
        tableOfValidate.value[2] = (tableOfValidate.validate[2]) ? board[kingPosition[0]][hR] * king : 0;//derecha
        tableOfValidate.value[3] = (tableOfValidate.validate[3]) ? board[kingPosition[0]][hL] * king : 0;//izquierda
        tableOfValidate.value[4] = (tableOfValidate.validate[4]) ? board[vT][hR] * king : 0;//arriba derecha
        tableOfValidate.value[5] = (tableOfValidate.validate[5]) ? board[vT][hL] * king : 0;//arriba izquierda
        tableOfValidate.value[6] = (tableOfValidate.validate[6]) ? board[vB][hR] * king : 0;//abajo derecha
        tableOfValidate.value[7] = (tableOfValidate.validate[7]) ? board[vB][hL] * king : 0;//abajo izquierda
        if (tableOfValidate.value.filter(value => value < 0).length > 0) {
            for (let i = 0; i < 4; i++) {
                if (tableOfValidate.value[i] < 0) {
                    if ([-2, -5].includes(tableOfValidate.value[i])) {
                        return true;
                    } else {
                        tableOfValidate.validate[i] = false;
                    }
                }
            }
            for (let i = 4; i < 8; i++) {
                if (tableOfValidate.value[i] < 0) {
                    if ([(count === 1 && ((blackOrWhite && i > 5) || ((!blackOrWhite) && i < 6)) ? -6 : null), -5, -4].includes(tableOfValidate.value[i])) {
                        return true;
                    } else {
                        tableOfValidate.validate[i] = false;
                    }
                }
            }
        }
        if (count === 2) {
            const horses: number[] = [];
            horses.push((vT >= 0 && (kingPosition[1] - 1) >= 0) ? board[vT][kingPosition[1] - 1] * king : 0)
            horses.push((vT >= 0 && (kingPosition[1] + 1) < 8) ? board[vT][kingPosition[1] + 1] * king : 0)
            horses.push((vB < 8 && (kingPosition[1] - 1) >= 0) ? board[vB][kingPosition[1] - 1] * king : 0)
            horses.push((vB < 8 && (kingPosition[1] - 1) < 8) ? board[vB][kingPosition[1] + 1] * king : 0)
            horses.push((hL >= 0 && (kingPosition[0] - 1) >= 0) ? board[kingPosition[0] - 1][hL] * king : 0)
            horses.push((hL >= 0 && (kingPosition[0] + 1) < 8) ? board[kingPosition[0] + 1][hL] * king : 0)
            horses.push((hR < 8 && (kingPosition[0] - 1) >= 0) ? board[kingPosition[0] - 1][hR] * king : 0)
            horses.push((hR < 8 && (kingPosition[0] + 1) < 8) ? board[kingPosition[0] + 1][hR] * king : 0)
            if (horses.includes(-3)) {
                return true;
            }
        }
        tableOfValidate.value.filter((value, index) => {
            if (value > 0) {
                tableOfValidate.validate[index] = false;
            }
        })
    }
    return false;
}
//devuelve un objeto que contiene las pocisiones del movimiento a evaluar, el valor relativo de la pocision con la pieza y si aun es posible continuar en esa direccion;
const crateTableOfValidate = (board: Array<Array<number>>, tableOfValidate: { positions: { x: number, y: number }[], status: number[], continue: boolean[] }, piece: number): { positions: { x: number, y: number }[], status: number[], continue: boolean[] } => {
    for (let i = 0; i < tableOfValidate.positions.length; i++) {
        if (tableOfValidate.continue[i] && tableOfValidate.positions[i].x < 8 && tableOfValidate.positions[i].x >= 0 && tableOfValidate.positions[i].y < 8 && tableOfValidate.positions[i].y >= 0) {
            const x = (board[tableOfValidate.positions[i].x][tableOfValidate.positions[i].y] * piece) / Math.abs(piece);
            tableOfValidate.status.push(x)
            tableOfValidate.continue[i] = x === 0;
        } else {
            tableOfValidate.continue[i] = false;
            tableOfValidate.status.push(1)
        }
    }
    return tableOfValidate;
};
//devuelve le tablero de posibilidades actualizado al evaluar todas las posiciones de la tabla de validacion;
const verifyPositions = (board: Array<Array<number>>,
                         tableOfValidate: { positions: { x: number, y: number }[], status: number[], continue: boolean[] },
                         piece: number,
                         position: { x: number, y: number },
                         possibilities: Array<Array<boolean>>) => {
    let i = tableOfValidate.status.findIndex((value) => {
        return value <= 0
    });
    while (i >= 0) {
        let aux = transferArray(board);
        aux[position.x][position.y] = board[tableOfValidate.positions[i].x][tableOfValidate.positions[i].y];
        aux[tableOfValidate.positions[i].x][tableOfValidate.positions[i].y] = piece;
        possibilities[tableOfValidate.positions[i].x][tableOfValidate.positions[i].y] = !verifyCheck(aux, piece < 0);
        tableOfValidate.status[i] = 1;
        i = tableOfValidate.status.findIndex((value) => {
            return value <= 0
        });
    }
    return possibilities;
}
//devuelve el tablero de posibilidades para el rey ubicado en la cordenada descrita en position
const moveKing = (board: Array<Array<number>>,
                  tower1Move: boolean,
                  kingMove: boolean,
                  tower2Move: boolean,
                  position: { x: number, y: number },
                  piece: number,
                  possibilities: Array<Array<boolean>>): Array<Array<boolean>> => {
    //vertical abajo
    let vB: number = position.x + 1,
        //vertical arriba
        vT: number = position.x - 1,
        //horizontal derecha
        hR: number = position.y + 1,
        //horizontal izquierda
        hL: number = position.y - 1;
    let tableOfValidate: { positions: { x: number, y: number }[], status: number[], continue: boolean[] };
    tableOfValidate = {
        positions: [{x: vB, y: position.y},
            {x: vT, y: position.y},
            {x: position.x, y: hR},
            {x: position.x, y: hL},
            {x: vT, y: hR},
            {x: vT, y: hL},
            {x: vB, y: hR},
            {x: vB, y: hL}
        ],
        status: [],
        continue: [true, true, true, true, true, true, true, true]
    };
    tableOfValidate = crateTableOfValidate(board, tableOfValidate, piece);
    possibilities = verifyPositions(board, tableOfValidate, piece, position, possibilities);
    //enroque
    if ((!kingMove)) {
        if (!tower1Move && board[position.x][1] === 0 && board[position.x][2] === 0 && board[position.x][3] === 0) {
            let aux: Array<Array<number>> = transferArray(board);
            aux[position.x][0] = 0;
            aux[position.x][1] = 0;
            aux[position.x][2] = piece;
            aux[position.x][3] = piece > 0 ? 2 : -2;
            aux[position.x][4] = 0;
            possibilities[position.x][0] = !verifyCheck(aux, piece < 0);
        }
        if (!tower2Move && board[position.x][6] === 0 && board[position.x][5] === 0) {
            let aux: Array<Array<number>> = transferArray(board);
            aux[position.x][7] = 0;
            aux[position.x][6] = piece;
            aux[position.x][5] = piece > 0 ? 2 : -2;
            aux[position.x][4] = 0;
            possibilities[position.x][7] = !verifyCheck(aux, piece < 0);
        }
    }
    return possibilities;
}
//devuelve el tablero de posibilidades para la torre en la cordenada descrita en position
const moveTower = (board: Array<Array<number>>,
                   tower1Move: boolean,
                   kingMove: boolean,
                   tower2Move: boolean,
                   position: { x: number, y: number },
                   piece: number,
                   possibilities: Array<Array<boolean>>): Array<Array<boolean>> => {

    //validar movimientos
    let tableOfValidate: { positions: { x: number, y: number }[], status: number[], continue: boolean[] };
    tableOfValidate = {
        positions: [],
        status: [],
        continue: [true, true, true, true]
    };
    for (//vertical abajo
        let vB: number = position.x + 1,
            //vertical arriba
            vT: number = position.x - 1,
            //horizontal derecha
            hR: number = position.y + 1,
            //horizontal izquierda
            hL: number = position.y - 1;
        vB < 8 || vT >= 0 || hR < 8 || hL >= 0;
        vB++, vT--, hR++, hL--) {
        tableOfValidate.positions = [{x: vB, y: position.y},
            {x: vT, y: position.y},
            {x: position.x, y: hR},
            {x: position.x, y: hL}
        ];
        tableOfValidate.status=[];
        tableOfValidate = crateTableOfValidate(board, tableOfValidate, piece);
        possibilities = verifyPositions(board, tableOfValidate, piece, position, possibilities);
    }
    //enroque
    if ((!kingMove) && Math.abs(piece) === 2) {
        if (!tower1Move && position.y === 0 && board[position.x][1] === 0 && board[position.x][2] === 0 && board[position.x][3] === 0) {
            let aux: Array<Array<number>> = transferArray(board);
            aux[position.x][0] = 0;
            aux[position.x][1] = 0;
            aux[position.x][2] = piece > 0 ? 1 : -1;
            aux[position.x][3] = piece;
            aux[position.x][4] = 0;
            possibilities[position.x][4] = !verifyCheck(aux, piece < 0);
        }
        if (!tower2Move && position.y === 7 && board[position.x][6] === 0 && board[position.x][5] === 0) {
            let aux: Array<Array<number>> = transferArray(board);
            aux[position.x][7] = 0;
            aux[position.x][6] = piece > 0 ? 1 : -1;
            aux[position.x][5] = piece;
            aux[position.x][4] = 0;
            possibilities[position.x][4] = !verifyCheck(aux, piece < 0);
        }
    }
    return possibilities;
}
//devuelve el tablero de posibilidades para el caballo ubicado en la cordenada descrita en position
const moveHorse = (board: Array<Array<number>>,
                   position: { x: number, y: number },
                   piece: number,
                   possibilities: Array<Array<boolean>>): Array<Array<boolean>> => {
    let vB: number = position.x + 2,
        //vertical arriba
        vT: number = position.x - 2,
        //horizontal derecha
        hR: number = position.y + 2,
        //horizontal izquierda
        hL: number = position.y - 2;
    let tableOfValidate: { positions: { x: number, y: number }[], status: number[], continue: boolean[] };
    tableOfValidate = {
        positions: [{x: vB, y: position.y + 1},
            {x: vB, y: position.y - 1},
            {x: vT, y: position.y + 1},
            {x: vT, y: position.y - 1},
            {x: position.x + 1, y: hR},
            {x: position.x - 1, y: hR},
            {x: position.x + 1, y: hL},
            {x: position.x - 1, y: hL}
        ],
        status: [],
        continue: [true, true, true, true, true, true, true, true]
    };
    tableOfValidate = crateTableOfValidate(board, tableOfValidate, piece);
    possibilities = verifyPositions(board, tableOfValidate, piece, position, possibilities);
    return possibilities;
}
//devuelve el tablero de posibilidades para el Alfil ubicado en la cordenada descrita en position
const moveBishop= (board: Array<Array<number>>,
                  position: { x: number, y: number },
                  piece: number,
                  possibilities: Array<Array<boolean>>): Array<Array<boolean>> => {

    //validar movimientos
    let tableOfValidate: { positions: { x: number, y: number }[], status: number[], continue: boolean[] };
    tableOfValidate = {
        positions: [],
        status: [],
        continue: [true, true, true, true]
    };
    for (//vertical abajo
        let vB: number = position.x + 1,
            //vertical arriba
            vT: number = position.x - 1,
            //horizontal derecha
            hR: number = position.y + 1,
            //horizontal izquierda
            hL: number = position.y - 1;
        vB < 8 || vT >= 0 || hR < 8 || hL >= 0;
        vB++, vT--, hR++, hL--) {
        tableOfValidate.positions = [{x: vB, y: hR},
            {x: vT, y: hL},
            {x: vB, y: hL},
            {x: vT, y: hL}
        ];
        tableOfValidate.status=[];
        tableOfValidate = crateTableOfValidate(board, tableOfValidate, piece);
        possibilities = verifyPositions(board, tableOfValidate, piece, position, possibilities);
    }
    return possibilities;
}
const movePawn = (board: Array<Array<number>>,
                  previousBoard: Array<Array<number>>,
                  position: { x: number, y: number },
                  piece: number,
                  possibilities: Array<Array<boolean>>): Array<Array<boolean>> => {
    let valueNext = board[position.x+(piece<0?1:-1)][position.y];
    let firstMove=false;
    // validacion de primer paso
    if((piece>0&&position.x==6)||(piece<0&&position.x==1)){
        firstMove=true;
    }
    //validacion casilla siguiente
    if(valueNext===0){
        let aux= transferArray(board);
        aux[position.x+(piece<0?1:-1)][position.y]=piece;
        aux[position.x][position.y]=0;
        possibilities[position.x+(piece<0?1:-1)][position.y]=!verifyCheck(aux,piece<0);
    }else{
        firstMove=false;
    }
    //validacion 2 casillas delante
    if(firstMove && board[position.x+(piece<0?2:-2)][position.y]===0){
        let aux= transferArray(board);
        aux[position.x+(piece<0?2:-2)][position.y]=piece;
        aux[position.x][position.y]=0;
        possibilities[position.x+(piece<0?2:-2)][position.y]=!verifyCheck(aux,piece<0);
    }
    //validacion diagonales
    let valueNextLeft= (position.y-1)>=0?(board[position.x+(piece<0?1:-1)][position.y-1]*piece)/Math.abs(piece):0;
    let valueNextRight= (position.y+1)<8?(board[position.x+(piece<0?1:-1)][position.y+1]*piece)/Math.abs(piece):0;
    if(valueNextLeft<0){
        let aux= transferArray(board);
        aux[position.x+(piece<0?1:-1)][position.y-1]=piece;
        aux[position.x][position.y]=0;
        possibilities[position.x+(piece<0?1:-1)][position.y-1]=!verifyCheck(aux,piece<0);
    }
    if(valueNextRight<0){
        let aux= transferArray(board);
        aux[position.x+(piece<0?1:-1)][position.y+1]=piece;
        aux[position.x][position.y]=0;
        possibilities[position.x+(piece<0?1:-1)][position.y+1]=!verifyCheck(aux,piece<0);
    }
    // validacion toma al paso
    if(position.x===(piece<0?4:3)){
        let valueLeft= (position.y-1)>=0?(board[position.x][position.y-1]*piece)/Math.abs(piece):0;
        let valueRight= (position.y+1)<8?(board[position.x][position.y+1]*piece)/Math.abs(piece):0;
        if(valueLeft===-6 && (previousBoard[piece<0?6:1][position.y-1]*piece)/Math.abs(piece)===-6 && (previousBoard[position.x][position.y-1]*piece)/Math.abs(piece)===0){
            let aux= transferArray(board);
            aux[position.x+(piece<0?1:-1)][position.y-1]=piece;
            aux[piece<0?4:3][position.y-1]=0;
            aux[position.x][position.y]=0;
            possibilities[position.x][position.y-1]=!verifyCheck(aux,piece<0);
        }
        if(valueRight===-6 && (previousBoard[piece<0?6:1][position.y+1]*piece)/Math.abs(piece)===-6 && (previousBoard[position.x][position.y+1]*piece)/Math.abs(piece)===0){
            let aux= transferArray(board);
            aux[position.x+(piece<0?1:-1)][position.y+1]=piece;
            aux[piece<0?4:3][position.y+1]=0;
            aux[position.x][position.y]=0;
            possibilities[position.x][position.y+1]=!verifyCheck(aux,piece<0);
        }
    }
    return possibilities;
}
//devuelve el tablero de posibilidades de la pieza en la posicion descrita en position redireccionando a su respectiva funcion;
const possibleMovements = (board: Array<Array<number>>,
                           previousBoard: Array<Array<number>>,
                           tower1Move: boolean,
                           kingMove: boolean,
                           tower2Move: boolean,
                           position: { x: number, y: number }): Array<Array<boolean>> => {
    let piece = board[position.x][position.y];
    let possibilities = tablePossibleMovementsBase();
    switch (Math.abs(piece)) {
        case 1:
            possibilities = moveKing(board, tower1Move, kingMove, tower2Move, position, piece, possibilities);
            break
        case 2:
            possibilities = moveTower(board, tower1Move, kingMove, tower2Move, position, piece, possibilities);
            break;
        case 3:
            possibilities = moveHorse(board, position, piece, possibilities);
            break
        case 4:
            possibilities= moveBishop(board,position,piece,possibilities);
            break
        case 5:
            possibilities= moveBishop(board,position,piece,possibilities);
            possibilities= moveTower(board, tower1Move, kingMove, tower2Move, position, piece, possibilities);
            break
        case 6:
            possibilities= movePawn(board,previousBoard,position,piece,possibilities);
            break
    }
    return possibilities;
}
//valida si el jugador tiene algun movimiento posible
const verifyCheckMate =(board: Array<Array<number>>,
                        previousBoard: Array<Array<number>>,
                        tower1Move: boolean,
                        kingMove: boolean,
                        tower2Move: boolean,
                        blackOrWhite: boolean/* false for white and true for black*/):boolean=>{
    for(let i=0;i<8;i++){
        for (let j=0;j<8;j++){
            if((blackOrWhite && board[i][j]<0)||((!blackOrWhite && board[i][j]>0))){
                let possibility=possibleMovements(board,previousBoard,tower1Move,kingMove,tower2Move,{x:i,y:j});
                if(possibility.flat().includes(true)){
                    return false;
                }
            }
        }
    }
    return true;
}
//negativo negras, positivo blancas
// 1 rey
// 2 torre
// 3 caballo
// 4 alfil
// 5 reina
// 6 peon
/*console.log(verifyCheck([
        [-2, -3, -4, -5, -1, -4, -3, -2],
        [-6, -6, -6, -6, -6, -6, -6, -6],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [2, 3, 4, 5, 1, 4, 3, 2],],
    true));*/
/*console.log(possibleMovements([
        [-2, -3, -4, -5, -1, -4, -3, -2],
        [-6, -6, -6, 0, -6, -6, -6, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, -6, 6, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [6, 6, 6, 6, 6, 0, 6, 6],
        [2, 3, 4, 5, 1, 4, 3, 2],
    ],
    [
        [-2, -3, -4, -5, -1, -4, -3, -2],
        [-6, -6, -6, 0, -6, -6, -6, -6],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, -6, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [2, 3, 4, 5, 1, 4, 3, 2],
    ],
    false,
    false,
    false,
    {x: 4, y: 4}));*/
console.log(verifyCheckMate([
        [-2, -3, -4, -5, -1, -4, -3, -2],
        [-6, -6, -6, -6, -6, -6, -6, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [6, 6, 6, 6, 6, -4, 6, 6],
        [2, 3, 4, 5, 1, 4, 3, 2],
    ],
    [
        [-2, -3, -4, -5, -1, -4, -3, -2],
        [-6, -6, -6, -6, -6, -6, -6, -6],
        [0, 0, 0, 0, 0, -5, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [6, 6, 6, 6, 6, -4, 6, 6],
        [2, 3, 4, 5, 1, 4, 3, 2],
    ],
    false,
    false,
    false,
    false));

