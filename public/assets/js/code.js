(function() {
  console.log('code.js');
  let receiverID;
  const socket = io();

  function generateID() {
    return `${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 999)}-${Math.trunc(Math.random() * 9999)}`;
  }

  document.querySelector('#sender-start-connexion').addEventListener('click', () => {
    let joinID = generateID();
    document.getElementById('join-id').innerHTML = `
      <span> ${joinID} </span>
      `;
    socket.emit('sender-join', { 
      uid: joinID 
    });
  });

  socket.on("init", (uid) => {
    console.log('init', uid);
    receiverID = uid;
    document.querySelector('.sender-form').classList.remove('active');
    document.querySelector('.fs-screen').classList.add('active');
  });
})();
