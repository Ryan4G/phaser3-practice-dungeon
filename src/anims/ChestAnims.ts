const createChestAnims = (anims: Phaser.Animations.AnimationManager)=>{
    
    anims.create({
        key: 'chest-close',
        frames: [{key: 'chest', frame:''}]
    });

    anims.create({
        key: 'chest-open',
        frames: anims.generateFrameNames('chest', {
            start: 0,
            end: 2,
            prefix: 'chest_empty_open_anim_f',
            suffix: '.png'
        }),
        frameRate: 10
    })
};

export {
    createChestAnims
}