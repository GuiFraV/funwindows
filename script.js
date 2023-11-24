import { PathMe } from './path';

const stats = document.querySelector('.stats');
const clear = document.querySelector('.clear');
const video = document.querySelector('video');
const svg = document.querySelector('svg');
const path = document.querySelector('svg path');

function getScreens() {
  return Object.entries(window.localStorage)
    .filter(([key]) => key.startsWith('screen-'))
    .map(([key, value]) => [key, JSON.parse(value)]);
}

function getScreenId() {
  const existingScreens = Object.keys(window.localStorage)
    .filter((key) => key.startsWith('screen-'))
    .map((key) => parseInt(key.replace('screen-', '')))
    .sort((a, b) => a - b);
  return existingScreens.at(-1) + 1 || 1;
}

const screenId = `screen-${getScreenId()}`;

function setScreenDetails() {
  const windowDetails = {
    screenX: window.screenX,
    screenY: window.screenY,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    width: window.outerWidth,
    height: window.innerHeight,
    updated: Date.now(),
  };
  window.localStorage.setItem(screenId, JSON.stringify(windowDetails));
}

function displayStats() {
  if (!stats) return;
  const existingScreens = Object.fromEntries(getScreens());
  stats.innerHTML = JSON.stringify(existingScreens, null, ' ');
}

function restart() {
  console.log(timers);
  timers.forEach((timer) => window.clearInterval(timer));
  window.localStorage.clear();
  setTimeout(() => window.location.reload(), Math.random() * 1000);
}

function removeScreen() {
  console.log(`removing screen ${screenId}`);
  localStorage.removeItem(screenId);
}

function removeOld() {
  const screens = getScreens();
  for (const [key, screen] of screens) {
    if (Date.now() - screen.updated > 1000) {
      localStorage.removeItem(key);
    }
  }
}

function makeSVG() {
  const screenPath = new PathMe();
  svg?.setAttribute('viewBox', `0 0 ${window.screen.availWidth} ${window.screen.availHeight}`);
  svg?.setAttribute('width', `${window.screen.availWidth}px`);
  svg?.setAttribute('height', `${window.screen.availHeight}px`);
  svg?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
  video?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
  const screens = getScreens();
  screens
    .map(([key, screen]) => {
      const x = screen.screenX + screen.width / 2;
      const y = screen.screenY + screen.height / 2;
      return [key, { ...screen, x, y }];
    })
    .forEach(([key, screen], i) => {
      if (i === 0) {
        screenPath.moveTo(screen.x, screen.y);
      } else {
        screenPath.lineTo(screen.x, screen.y);
      }
    });

  screenPath.closePath();
  path?.setAttribute('d', screenPath.toString());
}

const timers = [];
function go() {
  timers.push(setInterval(setScreenDetails, 10));
  timers.push(setInterval(displayStats, 10));
  timers.push(setInterval(removeOld, 100));
  timers.push(setInterval(makeSVG, 10));
}

clear?.addEventListener('click', restart);
window.addEventListener('beforeunload', removeScreen);

function populateWebcam() {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    if (!video) return;
    video.width = window.screen.availWidth;
    video.height = window.screen.availHeight;
    video.srcObject = stream;
    video.play();
  });
}

go();

populateWebcam();
