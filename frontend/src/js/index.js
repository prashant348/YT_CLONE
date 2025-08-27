

console.log("Hello from index.js");

// ============================================DESKTOP-SEARCH-BAR-LOGIC============================================
const desktopSrchBar = document.querySelector('.desktop-srch-bar');

desktopSrchBar.addEventListener("focus", () => {
    desktopSrchBar.style.border = '1px solid #0078D7';
});

desktopSrchBar.addEventListener("focusout", () => {
    desktopSrchBar.style.border = '1px solid #323232';
});


// MOBILE-SEARCH-BAR-LOGIC
const mobileSrchBar = document.querySelector('.mobile-srch-bar');
mobileSrchBar.addEventListener("focus", () => {
    mobileSrchBar.style.border = '1px solid #0078D7';
});

mobileSrchBar.addEventListener("focusout", () => {
    mobileSrchBar.style.border = '1px solid #323232';
});


// --------------------------------------------------------SIDEBAR-TOGGLEBTN-LOGIC--------------------------------------------------------
const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');
const mainWrapper = document.querySelector('.main-wrapper');
const btnTexts = document.querySelectorAll('.btn-text');

// from channel.html
const channelContentArea = document.querySelector('.channel-content-area');
console.log(channelContentArea)

let collapse = false;
toggleBtn.addEventListener('click', () => {
    if (collapse) {
        if (channelContentArea) {
            channelContentArea.classList.add("md:px-8")
            channelContentArea.classList.remove("md:px-28")
        }
     

        btnTexts.forEach(btntext => {
            btntext.style.display = 'block';
        });
        mainWrapper.style.gridTemplateColumns = '240px 1fr';

        collapse = false;
    } else {
      
        if (channelContentArea) {
            channelContentArea.classList.remove("md:px-8")
            channelContentArea.classList.add("md:px-28")
        }
   
        
        btnTexts.forEach(btntext => {
            btntext.style.display = 'none';
        });
        mainWrapper.style.gridTemplateColumns = '72px 1fr';
        
        collapse = true;
    }

});

// ---------------------------------------------------MOBILE-SEARCH-BTN-LOGIC---------------------------------------------------
const contentArea = document.querySelector('.content-area');
const mobileSrchBtn = document.querySelector('.mobile-srch-btn');
const mobileSrchBarBox = document.querySelector('.mobile-srch-bar-box');
const navbarWrapper = document.querySelector('.navbar-wrapper');
const bottomNavbar = document.querySelector('.bottom-navbar');
// from channel.html
const channelBox = document.querySelector('.channel-box');

mobileSrchBtn.addEventListener('click', () => {
    navbarWrapper.style.display = 'none';
    bottomNavbar.style.display = 'none';
    try {
        contentArea.style.display = 'none';
        channelBox.style.display = 'none';
    } catch (e) {
        console.log("e")
    }
    
    mobileSrchBarBox.style.display = 'flex';
    
    mobileSrchBar.focus();
});

// ---------------------------------------------MOBILE-SEARCH-BAR-BOX-CLOSE-BTN-LOGIC---------------------------------------------
const mobileSrchBarBackBtn = document.querySelector('.mobile-srch-bar-back-btn');
mobileSrchBarBackBtn.addEventListener('click', () => {
    mobileSrchBarBox.style.display = 'none';
    navbarWrapper.style.display = 'flex';
    try {
        contentArea.style.display = '';
        channelBox.style.display = '';
    } catch (e) {
        console.log("e")
    }
    bottomNavbar.style.display = '';
});


// -----------------------------------------CHANGES WHILE WINDOW RESIZING-----------------------------------------
window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
        mobileSrchBarBox.style.display = 'none';
        navbarWrapper.style.display = 'flex';
    } else {
        if (navbarWrapper.style.display === "flex") {
            bottomNavbar.style.display = '';
        }
    }
});

// ------------------------------------------SIGNUP-BTN-LOGIC------------------------------------------
const signupBtn = document.querySelector('.signup-btn');
signupBtn.addEventListener('click', () => {
    try {
        window.location.href = '/signup';
    } catch (err) {
        console.log(err)
    }
    
});

// ===========================================CREATE-BTN-LOGIC===========================================
const mobileCreateBtn = document.querySelector('.mobile-create-btn');
const desktopCreateBtn = document.querySelector('.desktop-create-btn');
const createBtns = [mobileCreateBtn, desktopCreateBtn]
function createBtnsWork() {
    createBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                window.location.href = '/upload';
            } catch (err) {
                console.log(err)
            };
            
        });
    });
};


// ===========================================PROFILE BTN LOGIC===========================================
const mobileProfileBtn = document.querySelector('.mobile-profile-btn');
const desktopProfileBtn = document.querySelector('.desktop-profile-btn');
const profileBtns = [mobileProfileBtn, desktopProfileBtn]

