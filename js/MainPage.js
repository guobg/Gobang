import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    ART,
    TouchableWithoutFeedback,
    Alert,
    TouchableOpacity,
    Text
} from 'react-native';
import {lineCount} from './BasicData';
import {wins, winCount} from './Wins';

const {width} = Dimensions.get('window');
const unitWidth = Math.floor((width - 10) / (lineCount * 2)) * 2;
const panelSize = unitWidth * lineCount + unitWidth;
const pieceSize = Math.floor(unitWidth * 0.9);
const pieceRadius = Math.floor(pieceSize / 2);
const margin = unitWidth / 2;

const path = ART.Path();

for (let i = 0; i <= lineCount; i++) {
    path.moveTo(margin + i * unitWidth, margin);
    path.lineTo(margin + i * unitWidth, panelSize - margin);
    path.moveTo(margin, margin + i * unitWidth);
    path.lineTo(panelSize - margin, margin + i * unitWidth);
}

export default class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blackChess: [],
            whiteChess: []
        };
        this.initData();
    }

    initData = () => {
        this.isBlack = true;
        this.isOver = false;
        this.myWin = [];
        this.computerWin = [];
        this.chessBoard = [];
        for (let i = 0; i < winCount; i++) {
            this.myWin[i] = 0;
            this.computerWin[i] = 0;
        }

        for (let i = 0; i < lineCount; i++) {
            this.chessBoard[i] = [];
            for (let j = 0; j < lineCount; j++) {
                this.chessBoard[i][j] = 0;
            }
        }
    };

    getChess = (chessArray) => {
        const chess = ART.Path();
        chessArray.map((item) => {
            chess.moveTo(margin + item[0] * unitWidth, margin + item[1] * unitWidth - pieceRadius);
            chess.arc(0, pieceSize, pieceRadius);
            chess.arc(0, -pieceSize, pieceRadius);
            chess.close();
        });
        return chess;
    };

    handleChess = (event) => {
        if (this.isOver || !this.isBlack) return;
        let tempChess = this.state.blackChess;
        const x = Math.floor(event.nativeEvent.locationX / unitWidth);
        const y = Math.floor(event.nativeEvent.locationY / unitWidth);
        if (this.chessBoard[x][y] === 2) {
            return;
        }
        tempChess.push([x, y]);
        this.chessBoard[x][y] = 2;
        this.setState({
            blackChess: tempChess
        });

        for (let i = 0; i < winCount; i++) {
            if (wins[x][y][i]) {
                this.myWin[i]++;
                this.computerWin[i] = 6;
                if (this.myWin[i] === 5) {
                    Alert.alert('Black Win');
                    this.isOver = true;
                }
            }
        }

        if (!this.isOver) {
            this.isBlack = !this.isBlack;
            this.computerAI();
        }
    };

    computerAI = () => {
        let myScore = [];
        let computerScore = [];
        let max = 0;
        let u = 0, v = 0;
        for (let i = 0; i < lineCount; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (let j = 0; j < lineCount; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        for (let i = 0; i < lineCount; i++) {
            for (let j = 0; j < lineCount; j++) {
                if (this.chessBoard[i][j] === 0) {
                    for (let k = 0; k < winCount; k++) {
                        if (wins[i][j][k]) {
                            if (this.myWin[k] === 1) {
                                myScore[i][j] += 200;
                            } else if (this.myWin[k] === 2) {
                                myScore[i][j] += 400;
                            } else if (this.myWin[k] === 3) {
                                myScore[i][j] += 2000;
                            } else if (this.myWin[k] === 4) {
                                myScore[i][j] += 10000;
                            }

                            if (this.computerWin[k] === 1) {
                                computerScore[i][j] += 220;
                            } else if (this.computerWin[k] === 2) {
                                computerScore[i][j] += 420;
                            } else if (this.computerWin[k] === 3) {
                                computerScore[i][j] += 2100;
                            } else if (this.computerWin[k] === 4) {
                                computerScore[i][j] += 20000;
                            }
                        }
                    }
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] === max) {
                        if (computerScore[i][j] > computerScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }

                    if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    } else if (computerScore[i][j] === max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }

        let tempChess = this.state.whiteChess;
        tempChess.push([u, v]);
        this.chessBoard[u][v] = 2;
        this.setState({
            whiteChess: tempChess
        });
        for (let i = 0; i < winCount; i++) {
            if (wins[u][v][i]) {
                this.computerWin[i]++;
                this.myWin[i] = 6;
                if (this.computerWin[i] === 5) {
                    Alert.alert('White Win');
                    this.isOver = true;
                }
            }
        }

        if (!this.isOver) {
            this.isBlack = !this.isBlack;
        }
    };

    _reset = () => {
        this.setState({
            blackChess: [],
            whiteChess: []
        });
        this.initData();
    };

    render() {
        const {blackChess, whiteChess} = this.state;

        const allBlackChess = this.getChess(blackChess);
        const allWhiteChess = this.getChess(whiteChess);

        return (
            <View style={styles.canvasPanel}>
                <TouchableWithoutFeedback onPress={(event) => this.handleChess(event)}>
                    <View>
                        <ART.Surface width={panelSize} height={panelSize}>
                            <ART.Shape d={path} stroke="#bfbfbf" strokeWidth={1}/>
                            <ART.Shape d={allBlackChess} stroke="#bfbfbf" fill="#000000" strokeWidth={1}/>
                            <ART.Shape d={allWhiteChess} stroke="#bfbfbf" fill="#ffffff" strokeWidth={1}/>
                        </ART.Surface>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                        this._reset();
                    }}
                >
                    <Text style={styles.resetText}>重 置</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    canvasPanel: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    resetButton: {
        backgroundColor: '#df3939',
        height: 30,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 50
    },
    resetText: {
        color: '#ffffff',
        fontSize: 17
    },
});