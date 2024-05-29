// // Get the file input element
// const fileInput = document.getElementById('file-input');

// // fileInput.css("opacity", "0");

// // Add an event listener for when files are selected
// fileInput.addEventListener('change', (event) => {
//     // Get the selected files
//     const files = event.target.files;

//     // Loop through each file
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         // Perform any necessary operations with the file
//         // For example, you can display the file name or size
//         console.log(`File name: ${file.name}`);
//         console.log(`File size: ${file.size} bytes`);

//         // You can also upload the file to a server using AJAX or fetch
//         // Here's an example using fetch:
//         const formData = new FormData();
//         formData.append('file', file);

//         fetch('/upload', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('File uploaded successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error uploading file:', error);
//         });
//     }
// });
// // Add an event listener for drag and drop
// document.addEventListener('dragover', (event) => {
//     event.preventDefault();
// });

// document.addEventListener('drop', (event) => {
//     event.preventDefault();
//     handleFiles(event.dataTransfer.files);
// });

// // Add an event listener for browse button
// const browseButton = document.getElementById('file-browser');
// browseButton.addEventListener('click', () => {
//     fileInput.click();
// });

// // Function to handle selected files
// function handleFiles(files) {
//     // Loop through each file
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         // Perform any necessary operations with the file
//         // For example, you can display the file name or size
//         console.log(`File name: ${file.name}`);
//         console.log(`File size: ${file.size} bytes`);

//         // You can also upload the file to a server using AJAX or fetch
//         // Here's an example using fetch:
//         const formData = new FormData();
//         formData.append('file', file);

//         fetch('/upload', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('File uploaded successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error uploading file:', error);
//         });
//     }
// }