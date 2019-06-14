
namespace game {

    /** New System */
    @ut.executeAfter(ut.Shared.UserCodeStart)
    @ut.executeBefore(ut.Shared.UserCodeEnd)
    @ut.requiredComponents(ut.Physics2D.ColliderContacts)

    export class CollisionsSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([ut.Entity, ut.Physics2D.ColliderContacts],
                (entity, collidercontacts) => {
                    if (collidercontacts.contacts.length == 0){
                        return;
                    }
                   
                    for (let i = 0; i < collidercontacts.contacts.length; i++) {
                        let otherEntity = collidercontacts.contacts[i];
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
