/* JS code for Serie A Matches */

async function getApiKey() {
    const response = await fetch('/api/key');
    const data = await response.json();
    return data.apiKey;
}

getApiKey().then(apiKey => {
    const url_ligamatches = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=140&season=2023&from=2023-08-01&to=2024-05-31';
    const options_ligamatches = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    fetch(url_ligamatches, options_ligamatches)
        .then(response => response.json())
        .then(data => {
            const fixtures = data.response;
            const fixtureList = document.getElementById('fixture-list');

            let currentRound = '';
            let roundGroup = document.createElement('div');
            let matchday = 1;

            fixtures.forEach((fixture, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'fixture-item';

                const homeTeamImage = document.createElement('img');
                homeTeamImage.src = fixture.teams.home.logo;
                homeTeamImage.alt = fixture.teams.home.name;
                homeTeamImage.className = 'team-image';

                const homeTeamDiv = document.createElement('div');
                homeTeamDiv.className = 'home-team';
                homeTeamDiv.appendChild(homeTeamImage);
                homeTeamDiv.innerHTML += ` ${fixture.teams.home.name}`;

                const vsText = document.createElement('span');
                vsText.textContent = 'vs';

                const awayTeamImage = document.createElement('img');
                awayTeamImage.src = fixture.teams.away.logo;
                awayTeamImage.alt = fixture.teams.away.name;
                awayTeamImage.className = 'team-image';

                const awayTeamDiv = document.createElement('div');
                awayTeamDiv.className = 'away-team';
                awayTeamDiv.innerHTML += ` ${fixture.teams.away.name}`;
                awayTeamDiv.appendChild(awayTeamImage);

                listItem.appendChild(homeTeamDiv);
                listItem.appendChild(vsText);
                listItem.appendChild(awayTeamDiv);

                if (index % 10 === 0) {
                    if (roundGroup.children.length > 0) {
                        fixtureList.appendChild(roundGroup);
                    }
                    currentRound = fixture.league.round;
                    roundGroup = document.createElement('div');
                    roundGroup.className = 'round-group';
                    const roundHeading = document.createElement('h2');
                    roundHeading.textContent = `Matchday ${matchday} of 38`;
                    roundGroup.appendChild(roundHeading);
                    matchday++;
                }

                roundGroup.appendChild(listItem);
            });

            if (roundGroup.children.length > 0) {
                fixtureList.appendChild(roundGroup);
            }
        })
        .catch(error => {
            console.error(error);
        });

    /* JS code for laliganews.html */

    const newsList = document.getElementById('news-list');
    const transfermarktURL = 'https://www.transfermarkt.us/premier-league/news/wettbewerb/ES1';

    async function fetchNewsData() {
        try {
            const response = await fetch('https://transfermarkt-db.p.rapidapi.com/v1/competitions/news?competition_id=ES1&locale=UK', {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'transfermarkt-db.p.rapidapi.com',
                },
            });

            const data = await response.json();
            return data.data.news;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    function displayNews(newsData) {
        newsList.innerHTML = '';

        newsData.forEach((item) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const image = document.createElement('img');
            image.src = item.newsFirstImage;

            const text = document.createElement('div');
            text.classList.add('news-text');

            const headline = document.createElement('h2');
            headline.textContent = item.newsHeadline;

            const date = document.createElement('p');
            date.classList.add('news-date');
            date.textContent = item.fullNewsDate;

            text.appendChild(headline);
            text.appendChild(date);

            newsItem.appendChild(image);
            newsItem.appendChild(text);

            newsList.appendChild(newsItem);
        });

        const newsEndURLContainer = document.createElement('div');
        newsEndURLContainer.classList.add('centered');

        const newsEndURL = document.createElement('a');
        newsEndURL.classList.add('news-end-url');
        newsEndURL.textContent = 'For more news, visit Transfermarket';
        newsEndURL.href = transfermarktURL;
        newsEndURL.target = '_blank';

        newsEndURLContainer.appendChild(newsEndURL);

        newsList.appendChild(newsEndURLContainer);
    }

    fetchNewsData()
        .then(displayNews)
        .catch(error => console.error(error));

    /* JS code for laligagoals.html */

    const url_ligagoals = 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=140&season=2023';
    const options_ligagoals = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    async function fetchtopscorers() {
        try {
            const response = await fetch(url_ligagoals, options_ligagoals);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const topScorers = data.response;
            const topScorersBody = document.getElementById('top-scorers-body');
            topScorers.forEach(goal => {
                const playerName = `${goal.player.firstname} ${goal.player.lastname}`;
                const goalsScored = goal.statistics[0].goals.total;

                const row = topScorersBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                cell1.innerHTML = `<img src="${goal.player.photo}" alt="${playerName}" width="50" height="50">`;
                cell2.textContent = playerName;
                cell3.textContent = goalsScored;
            });
        } catch (error) {
            console.error('Error fetching top scorers data:', error);
        }
    }

    fetchtopscorers();

    const url_ligaassisters = 'https://api-football-v1.p.rapidapi.com/v3/players/topassists?league=140&season=2023';
    const options_ligaassisters = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    async function fetchtopassisters() {
        try {
            const response = await fetch(url_ligaassisters, options_ligaassisters);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const topAssisters = data.response;
            const topAssistersBody = document.getElementById('top-assisters-body');
            topAssisters.forEach(assist => {
                const playerName = `${assist.player.firstname} ${assist.player.lastname}`;
                const goalsAssisted = assist.statistics[0].goals.assists;

                const row = topAssistersBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                cell1.innerHTML = `<img src="${assist.player.photo}" alt="${playerName}" width="50" height="50">`;
                cell2.textContent = playerName;
                cell3.textContent = goalsAssisted;
            });
        } catch (error) {
            console.error('Error fetching top assisters data:', error);
        }
    }

    fetchtopassisters();

    /* JS code for serie A */

    const url_ligastandings = 'https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=140';
    const options_ligastandings = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    const standingsBody = document.getElementById('standings-body');

async function fetchStandings() {
    try {
        const response = await fetch(url_ligastandings, options_ligastandings);
        const data = await response.json();
        const standings = data.response[0].league.standings[0];

        standings.forEach((teamData) => {
            const teamRow = document.createElement('tr');
            teamRow.innerHTML = `
                <td>${teamData.rank}</td>
                <td>${teamData.team.name}</td>
                <td><img src="${teamData.team.logo}" alt="${teamData.team.name}"></td>
                <td>${teamData.points}</td>
                <td>${teamData.all.played}</td>
                <td>${teamData.all.goals.for}</td>
                <td>${teamData.all.goals.against}</td>
                <td>${teamData.goalsDiff}</td>
                <td>${teamData.form}</td>
            `;
            standingsBody.appendChild(teamRow);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchStandings();

}).catch(error => console.error(error));
