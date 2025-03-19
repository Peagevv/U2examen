// Configuración inicial
let canvas = document.getElementById("gameCanvas");// Obtener el elemento canvas
let ctx = canvas.getContext("2d");// Obtener el contexto 2D
let platforms = [];// Array para almacenar las plataformas
let bees = [];// Array para almacenar las abejas
// Variables para el juego
let beeCount = 0;// Contador de abejas eliminadas
let level = 1;// Nivel actual
let gameOver = false;// Estado del juego
let minDistance = 50;  // Distancia mínima para que la rana pueda comer a la abeja
let score = 0;  // Puntuación actual
let highScore = localStorage.getItem("highScore") || 0;  // Recupera la puntuación más alta del localStorage (si existe)
// Crear el objeto Image para la rana
let frogImage = new Image();
frogImage.src = 'lily.png';  // Ruta de la imagen de la rana, ya sea local o desde una URL
// Crear el objeto Image para la abeja
let beeImage = new Image();
beeImage.src = 'bee.png';  // Ruta de la imagen de la abeja (local o URL)
// Crear el objeto Image para la plataforma
let backgroundImage = new Image();
backgroundImage.src = 'fondo.jpeg';  // Ruta de la imagen de fondo (local o URL)
// Crear el objeto Audio para el sonido de la rana comiéndose una abeja
let frogEatBeeSound = new Audio('croac.mp3');  // Ruta de tu archivo de sonido
// Crear el objeto Audio para el sonido de naturaleza
let natureSound = new Audio('lago.mp3');  // Ruta de tu archivo de sonido de naturaleza

// Reproducir el sonido de naturaleza en bucle
natureSound.loop = true; // Configurar el sonido para que se repita
natureSound.play(); // Reproducir el sonido cuando se inicie el juego
// Configuración inicial de la rana
let frog = { 
    x: 375, // Posición inicial en el eje X
    y: canvas.height - 50, // Posición inicial en el eje Y
    width: 80, // Ancho de la rana
    height: 80, // Altura de la rana
    velocityY: 0, // Velocidad en el eje Y
    gravity: 0.8, // Gravedad
    jumpPower: -15, // Potencia del salto
    speed: 5 // Velocidad de desplazamiento
  };
// Inicialización de la rana
frog.y = canvas.height - frog.height;// Posición inicial en el eje Y
frog.x = canvas.width / 2 - frog.width / 2;// Posición inicial en el eje X

// Control de teclas
let keys = { left: false, right: false, up: false };// Estado de las teclas


// Detectar teclas presionadas
document.addEventListener("keydown", (e) => {// Evento para detectar teclas presionadas
  if (e.code == "KeyA") keys.left = true;  // Deslizar hacia la izquierda
  if (e.code == "KeyD") keys.right = true; // Deslizar hacia la derecha
  if (e.code == "Space" && frog.velocityY === 0) frog.velocityY = frog.jumpPower; // Salto
});
document.addEventListener("keyup", (e) => {// Evento para detectar teclas liberadas
  if (e.code == "KeyA") keys.left = false;// Liberar la tecla A
if (e.code == "KeyD") keys.right = false;// Liberar la tecla D
});


// Detectar clic en el mouse para comer abejas

canvas.addEventListener("click", (e) => {// Evento para detectar clics en el canvas
    let mouseX = e.offsetX;// Posición del clic en el eje X
    let mouseY = e.offsetY; // Posición del clic en el eje Y
  
    bees.forEach((bee, index) => {// Recorrer todas las abejas
      // Verificar si el clic está dentro del área de la abeja y si la rana está cerca
      let distance = Math.sqrt(Math.pow(frog.x + frog.width / 2 - (bee.x + bee.width / 2), 2) + Math.pow(frog.y + frog.height / 2 - (bee.y + bee.height / 2), 2));// Calcular la distancia entre la rana y la abeja
  
      if (distance <= minDistance) {  // Solo eliminar si está dentro del rango de proximidad
        if (mouseX > bee.x && mouseX < bee.x + bee.width && mouseY > bee.y && mouseY < bee.y + bee.height) {// Verificar si el clic está dentro del área de la abeja
          bees.splice(index, 1);  // Eliminar la abeja
          updateScore(10);  // Incrementar la puntuación por eliminar una abeja
          // Reproducir el sonido de la rana comiendo la abeja
          frogEatBeeSound.play();  // Reproducir el sonido de la rana comiendo la abeja
  
          beeCount++;  // Aumentar el contador de abejas eliminadas
          document.getElementById("beeCount").innerText = `Abejas eliminadas: ${beeCount}`;// Mostrar el número de abejas eliminadas
  
          // Subir de nivel después de eliminar 10 abejas
          if (beeCount === 10) {// Subir de nivel después de eliminar
            level++;  // Aumentar el nivel
            document.getElementById("level").innerText = `Nivel: ${level}`;// Mostrar el nivel actual
            beeCount = 0;  // Reiniciar el contador de abejas eliminadas
            platforms = [];  // Limpiar plataformas
            createPlatform();  // Crear nuevas plataformas
  
            // Aumentar la dificultad (puedes añadir otras condiciones aquí)
            setInterval(createBee, Math.max(2000 - level * 100, 500));  // Acelerar la generación de abejas a medida que aumenta el nivel
          }
        }
      }
    });
  });

