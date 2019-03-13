/** Ajax wrapper */
let Ajax = {
    ajax: null,
    init() {
        if (!this.ajax) {
            this.ajax = new XMLHttpRequest();
        }
        return this.ajax;
    },
    get(url, callback) {
        let request = this.init();
        request.open("GET", url);
        request.send();
        request.onload = () => {
            callback(JSON.parse(request.responseText));
        };
    },
    post(url, data, callback) {

        let request = this.init();
        request.open("POST", url);
        request.send(data);
        request.onload = () => {
            callback(JSON.parse(request.responseText));
        };
    }
};

let history = [];

/** Function for including html in html files */
function includeHTML() {
    let z, i, element, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        element = z[i];
        file = element.getAttribute("include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        element.innerHTML = this.responseText;
                    }
                    if (this.status === 404) {
                        element.innerHTML = "Page not found.";
                    }
                    element.removeAttribute("include-html");
                    includeHTML();
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

/** Function for redirecting to different functions depending on the uri */
(function () {
    switch (window.location.pathname) {
        case '/projectjs-fifa-game/matches-stats.html': // matches stats
            getMatchesStats();
            break;
        case '/projectjs-fifa-game/team-details.html': // team details
            getTeamDetails();
            break;
        case '/projectjs-fifa-game/group-results-details.html': // group results details
            getGroupResultsDetails();
            break;
        case '/projectjs-fifa-game/country-details.html': // country details
            getCountryDetails();
            break;
        case '/projectjs-fifa-game/history.html': // history page
            getHistory();
            break;
        default:
            break;
    }
})();

/** Function for fetching matches stats data */
function getMatchesStats() {
    /** saving new data about current action in localStorage */
    history = [];
    /** checking if localStorage is empty */
    if (localStorage.getItem('history') == null || localStorage.getItem('history') === '[]') {
        /** if empty pushes first value */
        localStorage.setItem('history', JSON.stringify({
            action: 'Matches statistics',
            date: new Date(Date.now()).toLocaleString()
        }));
    } else {
        /** if value not empty get what is inside localStorage, adds new action and pushes the new data in localStorage */
        for (let i = 0; i < JSON.parse(localStorage.getItem('history')).length; i++) {
            history.push(JSON.parse(localStorage.getItem('history'))[i]);
        }
        history.push({action: 'Matches statistics', date: new Date(Date.now()).toLocaleString()});
        localStorage.setItem('history', JSON.stringify(history));
    }
    // let result;

    /** fetching data */
    Ajax.get('http://worldcup.sfg.io/matches', (result) => {
        let venueSelect = document.querySelector('#venue-select');
        let countrySelect = document.querySelector('#country-select');
        let goalsSelect = document.querySelector('#goals-select');
        let searchButton = document.querySelector('#search-button');
        /** variable for collecting all venues in order to display them in the select */
        let venues = [];
        /** variable for collecting all possible countries (both away and home teams) in order to display them in the select */
        let countries = [];
        /** gets non repetitive values */
        result.forEach(function (singleResult) {
            if (venues.includes(singleResult.venue) === false) {
                venues.push(singleResult.venue);
            }
            if (countries.includes(singleResult.away_team_country) === false) {
                countries.push(singleResult.away_team_country);
            }
            if (countries.includes(singleResult.home_team_country) === false) {
                countries.push(singleResult.home_team_country);
            }
        });
        /** filling venue select with venue values */
        venueSelect.options[venueSelect.options.length] = new Option('Select venue', '');
        venues.forEach(function (venue) {
            venueSelect.options[venueSelect.options.length] = new Option(venue, venue);
        });

        /** filling country select with country values */
        countrySelect.options[countrySelect.options.length] = new Option('Select country', '');
        countries.forEach(function (country) {
            countrySelect.options[countrySelect.options.length] = new Option(country, country);
        });

        /** adding on click event that triggers search */
        searchButton.addEventListener('click', function (event) {
            /** getting values to filter by */
            let selectedVenue = venueSelect.value;
            let selectedCountry = countrySelect.value;
            let numberOfGoals = goalsSelect.value;
            /** adding action about what is searched in localStorage */
            history.push({
                action: `Search venue=${selectedVenue}, country=${selectedCountry}, numGoals=${numberOfGoals}`,
                date: new Date(Date.now()).toLocaleString()
            });
            localStorage.setItem('history', JSON.stringify(history));

            /** search logic */
            let searchResult = [];
            if (
                isEmpty(selectedVenue) === false &&
                isEmpty(selectedCountry) === false &&
                isEmpty(numberOfGoals) === false
            ) {
                result.forEach(function (singleResult) {
                    if (
                        singleResult.venue == selectedVenue &&
                        (singleResult.away_team_country == selectedCountry ||
                            singleResult.home_team_country == selectedCountry) &&
                        (singleResult.away_team.goals == numberOfGoals ||
                            singleResult.home_team.goals == numberOfGoals)
                    ) {
                        searchResult.push(singleResult);
                    }
                })
            } else if (
                isEmpty(selectedVenue) === false &&
                isEmpty(selectedCountry) === false
            ) {
                result.forEach(function (singleResult) {
                    if (
                        singleResult.venue == selectedVenue &&
                        (singleResult.away_team_country == selectedCountry ||
                            singleResult.home_team_country == selectedCountry)
                    ) {
                        searchResult.push(singleResult);
                    }
                })
            } else if (
                isEmpty(selectedCountry) === false &&
                isEmpty(numberOfGoals) === false
            ) {
                result.forEach(function (singleResult) {
                    if (
                        (singleResult.away_team_country == selectedCountry ||
                            singleResult.home_team_country == selectedCountry) &&
                        (singleResult.away_team.goals == numberOfGoals ||
                            singleResult.home_team.goals == numberOfGoals)
                    ) {
                        searchResult.push(singleResult);
                    }
                })
            } else if (
                isEmpty(selectedVenue) === false &&
                isEmpty(numberOfGoals) === false
            ) {
                result.forEach(function (singleResult) {
                    if (
                        singleResult.venue == selectedVenue &&
                        (singleResult.away_team.goals == numberOfGoals ||
                            singleResult.home_team.goals == numberOfGoals)
                    ) {
                        searchResult.push(singleResult);
                    }
                })
            } else if (isEmpty(selectedVenue) === false) {
                result.forEach(function (singleResult) {
                    if (singleResult.venue == selectedVenue) {
                        searchResult.push(singleResult);
                    }
                });
            } else if (isEmpty(selectedCountry) === false) {
                result.forEach(function (singleResult) {
                    if (
                        (singleResult.away_team_country == selectedCountry ||
                            singleResult.home_team_country == selectedCountry)
                    ) {
                        searchResult.push(singleResult);
                    }
                })
            } else if (isEmpty(numberOfGoals) === false) {
                result.forEach(function (singleResult) {
                    if (
                        singleResult.away_team.goals == numberOfGoals ||
                        singleResult.home_team.goals == numberOfGoals
                    ) {
                        searchResult.push(singleResult);
                    }
                })
            } else if (isEmpty(selectedVenue) === true &&
                isEmpty(selectedCountry) === true &&
                isEmpty(numberOfGoals) === true) {
                /** if no search values returns all results as there is nothing to be filtered by */
                searchResult = result;
            }
            /** clears table body */
            let tBody = document.querySelector('tbody');
            tBody.innerHTML = '';
            /** drawing table with filtered results */
            drawMatchesTable(searchResult);
        });
        /** drawing table with original results */
        drawMatchesTable(result);
    });
}

/** Function for drawing matches stats table */
function drawMatchesTable(result) {
    let table = document.getElementById('matched-stats');
    let tableBody = document.getElementsByTagName('tbody');
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);

    for (let i = 0; i < result.length; i++) {
        /** adding new table row for each result */
        let tr = document.createElement('tr');
        tableBody[0].appendChild(tr);

        /** adding cells */
        let tdFifaId = document.createElement('td');
        tdFifaId.appendChild(document.createTextNode(result[i].fifa_id));
        tr.appendChild(tdFifaId);

        let tdVenue = document.createElement('td');
        tdVenue.appendChild(document.createTextNode(result[i].venue));
        tr.appendChild(tdVenue);

        let tdAttendance = document.createElement('td');
        tdAttendance.appendChild(document.createTextNode(result[i].attendance));
        tr.appendChild(tdAttendance);

        let tdHomeTeamCountry = document.createElement('td');
        tdHomeTeamCountry.appendChild(document.createTextNode(result[i].home_team.country));
        tr.appendChild(tdHomeTeamCountry);

        let tdHomeTeamGoals = document.createElement('td');
        tdHomeTeamGoals.appendChild(document.createTextNode(result[i].home_team.goals));
        tr.appendChild(tdHomeTeamGoals);

        let tdHomeTeamPenalties = document.createElement('td');
        tdHomeTeamPenalties.appendChild(document.createTextNode(result[i].home_team.penalties));
        tr.appendChild(tdHomeTeamPenalties);

        let tdHomeTeamRedCards = document.createElement('td');
        tdHomeTeamRedCards.appendChild(document.createTextNode(result[i].home_team_statistics.red_cards));
        tr.appendChild(tdHomeTeamRedCards);

        let tdHomeTeamCorners = document.createElement('td');
        tdHomeTeamCorners.appendChild(document.createTextNode(result[i].home_team_statistics.corners));
        tr.appendChild(tdHomeTeamCorners);

        let tdHomeTeamPassAccuracy = document.createElement('td');
        tdHomeTeamPassAccuracy.appendChild(document.createTextNode(result[i].home_team_statistics.pass_accuracy + '%'));
        tr.appendChild(tdHomeTeamPassAccuracy);

        let tdAwayTeamCountry = document.createElement('td');
        tdAwayTeamCountry.appendChild(document.createTextNode(result[i].away_team.country));
        tr.appendChild(tdAwayTeamCountry);

        let tdAwayTeamGoals = document.createElement('td');
        tdAwayTeamGoals.appendChild(document.createTextNode(result[i].away_team.goals));
        tr.appendChild(tdAwayTeamGoals);

        let tdAwayTeamPenalties = document.createElement('td');
        tdAwayTeamPenalties.appendChild(document.createTextNode(result[i].away_team.penalties));
        tr.appendChild(tdAwayTeamPenalties);

        let tdAwayTeamRedCards = document.createElement('td');
        tdAwayTeamRedCards.appendChild(document.createTextNode(result[i].away_team_statistics.red_cards));
        tr.appendChild(tdAwayTeamRedCards);

        let tdAwayTeamCorners = document.createElement('td');
        tdAwayTeamCorners.appendChild(document.createTextNode(result[i].away_team_statistics.corners));
        tr.appendChild(tdAwayTeamCorners);

        let tdAwayTeamPassAccuracy = document.createElement('td');
        tdAwayTeamPassAccuracy.appendChild(document.createTextNode(result[i].away_team_statistics.pass_accuracy + '%'));
        tr.appendChild(tdAwayTeamPassAccuracy);
    }
}

