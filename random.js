
const lines = [
    "being vulnerable is a little scary",
    "i'd take being scolded by you over silence",
    "do you ever wonder why people have favorite colors?",
    "i went on a car ride with my dad and i asked him what his favorite song was,",
    "i didn't get enough sleep again",
    "i look like my mom when she was younger, does that mean anything",
    "what's your favorite color?",
    "i miss hearing your voice",
    "who wants to read poetry, anyway?",
    "oh no the birds are chirping",
    "i wonder what missing people looks like for you",
    "i wish i was a bird",
    "who was the first poem about",
    "poetry in other languages are so beautiful but i wish i could understand them",
    "all the things lost in translation",
    "i'm really hungry these days",
    "if you could travel back in time, when would you go to",
    "my favorite colors are shades of sunsets. and blue",
    "i like icebreakers (i want to know things about all of you)",
    "i want to dream of my laoye and yeye more",
    "i wish i remembered my laolao enough to dream about her",
    "i don't like sad endings",
    "i hate cliffhangers",
    "what are my top five favorite smells... i think laundry is one",
    "what is the point of cliffhangers!! seriously",
    "a new day, a new horror, but still a new day",
    "isn't it weird how tomorrows will always come",
    "DO YOU REMEMBER BEING YOUNG AND FREE",
    "i miss being small",
    "there is a hunger in loneliness",
    "THERE IS POETRY IN EVERYTHING",
    "THERE IS POETRY IN THE WAY YOU DO THE DISHES",
    "i think happiness is easy to find (but i know it's easy to forget)",
    "i am still young and free",
    "let us keep our childhood whimsy, nurture the parts of us that ask 'why'",
    "there is a comfort in not knowing everything",
    "I WANT TO KNOW",
    "THERE IS POETRY IN YOUR LAUGH",
    "how quickly do people forget",
    "i wholeheartedly believe that if i drink enough hot water i won't get sick",
    "did food taste better as a kid? why is that",
    "i love making new playlists",
    "grief has shaped me as much as joy, as excitement, as hunger",
    "sitting alone and breathing is enough",
    "looking at photos can be enough",
];

let timeoutIds = [];
let isRunning = true;


const randomTextWrapper = document.createElement("div");
randomTextWrapper.id = "random-text-wrapper";
randomTextWrapper.style.position = "fixed";
randomTextWrapper.style.top = "0";
randomTextWrapper.style.left = "0";
randomTextWrapper.style.width = "100%";
randomTextWrapper.style.height = "100%";
randomTextWrapper.style.pointerEvents = "none"; 
randomTextWrapper.style.zIndex = "5"; 

function getRandomPosition() {
    // for text to not get cut off 
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 100);
    return { x, y };
}

function getRandomFontSize() {
    return Math.floor(Math.random() * 8) + 12;
}

function getRandomDuration() {
    return Math.floor(Math.random() * 7000) + 8000;
}

function getRandomDelay() {
    return Math.floor(Math.random() * 6000) + 2000;
}

function typeText(text, element, speed = 50) {
    let index = 0;
    element.textContent = "";
    
    function addLetter() {
        if (!isRunning) return;
        
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            const letterDelay = speed + Math.random() * 30 - 15;
            const typingTimeout = setTimeout(addLetter, letterDelay);
            timeoutIds.push(typingTimeout);
        }
    }
    addLetter();
}

function createTextElement() {
    if (!isRunning) return;
    
    // random array
    const text = lines[Math.floor(Math.random() * lines.length)];
    const position = getRandomPosition();
    const fontSize = getRandomFontSize();
    
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = `${position.x}px`;
    div.style.top = `${position.y}px`;
    div.style.background = "rgba(0, 0, 0, 0.7)";
    div.style.color = "white";
    div.style.padding = "8px 12px";
    div.style.borderRadius = "4px";
    div.style.fontFamily = "times";
    div.style.whiteSpace = "nowrap";
    div.style.fontSize = `${fontSize}px`;
    div.style.opacity = "0";
    div.style.transition = "opacity 0.8s ease";
    div.style.zIndex = "10";
    div.style.maxWidth = "80%";
    div.style.textShadow = "0 0 2px rgba(255,255,255,0.3)";
    div.style.pointerEvents = "none"; // Allow clicks to pass through
    
    // Add to the wrapper
    randomTextWrapper.appendChild(div);
    
    // Fade in
    setTimeout(() => {
        div.style.opacity = "1";
    }, 100);
    
    // Start typing animation
    typeText(text, div);
    
    // Duration before fading out
    const duration = getRandomDuration();
    const fadeTimeout = setTimeout(() => {
        if (div && div.style) {
            div.style.opacity = "0";
            
            // Remove from DOM after fade out completes
            const removeTimeout = setTimeout(() => {
                if (div && div.parentNode === randomTextWrapper) {
                    randomTextWrapper.removeChild(div);
                }
            }, 1000);
            
            timeoutIds.push(removeTimeout);
        }
    }, duration);
    
    timeoutIds.push(fadeTimeout);
    
    // Schedule next text appearance
    if (isRunning) {
        const nextTextTimeout = setTimeout(createTextElement, getRandomDelay());
        timeoutIds.push(nextTextTimeout);
    }
}

function startTextGeneration() {
    if (!isRunning) {
        isRunning = true;
    }
    createTextElement(); // Start immediately
}

function stopTextGeneration() {
    isRunning = false;
    
    // Clear all timeouts
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
    
    // Remove all text elements
    while (randomTextWrapper.firstChild) {
        randomTextWrapper.removeChild(randomTextWrapper.firstChild);
    }
}

// Initialize everything as soon as possible
function initializeRandomText() {
    // Add the wrapper to the body
    if (document.body) {
        document.body.appendChild(randomTextWrapper);
        // Start the text generation
        startTextGeneration();
    } else {
        // If body isn't ready yet, try again shortly
        setTimeout(initializeRandomText, 10);
    }
}

// Multiple ways to ensure the script runs
// Method 1: DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
    initializeRandomText();
});

// Method 2: Run immediately if document is already loaded
if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeRandomText();
}

// Method 3: Backup - run after a brief timeout
setTimeout(initializeRandomText, 500);

// Handle window resize
window.addEventListener("resize", () => {
    // Clear and restart to ensure text isn't positioned off-screen
    if (isRunning) {
        stopTextGeneration();
        setTimeout(startTextGeneration, 500);
    }
});

// Optional: Add keyboard controls to toggle the effect
document.addEventListener("keydown", (event) => {
    // Press 'Escape' to toggle text generation on/off
    if (event.key === "Escape") {
        if (isRunning) {
            stopTextGeneration();
        } else {
            startTextGeneration();
        }
    }
});