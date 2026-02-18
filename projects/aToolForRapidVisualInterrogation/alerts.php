<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <head>
    <title>Alerts</title>
	<script type="text/javascript" src="jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="jquery.tipsy.js"></script>
	<link type="text/css" rel="stylesheet" href="tipsy.css" />
	<script type="text/javascript" src="d3.v2.js"></script>
	<link type="text/css" rel="stylesheet" href="alerts.css" />
  </head>
  <body>
    <h1>Snort Alerts</h1>
	<p>
	  <button id="pageup50" disabled="disabled" onclick="window.scrollUp50()">Page Up 50</button>
	  <button id="pageup" disabled="disabled" onclick="window.scrollUp()">Page Up</button>
	  <button id="pagedown" onclick="window.scrollDown()">Page Down</button>
	  <button id="pagedown50" onclick="window.scrollDown50()">Page Down 50</button>
	</p>
	<div id='container'>
	<div id='leftFloater'>
		<div id='sortBy'>
			<h3>Sort by: </h3>
		   	<input type = 'radio' name = 'sortByDrop' value='AGE' checked='checked'> Age <br>
		   	<input type = 'radio' name = 'sortByDrop' value='SRC_IP'> Src IP <br>
		   	<input type = 'radio' name = 'sortByDrop' value='DST_IP'> Dst IP <br>
		   	<input type = 'radio' name = 'sortByDrop' value='PRIORITY'> Priority <br>
		   	<h3>Order: </h3>
		   	<input type='radio' name='sortOrder' value='ASC' checked='checked'> Ascending<br>
		   	<input type='radio' name='sortOrder' value='DESC'> Descending <br>
		   	<button id = 'sort' onclick='window.sort()'>Sort</button>
		   
		</div>
		<button id="toggleview" onclick="window.toggleView()">Toggle View</button>
	</div>
	
	 <div id="alerts">
	 	<div id="alertsList"><svg></svg></div>
	 	<div id="alertDetails">
    		<h1>Alert Details</h1>
		<h3 id="detail">&lt;Detail&gt;</h3>
		<div id="priority">Priority: X</div>
		<div id="datetime">Datetime: XX-XX:XX</div>
		<br>
		<h3>Source:</h3>
		<div id="source">X.X.X.X:XXX (type) (service)</div>
		<div id="source_count" style="font-size: 12px">Number of alerts: XXX</div>
		<br>
		<h3>Destination:</h3>
		<div id="destination">X.X.X.X:XXX (type) (service)</div>
		<div id="destination_count" style="font-size: 12px">Number of alerts: XXX</div>
		<br>
		<div id="extra">&lt;protocol&gt; TTL:XX ID:XX PacketSize:XX Flags:XXXXX Seq:XXXXX</div>
		<div id="optional"></div>

	
	 	</div>
	 </div> <!--/alerts-->
	 
	</div> <!--/container-->
	<div id='footer'>
                         <a href="edge_bundle/connections.html" target="_blank"> View Network Connection Map </a> 
                        <br>Visualization by Nate Phillips and Daniel Simpkins <br>for CSE 8990 Information Visualization
	</div>
	<script type="text/javascript" src="alertslist.js"></script>
  </body>
</html>
