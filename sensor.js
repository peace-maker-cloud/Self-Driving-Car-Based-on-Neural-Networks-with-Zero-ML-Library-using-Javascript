class Sensor {
  constructor(carModel) {
    this.carModel = carModel;
    this.rayCount = 5;
    this.rayLength = 150;
    // this ray spread upto 45 degree
    this.raySpread = Math.PI / 2.5;
    // we are going to create and keep them in an array
    this.rays = [];
    // we need set the car model if there is borders or not
    this.readings = [];
  }
  update(roadBorders, traffic) {
    this.#showRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(
        // we are setting new private method for getting readings
        this.#getReadings(this.rays[i], roadBorders, traffic)
      );
    }
  }
  #getReadings(ray, roadBorders, traffic) {
    let touching = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touching.push(touch);
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touching.push(value);
        }
      }
    }
    if (touching.length == 0) {
      return null;
    } else {
      // this getIntersection function will not return only the intersection point. but, it also return the offset i.e,. how far the point is from the zeroth array...
      const offset = touching.map((e) => e.offset);
      //   map will run through all the elements in this touches array and takes offset.
      // this will return a new array.
      //   Now we need to find the minimum value in this new array offsets.
      const minOffset = Math.min(...offset);
      //   we will retrun the minimum offset
      return touching.find((e) => e.offset == minOffset);
    }
  }

  #showRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2, //this is for starting point
          -this.raySpread / 2, // this is the end point
          // i / (this.rayCount - 1) //this is for sensorRay
          // raysensor won't show if rayCount is 1.so to rectify this,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.carModel.angle; //this angle will attach the raysensor and car together
      const start = { x: this.carModel.x, y: this.carModel.y };
      const end = {
        x: this.carModel.x - Math.sin(rayAngle) * this.rayLength,
        y: this.carModel.y - Math.cos(rayAngle) * this.rayLength,
      };

      //Now the start and end of the raysensor is created...
      this.rays.push([start, end]);
    }
  }
  //   we have border in road.js so we are going to draw
  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      // Now we are going the readings
      let end = this.rays[i][1];
      if (this.readings[i]) {
        //if it has any readings
        end = this.readings[i];
      }
      //   this is for rays line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); //this is the rays start location
      ctx.lineTo(end.x, end.y); //this is the end location of the rays array
      ctx.stroke();

      //   this is for the intersection point
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "blue";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y); //this will be the intersection end point
      ctx.lineTo(end.x, end.y); //this is the end location of the rays array
      ctx.stroke();
    }
  }
}
