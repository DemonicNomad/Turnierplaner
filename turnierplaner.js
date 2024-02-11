const teamColors = ["#FF0000", "#4169E1", "#008000", "#FFD700", "#4B0082", "#00FF00", "#00FFFF", "#FF00FF", "#FF8C00", "#191970", "#8B4513", "#008080", "#808000", "#FFDEAD", "#708090", "#8FBC8F"];

        function addTeams() {
    const numTeams = parseInt(document.getElementById('numTeams').value);
    let teamInputsHTML = '';
    for (let i = 1; i <= numTeams; i++) {
        teamInputsHTML += `<label for="team${i}">Team ${i}:</label>
                           <input type="text" id="team${i}" name="team${i}" required><br>`;
    }
    document.getElementById('teamInputs').innerHTML = teamInputsHTML;
    document.getElementById('generateBtn').style.display = 'block';

    // Rangliste initialisieren
    updateStandings([], 0); // Leeres Array und 0 für die Anzahl der Gruppen
}


        function generateScheduleAndStandings() {
            const numTeams = parseInt(document.getElementById('numTeams').value);
            const numGroups = parseInt(document.getElementById('numGroups').value);
            const teams = [];

            for (let i = 1; i <= numTeams; i++) {
                let color = teamColors[i - 1] || generateRandomColor(); // Verwende die vorgegebenen Farben oder generiere eine zufällige Farbe
                teams.push({ name: document.getElementById(`team${i}`).value, points: 0, color: color });
            }

            let teamsPerGroup = Math.ceil(numTeams / numGroups);
            let groups = Array.from({ length: numGroups }, () => []);

            let teamIndex = 0;
            for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
                for (let i = 0; i < teamsPerGroup && teamIndex < numTeams; i++) {
                    groups[groupIndex].push(teams[teamIndex]);
                    teamIndex++;
                }
            }

            let scheduleAndStandingsHTML = '';

            for (let group = 0; group < numGroups; group++) {
                const groupTeams = groups[group];

                scheduleAndStandingsHTML += `<h2>Gruppe ${group + 1}</h2>
                                             <h3>Spielplan</h3>
                                             <table id="scheduleTable${group}">${generateSchedule(groupTeams)}</table>`;
            }

            scheduleAndStandingsHTML += `<h2>Rangliste</h2>
                                         <table id="standingsTable">${generateStandings(teams)}</table>`;

            document.getElementById('scheduleAndStandings').innerHTML = scheduleAndStandingsHTML;

            setInterval(function() {
                updateStandings(teams, numGroups);
            }, 500);
        }

        function generateSchedule(teams) {
            let scheduleHTML = '<tr><th>Team 1</th><th>Team 2</th><th>Ergebnis</th></tr>';

            for (let i = 0; i < teams.length - 1; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    scheduleHTML += `<tr><td style="color: ${teams[i].color};">${teams[i].name}</td>
                                     <td style="color: ${teams[j].color};">${teams[j].name}</td>
                                     <td><input type="text" id="result${teams[i].name}vs${teams[j].name}_team1" placeholder="Tore Team 1">
                                     : <input type="text" id="result${teams[i].name}vs${teams[j].name}_team2" placeholder="Tore Team 2"></td></tr>`;
                }
            }

            return scheduleHTML;
        }

        function generateStandings(teams) {
            teams.sort((a, b) => b.points - a.points);
            let standingsHTML = '<tr><th>Team</th><th style="color: #000;">Punkte</th></tr>';

            for (let i = 0; i < teams.length; i++) {
                standingsHTML += `<tr><td style="color: ${teams[i].color};">${teams[i].name}</td><td>${teams[i].points}</td></tr>`;
            }

            return standingsHTML;
        }

        function updateStandings(teams, numGroups) {
    for (let i = 0; i < teams.length; i++) {
        const teamName = teams[i].name;
        const teamPoints = calculatePoints(teamName, teams, numGroups);
        teams[i].points = teamPoints;
    }

    teams.sort((a, b) => b.points - a.points);
    let standingsHTML = '<tr><th>Team</th><th style="color: #000;">Punkte</th></tr>';
    for (let i = 0; i < teams.length; i++) {
        standingsHTML += `<tr><td style="color: ${teams[i].color};">${teams[i].name}</td><td>${teams[i].points}</td></tr>`;
    }
    document.getElementById('standingsTable').innerHTML = standingsHTML;
}


        function calculatePoints(teamName, teams, numGroups) {
    let points = 0;
    for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
        const groupTeams = teams.slice(groupIndex * Math.ceil(teams.length / numGroups), (groupIndex + 1) * Math.ceil(teams.length / numGroups)).map(team => team.name);
        for (let i = 0; i < groupTeams.length - 1; i++) {
            for (let j = i + 1; j < groupTeams.length; j++) {
                const goals1 = parseInt(document.getElementById(`result${groupTeams[i]}vs${groupTeams[j]}_team1`).value);
                const goals2 = parseInt(document.getElementById(`result${groupTeams[i]}vs${groupTeams[j]}_team2`).value);
                if (!isNaN(goals1) && !isNaN(goals2)) {
                    if (goals1 > goals2) {
                        if (groupTeams[i] === teamName) {
                            points += 2;
                        }
                    } else if (goals2 > goals1) {
                        if (groupTeams[j] === teamName) {
                            points += 2;
                        }
                    } else {
                        if (groupTeams[i] === teamName || groupTeams[j] === teamName) {
                            points += 1;
                        }
                    }
                }
            }
        }
    }

    // Nach der Berechnung der Punkte die Rangliste aktualisieren
    updateStandings(teams, numGroups);

    return points;
}

        function generateRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16); // Zufällige Hex-Farbe generieren
        }