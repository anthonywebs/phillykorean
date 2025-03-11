let runDraw = undefined; // draw closure

const runEveryX = freq => {
    let count = 0;
    return () => {
        count = (count + 1) % freq;
        return count === 0; 
    }
}

const displayAudioEffectInit = async () => {
  const canvas = document.getElementById('js-visualizer');
  const context = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const title = "Anthony";
  context.font = "192px SF_Pro_Display_Black";
  const titleWidth = context.measureText(title).width;
  const canvasCoverage = canvas.width < 600 ? 0.95 : 0.85;
  const titleRatio = canvasCoverage * (canvas.width > 1000 ? 1000 : canvas.width) / titleWidth;

  const titleHeight = 192 * titleRatio;
  const titleLeft = (canvas.width - titleWidth * titleRatio) / titleRatio / 2;
  context.lineWidth = 1;
  context.strokeStyle = 'rgb(255,255,255,0.6';

  // backgorund white lines
  for (let i = 0; i < canvas.width; i += 3){
    context.beginPath();
    context.moveTo(i, titleHeight);
    context.lineTo(i, 0);
    context.stroke();
    context.closePath();    
  }
  context.save();
  context.scale(titleRatio, titleRatio);

  context.globalCompositeOperation = 'destination-in';         
  context.fillText(title, titleLeft, 150);
  context.globalCompositeOperation = 'source-over'; 
  context.restore();
}

const displayAudioEffect = () => {
  const canvas = document.getElementById('js-visualizer');
  const context = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const isMobile = canvas.width < 540;

  const topCanvas = document.getElementById('js-top-visualizer');
  const topContext = topCanvas.getContext('2d');
  topCanvas.width = topCanvas.offsetWidth;
  topCanvas.height = topCanvas.width;
    
  // Connect the audio source to the analyser node
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const audioEl = document.getElementById('js-audio');
  const audioSource = audioContext.createMediaElementSource(audioEl);
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);

  // Set up the analyser node
  analyser.fftSize = 256; // default 256
  const bufferLength = analyser.frequencyBinCount - 38; // 90
  const dataArray = new Uint8Array(bufferLength); 

  const runThis = runEveryX(1); // 60fps

  let prevBarHeight = ArrayBuffer[0];

  const title = "Anthony";
  context.font = "192px SF_Pro_Display_Black";
  // context.letterSpacing = '-8px';
  const titleWidth = context.measureText(title).width;
  const canvasCoverage = isMobile ? 0.95 : 0.85;
  const titleRatio = canvasCoverage * (canvas.width > 1000 ? 1000 : canvas.width) / titleWidth;

  // const titleRatio = 1;
  const titleHeight = 192 * titleRatio;
  const titleLeft = (canvas.width - titleWidth * titleRatio) / titleRatio / 2;

  let vynilAngle = 25;
  const imgElem = document.getElementById('js-vynil');

  // for small top control
  const centerX = topCanvas.width / 2;
  const centerY = topCanvas.height / 2;
  const radius = isMobile ? 25 : 45; // Base radius of the circle
  const peakFactor = isMobile ? 0.2 : 0.3; // peak length
  const peakCount = 30; // number of points
  const peakMod = bufferLength / peakCount;
  const startX = 0;
      
    // Draw the js-visualizer
  const draw = () => {
    if (audioEl.paused) {
      // pauseMusic();
      return;
    }
    
    analyser.getByteFrequencyData(dataArray);
    imgElem.style.transform = `rotate(${vynilAngle}deg)`;
    let vynilSpeed = dataArray[0] / 64;
    vynilSpeed = vynilSpeed > 1 ? 1.5 : vynilSpeed;
    
    vynilAngle += vynilSpeed;
    if (vynilAngle >= 360) vynilAngle = 0;

    // if (runThis()) {
    if (true) { // for now, full fames 128fps
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // top control
      topContext.clearRect(0, 0, topCanvas.width, topCanvas.height);

      let x = 0;
      if (isMobile) x = -300; // move to left when playing in mobile

      context.fillStyle = '#000';            
      context.fillRect(0, 0, canvas.width, canvas.height);

      topContext.strokeStyle = '#ff5a00';

      topContext.lineWidth = isMobile ? 5: 7; // circle width
      topContext.lineJoin = "round";
      // clip circle
      topContext.beginPath();
      topContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
      topContext.stroke();
      topContext.closePath();
      topContext.clip();

      topContext.lineWidth = 5; // wave line width

      let togglePeak = -1;
      topContext.beginPath();
      topContext.moveTo(startX, centerY);


      for (let i = 0; i < bufferLength; i++) {
        // small top control
        if (i > 0 && i % peakMod === 0) {
          let dist = dataArray[i];
          dist = dist > 64 ? dist - 64 : 0; // make wave look bigger diff
          const peakY = dist * peakFactor * togglePeak;
          togglePeak *= -1;
          topContext.lineTo(startX + topCanvas.width * i / bufferLength, centerY - peakY);
        }

        const barHeight = dataArray[i]/128 * titleHeight * 0.5;
        const granCount = 9;
        const diff = (barHeight - prevBarHeight) / granCount;

        for (let i = 0; i < granCount; i++){
          context.beginPath();
          context.lineWidth = 1;
          context.strokeStyle = 'rgb(255,255,255,0.6)';
          context.moveTo(x + (i * 3), titleHeight);
          context.lineTo(x + (i * 3), 0);
          context.stroke();
          context.closePath();    

          context.beginPath();
          context.lineWidth = 4;
          context.moveTo(x + (i * 3), titleHeight);
          context.lineTo(x + (i * 3), titleHeight - (prevBarHeight + (i * diff)));
          context.strokeStyle = '#fff';
          context.stroke();
          context.closePath();    
        }
        prevBarHeight = barHeight;                
        x += 27;
      }

      topContext.stroke();
      topContext.closePath();

      context.save();
      context.scale(titleRatio, titleRatio);
      
      context.globalCompositeOperation = 'destination-in';        
      context.fillText(title, titleLeft, 150);
      context.globalCompositeOperation = 'source-over'; 
      context.restore();
    }

    requestAnimationFrame(draw);  // i don't want recursion, but no choice
  }

  return draw; // make closure
}

