
namespace game {

    /** New System */
    export class BulletUpdater extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([ut.Entity, game.MovingObject, ut.Core2D.TransformLocalPosition],(entity, movingObject, transformPosition) => {
                if (!this.world.hasComponent(entity, game.Bullet)) 
                    return;

                if (this.world.hasComponent(entity, game.HitWall))
                {
                    this.world.destroyEntity(entity);
                    return;
                }

                let x = transformPosition.position.x += movingObject.LinearVelocity.x * this.scheduler.deltaTime();
                let y = transformPosition.position.y += movingObject.LinearVelocity.y * this.scheduler.deltaTime();

                transformPosition.position = new Vector3(x, y);
            });
        }
    }
}
