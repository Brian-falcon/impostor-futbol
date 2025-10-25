// Importar funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getDatabase, ref, set, update, get } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-analytics.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFFZvv6VaWN3245lHKrpCxC2eebkVzzfA",
  authDomain: "impostor-futbol-3bbbb.firebaseapp.com",
  databaseURL: "https://impostor-futbol-3bbbb-default-rtdb.firebaseio.com",
  projectId: "impostor-futbol-3bbbb",
  storageBucket: "impostor-futbol-3bbbb.firebasestorage.app",
  messagingSenderId: "476731018489",
  appId: "1:476731018489:web:b7a58255221d413aed2628",
  measurementId: "G-SXHPKT01H2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const database = getDatabase(app);

// Función para generar código de sala
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Crear Sala
document.getElementById('createRoomBtn').addEventListener('click', async () => {
  const playerName = document.getElementById('playerName').value.trim();
  if (!playerName) return alert("Ingresa tu nombre");

  const numImpostores = parseInt(document.getElementById('numImpostores').value) || 1;
  const roomCode = generateRoomCode();

  await set(ref(database, 'salas/' + roomCode), {
    creador: playerName,
    impostores: numImpostores,
    jugadores: [{ name: playerName, role: null }],
    started: false,
    ended: false
  });

  window.location.href = `game.html?room=${roomCode}&player=${encodeURIComponent(playerName)}`;
});

// Unirse a Sala
document.getElementById('joinRoomBtn').addEventListener('click', async () => {
  const playerName = document.getElementById('playerName').value.trim();
  if (!playerName) return alert("Ingresa tu nombre");

  const roomCode = document.getElementById('joinRoomCode').value.trim().toUpperCase();
  const salaRef = ref(database, 'salas/' + roomCode);

  const snapshot = await get(salaRef);
  if (!snapshot.exists()) return alert("Sala no encontrada");

  const sala = snapshot.val();
  const jugadores = sala.jugadores || [];
  if (!jugadores.some(j => j.name === playerName)) {
    jugadores.push({ name: playerName, role: null });
    await update(salaRef, { jugadores });
  }

  window.location.href = `game.html?room=${roomCode}&player=${encodeURIComponent(playerName)}`;
});
