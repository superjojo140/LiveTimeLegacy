<?
require($_SERVER["DOCUMENT_ROOT"] ."/include/userSystem/userSystem.php");
checkIfLoggedIn("false");
?>
    <!DOCTYPE html>
    <html>

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8"> </head>
    <style>
        td {
            border: 1px solid;
        }
    </style>

    <body>
        <table id="container" style="border-collapse:collapse;"></table>
        <button onclick="markAsPaid()">Als bezahlt markieren</button>
    </body>
    <script>
        var actualProjectId;
        getLastOpenedProject();
        var project = actualProjectId;
        xmlhttp2 = new XMLHttpRequest();
        xmlhttp2.onreadystatechange = function () {
            if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
                var json = JSON.parse(xmlhttp2.responseText);
                var resultBottom = "";
                var resultTop = "";
                var resultMiddle = "";
                var timeSum = 0;
                for (var i = 0; i < json.length; i++) {
                    var obj = json[i];
                    var start = new Date(Number(obj.timeStart));
                    var end = new Date(Number(obj.timeEnd));
                    var row = "";
                    //GesamtZeit berechnen
                    if (obj.type == "job") {
                        var myTimeEnd = obj.timeEnd;
                        if (obj.timeEnd == 0) {
                            myTimeEnd = new Date().getTime();
                        }
                        timeSum += myTimeEnd - obj.timeStart;
                    }
                    row += "<tr>";
                    row += "<td>" + obj.title + "</td>";
                    row += "<td>" + obj.description + "</td>";
                    row += "<td>" + start.toLocaleDateString() + "</td>";
                    row += "<td>" + formatNumber(start.getHours()) + ":" + formatNumber(start.getMinutes())
                    if (obj.timeEnd != 0) {
                        row += " - " + formatNumber(end.getHours()) + ":" + formatNumber(end.getMinutes());
                    }
                    row += "</td>";
                    row += "<td>" + getTimeDiff(obj.timeStart, obj.timeEnd) + "</td>";
                    row += "</tr>";
                    resultTop += row;
                }
                var sumBox = "<tr><td></td></tr><tr><td><strong>Gesamt<strong></td><td></td><td></td><td></td><td><strong>" + getTimeDiff(0, timeSum) + "</strong></td></tr>";
                document.getElementById("container").innerHTML = resultTop + sumBox;
            }
        };
        xmlhttp2.open("GET", "database.php?mode=get&project=" + project, false);
        xmlhttp2.send();
        actualProjectId = project;

        function formatNumber(myNumber) {
            if (myNumber < 10) {
                myNumber = "0" + myNumber;
            }
            return myNumber;
        }

        function getTimeDiff(start, end) {
            start = Number(start);
            end = Number(end);
            var dif = end - start;
            var hours = Math.floor(dif / (1000 * 60 * 60));
            var minutes = dif % (1000 * 60 * 60);
            minutes = Math.floor(minutes / (1000 * 60));
            //alert(hours + " - " + minutes);
            return hours + ":" + formatNumber(minutes);
        }

        function getLastOpenedProject() {
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var myJson = JSON.parse(xmlhttp.responseText);
                    actualProjectId = myJson.id;
                }
            };
            xmlhttp.open("GET", "database.php?mode=getLOP", false);
            xmlhttp.send();
        }

        function markAsPaid() {
            if (confirm("Wirklich alle Stunden als bezahlt markieren?")) {
                xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        alert(xmlhttp.responseText);
                    }
                };
                xmlhttp.open("GET", "markAsPaid.php?projectId="+actualProjectId, false);
                xmlhttp.send();
            }
        }
    </script>

    </html>