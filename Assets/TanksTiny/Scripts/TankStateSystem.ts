
namespace game {

    /** New System */
    export class TankStateSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([ut.Entity, game.TankState],(entity, tankState) =>{
                if (this.world.hasComponent(entity, game.HitBullet))
                {
                    tankState.Health -= 1;
                    if (tankState.Health <= 0)
                    {
                        this.world.destroyEntity(entity);
                        return;
                    }
                    this.world.removeComponent(entity, game.HitBullet);
                }
            });
        }
    }
}