/** Function for fetching team details data */
function getTeamDetails() {
    /** saving new data about current action in localStorage */
    history = [];
    /** checking if localStorage is empty */
    if (localStorage.getItem('history') == null || localStorage.getItem('history') === '[]') {
        /** if empty pushes first value */
        localStorage.setItem('history', JSON.stringify({
            action: 'Team details',
            date: new Date(Date.now()).toLocaleString()
        }));
    } else {
        /** if value not empty get what is inside localStorage, adds new action and pushes the new data in localStorage */
        for (let i = 0; i < JSON.parse(localStorage.getItem('history')).length; i++) {
            history.push(JSON.parse(localStorage.getItem('history'))[i]);
        }
        history.push({action: 'Team details', date: new Date(Date.now()).toLocaleString()});
        localStorage.setItem('history', JSON.stringify(history));
    }

    /** fetching data */
    Ajax.get('http://worldcup.sfg.io/teams/', (result) => {
        /** filling table with data */
        drawTeamDetailsTable(result);
    });
}

/** Function for drawing team details table */
function drawTeamDetailsTable(result) {
    let table = document.getElementById('team-details');
    let tableBody = document.getElementsByTagName('tbody');
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);

    for (let i = 0; i < result.length; i++) {
        /** adding new table row for each result */
        let tr = document.createElement('tr');
        tableBody[0].appendChild(tr);

        /** adding cells */
        let tdId = document.createElement('td');
        tdId.appendChild(document.createTextNode(result[i].id));
        tr.appendChild(tdId);

        let tdGroupId = document.createElement('td');
        tdGroupId.appendChild(document.createTextNode(result[i].group_id));
        tr.appendChild(tdGroupId);

        let tdGroupLetter = document.createElement('td');
        tdGroupLetter.appendChild(document.createTextNode(result[i].group_letter));
        tr.appendChild(tdGroupLetter);

        let tdFifaCode = document.createElement('td');
        tdFifaCode.appendChild(document.createTextNode(result[i].fifa_code));
        tr.appendChild(tdFifaCode);

        let tdCountry = document.createElement('td');
        tdCountry.appendChild(document.createTextNode(result[i].country));
        tr.appendChild(tdCountry);
    }
}