function profileBtnsWork() {
    profileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                    window.location.href = '/profile'; 
            } catch (err) {
                console.log(err)
            };
            
        });
    });
};

 
// ============================================CHECK IF USER IS LOGGED IN============================================
function checkUserLoggedIn() {
    // Find logged_in_token in cookies
    const cookies = document.cookie.split(';').map(c => c.trim());
    // console.log(cookies)
    const tokenCookie = cookies.find(c => c.startsWith('logged_in_token='));
    // console.log(tokenCookie)

    if (tokenCookie) {
        signupBtn.classList.add('hidden');
        createBtnsWork();
        profileBtnsWork();
        return true;
    } else {
        signupBtn.classList.remove('hidden');

        return false;
    }
};
checkUserLoggedIn();


// ============================================================HOME BTN LOGIC============================================================

const homeBtns = document.querySelectorAll('.home-btn')
console.log(homeBtns)

homeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(() => {
            window.location.href='/'
        }, 500)
    })
})


// ==============================================PROFILE PIC IN PROFILE BTN LOGIC==============================================

async function loadAavatar() {

    try {
        const res = await fetch("/api/profile", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include'
            } 
        });

        const data = await res.json();
        console.log(data.user.avatar)

        
        if (data.user.avatar) {
            profileBtns.forEach(btn => {
                const imgBox = btn.children[1];

                btn.children[0].classList.add('hidden');
                imgBox.classList.remove('hidden');
                imgBox.children[0].setAttribute('src', data.user.avatar);

            })

            return data.user.avatar;
        }
        
    } catch (e) {
        console.log(e)
    }

}

loadAavatar()

// +++++++++++++++++++++++++++++++++++++++++++++++CHANNEL BTN LOGIC+++++++++++++++++++++++++++++++++++++++++++++++


const channelBtn = document.querySelector('.channel-btn');



channelBtn.addEventListener('click', async () => {
    try {
        window.location.href = '/channel';
    } catch (err) {
        console.log(err)
    }

});






// ---------------------------------------------SHOW ALL THE POST ON HOME PAGE---------------------------------------------


// async function makePostAvatarUpdated() {
//     try {
//         const res = await fetch("/api/user", {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json',
//                 credentials: 'include'
//             }
//         });

//         const data = await res.json();
//         // console.log(data)
//         const avatar = data.user.avatar;
//         // console.log(avatar)
//         return avatar;

//     } catch (e) {
//         console.log(e)
//     }
// }

// makePostAvatarUpdated()



async function getAllPosts() {
    try {
        const res = await fetch('/api/all-posts', {
            method: "GET", 
            credentials: "include"
        });

        const data = await res.json()
        const allPosts = data.posts
        const avatar = await loadAavatar()

        allPosts.forEach(post => {
            const postTitle = post.title
            const postContent = post.content
            const postAuthor = post.author
            const postDate = post.createdAt.split('T')[0]
            // const postAvatar = post.avatar

            const html = `
                <div class="post w-full mb-3 bg-[#212121] rounded-xl p-3 flex flex-col border border-[#363636]">
                    <div class="post-Author flex items-center gap-3 flex-wrap">
                        <div class="default-post-pic w-10 h-10 opacity-80">
                            <svg class="default-svg-img" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
                            <path clip-rule="evenodd" d="M12 20.5c1.894 0 3.643-.62 5.055-1.666a5.5 5.5 0 00-10.064-.105.755.755 0 01-.054.099A8.462 8.462 0 0012 20.5Zm4.079-5.189a7 7 0 012.142 2.48 8.5 8.5 0 10-12.443 0 7 7 0 0110.3-2.48ZM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm2-12.5a2 2 0 11-4 0 2 2 0 014 0Zm1.5 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z" fill-rule="evenodd"></path>
                            </svg>
                        </div>
                        <img src="${avatar}" alt="avatar" class="avatar-img h-10 w-10 rounded-full border hidden">
                        <span class=" text-lg sm:text-xl font-bold">${postAuthor}</span>
                        <span class="text-sm opacity-40">></span>
                        <span class="text-sm opacity-40">${postDate}</span>
                    </div>
                    <div class="my-3 h-[1px] bg-[#363636]"></div>
                    <div class="post-title text-xl sm:text-2xl sm:pl-[52px]">${postTitle}</div>
                    <div class="my-3 h-[1px] bg-[#363636]"></div>
                    <div class="post-content text-sm sm:text-base sm:ml-[52px] p-3 rounded-xl bg-[#121212] whitespace-pre-wrap break-words ">${postContent}</div>
                    <div class="my-3 h-[1px] bg-[#363636]"></div>
                    <div class="post-btns pl-3 sm:pl-[52px] flex justify-between">
                        <div class="btns-box-1 flex gap-6">
                            <button class="like-btn text-sm  rounded-full"><img src="/public/like_w_icon.svg" alt="like-icon"></button>
                            <button class="cmnt-btn text-sm rounded-full"><img src="/public/comment_blue.svg" alt="like-icon"></button>
                        </div>

                    </div>
                </div>
            `

            contentArea.insertAdjacentHTML('afterbegin', html)

            const img = document.querySelector('.avatar-img')
            const defaultPostPic = document.querySelector('.default-post-pic')
            // console.log(svg)
            // console.log(img)
            if (avatar) {
                img.classList.remove('hidden');
                defaultPostPic.classList.add('hidden')
              
            } else {
                img.classList.add('hidden');
                defaultPostPic.classList.remove('hidden')
            }

        })

        
    } catch(e) {
        console.log(e)
    }
}
getAllPosts()











