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

function preload() {
  bg = loadImage("./data/sea.jpg"); 
  sound = loadSound("./data/wave.mp3"); 
  
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

// 1. 손가락을 화면에 대는 순간
function touchStarted() {
  if (sound) {
    // ⭐ [핵심] 현재 사운드가 일시정지(paused) 상태일 때만 재생을 시작합니다.
    // 이미 재생 중이라면 중복으로 play()를 호출하지 않아 소리가 겹치지 않습니다.
    if (sound.paused) {
      sound.play()
        .then(() => console.log("파도 소리 재생 시작"))
        .catch(e => {
          // 모바일 브라우저의 첫 터치 제한을 풀기 위한 음소거 우회 코드
          sound.muted = true;
          sound.play().then(() => { sound.muted = false; });
        });
    }
  }
}

// 2. 손가락을 화면에서 문지를 때
function touchMoved() {
  // ⭐ 여기도 마찬가지로 소리가 '정지 상태일 때만' 재생 명령을 내립니다.
  if (sound && sound.paused) {
    sound.play().catch(e => console.log(e));
  }
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
