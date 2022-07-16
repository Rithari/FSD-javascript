class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 2.3;
    this.friction = 0.05;
    this.angle = 0;

    this.controls = new Controls();
  }

  update() {
    this.#move();
  }

  #move() {
    // Update speed based on directional input
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.backward) {
      this.speed -= this.acceleration;
    }

    // Invert the controls if the car is going backwards
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
    }

    // Update speed based on friction and also cap it at maxSpeed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 1.7) {
      this.speed = -this.maxSpeed / 1.7;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // Make sure speed is never smaller than the friction value (causes infinite moving)
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.filStyle = "#00ff00";
    ctx.fill();

    ctx.restore();
  }
}