const playMusic = () => {
  const audioEl = document.getElementById('js-audio');
  audioEl.play();
  document.getElementById('js-play-text').classList.add('hidden');
  document.getElementById('js-play').classList.add('hidden');
  document.getElementById('js-top-play').classList.add('hidden');
  document.getElementById('js-top-visualizer').classList.remove('hidden');
  document.getElementById('js-pause').classList.remove('hidden');
  document.getElementById('js-ff').classList.remove('hidden');
  if (!runDraw) {
    runDraw = displayAudioEffect();
  }
  runDraw();
}

const playNext = () => {
  const audioEl = document.getElementById('js-audio');
  if (++SONG_TRACK === SONG_LIST.length) SONG_TRACK = 0;
  audioEl.src = SONG_LIST[SONG_TRACK].path;
  audioEl.play();    
}

const pauseMusic = () => {
  const audioEl = document.getElementById('js-audio');
  audioEl.pause();
  document.getElementById('js-play-text').classList.remove('hidden');
  document.getElementById('js-pause').classList.add('hidden');
  document.getElementById('js-ff').classList.add('hidden');
  document.getElementById('js-top-visualizer').classList.add('hidden');
  document.getElementById('js-top-play').classList.remove('hidden');
  document.getElementById('js-play').classList.remove('hidden');
}

