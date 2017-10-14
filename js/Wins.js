import {lineCount} from './BasicData';

let wins = [];
let winCount = 0;
for (let i = 0; i < lineCount; i++) {
    wins[i] = [];
    for (let j = 0; j < lineCount; j++) {
        wins[i][j] = [];
    }
}

for (let i = 0; i < lineCount; i++) {
    for (let j = 0; j < lineCount - 4; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i][j + k][winCount] = true;
        }
        winCount++;
    }
}

for (let i = 0; i < lineCount; i++) {
    for (let j = 0; j < lineCount - 4; j++) {
        for (let k = 0; k < 5; k++) {
            wins[j + k][i][winCount] = true;
        }
        winCount++;
    }
}

for (let i = 0; i < lineCount - 4; i++) {
    for (let j = 0; j < lineCount - 4; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j + k][winCount] = true;
        }
        winCount++;
    }
}

for (let i = 0; i < lineCount - 4; i++) {
    for (let j = lineCount - 1; j > 3; j--) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j - k][winCount] = true;
        }
        winCount++;
    }
}

export {wins, winCount};

