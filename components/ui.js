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
            targetNumberElement.textContent = 'Number: ' + randomNumber + ' Binary: ' + binaryRepresentation.value;
            this.currentBinary = binaryRepresentation.value
        } else {
        // If binary representation is not found
            targetNumberElement.textContent = 'Number: ' + randomNumber + ' Binary: Not found';
        }
    }

  
    // Function to fetch JSON and find the binary representation
    async getBinaryRepresentation(number) {
        try {
            const response = await fetch('/components/binary.json');
            const data = await response.json();

            console.log("number", number);
            console.log(response);

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
    }