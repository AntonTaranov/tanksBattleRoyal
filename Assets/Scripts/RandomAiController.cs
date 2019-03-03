using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RandomAiController : MonoBehaviour{

    Pers pers;
    float shootRandom = 0.5f;
    float rotateRandom = 0.5f;
    float moveRandom = 0.5f;
    float speedRandom = 0.6f;

    float commandDelay = 0;

    bool moveActive = false;
    bool shootActive = false;
    int rotateDirection = 0;

    IShooter shooter;

    public IShooter Shooter { set { shooter = value; } }

    void Start()
    {
        shootRandom += 0.5f - Random.value;
        rotateRandom += 0.5f - Random.value;
        moveRandom += 0.5f - Random.value;
        speedRandom += 0.5f - Random.value;
        pers = GetComponent<Pers>();
    }

    private void Update()
    {
        commandDelay -= Time.deltaTime;
        if (commandDelay <= 0)
        {
            commandDelay = 1 / speedRandom;
            moveActive = Random.value <= moveRandom;
            shootActive = Random.value <= shootRandom;
            if (Random.value <= rotateRandom)
            {
                rotateDirection = Random.value > 0.5 ? 1 : -1;
            }
            else
            {
                rotateDirection = 0;
            }
        }
        if (pers != null)
        {
            if (moveActive)
            {
                pers.MoveForward();
            }
            if (rotateDirection != 0)
            {
                pers.AddRotation(rotateDirection);
            }
            if (shootActive && pers.IsCanShoot)
            {
                pers.Shoot();
                if (shooter != null)
                {
                    shooter.PersShooting(pers);
                }
            }
        }
    }

}
