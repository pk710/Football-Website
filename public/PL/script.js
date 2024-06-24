// Function to get the API key from the server
async function getApiKey() {
    try {
        const response = await fetch('/api/key');
        const data = await response.json();
        return data.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
}

/* JS code for PL Matches */
async function fetchPLMatches(apiKey) {
    const url_plmatches = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2023&from=2023-08-01&to=2024-05-31';
    const options_plmatches = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        },
    };

    try {
        const response = await fetch(url_plmatches, options_plmatches);
        const data = await response.json();
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
    } catch (error) {
        console.error('Error fetching Premier League matches:', error);
    }
}

/* JS code for PL table */
async function fetchPLTable(apiKey) {
    const url_pltable = 'https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=39';
    const options_pltable = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    const standingsBody = document.getElementById('standings-body');

    try {
        const response = await fetch(url_pltable, options_pltable);
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
        console.error('Error fetching Premier League table:', error);
    }
}

/* JS code for top scorers and assisters */
async function fetchTopScorers(apiKey) {
    const url_topsc = 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=39&season=2023';
    const options_topsc = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url_topsc, options_topsc);
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

async function fetchTopAssisters(apiKey) {
    const url_topassists = 'https://api-football-v1.p.rapidapi.com/v3/players/topassists?league=39&season=2023';
    const options_topassists = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url_topassists, options_topassists);
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

/* JS code for news */
async function fetchNewsData(apiKey) {
    const newsList = document.getElementById('news-list');
    const transfermarktURL = 'https://www.transfermarkt.us/premier-league/news/wettbewerb/GB1';

    try {
        const response = await fetch('https://transfermarkt-db.p.rapidapi.com/v1/competitions/news?competition_id=GB1&locale=UK', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'transfermarkt-db.p.rapidapi.com',
            },
        });

        const data = await response.json();
        const newsData = data.data.news;

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
        newsEndURL.textContent = 'For more news, visit Transfermarkt';
        newsEndURL.href = transfermarktURL;
        newsEndURL.target = '_blank';

        newsEndURLContainer.appendChild(newsEndURL);

        newsList.appendChild(newsEndURLContainer);

    } catch (error) {
        console.error('Error fetching news data:', error);
        return [];
    }
}

// Fetch the API key and call the functions
getApiKey().then(apiKey => {
    if (apiKey) {
        fetchPLMatches(apiKey);
        fetchPLTable(apiKey);
        fetchTopScorers(apiKey);
        fetchTopAssisters(apiKey);
        fetchNewsData(apiKey);
    }
});
