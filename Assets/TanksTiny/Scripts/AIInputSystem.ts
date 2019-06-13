
namespace game {

    /** New System */
    export class AIInputSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([ut.Entity, game.AIInput],(entity, aiInput) =>{

                let speedRandom = aiInput.SpeedRandom;
                let moveRandom = aiInput.MoveRandom;
                let rotateRandom = aiInput.RotateRandom;
                let shootRandom = aiInput.ShootRandom;

                aiInput.CommandDelay -= this.scheduler.deltaTime();
                if (aiInput.CommandDelay <= 0)
                {
                    aiInput.CommandDelay = 1 / speedRandom;
                    aiInput.MoveActive = Math.random() <= moveRandom;
                    aiInput.ShootActive = Math.random() <= shootRandom;
                    if (Math.random() <= rotateRandom)
                    {
                        aiInput.RotateDirection = Math.random() > 0.5 ? 1 : -1;
                    }
                    else
                    {
                        aiInput.RotateDirection = 0;
                    }
                }

                let axis = new Vector2();
                axis.y = aiInput.MoveActive ? 1 : 0;
                axis.x = aiInput.RotateDirection;

                aiInput.Axis = axis;

                if (aiInput.ShootActive && !this.world.hasComponent(entity, game.FireCooldown))
                {
                    aiInput.Space = true;
                }
                else 
                {
                    aiInput.Space = false;
                }
                
            });
        }
    }
}
