import Phaser from "phaser";

import {Direction, HealthState} from '../enums/gameEnums';

declare global{
    namespace Phaser.GameObjects{
        interface GameObjectFactory{
            /**
             * 
             * @param x The horizontal position of this Game Object in the world.
             * @param y The vertical position of this Game Object in the world.
             * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
             * @param frame An optional frame from the Texture this Game Object is rendering with.
             */
            warrior(x: number, y: number, textrue: string | Phaser.Textures.Texture, frame?: string | number) : Warrior;
        }
    }
}


export default class Warrior extends Phaser.Physics.Arcade.Sprite{
    
    private parentScene: Phaser.Scene;
    private healthState: HealthState = HealthState.NORMAL;
    private _healthPoints: number = 100;
    private healthPointGraphic?: Phaser.GameObjects.Graphics;
    private healthPointGemos?: Array<Phaser.Geom.Rectangle>;
    private _weaponInHand?: Phaser.Physics.Arcade.Sprite;
    private currDirection: Direction = Direction.DOWN;
    private _weaponAttact: Boolean = false;

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

        this.anims.play('warrior-run-idle');
    }

    get weaponInHand(){

        if (!this.body){
            return;
        }

        if (!this._weaponInHand){
            this._weaponInHand = this.parentScene.physics.add.sprite(this.x, this.y, 'weapon', 'Sword_Down_0.png');
            this._weaponInHand.body.setSize(this.body.width, this.body.height);
        }
        
        return this._weaponInHand;
    }

    get healthPoints(){
        return this._healthPoints;
    }

    get weaponAttact(){
        return this._weaponAttact;
    }

    preUpdate(time: number, delta: number){
        super.preUpdate(time, delta);
        
        this.updateHealthPoints();
        this.updateWeaponInHand();
    }

    update(cursor?: Phaser.Types.Input.Keyboard.CursorKeys){

        if (!cursor || this._weaponAttact || this.healthState !== HealthState.NORMAL){
            return;
        }

        let speed = 100;
        
        if (cursor.up.isDown){
            this.currDirection = Direction.UP;
            
            this.play('warrior-run-up', true);

            this.setVelocity(0, -speed);
        }
        else if (cursor.down.isDown){
            this.currDirection = Direction.DOWN;
            
            this.play('warrior-run-down', true);
            
            this.setVelocity(0, speed);
        }
        else if (cursor.left.isDown){
            this.currDirection = Direction.LEFT;
            
            this.play('warrior-run-left', true);

            this.setVelocity(-speed, 0);
        }
        else if (cursor.right.isDown){
            this.currDirection = Direction.RIGHT;
            
            
            this.play('warrior-run-right', true);

            this.setVelocity(speed, 0);
        }
        else{
            if (this.anims.currentAnim) {
                // stop on the first frame
                const currAnimFirstFrame = this.anims.currentAnim.frames[0];
                this.anims.pause(currAnimFirstFrame);
            }

            this.setVelocity(0, 0);
        }
    }

    handleCollisionDamage(vetor: Phaser.Math.Vector2){
        if (this.healthState !== HealthState.NORMAL || this._healthPoints <= 0){
            return;
        }

        this._healthPoints -= 20;

        if (this._healthPoints <= 0){
            this.healthState = HealthState.DEAD;
            this.setVelocity(0, 0);
        }
        else{   
            this.healthState = HealthState.DAMAGE;

            let vet = vetor.normalize().scale(100);
            this.setVelocity(vetor.x, vetor.y);
            this.setTint(0xff0000);
        }

        this.parentScene.time.delayedCall(400, ()=>{
            if (this.healthState === HealthState.DAMAGE){
                this.healthState = HealthState.NORMAL;
                this.clearTint();
            }
            else{
                this.healthPointGraphic?.setVisible(false);
                this.setActive(false);
                this.setVelocity(0, 0);
            }
        });
    }

    setWeaponAttact(val: boolean){
        this._weaponAttact = val;

        if (!this._weaponInHand || this.healthState === HealthState.DEAD){
            return;
        }

        let bodySetting = {
            offset : {
                x: 24,
                y: 24,
                distanceX: 10,
                distanceY: 10
            },
            width: this.body.width,
            height: this.body.height,
        };

        if (val){


            bodySetting.offset.distanceX -= 2;
            bodySetting.offset.distanceY -= 1;
            bodySetting.width += 6;

            switch(this.currDirection){
                case Direction.LEFT:{
                    this.anims.play('warrior-slash-left');
                    this._weaponInHand.anims.play('weapon-left');

                    bodySetting.offset.x -= bodySetting.offset.distanceX;
                    bodySetting.offset.y -= bodySetting.offset.distanceY;

                    break;
                }
                case Direction.RIGHT:{
                    this.anims.play('warrior-slash-right');
                    this._weaponInHand?.anims.play('weapon-right');

                    bodySetting.offset.x += bodySetting.offset.distanceX;
                    bodySetting.offset.y += bodySetting.offset.distanceY;
                    break;
                }
                case Direction.UP:{
                    this.anims.play('warrior-slash-up');
                    this._weaponInHand?.anims.play('weapon-up');

                    bodySetting.offset.distanceX -= 3;

                    bodySetting.offset.x += bodySetting.offset.distanceX;
                    bodySetting.offset.y -= bodySetting.offset.distanceY;

                    break;
                }
                case Direction.DOWN:{
                    this.anims.play('warrior-slash-down');
                    this._weaponInHand?.anims.play('weapon-down');

                    bodySetting.offset.x -= bodySetting.offset.distanceX;
                    bodySetting.offset.y += bodySetting.offset.distanceY;

                    break;
                }
            }
        }

        this._weaponInHand.body.setSize(bodySetting.width, bodySetting.height);
        this._weaponInHand.body.setOffset(bodySetting.offset.x, bodySetting.offset.y);

        this.parentScene.time.delayedCall(300, ()=>{
            this._weaponAttact = false;
            const weaponFirstFrame = this._weaponInHand?.anims.currentAnim.frames;
            if (weaponFirstFrame){
                this._weaponInHand?.anims.pause(weaponFirstFrame[0])
            }
            this.resetWeaponOffset();
        });
    }

    private updateHealthPoints(){
        if (!this.body || (this.healthPointGraphic && !this.healthPointGraphic.visible)){
            return;
        }

        if (!this.healthPointGraphic){
            this.healthPointGraphic = this.parentScene.add.graphics({ 
                x: this.x - this.body.width * 0.5,
                y: this.y - this.body.height * 0.6,
                lineStyle: { width: 1, color: 0x000000 },
                fillStyle: { color: 0xff0000 } 
            });

            this.healthPointGemos = new Array<Phaser.Geom.Rectangle>();
            this.healthPointGemos?.push(new Phaser.Geom.Rectangle());
            this.healthPointGemos?.push(new Phaser.Geom.Rectangle());
        }
        else{
            this.healthPointGraphic.clear();
            
            this.healthPointGraphic.setPosition(
                this.x - this.body.width * 0.5,
                this.y - this.body.height * 0.6);
        }

        const rectFill = this.healthPointGemos![0];
        const rectStroke = this.healthPointGemos![1];

        rectFill.width = this.body.width * (this._healthPoints / 100);
        rectStroke.width = this.body.width;
        rectStroke.height = rectFill.height = 2;

        this.healthPointGraphic.strokeRectShape(rectStroke);
        this.healthPointGraphic.fillRectShape(rectFill);
    }

    private updateWeaponInHand(){
        if (!this.weaponInHand || !this._weaponInHand){
            return;
        }

        if (this._weaponAttact){
           
        }

        this._weaponInHand.x = this.x;
        this._weaponInHand.y = this.y;
    }

    private resetWeaponOffset(){
        
        if (!this._weaponInHand){
            return;
        }

        let bodySetting = {
            offset : {
                x: 24,
                y: 24,
                distanceX: 10,
                distanceY: 10
            },
            width: this.body.width,
            height: this.body.height,
        };

        this._weaponInHand.body.setSize(bodySetting.width, bodySetting.height);
        this._weaponInHand.body.setOffset(bodySetting.offset.x, bodySetting.offset.y);
    }
}

Phaser.GameObjects.GameObjectFactory.register('warrior', function(
    this:Phaser.GameObjects.GameObjectFactory, 
    x: number, 
    y: number, 
    textrue: string | Phaser.Textures.Texture, 
    frame?: string | number){
        let sprite = new Warrior(this.scene, x, y, textrue, frame);

        this.displayList.add(sprite);
        this.updateList.add(sprite);

        this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.7);
        sprite.body.setOffset(8, 8);

        return sprite;
});