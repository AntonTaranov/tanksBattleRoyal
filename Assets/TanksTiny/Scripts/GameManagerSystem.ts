
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

                }
            );
            this.world.forEach([ut.Core2D.Camera2D, ut.Core2D.TransformLocalPosition],
                (camera, transform) =>{
                    let gameConfig = this.world.getConfigData(game.GameConfig);
                    transform.position = new Vector3(gameConfig.MainPlayerPosition.x, gameConfig.MainPlayerPosition.y, 0);
                }
            );

        }
    }
}
