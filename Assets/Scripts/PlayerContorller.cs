using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerContorller : MonoBehaviour
{
    Pers pers;

    IShooter shooter;

    public IShooter Shooter { set { shooter = value; } }

    void Start()
    {
        pers = GetComponent<Pers>();
    }

    // Update is called once per frame
    void Update()
    {
        float vertical = Input.GetAxis("Vertical");
        float horizontal = Input.GetAxis("Horizontal");
        if (vertical > 0)
        {
            pers.MoveForward();
        }
        if (horizontal > 0 || horizontal < 0)
        {
            pers.AddRotation(horizontal);
        }
        if (pers.IsCanShoot && Input.GetButtonDown("Jump"))
        {
            if (shooter != null)
            {
                shooter.PersShooting(pers);
            }
        }
    }
}
