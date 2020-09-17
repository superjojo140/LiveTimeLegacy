var actualProjectId=0;
var tempHtml;






$(document).ready(function(){
    
    getLastOpenedProject();
    getSQL(actualProjectId);
    $("addProject").hide();
    
    var d=new Date();
    var utc=d.getTime();
	var theDate=formatNumber(d.getDate())+"."+formatNumber(d.getMonth()+1)+"."+d.getFullYear();
    var theTime=formatNumber(d.getHours())+":"+formatNumber(d.getMinutes());
	
	$('#newDate').val(theDate);
    $("#newTimeStart").val(theTime);
    
    setInterval(getSQL, 60000);
    
    
    $(document).on('click', 'delete', function() {
        
       var parentId = $(this).closest("listItem").attr('id');
		//alert(parentId);
        delSQL(parentId);
        
        
    });
    
     $(document).on('click', '.activeTimeDiff', function() {
         
        var parentId = $(this).closest("listItem").attr('id');
        stopTask(parentId);    
        
    });
    
    $(document).on('mouseenter', '.activeTimeDiff', function() {
               
		tempHtml = $(this).html(); 
        $(this).html("Stop");
        
        
    });
	
	 $(document).on('mouseleave', '.activeTimeDiff', function() {
        
		 $(this).html(tempHtml);
        
        
    });
    
    
	
	$(document).on('mouseenter', 'delete', function() {
        
         $(this).animate({width: "100px",});
		 $(this).html("Löschen");
        
        
    });
	
	 $(document).on('mouseleave', 'delete', function() {
        
         $(this).animate({width: "20px"});
		 $(this).html("");
        
        
    });
    
     $(document).on('click', '#showAddProject', function() {
        
         if ($("#showAddProject").html()=="add"){
         $("addProject").slideDown();
         $("#addProject").animate({display: "block"});
		 $(this).html("clear");
         }
         else if ($("#showAddProject").html()=="clear"){
            $("addProject").slideUp();
		    $("#showAddProject").html("add"); 
         }
        
        
    });
    
     $(document).on('click', '#sendNewProject', function() {
        
         
         $("addProject").slideUp();
		 $("#showAddProject").html("add");
         addProject($('#newProjectName').val());
        
        
    });
    
     $(document).on('click', 'project', function() {
        
        var id = $(this).attr('id');
        id = id.substring(7,id.length);
		getSQL(id);
        
        
    });
    
    $(".btn").click(function(){
        var type = $(this).attr("data-type");
        var d = new Date();
        var d2 = new Date();
        
        var newTitle = $('#newTitle').val();
        var newDescription = $('#newDescription').val();
        var newDate = $('#newDate').val();
        var newTimeStart = $('#newTimeStart').val();
        var newTimeEnd = $('#newTimeEnd').val();
        
        var splitDate=newDate.split(".");
        var splitStart=newTimeStart.split(":");
        
     
        
        var newDay=splitDate[0]
        var newMonth=splitDate[1];
        var newYear=splitDate[2];
        var newHours=splitStart[0];
        var newMinutes=splitStart[1];
        
        //alert("Datum: "+newDay+newMonth+newYear+"  "+newHours+newMinutes);
        
        
        if (newTimeEnd != ""){
        var splitEnd=newTimeEnd.split(":");
        var newHoursEnd=splitEnd[0];
        var newMinutesEnd=splitEnd[1];
            
        d2.setFullYear(newYear);
        d2.setMonth(newMonth-1);
        d2.setDate(newDay);
        d2.setHours(newHoursEnd);
        d2.setMinutes(newMinutesEnd);
        }
        else{
            d2.setTime(0);
        }
        

        d.setFullYear(newYear);
        d.setMonth(newMonth-1);
        d.setDate(newDay);
        d.setHours(newHours);
        d.setMinutes(newMinutes);
        
        setSQL(actualProjectId,type,newTitle,newDescription,d.getTime(),d2.getTime());
        
        resetForm();
        
    });
    
    
    function getSQL(project) {
        
        if (typeof project == "undefined"){
            project = actualProjectId;
        }
   
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                document.getElementById("sidebarContent").innerHTML = xmlhttp.responseText;
            }
        };
        xmlhttp.open("GET","database.php?mode=getProjects&project="+project,false);
        xmlhttp.send();    
    
        xmlhttp2 = new XMLHttpRequest();
        xmlhttp2.onreadystatechange = function() {
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
                    if (obj.type == "job"){
                        var myTimeEnd = obj.timeEnd;
                        if (obj.timeEnd == 0){
                            myTimeEnd = new Date().getTime();
                        }
                        timeSum += myTimeEnd - obj.timeStart;
                    }
                    
                    
                    row += "<listItem id=" + obj.id;
                    if (obj.type == "note"){
                        row += ' class = "noteListItem" ';
                    }
                    else{
                        if (obj.timeEnd == 0){
                            row += ' class = "activeListItem" ';
                        }
                    }
                    row += ">";
                    row += '<icon class="leftIcon">'
                    
                    if (obj.type == "note"){
                        row += 'event_note';
                    }
                    else{
                        if (obj.timeEnd == 0){
                            row += 'alarm';
                        }
                        else{
                            row += 'alarm_on';
                        }
                    }
                    row += "</icon>"
                    
                    row += "<leftBox><itemTitle>"  +  obj.title  +  "</itemTitle>";
                    row += "<itemDescription>"  + obj.description +  "</itemDescription></leftBox>";
                    row += "<middleBox><itemDate>"  +  start.toLocaleDateString() +  "</itemDate>";
                    row += "<itemTime>"  + formatNumber(start.getHours()) + ":" + formatNumber(start.getMinutes()) 
                    
                    if (obj.timeEnd != 0){
                        row += " - " + formatNumber(end.getHours()) + ":" + formatNumber(end.getMinutes());
                    }
                    
                    row += "</itemtime></middleBox>";
                    
                    var timeEndForDif;
                    if (obj.timeEnd != 0){
                        timeEndForDif = obj.timeEnd;
                        row += "<timeDiff>"
                    }                    
                    else{
                        timeEndForDif = new Date();
                        timeEndForDif = timeEndForDif.getTime();
                        row += '<timeDiff class="activeTimeDiff">';
                    }
                    
                    row += getTimeDiff(obj.timeStart,timeEndForDif) + "</timeDiff>";
                    row += "<rightBox><delete></delete></rightBox></listItem>";
                    
                    if (obj.type == "note"){
                        resultMiddle += row;
                    }
                        else{
                        if (obj.timeEnd != 0){ //To get the Active projects to the top
                            resultBottom += row;
                        }
                            else{
                                resultTop += row;
                            }
                        }
                    
                    }
                 
                
                var sumBox='<listitem id="sumBox"><icon class="leftIcon">poll</icon><leftbox><itemtitle>Gesamt</itemtitle><itemDescription>Alles zusammen gerechnet: </itemDescription></leftbox><middlebox><timediff>' + getTimeDiff(0,timeSum) + '</timediff></middlebox><rightbox><a href="/liveTime/bill.php"><btn class="btn">Rechnung</btn></a></rightbox></listitem>';
                document.getElementById("list").innerHTML = sumBox + resultTop + resultMiddle + resultBottom;
            }
        };
        xmlhttp2.open("GET","database.php?mode=get&project="+project,false);
        xmlhttp2.send();
    
        actualProjectId=project;
    
        $("project").removeClass("projectActive");
        $("#project"+project).addClass("projectActive");
    
        
    }