/** Function for fetching group results details data */
function getGroupResultsDetails() {
    /** saving new data about current action in localStorage */
    history = [];
    /** checking if localStorage is empty */
    if (localStorage.getItem('history') == null || localStorage.getItem('history') === '[]') {
        /** if empty pushes first value */
        localStorage.setItem('history', JSON.stringify({
            action: 'Group results details',
            date: new Date(Date.now()).toLocaleString()
        }));
    } else {
        /** if value not empty get what is inside localStorage, adds new action and pushes the new data in localStorage */
        for (let i = 0; i < JSON.parse(localStorage.getItem('history')).length; i++) {
            history.push(JSON.parse(localStorage.getItem('history'))[i]);
        }
        history.push({action: 'Group results details', date: new Date(Date.now()).toLocaleString()});
        localStorage.setItem('history', JSON.stringify(history));
    }

    /** fetching data */
    Ajax.get('http://worldcup.sfg.io/teams/group_results', (result) => {
        /** filling table with data */
        drawGroupResultsDetailsTable(result);
    });
}

/** Function for drawing group results details table */
function drawGroupResultsDetailsTable(result) {
    let table = document.getElementById('group-results-details');
    let tableBody = document.getElementsByTagName('tbody');
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);

    /** getting all rows */
    for (let i = 0; i < result.length; i++) {

        /** getting rows for each group */
        for (let j = 0; j < result[i].ordered_teams.length; j++) {
            /** adding new row */
            let tr = document.createElement('tr');
            tableBody[0].appendChild(tr);

            /** merging id and letter for each group */
            if (j === 0) {
                let tdId = document.createElement('td');
                tdId.setAttribute('rowSpan', '4');
                tdId.appendChild(document.createTextNode(result[i].id));
                tr.appendChild(tdId);

                let tdLetter = document.createElement('td');
                tdLetter.setAttribute('rowSpan', '4');
                tdLetter.appendChild(document.createTextNode(result[i].letter));
                tr.appendChild(tdLetter);
            }

            /** creating other cells */
            let tdOrderedTeamId = document.createElement('td');
            tdOrderedTeamId.appendChild(document.createTextNode(result[i].ordered_teams[j].id));
            tr.appendChild(tdOrderedTeamId);

            let tdOrderedTeamFifaCode = document.createElement('td');
            tdOrderedTeamFifaCode.appendChild(document.createTextNode(result[i].ordered_teams[j].fifa_code));
            tr.appendChild(tdOrderedTeamFifaCode);

            let tdOrderedTeamCountry = document.createElement('td');
            tdOrderedTeamCountry.appendChild(document.createTextNode(result[i].ordered_teams[j].country));
            tr.appendChild(tdOrderedTeamCountry);

            let tdOrderedTeamPoints = document.createElement('td');
            tdOrderedTeamPoints.appendChild(document.createTextNode(result[i].ordered_teams[j].points));
            tr.appendChild(tdOrderedTeamPoints);

            let tdOrderedTeamWins = document.createElement('td');
            tdOrderedTeamWins.appendChild(document.createTextNode(result[i].ordered_teams[j].wins));
            tr.appendChild(tdOrderedTeamWins);

            let tdOrderedTeamLosses = document.createElement('td');
            tdOrderedTeamLosses.appendChild(document.createTextNode(result[i].ordered_teams[j].losses));
            tr.appendChild(tdOrderedTeamLosses);

            let tdOrderedTeamDraws = document.createElement('td');
            tdOrderedTeamDraws.appendChild(document.createTextNode(result[i].ordered_teams[j].draws));
            tr.appendChild(tdOrderedTeamDraws);

            let tdOrderedTeamGamesPlayed = document.createElement('td');
            tdOrderedTeamGamesPlayed.appendChild(document.createTextNode(result[i].ordered_teams[j].games_played));
            tr.appendChild(tdOrderedTeamGamesPlayed);

            let tdOrderedTeamGoalDifferential = document.createElement('td');
            tdOrderedTeamGoalDifferential.appendChild(document.createTextNode(result[i].ordered_teams[j].goal_differential));
            tr.appendChild(tdOrderedTeamGoalDifferential);

            let tdOrderedTeamGoalsAgainst = document.createElement('td');
            tdOrderedTeamGoalsAgainst.appendChild(document.createTextNode(result[i].ordered_teams[j].goals_against));
            tr.appendChild(tdOrderedTeamGoalsAgainst);

            let tdOrderedTeamGoalsFor = document.createElement('td');
            tdOrderedTeamGoalsFor.appendChild(document.createTextNode(result[i].ordered_teams[j].goals_for));
            tr.appendChild(tdOrderedTeamGoalsFor);
        }
    }
}

