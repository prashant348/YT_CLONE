

console.log("hello from profile.js");

const userProfilePicBox = document.querySelector('.user-profile-pic-box');
const imageFileInput = document.querySelector('.image-file-input');
const img = userProfilePicBox.children[2];
const defaultImg = userProfilePicBox.children[1];


// ++++++++++++++++++++++++++++++++++++++++++++PROFILE PIC LOGIC++++++++++++++++++++++++++++++++++++++++++++
const wrapper = document.querySelector('.wrapper')
const profilePicModal = document.querySelector('.profile-pic-modal')
const profilePicModalbox = document.querySelector('.profile-pic-modal-box')
const profilePicModalChangeBtn = document.querySelector('.profile-pic-modal-change-btn')
const profilePicModalRemoveBtn = document.querySelector('.profile-pic-modal-remove-btn')

function profilePicModalPopUp() {
    try {
        profilePicModal.classList.remove('hidden')
        profilePicModal.classList.add('flex')
        wrapper.classList.add('blur-[2px]')
    } catch (e) {
        console.log(e)
    }
}

function profilePicModalPopDown() {
    try {
        profilePicModal.classList.remove('flex')
        profilePicModal.classList.add('hidden')
        wrapper.classList.remove('blur-[2px]')
    } catch (e) {
        console.log(e)
    }
}

userProfilePicBox.addEventListener('click', () => {
    try {
        profilePicModalPopUp();
    } catch (e) {
        console.log(e)
    }
    // imageFileInput.click();
});



profilePicModalChangeBtn.addEventListener('click', () => {
    try {
        imageFileInput.click();
        profilePicModalPopDown()
    } catch(e) {
        console.log(e)
    }
}); 

profilePicModalRemoveBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/profile/pic', {
            method: "DELETE", 
            credentials: 'include'
        });
        
        const data = res.json() 
        console.log(data)


        if (data.message === "No avatar to remove!") {
            alert("No avatar to remove!");
            bannerModalPopDown();
            return;
        }

        setTimeout(() => {
            window.location.reload();
        }, 500)
    } catch(e) {
        console.log(e)
    }
})

profilePicModal.addEventListener('click', (e) => {
    try {
        profilePicModalPopDown();
    } catch (err) {
        console.log(err)
    }
})

profilePicModalbox.addEventListener('click', (e) => {
    try {
        e.stopPropagation();
    } catch (err) {
        console.log(err)
    }
})

imageFileInput.addEventListener('change', async () => {

    const file = imageFileInput.files[0];
    console.log(file)
    const fileType = file.type.split("/")[0];

    if (fileType !== "image") {
        alert("Please select an image file.");
    } else {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/profile/pic', {
            method: "POST",
            credentials: 'include',
            body: formData
        });

        console.log(res)

        setTimeout(() => {
            window.location.reload();
        }, 500)

    };
});


const userDetailsBox = document.querySelector('.user-details-box');
const name = userDetailsBox.children[0];
const username = userDetailsBox.children[1];
const email = userDetailsBox.children[2];
// console.log(userDetailsBox.children) // html collection -> for each loop will not work
// console.log([...userDetailsBox.children]) // pure array using spread operator

async function loadUserDetails(tokenCookie) {
    try {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': tokenCookie
            }
        });

        const data = await res.json();
        console.log(data.user)
        const Name = data.user.name;
        const Username = data.user.username;
        const Email = data.user.email;

        [...userDetailsBox.children].forEach(child => {
            child.innerText = ""
        });

        name.innerText = Name;
        username.innerText = `@${Username}`;
        email.innerText = Email;

        if (data.user.avatar) {
            defaultImg.classList.add('hidden');
            img.classList.remove('hidden');
            img.setAttribute('src', data.user.avatar);

        } else {
            defaultImg.classList.remove('hidden');
            img.classList.add('hidden');
        }

    } catch (e) {
        console.log("Error in loading user details: ", e)
    }
};

async function checkUserLoggedIn() {
    // Find logged_in_token in cookies
    const cookies = document.cookie.split(';').map(c => c.trim());
    // console.log(cookies)
    const tokenCookie = cookies.find(c => c.startsWith('logged_in_token='));
    // console.log(tokenCookie)

    if (tokenCookie) {
        loadUserDetails(tokenCookie);

        return true;
    } else {
        return false;
    }
};
checkUserLoggedIn();

// ====================================================MODAL LOGIC====================================================

const logoutBtn = document.querySelector(".logout-btn")

const modal = document.querySelector('.modal');

const modalCancelBtn = document.querySelector('.modal-cancel-btn');
logoutBtn.addEventListener('click', () => {
    wrapper.classList.add('blur-[2px]')
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});

modalCancelBtn.addEventListener('click', () => {
    wrapper.classList.remove('blur-[2px]');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});

//  ================================================MODAL LOGOUT BTN LOGIC================================================

const modalLogoutBtn = document.querySelector('.modal-logout-btn');

// delete cookie token and redirect to home page

modalLogoutBtn.addEventListener('click', async (e) => {
    try {
        const res = await fetch('/api/auth/logout', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message); // Optional: show logout message
        window.location.href = '/'; // Redirect after logout
    } catch (err) {
        console.log("Logout error:", err);
        window.location.href = '/'; // Fallback redirect
    }
});





