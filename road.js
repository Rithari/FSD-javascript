class Road {
  constructor(x, width, lanes = 3) {
    this.x = x;
    this.width = width;
    this.lanes = lanes;

    this.left = x - width / 2;
    this.right = x + width / 2;

    // Lovely JavaScript moment here - if the value is too high it literally breaks everything
    const infinity = 9999999;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  // Gets the center of a lane
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.lanes;
    // prevent the laneIndex from going out of bounds
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.lanes - 1) * laneWidth
    );
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.lanes - 1; i++) {
      // lerp is a function that interpolates between two values
      // lerp(a, b, t) = a + (b - a) * t
      const x = lerp(this.left, this.right, i / this.lanes);

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
