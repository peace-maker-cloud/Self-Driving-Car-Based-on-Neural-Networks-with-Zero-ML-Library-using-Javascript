// we are going to create road using class
class Road {
  constructor(x, width, roadLane = 3) {
    //paramaters are x-axis and width
    this.x = x;
    this.width = width;
    this.roadLane = roadLane;
    this.left = x - width / 2;
    this.right = x + width / 2;
    //we have finite road. Now, let's make it infinite...
    const infinity = 10000000;
    this.top = -infinity;
    this.bottom = infinity;

    // setting value for x and y using object
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    // Making the border in the road so that car will detect it as border of the road. these borders are made of array
    this.border = [
      // first thing is to form a segment
      // top of left and right side
      // bottom of left and right side
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }
  //   we need the car to be in center.so ,
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.roadLane;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.roadLane - 1) * laneWidth
    );
  }

  //   draw using context
  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    // create edge lane on left side
    // ctx.beginPath();
    // ctx.moveTo(this.left, this.top);
    // ctx.lineTo(this.left, this.bottom);
    // ctx.stroke();

    // // Now create the same for right side
    // ctx.beginPath();
    // ctx.moveTo(this.right, this.top);
    // ctx.lineTo(this.right, this.bottom);
    // ctx.stroke();

    // reADY to create roadLane
    for (let i = 1; i <= this.roadLane - 1; i++) {
      const x = lerp(
        this.left, //this is for start point
        this.right, //this is the end point
        // this line is going to divide the number of roadLane, it return from zero to one
        i / this.roadLane
      );
      //   for the lane dash

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    // Border initialization is done
    // Now create Border
    this.border.forEach((borders) => {
      ctx.beginPath();
      ctx.moveTo(borders[0].x, borders[0].y); // 0 represents left side of the road
      ctx.lineTo(borders[1].x, borders[1].y); // 1 represents right side of the road
      ctx.stroke();
    });
  }
}
