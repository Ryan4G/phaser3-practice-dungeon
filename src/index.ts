import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import PreloadScene from './scenes/PreloadScene';
import GameUIScene from './scenes/GameUIScene';
import GamePadScene from './scenes/GamePadScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,	
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-main',
		width: 480,
		height: 320,
    },
    backgroundColor: '#7d7d7d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
	scene: [PreloadScene, GameScene, GameUIScene, GamePadScene]
}

export default new Phaser.Game(config);

