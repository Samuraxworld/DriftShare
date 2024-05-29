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

})();
