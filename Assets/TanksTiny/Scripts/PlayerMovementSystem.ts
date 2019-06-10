
namespace game {

    /** New System */
    @ut.executeAfter(game.PlayerInputSystem)
    @ut.executeBefore(game.CollisionsSystem)
    export class PlayerMovementSystem extends ut.ComponentSystem {
        
        OnUpdate():void {

            this.world.forEach([ut.Entity, game.PlayerInput, ut.Core2D.TransformLocalPosition, ut.Core2D.TransformLocalRotation, game.TankState, game.MovingObject],
                (entity, input, transformPosition, transformRotation, tank, movingObject) =>{

                    if(this.world.hasComponent(entity, game.HitWall))
                    {
                        this.world.removeComponent(entity, game.HitWall);
                        tank.Acceleration = 0;
                        tank.Torque = 0;

                        let x = transformPosition.position.x -= movingObject.LinearVelocity.x * this.scheduler.deltaTime();
                        let y = transformPosition.position.y -= movingObject.LinearVelocity.y * this.scheduler.deltaTime();
                        transformPosition.position = new Vector3(x, y, 0);

                        let rotation = new Euler();
                        rotation.setFromQuaternion(transformRotation.rotation);
                        let rotationZ = rotation.z - movingObject.AngularVelocity * this.scheduler.deltaTime();
                        rotation.z = rotationZ;

                        transformRotation.rotation = transformRotation.rotation.setFromEuler(rotation);

                        return;
                    }

                    if (input.Axis.y != 0)
                    {
                        tank.Acceleration += input.Axis.y * this.scheduler.deltaTime(); 
                        if (tank.Acceleration > 2)
                            tank.Acceleration = 2;
                        else if (tank.Acceleration < -1)
                            tank.Acceleration = -1;
                    } 
                    else if (tank.Acceleration > 0)
                    {
                        tank.Acceleration += - this.scheduler.deltaTime();
                        if (tank.Acceleration < 0 )
                            tank.Acceleration = 0;
                    }
                    else if (tank.Acceleration < 0)
                    {
                        tank.Acceleration += this.scheduler.deltaTime();
                        if (tank.Acceleration > 0 )
                            tank.Acceleration = 0;
                    }

                    let moveDirection = new Vector3(0,1,0);
                    moveDirection.applyQuaternion(transformRotation.rotation);

                    let x = transformPosition.position.x += moveDirection.x * tank.Acceleration * this.scheduler.deltaTime();
                    let y = transformPosition.position.y += moveDirection.y * tank.Acceleration * this.scheduler.deltaTime();

                    movingObject.LinearVelocity = new Vector2((x - transformPosition.position.x) / this.scheduler.deltaTime(),
                                                            (y - transformPosition.position.y) / this.scheduler.deltaTime());
                    
                    transformPosition.position = new Vector3(x, y, 0);
                
                    if (input.Axis.x != 0)
                    {
                        tank.Torque += input.Axis.x * this.scheduler.deltaTime();
                        if (tank.Torque > 1)
                            tank.Torque = 1;
                        else if (tank.Torque <-1)
                            tank.Torque = -1; 
                    } 
                    else if (tank.Torque > 0)
                    {
                        tank.Torque += - this.scheduler.deltaTime();
                        if (tank.Torque < 0 )
                            tank.Torque = 0;
                    }
                    else if (tank.Torque < 0)
                    {
                        tank.Torque = tank.Torque + this.scheduler.deltaTime();
                        if (tank.Torque > 0 )
                            tank.Torque = 0;
                    }

                    let rotation = new Euler();
                    rotation.setFromQuaternion(transformRotation.rotation);
                    let rotationZ = rotation.z - tank.Torque * this.scheduler.deltaTime();

                    movingObject.AngularVelocity = (rotationZ - rotation.z) / this.scheduler.deltaTime();
                    rotation.z = rotationZ;

                    transformRotation.rotation = transformRotation.rotation.setFromEuler(rotation);

                    if (this.world.hasComponent(entity, game.CameraFollow))
                    {
                        let gameConfig = new game.GameConfig();
                        gameConfig.MainPlayerPosition = new Vector2(x, y);
                        this.world.setConfigData(gameConfig);
                    }
                }
            );

        }
    }
}
