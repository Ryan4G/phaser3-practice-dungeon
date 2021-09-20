import Phaser, { Physics } from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite{
    private parentScene: Phaser.Scene;
    private _hasOpened: boolean = false;
    /**
     * 
     * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
     * @param x The horizontal position of this Game Object in the world.
     * @param y The vertical position of this Game Object in the world.
     * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param frame An optional frame from the Texture this Game Object is rendering with.
     */
     constructor(scene: Phaser.Scene, x: number, y: number, textrue: string | Phaser.Textures.Texture, frame?: string | number){
        super(scene, x, y, textrue, frame);

        this.parentScene = scene;

        this.anims.play('chest-close');
    }

    get coins(): number{
        let conis = 0;

        if (!this._hasOpened){
            this.parentScene.sound.play('open_chest');
            this.anims.play('chest-open');
            conis = Phaser.Math.Between(60, 300);
            this._hasOpened = true;
        }

        return conis;
    }

    get hasOpened(){
        return this._hasOpened;
    }
}