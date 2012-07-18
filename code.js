// stuff :)
function submeter()
{
	var args = new blackberry.invoke.MessageArguments('submeter@hagreve.com', 'Info de greve', '');
	args.view = blackberry.invoke.MessageArguments.VIEW_NEW;
	blackberry.invoke.invoke(blackberry.invoke.APP_MESSAGES, args); 
}

function openL(i)
{
	greves = localStorage.getItem("greves");
	if (!greves)
		return;
	greves = JSON.parse(greves)
	url = greves[i].source_link;
	var args = new blackberry.invoke.BrowserArguments(url);
	blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
	
}

function refreshList(el)
{
	greves = localStorage.getItem("greves");
	iupi = el.getElementById("iupi")
	list = el.getElementById("grevesl")
	list.innerHTML = "";
	iupi.style.display="none";
	if (!greves)
		return;
	 greves = JSON.parse(greves)
	if (greves.length==0)
	{
		iupi.style.display="block";
		return;
	}
	iupi.style.display="none";
	for (i=0;i<greves.length;i++)
	{
		dates = ""+greves[i].start_date[8] +""+greves[i].start_date[9]+"/"+greves[i].start_date[5] +""+greves[i].start_date[6]
		datee = ""+greves[i].end_date[8] +""+greves[i].end_date[9]+"/"+greves[i].end_date[5] +""+greves[i].end_date[6]
		datef = dates+ " - "+datee;
		item = document.createElement('div');
		item.setAttribute('data-bb-type','item');
		title = greves[i].company.name
		if (greves[i].canceled==true)
			title = title+ " (CANCELADA)";
		item.setAttribute('data-bb-title',title);
		item.setAttribute('data-bb-images','none');
		item.setAttribute('data-nr',i);
		item.setAttribute('onclick','openL("'+i+'")');
		item.setAttribute('data-bb-accent-text',datef);
		item.innerHTML = greves[i].description;
		container = document.createElement('div');
		container.setAttribute('data-bb-images','none');
		container.appendChild(item);
		// Apply the styling
		bb.imageList.apply([container]);
		// Append the item
		list.appendChild(container.firstChild);
		
	}
}

function refresh(el)
{
	if(el==null)
		el = document;
	if (blackberry.system.hasDataCoverage () )
	{
		p = el.getElementById('noconp');
		p.style.display="none";
		p = el.getElementById('refreshp');
		p.style.display="block";
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				localStorage.setItem("greves",xmlhttp.responseText);
				refreshList(el);
				p.style.display="none";
			}
		}
		xmlhttp.open("GET","http://hagreve.com/api/v1/strikes",true);
		xmlhttp.send();
	} else {
		p = el.getElementById('noconp');
		p.style.display="block";
	}
}

