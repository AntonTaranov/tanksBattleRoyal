using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Animations;

public class GameController : MonoBehaviour, IShooter {
    [SerializeField] Pers PlayerPersPrefab;
    [SerializeField] Pers EnemyPersPrefab;
    [SerializeField] Rigidbody2D BulletPrefab;

    [SerializeField] GameObject GameField;

    Pers PlayerPers;
    GUIController GUI;

    bool gameOver;
    List<Pers> tanks;

    int AliveTanksCounter;
    int PlayerHealthPoints; 

    void InitializeGame()
    {
        AliveTanksCounter = 0;
        PlayerHealthPoints = 0;
        if (GameField != null)
        {
            tanks = new List<Pers>();
            if (PlayerPersPrefab != null && EnemyPersPrefab != null)
            {
                CreateEnemies(Random.Range(0, 50));        
            }
        }
        gameOver = false;

        if (GUI != null)
        {
            GUI.HideResult();   
        }
    }

    void CreatePlayer(ref int enemyCount, float x, float y)
    {
        enemyCount++;
        PlayerPers = Instantiate(PlayerPersPrefab, GameField.transform);
        PlayerPers.name = "Player_" + enemyCount;
        PlayerPers.transform.localPosition = new Vector3(x, y);
        var playerController = PlayerPers.gameObject.AddComponent<PlayerContorller>();
        playerController.Shooter = this;
        SetCameraTarget(PlayerPers.transform);
        tanks.Add(PlayerPers);
    }

    void CreateEnemy(ref int enemyCount, float x, float y)
    {
        enemyCount++;
        var enemy = Instantiate(EnemyPersPrefab, GameField.transform);
        enemy.name = "Enemy_" + enemyCount;
        enemy.transform.localPosition = new Vector3(x, y);
        var enemyController = enemy.gameObject.AddComponent<RandomAiController>();
        enemyController.Shooter = this;
        tanks.Add(enemy);
    }

    void CreateEnemies(int playerIndex)
    {
        int enemyCount = 0;
        float horizontalStep = 20 / 10;
        float verticalStep = 20 / 5;
        float startX = 10 - horizontalStep / 2;
        float startY = 10 - verticalStep / 2;
        float halfStep = horizontalStep / 1.5f;
        for (float x = startX; x > 0; x -= horizontalStep)
        {
            for (float y = startY; y > -0.1; y -= verticalStep)
            {
                if (enemyCount == playerIndex)
                    CreatePlayer(ref enemyCount, x + (halfStep * (0.5f - Random.value)), y);
                else
                    CreateEnemy(ref enemyCount, x + (halfStep * (0.5f - Random.value)), y);
                if (y > 0)
                {
                    if (enemyCount == playerIndex)
                        CreatePlayer(ref enemyCount, x + (halfStep * (0.5f - Random.value)), -y);
                    else
                        CreateEnemy(ref enemyCount, x + (halfStep * (0.5f - Random.value)), -y);
                }
                if (enemyCount == playerIndex)
                    CreatePlayer(ref enemyCount, -x + (halfStep * (0.5f - Random.value)), y);
                else
                    CreateEnemy(ref enemyCount, -x + (halfStep * (0.5f - Random.value)), y);
                if (y > 0)
                {
                    if (enemyCount == playerIndex)
                        CreatePlayer(ref enemyCount, -x + (halfStep * (0.5f - Random.value)), -y);
                    else
                        CreateEnemy(ref enemyCount, -x + (halfStep * (0.5f - Random.value)), -y);
                }         
            }
        }
    }

    void SetCameraTarget(Transform targetTransform)
    {
        var camera = Camera.main;
        var cameraPosition = camera.GetComponent<PositionConstraint>();
        if (cameraPosition != null)
        {
            cameraPosition.constraintActive = true;
            var playerConstraint = new ConstraintSource();
            playerConstraint.sourceTransform = targetTransform;
            playerConstraint.weight = 1;

            var constraintList = new List<ConstraintSource>();
            constraintList.Add(playerConstraint);
            cameraPosition.SetSources(constraintList);
        }
    }    

	// Use this for initialization
	void Start () {
        GUI = GetComponent<GUIController>();
        InitializeGame();
	}
	
	// Update is called once per frame
	void Update ()
    {
        int tanksCounter = 0;
        foreach(var tank in tanks)
        {
            if (tank != null) tanksCounter++;           
        }
        if (tanksCounter != AliveTanksCounter)
        {
            AliveTanksCounter = tanksCounter;
            if (GUI != null)
            {
                GUI.SetTanks(AliveTanksCounter);
            }
        }

        if (PlayerPers != null)
        {
            if (AliveTanksCounter == 1)
            {
                if (GUI != null)
                {
                    GUI.ShowResult(true);
                }
            }
            if (PlayerPers.Health != PlayerHealthPoints)
            {
                PlayerHealthPoints = PlayerPers.Health;
                if (GUI != null)
                {
                    GUI.SetHealth(PlayerHealthPoints);
                }
            }
        }
        else if (!gameOver)
        {
            gameOver = true;
            PlayerHealthPoints = 0;
            if (GUI != null)
            {
                GUI.ShowResult(false);
                GUI.SetHealth(PlayerHealthPoints);
            }
        }
    }

    public void PersShooting(Pers pers)
    {
        if (pers != null)
        {
            pers.Shoot();
            if (BulletPrefab != null)
            {
                var bullet = Instantiate(BulletPrefab, pers.transform.position, pers.transform.rotation, GameField.transform);
                bullet.transform.Translate(Vector3.up * 0.5f, bullet.transform);
                bullet.AddRelativeForce(Vector2.up * 5);
            }
        }
    }

    public void RestartGame()
    {
        //remove all pers
        var persList = GameField.GetComponentsInChildren<Pers>();
        foreach(var pers in persList)
        {
            Destroy(pers.gameObject);
        }
        InitializeGame();
    }
}