/** Function for fetching country details data */
function getCountryDetails() {
    /** saving new data about current action in localStorage */
    history = [];
    /** checking if localStorage is empty */
    if (localStorage.getItem('history') == null || localStorage.getItem('history') === '[]') {
        /** if empty pushes first value */
        localStorage.setItem('history', JSON.stringify({
            action: 'Country details',
            date: new Date(Date.now()).toLocaleString()
        }));
    } else {
        /** if value not empty get what is inside localStorage, adds new action and pushes the new data in localStorage */
        for (let i = 0; i < JSON.parse(localStorage.getItem('history')).length; i++) {
            history.push(JSON.parse(localStorage.getItem('history'))[i]);
        }
        history.push({action: 'Country details', date: new Date(Date.now()).toLocaleString()});
        localStorage.setItem('history', JSON.stringify(history));
    }

    /** fetching teams data in order to get country name and fifaCode */
    Ajax.get('http://worldcup.sfg.io/teams/', (result) => {
        /** storing fifaCode and country name for all countries */
        let countryList = [];
        result.forEach(function (singleResult) {
            countryList.push({'fifaCode': singleResult.fifa_code, 'country': singleResult.country});
        });

        let selectCountry = document.querySelector('#select-country');
        /** pushing country data into select */
        selectCountry.options[selectCountry.options.length] = new Option('Select country', '');
        for (let i = 0; i < countryList.length; i++) {
            selectCountry.options[selectCountry.options.length] = new Option(countryList[i].country, countryList[i].fifaCode);
        }

        /** adding on change event listener on the select to filter data for country */
        selectCountry.addEventListener('change', function (event) {
            /** checking if value is selected */
            if (isEmpty(selectCountry.value) === false) {
                /** adding new action to localStorage */
                history.push({action: `Search country fifa_code=${selectCountry.value}`, date: new Date(Date.now()).toLocaleString()});
                localStorage.setItem('history', JSON.stringify(history));
                /** fetching data for country */
                Ajax.get(`http://worldcup.sfg.io/matches/country?fifa_code=${selectCountry.value}`, (countryData) => {
                    /** filling table with data */
                    drawCountryDetailsTable(countryData);
                })
            } else {
                /** if no value selected shows nothing */
                let table = document.getElementById('country-details');
                table.classList.add('hidden');
            }
        })
    });
}

