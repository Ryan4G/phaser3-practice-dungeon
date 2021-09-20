import Phaser from 'phaser';
import { sceneEvents } from "../events/EventCollection";
import { EVENT_WARRIOR_DEAD, EVENT_WARRIOR_KIIL_MONSTER, EVENT_WARRIOR_OPEN_CHEST } from "../symbols/GameSymbols";

export default class GameUIScene extends Phaser.Scene{

    private _coins: number = 0;
    private _coinsText?: Phaser.GameObjects.Text;
    private _monstersText?: Phaser.GameObjects.Text;
    private _noticeText?: Phaser.GameObjects.Text;
    private _tweenCoins?: Phaser.Tweens.Tween;

    constructor(){
        super('GameUIScene');
    }

    create(){
        this._coinsText = this.add.text(20, 20, 'Coins: 0', {
            color: '#fff',
            fontStyle: 'bolder'
        });

        this._monstersText = this.add.text(20, 40, 'Monsters: ?', {
            color: '#fff',
            fontStyle: 'bolder'
        });

        this._noticeText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, '', {
            color: '#000',
            fontSize: '48px',
            fontStyle: 'bolder'
        }).setOrigin(0.5).setVisible(false);

        this.sound.play('bgm', {
            volume: 0.3,
            loop: true
        });
        
        sceneEvents.on(EVENT_WARRIOR_OPEN_CHEST, this.handleWarriorOpenChest, this);
        sceneEvents.on(EVENT_WARRIOR_KIIL_MONSTER, (monsters: number)=>{
            if (!this._monstersText){
                return;
            }

            this._monstersText.text = `Monsters: ${monsters}`;

            if (monsters <= 0 && this._noticeText){
                this._noticeText.text = 'Level Completed!';
                this._noticeText.setVisible(true);
            }

        }, this);

        sceneEvents.on(EVENT_WARRIOR_DEAD, (monsters: number)=>{
            if (!this._noticeText){
                return;
            }
            
            this._noticeText.text = `You Dead!`;
            this._noticeText.setVisible(true);
        }, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off(EVENT_WARRIOR_OPEN_CHEST, this.handleWarriorOpenChest);
            sceneEvents.off(EVENT_WARRIOR_KIIL_MONSTER);
            sceneEvents.off(EVENT_WARRIOR_DEAD);
        });    
    }

    update(){
        if (this._tweenCoins && this._tweenCoins.isPlaying && this._coinsText){
            let coins = Math.floor(this._tweenCoins.getValue());
            this._coinsText.text = `Coins: ${coins}`;
        }
    }

    private handleWarriorOpenChest(coins: number){
        if (!this._coinsText || this._coins === coins){
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