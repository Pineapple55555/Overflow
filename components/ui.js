// Function to generate a random number between 1 and 100
export function generateRandomNumber() {
    //returns random line from the JSON file
    return Math.floor(Math.random() * 256) + 1;
  }
  
  // Function to update the UI with the generated random number
  export function updateTargetNumber() {
    const targetNumberElement = document.getElementById('target-number');
    const randomNumber = generateRandomNumber();
    targetNumberElement.textContent = 'Number:' + randomNumber;
  }
  
  // Call the update function when the page loads
  window.onload = function() {
    updateTargetNumber();
  };