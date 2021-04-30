## Controls
```
F2               : New Game
Esc              : Reset current level
1-9              : Change active robot
Arrow keys       : Move active robot
Arrow buttons    : Move active robot
Swipe on robot   : Move
```


## Rules
https://www.youtube.com/watch?v=OQOMmftaWAQ
https://images.zmangames.com/filer_public/c0/b4/c0b482f1-ad3e-4e5d-ae48-0c11aa7c317a/en-ricochet_robot-rules.pdf

## Inspiration
https://wiki.ubc.ca/Course:CPSC:Artificial_Intelligence/States_and_Searching

Images of the official boards
https://boardgamegeek.com/image/1898223/ricochet-robots

https://www.youtube.com/watch?v=fvuK0Us4xC4
  - Pre-compute stops. Var kan man åka från varje cell om det inte står en robot ivägen
  - Robot Equivalent. Hjälprobotarna kan byta plats med varandra utan att det påverkar
  - Arrays, not Sets. Hjälper det i JS?
  - Less objects. ?

https://github.com/smack42/DriftingDroids



## To do
* Defined levels in different difficulty groups Easy/Medium/Hard
* Node workers to generate pre-solved levels.  Thread-pooling?  https://blog.insiderattack.net/deep-dive-into-worker-threads-in-node-js-e75e10546b11


## Done
* WakeLock. available in chrome 84. 
* Button to stop the solver
* Toggle "There and back again" game mode
* om två hjälprobotar byter plats är det ett redan besökt state ---- KLAR!
* om en hjälprobot kommer tillbaka till en plats utan att ha krockat med någon annan är det ett onödigt drag. Nee. den kan ju ha flyttat undan för att släppa förbi en annan robot
