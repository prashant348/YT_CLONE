
console.log("hello from login.js");


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


const loginBtnBox = document.querySelector('.login-btn-box');
const form = document.querySelector("form");

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload
    const usernameOrEmail = form.querySelector('input[name="usernameOrEmail"]').value?.trim();
    const password = form.querySelector('input[name="password"]').value?.trim();
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password })
    });
    const data = await res.json();
    const msg = data.message // Backend response 

    


    const div = document.createElement('div');

    if (msg.includes("successful")) {
        div.className = 'text-green-500 text-xs text-center';
        setTimeout(() => {
            window.location.href = '/';
        }, 1000)
    } else {
        div.className = 'text-red-500 text-xs text-center';
    }

    div.textContent = msg;
    if (form.children.length === 6) {
        form.insertBefore(div, loginBtnBox);
    } else {
        form.children[3].remove();
        form.insertBefore(div, loginBtnBox);
    }
    
});

form.addEventListener('submit', () => {
    fetch('/api/profile', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => console.log(data));
})