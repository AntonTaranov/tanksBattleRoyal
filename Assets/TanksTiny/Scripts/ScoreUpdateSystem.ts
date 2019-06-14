
namespace game {

    /** New System */
    export class ScoreUpdateSystem extends ut.ComponentSystem {
        
        OnUpdate():void {
            let enemiesCount = 0;
            this.world.forEach([game.Enemy],(enemy) => {enemiesCount++;});

            this.world.forEach([ut.Text.Text2DRenderer, game.Score], (textRenderer, score) => {
                textRenderer.text = enemiesCount.toString();
            });
        }
    }
}
