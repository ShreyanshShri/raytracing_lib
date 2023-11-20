# raytracing_lib
A ray Tracing lib for JS canvas

```
let sensor, walls
function setup() {
walls = [
    new Wall(startCoods, endCoords)
]
sensor = new Sensor(pos , range, warningRange, dangerRange, walls)
}

function draw() {
    sensor.cast()
    sensor.checkCollision(range, warningRange, dangerRange)
    sensor.update(pos)
    for(wall of sensor.walls) {
        wall.show()
    }
}
```

```
sensor construcor:
        pos: p5 vector 2d
        range/warningRange/dangerRange/: float (optional)
        walls: array of objects "Walls"

sensor.checkCollision(range, warningRange, dangerRange) :
        range/warningRange/dangerRange/: float (optional)

sensor.update(pos)
      pos: p5 2d vector

Walls constructor:
      startCoods/endCoords: p5 2d Vector
```

```
