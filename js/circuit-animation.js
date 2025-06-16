const { floor, random } = Math;

const con = {
  value: document.querySelector(".con"),
};

const svgCon = {
  value: document.querySelector(".svgCon"),
};

// Select colors based on current theme
function getCircuitColors() {
  const isDarkMode = document.documentElement.classList.contains("dark");

  if (isDarkMode) {
    return {
      stroke: "#3B82F6", // blue for wires
      bg: "#0a192f", // deep blue pcb
      pathBg: "#38F9D7", // teal for path
    };
  } else {
    return {
      stroke: "#fad33d", // gold for wires
      bg: "#2d2d60", // pcb green
      pathBg: "#63552a", // gold for path
    };
  }
}

// Initialize the animation
function initCircuitAnimation() {
  if (!con.value || !svgCon.value) return;

  // Get theme-based colors
  const colors = getCircuitColors();

  // Use the colors in your settings
  const settings = {
    size: 20,
    wireMaxLen: 40,
    ...colors,
    pathBloomLength: 8,
    bloomSpeed: 30,
    straightness: 2,
  };

  // Set PCB background color
  con.value.style.background = settings.bg;

  // Clear previous animation
  svgCon.value.innerHTML = "";

  const { width, height } = con.value.getBoundingClientRect();
  svgCon.value.setAttribute("width", `${width}`);
  svgCon.value.setAttribute("height", `${height}`);

  const rows = floor(height / settings.size);
  const cols = floor(width / settings.size);
  let availableNum = floor(rows * cols);
  const cells = [];
  const cellsMap = {}; // {'x,y': Cell}
  const wires = [];
  const dirs = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];

  class Cell {
    x = 0;
    y = 0;
    available = true;
    dirInd = floor(random() * dirs.length);
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  class Wire {
    cells = [];
    constructor(start) {
      start.available = false;
      this.cells.push(start);
      availableNum -= 1;
    }

    validNoCrossOver(c1, dirInd) {
      if ([0, 2, 4, 6].includes(dirInd)) return true;
      const checks = {
        1: [
          [c1.x, c1.y - 1],
          [c1.x + 1, c1.y],
        ],
        3: [
          [c1.x + 1, c1.y],
          [c1.x, c1.y + 1],
        ],
        5: [
          [c1.x - 1, c1.y],
          [c1.x, c1.y + 1],
        ],
        7: [
          [c1.x - 1, c1.y],
          [c1.x, c1.y - 1],
        ],
      };
      const [p3, p4] = checks[dirInd] || [];
      if (!p3) return false;
      const c3 = cellsMap[`${p3[0]},${p3[1]}`]?.available ?? true;
      const c4 = cellsMap[`${p4[0]},${p4[1]}`]?.available ?? true;
      return c3 && c4;
    }

    generate() {
      while (this.cells.length < settings.wireMaxLen) {
        const last = this.cells[this.cells.length - 1];
        const tries = random() < 0.5 ? [0, 1, -1] : [0, -1, 1];

        while (tries.length) {
          let dirInd =
            last.dirInd +
            tries.splice(
              floor(random() ** settings.straightness * tries.length),
              1
            )[0];
          dirInd = (dirInd + 8) % 8;
          const [dx, dy] = dirs[dirInd];
          const x = last.x + dx;
          const y = last.y + dy;
          const index = y * cols + x;
          const next =
            index >= 0 && index < cells.length ? cells[index] : false;

          if (
            x < 0 ||
            x >= cols ||
            y < 0 ||
            y >= rows ||
            !next ||
            !next.available ||
            !this.validNoCrossOver(last, dirInd)
          )
            continue;

          next.available = false;
          next.dirInd = dirInd;
          availableNum -= 1;
          this.cells.push(next);
          break;
        }
        if (tries.length === 0) break;
      }
    }

    draw() {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const circle1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      const circle2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      let d = "";
      const s = settings.size;
      const r = random() * (s / 6) + s / 12;

      [circle1, circle2].forEach((c, i) => {
        const width = i === 0 ? r / 4 : r / 2;
        c.setAttribute("r", `${r}`);
        c.setAttribute("stroke", settings.stroke);
        c.setAttribute("stroke-width", `${width}`);
        c.setAttribute("fill", random() > 0.5 ? settings.stroke : settings.bg);
      });

      this.cells.forEach((cur, i) => {
        const x = cur.x * s + s / 2;
        const y = cur.y * s + s / 2;
        if (i === 0) {
          d += `M ${x} ${y}`;
          circle1.setAttribute("cx", `${x}`);
          circle1.setAttribute("cy", `${y}`);
        }
        d += ` L ${x} ${y}`;
        if (i === this.cells.length - 1) {
          circle2.setAttribute("cx", `${x}`);
          circle2.setAttribute("cy", `${y}`);
        }
      });

      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", settings.stroke);
      path.setAttribute("stroke-width", `${r * 2}`);
      const length = path.getTotalLength();
      path.style.cssText = `
        --len: ${length};
        --len-1:${-length};
        --len_add_bloomLen:${length + settings.pathBloomLength};
        --animate-time:${(length / settings.bloomSpeed).toFixed(1)}s
      `;

      const isAnimated = random() > 0.5;
      if (isAnimated) {
        const bgPath = path.cloneNode(false);
        path.setAttribute("stroke", settings.pathBg);
        svgCon.value.append(bgPath);
      }
      path.classList.add(
        isAnimated ? "animated-path-repeat" : "animated-path-once"
      );
      svgCon.value.append(path, circle1, circle2);
    }
  }

  // Initialize cells
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = new Cell(x, y);
      cells.push(cell);
      cellsMap[`${x},${y}`] = cell;
    }
  }

  // Generate wires
  while (wires.length < availableNum) {
    const cell = cells[floor(random() * cells.length)];
    if (!cell.available) continue;
    const wire = new Wire(cell);
    wires.push(wire);
    wire.generate();
    wire.draw();
  }
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", initCircuitAnimation);

// Reinitialize on window resize
window.addEventListener("resize", initCircuitAnimation);

// Watch for theme changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class") {
      initCircuitAnimation();
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"],
});
