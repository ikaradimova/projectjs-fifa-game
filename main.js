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
            // console.log(request.statusCode);
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

(function () {
    switch (window.location.pathname) {
        case '/projectjs-fifa-game/matches-stats.html':
            getMatchesStats();
            break;
        case '/projectjs-fifa-game/team-details.html':
            getTeamDetails();
            break;
        case '/projectjs-fifa-game/group-results-details.html':
            console.log('test');
            getGroupResultsDetails();
            break;
        default:
            break;
    }
})();

function getMatchesStats() {
    let result;

    Ajax.get('https://worldcup.sfg.io/matches', (result) => {
        let venueSelect = document.querySelector('#venue-select');
        let countrySelect = document.querySelector('#country-select');
        let goalsSelect = document.querySelector('#goals-select');
        let searchButton = document.querySelector('#search-button');
        let venues = [];
        let countries = [];
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
        venueSelect.options[venueSelect.options.length] = new Option('Select venue', '');
        venues.forEach(function (venue) {
            venueSelect.options[venueSelect.options.length] = new Option(venue, venue);
        });

        venueSelect.addEventListener('change', function () {
            console.log(venueSelect.value);
        });

        countrySelect.options[countrySelect.options.length] = new Option('Select country', '');
        countries.forEach(function (country) {
            countrySelect.options[countrySelect.options.length] = new Option(country, country);
        });

        countrySelect.addEventListener('change', function () {
            console.log(countrySelect.value);
        });

        searchButton.addEventListener('click', function (event) {
            let selectedVenue = venueSelect.value;
            let selectedCountry = countrySelect.value;
            let numberOfGoals = goalsSelect.value;
            console.log(isEmpty(selectedVenue));
            console.log(isEmpty(selectedCountry));
            console.log(isEmpty(numberOfGoals));
            console.log(numberOfGoals);

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
                console.log(searchResult);
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
                searchResult = result;
            }
            let tBody = document.querySelector('tbody');
            tBody.innerHTML = '';
            drawMatchesTable(searchResult);
        });

        drawMatchesTable(result);

    });

    // let matchesResult = Ajax.get('GET', 'https://worldcup.sfg.io/matches')
    //     .then(function (result) {
    //         console.log(result);
    //         console.log(result.length);
    //         drawMatchesTable(result);
    //         // myTableDiv.appendChild(table);
    //     })
    //     .catch(function () {
    //         console.log('error');
    //     });
    // // console.log(matchesResult);
}

function drawMatchesTable(result) {
    console.log(result);
    // let body = document.body;
    // let table = document.createElement('table');
    // body.appendChild(table);
    // let tableHead = document.createElement('thead');
    // table.appendChild(tableHead);
    // let tr1 = document.createElement('tr');
    // table.appendChild(tr1);
    // let thd = document.createElement('th');
    // console.log(thd);
    // // thd.setAttribute('scope', 'col');
    // // thd.setAttribute('colspan', '3');
    // let thdText = thd.appendChild(document.createTextNode(''));
    // tr1.appendChild(thdText);
    // let thdHomeTeam = document.createElement('th');
    // // thdHomeTeam.setAttribute('scope', 'col');
    // // thdHomeTeam.setAttribute('colspan', '3');
    // tr1.appendChild(thdHomeTeam.appendChild(document.createTextNode('Home team')));
    // let thdAwayTeam = document.createElement('th');
    // // thdAwayTeam.setAttribute('scope', 'col');
    // // thdAwayTeam.setAttribute('colspan', '3');
    // tr1.appendChild(thdAwayTeam.appendChild(document.createTextNode('Away team')));
    // // th1.appendChild(document.createElement('td').setAttribute('scope', 'col').setAttribute('colspan', '3').appendChild(document.createTextNode('Home team')));
    // // th1.appendChild(document.createElement('td  scope="col" colspan="3"').appendChild(document.createTextNode('Away team')));
    let table = document.getElementById('matched-stats');

    let tableBody = document.getElementsByTagName('tbody');
    // console.log(tableBody);
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);
    console.log(tableBody);

    for (let i = 0; i < result.length; i++) {
        let tr = document.createElement('tr');
        tableBody[0].appendChild(tr);

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

function getTeamDetails(){
    // console.log('det');
    Ajax.get('https://worldcup.sfg.io/teams/', (result) => {
        console.log(result);
        drawTeamDetailsTable(result);
    });
}

function drawTeamDetailsTable(result){
    let table = document.getElementById('team-details');

    let tableBody = document.getElementsByTagName('tbody');
    // console.log(tableBody);
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);
    console.log(tableBody);

    for (let i = 0; i < result.length; i++) {
        let tr = document.createElement('tr');
        tableBody[0].appendChild(tr);

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

function getGroupResultsDetails(){
    Ajax.get('https://worldcup.sfg.io/teams/group_results', (result) => {
        console.log(result);
        drawGroupResultsDetailsTable(result);
    });
}

function drawGroupResultsDetailsTable(result) {
    console.log(result);
    // let body = document.body;
    // let table = document.createElement('table');
    // body.appendChild(table);
    // let tableHead = document.createElement('thead');
    // table.appendChild(tableHead);
    // let tr1 = document.createElement('tr');
    // table.appendChild(tr1);
    // let thd = document.createElement('th');
    // console.log(thd);
    // // thd.setAttribute('scope', 'col');
    // // thd.setAttribute('colspan', '3');
    // let thdText = thd.appendChild(document.createTextNode(''));
    // tr1.appendChild(thdText);
    // let thdHomeTeam = document.createElement('th');
    // // thdHomeTeam.setAttribute('scope', 'col');
    // // thdHomeTeam.setAttribute('colspan', '3');
    // tr1.appendChild(thdHomeTeam.appendChild(document.createTextNode('Home team')));
    // let thdAwayTeam = document.createElement('th');
    // // thdAwayTeam.setAttribute('scope', 'col');
    // // thdAwayTeam.setAttribute('colspan', '3');
    // tr1.appendChild(thdAwayTeam.appendChild(document.createTextNode('Away team')));
    // // th1.appendChild(document.createElement('td').setAttribute('scope', 'col').setAttribute('colspan', '3').appendChild(document.createTextNode('Home team')));
    // // th1.appendChild(document.createElement('td  scope="col" colspan="3"').appendChild(document.createTextNode('Away team')));
    let table = document.getElementById('group-results-details');

    let tableBody = document.getElementsByTagName('tbody');
    // console.log(tableBody);
    let tr = document.createElement('tr');
    tableBody[0].appendChild(tr);
    console.log(tableBody);

    for (let i = 0; i < result.length; i++) {

        for (let j = 0; j < result[i].ordered_teams.length; j++) {
            // let i = 0;
            let tr = document.createElement('tr');
            tableBody[0].appendChild(tr);

            if(j === 0){
                let tdId = document.createElement('td');
                tdId.setAttribute('rowSpan', '4');
                tdId.appendChild(document.createTextNode(result[i].id));
                tr.appendChild(tdId);

                let tdLetter = document.createElement('td');
                tdLetter.setAttribute('rowSpan', '4');
                tdLetter.appendChild(document.createTextNode(result[i].letter));
                tr.appendChild(tdLetter);
            }

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

function isEmpty(value) {
    let response = false;
    if (value === '' || value === undefined || value === null || value === ' ') {
        response = true;
    }
    return response;
}
