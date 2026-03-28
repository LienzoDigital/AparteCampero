export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

export function formatTimeDisplay(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const [minStr, secMsStr] = parts;
  const [secStr, msStr = '00'] = secMsStr.split('.');
  const minutes = parseInt(minStr, 10) || 0;
  const seconds = parseInt(secStr, 10) || 0;
  const ms = parseInt(msStr.padEnd(3, '0').slice(0, 3), 10) || 0;
  return minutes * 60000 + seconds * 1000 + ms;
}

export function calculateTotal(times: Record<string, { time: number; penalty: number }>): { totalTime: number; totalPenalty: number } {
  let totalTime = 0;
  let totalPenalty = 0;
  Object.values(times).forEach(pass => {
    totalTime += pass.time;
    totalPenalty += pass.penalty;
  });
  return { totalTime, totalPenalty };
}

export function exportToCSV(teams: any[], times: any): string {
  const headers = ['Team', 'Category'];
  const maxPasses = Math.max(...teams.map(t => Object.keys(times[t.id] || {}).length));
  for (let i = 1; i <= maxPasses; i++) {
    headers.push(`Pass${i} Time`, `Pass${i} Penalty`);
  }
  headers.push('Total Time', 'Total Penalty');
  
  const rows = teams.map(team => {
    const row = [team.name, team.category];
    const teamTimes = times[team.id] || {};
    for (let i = 1; i <= maxPasses; i++) {
      const pass = teamTimes[`pass${i}`] || { time: 0, penalty: 0 };
      row.push(formatTimeDisplay(pass.time), pass.penalty);
    }
    const totals = calculateTotal(teamTimes);
    row.push(formatTimeDisplay(totals.totalTime), totals.totalPenalty);
    return row;
  });
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

export function exportToJSON(teams: any[], times: any): string {
  return JSON.stringify({ teams, times }, null, 2);
}
