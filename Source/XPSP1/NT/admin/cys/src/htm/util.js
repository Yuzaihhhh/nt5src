// Copyright (c) 2000 Microsoft Corporation

// Registry Keys
// 0=open OCMGR to complete post setup configuration;1=default:CYS;2=Admin Tools;3=reboot-show sucess/fail dialog
var SZ_Home				= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\home";
// CYS must show at startup to complete proceesing
var SZ_CYSMustRun = "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\CYSMustRun";
// key used in welcome.htm to diferentiate between First DC (Express Path) or Memeber DC (custom path member server)
// set to 1 in setupFirstServer or 0 in setupDCOnly in confirm.js
var SZ_FirstDC			= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\FirstDC";							
// First DC Path Param
var SZ_DomainDNSName	= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\DomainDNSName";		
// First DC Path Param
var SZ_DomainDNSIP	= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\DomainDNSIP";				
// First DC Path Param
var SZ_DomainNetBiosName= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\DomainNetBiosName";
// Show CYS/AdminTools home at startup				
//var SZ_ShowStartup	= "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Tips\\Show";
var SZ_ShowStartup		= "HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Setup\\Welcome\\srvwiz";					
var SZ_Disable			= "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\CYS\\Disable";
// To do list for Optional Components Manager
var SZ_ToDoList			= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Setup\\OCManager\\ToDoList";	
// If DNS wizard has been run				
var SZ_DNSConfig		= "HKLM\\SYSTEM\\CurrentControlSet\\Services\\DNS\\Parameters\\AdminConfigured";
var SZ_DNSConfigResult	= "HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\srvWiz\\DnsWizResult";
// If RRAS wizard has been run					
var SZ_RRASConfig		= "HKLM\\SYSTEM\\CurrentControlSet\\Services\\RemoteAccess\\ConfigurationFlags";	
// App Server Optimization Settings				
var SZ_AppServerSize	= "HKLM\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters\\Size"						
// App Server Optimization Settings
var SZ_AppServerCache	= "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\LargeSystemCache"; 
// Terminal Server in Application mode
var SZ_TSApplicationMode	= "HKLM\\System\\CurrentControlSet\\Control\\Terminal Server\\TSAppCompat";	
//If this value is present, and is set to 0, then publishing is disabled.
var SZ_PublishPolicy		= "HKCU\\Software\\Policies\\Microsoft\\Windows NT\\SharedFolders\\PublishSharedFolders";			
						

var x 		= ((((window.screen.width-636)/2)<0)?0:(window.screen.width-636)/2);
var y 		= ((((window.screen.height-450)/2)<0)?0:(window.screen.height-450)/2);		

document.oncontextmenu		= killEvent;		// Disable right-click menu
document.ondragstart		= killEvent;		// Diable dragstart
document.onkeydown			= keyDown;			// Disable Refresh on F5	
document.onbeforeunload		= reset;			// Clear persistent data

function getReg(SZ_RegKey)
// --------------------------------------------------------------------------------------
// read a registry key 
// --------------------------------------------------------------------------------------
{
	var getReg=0;
	try {var wSHShell = new ActiveXObject("WScript.Shell"); getReg = wSHShell.RegRead(SZ_RegKey); }
    catch(e){getReg	= "";}	
	return(getReg);
}
	
function setReg(SZ_RegKey, boolVal)
// --------------------------------------------------------------------------------------
// sets value for a registry key 
// --------------------------------------------------------------------------------------
{
	var setReg=0;
	try { var wSHShell = new ActiveXObject("WScript.Shell"); setReg = wSHShell.RegWrite(SZ_RegKey, boolVal); }
    catch(e){}	
	return(setReg);
}

function setReg2(SZ_RegKey, val)
// --------------------------------------------------------------------------------------
// sets registry key 
// --------------------------------------------------------------------------------------
{
	var setReg=0;
	try { var wSHShell 	= new ActiveXObject("WScript.Shell"); setReg = wSHShell.RegWrite(SZ_RegKey, parseInt(val), "REG_DWORD"); }
    catch(e){}	
	return(setReg);
}

function killEvent()
// --------------------------------------------------------------------------------------
// stop processing event 
// --------------------------------------------------------------------------------------
{  event.returnValue = false; event.cancelBubble = true; event.keyCode 	= 0; }
	
function keyDown()
// --------------------------------------------------------------------------------------
// process Escape(exit CYS), Enter(next page) or F5 (usually refresh, now ignore)
// --------------------------------------------------------------------------------------
{
	if(event.keyCode==27)		{cancel();}
	//else if(event.keyCode==13){next();}
    else if(event.keyCode==116)	{killEvent();}
}
	
function exec(cmd,arg)
// --------------------------------------------------------------------------------------
// execute shell commands 
// --------------------------------------------------------------------------------------
{ var shapp = new ActiveXObject("Shell.Application"); shapp.ShellExecute(cmd,arg); }

function help(arg)
// --------------------------------------------------------------------------------------
// display Help information
// --------------------------------------------------------------------------------------
{  if(arg=="") arg="cys.chm::/cys_topnode.htm"; exec('hh.exe',arg); }

function noNull(strVal)
// --------------------------------------------------------------------------------------
// convert null values to empty strings 
// --------------------------------------------------------------------------------------
{  if(strVal==null) strVal=""; return(strVal);  }

