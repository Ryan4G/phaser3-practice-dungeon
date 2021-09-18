import Phaser, { Physics } from 'phaser';
import { createWorriorAnims } from '../anims/worriorAnims';
import { createBigDemonAnims } from '../anims/bigDemonAnims';
import { createWeaponAnims } from '../anims/weaponAnimas';
import { debugLayer } from '../tools/debug';
import BigDemon from '../sprites/bigDemon';
import '../sprites/warrior';
import Warrior from '../sprites/warrior';
import { sceneEvents } from '../events/EventCollection';


export default class GameScene extends Phaser.Scene {

    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    private warrior?:  Warrior;
    private warriorDemonCollideEvent?: Phaser.Physics.Arcade.Collider;
    constructor() {
        super('GameScene');
    }

    preload() {
        
    }

    create() {
        this.scene.run('GameUIScene');

        createWorriorAnims(this.anims);
        createBigDemonAnims(this.anims);
        createWeaponAnims(this.anims);

        const map = this.make.tilemap({ key: 'dungeon' });

        const tileSet = map.addTilesetImage('dungeon_16x16', 'tiles', 16, 16, 1, 2);

        map.createLayer('Ground', tileSet);
        const wallsLayer = map.createLayer('Walls', tileSet);

        wallsLayer.setCollisionByProperty({ collide: true });

       if (this.game.config.physics.arcade?.debug){
            debugLayer(wallsLayer, this);
        }

        this.warrior = this.add.warrior(300, 180, 'charecter');


        const demonGroup = this.physics.add.group({
            classType: BigDemon,
            createCallback: (it) =>{
                let demon = it as BigDemon;
                demon.body.onCollide = true;
                demon.body.setSize(demon.width * 0.8, demon.height);
                demon.body.setOffset(4, 4);
            }
        })

        demonGroup.get(320, 180, 'enemy');

        this.physics.add.collider(this.warrior, wallsLayer);
        this.physics.add.collider(demonGroup, wallsLayer);
        this.warriorDemonCollideEvent = this.physics.add.collider(this.warrior, demonGroup, this.handleWarriorDemonsCollision, undefined, this);
        this.physics.add.collider(this.warrior.weaponInHand!, demonGroup, this.handleWeaponDemonsCollistion, undefined, this);

        this.cursor = this.input.keyboard.createCursorKeys();

        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.warrior);

        this.input.keyboard.on('keydown-SPACE', ()=>{
            this.warrior?.setWeaponAttact(true);
        });
    }

    update() {
        if (this.warrior){
            this.warrior.update(this.cursor);
        }
    }

    private handleWarriorDemonsCollision(warrior: Phaser.Types.Physics.Arcade.GameObjectWithBody, demon: Phaser.Types.Physics.Arcade.GameObjectWithBody):void{
        const theDemon = demon as BigDemon;
        const theWarrior = warrior as Warrior;

        const vet = new Phaser.Math.Vector2(theWarrior.x - theDemon.x, theWarrior.y - theDemon.y);

        theWarrior.handleCollisionDamage(vet);

        if (theWarrior.healthPoints <= 0){
            this.warriorDemonCollideEvent?.destroy();
        }

        // const vet2 = new Phaser.Math.Vector2(theDemon.x - theWarrior.x, theDemon.y - theWarrior.y);

        // theDemon.handleCollisionDamage(vet);
    }

    private handleWeaponDemonsCollistion(weapon: Phaser.Types.Physics.Arcade.GameObjectWithBody, demon: Phaser.Types.Physics.Arcade.GameObjectWithBody):void{
        const theDemon = demon as BigDemon;
        const theWeapon = weapon as Phaser.Physics.Arcade.Sprite;

        if (!this.warrior?.weaponAttact){
            return;
        }
        
        const vet = new Phaser.Math.Vector2(theDemon.x - theWeapon.x, theDemon.y - theWeapon.y);

        theDemon.handleCollisionDamage(vet);
    }
}
