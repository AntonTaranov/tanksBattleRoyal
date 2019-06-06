
namespace game {

    /** New System */
    export class PlayerInputSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            this.world.forEach([game.PlayerInput], 
            (input) => {
                let axis = new Vector2();
                input.Space = false;

                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.A))
                    axis.x += -1;
                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.D))
                    axis.x += 1;
                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.S))
                    axis.y += -1;
                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.W))
                    axis.y += 1;

                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.Space))
                    input.Space = true;

                input.Axis = axis;
            });
        }
    }
}
