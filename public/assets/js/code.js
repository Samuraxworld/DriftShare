(function () {
  console.log('code.js');
  let receiverID;
  let joinID;
  const socket = io();

  document.querySelector('#sender-start-connexion').addEventListener('click', () => {
    socket.emit('generate-id');

    socket.on('id-generated', (data) => {
      joinID = data.id;
      document.getElementById('join-id').innerHTML = `
        <span> ${joinID} </span>
        `;
      socket.emit('sender-join', {
        uid: joinID
      });
    });

    // joinID = generateID();
    // document.getElementById('join-id').innerHTML = `
    //   <span> ${joinID} </span>
    //   `;
    // socket.emit('sender-join', {
    //   uid: joinID
    // });
  });

  socket.on("init", (uid) => {
    // console.log('init', uid);

    receiverID = uid;
    document.querySelector('.sender-form').classList.remove('active');
    document.querySelector('.fs-screen').classList.add('active');
  });

  document.querySelector("#file-input").addEventListener('change', (e) => {
    let file = e.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
      let buffer = new Uint8Array(reader.result); // e.target.result;

      let fileItem = document.createElement('div');
      fileItem.classList.add('container');
      fileItem.classList.add('mb-2');
      fileItem.innerHTML = `
          <div class="file-item">
            <div class="file-info">
                <span class="file-name ml-2">${file.name}</span>
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

      shareFile({
        filename: file.name,
        total_buffer_size: buffer.length,
        buffer_size: 4096,
      }, buffer, fileItem.querySelector('.progress-bar'));
    };
    reader.readAsArrayBuffer(file);
  });

  function shareFile(metadata, buffer, progressBar) {
    socket.emit("file-meta", {
      uid: receiverID,
      metadata: metadata
    });

    socket.on("fs-share", (data) => {
      // console.log('fs-share', data);

      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      progressBar.innerHTML = `${Math.trunc(((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size) * 100)}%`;

      if (chunk.length != 0) {
        let binaryChunk = new Uint8Array(chunk);

        socket.emit("fs-raw", {
          uid: receiverID,
          buffer: binaryChunk
        });
      }
    });
  }
})();
