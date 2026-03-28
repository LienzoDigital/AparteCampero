document.addEventListener('DOMContentLoaded', function() {
    generateResultsTable();
});

function generateResultsTable() {
    const teams = JSON.parse(localStorage.getItem('camperoTeams')) || [];
    const times = JSON.parse(localStorage.getItem('camperoTimes')) || {};
    const tbody = document.getElementById('resultsTableBody');
    
    // Calcular resultados para cada equipo
    const results = teams.map(team => {
        const teamTimes = times[team.id] || {};
        let passes = [];
        
        // Recopilar datos de las 3 pasadas
        for (let pass = 1; pass <= 3; pass++) {
            const passData = teamTimes[`pass${pass}`];
            if (passData) {
                // Calcular tiempo total con penalización
                const totalTime = passData.time + (passData.penalty || 0);
                passes.push({
                    passNum: pass,
                    cows: passData.cows || 0,
                    time: passData.time || 0,
                    penalty: passData.penalty || 0,
                    totalTime: totalTime
                });
            } else {
                passes.push({ 
                    passNum: pass, 
                    cows: 0, 
                    time: 0, 
                    penalty: 0,
                    totalTime: 0 
                });
            }
        }
        
        // Determinar la peor pasada para descartar:
        // 1. Primero por menos vacas
        // 2. Si empate en vacas, por mayor tiempo total
        let worstPassIndex = 0;
        for (let i = 1; i < passes.length; i++) {
            const current = passes[i];
            const worst = passes[worstPassIndex];
            
            // Comparar por vacas (menos vacas es peor)
            if (current.cows < worst.cows) {
                worstPassIndex = i;
            } 
            // Si mismo número de vacas, comparar por tiempo (mayor tiempo es peor)
            else if (current.cows === worst.cows) {
                if (current.totalTime > worst.totalTime) {
                    worstPassIndex = i;
                }
            }
        }
        
        // Filtrar las mejores pasadas (excluyendo la peor)
        const bestPasses = passes.filter((_, index) => index !== worstPassIndex);
        
        // Calcular total de vacas (suma de las dos mejores)
        const totalCows = bestPasses.reduce((sum, pass) => sum + pass.cows, 0);
        
        // Calcular tiempo total (suma de las dos mejores pasadas con penalizaciones)
        const totalTime = bestPasses.reduce((sum, pass) => sum + pass.totalTime, 0);
        
        return {
            teamId: team.id,
            number: team.number,
            name: team.name,
            totalCows: totalCows,
            totalTime: totalTime,
            passes: passes,
            bestPasses: bestPasses,
            worstPass: passes[worstPassIndex]
        };
    });
    
    // Ordenar resultados:
    // 1. Primero por mayor cantidad de vacas (descendente)
    // 2. En caso de empate, por menor tiempo total (ascendente)
    results.sort((a, b) => {
        // Primero por vacas (mayor es mejor)
        if (b.totalCows !== a.totalCows) {
            return b.totalCows - a.totalCows;
        }
        // En caso de empate en vacas, por tiempo (menor es mejor)
        return a.totalTime - b.totalTime;
    });
    
    // Generar tabla
    tbody.innerHTML = results.map((team, index) => {
        // Formatear tiempo total
        const minutes = Math.floor(team.totalTime / 60);
        const seconds = team.totalTime % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Crear detalles de pasadas
        const passDetails = team.passes.map(pass => {
            const passMinutes = Math.floor(pass.totalTime / 60);
            const passSeconds = pass.totalTime % 60;
            const formattedPassTime = `${passMinutes}:${passSeconds.toString().padStart(2, '0')}`;
            
            // Marcar la peor pasada
            const isWorst = pass.passNum === team.worstPass.passNum;
            const worstIndicator = isWorst ? '<span class="worst-pass">(peor)</span>' : '';
            
            return `Pasada ${pass.passNum}: ${pass.cows} vacas, ${formattedPassTime} ${worstIndicator}`;
        }).join('<br>');
        
        // Determinar clase de podio
        let podiumClass = '';
        let podiumText = (index + 1);
        
        if (index === 0) {
            podiumClass = 'podium-1';
            podiumText = '🥇 1°';
        } else if (index === 1) {
            podiumClass = 'podium-2';
            podiumText = '🥈 2°';
        } else if (index === 2) {
            podiumClass = 'podium-3';
            podiumText = '🥉 3°';
        }
        
        return `
        <tr>
            <td class="podium ${podiumClass}">${podiumText}</td>
            <td class="team-info">${team.number} - ${team.name}</td>
            <td class="cows-count">${team.totalCows}</td>
            <td class="time-value">${formattedTime}</td>
            <td class="pass-details">${passDetails}</td>
        </tr>
        `;
    }).join('');
}

// Función auxiliar para formatear tiempo
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}