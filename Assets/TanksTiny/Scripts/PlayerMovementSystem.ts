
namespace game {

    /** New System */
    @ut.executeAfter(game.PlayerInputSystem)
    export class PlayerMovementSystem extends ut.ComponentSystem {
        
        OnUpdate():void {

            this.world.forEach([game.PlayerInput, ut.Core2D.TransformLocalPosition, ut.Core2D.TransformLocalRotation, game.TankState],
                (input, transformPosition, transformRotation, tank) =>{

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
                    rotation.z = rotation.z -= tank.Torque * this.scheduler.deltaTime();

                    transformRotation.rotation = transformRotation.rotation.setFromEuler(rotation);
                }
            );

        }
    }
}
