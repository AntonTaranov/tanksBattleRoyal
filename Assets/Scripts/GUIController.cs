using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GUIController : MonoBehaviour {
    [SerializeField] Text TanksCounter;
    [SerializeField] Text HealthCounter;
    [SerializeField] Text GameResult;
	
    public void SetHealth(int health)
    {
        if (HealthCounter != null)
        {
            HealthCounter.text = health + "";
        }
    }

    public void SetTanks(int tanks)
    {
        if (TanksCounter != null)
        {
            TanksCounter.text = tanks + "";
        }
    }

    public void HideResult()
    {
        if (GameResult != null)
        {
            GameResult.enabled = false;
        }
    }

    public void ShowResult(bool win)
    {
        if (GameResult != null)
        {
            GameResult.enabled = true;
            if (win)
            {             
                GameResult.text = "Win";
            }
            else
            {
                GameResult.text = "Lose";
            }
        }
    }
}