// Función para crear plataformas
function createPlatform() {// Función para crear plataformas
  let width = Math.random() * 200 + 100;// Ancho aleatorio
  let x = Math.random() * (canvas.width - width);// Posición aleatoria en el eje X
  let y = Math.random() * (canvas.height - 100) + 100;// Posición aleatoria en el eje Y
  platforms.push({ x, y, width, height: 10 });// Añadir la plataforma al array
}
// Actualizar puntuación
function updateScore(points) {// Función para actualizar la puntuación
    score += points;// Incrementar la puntuación
    document.getElementById("score").innerText = `Puntuación: ${score}`; // Mostrar puntuación actual
  
    // Comprobar si se alcanza la puntuación más alta
    if (score > highScore) {// Comprobar si se alcanza la puntuación más alta
      highScore = score;// Actualizar la puntuación más alta
      localStorage.setItem("highScore", highScore);  // Guardar la nueva puntuación más alta en localStorage
      document.getElementById("highScore").innerText = `Puntuación más alta: ${highScore}`; // Mostrar puntuación más alta
    }
  }

// Función para crear abejas
function createBee() {// Función para crear abejas
    let bee = {// Crear un objeto abeja
      x: Math.random() * canvas.width,  // posición aleatoria en el eje X
      y: Math.random() * canvas.height,  // posición aleatoria en el eje Y
      width: 60, // Tamaño de la abeja
      height: 60, // Tamaño de la abeja
      dx: (Math.random() - 0.5) * 2,  // velocidad aleatoria en el eje X
      dy: (Math.random() - 0.5) * 2,  // velocidad aleatoria en el eje Y
    };
    bees.push(bee);// Añadir la abeja al array
  }
  // Dibujar todas las abejas
  function drawBees() {
    bees.forEach(function(bee) {// Recorrer todas las abejas
      ctx.drawImage(beeImage, bee.x, bee.y, bee.width, bee.height);// Dibujar la abeja
  
      // Mover las abejas
      bee.x += bee.dx;// Mover la abeja en el eje X
      bee.y += bee.dy;// Mover la abeja en el eje Y
  
      // Rebotar las abejas al llegar a los bordes
      if (bee.x + bee.width > canvas.width || bee.x < 0) {// Rebotar en los bordes
        bee.dx = -bee.dx;  // Cambiar dirección en el eje X
      }
      if (bee.y + bee.height > canvas.height || bee.y < 0) {// Rebotar en los bordes
        bee.dy = -bee.dy;  // Cambiar dirección en el eje Y
      }
    });
  }
// Función para actualizar el juego
function updateGame() {// Función para actualizar el juego
    if (gameOver) return;// Salir si el juego ha terminado
  
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);// Limpiar el canvas
  
    // Dibujar el fondo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);// Dibujar el fondo
  
    // Actualizar rana
    frog.velocityY += frog.gravity;// Aplicar gravedad
    frog.y += frog.velocityY;// Mover la rana en el eje Y
  
    // Mantener la rana dentro del canvas
    if (frog.y + frog.height > canvas.height) {// Evitar que la rana se salga por la parte inferior
      frog.y = canvas.height - frog.height;// Posicionar la rana en la parte inferior
      frog.velocityY = 0;// Detener la rana
    }
  
    if (frog.y < 0) {
      frog.y = 0; // Evitar que la rana se salga por la parte superior
    }
  
    if (keys.left) frog.x -= frog.speed;// Mover la rana a la izquierda
    if (keys.right) frog.x += frog.speed;// Mover la rana a la derecha
    
    // Limitar el movimiento horizontal de la rana
    if (frog.x < 0) frog.x = 0;  // No puede ir más allá de la izquierda
    if (frog.x + frog.width > canvas.width) frog.x = canvas.width - frog.width;  // No puede ir más allá de la derecha
  

  // Colisiones con las plataformas
  platforms.forEach((platform) => {// Recorrer todas las plataformas
    // Colisión con la parte superior de la plataforma
    if (frog.y + frog.height >= platform.y && frog.y + frog.height <= platform.y + frog.velocityY) {
      if (frog.x + frog.width > platform.x && frog.x < platform.x + platform.width) {// Colisión con la parte superior de la plataforma
        frog.velocityY = 0;// Detener la rana
        frog.y = platform.y - frog.height;// Posicionar la rana en la parte superior de la plataforma
      }
    }
  });

  // Dibuja la rana
 ctx.drawImage(frogImage, frog.x, frog.y, frog.width, frog.height);// Dibujar la rana
  

  // Dibuja plataformas
  platforms.forEach((platform) => {// Recorrer todas las plataformas
    ctx.fillStyle = "#2e8b57";//    Color de las plataformas
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);// Dibujar la plataforma
  });

 // Dibuja las abejas con la imagen
 bees.forEach((bee) => {// Recorrer todas las abejas
    ctx.drawImage(beeImage, bee.x, bee.y, bee.width, bee.height);// Dibujar la abeja
  });

  // Solicitar la siguiente actualización
  requestAnimationFrame(updateGame);
}

// Función para iniciar el juego
function startGame() {
  // Crear múltiples plataformas al inicio
  for (let i = 0; i < 5; i++) {// Crear 5 plataformas al inicio
    createPlatform();// Crear una plataforma
  }

  setInterval(createBee, 3000); // Crea una nueva abeja cada 3 segundos
  updateGame();// Actualizar el juego
}

// Iniciar el juego
startGame();
