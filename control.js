class Control {
  constructor(type) {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;
    switch (type) {
      case "F.R.I.D.A.Y":
        this.#addKeyboardListeners(); //# represents a private method. So that it cannot access form outside.
        break;
      case "HUMAN":
        this.forward = true;
        break;//shame on you 
    }
    // After this swtich case, we cannot catch the automate car because of the speed.. soo we are changing the maxspped for human adn friday...
  }
  #addKeyboardListeners() {
    // I used Arrow function => instead of normal one
    // this listeners is for when a key is pressed
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
      }
      //   console.table(this);
    };
    // this is for when the key is released
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
      }
      //   console.table(this);
    };
  }
}
