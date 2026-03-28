// times.js - Gestión completa de tiempos (corregido)

// Variables globales
let selectedPass = 1;
let selectedCows = 3;
let totalPenalty = 0;
let timerInterval;
let timerSeconds = 0;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    const isCapturePage = document.getElementById('startBtn') !== null;
    initializeTimesPage(isCapturePage);
    setDefaultTimeValues();
});

// Función principal de inicialización (corregida)
function initializeTimesPage(withTimer = false) {
    try {
        loadTeamOptions();
        setupTimeFormListeners();
        if (withTimer) {
            setupTimer();
        }
        updatePenaltyDisplay();
    } catch (error) {
        console.error('Error al inicializar:', error);
        showAlert('Error al cargar la página. Recargue por favor.', 'error');
    }
}

// Cargar equipos en el selector
function loadTeamOptions() {
    const teamSelect = document.getElementById('teamSelect');
    if (!teamSelect) return;

    try {
        const teams = JSON.parse(localStorage.getItem('camperoTeams')) || [];
        teamSelect.innerHTML = '<option value="">Seleccionar equipo</option>' + 
            teams.map(team => 
                `<option value="${team.id}">${team.number} - ${team.name}</option>`
            ).join('');
    } catch (error) {
        console.error('Error al cargar equipos:', error);
        teamSelect.innerHTML = '<option value="">Error al cargar equipos</option>';
    }
}

// Configurar event listeners
function setupTimeFormListeners() {
    // Botones de pasada
    document.querySelectorAll('.pass-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.pass-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPass = parseInt(this.dataset.pass);
        });
    });

    // Botones de vacas
    document.querySelectorAll('.cows-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cows-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedCows = parseInt(this.dataset.cows);
        });
    });

    // Botones de penalización
    document.querySelectorAll('.penalty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            totalPenalty += parseInt(this.dataset.penalty);
            updatePenaltyDisplay();
            showAlert(`Penalización agregada: +${this.dataset.penalty}s (Total: ${totalPenalty}s)`);
        });
    });

    // Formulario de tiempo
    const timeForm = document.getElementById('timeForm');
    if (timeForm) {
        timeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTimeFormSubmit();
        });
    }
}

// Actualizar display de penalización
function updatePenaltyDisplay() {
    const display = document.getElementById('totalPenaltyDisplay');
    if (display) display.textContent = `Penalización total: ${totalPenalty}s`;
}

// Configurar el cronómetro (función corregida)
function setupTimer() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
}

// Manejar envío del formulario
function handleTimeFormSubmit() {
    const teamId = document.getElementById('teamSelect')?.value;
    if (!teamId) {
        showAlert('Seleccione un equipo', 'error');
        return;
    }
    
    const { minutes, seconds } = validateTimeInputs();
    const totalTime = (minutes * 60) + seconds + totalPenalty;
    
    saveTeamTime(teamId, selectedPass, selectedCows, totalTime - totalPenalty, totalPenalty);
    showAlert(`Tiempo guardado: ${formatTime(minutes, seconds)} (${selectedCows} vacas)`, 'success');
    
    // Resetear solo penalizaciones
    totalPenalty = 0;
    updatePenaltyDisplay();
}

// Funciones del cronómetro (corregidas)
function startTimer() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');
    
    if (minutesInput) minutesInput.value = minutes;
    if (secondsInput) secondsInput.value = seconds;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    updateTimerDisplay();
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    
    setDefaultTimeValues();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const display = document.querySelector('.timer-display');
    if (display) display.textContent = formatTime(minutes, seconds);
}

// Funciones de utilidad
function validateTimeInputs() {
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');
    
    let minutes = parseInt(minutesInput?.value) || 0;
    let seconds = parseInt(secondsInput?.value) || 0;
    
    minutes = Math.min(Math.max(minutes, 0), 59);
    seconds = Math.min(Math.max(seconds, 0), 59);
    
    if (minutesInput) minutesInput.value = minutes;
    if (secondsInput) secondsInput.value = seconds.toString().padStart(2, '0');
    
    return { minutes, seconds };
}

function saveTeamTime(teamId, passNumber, cowsCount, totalSeconds, penalty) {
    try {
        let times = JSON.parse(localStorage.getItem('camperoTimes')) || {};
        times[teamId] = times[teamId] || {};
        times[teamId][`pass${passNumber}`] = {
            cows: cowsCount,
            time: totalSeconds,
            penalty,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('camperoTimes', JSON.stringify(times));
    } catch (error) {
        console.error('Error al guardar tiempo:', error);
        showAlert('Error al guardar el tiempo', 'error');
    }
}

function setDefaultTimeValues() {
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');
    if (minutesInput) minutesInput.value = '0';
    if (secondsInput) secondsInput.value = '0';
}

function formatTime(minutes, seconds) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showAlert(message, type = 'success') {
    // Crear el elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type === 'error' ? 'alert-error' : 'alert-success'}`;
    alertDiv.textContent = message;
    
    // Insertar la alerta en el DOM
    const container = document.querySelector('.content') || document.body;
    container.prepend(alertDiv);
    
    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Funciones para manejo de inputs
function clearIfZero(input) {
    if (input && input.value === '0') input.value = '';
}

function restoreZero(input) {
    if (!input) return;
    if (input.value === '' || isNaN(input.value)) {
        input.value = '0';
    } else {
        input.value = input.value.padStart(2, '0');
    }
}