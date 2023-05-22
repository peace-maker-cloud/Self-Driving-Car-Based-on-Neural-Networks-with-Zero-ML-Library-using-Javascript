function lerp(a, b, t) {
  //lerp is nothing but linear interpolation
  return a + (b - a) * t;
}
// Intersection function for collision detection
function getIntersection(A, B, C, D) {
  const ttop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x); //Difference between DC(x) * AC(y) and vice versa
  const utop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y); //Difference between CA(y) * AB(x) and vice versa
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y); //Difference between DC(y) * BA(x) and vice versa
  if (bottom != 0) {
    const t = ttop / bottom;
    const u = utop / bottom;
    if (t >= 0) {
      if (t <= 1) {
        // t's condition is done
        if (u >= 0) {
          if (u <= 1) {
            //u's condition is done
            return {
              // find the linear interpolation for this intersection and setting them as object
              x: lerp(A.x, B.x, t),
              y: lerp(A.y, B.y, t),
              offset: t,
            };
          }
        }
      }
    }
  }
  return null;
}

function polyIntersection(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length], //why we are using % because in i+1 the array doesn't exist so it will throw an error. to rectify that, % will return as zero.
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBa(value) {
  const alpha = Math.abs(value); // the value comes between -1 to 1. if it comes to 0,the line won't show.
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 200;
  return `rgba(${R},${G},${B},${alpha})`; //which is red blue green alpha or opacity...
}
