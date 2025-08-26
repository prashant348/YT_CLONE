



console.log("hello from upload_post.js");

//  cancel btn logic

const cancelBtn = document.querySelector('.cancel-btn');

cancelBtn.addEventListener('click', () => {
    try {
        
        window.location.href = '/';
    } catch (err) {
        console.log(err)
    }
})


// post logic 

const uploadBtn = document.querySelector('.upload-btn');
const form = document.querySelector('form');
const wrapper = document.querySelector('.wrapper');
const modal = document.querySelector('.modal');


async function getAvatar() {
    try {
        const res = await fetch('/api/user', {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include'
            }
        })

        const data = await  res.json()
        // console.log(data.user)
        const avatar = data.user.avatar
        console.log(avatar)
        return avatar;
        

    } catch (e) {
        console.log(e)
    }
}

getAvatar()

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const title = document.querySelector('textarea[name="post_title"]').value;
    const content = document.querySelector('textarea[name="post_content"]').value;
    const avatar = await getAvatar();

    console.log(title, content)


    const res = await fetch('/api/post', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            credentials: 'include'
        },
        body: JSON.stringify({ title, content, avatar })
    });

    const data = await res.json();
    console.log(data.post)
    const post = JSON.stringify(data.post);
    console.log(post)

    setTimeout(() => {
        form.reset();
        wrapper.classList.add('blur-[2px]');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }, 500)
    
});

const modalCancelBtn = document.querySelector('.modal-cancel-btn');

modalCancelBtn.addEventListener('click', () => {
    wrapper.classList.remove('blur-[2px]');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});



