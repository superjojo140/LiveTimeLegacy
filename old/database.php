<?php
require($_SERVER["DOCUMENT_ROOT"] ."/include/userSystem/userSystem.php");
checkIfLoggedIn("false");
require($_SERVER["DOCUMENT_ROOT"] ."/include/dbconnect.php");
?>


<?php
    
$userId = $_SESSION["userId"];   
    
	
if (isset($_GET['mode'])){
$mode = $_GET['mode'];
    
if ($mode=="set"){
    $projectId=$_GET['projectId'];
    $type=$_GET['type'];
    $title=$_GET['title'];
    $description=$_GET['description'];
    $timeStart=$_GET['timeStart'];
    $timeEnd=$_GET['timeEnd'];
    $sql="INSERT INTO liveTime (project,type,title,description,timeStart,timeEnd) VALUES ('$projectId','$type','$title','$description','$timeStart','$timeEnd');";
    $result = mysqli_query($db,$sql);
}
    
if ($mode=="del"){
    $sql="DELETE FROM liveTime WHERE id=".$_GET['id'].";";
    $result = mysqli_query($db,$sql);
}  
    
if ($mode=="get"){
    
if (isset($_GET['project'])){
    
$projectId=$_GET['project'];

 $sql="UPDATE user SET lastOpenedProject='$projectId' WHERE id='$userId';";
 $result = mysqli_query($db,$sql);
    
$sql="SELECT * FROM liveTime WHERE project='$projectId' AND paid='0000-00-00' ORDER BY timeEnd DESC, timeStart DESC;";
$result = mysqli_query($db,$sql);
    
    $rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}
echo json_encode($rows);


mysqli_close($db);
}
}
    
if ($mode=="getProjects"){


    
//See in which projects the user is working
$sql="SELECT projekte FROM user WHERE id='$userId';";
$ergebnis = mysqli_query($db,$sql);
$projekte="";
while($row = mysqli_fetch_object($ergebnis))
   {   
    $projekte=$row->projekte;
}
$projekte_array=explode(",",$projekte);
foreach($projekte_array as $i){

$sql="SELECT * FROM liveTimeProjects WHERE id='$i'";
$result = mysqli_query($db,$sql);


while($row = mysqli_fetch_array($result)) {
    
    echo "<project ";
    if ($row['id'] == $_GET['project']) {
        echo 'class="projectActive "';
    }
    echo "id=project".$row['id'].">";
    echo $row['name']."</project>";
}
}

mysqli_close($db);
}
    
if ($mode=="addProject"){
    //Add Project in liveTimeProjects Table
    $name=$_GET['name'];
    $sql="INSERT INTO liveTimeProjects (name) VALUES ('$name');";
    mysqli_query($db,$sql);
    
    //id der hinzugefügten spalte finden
     $projectId = mysqli_insert_id($db);
    
    //Add Project Access in user Table
    $sql="SELECT projekte FROM user WHERE id='$userId'";
    $result = mysqli_query($db,$sql);
    while($row = mysqli_fetch_object($result))
    {   
        $projekte=$row->projekte;
    }
    
    echo $projekte;
    
    if ($projekte != ""){
        $newProjekte = $projekte . "," . $projectId; //Add comma
    }
    else{
        $newProjekte = $projectId;
    }
    
    $sql="UPDATE user SET projekte='$newProjekte' WHERE id='$userId';";
    $result = mysqli_query($db,$sql);
    
    
}
    
if ($mode == "stopTask"){
    if (isset($_GET["id"])){
        $id=$_GET['id'];
        $timestamp=$_GET['timestamp'];
        $sql="UPDATE liveTime SET timeEnd='$timestamp' WHERE id='$id';";
        $result = mysqli_query($db,$sql);
    }
}
    
if ($mode=="getLOP"){ //LastOpenedProject

    
$sql="SELECT lastOpenedProject FROM user WHERE id='$userId' ;";
$result = mysqli_query($db,$sql);
while($row = mysqli_fetch_object($result))
   {   
    $lop=$row->lastOpenedProject;
}
$result = array();
$result["id"]=$lop;
$result = json_encode($result);
echo $result;

mysqli_close($db);
}
   

}//isset(GET[mode])
?>