/** Function for drawing country details table */
function drawCountryDetailsTable(result) {
    let table = document.getElementById('country-details');
    table.classList.remove('hidden');
    let tableBody = document.getElementsByTagName('tbody');
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);

    for (let i = 0; i < result.length; i++) {
        /** adding new table row for each result */
        let tr = document.createElement('tr');
        tableBody[0].appendChild(tr);

        /** adding cells */
        let tdDate = document.createElement('td');
        tdDate.appendChild(document.createTextNode(result[i].datetime.substring(0, 10)));
        tr.appendChild(tdDate);

        let tdVenue = document.createElement('td');
        tdVenue.appendChild(document.createTextNode(result[i].venue));
        tr.appendChild(tdVenue);

        let tdLocation = document.createElement('td');
        tdLocation.appendChild(document.createTextNode(result[i].location));
        tr.appendChild(tdLocation);

        let tdAttendance = document.createElement('td');
        tdAttendance.appendChild(document.createTextNode(result[i].attendance));
        tr.appendChild(tdAttendance);

        let tdHomeTeam = document.createElement('td');
        tdHomeTeam.appendChild(document.createTextNode(result[i].home_team_country));
        tr.appendChild(tdHomeTeam);

        let tdAwayTeam = document.createElement('td');
        tdAwayTeam.appendChild(document.createTextNode(result[i].away_team_country));
        tr.appendChild(tdAwayTeam);

        let tdWinner = document.createElement('td');
        tdWinner.appendChild(document.createTextNode(result[i].winner));
        tr.appendChild(tdWinner);

        let tdWeatherDescription = document.createElement('td');
        tdWeatherDescription.appendChild(document.createTextNode(result[i].weather.description));
        tr.appendChild(tdWeatherDescription);

        let tdWindSpeed = document.createElement('td');
        tdWindSpeed.appendChild(document.createTextNode(result[i].weather.wind_speed));
        tr.appendChild(tdWindSpeed);

        let tdHumidity = document.createElement('td');
        tdHumidity.appendChild(document.createTextNode(result[i].weather.humidity));
        tr.appendChild(tdHumidity);

        let tdTempCelsius = document.createElement('td');
        tdTempCelsius.appendChild(document.createTextNode(result[i].weather.temp_celsius));
        tr.appendChild(tdTempCelsius);
    }
}

