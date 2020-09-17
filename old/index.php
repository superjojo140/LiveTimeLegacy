<?php
 require($_SERVER["DOCUMENT_ROOT"] ."/include/userSystem/userSystem.php");
checkIfLoggedIn("false");
?>
    <!DOCTYPE html>
    <html lang="de">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <script src="http://code.jquery.com/jquery-latest.js"></script>
        <script src="script.js"></script>
        <title>liveTime</title>
        <script>
            function toggleIFrame() {
                var el = document.getElementById("loginFrame");
                if (el.style.display != 'none') {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = '';
                }
            }
        </script>
    </head>

    <body>
        <? include('../include/header.php'); ?>
            <content>
                <sidebar id="sidebar">
                    <sideTopBar> <b>Projekte</b>
                        <icon id="showAddProject" style="background: #c9c6c6; float:right;">add</icon>
                        <addProject>
                            <hr>
                            <form id="addProjectForm">
                                <input id="newProjectName" type="text" placeholder="Name">
                                <icon id="sendNewProject">send</icon>
                            </form>
                        </addProject>
                    </sideTopBar>
                    <sidebarContent id="sidebarContent"> </sidebarContent>
                </sidebar>
                <main>
                    <form>
                        <inputArea>
                            <leftInputArea>
                                <input id="newTitle" type="text" placeholder="Titel">
                                <br>
                                <textarea id="newDescription" type="text" placeholder="Beschreibung" rows="3"></textarea>
                            </leftInputArea>
                            <rightInputArea>
                                <icon>event_note</icon>
                                <input id="newDate" type="text">
                                <br>
                                <icon>access_time</icon>
                                <input id="newTimeStart" type="text">
                                <br>
                                <icon>timer_off</icon>
                                <input id="newTimeEnd" type="text"> </rightInputArea>
                        </inputArea>
                        <div style="display: flex;">
                            <btn class="btn" id="saveButton" data-type="job"> Job hinzufügen </btn>
                            <btn class="btn" id="saveNote" data-type="note"> Notiz hinzufügen </btn>
                        </div>
                    </form>
                    <list id="list"></list>
                </main>
            </content>
    </body>
    <link rel="stylesheet" href="style.css">

    </html>