

console.log("this hello from channel.js");


const userChannelPicBox = document.querySelector('.user-channel-pic-box')
const defaultImg = userChannelPicBox.children[0]
console.log(defaultImg)
const img = userChannelPicBox.children[1]
const userDetailsBox = document.querySelector('.user-details-box')
const name = userDetailsBox.children[0]
const username = userDetailsBox.children[1]

async function getChannelDetails() {

    try {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await res.json()
        // console.log(data.user)

        const Name = data.user.name;
        const Username = data.user.username;

        [...userDetailsBox.children].forEach(child => {
            child.innerText = ""
        });

        name.innerText = Name;
        username.innerText = `@${Username}`;

        if (data.user.avatar) {
            defaultImg.classList.add('hidden');
            img.classList.remove('hidden');
            img.setAttribute('src', data.user.avatar);
            return data.user.avatar
        }
    } catch (err) {
        console.log("Error in getting channel avater: ", err)
    }
}

getChannelDetails()




// console.log(avatar)

const channelBackBtn = document.querySelector('.channel-back-btn')

function channelBackBtnLogic() {
    try {
        channelBackBtn.addEventListener('click', () => {
            window.location.href = '/profile';
        });
    } catch (err) {
        console.log(err)
    }
}

channelBackBtnLogic()



// ===============================================DYNAMIC LOGIC OF GETTING POST DATA AND DELETE SPECIFIC POST===============================================
const userPostBox = document.querySelector('.user-post-box');


async function getPostData() {
    try {
        const res = await fetch('/api/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include'
            }
        })

        const data = await res.json();
        const allPosts = data.posts;
        console.log(allPosts)

        // latest avatatr nikaaala
        const avatar = await getChannelDetails() // returns data.user.avatar
        // console.log(avatar)

        // ISKO COMMENT OUT HEE REHENE DO KUCH KAAM NHI HAI BAS JUGAAD THA

        // const res2 = await fetch('/api/posts', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         credentials: 'include'
        //     },
        //     body: JSON.stringify({ avatar })
        // })

        // const data2 = await res2.json();
        // const allPosts2 = data2.posts;
        // console.log(allPosts2)
        


        allPosts.forEach(post => {
            const postTitle = post.title
            const postContent = post.content
            const postAuthor = post.author
            const postDate = post.createdAt.split('T')[0]
            const postId = post._id

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

                        <div class="btns-box-2 flex">
                            <button onclick="mainPostDeleteFunction('${postId}')" class="bin-btn hover:bg-[#363636] h-9 w-9 relative left-[1px] flex justify-center items-center text-sm rounded-full"><img src="/public/red_bin_icon.svg" alt="like-icon"></button>
                        </div>
                    </div>
                </div>
            `

            userPostBox.insertAdjacentHTML('afterbegin', html)

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

    } catch (err) {
        console.log(err)
    }
}

getPostData()

const modal = document.querySelector('.modal');
const modalDeleteBtn = document.querySelector('.modal-delete-btn');
const modalCancelBtn = document.querySelector('.modal-cancel-btn');
const wrapper = document.querySelector('.wrapper');

const successModal = document.querySelector('.success-modal');
const successModalCancelBtn = document.querySelector('.success-modal-cancel-btn');

function ModalPopUp() {
    try {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        wrapper.classList.add('blur-[2px]');
    } catch (err) {
        console.log(err)
    }
}
function modalPopDown() {
    try {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        wrapper.classList.remove('blur-[2px]');
    } catch (err) {
        console.log(err)
    }
}

// succesmodel ka logic nahi likh sakta kyuki window reload hone ke baad script shuru se chalti hai 
// aur iska logic window reload hone ke baad likhne ka prayaas kar raha tha mai
function successModalPopUp() {
    try {
        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
        wrapper.classList.add('blur-[2px]');
    } catch (err) {
        console.log(err)
    }
}

function successModalPopDown() {
    try {
        successModal.classList.remove('flex');
        successModal.classList.add('hidden');
        wrapper.classList.remove('blur-[2px]');
    } catch (err) {
        console.log(err)
    }
}

async function deletePost(postId) {
    try {
        const res = await fetch(`/api/post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include'
            }
        })

        const data = await res.json();
        // console.log(data)
        console.log(data)

    } catch (err) {
        console.log(err)
    }
}