const togglePlay = () => {
  const audioEl = document.getElementById('js-audio');
  if (audioEl.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

// scroll line effect function
// start 0.2, duration 0.2 
const lineEffect = (targetEl, screenHeight, start = 0.2, transition = 0.2) => {
  let opacity = 0;
  const top = targetEl.getBoundingClientRect().top;

  if (top > 0 && top < screenHeight) {
    if (top > screenHeight * (1 - start - transition)  && top < screenHeight * (1 - start)) {//upper bound
      opacity = (screenHeight * (1 - start) - top)/screenHeight / transition;
    } else if (top > screenHeight * start/2 && top < screenHeight * (start/2 + transition)) { // lower bound
      opacity = 1  - (screenHeight * (start/2 + transition) - top)/screenHeight / transition;
    } else if (top >= screenHeight * (start/2 + transition) && top <= screenHeight * (1 - start - transition)) {
      opacity = 1;
    }
    targetEl.style.opacity = opacity;
  }
}

// durationFr should be twice bigger than transitionFr
const bgEffect = (targetEl, bgEl, screenHeight, startFr = 0.5, durationFr = 1, transitionFr = 0.1, opacityWeight = 1) => {
  let opacity = 0;
  
  const top = targetEl.getBoundingClientRect().top;
  const halfHeight = screenHeight * 0.5;
  // order end < endMid < startMid < start
  const start = screenHeight * startFr;
  const end = screenHeight * (startFr - durationFr);
  const transFr = durationFr * transitionFr;
  const trans = screenHeight * transFr;
  const startMid = start - screenHeight * transFr;
  const endMid = end + screenHeight * transFr;
  
  if (top > end - halfHeight && top < start + halfHeight) {
    if (top > startMid && top < start) {
      opacity = (start - top)/trans;
    } else if (top > end && top < endMid) {
      opacity = (top - end)/trans;
    } else if (top >= endMid && top <= startMid) {
      opacity = 1;
    }
    bgEl.style.opacity = opacity * opacityWeight;
  }
}

const renderIntro = () => {
  const bodyWrEl = document.getElementById('js-body-wr');
  const screenWidth = bodyWrEl.offsetWidth;
  const screenHeight = bodyWrEl.offsetHeight;
  const innerEl = document.getElementById('js-body-inner');
  const introEl = document.getElementById('js-intro');
  const introWidth = introEl.offsetWidth;
  const isMobile = screenWidth < 540;
  let targetWidth = screenWidth * (screenWidth > 600 ? 0.75 : 0.8);
  if (screenWidth > 1200) targetWidth = 960;
  const startRatio = targetWidth / introWidth;

  let ratio = startRatio;
  introEl.style.transform = `translate(-50%, -50%) matrix(${ratio}, 0, 0, ${ratio}, 0, 0)`;

  // vynil init
  const vynilEl = document.getElementById('js-vynil-wr');
  const imgElem = document.getElementById('js-vynil');
  imgElem.style.transform = 'rotate(25deg)';

  // music eq init
  displayAudioEffectInit();

  const photoEl = document.getElementById('js-photo');
  const whiteEl = document.getElementById('js-white');
  const linksWrEl = document.getElementById('js-links-wr');
  const musicSectionEl = document.getElementById('js-music-section');
  // code
  const codeEl = document.getElementById('js-code');
  // const codeElHeight = codeEl.offsetHeight;
  let codeTargetWidth = screenWidth * (screenWidth > 600 ? 0.8 : 0.9);
  if (screenWidth > 1400) codeTargetWidth = 1200;
  const codeRatio = codeTargetWidth / codeEl.offsetWidth;
  codeEl.style.transform = `translate(-50%, -50%) matrix(${codeRatio}, 0, 0, ${codeRatio}, 0, 0)`;

  const topEl = document.getElementById('js-top-audio');

  // text scroll
  const j1 = document.getElementById('js-1');
  const j2 = document.getElementById('js-2');
  const j3 = document.getElementById('js-3');

  // scroll event
  bodyWrEl.addEventListener('scroll', () => {
    const vynilTop = vynilEl.getBoundingClientRect().top
    const innerTop = innerEl.getBoundingClientRect().top;
    const linksTop = linksWrEl.getBoundingClientRect().top;
    const scrollAmount = (innerTop > 0 ? 0 : -innerTop) + 1;
  
    ratio = startRatio + startRatio * scrollAmount * 48 / screenHeight;
    if (scrollAmount < screenHeight * 1.5) {
      introEl.style.opacity = 1;

      let bgOpacity = 0;
      if (scrollAmount > screenHeight) {
        bgOpacity = (scrollAmount - screenHeight)/screenHeight*2;
        if (bgOpacity > 0.9) bgOpacity = 1;
        if (bgOpacity < 0) bgOpacity = 0;
      }
      introEl.style.backgroundColor = `rgb(0, 0, 0, ${bgOpacity})`;
      introEl.style.transform = `translate(-50%, -50%) matrix(${ratio}, 0, 0, ${ratio}, 0, 0)`;  
    }

    const startPoint = isMobile ? 0.30 : 0.2;
    lineEffect(j1, screenHeight, startPoint, 0.2);
    lineEffect(j2, screenHeight, startPoint, 0.2);
    lineEffect(j3, screenHeight, startPoint, 0.2);
    
    // screenHeight, starting point, duration, transition time, opacity
    bgEffect(j1, codeEl, screenHeight, 0.3, 1.35, 0.4, 0.5);
    bgEffect(j2, photoEl, screenHeight, 1.3, 1.45, 0.4, 0.9);
    bgEffect(j3, musicSectionEl, screenHeight, 0.3, 1.1, 0.3, 1);

    // white link page
    if (linksTop < screenHeight && linksTop > 0) {
      let opacity = 0;
      const opacityStart = screenHeight * 0.6;  // link starting to show
      const opacityStop = screenHeight * 0.15;
      const duration = opacityStart - opacityStop;

      if (linksTop >= opacityStop && linksTop < opacityStart) {
        opacity = 1 - (linksTop - opacityStop)/duration;
      } else if (linksTop < opacityStop) {
        opacity = 1;
      }
      // linksWrEl.style.backgroundColor = `rgba(255, 255, 255, )`
      linksWrEl.style.opacity = opacity;
      // musicSectionEl.style.opacity = 1 - opacity;
      whiteEl.style.opacity = opacity;
    }

    if (vynilTop > -screenHeight * 0.5 && vynilTop < screenHeight * 0.4) {
      topEl.style.opacity = 0;
    } else {
      topEl.style.opacity = 1;
    }  
  });

}

const scrollToLinks = () => {
  const linksWrEl = document.getElementById('js-links-wr');

  // linksWrEl.scrollIntoView({ behavior: "smooth"});
  linksWrEl.scrollIntoView();
  linksWrEl.style.opacity = 1;
  document.getElementById('js-intro').style.opacity = 0; // hide name after scrolling
}

let count = 0 // test purpose

const startEventListener = e => {
  const audioEl = document.getElementById('js-audio');

  //form
  document.getElementById('js-contact-form').addEventListener('submit', handleSubmit);

  document.getElementById('js-play-text').addEventListener('click', playMusic);
  document.getElementById('js-top-play').addEventListener('click', playMusic);
  document.getElementById('js-top-play').addEventListener('dblclick', playNext);
  document.getElementById('js-play').addEventListener('click', playMusic);
  document.getElementById('js-top-visualizer').addEventListener('click', pauseMusic);
  document.getElementById('js-pause').addEventListener('click', pauseMusic);
  document.getElementById('js-ff').addEventListener('click', playNext);
  
  document.getElementById('js-vynil').addEventListener('click', togglePlay);
  document.getElementById('js-visualizer').addEventListener('click', togglePlay);

  document.getElementById('js-skip-intro').addEventListener('click', e => {
    e.preventDefault();
    scrollToLinks();
  });
  
  // when the user leaves the window
  if (document.visibilityState !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && !!runDraw) {
        // document.getElementById('js-log').textContent = `Before`;
        localStorage.setItem('resume', 'true');
        location.reload();
      }  else if (document.visibilityState === 'visible' && localStorage.getItem('resume') === 'true') {
        // document.getElementById('js-log').textContent = 'loading';
        scrollToLinks();
        audioEl.src = SONG_LIST[++SONG_TRACK].path;

        localStorage.setItem('resume', 'false');
      }
    });
  };

  // if (!audioEl) return;
  // audioEl.addEventListener('play', () => {
  //     console.log("AK: started");
  //     // displayAudioEffect();
  //     });

  audioEl.addEventListener('ended', () => {
    SONG_TRACK++;
    if (SONG_TRACK === SONG_LIST.length) SONG_TRACK = 0;
    audioEl.src = SONG_LIST[SONG_TRACK].path;
    audioEl.play();
  });

  document.getElementById('js-body-inner').addEventListener('click', e => {
    e.preventDefault();
  });
}


