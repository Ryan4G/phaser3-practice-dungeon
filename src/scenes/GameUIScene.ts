import Phaser from 'phaser';
import { sceneEvents } from "../events/EventCollection";
import { EVENT_WARRIOR_OPEN_CHEST } from "../symbols/GameSymbols";

export default class GameUIScene extends Phaser.Scene{

    private _coins: number = 0;
    private _coinText?: Phaser.GameObjects.Text;
    private _tweenCoins?: Phaser.Tweens.Tween;

    constructor(){
        super('GameUIScene');
    }

    create(){
        this._coinText = this.add.text(20, 20, 'Coins: 0', {
            color: '#fff',
            fontStyle: 'bolder'
        });
        
        this.sound.play('bgm', {
            volume: 0.2,
            loop: true
        });
        
        sceneEvents.on(EVENT_WARRIOR_OPEN_CHEST, this.handleWarriorOpenChest, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off(EVENT_WARRIOR_OPEN_CHEST, this.handleWarriorOpenChest);
        });    
    }

    update(){
        if (this._tweenCoins && this._tweenCoins.isPlaying && this._coinText){
            let coins = Math.floor(this._tweenCoins.getValue());
            this._coinText.text = `Coins: ${coins}`;
        }
    }

    private handleWarriorOpenChest(coins: number){
        if (!this._coinText || this._coins === coins){
            return;
        }

        this._tweenCoins = this.tweens.addCounter({
            from: this._coins,
            to: coins,
            duration: 1000,
            onComplete: () => {
                this._coins = coins;
            }
        });
    }
}