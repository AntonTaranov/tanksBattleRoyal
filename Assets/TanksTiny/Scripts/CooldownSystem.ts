
namespace game {

    /** New System */
    export class CooldownSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([ut.Entity, game.FireCooldown],(entity, cooldown) =>{
                cooldown.TimeOut -= this.scheduler.deltaTime();
                if (cooldown.TimeOut <= 0)
                {
                    this.world.removeComponent(entity, game.FireCooldown);
                }
            });
        }
    }
}
