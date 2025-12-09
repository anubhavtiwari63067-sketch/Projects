// suppose in html "display" and 'error' IDsare elements.
let display = document.getElementById('display');
let errorBox = document.getElementById('error');
let currentInput = '';
let operator = '';
let operand = null;

function append(char) {
  errorBox.textContent = '';
  // Prevent multiple decimals
  if(char === '.' && currentInput.includes('.')) return;
  // Handle initial negative sign correctly
  if (currentInput === '' && char === '-' && operator === '') {
    currentInput = '-';
  } else if (char !== '-') {
    currentInput += char;
  }
  display.value = currentInput;
}

function operation(op) {
  errorBox.textContent = '';
  // Fix: Allow negative number input after clearing or starting
  if(currentInput === '' && op === '-') {
    currentInput = '-';
    display.value = currentInput;
    return;
  }
  
  if(currentInput === '' && operand === null) return; 

  if (operand === null) {
    // If currentInput is just '-', it should be treated as 0 or ignore the operator
    if (currentInput === '-') {
        operand = 0; 
    } else {
        operand = parseFloat(currentInput);
    }
    currentInput = '';
    operator = op;
    display.value = ''; // Clear display for next input
  } else {
    // Perform calculation using the previous operator
    calculate();
    // After calculation, the result is in currentInput, now set the new operator
    operand = parseFloat(currentInput);
    currentInput = '';
    operator = op;
    display.value = '';
  }
}

function special(type) {
  errorBox.textContent = '';
  if(currentInput === '' && operand === null) return;
  // Use the number currently being typed or the first operand if no number is being typed
  let value = parseFloat(currentInput || operand); 
  if (isNaN(value)) value = 0; // Fallback
  
  let result;

  switch(type) {
    case 'sqrt':
      if(value < 0) {
        errorBox.textContent = 'Negative √ not possible!';
        return;
      }
      result = Math.sqrt(value);
      break;
    case 'cubeRoot':
      result = Math.cbrt(value);
      break;
    case 'square':
      result = value * value;
      break;
    case 'percent':
      result = value / 100;
      break;
    default:
      return;
  }
  display.value = result;
  currentInput = result.toString();
  operand = null;
  operator = '';
}

function clearDisplay() {
  currentInput = '';
  operator = '';
  operand = null;
  display.value = '';
  errorBox.textContent = '';
}

function calculate() {
  errorBox.textContent = '';
  if(operator === '' || currentInput === '') return;
  
  let secondOperand = parseFloat(currentInput);
  let result;
  
  // Check if operand is still null, which shouldn't happen if logic is followed, but good to check
  if (operand === null) {
      operand = secondOperand;
      operator = '';
      currentInput = operand.toString();
      display.value = currentInput;
      return;
  }
  
  switch(operator) {
    case '+':
      result = operand + secondOperand;
      break;
    case '-':
      result = operand - secondOperand;
      break;
    case '*':
      result = operand * secondOperand;
      break;
    case '/':
      if(secondOperand === 0) {
        errorBox.textContent = 'Division by zero!';
        // Reset state after error
        clearDisplay(); 
        return;
      }
      result = operand / secondOperand;
      break;
    default:
      return;
  }
  
  // Display result and prepare for next operation
  display.value = result;
  currentInput = result.toString(); // Result becomes the new currentInput
  operand = null;
  operator = '';
}