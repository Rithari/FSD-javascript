let canvas = document.getElementById("canvas");
canvas.width = 200;

let networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300; // We want the network to be larger than the car canvas

const carCtx = canvas.getContext("2d");
const netCtx = networkCanvas.getContext("2d");


const road = new Road(canvas.width / 2, canvas.width * 0.86);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "BOT", 2)];

animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight; // resize here to reset it when animating
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "blue");
  }
  car.draw(carCtx, "black");

  carCtx.restore();

  netCtx.lineDashOffset = -time / 50;
  Visualiser.drawNetwork(netCtx, car.brain);
  requestAnimationFrame(animate); // requestAnimationFrame is a function that calls itself
}
