let bg;
let degree = 0;
let yoff = 0.0; // 2nd dimension of perlin noise
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
let preX, preY; // 누락되어 있던 변수 선언 추가

function preload() {
  bg = loadImage("./data/sea.jpg"); 
  // [수정] loadSound 라이브러리 함수가 누락되어 문자열만 들어가던 버그 수정
  sound = loadSound("./data/wave.mp3"); 
  
  for (let i = 0; i < starNum; i++) {
    starImg[i] = loadImage("./data/star" + i + ".png");
  }
}

function setup() {
  pixelDensity(1); // 기기 픽셀 밀도 고정(전체화면 픽셀 매칭 해결용)

  createCanvas(windowWidth, windowHeight);
  wave_up = height / 3;
  wave_down = height / 2;
  console.log(bg.width + " " + bg.height);

  image(bg, 0, 0, width, height, 0, 0, bg.width, bg.height);
  
  // Copy the image.
  preImg = get();
  preImg.loadPixels();
  noStroke();
  tint(255, 10);
}

function touchMoved() {
  // 모바일 환경에서 오디오가 루프 재생되도록 설정
  if (sound && !sound.isPlaying()) {
    sound.loop();
  }
}

// 1. 유저가 화면을 '터치하기 시작하는 순간' 오디오 잠금을 해제합니다.
function touchStarted() {
  // 브라우저의 오디오 엔진 상태가 꺼져있다면(suspended) 다시 깨웁니다.
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume().then(() => {
      console.log('오디오 재생 엔진이 성공적으로 활성화되었습니다.');
    });
  }
}

// 2. 기존의 touchMoved 또는 터치 인터랙션에서 사운드를 재생합니다.
function touchMoved() {
  // 오디오 엔진이 켜진 상태에서만 사운드 재생 시도
  if (getAudioContext().state === 'running') {
    if (sound && !sound.isPlaying()) {
      sound.loop(); // 또는 sound.play();
    }
  }
}

function draw() {
  curImg = get();
  curImg.loadPixels();

  // 틴트값을 조절해서 글씨 지운다.
  if (tint_count < 10) {
    tint_count += 0.1;
    tint(255, tint_count);

    // 꿀렁거리는 효과를 만들기 위해 이미지를 좌우로 움직입니다
    let xOffset = sin(angle) * random(10); // sine 함수를 사용하여 좌우로 이동
    let yOffset = cos(angle) * height / 6; // sine과 cos 함수를 조합하여 상하로 이동

    // 각도를 계속 증가시켜 애니메이션 효과를 줍니다
    angle += 0.05;
    image(preImg, 0 + xOffset, 0 - yOffset, preImg.width + xOffset, preImg.height + yOffset);
  } else {
    tint_count = 0;
  }
  noStroke();

  // 동그라미를 랜덤하게 뿌린다
  let b_x = int(random(0, curImg.width));
  let b_y = int(random(0, curImg.height)); 
  let b_loc = (b_x + b_y * curImg.width) * 4; // x행 y열의 픽셀 위치
  let p_red = curImg.pixels[b_loc + 0];
  let p_green = curImg.pixels[b_loc + 1];
  let p_blue = curImg.pixels[b_loc + 2]; 
  
  let random_r = random(30,200);
  fill(p_red, p_green, p_blue, 50); // 투명도는 50으로 낮게 설정
  ellipse(b_x, b_y, random_r, random_r);

  // 마우스나 터치가 상호작용 중일 때
  if (mouseIsPressed == true) {
    tint_count = 0; // 틴트값을 조절해서 글씨를 지운다.
    let x = mouseX;
    let y = mouseY;
    
    // 안전장치: 마우스가 화면 영역 안에 있을 때만 픽셀 데이터를 가져옴
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
