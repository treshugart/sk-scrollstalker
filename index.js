// Detect scollbar width.
const div = document.createElement('div');
div.style.overflow = 'scroll';
document.body.appendChild(div);
const scrollbarThickness = div.offsetWidth - div.clientWidth;
document.body.removeChild(div);

function getMaxCoords () {
  const body = document.body;
  const html = document.documentElement;
  const x = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    html.clientWidth,
    html.scrollWidth,
    html.offsetWidth
  );
  const y = Math.max(
    body.scrollHeight, 
    body.offsetHeight, 
    html.clientHeight, 
    html.scrollHeight, 
    html.offsetHeight
  );
  return { x, y };
}

function getWinCoords () {
  const x = window.innerWidth;
  const y = window.innerHeight;
  return { x, y };
}

function parseStyle (unit) {
  return parseFloat(unit.toString().replace(/[^\d]+/, ''));
}

skate('sk-scrollstalker', {
  created (elem) {
    elem.style.position = 'fixed';
    elem.__scroll = elem.__scroll.bind(elem);
  },
  attached (elem) {
    elem.__scroll();
    window.addEventListener('scroll', elem.__scroll);
    window.addEventListener('resize', elem.__scroll);
  },
  detached (elem) {
    window.removeEventListener('scroll', elem.__scroll);
    window.removeEventListener('resize', elem.__scroll);
  },
  prototype: {
    __scroll () {
      const style = window.getComputedStyle(this);
      const dCoords = getMaxCoords();
      const wCoords = getWinCoords();
      const scrollPercent = document.body.scrollTop / (dCoords.y - wCoords.y);
      const x = wCoords.x - this.offsetWidth - scrollbarThickness;
      const y = wCoords.y * scrollPercent - (this.offsetHeight * scrollPercent) - (parseStyle(style.marginTop) * scrollPercent * 2);
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
    }
  }
});
