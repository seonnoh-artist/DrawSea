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
  sound = loadSound("./data/wave.mp3"); // p5.sound 라이브러리 사용
  
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

// ⭐ [PC용 잠금해제] p5.sound 문법에 맞게 완전 수정
function mousePressed() {
  // 오디오 엔진이 잠겨있다면 깨웁니다.
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  
  // 재생 중이 아닐 때만 루프 재생을 시작하여 소리 겹침을 방지합니다.
  if (sound && !sound.isPlaying()) {
    sound.loop();
    console.log("PC 오디오 재생 시작");
  }
}

// ⭐ [모바일용 잠금해제] p5.sound 문법에 맞게 완전 수정
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  
  if (sound && !sound.isPlaying()) {
    sound.loop();
    console.log("모바일 오디오 재생 시작");
  }
}

// ⭐ 마우스 드래그나 터치 이동 시에도 안전장치 유지
function touchMoved() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (sound && !sound.isPlaying()) {
    sound.loop();
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
