let bg;
let degree = 0;
let yoff = 0.0; 
let dimension = 0.07;
let wave_up, wave_down;
let x_value = 0;
let curImg;
let angle = 0;
let preImg;
let starImg = [];
let starNum = 2;
let sound;
let theta = 0;
let tint_count = 0;
let chk = false;
let preX, preY; 

// ⭐ 페이드아웃 제어를 위한 타이머 변수
let fadeInterval = null;

function preload() {
  bg = loadImage("./data/sea.jpg"); 
  
  sound = new Audio("./data/wave.mp3"); 
  for (let i = 0; i < starNum; i++) {
    starImg[i] = loadImage("./data/star" + i + ".png");
  }
}

function setup() {
  pixelDensity(1); 
  createCanvas(windowWidth, windowHeight);
  wave_up = height / 3;
  wave_down = height / 2;

  image(bg, 0, 0, width, height, 0, 0, bg.width, bg.height);
  
  preImg = get();
  preImg.loadPixels();
  noStroke();
  tint(255, 10);
}

// 🎵 [소리 켜기] 누르고 있을 때 실행
function playAudio() {
  if (sound) {
    // 만약 페이드아웃이 진행 중이었다면 타이머를 취소합니다.
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
    
    // 소리가 멈춰있을 때만 처음부터 재생
    if (sound.paused) {
      sound.volume = 1.0; // 볼륨을 다시 최대(100%)로 설정
      sound.currentTime = 0; 
      sound.play().catch(e => console.log(e));
    }
  }
}

// 🔇 [소리 끄기] 손을 떼면 소리가 서서히 줄어들게 하는 함수 (페이드아웃)
function stopAudio() {
  if (sound && !sound.paused) {
    // 기존에 돌고 있던 페이드 타이머가 있다면 중복 방지를 위해 제거
    if (fadeInterval) clearInterval(fadeInterval);

    // 0.05초(50ms)마다 볼륨을 서서히 줄이는 타이머 가동
    fadeInterval = setInterval(() => {
      if (sound.volume > 0.05) {
        sound.volume -= 0.05; // 볼륨을 5%씩 계속 줄임
      } else {
        // 볼륨이 거의 0에 도달하면 완전히 일시정지하고 타이머 종료
        sound.pause();
        sound.volume = 1.0; // 다음 재생을 위해 볼륨 원상복구
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }, 50); // 50밀리초 주기
  }
}

// --- PC 마우스 인터랙션 제어 ---
function mousePressed() {
  playAudio();
}

function mouseReleased() {
  stopAudio(); 
}

// --- 모바일 터치 인터랙션 제어 ---
function touchStarted() {
  playAudio();
}

function touchMoved() {
  //playAudio(); 
  return false;
}

function touchEnded() {
  stopAudio(); 
  return false;
}

function draw() {
  curImg = get();
  curImg.loadPixels();

  if (tint_count < 10) {
    tint_count += 0.1;
    tint(255, tint_count);

    let xOffset = sin(angle) * random(10); 
    let yOffset = cos(angle) * height / 6; 

    angle += 0.05;
    image(preImg, 0 + xOffset, 0 - yOffset, preImg.width + xOffset, preImg.height + yOffset);
  } else {
    tint_count = 0;
  }
  noStroke();

  let b_x = int(random(0, curImg.width));
  let b_y = int(random(0, curImg.height)); 
  let b_loc = (b_x + b_y * curImg.width) * 4; 
  let p_red = curImg.pixels[b_loc + 0];
  let p_green = curImg.pixels[b_loc + 1];
  let p_blue = curImg.pixels[b_loc + 2]; 
  
  let random_r = random(30, 200);
  fill(p_red, p_green, p_blue, 50); 
  ellipse(b_x, b_y, random_r, random_r);

  if (mouseIsPressed == true) {
    tint_count = 0; 
    let x = mouseX;
    let y = mouseY;
    
    if (x >= 0 && x < curImg.width && y >= 0 && y < curImg.height) {
      let b_loc = (x + y * curImg.width) * 4; 
      let p_red = preImg.pixels[b_loc + 0];
      let p_green = preImg.pixels[b_loc + 1];
      let p_blue = preImg.pixels[b_loc + 2]; 

      tint(255, 255);
      let randomStar = random(starImg);
      let randomR = random(30, 70);
      image(randomStar, x, y, randomR, randomR);
      
      blend(preImg, 0, 0, curImg.width, curImg.height, 0, 0, width, height, LIGHTEST);
    }

    preX = x;
    preY = y;
    chk = true;
    tint_count = 0;
  } else {
    chk = false;
  }
}
