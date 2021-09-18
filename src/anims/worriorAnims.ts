const createWorriorAnims = (anims: Phaser.Animations.AnimationManager)=>{

    anims.create({
        key : 'warrior-run-idle',
        frames: [{key: 'charecter', frame: 'Character_Down_0.png'}],
        frameRate: 10,
        repeat: -1,
    });

    anims.create({
        key: 'warrior-run-down',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 3,
            prefix: 'Character_Down_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'warrior-run-up',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 3,
            prefix: 'Character_Up_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'warrior-run-left',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 3,
            prefix: 'Character_Left_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'warrior-run-right',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 3,
            prefix: 'Character_Right_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'warrior-slash-left',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 4,
            prefix: 'Character_SlashLeft_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });
    
    anims.create({
        key: 'warrior-slash-right',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 4,
            prefix: 'Character_SlashRight_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });
    
    anims.create({
        key: 'warrior-slash-up',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 4,
            prefix: 'Character_SlashUp_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });
    
    anims.create({
        key: 'warrior-slash-down',
        frames: anims.generateFrameNames('charecter', {
            start: 0,
            end: 4,
            prefix: 'Character_SlashDown_',
            suffix: '.png'                
        }),
        frameRate: 10,
        repeat: -1
    });

};

export {
    createWorriorAnims
};