class TicTacToe {
    constructor(level, mode) {
      this.level = level;
      this.mode = mode;
      this.depth = 9;
      if (this.level === 2) {
        this.depth = 5;
      } else if (this.level === 1) {
        this.depth = 2;
      }
      this.dp=new Map();
    }
  
    findMove(yourBit, opponentBit, moveCount) {
      let ans = -1000000009;
      let move = -1;
      console.log(yourBit,opponentBit,moveCount)
      for (let i = 0; i < 9; i++) {
        if (((yourBit >> i) & 1) === 0 && ((opponentBit >> i) & 1) === 0) {
          let mx = this.bestMove(yourBit, opponentBit | (1 << i), moveCount - 1, 1, this.depth);
          console.log(mx,i);
          if (mx > ans) {
            move = i;
            ans = mx;
          }
        }
      }
      console.log(move);
      opponentBit |= 1 << move;
      return opponentBit;
    }
  
    bestMove(yourBit, opponentBit, moveCount, turn, depth) {
      let win = this.WhoWin(yourBit, opponentBit);
      if (win[0] === 1) {
        return -(moveCount+1);
      } else if (win[0] === -1) {
        return (moveCount+1);
      } else if (moveCount === 0 || depth === 0) {
        return 0;
      } else if (this.dp.has([yourBit, opponentBit, turn, depth].join(","))) {
        return this.dp.get([yourBit, opponentBit, turn, depth].join(","));
      } else {
        let ans = 1e9;
        if(turn==0){
            ans=-1e9;
        }
        for (let i = 0; i < 9; i++) {
          if (((yourBit >> i) & 1) === 0 && ((opponentBit >> i) & 1) === 0) {
            if (turn === 1) {
              ans = Math.min(ans,this.bestMove(yourBit | (1 << i), opponentBit, moveCount - 1, 1 - turn, depth - 1));
            } else {
              ans = Math.max(ans, this.bestMove(yourBit, opponentBit | (1 << i), moveCount - 1, 1 - turn, depth - 1));
            }
          }
        }
        this.dp.set([yourBit, opponentBit, turn, depth].join(","),ans);
        return ans;
      }
    }
  
    WhoWin(yourBit, opponentBit) {
      let value = this.isWinning(yourBit);
      if (value.length !== 0) {
        return [1, value];
      }
      value = this.isWinning(opponentBit);
      if (value.length !== 0) {
        return [-1, value];
      }
      return [0, []];
    }
  
    isWinning(bit) {
      for (let i = 0; i < 3; i++) {
        let j = 0;
        for (; j < 3; j++) {
          let k = 3 * i + j;
          if (((bit >> k) & 1) === 0) {
            break;
          }
        }
        if (j === 3) {
          return [3 * i, 3 * i + 1, 3 * i + 2];
        }
      }
      for (let i = 0; i < 3; i++) {
        let j = 0;
        let k = i;
        for (; j < 3; j++) {
          if (((bit >> k) & 1) === 0) {
            break;
          }
          k += 3;
        }
        if (j === 3) {
          return [i, i + 3, i + 6];
        }
      }
      let j = 0;
      for (let val of [0, 4, 8]) {
        if (((bit >> val) & 1) === 0) {
          break;
        }
        j += 1;
      }
      if (j === 3) {
        return [0, 4, 8];
      }
      j = 0;
      for (let val of [2, 4, 6]) {
        if (((bit >> val) & 1) === 0) {
          break;
        }
        j += 1;
      }
      if (j === 3) {
        return [2, 4, 6];
      }
      return [];
    }
  }

export {TicTacToe};