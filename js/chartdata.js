google.charts.load('current', {'packages': ['geochart', 'corechart']});
google.charts.setOnLoadCallback(drawSmokingRegionsMap);
google.charts.setOnLoadCallback(drawAsthmaRegionsMap);
google.charts.setOnLoadCallback(drawMentalHealthRegionsMap);
google.charts.setOnLoadCallback(drawObesityRegionsMap);
var smokingStatsJsonArray = null;
var asthmaStatsJsonArray = null;
var mentalHealthStatsJsonArray = null;
var obesityStatsJsonArray = null;

function loadSmokingStats(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/smokingstats.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadAsthmaStats(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/asthmastats.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadMentalHealthStats(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/mentalhealthstats.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadObesityStats(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/obesitystats.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadSmokingStats(function (response) {
    smokingStatsJsonArray = JSON.parse(response);
});
loadAsthmaStats(function (response) {
    asthmaStatsJsonArray = JSON.parse(response);
});
loadMentalHealthStats(function (response) {
    mentalHealthStatsJsonArray = JSON.parse(response);
});
loadObesityStats(function (response) {
    obesityStatsJsonArray = JSON.parse(response);
});

function drawSmokingRegionsMap() {

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'State');
    dataTable.addColumn('number', 'Adults %');

    for (var i = 0; i < smokingStatsJsonArray.length; i++) {
        dataTable.addRow([smokingStatsJsonArray[i].location, parseFloat(smokingStatsJsonArray[i].percentage)]);
    }

    var options = {
        region: 'US',
        resolution: 'provinces',
        backgroundColor: '#81d4fa',
        colorAxis: {colors: ['#00853f', '#e31b23']},
        datalessRegionColor: '#f8bbd0',
        enableRegionInteractivity: true,
        tooltip: {trigger: 'focus'},
        defaultColor: '#f5f5f5'
    };
    var chart = new google.visualization.GeoChart(document.getElementById('smoking-geochart-colors'));
    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'select', selectHandler);

    //Default state is Ohio
    $('#smoking-currentState').text('Ohio');
    drawSmokingGenderChart('Ohio');
    drawSmokingRaceChart('Ohio');

    function selectHandler(e) {
        var selection = chart.getSelection();
        var state = '';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                state = dataTable.getFormattedValue(item.row, item.column);
            } else if (item.row != null) {
                state = dataTable.getFormattedValue(item.row, 0);
            } else if (item.column != null) {
                state = dataTable.getFormattedValue(0, item.column);
            }
        }
        if (state == '') {
            state = 'nothing';
        }
        $('#smoking-stats-link').click();
        drawSmokingGenderChart(state);
        drawSmokingRaceChart(state);
        $('#smoking-currentState').text(state);
    }
}

function drawSmokingGenderChart(state) {
    var contentArray = JSON.parse(smoking_gender_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Gender');
    dataTable.addColumn('number', 'Gender %');
    dataTable.addRow(['Male', parseFloat(content.male * 100)]);
    dataTable.addRow(['Female', parseFloat(content.female * 100)]);

    var options = {
        title: 'Smoking Stats by Gender',
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('smoking-piechart-gender'));
    chart.draw(dataTable, options);
}

function drawSmokingRaceChart(state) {

    var contentArray = JSON.parse(smoking_race_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Race');
    dataTable.addColumn('number', 'Race %');

    dataTable.addRow(['White', parseFloat(content.white * 100)]);
    dataTable.addRow(['Black', parseFloat(content.black * 100)]);
    dataTable.addRow(['Hispanic', parseFloat(content.hispanic * 100)]);
    dataTable.addRow(['Asian/Native Hawaiian and Pacific Islander', parseFloat(content.asianHawPac * 100)]);
    dataTable.addRow(['American Indian/Alaska Native', parseFloat(content.nativeAmerican * 100)]);
    dataTable.addRow(['Other', parseFloat(content.other * 100)]);
    dataTable.addRow(['All Adults', parseFloat(content.allAdults * 100)]);
    var options = {
        title: 'Smoking Stats by Race/Ethnicity',
        sliceVisibilityThreshold: 0,
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('smoking-piechart-race'));
    chart.draw(dataTable, options);
}

function drawAsthmaRegionsMap() {

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'State');
    dataTable.addColumn('number', 'Adults %');

    for (var i = 0; i < asthmaStatsJsonArray.length; i++) {
        dataTable.addRow([asthmaStatsJsonArray[i].location, parseFloat(asthmaStatsJsonArray[i].percentage)]);
    }

    var options = {
        region: 'US',
        resolution: 'provinces',
        backgroundColor: '#81d4fa',
        colorAxis: {colors: ['#00853f', '#e31b23']},
        datalessRegionColor: '#f8bbd0',
        enableRegionInteractivity: true,
        tooltip: {trigger: 'focus'},
        defaultColor: '#f5f5f5'
    };
    var chart = new google.visualization.GeoChart(document.getElementById('asthma-geochart-colors'));
    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'select', selectHandler);

    //Default state is Ohio
    $('#asthma-currentState').text('Ohio');
    drawAsthmaGenderChart('Ohio');
    drawAsthmaRaceChart('Ohio');

    function selectHandler(e) {
        var selection = chart.getSelection();
        var state = '';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                state = dataTable.getFormattedValue(item.row, item.column);
            } else if (item.row != null) {
                state = dataTable.getFormattedValue(item.row, 0);
            } else if (item.column != null) {
                state = dataTable.getFormattedValue(0, item.column);
            }
        }
        if (state == '') {
            state = 'nothing';
        }
        $('#asthma-stats-link').click();
        drawAsthmaGenderChart(state);
        drawAsthmaRaceChart(state);
        $('#asthma-currentState').text(state);
    }
}

