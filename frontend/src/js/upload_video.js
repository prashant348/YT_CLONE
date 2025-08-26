console.log("hello from upload_video.js");


const img = document.querySelector('.dropbox-wrapper').children[0]
const dropBox = document.querySelector('.dropbox')



function dropBoxAnimation() {
    dropBox.addEventListener('mouseover', () => {
        img.style.transform = 'translateY(-6px)';
        img.style.transition = 'all 0.2s ease-in-out';
    });

    dropBox.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
};

dropBoxAnimation();

// click to open pop logic

const fileInput = document.querySelector('.file-input');
const videoTitleBox = document.querySelector('.video-title-box');
const videoTitleInput = document.querySelector('.video-title-input');

function videoTitleBoxAnimation() {
    
    
    videoTitleInput.addEventListener('focus', () => {
        videoTitleInput.style.border = '1px solid #0078D7';
    });
    videoTitleInput.addEventListener('focusout', () => {
        videoTitleInput.style.border = '1px solid #323232';
    });
    
    videoTitleInput.focus();
};

function videoTitleBoxAppear() {
    videoTitleBox.classList.remove('hidden');
    videoTitleBox.classList.add('flex');
    videoTitleBoxAnimation();
};


function handleFile(file) {
    // file size in MB
    const fileSize = file.size / (1024 * 1024);
    console.log(fileSize);

    //  if file size is greater than 100MB then reject it
    if (fileSize > 100) {
        alert("File size is too large!");
        return;
    } else {
        if (dropBox.children.length === 3) {
            dropBox.children[2].remove();
            img.setAttribute('src', '/public/file.svg');
            dropBox.classList.add('flex-col')
            dropBox.insertAdjacentHTML("beforeend", `<p class="file-name">${file.name}</p>`);
            videoTitleBoxAppear();
        } else {
            img.setAttribute('src', '/public/file.svg');
            dropBox.classList.add('flex-col')
            dropBox.insertAdjacentHTML("beforeend", `<p class="file-name">${file.name}</p>`);
            videoTitleBoxAppear();
        };
    };
};




dropBox.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    const fileType = file.type.split("/")[0];

    if (fileType !== "video") {
        alert("Please select a video file.");
    } else {
        handleFile(file);
    }
});

// 1. Prevent default behavior globally (VERY IMPORTANT)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    window.addEventListener(eventName, e => e.preventDefault());
    window.addEventListener(eventName, e => e.stopPropagation());
});

// 2. Highlight drop area on dragover
dropBox.addEventListener('dragover', () => {
    dropBox.style.backgroundColor = "rgba(152, 205, 255, 0.2)";
    dropBox.style.borderStyle = "dotted";
});

// 3. Reset style on dragleave
dropBox.addEventListener('dragleave', () => {
    dropBox.style.backgroundColor = "transparent";
    dropBox.style.borderStyle = "solid";
});

// 4. Handle file drop
dropBox.addEventListener('drop', (e) => {
    dropBox.style.backgroundColor = "transparent";
    dropBox.style.borderStyle = "solid";

    const files = e.dataTransfer.files;
    console.log(e.dataTransfer)
    console.log("Dropped files:", files);
    if (files.length) {
        handleFile(files[0]);
    }
});

// cancel btn logic 

const cancelBtn = document.querySelector('.cancel-btn');

cancelBtn.addEventListener('click', () => {
    window.location.href = '/';
})

// VIDEO TITLE BOX APPEARENCE LOGIC
