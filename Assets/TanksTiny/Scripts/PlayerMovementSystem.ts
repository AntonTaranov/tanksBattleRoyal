
namespace game {

    /** New System */
    @ut.executeAfter(game.PlayerInputSystem)
    export class PlayerMovementSystem extends ut.ComponentSystem {
        
        OnUpdate():void {

            this.world.forEach([game.PlayerInput, ut.Core2D.TransformLocalPosition, game.TankState],
                (input, transform, tank) =>{

                    if (input.Axis.x != 0)
                    {
                        tank.Torque += input.Axis.x * this.scheduler.deltaTime(); 
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

                    let x = transform.position.x;
                    let y = transform.position.y += tank.Acceleration * this.scheduler.deltaTime();

                    transform.position = new Vector3(x, y, 0);
                });

        }
    }
}
