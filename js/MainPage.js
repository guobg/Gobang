import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    ART,
    TouchableWithoutFeedback
} from 'react-native';

const {width} = Dimensions.get('window');
const lineCount = 15;
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
            whiteChess: [],
            isBlack: true
        };
    }

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

    hasChess = (position) => {
        let flag = false;
        this.state.blackChess.some((chess) => {
            if (chess.join(',') === position) {
                flag = true;
                return true;
            }
        });

        this.state.whiteChess.some((chess) => {
            if (chess.join(',') === position) {
                flag = true;
                return true;
            }
        });

        return flag;
    };

    handleChess = (event) => {
        let tempChess = this.state.isBlack ? this.state.blackChess : this.state.whiteChess;
        const x = Math.floor(event.nativeEvent.locationX / unitWidth);
        const y = Math.floor(event.nativeEvent.locationY / unitWidth);
        if (this.hasChess([x, y].join(','))) {
            return;
        }
        tempChess.push([x, y]);

        this.state.isBlack ?
            this.setState({
                blackChess: tempChess
            }) : this.setState({
                whiteChess: tempChess
            });

        this.setState({
            isBlack: !this.state.isBlack
        })
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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    canvasPanel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    }
});