function delSQL(id) {
   
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                getSQL(actualProjectId);
            }
        };
        xmlhttp.open("GET","database.php?mode=del&id="+id,false);
        xmlhttp.send();
    }

function setSQL(projectId,type,title,description,timeStart,timeEnd) {
   
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                getSQL(actualProjectId);
            }
        };
        xmlhttp.open("GET","database.php?mode=set&projectId="+projectId+"&type="+type+"&title="+title+"&description="+description+"&timeStart="+timeStart+"&timeEnd="+timeEnd,false);
        xmlhttp.send();
    }
    
function addProject(name){
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                alert(xmlhttp.responseText);
                getSQL(actualProjectId);
            }
        };
        xmlhttp.open("GET","database.php?mode=addProject&name="+name,false);
        xmlhttp.send();
    
        getSQL(actualProjectId);
}
    
    function stopTask(id) {
   
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                getSQL(actualProjectId);
            }
        };
        var now = new Date();
        xmlhttp.open("GET","database.php?mode=stopTask&id="+id+"&timestamp="+now.getTime(),false);
        xmlhttp.send();
    }
    
    
     function getLastOpenedProject() {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var myJson = JSON.parse(xmlhttp.responseText);
                actualProjectId = myJson.id;
            }
        };
        xmlhttp.open("GET","database.php?mode=getLOP",false);
        xmlhttp.send();  
     }
    
});

function formatNumber(myNumber){
    if(myNumber < 10){
        myNumber="0"+myNumber;
    }
    return myNumber;
}

function resetForm(){
        $("#newTitle").val("");
        $("#newDescription").val("");
        var d=new Date();
	    var theDate=formatNumber(d.getDate())+"."+formatNumber(d.getMonth()+1)+"."+d.getFullYear();
        var theTime=formatNumber(d.getHours())+":"+formatNumber(d.getMinutes());
        $('#newDate').val(theDate);
        $("#newTimeStart").val(theTime);
        $("#newTimeEnd").val("");
}

function getTimeDiff(start,end){
    start = Number(start);
    end = Number(end);
    var dif = end - start;
    var hours = Math.floor(dif / (1000*60*60));
    var minutes = dif % (1000*60*60);
    minutes = Math.floor(minutes / (1000*60));
    
    //alert(hours + " - " + minutes);
    
    return hours + ":" + formatNumber(minutes);
}



