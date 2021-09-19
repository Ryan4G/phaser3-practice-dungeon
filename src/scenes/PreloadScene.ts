import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene{
    
    constructor(){
        super({key:'PreloadScene'});
    }

    preload(){
        this.load.image('tiles', 'assets/tilemaps/dungeon_16x16_extruded.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/tilemaps/dungeon_16x16.json');
        this.load.spritesheet("touch", "assets/sprites/touch.png", { frameWidth: 64, frameHeight: 64 });
        
        this.load.atlas('charecter', 'assets/sprites/character.png', 'assets/sprites/character.json');
        this.load.atlas('enemy', 'assets/sprites/big_demon.png', 'assets/sprites/big_demon.json');
        this.load.atlas('weapon', 'assets/sprites/weapon.png', 'assets/sprites/weapon.json');
        this.load.atlas('chest', 'assets/sprites/chest.png', 'assets/sprites/chest.json');

        this.load.audio('bgm', 'assets/sounds/bg.ogg');
        this.load.audio('demon_death', 'assets/sfx/demon_death.ogg');
        this.load.audio('demon_hurt', 'assets/sfx/demon_hurt.ogg');
        this.load.audio('sword_out', 'assets/sfx/sword_out.ogg');
        this.load.audio('warrior_hurt', 'assets/sfx/warrior_hurt.ogg');
        this.load.audio('open_chest', 'assets/sfx/open_chest.mp3');
    }

    create(){
        this.scene.start('GameScene');
    }
}