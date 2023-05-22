// Creating a class/Constructor for the car
class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.accelerator = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    // it's time for damage detection
    this.damages = false;
    // set brain...
    this.useAIBrain = controlType == "F.R.I.D.A.Y";
    // we don't need sensors for the dummy car,so
    if (controlType != "HUMAN") {
      // the sensor for the car is now updated
      this.sensor = new Sensor(this);
      this.AIbrain = new NeuralNetwork(
        // provide the values in array
        [this.sensor.rayCount, 6, 4] //6 is for hidden layer and 4 is for output layer...
      );
    }

    this.control = new Control(controlType);
  }
  // use to update the position of the car model
  update(roadBorders, traffic) {
    // we don't want our car model move if it gets damaged. so,
    if (!this.damages) {
      this.#movement();
      this.polygon = this.#createPolygon();
      this.damages = this.#calcDamage(roadBorders, traffic);
    } else {
      // location.reload();
    }

    // this.#movement();
    // this.polygon = this.#createPolygon();
    // this.damages = this.#calcDamage(roadBorders);
    // check whether it has sensor or not
    if (this.sensor) {
      // sensor need to be in the last ...
      this.sensor.update(roadBorders, traffic);
      // take out the offset values form readings
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );
      // we need neurons to get low values so that we can track how far the object is.
      // Y because torch light example...
      const outputs = NeuralNetwork.feedForward(offsets, this.AIbrain);
      // we will get four values in outputs as one for forward, one for backward, one for left, one for right for our car.
      // All Set now connect them in main.js
      if (this.useAIBrain) {
        //if use AI brain exists with four values then,
        this.control.forward = outputs[0];
        this.control.left = outputs[1];
        this.control.right = outputs[2];
        this.control.reverse = outputs[3];
      }
    }
  }
  // this is for the movement of the car.
  #movement() {
    if (this.control.forward) {
      this.speed += this.accelerator;
    }
    if (this.control.reverse) {
      this.speed -= this.accelerator;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      // why /2 'cause i don't want my car to go more speed
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // there is a minor issue in speed, i didn't press any key but still it keep on moving in a minor value, to stop that
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    // Now the forward and Backward is working properly,but left and left and right is not working,
    // if (this.control.left) {
    //   this.angle += 0.03;
    // }
    // if (this.control.right) {
    //   this.angle -= 0.03;
    // }
    // but the car Model is not going well in backwards, to rectify them
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.control.left) {
        this.angle += 0.03 * flip;
      }
      if (this.control.right) {
        this.angle -= 0.03 * flip;
      }
    }
    // for the left/right turn
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  #createPolygon() {
    // we will now create the border using array
    const points = [];
    // we need to find the distance or size of the car
    // we find it using car's width and height and measure it using hypotenuse
    const radius = Math.hypot(this.width, this.height) / 2;
    // it will return the hypotenuse value of the width and height of the car and get the half value, 'cause we need the half of it.
    // we need to find the angle so, we are using arc tangent method,
    const angles = Math.atan2(this.width, this.height); //y we r atan2 because it will return the angle in radians..
    points.push({
      // difference of center of the Car "X" and sine value of angles - car angle which is the initial side of the car
      x: this.x - Math.sin(this.angle - angles) * radius,
      // difference of center of the Car "Y" and cosine value of angles - car angle which is the end side of the car
      y: this.y - Math.cos(this.angle - angles) * radius,
    });
    points.push({
      // difference of center of the Car "X" and sine value of angles + car angle which is the initial side of the car
      x: this.x - Math.sin(this.angle + angles) * radius,
      // difference of center of the Car "Y" and cosine value of angles + car angle which is the end side of the car
      y: this.y - Math.cos(this.angle + angles) * radius,
    });
    points.push({
      // difference of center of the Car "X" and Pi value + sine value of angles - car angle which is the initial side of the car
      x: this.x - Math.sin(Math.PI + this.angle - angles) * radius,
      // difference of center of the Car "Y" and Pi value + cosine value of angles - car angle which is the end side of the car
      y: this.y - Math.cos(Math.PI + this.angle - angles) * radius,
    });
    points.push({
      // difference of center of the Car "X" and sine value of angles + car angle which is the initial side of the car
      x: this.x - Math.sin(Math.PI + this.angle + angles) * radius,
      // difference of center of the Car "Y" and cosine value of angles + car angle which is the end side of the car
      y: this.y - Math.cos(Math.PI + this.angle + angles) * radius,
    });
    return points;
  }

  #calcDamage(roadBorders, traffic) {
    // now we going to loop the roadBorders and see if the polygon intersect with it
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersection(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersection(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }
  draw(ctx, color,drawSensor = false) {
    // // first of all save
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);
    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();
    // ctx.restore(); //why we are restoring 'cause every animation, we need to (translate and rotate).... to infinite times.
    // // Now the sensors are ready
    // // Now we need to draw them with the car

    // Before Drawing we need to check if the car is damaged or not..
    if (this.damages) {
      ctx.fillStyle = "#D3CEDF";
    } else {
      ctx.fillStyle = color;
    }

    // Now we simply use the polgyon to shape our car model.
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor && drawSensor) {//if both sensor and drawSensor exists
      this.sensor.draw(ctx);
    }
  }
}
// Need to draw the car
