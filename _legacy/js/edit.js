// edit.js - Gestión de edición de tiempos

document.addEventListener('DOMContentLoaded', function() {
    loadTeamsForEditing();
    setupEditListeners();
});

function loadTeamsForEditing() {
    const teamSelect = document.getElementById('editTeamSelect');
    const teams = JSON.parse(localStorage.getItem('camperoTeams')) || [];
    
    teamSelect.innerHTML = '<option value="">Seleccionar equipo</option>' + 
        teams.map(team => 
            `<option value="${team.id}">${team.number} - ${team.name}</option>`
        ).join('');
}

function setupEditListeners() {
    document.getElementById('editTeamSelect').addEventListener('change', function() {
        const teamId = this.value;
        if (teamId) {
            loadTeamTimes(teamId);
            document.getElementById('timesContainer').style.display = 'block';
        } else {
            document.getElementById('timesContainer').style.display = 'none';
        }
    });
}

function loadTeamTimes(teamId) {
    const timesContainer = document.getElementById('teamTimesList');
    const times = JSON.parse(localStorage.getItem('camperoTimes')) || {};
    const teamTimes = times[teamId] || {};
    
    let html = '';
    for (let pass = 1; pass <= 3; pass++) {
        const passData = teamTimes[`pass${pass}`] || { cows: 3, time: 0, penalty: 0 };
        const minutes = Math.floor(passData.time / 60);
        const seconds = passData.time % 60;
        
        html += `
        <div class="card mb-3">
            <div class="card-header">Pasada ${pass}</div>
            <div class="card-body">
                <form class="edit-time-form" data-pass="${pass}" data-team="${teamId}">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Vacas</label>
                            <select class="form-select cows-select" name="cows" required>
                                <option value="3" ${passData.cows === 3 ? 'selected' : ''}>3</option>
                                <option value="2" ${passData.cows === 2 ? 'selected' : ''}>2</option>
                                <option value="1" ${passData.cows === 1 ? 'selected' : ''}>1</option>
                                <option value="0" ${passData.cows === 0 ? 'selected' : ''}>0</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Minutos</label>
                            <input type="number" class="form-control" name="minutes" 
                                   value="${minutes}" min="0" max="59" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Segundos</label>
                            <input type="number" class="form-control" name="seconds" 
                                   value="${seconds}" min="0" max="59" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Penalización (segundos)</label>
                            <input type="number" class="form-control" name="penalty" 
                                   value="${passData.penalty || 0}" min="0" required>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <button type="submit" class="btn btn-primary w-100">
                                <img src="img/save.svg" alt="Guardar">Guardar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        `;
    }
    
    timesContainer.innerHTML = html;
    
    // Configurar event listeners para los formularios
    document.querySelectorAll('.edit-time-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEditedTime(this);
        });
    });
}

function saveEditedTime(form) {
    const teamId = form.dataset.team;
    const pass = form.dataset.pass;
    const cows = parseInt(form.querySelector('.cows-select').value);
    const minutes = parseInt(form.querySelector('[name="minutes"]').value) || 0;
    const seconds = parseInt(form.querySelector('[name="seconds"]').value) || 0;
    const penalty = parseInt(form.querySelector('[name="penalty"]').value) || 0;
    
    const totalTime = (minutes * 60) + seconds + penalty;
    
    let times = JSON.parse(localStorage.getItem('camperoTimes')) || {};
    times[teamId] = times[teamId] || {};
    times[teamId][`pass${pass}`] = {
        cows,
        time: totalTime,
        penalty,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('camperoTimes', JSON.stringify(times));
    showAlert('Tiempo actualizado correctamente');
}