function drawAsthmaGenderChart(state) {
    var contentArray = JSON.parse(asthma_gender_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Gender');
    dataTable.addColumn('number', 'Gender %');
    dataTable.addRow(['Male', parseFloat(content.male * 100)]);
    dataTable.addRow(['Female', parseFloat(content.female * 100)]);

    var options = {
        title: 'Adult Self-Reported Current Asthma Prevalence Rate by Gender',
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('asthma-piechart-gender'));
    chart.draw(dataTable, options);
}

function drawAsthmaRaceChart(state) {

    var contentArray = JSON.parse(asthma_race_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Race');
    dataTable.addColumn('number', 'Race %');

    dataTable.addRow(['White', parseFloat(content.white * 100)]);
    dataTable.addRow(['Black', parseFloat(content.black * 100)]);
    dataTable.addRow(['Hispanic', parseFloat(content.hispanic * 100)]);
    dataTable.addRow(['Asian/Native Hawaiian and Pacific Islander', parseFloat(content.asianHawPac * 100)]);
    dataTable.addRow(['American Indian/Alaska Native', parseFloat(content.nativeAmerican * 100)]);
    dataTable.addRow(['Other', parseFloat(content.other * 100)]);
    dataTable.addRow(['All Adults', parseFloat(content.allAdults * 100)]);
    var options = {
        title: 'Adult Self-Reported Current Asthma Prevalence Rate by Race/Ethnicity',
        sliceVisibilityThreshold: 0,
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('asthma-piechart-race'));
    chart.draw(dataTable, options);
}

function drawMentalHealthRegionsMap() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'State');
    dataTable.addColumn('number', 'Adults %');

    for (var i = 0; i < mentalHealthStatsJsonArray.length; i++) {
        dataTable.addRow([mentalHealthStatsJsonArray[i].location, parseFloat(mentalHealthStatsJsonArray[i].mentalHealth)]);
    }
    var options = {
        region: 'US',
        resolution: 'provinces',
        backgroundColor: '#81d4fa',
        colorAxis: {colors: ['#00853f', '#e31b23']},
        datalessRegionColor: '#f8bbd0',
        enableRegionInteractivity: true,
        tooltip: {trigger: 'focus'},
        defaultColor: '#f5f5f5'
    };
    var chart = new google.visualization.GeoChart(document.getElementById('mentalhealth-geochart-colors'));
    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'select', selectHandler);

    //Default state is Ohio
    $('#mentalhealth-currentState').text('Ohio');
    drawMentalHealthGenderChart('Ohio');
    drawMentalHealthRaceChart('Ohio');

    function selectHandler(e) {
        var selection = chart.getSelection();
        var state = '';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                state = dataTable.getFormattedValue(item.row, item.column);
            } else if (item.row != null) {
                state = dataTable.getFormattedValue(item.row, 0);
            } else if (item.column != null) {
                state = dataTable.getFormattedValue(0, item.column);
            }
        }
        if (state == '') {
            state = 'nothing';
        }
        $('#mentalhealth-stats-link').click();
        console.log(state);
        drawMentalHealthGenderChart(state);
        drawMentalHealthRaceChart(state);
        $('#mentalhealth-currentState').text(state);
    }
}