const handleSubmit = async e => {
  e.preventDefault();
  const form = document.getElementById('js-contact-form');
  const data = new FormData(e.target);

  try {
    const response = await fetch(event.target.action, 
        {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
            },
        }
    );
    
    if (response.ok) {
      form.reset();
      showNotice(true);
    } else {
        response.json().then(data => {
          showNotice(false);
          console.error("Server error", data);
        });
    }
  } catch (error) {
    showNotice(false);
    console.error("Unknown error", error);
  } 
}

const makeSongTrack = () => {
  // Function to shuffle an array (Fisher-Yates shuffle algorithm)
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Shuffle the array except for the first item
  SONG_LIST = [SONG_LIST[0], ...shuffleArray(SONG_LIST.slice(1))];

  const audioEl = document.getElementById('js-audio');
  const visitCountSr = localStorage.getItem('visitCount');
  let visitCount = visitCountSr ? parseInt(visitCountSr, 10) : 0;
 
  if (visitCount < 1) { // visit 1st time
    audioEl.src = './media/intro_voicebooking.m4a';
  } else if (visitCount < 2) { // visit 2nd time or less
    SONG_TRACK++;
    audioEl.src = SONG_LIST[SONG_TRACK].path;
  } else {
    SONG_LIST.sort((a, b) => Math.random() - 0.5);
    SONG_TRACK++;
    audioEl.src = SONG_LIST[SONG_TRACK].path;
    if (visitCount >= 5) visitCount = -1; // reset count
  }
  localStorage.setItem('visitCount', visitCount + 1);
}
   
const main = async () => {
  await loadFont();
  makeSongTrack();
  renderIntro();
  startEventListener();
}

main();