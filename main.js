const canvas = document.getElementById("canvas");
canvas.width = 200;

let networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300; // We want the network to be larger than the car canvas

const carCtx = canvas.getContext("2d");
const netCtx = networkCanvas.getContext("2d");


const road = new Road(canvas.width / 2, canvas.width * 0.86);

const N = 1000; // number of cars
const cars = generateCars(N);
let bestCar = cars[0];

const traffic = [
  new Car(road.getLaneCenter(1),-100,30,50,"BOT",2),
  new Car(road.getLaneCenter(0),-300,30,50,"BOT",2),
  new Car(road.getLaneCenter(2),-300,30,50,"BOT",2),
  new Car(road.getLaneCenter(1),-1000,30,50,"BOT",2),
  new Car(road.getLaneCenter(1),-700,30,50,"BOT",2),
  new Car(road.getLaneCenter(3),-900,30,50,"BOT",2),
  new Car(road.getLaneCenter(1),-850,30,50,"BOT",2),
  new Car(road.getLaneCenter(2),-500,30,50,"BOT",2),
  new Car(road.getLaneCenter(0),-700,30,50,"BOT",2),

]

if(localStorage.getItem("bestBrain")) {
  for(let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if( i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1); // Amount of mutation
    }
  }
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30 ,50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for(let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find(c => c.y == Math.min(...cars.map(c=> c.y)));

  canvas.height = window.innerHeight; // resize here to reset it when animating
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + canvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 0.2;
  for(let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "green", true);

  carCtx.restore();

  netCtx.lineDashOffset = -time / 50;
  Visualiser.drawNetwork(netCtx, bestCar.brain); // Visualise the best car only
  requestAnimationFrame(animate); // requestAnimationFrame is a function that calls itself
}
