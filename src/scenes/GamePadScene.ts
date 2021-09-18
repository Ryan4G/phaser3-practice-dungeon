import Phaser from 'phaser';

export default class GamePadScene extends Phaser.Scene {

    private player?: Phaser.GameObjects.Sprite;
    private gamePad?: Phaser.GameObjects.Sprite;
    private btn?: Phaser.GameObjects.Sprite;

    constructor() {
        super('GamePadScene');
    }

    preload() {
        this.load.spritesheet("touch", "assets/sprites/touch.png", { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.input.addPointer();

        this.player = this.add.sprite(300, 180, "touch", 2);
        this.gamePad = this.add.sprite(100, 260, "touch", 0);

        this.btn = this.add.sprite(this.gamePad.x, this.gamePad.y, "touch", 1);
        this.btn.setOrigin();
        this.btn.setInteractive({ draggable: true });

        this.btn.on('drag', this._dragUpdate, this);
        this.btn.on('dragend', this._dragStop, this);
    }

    update() {
        if (!this.player || !this.btn) {
            return;
        }

        let x = this.player.x + (this.btn.x - this.gamePad!.x) / 10;
        let y = this.player.y + (this.btn.y - this.gamePad!.y) / 10;

        this.player.setPosition(x, y);
    }

    private _dragUpdate(pointer: Phaser.Input.Pointer,
        dragX: number,
        dragY: number) {

        let x: number = dragX - this.gamePad!.x;
        let y: number = dragY - this.gamePad!.y;

        let d = Math.sqrt(x * x + y * y);
        if (d > 30) {
            d = 30;
        }


        let r = Math.atan2(y, x);

        this.btn?.setPosition(this.gamePad!.x + Math.cos(r) * d, this.gamePad!.y + Math.sin(r) * d);
    };

    private _dragStop(pointer: Phaser.Input.Pointer,
        dragX: number,
        dragY: number) {
        this.btn?.setPosition(this.gamePad?.x, this.gamePad?.y);
    };
}
