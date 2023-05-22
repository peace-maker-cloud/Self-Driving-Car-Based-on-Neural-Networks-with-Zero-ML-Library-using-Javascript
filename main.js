// localStorage.clear();
// To create a road inc height
const carCanvas = document.getElementById("carCanvas");

carCanvas.width = 200;

// For network canvas
const networkCanvas = document.getElementById("networkCanvas");

networkCanvas.width = 600;

//Create  a car in 2d
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
// Create a road using road.js
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.95);
// Create a model for car using car.js
const N = 100;
const cars = dupCars(N);
// we are going to create traffic to make the car model look like realtime..
const traffic = [
  new Car( //this is for car 1
    road.getLaneCenter(0),
    -carCanvas.width + 100,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 2
    road.getLaneCenter(1),
    -carCanvas.width - 200,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 3
    road.getLaneCenter(2),
    -carCanvas.width - 50,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 4
    road.getLaneCenter(1),
    -carCanvas.width - 400,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 5
    road.getLaneCenter(0),
    -carCanvas.width - 600,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 6
    road.getLaneCenter(2),
    -carCanvas.width - 640,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 7
    road.getLaneCenter(3),
    -carCanvas.width - 700,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 8
    road.getLaneCenter(0),
    -carCanvas.width - 800,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 9
    road.getLaneCenter(0),
    -carCanvas.width - 950,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 10
    road.getLaneCenter(1),
    -carCanvas.width - 950,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  new Car( //this is for car 11
    road.getLaneCenter(2),
    -carCanvas.width - 1150,
    carCanvas.width / 6.67,
    carCanvas.width / 4,
    "HUMAN",
    2
  ),
  
];
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].AIbrain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.updation(cars[i].AIbrain, 0.2);
    }
  }
}
// car.draw(ctx);

// car and control methods are done Now, Let's animate

// create a function animate
animate();

function save() {
  // we are now saving them in the local storage using javascript and JSON
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.AIbrain));
}
function discard() {
  localStorage.removeItem("bestBrain");
}
// Now we are going to create probability/possibility of cars by,
function dupCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(
      new Car(
        road.getLaneCenter(1),
        carCanvas.width / 2,
        carCanvas.width / 6.67,
        carCanvas.width / 4,
        "F.R.I.D.A.Y"
      )
    );
  }
  return cars;
}

function animate(time) {
  // display the traffic cars
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.border, []); //why we are using [] becauseif we put any value, our model gets interacte with itself so it's gets damaged, we don't need that.
  }
  //we need set the borders in the road update them in this car.js
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.border, traffic);
  }
  // getting the best car
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  // Explanation : Math.min will create a new array which has the y values and get the min value from this new array and find function will get if y values of cars and minimum value of new array are equal
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  // before drawing the road and car, save and translate them
  carCtx.save();
  // ctx.translate(0,-car.y+canvas.height*0.5)
  //to set the car model's position...use canvas's height to 50%
  // but we need to see in a better view move it to 80%
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);
  road.draw(carCtx);
  // Draw and display the traffic cars
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "green"); //this one is for traffic cars
  }
  // setting opacity
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "orange"); //this color is for our car
  }
  carCtx.globalAlpha = 1;
  // set sensor for one car
  bestCar.draw(carCtx, "orange", true);
  carCtx.restore();
  // setting dash animation
  networkCtx.lineDashOffset = -time / 50; // y we are giving the negative time, because we have given feed forward, so if you set a positive value up to bottom,but we need it input to output.
  Visualizer.drawNetwork(networkCtx, bestCar.AIbrain);
  requestAnimationFrame(animate);
}
