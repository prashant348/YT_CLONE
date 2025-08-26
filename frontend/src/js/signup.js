console.log("hello from signup.js");


const inputFields = document.querySelectorAll('.input-field');
const visibilityBtnBox = document.querySelector('.visibility-btn-box');
const visibilityBtn = document.querySelector('.visibility-btn')
const inputFieldPassword = document.querySelector('.input-field-password')
const img = visibilityBtn.children[0]


inputFields.forEach(inputField => {
    inputField.addEventListener('focus', () => {
        inputField.style.border = '1px solid #0078D7';
    });
    inputField.addEventListener('focusout', () => {
        inputField.style.border = '1px solid #363636';
    });
});

// console.log(visibilityBtn)


inputFieldPassword.addEventListener('focus', () => {
    inputFieldPassword.style.border = '1px solid #0078D7';
    inputFieldPassword.style.borderRight = 'none'
    visibilityBtnBox.style.border = '1px solid #0078D7'
    visibilityBtnBox.style.borderLeft = 'none'
});
inputFieldPassword.addEventListener('focusout', () => {
    inputFieldPassword.style.border = '1px solid #363636';
    inputFieldPassword.style.borderRight = 'none'
    visibilityBtnBox.style.border = '1px solid #363636'
    visibilityBtnBox.style.borderLeft = 'none'
});



let passwordVisible = false;
visibilityBtn.addEventListener('click', () => {

    if (!passwordVisible) {
        inputFieldPassword.setAttribute("type", "text");
        img.setAttribute("src", "/public/visibility_icon.svg")
        passwordVisible = true;
    } else {
        inputFieldPassword.setAttribute("type", "password");
        img.setAttribute("src", "/public/visibility_off_icon.svg")
        passwordVisible = false;
    };
});



// LOGIN BTN LOGIC

const loginBtn = document.querySelector('.login-btn');

loginBtn.addEventListener('click', () => {
    try {
        window.location.href = '/login';
    } catch (err) {
        console.log(err)
    }

});


// form-LOGIC 

// const form = document.querySelector('.form');

// data = new FormData(form);


const input = document.getElementById("username");

input.addEventListener("input", function () {
    // 1. lowercase me convert
    let value = input.value.toLowerCase();

    // 2. sirf alphabets, numbers, _ aur . allow karo
    value = value.replace(/[^a-z0-9._]/g, "");

    // 3. final value wapas input me set karo
    input.value = value;
});


// const formFields = document.querySelector('.form-fields');
const signupBtnBox = document.querySelector('.signup-btn-box');

// const validatePassword = (password) => {
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   return passwordRegex.test(password);
// };

// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.querySelector("form");
//     const passwordInput = document.querySelector('input[name="password"]');
//     const errorMsg = document.createElement("div");
//     errorMsg.className = "text-red-500 text-xs mb-1 text-center";
//     errorMsg.textContent = "Password is not strong enough!";


//     form.addEventListener("submit", (e) => {
//         if (!validatePassword(passwordInput.value)) {
//             e.preventDefault();
//             form.insertBefore(errorMsg, signupBtnBox);
//         } else {
//             errorMsg.textContent = "";
//         }
//     });
// });

const form = document.querySelector("form");

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload
    const username = form.querySelector('input[name="username"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    const msg = data.message // Backend response 

    const div = document.createElement('div');
    
    if (msg.includes("registered")) {
        div.className = 'text-green-500 text-xs text-center';
    } else {
        div.className = 'text-red-500 text-xs text-center';
    }
    
    div.textContent = msg;
    if (form.children.length === 8) {
        form.insertBefore(div, signupBtnBox);
    } else {
        form.children[3].remove();
        form.insertBefore(div, signupBtnBox);
    }
    
});




