## [12/2/2017] Board Design
I've been working on building some automatic roomba virtual walls.
The design I'm basing my own on uses switches. Being the lazy engineer I am, I wondered how to replace them with automatic functions. My solution was to select a RTC and use the I2C bus on the ATtiny85 to interface with it. The original design helpfully has a NC pin and taking the switch out of the design freed up the SCL and SDA pins for my purposes.
Now I just need to find footprint files for the coin cell holder and I'll be in business.

## About the Author
Austen Higgins-Cassidy is a tinkerer, explorer, game-player, and creator.
![The Author](/img/me.jpg)
When he's not working on an ill-advised elecronics project, he's creating outlines for roleplaying games, playing boardgames with groups, or trying to create a space-based videogame.

He loves solving problems and designing efficient, effective solutions.
