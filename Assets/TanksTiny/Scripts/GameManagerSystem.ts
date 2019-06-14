
namespace game {

    /** New System */
    export class GameManagerSystem extends ut.ComponentSystem {
        enemyCount:number;
        
        OnUpdate():void {

            this.world.forEach([game.GameContext, game.PlayerInput],
                (context, input) =>{
                    switch(context.State){
                        case "Menu":
                            if (input.Space)
                            {
                                this.InitializeGame();
                                context.State = "Game";
                            }
                            break;
                        case "Game":
                            break;
                    }

                }
            );
            this.world.forEach([ut.Entity, ut.Core2D.Camera2D, ut.Core2D.TransformLocalPosition],
                (entity, camera, transform) =>{
                    let gameConfig = this.world.getConfigData(game.GameConfig);
                    transform.position = new Vector3(gameConfig.MainPlayerPosition.x, gameConfig.MainPlayerPosition.y, 0);
                    this.world.forEach([ut.UILayout.UICanvas], (canvas) => {canvas.camera = entity;});
                }
            );

        }

        InstantiateEntity(position:Vector2, entityGroup: string)
        {
            let entity = ut.EntityGroup.instantiate(this.world, entityGroup)[0];

            this.world.usingComponentData(entity, [ut.Core2D.TransformLocalPosition], (transformLocalPosition)=>{

                    transformLocalPosition.position = new Vector3(position.x, position.y);
                }
            );

            return entity;
        }

        CreatePlayer(positionX:number, positionY:number) : void
        {
            this.InstantiateEntity(new Vector2(positionX, positionY), 'game.Player');
            this.enemyCount++;
        }

        CreateEnemy(positionX:number, positionY:number) : void
        {
            let enemy = this.InstantiateEntity(new Vector2(positionX, positionY), 'game.EnemyTank');
            this.enemyCount++;

            this.world.usingComponentData(enemy, [game.AIInput], (aiInput)=>{

                    aiInput.SpeedRandom += 0.5 - Math.random();
                    aiInput.MoveRandom += 0.5 - Math.random();
                    aiInput.RotateRandom += 0.5 - Math.random();
                    aiInput.ShootRandom += 0.5 - Math.random();

                }
            );
        }

        InitializeGame():void {
            let playerIndex = Math.floor(50 * Math.random());
            this.enemyCount = 0;
            let horizontalStep = 20 / 10;
            let verticalStep = 20 / 5;
            let startX = 10 - horizontalStep / 2;
            let startY = 10 - verticalStep / 2;
            let halfStep = horizontalStep / 1.5;
            for (let x = startX; x > 0; x -= horizontalStep)
            {
                for (let y = startY; y > -0.1; y -= verticalStep)
                {
                    if (this.enemyCount == playerIndex)
                        this.CreatePlayer(x + (halfStep * (0.5 - Math.random())), y);
                    else
                        this.CreateEnemy(x + (halfStep * (0.5 - Math.random())), y);
                    if (y > 0)
                    {
                        if (this.enemyCount == playerIndex)
                            this.CreatePlayer(x + (halfStep * (0.5 - Math.random())), -y);
                        else
                            this.CreateEnemy(x + (halfStep * (0.5 - Math.random())), -y);
                    }   

                    if (this.enemyCount == playerIndex)
                        this.CreatePlayer(-x + (halfStep * (0.5 - Math.random())), y);
                    else
                        this.CreateEnemy(-x + (halfStep * (0.5 - Math.random())), y);

                    if (y > 0)
                    {
                        if (this.enemyCount == playerIndex)
                            this.CreatePlayer(-x + (halfStep * (0.5 - Math.random())), -y);
                        else
                            this.CreateEnemy(-x + (halfStep * (0.5 - Math.random())), -y);
                    }         
                }
            }   
        }
    }
}
