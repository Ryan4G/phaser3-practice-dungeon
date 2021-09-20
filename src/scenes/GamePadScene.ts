import Phaser from 'phaser';
import { IInputPad } from '../interfaces/IInputPad';
import GameScene from './GameScene';

export default class GamePadScene extends Phaser.Scene {

    private gamePad?: Phaser.GameObjects.Image;
    private drugBtn?: Phaser.GameObjects.Image;
    private aBtn?: Phaser.GameObjects.Image;

    private gameScene?: GameScene;

    private _mobilePad: IInputPad;

    private spaceJustDown: boolean = false;

    constructor() {
        super('GamePadScene');
        this._mobilePad = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false
        }
    }

    preload() {
        this.load.spritesheet("touch", "assets/sprites/touch.png", { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.input.addPointer(2);

        this.gameScene = this.scene.get('GameScene') as GameScene;

        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.aBtn = this.add.image(gameWidth - 110, gameHeight - 80, "touch", 2);
        this.aBtn.setInteractive();

        this.gamePad = this.add.image(90, gameHeight - 80, "touch", 0);

        this.drugBtn = this.add.image(this.gamePad.x, this.gamePad.y, "touch", 1);
        this.drugBtn.setInteractive({ draggable: true });

        this.drugBtn.on(Phaser.Input.Events.DRAG, this._dragUpdate, this);
        this.drugBtn.on(Phaser.Input.Events.DRAG_END, this._dragStop, this);

        this.aBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.spaceJustDown) {
                return;
            }
            this.spaceJustDown = true;
            this._mobilePad.space = true;
            this.gameScene?.setInputPad(this._mobilePad);

        }, this);

        this.aBtn.on(Phaser.Input.Events.POINTER_UP, () => {

            if (this.spaceJustDown) {
                this.spaceJustDown = false;
            }

            this._mobilePad.space = false;
            this.gameScene?.setInputPad(this._mobilePad);
        }, this);

    }

    private _dragUpdate(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        if (!this.gamePad || !this.drugBtn) {
            return;
        }

        let x: number = dragX - this.gamePad!.x;
        let y: number = dragY - this.gamePad!.y;

        let d = Math.sqrt(x * x + y * y);
        if (d > 30) {
            d = 30;
        }

        let r = Math.atan2(y, x);

        this.drugBtn?.setPosition(this.gamePad.x + Math.cos(r) * d, this.gamePad.y + Math.sin(r) * d);

        this._mobilePad.left = ((this.drugBtn.x - this.gamePad.x) < 0 && Math.abs(this.drugBtn.y - this.gamePad.y) < d * 0.7);
        this._mobilePad.right = ((this.drugBtn.x - this.gamePad.x) > 0 && Math.abs(this.drugBtn.y - this.gamePad.y) < d * 0.7);
        this._mobilePad.up = ((this.drugBtn.y - this.gamePad.y) < 0 && Math.abs(this.drugBtn.x - this.gamePad.x) < d * 0.7);
        this._mobilePad.down = ((this.drugBtn.y - this.gamePad.y) > 0 && Math.abs(this.drugBtn.x - this.gamePad.x) < d * 0.7);
        this.gameScene?.setInputPad(this._mobilePad);
    };

    private _dragStop(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        if (!this.gamePad || !this.drugBtn) {
            return;
        }
        this.drugBtn?.setPosition(this.gamePad.x, this.gamePad.y);
        this._mobilePad.left = false;
        this._mobilePad.right = false;
        this._mobilePad.up = false;
        this._mobilePad.down = false;

        this.gameScene?.setInputPad(this._mobilePad);

    };
}
