import Phaser, { Scene } from "phaser";
import {Direction, HealthState} from '../enums/GameEnums';

const getRandomDirection = (exclude: Direction) => {

    let nextDirection = Phaser.Math.Between(Direction.UP, Direction.RIGHT);

    while(nextDirection === exclude){
        nextDirection = Phaser.Math.Between(Direction.UP, Direction.RIGHT);
    }

    return nextDirection;
};

export default class BigDemon extends Phaser.Physics.Arcade.Sprite{
    private currDirection: Direction = Direction.UP;
    private healthState: HealthState = HealthState.NORMAL;
    private moveEvent : Phaser.Time.TimerEvent;
    private parentScene: Phaser.Scene;
    private hitCount: number = 3;
    private healthPointGraphic?: Phaser.GameObjects.Graphics;
    private healthPointGemos?: Array<Phaser.Geom.Rectangle>;

    constructor(scene: Phaser.Scene, x: number, y: number, textrue: string | Phaser.Textures.Texture, frame?: string | number){
        super(scene, x, y, textrue, frame);
        
        this.parentScene = scene;

        this.setScale(0.6);

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollide, this);

        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.currDirection = getRandomDirection(this.currDirection);
            },
            loop: true
        });
    }

    preUpdate(time: number, delta: number){
        super.preUpdate(time, delta);

        if (this.healthState === HealthState.DEAD){
            this.setVelocity(0, 0);
            return;
        }

        const speed = 50;

        this.anims.play('bigDemon-run', true);

        switch(this.currDirection){
            case Direction.UP:{
                this.setVelocity(0, -speed);
                break;
            }
            case Direction.DOWN:{
                this.setVelocity(0, speed);
                break;
            }
            case Direction.LEFT:{
                this.setVelocity(-speed, 0);
                break;
            }
            case Direction.RIGHT:{
                this.setVelocity(speed, 0);
                break;
            }
            default:{
                break;
            }
        }

        this.updateHealthPoints();
    }

    destroy(fromScene: boolean | undefined = false){
        this.moveEvent.destroy();

        super.destroy(fromScene);
    }

    handleCollisionDamage(vetor: Phaser.Math.Vector2){
        if (this.healthState !== HealthState.NORMAL){
            return;
        }

        let vet = vetor.normalize().scale(100);
        this.healthState = HealthState.DAMAGE;

        this.setVelocity(vetor.x, vetor.y);
        this.setTint(0xff0000);

        this.hitCount--;

        if (this.hitCount <= 0){
            this.healthState = HealthState.DEAD;
            this.parentScene.sound.play('demon_death');
        }
        else{
            this.parentScene.sound.play('demon_hurt');
        }

        this.parentScene.time.delayedCall(300, ()=>{

            if (this.healthState == HealthState.DAMAGE){
                this.healthState = HealthState.NORMAL;
                this.clearTint();
            }
            else{
                this.healthPointGraphic?.setVisible(false);
                this.destroy();
            }
        });
    }

    private handleTileCollide(gameObject: Phaser.GameObjects.Sprite, tile: Phaser.Tilemaps.Tile){
        if (gameObject !== this){
            return;
        }

        this.currDirection = getRandomDirection(this.currDirection);
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

        rectFill.width = this.body.width * (this.hitCount / 3);
        rectStroke.width = this.body.width;
        rectStroke.height = rectFill.height = 2;

        this.healthPointGraphic.strokeRectShape(rectStroke);
        this.healthPointGraphic.fillRectShape(rectFill);
    }
}