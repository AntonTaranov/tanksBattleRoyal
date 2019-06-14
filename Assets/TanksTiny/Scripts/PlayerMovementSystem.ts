
namespace game {

    /** New System */
    @ut.executeAfter(game.PlayerInputSystem)
    @ut.executeBefore(game.CollisionsSystem)
    @ut.requiredComponents(ut.Physics2D.AddImpulse2D)
    export class PlayerMovementSystem extends ut.ComponentSystem {
        
        OnUpdate():void {

            this.world.forEach([ut.Entity, game.TankState, ut.Core2D.TransformLocalRotation],
                (entity, tank, transformRotation) =>{

                    var input;

                    if (this.world.hasComponent(entity, game.PlayerInput))
                    {
                        input = this.world.getComponentData(entity, game.PlayerInput);
                    } 
                    else if (this.world.hasComponent(entity, game.AIInput))
                    {
                        input = this.world.getComponentData(entity, game.AIInput);
                    }

                    if (input.Axis.y != 0)
                    {
                        tank.Acceleration += input.Axis.y * this.scheduler.deltaTime() * 5; 
                        if (tank.Acceleration > 4)
                            tank.Acceleration = 4;
                        else if (tank.Acceleration < -2)
                            tank.Acceleration = -2;
                    } 
                    else if (tank.Acceleration > 0)
                    {
                        tank.Acceleration += - this.scheduler.deltaTime() * 15;
                        if (tank.Acceleration < 0 )
                            tank.Acceleration = 0;
                    }
                    else if (tank.Acceleration < 0)
                    {
                        tank.Acceleration += this.scheduler.deltaTime() * 15;
                        if (tank.Acceleration > 0 )
                            tank.Acceleration = 0;
                    }

                    let acceleration = tank.Acceleration;

                    let moveDirection = new Vector3(0,1,0);
                    moveDirection.applyQuaternion(transformRotation.rotation);

                    let velocity = new Vector2();
                    if (this.world.hasComponent(entity, ut.Physics2D.Velocity2D))
                        velocity = this.world.getComponentData(entity, ut.Physics2D.Velocity2D).velocity;

                    if (velocity.length() > 2)
                        acceleration = 0;

                    let impulseDirection = new Vector2(moveDirection.x, moveDirection.y);
                    if (acceleration == 0 && velocity.length() > 0)
                    {
                        impulseDirection.x = velocity.x;
                        impulseDirection.y = velocity.y;
                        let velocityRate = velocity.length();
                        impulseDirection.normalize();
                        acceleration = - 30 * (velocityRate * velocityRate);
                    }

                    if (!this.world.hasComponent(entity, ut.Physics2D.AddImpulse2D))
                        this.world.addComponent(entity, ut.Physics2D.AddImpulse2D);

                    this.world.usingComponentData(entity, [ut.Physics2D.AddImpulse2D], (impulse) => {

                            impulse.impulse = new Vector2(impulseDirection.x * acceleration, impulseDirection.y * acceleration);
                        });

                
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

                    rotation.z = rotationZ;

                    transformRotation.rotation = transformRotation.rotation.setFromEuler(rotation);

                    let transformPosition = this.world.getComponentData(entity, ut.Core2D.TransformLocalPosition);

                    if (this.world.hasComponent(entity, game.CameraFollow))
                    {
                        let gameConfig = new game.GameConfig();
                        gameConfig.MainPlayerPosition = new Vector2(transformPosition.position.x, transformPosition.position.y);
                        this.world.setConfigData(gameConfig);
                    }

                    if (!this.world.hasComponent(entity, game.FireCooldown) && input.Space)
                    {
                        game.BulletUtils.fireBullet(this.world, new Vector2(transformPosition.position.x, transformPosition.position.y), 
                            new Vector2(moveDirection.x, moveDirection.y), 0.5);

                        this.world.addComponent(entity, game.FireCooldown);
                        this.world.usingComponentData(entity, [game.FireCooldown], (cooldown) => {

                            cooldown.TimeOut = 3;
                        });
                    }
                }
            );

        }
    }
}
