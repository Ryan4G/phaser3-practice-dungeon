import Phaser, { Physics } from 'phaser';
import { createWarriorAnims } from '../anims/WarriorAnims';
import { createBigDemonAnims } from '../anims/BigDemonAnims';
import { createWeaponAnims } from '../anims/WeaponAnims';
import { createChestAnims } from '../anims/ChestAnims';
import { debugLayer } from '../tools/debug';
import BigDemon from '../sprites/BigDemon';
import '../sprites/Warrior';
import Chest from '../sprites/Chest';
import Warrior from '../sprites/Warrior';
import { getBrowserMobileMode } from '../tools/mobile';
import { IInputPad } from '../interfaces/IInputPad';
import { sceneEvents } from "../events/EventCollection";
import { EVENT_WARRIOR_KIIL_MONSTER } from "../symbols/GameSymbols";


export default class GameScene extends Phaser.Scene {

    private _inputPad?: IInputPad;
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    private warrior?:  Warrior;
    private warriorDemonCollideEvent?: Phaser.Physics.Arcade.Collider;
    private weaponDemonCollideEvent?: Phaser.Physics.Arcade.Collider;

    private _monsterCount: number = 0;

    private readonly MOBILEMODE: boolean;

    constructor() {
        super('GameScene');
        this.MOBILEMODE = getBrowserMobileMode();
        this._inputPad = {
            left: false,
            right: false,
            up: false,
            down: false,
            space: false
        };
    }

    preload() {
        
    }

    create() {
        this.scene.run('GameUIScene');

        if (this.MOBILEMODE){
            this.scene.run('GamePadScene');
        }
        
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

        const monsterGroup = this.physics.add.group({
            classType: BigDemon,
            createCallback: (it) =>{
                let demon = it as BigDemon;
                demon.body.onCollide = true;
                demon.body.setSize(demon.width * 0.8, demon.height);
                demon.body.setOffset(4, 4);
            },
            removeCallback: ()=>{
                sceneEvents.emit(EVENT_WARRIOR_KIIL_MONSTER, --this._monsterCount);

                if (this._monsterCount <= 0){
                    this.physics.world.pause();
                }
            },
            maxSize: 20
        });

        const monsters = map.getObjectLayer('Monsters');

        monsters.objects.forEach(m => {
            monsterGroup.get(m.x! + m.width! * 0.5, m.y! + m.height! * 0.5, 'enemy');
            this._monsterCount++;
        });

        const chests = map.getObjectLayer('Chests');
        const chestGroup = this.physics.add.staticGroup({
            classType: Chest
        });

        chests.objects.forEach(c => {
            chestGroup.get(c.x! + c.width! * 0.5, c.y! + c.height! * 0.5, 'chest');
        });

        this.warrior = this.add.warrior(300, 180, 'charecter');

        this.physics.add.collider(this.warrior, wallsLayer);
        this.physics.add.collider(monsterGroup, wallsLayer);

        this.warriorDemonCollideEvent = this.physics.add.collider(this.warrior, monsterGroup, this.handleWarriorDemonsCollision, undefined, this);
        this.weaponDemonCollideEvent = this.physics.add.collider(this.warrior.weaponInHand!, monsterGroup, this.handleWeaponDemonsCollistion, undefined, this);

        this.physics.add.collider(this.warrior, chestGroup, this.handleWarriorOpenChests, undefined, this);
        this.physics.add.collider(monsterGroup, chestGroup);

        this.cursor = this.input.keyboard.createCursorKeys();

        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.warrior);
    }

    update() {
        if (this.warrior){
            if (!this.MOBILEMODE && this.cursor){
                this._inputPad = {
                    left: this.cursor.left.isDown,
                    right: this.cursor.right.isDown,
                    up: this.cursor.up.isDown,
                    down: this.cursor.down.isDown,
                    space: Phaser.Input.Keyboard.JustDown(this.cursor.space)
                }
            }

            this.warrior.update(this._inputPad);
        }
    }

    setInputPad(pad:IInputPad){
        this._inputPad = pad;
        console.dir(pad);
    }
    
    private handleWarriorDemonsCollision(warrior: Phaser.Types.Physics.Arcade.GameObjectWithBody, demon: Phaser.Types.Physics.Arcade.GameObjectWithBody):void{
        const theDemon = demon as BigDemon;
        const theWarrior = warrior as Warrior;

        const vet = new Phaser.Math.Vector2(theWarrior.x - theDemon.x, theWarrior.y - theDemon.y);

        theWarrior.handleCollisionDamage(vet, theDemon.damageHurt);

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

        if (theChest.hasOpened || theWarrior.activeChest === theChest){
            return;
        }

        theWarrior.setActiveChest(theChest);
    }
}
