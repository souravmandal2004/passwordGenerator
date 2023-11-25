// Fetching all the elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector ("[data-lengthNumber]");
const passwordDisplay = document.querySelector ("[data-passwordDisplay]");
const copyBtn = document.querySelector ("[data-copy]");
const copyMsg = document.querySelector ("[data-copyMsg]");
const upperCaseCheck = document.querySelector ("#upperCase");
const lowerCaseCheck = document.querySelector ("#lowerCase");
const numbersCheck = document.querySelector ("#numbers");
const symbolsCheck = document.querySelector ("#symbols");
const indicator = document.querySelector ("[data-indicator]");
const generateBtn = document.querySelector (".generate-button");
const allCheckBox = document.querySelectorAll ("input[type=checkbox]");
const symbols = `!@#$%^&*()-=_+[]{}|;:',.<>/?~\"`



let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider ();
// set circle color to grey
setIndicator("#ccc")

// set passwordLength 
function handleSlider () {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min; // 1
    const max = inputSlider.max; // 20
    inputSlider.style.backgroundSize = ((passwordLength-min) * 100 / (max-min)) + "% 100%"; 
}


function setIndicator (color) {
    indicator.style.backgroundColor = color;
    // shadow h/w
}

function getRndInteger (min, max) {
    return Math.floor (Math.random () * (max-min)) + min;
}

function generateRandomNumber () {
    return getRndInteger (0, 9);
}

function generateLowerCase () {
    return String.fromCharCode (getRndInteger (97, 123));
}


function generateUpperCase () {
    return String.fromCharCode (getRndInteger (65, 91));
}

function generateSymbol () {
    const randNum = getRndInteger (0, symbols.length);
    return symbols.charAt(randNum);
}


function calcStrength () {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym= false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator ('#0f0');
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) || passwordLength >= 6) {
        setIndicator ('#ff0');
    }
    else {
        setIndicator ('#f00');
    }
}

// copy content
async function copyContent () {
    try {
        await navigator.clipboard.writeText (passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // To make the copy msg visible
    copyMsg.classList.add ('active');


    // To make the copy msg invisible
    setTimeout (() => {
        copyMsg.classList.remove ('active');
    }, 2000);
}
function shufflePassword (array) {
    // Fisher Yates method

    for (let i=array.length-1; i>0; i--) {
        const j = Math.floor (Math.random () * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach ((el) => (str += el));
    return str;

}

function handleCheckBoxChange () {
    checkCount = 0;
    allCheckBox.forEach ((checkbox) => {
        if (checkbox.checked) {
            checkCount ++;
        }
    });
    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider ();
    }
}

allCheckBox.forEach ((checkbox) => {
    checkbox.addEventListener ('change', handleCheckBoxChange);
})

inputSlider.addEventListener ('input', (e) => {
    passwordLength = e.target.value;
    handleSlider ();
});

copyBtn.addEventListener ('click', () => {
    if (passwordDisplay.value) 
        copyContent ();
});

generateBtn.addEventListener ('click', () => {
    // None of the checkboxes are selected
    if (checkCount <= 0)    return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider ();
    }

    //remove old password
    password = "";


    // if (upperCaseCheck.checked) {
    //     password += generateUpperCase ();
    // }
    // if (lowerCaseCheck.checked) {
    //     password += generateLowerCase ();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandomNumber ();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol ();
    // }

    let funArr = [];
    if(upperCaseCheck.checked) {
        funArr.push (generateUpperCase);
    }
    if(lowerCaseCheck.checked) {
        funArr.push (generateLowerCase);
    }
    if(numbersCheck.checked) {
        funArr.push (generateRandomNumber);
    }
    if(symbolsCheck.checked) {
        funArr.push (generateSymbol);
    }

    // compulsory
    for (let i=0; i<funArr.length; i++) {
        password += funArr[i] ();
    }

    // Remaining
    for (let i=0; i<passwordLength-funArr.length; i++) {
        let randIndex = getRndInteger (0, funArr.length);
        password += funArr[randIndex] ();
    }

    // shuffle the password
    password = shufflePassword (Array.from (password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength ();

});
