$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var csv;
var config;
var lines;
var headers;
var hosts;


function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
	$('#drop_zone').removeClass('hoverDrop');

    var files = evt.dataTransfer.files; // FileList object.
    var reader = new FileReader();  
    reader.onload = function(event) {            
         
         csv = event.target.result;
         
         lines = csv.split(/\r?\n/);
         headers = lines[0].split(',');
         hosts = csv.split(/\r?\n/);
         delete hosts[0];
         
         //console.log(headers);
         //console.log(hosts);
         
         config = "";
         
         for(var h = 1; h < hosts.length; h++)
         {
           var params = hosts[h].split(',');
         
           config += "define host{\r\n";
		
           for(var i = 0; i < headers.length; i++)
      		 {
      			if(headers[i])
      				config += "\t" + headers[i] + "\t\t" + params[i] + "\r\n";			
      		 } 
    		   config += "}";
    		   config += "\r\n";   
         }     
         
        //console.log(config);
		
		// Enabled the Download Button
        $('#download_button').removeClass('disabled');
		$('#download_button').tooltip('disable');
		
    }        
    reader.readAsText(files[0],"UTF-8");
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	
	$('#drop_zone').addClass('hoverDrop');
  }
  

  function handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
	
	$('#drop_zone').removeClass('hoverDrop');
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('dragleave', handleDragLeave, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
  
  function doZip()
  {
      var zip = new JSZip();
	  
	  if(!document.getElementById('separateFiles').checked) 
	  {
		zip.file("hosts", config);
	  }
	  else
	  {
		for(var h = 1; h < hosts.length; h++)
        {
           var params = hosts[h].split(',');
         
           var host = "define host{\r\n";
		
           for(var i = 0; i < headers.length; i++)
			{
				if(headers[i])
					host += "\t" + headers[i] + "\t\t" + params[i] + "\r\n";
			} 
			
			host += "}";
			host += "\r\n";   
			   
			zip.file(params[0], host);
        }
		 
	  }
	  
	  var content = zip.generate({type:"blob"});
      // see FileSaver.js
      saveAs(content, "nagios.zip");
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  