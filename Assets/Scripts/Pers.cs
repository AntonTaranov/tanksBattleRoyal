using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pers : MonoBehaviour {
    int health;
    bool cooldown;

    Rigidbody2D rigidbodyReference;

    public void Shoot()
    {
        cooldown = true;
        StartCoroutine(CooldownDelay());
    }

    public bool IsCanShoot { get { return !cooldown; } }
    public int Health { get { return health; } }

    public void MoveForward()
    {
        if (rigidbodyReference != null)
        {
            rigidbodyReference.AddRelativeForce(Vector2.up);
        }
    }

    public void AddRotation(float inputTorque)
    {
        if (rigidbodyReference != null)
        {
            rigidbodyReference.AddTorque((-0.1f) * inputTorque);
        }
    }

    IEnumerator CooldownDelay()
    {
        yield return new WaitForSeconds(3f);
        cooldown = false;
    }

	// Use this for initialization
	void Start () {
        health = 3;
        cooldown = false;
        rigidbodyReference = GetComponent<Rigidbody2D>();
	}

    private void OnCollisionEnter2D(Collision2D collision)
    {
        var bullet = collision.gameObject.GetComponent<Bullet>();
        if (bullet)
        {
            health -= 1;
            if (health <= 0)
            {
                Destroy(gameObject);
            }
        }
    }
}
