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
    }

    create(){
        this.scene.start('GameScene');
    }
}