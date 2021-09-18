const createBigDemonAnims = (anims: Phaser.Animations.AnimationManager)=>{
    anims.create({
        key: 'bigDemon-idle',
        frames: anims.generateFrameNames('enemy',{
            start: 0,
            end: 3,
            prefix: 'big_demon_idle_anim_f'
        }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'bigDemon-run',
        frames: anims.generateFrameNames('enemy',{
            start: 0,
            end: 3,
            prefix: 'big_demon_run_anim_f'
        }),
        frameRate: 10,
        repeat: -1
    });
};

export { createBigDemonAnims };