function drawMentalHealthGenderChart(state) {

    var contentArray = JSON.parse(mentalhealth_gender_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Gender');
    dataTable.addColumn('number', 'Gender %');
    dataTable.addRow(['Male', parseFloat(content.male * 100)]);
    dataTable.addRow(['Female', parseFloat(content.female * 100)]);

    var options = {
        title: 'Poor Mental Health Stats by Gender',
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('mentalhealth-piechart-gender'));
    chart.draw(dataTable, options);
}

function drawMentalHealthRaceChart(state) {

    var contentArray = JSON.parse(mentalhealth_race_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Race');
    dataTable.addColumn('number', 'Race %');

    dataTable.addRow(['White', parseFloat(content.white * 100)]);
    dataTable.addRow(['Black', parseFloat(content.black * 100)]);
    dataTable.addRow(['Hispanic', parseFloat(content.hispanic)]);
    dataTable.addRow(['Asian/Native Hawaiian and Pacific Islander', parseFloat(content.asianHawPac * 100)]);
    dataTable.addRow(['American Indian/Alaska Native', parseFloat(content.nativeAmerican * 100)]);
    dataTable.addRow(['Other', parseFloat(content.other * 100)]);
    var options = {
        title: 'Poor Mental Health Stats by Race/Ethnicity',
        sliceVisibilityThreshold: 0,
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('mentalhealth-piechart-race'));
    chart.draw(dataTable, options);
}

function drawObesityRegionsMap() {

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'State');
    dataTable.addColumn('number', 'Adults %');

    for (var i = 0; i < obesityStatsJsonArray.length; i++) {
        dataTable.addRow([obesityStatsJsonArray[i].location, parseFloat(obesityStatsJsonArray[i].percentage)]);
    }

    var options = {
        region: 'US',
        resolution: 'provinces',
        backgroundColor: '#81d4fa',
        colorAxis: {colors: ['#00853f', '#e31b23']},
        datalessRegionColor: '#f8bbd0',
        enableRegionInteractivity: true,
        tooltip: {trigger: 'focus'},
        defaultColor: '#f5f5f5'
    };
    var chart = new google.visualization.GeoChart(document.getElementById('obesity-geochart-colors'));
    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'select', selectHandler);

    //Default state is Ohio
    $('#obesity-currentState').text('Ohio');
    drawObesityGenderChart('Ohio');
    drawObesityRaceChart('Ohio');

    function selectHandler(e) {
        var selection = chart.getSelection();
        var state = '';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                state = dataTable.getFormattedValue(item.row, item.column);
            } else if (item.row != null) {
                state = dataTable.getFormattedValue(item.row, 0);
            } else if (item.column != null) {
                state = dataTable.getFormattedValue(0, item.column);
            }
        }
        if (state == '') {
            state = 'nothing';
        }
        $('#obesity-stats-link').click();
        drawObesityGenderChart(state);
        drawObesityRaceChart(state);
        $('#obesity-currentState').text(state);
    }
}

function drawObesityGenderChart(state) {
    var contentArray = JSON.parse(obesity_gender_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Gender');
    dataTable.addColumn('number', 'Gender %');
    dataTable.addRow(['Male', parseFloat(content.male * 100)]);
    dataTable.addRow(['Female', parseFloat(content.female * 100)]);

    var options = {
        title: 'Obesity Stats by Gender',
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('obesity-piechart-gender'));
    chart.draw(dataTable, options);
}

function drawObesityRaceChart(state) {

    var contentArray = JSON.parse(obesity_race_data);
    var content = null;
    for (var i = 0; i < contentArray.length; i++) {
        if (contentArray[i].location == state) {
            content = contentArray[i];
            break;
        }
    }
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Race');
    dataTable.addColumn('number', 'Race %');

    dataTable.addRow(['White', parseFloat(content.white * 100)]);
    dataTable.addRow(['Black', parseFloat(content.black * 100)]);
    dataTable.addRow(['Hispanic', parseFloat(content.hispanic * 100)]);
    dataTable.addRow(['Asian/Native Hawaiian and Pacific Islander', parseFloat(content.asianHawPac * 100)]);
    dataTable.addRow(['American Indian/Alaska Native', parseFloat(content.nativeAmerican * 100)]);
    dataTable.addRow(['Other', parseFloat(content.other * 100)]);
    dataTable.addRow(['All Adults', parseFloat(content.allAdults * 100)]);
    var options = {
        title: 'Obesity Stats by Race/Ethnicity',
        sliceVisibilityThreshold: 0,
        is3D: true
    };
    var chart = new google.visualization.PieChart(document.getElementById('obesity-piechart-race'));
    chart.draw(dataTable, options);
}
