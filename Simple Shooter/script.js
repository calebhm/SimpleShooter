var world = window.innerWidth;
var scl = (world / 10) || 70; //set a variable to scale the game to all screens
var x = world/2; // initial ship x value
var y = window.innerHeight; // initial ship y value
var thruster = 6; // value for ship thruster triangle drawn later
var t = 0.5; // interval of change for ship thruster
var shots = []; // array for storing and managing bullets
var enemy = []; // array for storing and managing enemies
var lvl = 1; // control for difficulty
var health = 1; // enemy health value
var score = 0;
var prevScore = 0; // controls flow of difficulty changes
var check; // boolean check for mobile device browser
var done = false; // control for end-game sequence
var resetTime = 0; // control for auto-reset at end of game
var hp = scl*4; // ship health value
var intervs = []; // super important for clearing all intervals at end

// make a canvas, draw a background, and check for mobile browser
function setup() {
    createCanvas(world, window.innerHeight);
    background(25);
    
    window.mobilecheck = function() {
  check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
    
    window.mobilecheck();
}

// p5js draw() loops repeatedly
function draw() {

    background(25);
    
    if (hp > 1) { // check to see if the ship still has hp
        
    // this is a global control for moving the ship with the mouse
    if (check === false && x!== mouseX && y!== mouseY) {
        x += (mouseX - x)*0.17;
        y += (mouseY - y)*0.17;
    } else if (check === true && x!== mouseX && y!== (mouseY - scl*1.3)) {
    
    // this control is specific to touch devices & movea the ship above the player's thumb
    $("canvas").bind('touchstart touchmove', function(e){
        e.preventDefault();
        x = mouseX;
        y = mouseY - scl*1.3;
    });
    }
    
    //just drawing the ship, thruster first
    noStroke();
    
    fill(255,153,51);
    triangle(x-scl/6, y, x, y+(scl/thruster), x+scl/6, y);
    
    fill(255);
    triangle(x-scl/3, y, x, y-scl/2, x+scl/3, y);
    
    thruster += t; //this & line 67-69 control the thruster animation
    
    if (thruster >= 10 && t == 0.5 || thruster <= 2 && t == -0.5) {
       t *= -1; 
    }
    
    // loop through the array of bullets, drawing them by frame
    for (k = shots.length-1; k >= 0; k--){
        stroke(255);
        fill(255);
        rect(shots[k].px, shots[k].py, shots[k].px2, shots[k].py2);
        shots[k].py -= 8; // move the bullet
        
        if (shots[k].py < 0){ // out of bounds? remove the bullet
            shots.splice(k, 1);
        }
        
        for (m = enemy.length-1; m >= 0; m--){ // hit an enemy? remove bullet, reduce enemy hp
                if (shots[k]) {
                if (dist(shots[k].px, shots[k].py, enemy[m].px, enemy[m].py) <= scl/4) {
                    shots.splice(k, 1);
                    enemy[m].hp--;
                }
            }
        }
    }

    // loop through the array of enemies, drawing them by frame
    for (m = enemy.length-1; m >= 0; m--){
            noStroke();
            fill(255,enemy[m].hp*51,51);
            ellipse(enemy[m].px, enemy[m].py, enemy[m].px2, enemy[m].py2);
            enemy[m].py += 1.6+(lvl*0.36); // move the enemy, increases speed with score
            
            // lines 100-106 keep enemies off the edge of screen
            if (enemy[m].px < scl/2) {
                enemy[m].px += scl/2;
            }
            
            if (enemy[m].px > world-scl/2) {
                enemy[m].px -= scl/2;
            }
            
            if (enemy[m].py >= window.innerHeight+scl){ // let an enemy past you? reduce hp a bit
                hp -= scl/8;
                enemy.splice(m, 1); // remove enemy
            }
            
            if (enemy[m]) { // check to see if the enemy is there still
                if (enemy[m].hp <= 0) { // enemy destroyed? add to score, add to hp, remove enemy
                    score++;
                    if (hp + scl/20 < scl*4) {
                        hp += scl/30;
                    }
                    enemy.splice(m, 1);
                }
                
                if (enemy[m]) {
                    if (dist(enemy[m].px, enemy[m].py, x, y) <= scl/1.7) { // enemy ran into you?
                        enemy.splice(m, 1); // remove enemy
                        hp -= scl/1.25; // reduce hp by a bigger factor than out-of-bounds enemy
                    }
                }
            }
        }
    
    if (score % 10 === 0 && score != prevScore) { //this whole if statement controls game flow
        if (score <= 50) {
            lvl += 1; // increase difficulty to a certain level as score goes up
        }
        
        prevScore = score; // set a control so the effects don't stack repeatedly
        
        if (score % 20 === 0 && score !== 0) {
            if (health <= 1) {
                health++; // add to enemy hp at a score of 20
            }
            if (score <= 20) {
                intervs.push(setInterval(shoot, 300 + (score*2.5))); // add to bullets shot
            }
            if (score <= 40) {
                intervs.push(setInterval(genemy, 1200 + (score*5))); // add to enemy generation
            }
        }
    }
 
 // draw the hp bar
    noStroke();
    fill(102);
    rect(5, 5, scl*4, scl/4)
    fill(255);
    rect(5, 5, hp, scl/4);
    
    fill(25);
    textSize(scl/5);
    textFont("Arial");
    textStyle(BOLD);
    text("HP", 6, 14);
    
    // regenerate hp slowly over time
    if (hp < scl*4) {
        hp += (scl/(900));
    }
    
    // draw the score
    fill(204);
    textSize(scl/3);
    textStyle(NORMAL);
    text("SCORE: " + score, 5, scl/1.5); 
    
    } else { // if hp is out, draw this stuff below instead
        fill(255);
        textFont("Arial");
        textStyle(NORMAL);
        textSize(scl*0.8);
        text("thank you for playing!", scl*1.15, window.innerHeight/4);
        textSize(scl);
        text("SCORE: " + score, scl*2.6, window.innerHeight/2.5);
        textSize(scl*0.7);
        text("automatic reset in progress", scl/1.5, window.innerHeight/1.2);
        
        if (resetTime === 0) {
            resetTime = 5000; // set a timer to reset the game
            done = true; // variable tells that the game is over
        }
        
        resetTime-=20; // reduce timer each frame
        
        // draw the auto-reset progress bar
        fill(102);
        rect(0, window.innerHeight-scl, window.innerWidth, scl/2);
        fill(255);
        rect(0, window.innerHeight-scl, map(resetTime, 0, 5000, 0, window.innerWidth), scl/2);
        
        // reset the entirety of the game when the timer is out and the game is over
        if (resetTime <= 0 && done) {
            hp = scl*4;
            score = 0;
            prevScore = 0;
            lvl = 1;
            health = 1;
            x = window.innerWidth/2;
            y = window.innerHeight;
            shots.length = 0;
            enemy.length = 0;
            
            if (intervs.length > 0) {
                for (i = intervs.length-1; i>=0; i--) {
                    window.clearInterval(intervs[i]);
                }
            }
            
            resetTime = 0;
            window.reload;
        }
    }
}

shoot = function() { // controls addition of bullets to array
    shots.push({px: x-2, py: y-6, px2: 2, py2: 4});
}

genemy = function() { // controls generation of enemies into array
    enemy.push({px: random(world), py: -scl, px2: scl/2, py2: scl/2, hp: health});
}

setInterval(shoot, 250); // interval for shooting
setInterval(genemy, 1000); // interval for enemy generation