class Sensor{

    constructor(pos, range) {
        this.pos = pos
        this.rays = []
        this.range = range
    }

    generateRays() {
        for(let i=0; i<=360; i+=10) {
            this.rays.push(new Ray(this.pos, radians(i)))
        }
    }

    cast() {
        if (this.rays.length == 0) { this.generateRays() }

        for(let ray of this.rays) {
            let pt = null;
            let min = this.range || Infinity;
            let _wall = null

            for(let wall of walls) {
                
                let temp = ray.checkIntersection(wall)
                
                if(temp) {
                    
                // strokeWeight(5)
                // stroke(255,0,0)
                // point(temp.x, temp.y)
                
                   const dist = p5.Vector.dist(this.pos, temp)
                
                    if(dist < min) {
                        pt = temp
                        min = dist
                        _wall = wall

                        if(dist < wall.min_dist) {
                            wall.min_dist = dist
                        }

                    }


                }

            }
            ray.show(pt)
            if(_wall) { 
                _wall.rays.push({
                    ray,
                    min
                })
             }
            
            
        }
    }

    checkCollision(dangerRange, warningRange) {
        let danger = false
        let warn = false
        let dangerRays = []
        let warningRays = []

        for(let wall of walls) {
            
            if(warningRange && wall.min_dist < warningRange) {
                warn = true

                for(let r of wall.rays) {
                    if(r.min < warningRange) {
                        r.ray.setWarning = true
                        warningRays.push(r)
                    }
                }
            }

            if(wall.min_dist < dangerRange) {
                danger = true

                for(let r of wall.rays) {
                    if(r.min < dangerRange) {
                        r.ray.setDanger = true
                        dangerRays.push(r)
                    }
                }
            }

            wall.min_dist = Infinity
            wall.rays = []
        }

        return {
            danger,
            warn,
            dangerRays,
            warningRays
        }
    }

    update(pos) {
        this.pos = pos
        for(let ray of this.rays) {
            ray.pos = pos            
        }
    }

}


class Ray {

    constructor(pos, dir) {
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(dir);
        this.theta = dir;
        this.setDanger = false
        this.setWarning = false
        this.warningRange = 100
        this.dangerRange = 60
        this.range = 200
    }

    checkIntersection(wall) {
        const x1 = wall.start.x;
        const y1 = wall.start.y;
        const x2 = wall.end.x;
        const y2 = wall.end.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            const pt = createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        } 
        else {
            return;
        }

    }

    show(pt) {
        let {x, y} = this.pos

        strokeWeight(2)
        stroke(255, 40)
        if(this.setWarning) {
            stroke(235, 201, 52, 100)
            this.setWarning = false
        }
        if(this.setDanger) {
            stroke(255,0,0, 100)
            this.setDanger = false
        }
        
        if(pt) {
            line(x, y, pt.x, pt.y)
        } else {
            line(x, y, x+10*cos(this.theta), y+10*sin(this.theta))
        }
        noFill()
        stroke(255, 255, 255, 20)
        strokeWeight(0.5)
        circle(x, y, 2*this.warningRange)
        circle(x, y, 2*this.dangerRange)
        circle(x, y, 2*this.range)
    }

}

class Wall {

    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.min_dist = Infinity;
        this.rays = []
    }

    show() {
        stroke(240, 180)
        strokeWeight(5)
        line(this.start.x, this.start.y, this.end.x, this.end.y)
    }

}
