// const progressBar = document.querySelector('.progress-bar');
// progressBar.style.width = '50%';

(function () {
    let senderID;
    const socket = io();

    function generateID() {
        return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 9999)}`;
    }

    document.querySelector('#receiver-start-connexion').addEventListener('click', () => {
        senderID = document.querySelector('#join-id-value').value;
        if (senderID.length == 0) {
            return; // Do nothing
        }

        let joinID = generateID();
        socket.emit('receiver-join', {
            uid: joinID,
            sender_uid: senderID
        });
        document.querySelector('.receiver-form').classList.remove('active');
        document.querySelector('.fs-screen').classList.add('active');
    });

    let fileShare = {};
    socket.on("fs-meta", (metadata) => {
        // console.log('fs-meta', metadata);

        fileShare.metadata = metadata;
        fileShare.transmitted = 0;
        fileShare.buffer = [];

        let fileItem = document.createElement('div');
        fileItem.classList.add('container');
        fileItem.classList.add('mb-2');
        fileItem.innerHTML = `
            <div class="file-item">
                <div class="file-info">
                    <span class="file-name ml-2">${metadata.filename}</span>
                </div>
                <div class="file-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="file-remove">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `;
        document.querySelector('.file-list').appendChild(fileItem);

        fileShare.progressBar = fileItem.querySelector(".progress-bar");
        socket.emit("fs-start", {
            uid: senderID
        });
    });

    socket.on("fs-share", (buffer) => {
        // console.log('emmited fs-share', buffer);

        fileShare.buffer.push(buffer);
        fileShare.transmitted += buffer.byteLength;
        fileShare.progressBar.innerHTML = `${Math.trunc((fileShare.transmitted / fileShare.metadata.total_buffer_size) * 100)}%`;

        if (fileShare.transmitted == fileShare.metadata.total_buffer_size) {
            download(new Blob(fileShare.buffer), fileShare.metadata.filename);
            fileShare = {};
        } else {
            //console.log('going on another start', buffer);
            socket.emit("fs-start", {
                uid: senderID
            });
        }
    });

})();
