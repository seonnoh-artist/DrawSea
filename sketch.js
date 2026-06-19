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
  
  // 1. 모바일/PC 보안 락을 가장 안정적으로 뚫는 브라우저 내장 Audio 객체 사용
  sound = new Audio("./data/wave.mp3"); 
  sound.loop = true; // 무한 반복 켜기
  
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

// ⭐ [PC/모바일 공통 오디오 활성화 장치]
// 사용자가 화면을 클릭하거나 터치하는 '최초의 순간'에 소리를 켭니다.
function startAudio() {
  // 이미 소리가 재생 중(playing)이라면 중복 실행하지 않고 그냥 통과 (소리 겹침 차단)
  if (sound && sound.paused) {
    sound.play()
      .then(() => console.log("오디오 재생 시작!"))
      .catch(e => {
        // 모바일 사파리 등 까다로운 환경 우회용 음소거 트릭
        sound.muted = true;
        sound.play().then(() => { sound.muted = false; });
      });
  }
}

// PC에서 마우스를 누를 때 실행
function mousePressed() {
  startAudio();
}

// 모바일에서 화면을 처음 터치할 때 실행
function touchStarted() {
  startAudio();
}

// 화면을 드래그하거나 문지를 때 실행
function touchMoved() {
  startAudio();
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
