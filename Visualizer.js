class Visualizer {
  // creating a static method instead of constructor
  static drawNetwork(ctx, network) {
    // setting up the margin to 50
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;
    // Now let's do for Level 2
    const levelHeight = height / network.levels.length;
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );
        ctx.setLineDash([7,4])
      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["↑", "←", "→", "↓"] : []
      );
    }

    // // setting for first level
    // Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
  }
  static drawLevel(ctx, level, left, top, width, height, arrowlabel) {
    const right = left + width;
    const bottom = top + height;
    // we will have connecting nodes so let's give them a radius
    const nodeRad = 11;

    const { inputs, weights, outputs, biases } = level;
    //   now it's time for connections b/w input and output node
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 3;
        ctx.strokeStyle = getRGBa(weights[i][j]);
        ctx.stroke();
      }
    }
    // setting nodes for inputs
    for (let i = 0; i < inputs.length; i++) {
      // use interpolation lerp to structure lines to get X
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRad * 3, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRad, 0, Math.PI * 2);
      ctx.fillStyle = getRGBa(inputs[i]);
      ctx.fill();
    }
    // setting nodes for outputs
    for (let i = 0; i < outputs.length; i++) {
      // use interpolation lerp to structure lines to get X
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRad * 3, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRad, 0, Math.PI * 2);
      ctx.fillStyle = getRGBa(outputs[i]);
      ctx.fill();
      //   thisc is for biases
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRad * 2, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBa(biases[i]);
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (arrowlabel[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRad * 2 + "px Arial";
        ctx.fillText(arrowlabel[i],x,top)
        ctx.lineWidth = .5
        ctx.strokeText(arrowlabel[i],x,top)
      }
    }
  }
  //set node x method
  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
