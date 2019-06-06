
namespace game {

    /** New System */
    export class GameManagerSystem extends ut.ComponentSystem {
        
        OnUpdate():void {

            this.world.forEach([game.GameContext, game.PlayerInput],
                (context, input) =>{
                    switch(context.State){
                        case "Menu":
                            if (input.Space)
                            {
                                entities.game.Player.load(this.world);

                                context.State = "Game";
                            }
                            break;
                        case "Game":
                            break;
                    }

                });
        }
    }
}
