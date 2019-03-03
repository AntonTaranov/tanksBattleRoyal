using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Animations;

public class GameController : MonoBehaviour, IShooter {
    [SerializeField] Pers PlayerPersPrefab;
    [SerializeField] Pers EnemyPersPrefab;
    [SerializeField] Rigidbody2D BulletPrefab;

    [SerializeField] GameObject GameField;
    [Header("UI Elements")]
    [SerializeField] Text TanksCounter;
    [SerializeField] Text HealthCounter;
    [SerializeField] Text GameResult;

    Pers PlayerPers;

    bool gameOver;
    List<Pers> tanks;

    void InitializeGame()
    {
        if (GameField != null)
        {
            tanks = new List<Pers>();
            if (PlayerPersPrefab != null && EnemyPersPrefab != null)
            {
                CreateEnemies(Random.Range(0, 50));        
            }
        }
        gameOver = false;
        if (GameResult != null)
        {
            GameResult.enabled = false;
        }
        
    }

    void CreatePlayer(ref int enemyCount, float x, float y)
    {
        enemyCount++;
        PlayerPers = Instantiate(PlayerPersPrefab, GameField.transform);
        PlayerPers.name = "Player_" + enemyCount;
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
        InitializeGame();
	}
	
	// Update is called once per frame
	void Update ()
    {
        int aliveTanksCounter = 0;
        foreach(var tank in tanks)
        {
            if (tank != null) aliveTanksCounter++;           
        }
        if (TanksCounter != null)
        {
            TanksCounter.text = aliveTanksCounter + "";
        }
        if (PlayerPers != null)
        {
            float vertical = Input.GetAxis("Vertical");
            float horizontal = Input.GetAxis("Horizontal");
            if (vertical > 0)
            {
                PlayerPers.MoveForward();
            }
            if (horizontal > 0 || horizontal < 0)
            {
                PlayerPers.AddRotation(horizontal);
            }
            if (PlayerPers.IsCanShoot && Input.GetButtonDown("Jump"))
            {              
                PersShooting(PlayerPers);                
            }
            HealthCounter.text = PlayerPers.Health + "";
            if (aliveTanksCounter == 1)
            {
                GameResult.enabled = true;
                GameResult.text = "Win";
            }
        }
        else if (!gameOver)
        {
            gameOver = true;
            if (GameResult != null)
            {
                GameResult.enabled = true;
                GameResult.text = "Lose";
                HealthCounter.text = "0";
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
