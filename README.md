# PingPongGame
Ping pong, also known as table tennis is a game in which two or four players hit a lightweight ball, back and forth across a table using small solid rackets (paddle).
The paddles are moved up and down (if ping pong is horizontal) or right and left (if ping pong is vertical) by the players to make sure the ball hits it and sends it back in the direction of the other player.
If one misses the ball, the other player gets the point. The first one who reaches the point needed (e.g, 5) to win will win the game.

I am using HTML5 canvas and JavaScript to implement this game. Let’s look at how the game logic works:-

1) I’ll deploy a ball with an initial velocity and a direction at the center.
2) There are two paddles - user paddle and computer paddle. I move the user paddle right and left using mouse. And computer moves the computer paddle right and left with respect to the ball positon automatically.
3) The direction of the ball is changed and speed is increased a little when the ball touches a paddle.
4) The right and left boundaries of the canvas will reflect the ball when the ball hits.
5) Once a player misses the ball, the other player’s score is incremented by one. It is checked whether the player has reached the score that is needed to win and if it is reached, then the player wins and the game ends.
6) The game is continued until a player wins.
