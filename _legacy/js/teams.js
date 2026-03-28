document.addEventListener('DOMContentLoaded', function() {
    initializeTeamsPage();
});

function initializeTeamsPage() {
    const teamForm = document.getElementById('teamForm');
    if (teamForm) {
        teamForm.addEventListener('submit', handleTeamFormSubmit);
    }
    refreshTeamsTable();
}

function handleTeamFormSubmit(e) {
    e.preventDefault();
    
    const teamName = document.getElementById('teamName').value.trim();
    const teamNumber = document.getElementById('teamNumber').value;
    
    if (!teamName || !teamNumber) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    addNewTeam(teamName, teamNumber);
    this.reset();
}

function addNewTeam(name, number) {
    const teams = getTeamsFromStorage();
    const newTeam = {
        id: Date.now().toString(),
        name,
        number: parseInt(number)
    };
    
    teams.push(newTeam);
    saveTeamsToStorage(teams);
    refreshTeamsTable();
}

function refreshTeamsTable() {
    const teams = getTeamsFromStorage();
    const tbody = document.getElementById('teamsTableBody');
    
    tbody.innerHTML = teams.map(team => `
        <tr>
            <td>${team.number}</td>
            <td>${team.name}</td>
            <td>
                <button class="btn btn-sm btn-warning edit-team" data-id="${team.id}">
                    <img src="img/pencil.svg" class="icon-svg"> 
                </button>
                <button class="btn btn-sm btn-danger delete-team" data-id="${team.id}">
                    <img src="img/trash.svg" class="icon-svg"> 
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.edit-team').forEach(btn => {
        btn.addEventListener('click', () => editExistingTeam(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-team').forEach(btn => {
        btn.addEventListener('click', () => deleteExistingTeam(btn.dataset.id));
    });
}

function editExistingTeam(teamId) {
    const teams = getTeamsFromStorage();
    const team = teams.find(t => t.id === teamId);
    
    if (team) {
        const newName = prompt('Editar nombre del equipo:', team.name);
        if (newName !== null && newName.trim() !== '') {
            team.name = newName.trim();
            saveTeamsToStorage(teams);
            refreshTeamsTable();
        }
    }
}

function deleteExistingTeam(teamId) {
    if (confirm('¿Está seguro que desea eliminar este equipo?')) {
        const teams = getTeamsFromStorage();
        const updatedTeams = teams.filter(t => t.id !== teamId);
        saveTeamsToStorage(updatedTeams);
        refreshTeamsTable();
    }
}

// Storage helpers
function getTeamsFromStorage() {
    return JSON.parse(localStorage.getItem('camperoTeams')) || [];
}

function saveTeamsToStorage(teams) {
    localStorage.setItem('camperoTeams', JSON.stringify(teams));
}