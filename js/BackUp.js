import React, {Component} from 'react';
import Canvas from 'react-native-canvas';
import {
    Dimensions,
    StyleSheet,
    View
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class MainPage extends Component {

    handleCanvas = (canvas) => {
        const unitWidth = Math.floor((width - 50) / 15);
        let panelSize = unitWidth * 15 + 30;
        canvas.width = panelSize;
        canvas.height = panelSize;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = "#bfbfbf";
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i <= 15; i++) {
            ctx.moveTo(15 + i * unitWidth, 15);
            ctx.lineTo(15 + i * unitWidth, panelSize - 15);
            ctx.stroke();
            ctx.moveTo(15, 15 + i * unitWidth);
            ctx.lineTo(panelSize - 15, 15 + i * unitWidth);
            ctx.stroke();
        }
    };

    render() {
        return (
            <View style={styles.canvasPanel}>
                <Canvas ref={this.handleCanvas}/>
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