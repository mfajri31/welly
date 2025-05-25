let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse Move
    document.addEventListener('mousemove', (e) => {
      this.handleMove(e.clientX, e.clientY, paper);
    });

    // Touch Move
    document.addEventListener('touchmove', (e) => {
      if (this.holdingPaper) e.preventDefault();
      if (e.touches.length > 0) {
        this.handleMove(e.touches[0].clientX, e.touches[0].clientY, paper);
      }
    }, { passive: false });

    // Mouse Down
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;

      document.body.style.overflow = 'hidden'; // <--- cegah scroll halaman

      if (e.button === 2) this.rotating = true;
    });

    // Touch Start
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;

      document.body.style.overflow = 'hidden'; // <--- cegah scroll halaman
    });

    // Mouse Up
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
      document.body.style.overflow = 'auto'; // <--- balikin scroll halaman
    });

    // Touch End
    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
      document.body.style.overflow = 'auto'; // <--- balikin scroll halaman
    });

    // Gesture (rotation multi-touch, optional)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  handleMove(x, y, paper) {
    if (!this.rotating) {
      this.velX = x - this.prevX;
      this.velY = y - this.prevY;
    }

    const dirX = x - this.startX;
    const dirY = y - this.startY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength || 0;
    const dirNormalizedY = dirY / dirLength || 0;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevX = x;
      this.prevY = y;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
