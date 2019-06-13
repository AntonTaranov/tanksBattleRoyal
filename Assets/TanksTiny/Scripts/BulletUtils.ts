
namespace game {

    /** New System */
    export class BulletUtils {


        static fireBullet(world:ut.World, sourcePosition: Vector2, direction: Vector2, offset:number)
        {
            let bulletEntity = ut.EntityGroup.instantiate(world, 'game.Bullet')[0];

            let bulletStartPosition = new Vector3(sourcePosition.x + direction.x * offset, sourcePosition.y + direction.y * offset, 0);
            let bulletRotation = new Euler(0, 0, Math.atan2(direction.y, direction.x) - Math.PI / 2);

            world.usingComponentData(bulletEntity, [ut.Core2D.TransformLocalPosition, ut.Core2D.TransformLocalRotation, game.MovingObject], (transformLocalPosition, transformLocalRotation, movingObject)=>{

                    transformLocalPosition.position = bulletStartPosition;
                    movingObject.LinearVelocity = direction.setLength(4);
                    transformLocalRotation.rotation.setFromEuler(bulletRotation);

                }
            );
        }
    }
}