/** Function for showing history */
function getHistory(){

    /** filling history table with data before saving action in localStorage, so it will show next time we visit history */
    drawHistoryTable(JSON.parse(localStorage.getItem('history')));

    /** saving new data about current action in localStorage */
    history = [];
    /** checking if localStorage is empty */
    if (localStorage.getItem('history') == null || localStorage.getItem('history') === '[]') {
        /** if empty pushes first value */
        localStorage.setItem('history', JSON.stringify({
            action: 'History visited',
            date: new Date(Date.now()).toLocaleString()
        }));
    } else {
        /** if value not empty get what is inside localStorage, adds new action and pushes the new data in localStorage */
        for (let i = 0; i < JSON.parse(localStorage.getItem('history')).length; i++) {
            history.push(JSON.parse(localStorage.getItem('history'))[i]);
        }
        history.push({action: 'History visited', date: new Date(Date.now()).toLocaleString()});
        localStorage.setItem('history', JSON.stringify(history));
    }
}

/** Function for drawing history table */
function drawHistoryTable(result){
    let table = document.getElementById('history');
    let tableBody = document.getElementsByTagName('tbody');
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);

    for (let i = 0; i < result.length; i++) {
        /** adding new table row for each result */
        let tr = document.createElement('tr');
        tableBody[0].appendChild(tr);

        /** adding cells */
        let tdAction = document.createElement('td');
        tdAction.appendChild(document.createTextNode(result[i].action));
        tr.appendChild(tdAction);

        let tdDate = document.createElement('td');
        tdDate.appendChild(document.createTextNode(result[i].date));
        tr.appendChild(tdDate);
    }
}

/** Function for checking if value is empty */
function isEmpty(value) {
    let response = false;
    if (value === '' || value === undefined || value === null || value === ' ') {
        response = true;
    }
    return response;
}
