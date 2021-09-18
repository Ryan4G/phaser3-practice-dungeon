const createWeaponAnims = (anims: Phaser.Animations.AnimationManager)=>{
    anims.create({
        key: 'weapon-left',
        frames: anims.generateFrameNames('weapon',{
            start: 0,
            end: 3,
            prefix: 'Sword_Left_',
            suffix: '.png'
        }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'weapon-right',
        frames: anims.generateFrameNames('weapon',{
            start: 0,
            end: 3,
            prefix: 'Sword_Right_',
            suffix: '.png'
        }),
        frameRate: 10,
        repeat: -1
    });
    
    anims.create({
        key: 'weapon-up',
        frames: anims.generateFrameNames('weapon',{
            start: 0,
            end: 3,
            prefix: 'Sword_Up_',
            suffix: '.png'
        }),
        frameRate: 10,
        repeat: -1
    });
    
    anims.create({
        key: 'weapon-down',
        frames: anims.generateFrameNames('weapon',{
            start: 0,
            end: 3,
            prefix: 'Sword_Down_',
            suffix: '.png'
        }),
        frameRate: 10,
        repeat: -1
    });
};

export {
    createWeaponAnims
};