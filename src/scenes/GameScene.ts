import Phaser, { Physics } from 'phaser';
import { createWarriorAnims } from '../anims/WarriorAnims';
import { createBigDemonAnims } from '../anims/BigDemonAnims';
import { createWeaponAnims } from '../anims/WeaponAnims';
import { createChestAnims } from '../anims/ChestAnims';
import { debugLayer } from '../tools/debug';
import BigDemon from '../sprites/BigDemon';
import '../sprites/Warrior';
import { sceneEvents } from '../events/EventCollection';
import Chest from '../sprites/Chest';
import Warrior from '../sprites/Warrior';


export default class GameScene extends Phaser.Scene {

    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    private warrior?:  Warrior;
    private warriorDemonCollideEvent?: Phaser.Physics.Arcade.Collider;
    private weaponDemonCollideEvent?: Phaser.Physics.Arcade.Collider;
    constructor() {
        super('GameScene');
    }

    preload() {
        
    }

    create() {
        this.scene.run('GameUIScene');

        createWarriorAnims(this.anims);
        createBigDemonAnims(this.anims);
        createWeaponAnims(this.anims);
        createChestAnims(this.anims);

        const map = this.make.tilemap({ key: 'dungeon' });

        const tileSet = map.addTilesetImage('dungeon_16x16', 'tiles', 16, 16, 1, 2);

        map.createLayer('Ground', tileSet);
        const wallsLayer = map.createLayer('Walls', tileSet);

        wallsLayer.setCollisionByProperty({ collide: true });

        if (this.game.config.physics.arcade?.debug){
            debugLayer(wallsLayer, this);
        }

        const demonGroup = this.physics.add.group({
            classType: BigDemon,
            createCallback: (it) =>{
                let demon = it as BigDemon;
                demon.body.onCollide = true;
                demon.body.setSize(demon.width * 0.8, demon.height);
                demon.body.setOffset(4, 4);
            },
            maxSize: 20
        });

        const monsters = map.getObjectLayer('Monsters');

        monsters.objects.forEach(m => {
            demonGroup.get(m.x! + m.width! * 0.5, m.y! + m.height! * 0.5, 'enemy');
        });

        const chests = map.getObjectLayer('Chests');
        const chestGroup = this.physics.add.staticGroup({
            classType: Chest
        });

        chests.objects.forEach(c => {
            chestGroup.get(c.x! + c.width! * 0.5, c.y! + c.height! * 0.5, 'chest')
        });

        this.warrior = this.add.warrior(300, 180, 'charecter');

        this.physics.add.collider(this.warrior, wallsLayer);
        this.physics.add.collider(demonGroup, wallsLayer);

        this.warriorDemonCollideEvent = this.physics.add.collider(this.warrior, demonGroup, this.handleWarriorDemonsCollision, undefined, this);
        this.weaponDemonCollideEvent = this.physics.add.collider(this.warrior.weaponInHand!, demonGroup, this.handleWeaponDemonsCollistion, undefined, this);

        this.physics.add.collider(this.warrior, chestGroup, this.handleWarriorOpenChests, undefined, this);
        this.physics.add.collider(demonGroup, chestGroup);

        this.cursor = this.input.keyboard.createCursorKeys();

        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.warrior);
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
            this.weaponDemonCollideEvent?.destroy();
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

    private handleWarriorOpenChests(warrior: Phaser.Types.Physics.Arcade.GameObjectWithBody, chest: Phaser.Types.Physics.Arcade.GameObjectWithBody):void{
        const theChest = chest as Chest;
        const theWarrior = warrior as Warrior;

        if (theWarrior.activeChest === theChest){
            return;
        }

        theWarrior.setActiveChest(theChest);
    }
}
