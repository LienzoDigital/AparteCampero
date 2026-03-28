document.addEventListener('DOMContentLoaded', function() {
    initializeExportPage();
});

function initializeExportPage() {
    updateDataPreview();
    
    document.getElementById('exportTxtBtn').addEventListener('click', exportDataToTxt);
    document.getElementById('exportEmailBtn').addEventListener('click', exportDataToEmail);
}

function updateDataPreview() {
    const previewElement = document.getElementById('dataPreview');
    if (!previewElement) return;
    
    previewElement.textContent = generateExportData();
}

function generateExportData() {
    const teams = JSON.parse(localStorage.getItem('camperoTeams')) || [];
    const times = JSON.parse(localStorage.getItem('camperoTimes')) || {};
    
    let output = 'REGISTRO DE TIEMPOS - APARTE CAMPERO\n';
    output += `Fecha de exportación: ${new Date().toLocaleString()}\n\n`;
    
    output += '=== EQUIPOS REGISTRADOS ===\n';
    teams.forEach(team => {
        output += `#${team.number}: ${team.name}\n`;
    });
    
    output += '\n=== TIEMPOS REGISTRADOS ===\n';
    teams.forEach(team => {
        const teamTimes = times[team.id];
        if (teamTimes) {
            output += `\nEQUIPO #${team.number}: ${team.name}\n`;
            
            for (let pass = 1; pass <= 3; pass++) {
                const passData = teamTimes[`pass${pass}`];
                if (passData) {
                    const mins = Math.floor(passData.time / 60);
                    const secs = passData.time % 60;
                    const timeStr = `${mins}.${secs.toString().padStart(2, '0')}`;
                    
                    output += `Pasada ${pass}: ${timeStr} (${passData.cows} vacas)`;
                    if (passData.penalty > 0) {
                        output += ` [+${passData.penalty}s]`;
                    }
                    output += '\n';
                }
            }
        }
    });
    
    return output;
}

function exportDataToTxt() {
    const data = generateExportData();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `aparte-campero-${formatDateForFilename()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportDataToEmail() {
    const data = generateExportData();
    const subject = `Resultados Aparte Campero - ${formatDateForEmail()}`;
    const body = encodeURIComponent(data);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function formatDateForFilename() {
    const now = new Date();
    return `${now.getFullYear()}${padZero(now.getMonth()+1)}${padZero(now.getDate())}_${padZero(now.getHours())}${padZero(now.getMinutes())}`;
}

function formatDateForEmail() {
    const now = new Date();
    return now.toLocaleDateString('es-AR');
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}