function convertBol(strTF)
// --------------------------------------------------------------------------------------
// convert string values to boolean 
// --------------------------------------------------------------------------------------
{  var bolTF = (strTF=="true")?true:false; return(bolTF); }

function cancel()
// --------------------------------------------------------------------------------------
// ask for confirmation before CYS exit when clicked on Cancel button or ESCAPE
// --------------------------------------------------------------------------------------
{
	var L_strMsgBoxMsg_Message	= "Are you sure you want to exit the Configure Your Server Wizard?";
	var cancel = window.confirm(L_strMsgBoxMsg_Message);
	if(cancel) { reset(); top.window.close(); }
}

function reset()
// --------------------------------------------------------------------------------------
// remove all persistent data onBeforeUnload
// --------------------------------------------------------------------------------------
{
	var arrPersist 	= new Array();
	arrPersist[0]	= "P_server";
	arrPersist[1]	= "P_serverDC";
	arrPersist[2]	= "stxtName1";
	arrPersist[3]	= "stxtName2";
	arrPersist[4]	= "stxtDNSName";
	arrPersist[5]	= "stxtNetBiosName";
	arrPersist[6]	= "P_dc2";
	arrPersist[7]	= "P_dc3";
	arrPersist[8]	= "P_select";
	arrPersist[9]	= "P_selectDHCP";
	arrPersist[10]	= "P_selectDNS";
	arrPersist[11]	= "P_selectWINS";
	arrPersist[12]	= "P_selectRRAS";
	arrPersist[13]	= "P_fileFolderName";
	arrPersist[14]	= "P_fileShareName";
	arrPersist[15]	= "P_fileFolders";
	arrPersist[16]	= "P_fileShares";
	arrPersist[17]	= "P_cb_file2";
	arrPersist[18]	= "P_txt_file2";
	arrPersist[19]	= "P_select_file2";
	arrPersist[20]	= "P_fileFolders";
	arrPersist[21]	= "P_file3Index";
	arrPersist[22]	= "P_install";	
	arrPersist[23]	= "P_TSAppMode";
	arrPersist[24]	= "P_printer";
	arrPersist[25]	= "P_pass";
	arrPersist[26]	= "P_fileOwners";
	arrPersist[27]	= "P_fileKeyWords";
	arrPersist[28]	= "P_fileDesc";
	arrPersist[29]	= "P_OWSChangeHomePage";
	arrPersist[30]	= "P_JumpIndex";
	arrPersist[31]	= "P_ShowServerPage";
	arrPersist[32]	= "P_ExpressPathAllowed";
	
	currentDiv = (document.all.divMain2)?"divMain2":"divContent";
	try
	{	
		for(i=0;i<arrPersist.length;i++)
		{
			eval("document.all." + currentDiv + ".removeAttribute('" + arrPersist[i] +"')");
		}
		eval(currentDiv + ".save('oDataStore')");	
	}
	catch(e){}
}

function winComponents()
// --------------------------------------------------------------------------------------
// Determines if a windows component has been opted during setup and needs to complete comfiguration/installation
// Opens Add/Remove Programs -> Add Windows Components
// --------------------------------------------------------------------------------------
{	
	// Detect if a Windows component need to be installed
	var optionalComponents = new Array();
	optionalComponents[0]= SZ_ToDoList + "\\CertSrv\\Title";			// Certificate Server
	optionalComponents[1]= SZ_ToDoList + "\\Cluster\\Title";			// Clustering
	optionalComponents[2]= SZ_ToDoList + "\\MSMQ\\Title";				// Message Queue

	// RRIS ONLY if machine is joined to a domain or a DC.
	var UserInfo 		= new ActiveXObject("WScript.Network")
	var domain 			= UserInfo.UserDomain;	
	if(domain.length>1||srvWiz.DsRole(0))					
	{
		optionalComponents[3]= SZ_ToDoList + "\\RemoteInstall\\Title";	
	}		
	
	for(oc=0;oc<optionalComponents.length;oc++)
	{
		var current=getReg(optionalComponents[oc]);
		if(current.length>1)
			return true;
	}	
	return false;
}

 
function loadFocus()
// --------------------------------------------------------------------------------------
// Sets default focus on the "next" button
// --------------------------------------------------------------------------------------
{
	if((document.all.L_next_Button)&&(!document.all.L_next_Button.disabled))
	{
		try{document.all.L_next_Button.focus();}
		catch(e){}	
	}
}

function failDialog()
// --------------------------------------------------------------------------------------
// displays failure dialog (i.e. Post DCPromo/Reboot fail dialog)
// --------------------------------------------------------------------------------------
{	
	var sFeatures2 		= "dialogHeight:135px;dialogLeft:" + parseInt(x+170) + ";dialogTop:" + parseInt(x+120) + ";dialogWidth:360px;help:no;status:no;unadorned:no;"
	window.showModalDialog("fail.htm",sysPath,sFeatures2);
	divContent.load("oDataStore");
	var bolViewConfig	= convertBol(divContent.getAttribute("P_viewConfig"));		
	if(bolViewConfig)		//ask if desired to view the log file and if yes, open log file
	{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		exec(sysPath + '\\cys.log');		
	}
}
