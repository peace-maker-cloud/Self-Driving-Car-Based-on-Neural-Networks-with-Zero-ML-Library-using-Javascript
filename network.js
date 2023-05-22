// the layer levels are created, this time it's Nueral Networks
// this Neural netowrk is for to show the number of levels
class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    //take out first level that's y we take first array value of levels.
    for (let i = 1; i < network.levels.length; i++) {
      // y one because we already taken zeroth value of levels.
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
  static updation(network, amount = 1) {
    network.levels.forEach((level) => {
      // this is for biases
      for (let i = 0;i< level.biases.length; i++) {//shame on you i condition
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      // this is for weight
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}
// In neural Networks we have layers
class Level {
  constructor(inputCount, outputCount) {
    // inputs/outputs will have so many values so let's make it array
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    // every neurons has bias which fire electrical signals
    this.biases = new Array(outputCount);
    // Now in our brain, everything is connected so we are going to do by using weights
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }
    // Now we have connected all the output values for each input cells, and this is how nested array looks like
    // [[1,1,2,3],[4,6,7,9]]
    Level.#randomize(this);
  }
  //Now we are using a static private method
  static #randomize(level) {
    // why we are static method but not our usual method because we want to serialize the object, the method won't do that...
    // like this line ::::: this is how nested array looks like
    // [[1,1,2,3],[4,6,7,9]]
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        // for every input/output values, we need to set the value between -1 and 1
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      // set the same values between -1 and 1
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
  // now we need to compute the output using these biased and weights so, we are using feed forward algorithm..
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
        // Now to get the outputs, we are going to loop al the outputs to the nested loop of x
      }
      // the product  value will be
      //         sum += layer.inputs[j] * layer.weights[j][i]; //input of j and output of i
      //         // this repeats to every neurons....
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}
