export class Ui {
    constructor() {
        // 8 bit binary
        this.currentBinary = null
    }

// Function to generate a random number between 1 and 100
    generateRandomNumber() {
    //returns random line from the JSON file
    return Math.floor(Math.random() * 256) + 1;
  }

  async returnBinary() {
    return this.currentBinary
  }
  
// Function to update the UI with the generated random number
    async updateTargetNumber() {
        const targetNumberElement = document.getElementById('target-number');
        const randomNumber = this.generateRandomNumber();
    
        // Fetch the binary representation
        const binaryRepresentation = await this.getBinaryRepresentation(String(randomNumber));
    
        // Check if binaryRepresentation is valid
        if (binaryRepresentation) {
        // Update the UI with the random number and binary representation
            targetNumberElement.textContent = 'Target: ' + randomNumber;
            this.currentBinary = binaryRepresentation.value
        } else {
        // If binary representation is not found
            targetNumberElement.textContent = 'Number: ' + randomNumber + ' Binary: Not found';
        }
    }

    async updateSegments(snakeList, isAlternateTheme = false) {
        const segmentsElement = document.getElementById('segments');
    
        // Convert array to a string (e.g., [1, 0, 1] → "101")
        let segmentsString = snakeList.join('');
    
        // ✅ Ensure it is always 8 characters by padding "0"s at the front
        let paddingLength = Math.max(0, 8 - segmentsString.length);
        let paddedZeros = '0'.repeat(paddingLength);
    
        // 🔥 Hell Mode: Change padded `0`s to Crimson, else use Default Grayish Blue
        let zeroColor = isAlternateTheme ? "#8f1e01" : "#636f7d";
    
        // ✅ Wrap padded 0s in a styled span
        let formattedString = `<span style="color: ${zeroColor};">${paddedZeros}</span>${segmentsString}`;
    
        // Update the UI
        segmentsElement.innerHTML = formattedString;
    }
    

  
    // Function to fetch JSON and find the binary representation
    async getBinaryRepresentation(number) {
        try {
            const response = await fetch('/components/binary.json');
            const data = await response.json();

            // Check if the number is found in the JSON data
            if (data.hasOwnProperty(number)) {
            return { key: number, value: data[number] };
            } else {
            console.warn("Number not found in the JSON file.");
            return null;  // Return null if number not found in the JSON
            }
        } catch (error) {
            console.error("Error loading JSON file:", error);
            return null;  // Return null if there's an error fetching the JSON
        }
    }
    // Function to update the UI with the points system
    async updatePoints(currentPoints) {
        const targetNumberElement = document.getElementById('points');
        targetNumberElement.textContent = 'Points:' + String(currentPoints);

        }
        updateFavicon(isAlternateTheme) {
            const favicon = document.querySelector("link[rel='icon']");
        
            if (!favicon) {
                console.error("❌ Favicon element not found!");
                return;
            }
        
            // ✅ Update the favicon
            favicon.href = isAlternateTheme ? "/assets/favicon_alternate.png" : "/assets/favicon_default.png";
        
            document.title = isAlternateTheme ? "Gernoverflow" : "Overflow";

            const body = document.body;
            const targetNumberElement = document.getElementById("target-number");
            const pointsElement = document.getElementById("points");
            const segmentsElement = document.getElementById("segments");
        
            if (isAlternateTheme) {
                // 🔥 Hell Mode: Crimson Text
                body.style.color = "#fc3705"; // Main text color
                if (targetNumberElement) targetNumberElement.style.color = "#fea993";
                if (pointsElement) pointsElement.style.color = "#fd6a44";
                if (segmentsElement) segmentsElement.style.color = "#fd6a44";
            } else {
                // 🔵 Default Mode: Beige Text
                body.style.color = "beige"; // Main text color
                if (targetNumberElement) targetNumberElement.style.color = "beige";
                if (pointsElement) pointsElement.style.color = "#c6defa";
                if (segmentsElement) segmentsElement.style.color = "#c6defa";
            }
    }
}