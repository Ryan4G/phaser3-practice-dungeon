import Phaser from 'phaser';
import { sceneEvents } from '../events/EventCollection';

export default class GameUIScene extends Phaser.Scene{
    constructor(){
        super('GameUIScene');
    }

    create(){
        this.add.text(20, 20, 'Coins: 0', {
            color: '#fff',
            fontStyle: 'bolder'
        });
    }
}