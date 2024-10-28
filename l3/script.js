
let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.").openPopup();
document.addEventListener("DOMContentLoaded", requestNotificationPermission);

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error("Error generating image: ", err);
            return;
        }
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, 600, 300);
        rasterMap.style.display = "block";
        console.log("Map rasterized successfully.");
        createPuzzles(canvas); 
    });
});


function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        });
    }
}

function showSystemNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Congratulations!", {
            body: "You successfully completed the puzzle!",
            icon: "path/to/icon.png" 
        });
    }
}

function createPuzzles(originalCanvas) {
    const puzzleContainer = document.getElementById("puzzleContainer");
    puzzleContainer.innerHTML = ""; 
    const pieceWidth = originalCanvas.width / 4;  
    const pieceHeight = originalCanvas.height / 4; 
    const pieces = [];


    for (let row = 0; row < 4; row++) { 
        for (let col = 0; col < 4; col++) { 
            let pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            let context = pieceCanvas.getContext('2d');

           
            context.drawImage(originalCanvas, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

            let puzzlePiece = document.createElement('div');
            puzzlePiece.className = 'puzzle-piece';
            puzzlePiece.draggable = true;
            puzzlePiece.appendChild(pieceCanvas);


            puzzlePiece.dataset.correctPosition = `${col},${row}`; 
            puzzlePiece.dataset.isPlaced = 'false'; 
            puzzlePiece.addEventListener("dragstart", handleDragStart);
            pieces.push(puzzlePiece); 
        }
    }


    shuffleArray(pieces);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));

    
    const dropArea = document.getElementById("dropArea");
    dropArea.style.gridTemplateColumns = "repeat(4, 150px)";
    dropArea.style.gridTemplateRows = "repeat(4, 75px)";
    dropArea.innerHTML = ""; 

    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let gridCell = document.createElement('div');
            gridCell.className = 'drop-area';
            gridCell.dataset.correctPosition = `${col},${row}`; 
            dropArea.appendChild(gridCell);
            gridCell.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            gridCell.addEventListener("drop", (e) => {
                e.preventDefault();
                const droppedPosition = e.dataTransfer.getData("text/plain");
                placePiece(droppedPosition, gridCell); 
            });
            console.log(`Created grid cell at position ${gridCell.dataset.correctPosition}`);
        }
    }
}


function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.correctPosition);
    console.log("Dragging piece:", e.target.dataset.correctPosition);
}

let totalCorrectPieces = 0;

function placePiece(droppedPosition, targetCell) {
    console.log(`Próba umieszczenia elementu na pozycji ${droppedPosition} w komórce o poprawnej pozycji ${targetCell.dataset.correctPosition}.`);

    const puzzlePiece = document.querySelector(`.puzzle-piece[data-correct-position='${droppedPosition}']`);
    
    if (!puzzlePiece) {
        console.error("Błąd: Nie znaleziono elementu puzzli dla pozycji:", droppedPosition);
        return;
    }

    if (targetCell.dataset.correctPosition === droppedPosition && puzzlePiece.dataset.isPlaced === 'false') {
        console.log("Element pasuje do tej pozycji.");
        targetCell.appendChild(puzzlePiece);
        targetCell.classList.add('filled');
        puzzlePiece.dataset.isPlaced = 'true';
        totalCorrectPieces++;

        console.log(`Element poprawnie umieszczony. Liczba poprawnie ułożonych elementów: ${totalCorrectPieces}`);
        displayMessage("Great job!", "correct");
        checkCompletion(); 
    } else {
        console.warn("Element nie pasuje do tej pozycji lub został już umieszczony.");
        displayMessage("Try again!", "incorrect");
    }
}

function displayMessage(msg, status) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = msg;
    messageElement.className = status;
}


function resetPuzzle() {
    const dropArea = document.getElementById("dropArea");
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => {
        piece.dataset.isPlaced = 'false';
        piece.parentNode.removeChild(piece); 
    });
    createPuzzles(document.getElementById("rasterMap")); 
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.getElementById("getLocation").addEventListener("click", function() {
    if (!navigator.geolocation) {
        console.log("No geolocation support.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        map.setView([lat, lon], 18);
        L.marker([lat, lon]).addTo(map).bindPopup("You are here!").openPopup();
        console.log(`Location updated: ${lat}, ${lon}`);
    }, positionError => {
        console.error("Error getting location: ", positionError);
    });
});

function checkCompletion() {
    if (totalCorrectPieces === 16) { 
        displayWinScreen();
    }
}

function displayWinScreen() {
    const winScreen = document.getElementById("winScreen");
    winScreen.style.visibility = "visible";
    showSystemNotification();
}

document.getElementById("replayButton").addEventListener("click", () => {
    resetGame();
});

function resetGame() {
    // Ukryj ekran zwycięstwa
    const winScreen = document.getElementById("winScreen");
    winScreen.style.visibility = "hidden"; 

    totalCorrectPieces = 0;

    const puzzleContainer = document.getElementById("puzzleContainer");
    puzzleContainer.innerHTML = ""; 

    
    const dropArea = document.getElementById("dropArea");
    dropArea.innerHTML = ""; 

    
    const rasterMap = document.getElementById("rasterMap");
    const rasterContext = rasterMap.getContext("2d");
    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height); 
    rasterMap.style.display = "none"; 

    
    map.setView([53.430127, 14.564802], 18); 

    
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    
    L.tileLayer.provider('Esri.WorldImagery').addTo(map);
    let initialMarker = L.marker([53.430127, 14.564802]).addTo(map);
    initialMarker.bindPopup("<strong>Hello!</strong><br>This is a popup.").openPopup();

    
    const messageElement = document.getElementById("message");
    messageElement.textContent = ""; 
    messageElement.className = ""; 
}

function createDropArea() {
    const dropArea = document.getElementById("dropArea");
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let gridCell = document.createElement('div');
            gridCell.className = 'drop-area';
            gridCell.dataset.correctPosition = `${col},${row}`;
            dropArea.appendChild(gridCell);
            gridCell.addEventListener("dragover", (e) => {
                e.preventDefault();
            });
            gridCell.addEventListener("drop", (e) => {
                e.preventDefault();
                const droppedPosition = e.dataTransfer.getData("text/plain");
                placePiece(droppedPosition, gridCell);
            });
        }
    }
}
