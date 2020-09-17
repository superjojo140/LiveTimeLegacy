<?php
require($_SERVER["DOCUMENT_ROOT"] ."/include/userSystem/userSystem.php");
checkIfLoggedIn("false");
require($_SERVER["DOCUMENT_ROOT"] ."/include/dbconnect.php");

 $projectId = $_GET['projectId'];
$datum = date("Y-m-d");


$result = mysqli_query($db,"SELECT `id` FROM `liveTime` WHERE `project` = '$projectId'");
if ($result->num_rows > 0){
    echo "Projekt  $projectId existiert";
    mysqli_query($db,"UPDATE `liveTime` SET `paid`='$datum' WHERE `project` = '$projectId'");
        echo "    Einträge wurden als bezahlt markiert";
}
else{
    echo "Fehler: Das Projekt exisitiert nicht.";
}

 
?>