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
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {element.innerHTML = this.responseText;}
                    if (this.status === 404) {element.innerHTML = "Page not found.";}
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
        default:
            break;
    }
})();

function getMatchesStats() {
    // let result = getMatchesData();
    // console.log(result);
    Ajax.get('https://worldcup.sfg.io/matches', (result) => {
        drawMatchesTable(result);
        // console.log(data);
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

function getMatchesData(){
    Ajax.get('https://worldcup.sfg.io/matches', (result) => {
        console.log(result);
        return result;
        // console.log(data);
    });
}