
namespace game {

    /** New System */
    @ut.executeAfter(ut.Shared.UserCodeStart)
    @ut.executeAfter(ut.HitBox2D.HitBox2DSystem)

    @ut.executeBefore(ut.Shared.UserCodeEnd)
    @ut.requiredComponents(ut.HitBox2D.HitBoxOverlapResults)

    export class CollisionsSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([ut.Entity, ut.HitBox2D.HitBoxOverlapResults],
                (entity, hitboxoverlapresults, movingObject, transform) => {
                    if (hitboxoverlapresults.overlaps.length == 0){
                        return;
                    }
                    for (let i = 0; i < hitboxoverlapresults.overlaps.length; i++) {
                        let otherEntity = hitboxoverlapresults.overlaps[i].otherEntity;
                        if(!this.world.exists(otherEntity)){
                            continue;
                        }
                        if (!this.world.hasComponent(entity, game.HitWall))
                        {
                            this.world.addComponent(entity, game.HitWall);
                        }
                        if (this.world.hasComponent(entity, game.TankState) && this.world.hasComponent(otherEntity, game.Bullet))
                        {
                            this.world.addComponent(entity, game.HitBullet);
                        }
                    }
                }
            );
        }
    }
}
