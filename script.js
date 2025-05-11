document.addEventListener("DOMContentLoaded", function() {
    // Box 1: Disappearing words
    const disappearingText = document.getElementById("disappearing-text");
    const paragraphs = disappearingText.querySelectorAll("p");
    
    paragraphs.forEach(paragraph => {
        const words = paragraph.textContent.split(" ");
        paragraph.textContent = "";
        
        words.forEach((word, index) => {
            const span = document.createElement("span");
            span.textContent = word + (index < words.length - 1 ? " " : "");
            paragraph.appendChild(span);
            
            // Add mouseover event to permanently hide the word
            span.addEventListener('mouseenter', function() {
                this.style.visibility = 'hidden';
            });
        });
    });

    // Box 2: Traveling letters
    const travelingText = document.getElementById("traveling-text");
    const travelParagraphs = travelingText.querySelectorAll("p");
    
    travelParagraphs.forEach(paragraph => {
        const characters = paragraph.textContent.split("");
        paragraph.textContent = "";
        
        characters.forEach(char => {
            const span = document.createElement("span");
            span.textContent = char;
            paragraph.appendChild(span);
            
            span.addEventListener('mouseenter', function() {
                // Get current position
                const rect = this.getBoundingClientRect();
                
                // Create a traveling letter that will move off-screen
                const travelingLetter = document.createElement('span');
                travelingLetter.textContent = this.textContent;
                travelingLetter.className = 'traveling-letter';
                travelingLetter.style.top = rect.top + 'px';
                travelingLetter.style.left = rect.left + 'px';
                travelingLetter.style.fontFamily = '"Times New Roman", Times, serif';
                travelingLetter.style.color = 'white';
                
                // Add to body
                document.body.appendChild(travelingLetter);
                
                // Make original letter permanently invisible
                this.style.visibility = 'hidden';
                
                // Remove traveling letter after animation
                setTimeout(() => {
                    if (document.body.contains(travelingLetter)) {
                        document.body.removeChild(travelingLetter);
                    }
                }, 8000);
            });
        });
    });

    // Box 3: Letters forming a circle and rippling outwards
    const sentences = document.querySelectorAll('#circle-text span');
    
    sentences.forEach(sentence => {
        // Flag to track if this sentence has been animated
        let animated = false;
        
        sentence.addEventListener('mouseenter', function() {
            // Prevent multiple animations on rapid mouse movements
            if (animated) return;
            animated = true;
            
            // Get the text content and position
            const text = this.textContent;
            const rect = this.getBoundingClientRect();
            
            // Center point for the circle
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Create a container for the animated letters
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '200';
            document.body.appendChild(container);
            
            // Hide original text permanently
            this.style.visibility = 'hidden';
            
            // Create and position each letter
            for (let i = 0; i < text.length; i++) {
                // Skip spaces but maintain their timing
                if (text[i] === ' ') continue;
                
                // Calculate position in the original text
                let charPos = 0;
                for (let j = 0; j < i; j++) {
                    charPos += this.textContent[j] === ' ' ? 3 : 9; // Approximate character width
                }
                
                // Create letter element
                const letter = document.createElement('div');
                letter.textContent = text[i];
                letter.className = 'letter-circle';
                
                // Position at original location
                letter.style.left = (rect.left + charPos) + 'px';
                letter.style.top = rect.top + 'px';
                
                // Calculate angle for this letter around the circle (spread letters evenly)
                const angle = (i / text.length) * 360;
                
                // Set custom properties for the animation
                letter.style.setProperty('--rotation', angle + 'deg');
                letter.style.setProperty('--distance', '200px');
                
                // Add to container and schedule animation with staggered delay
                container.appendChild(letter);
                
                // Stagger the animation start for each letter
                setTimeout(() => {
                    letter.style.animation = 'circle-ripple 4s ease-out forwards';
                }, i * 50);
            }
            
            // Only reset the animation flag, but don't restore visibility
            setTimeout(() => {
                animated = false; // Reset animation flag
            }, 1000);
            
            // Remove the container after animations complete
            setTimeout(() => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 5000);
        });
    });
});