function mainPostDeleteFunction(postId) {
    try {
        ModalPopUp();
        modalDeleteBtn.addEventListener('click', () => {
            try {
                setTimeout(() => {
                    deletePost(postId)
                    modalPopDown();
                    window.location.reload();
                }, 500);

            } catch (err) {
                console.log(err)
            }
        });

        modalCancelBtn.addEventListener('click', () => {
            try {
                modalPopDown();
            } catch (err) {
                console.log(err)
            }
        });

    } catch (e) {
        console.log(e)
    };
};
 
// ==========================================================================================================================================================

// =============================================CREATE POST BTN IN CHANNEL PAGE LOGIC=============================================
const createPostBtn = document.querySelector('.create-post-btn');
createPostBtn.addEventListener('click', () => {
    try {
        window.location.href = '/upload';
    } catch (err) {
        console.log(err)
    }
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++BANNER IMAGE LOGIC+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const bannerBox = document.querySelector('.banner-box');

const imageFileInput = document.querySelector('input[type="file"]');
const bannerImage = document.querySelector('.banner-img');

const bannerModal = document.querySelector('.banner-modal');
const bannerModalBox = document.querySelector('.banner-modal-box');
const bannerModalRemoveBtn = document.querySelector('.banner-modal-remove-btn');
const bannerModalChangeBtn = document.querySelector('.banner-modal-change-btn');

function bannerModalPopUp() {
    try {
        bannerModal.classList.remove('hidden');
        bannerModal.classList.add('flex');
        wrapper.classList.add('blur-[2px]');
    } catch (err) {
        console.log(err)
    }
}

function bannerModalPopDown() {
    try {
        bannerModal.classList.remove('flex');
        bannerModal.classList.add('hidden');
        wrapper.classList.remove('blur-[2px]');
    } catch (err) {
        console.log(err)
    }
}

bannerModal.addEventListener('click', (e) => {
    try {
        bannerModalPopDown();
    } catch (err) {
        console.log(err)
    }
});

bannerModalBox.addEventListener('click', (e) => {
    try {
        e.stopPropagation();
    } catch (err) {
        console.log(err)
    }
})


bannerBox.addEventListener('click', () => {
    try {

        bannerModalPopUp();
        // imageFileInput.click();
    } catch (err) {
        console.log(err)
    }
});

bannerModalRemoveBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/channel/banner', {
            method: "DELETE",
            credentials: 'include'
        });

        const data = await res.json();
        console.log(data)

        if (data.message === "No banner to delete!") {
            alert("No banner to delete!");
            bannerModalPopDown();
            return;
        }

        setTimeout(() => {
            window.location.reload();
        }, 500)
    } catch (err) {
        console.log(err)
    }
})

bannerModalChangeBtn.addEventListener('click', () => {
    try {
        imageFileInput.click();
        bannerModalPopDown();
    } catch (err) {
        console.log(err)
    }
});


imageFileInput.addEventListener('change', async () => {
    
    const file = imageFileInput.files[0];
    console.log(file)
    const fileType = file.type.split("/")[0];
    
    if (fileType !== "image") {
        alert("Please select an image file.");
    } else {
        const formData = new FormData();
        formData.append('bannerImage', file);
        
        const res = await fetch('/api/channel/banner', {
            method: "POST",
            credentials: 'include',
            body: formData
        });
        
        console.log(res)
        setTimeout(() => {
            window.location.reload()
        }, 500)
    };
});


async function loadBannerImg(tokenCookie) {
    try {
        const res = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': tokenCookie
            }
        });

        const data = await res.json();
        console.log(data)

        const bannerImg = data.user.banner;
        
        if (bannerImg) {
            bannerImage.classList.remove('hidden');
            bannerImage.setAttribute('src', bannerImg);
        } else {
            bannerImage.classList.add('hidden');
        }


    } catch (err) {
        console.log("Error in loading banner image", err)
    }

}

async function checkUserLoggedIn() {
    // Find logged_in_token in cookies
    const cookies = document.cookie.split(';').map(c => c.trim());
    // console.log(cookies)
    const tokenCookie = cookies.find(c => c.startsWith('logged_in_token='));
    // console.log(tokenCookie)

    if (tokenCookie) {
        loadBannerImg(tokenCookie);
        return true;
    } else {
        return false;
    }
};
checkUserLoggedIn();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++







