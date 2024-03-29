cssChangesClass = function(extension,projectlist,folder,two_col,poptips,uploadsURL){
    this._extension=extension;
    this._projectlist=projectlist;
    this._folder=folder;
    this._twocolumn=two_col;
    this._poptips=poptips;
    this._uploadsURL=uploadsURL;
}

cssChangesClass.prototype.removeMediaIcons = function(){
	var media_inline=document.getElementById('hiddenfinalhtml').contentDocument.getElementsByClassName('media-inline');	
		for (var mi = 0; mi < media_inline.length; mi++) {
			if (media_inline[mi]) {
			var media_inline_parent=media_inline[mi].parentElement;
			if (media_inline_parent) {
				if (media_inline_parent.nodeName=="P") {
					media_inline_parent.setAttribute('style','display:none!important;');
				}
			}
		}
	} 
	return true;  
};

cssChangesClass.prototype.blockquoteAlignment= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	var bqs=allTags.getElementsByTagName('blockquote');  
	for(var b=0;b<bqs.length;b++){
		if(bqs[b].previousElementSibling){
			if(bqs[b].previousElementSibling.nodeName=='P' && bqs[b].previousElementSibling.offsetHeight <= 30){
				bqs[b].setAttribute('style','page-break-before:avoid !important;');
			}
		}
		var bq_ptags=bqs[b].getElementsByTagName('p');
		var align=document.defaultView.getComputedStyle(bqs[b], null).getPropertyValue("text-align");
		if(align=='center'){
			for(var p=0;p<bq_ptags.length;p++){ 
				if (bq_ptags[p].className.indexOf('author') > -1) {
					bq_ptags[p].setAttribute('style', 'text-align:right !important');
				}else{
					bq_ptags[p].setAttribute('style', 'text-align:center !important');
				}							
			}
		}					
	}
	return true;
};

cssChangesClass.prototype.colorFix= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	var opener_cls=allTags.getElementsByClassName('mhhe-chapter_opener-chapter_number');
	this.setColor(opener_cls);					
	var txt_color_class=allTags.querySelectorAll("[class*=mhhe-color--text-color]");
	this.setColor(txt_color_class);
	return true;
};


cssChangesClass.prototype.removeAnswerButtons= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	var checkboxes=allTags.querySelectorAll('input[type=checkbox]');
	for (var c = 0; c < checkboxes.length; c++) {
		if(checkboxes[c].parentNode){
			if(checkboxes[c].parentNode.getElementsByTagName('label').length>0){
				checkboxes[c].parentNode.style.display='none';
			}
		}
	}
	return true;
}	

// cssChangesClass.prototype.makeTextAlignImportant= function(){
// 	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
// 	var textaligncls=allTags.getElementsByClassName('text-center');
// 	console.log(textaligncls);
// 	for (var t = 0; t < textaligncls.length; t++) {
// 		textaligncls[t].style.setProperty("text-align",document.defaultView.getComputedStyle(textaligncls[t], null).getPropertyValue("text-align"), "important");
// 	}
// 	return true;
// };

// cssChangesClass.prototype.setWidthIcons= function(){
// 	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
// 	var wicons=allTags.querySelectorAll("[class*=icon]");
// 	for (var i = 0; i < wicons.length; i++) {
// 		var img=wicons[i];
// 		if(document.defaultView.getComputedStyle(img, null).getPropertyValue("max-width")){
// 			var number_width=document.defaultView.getComputedStyle(img, null).getPropertyValue("max-width").replace(/\D/g,'');
// 			number_width=parseInt(number_width);
// 			var width=document.defaultView.getComputedStyle(img, null).getPropertyValue("width").replace(/\D/g,'');
// 			width=parseInt(width);
			
// 			if(number_width < width){
// 				img.style.setProperty("width",document.defaultView.getComputedStyle(img, null).getPropertyValue("max-width"), "important");
// 			}			
// 		}
// 	}		
// 	return true;
// };

cssChangesClass.prototype.appendCss = function(){				

	if(this._extension=='zip'){
		//addCss('blk1custom',this._uploadsURL+this._folder+'/assets/css/custom_bkp.css'); 
		addCss('blk1custom',this._uploadsURL+localStorage.getItem('projectstandard')+'/'+this._folder+'/assets/css/custom_HTML.css');   					    
	}else{
		addCss('blk2custom',this._uploadsURL+localStorage.getItem('projectstandard')+'/'+this._folder+'/assets/css/dpg-custom_HTML.css');    		   

		addCss('blk2base',this._uploadsURL+localStorage.getItem('projectstandard')+'/'+this._folder+'/assets/modules/mhe.mhhe-blk2/css/blk-base-page_HTML.css');   						
	}

	var links=document.getElementById('hiddenfinalhtml').contentDocument.body.getElementsByTagName('link');
	var cssadded=[];
	var x=0;
	for(var l=0;l<links.length;l++){
		if(cssadded.indexOf(links[l].href)==-1){
			cssadded.push(links[l].href);
			addCss('cssid'+x,links[l].href);
			links[l].parentNode.removeChild(links[l]);
			l--;
		}else{
			links[l].parentNode.removeChild(links[l]);
			l--;
		}
		x++;
	}

	var meta = document.getElementById('hiddenfinalhtml').contentDocument.body.getElementsByTagName("meta"), m;

    for (m = meta.length - 1; m >= 0; m--) {
         meta[m].parentNode.removeChild(meta[m]);
    }

    var title = document.getElementById('hiddenfinalhtml').contentDocument.body.getElementsByTagName("title"), index;

    for (t = title.length - 1; t >= 0; t--) {
         title[t].parentNode.removeChild(title[t]);
    }

	return cssadded;
};

function addCss(id,path) {	
	var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');					   
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.media = 'all';
    link.href=path;
	if (!document.getElementById(id)){
		link.id   = id;
		document.getElementById('hiddenfinalhtml').contentDocument.head.insertBefore(link, document.getElementById('hiddenfinalhtml').contentDocument.head.firstChild);
		// document.getElementById('hiddenfinalhtml').contentDocument.getElementsByClassName('wrapperpg')[0].parentElement.insertBefore(link, document.getElementById('hiddenfinalhtml').contentDocument.getElementsByClassName('wrapperpg')[0]);			
	}
	return true;
}

cssChangesClass.prototype.setColor= function(elements){
	for (var oc = 0; oc < elements.length; oc++) {									
		var opener_cls_clr=document.defaultView.getComputedStyle(elements[oc], null).getPropertyValue("color");
		var opener_cls_clr_rgbtohex=this._projectlist.componentToHex(opener_cls_clr);
		elements[oc].setAttribute('style','color:'+opener_cls_clr_rgbtohex+' !important;');
	}
}

cssChangesClass.prototype.moveBlockQuoteUp= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	var blockquote_elems = allTags.querySelectorAll(".note,.block");
	var styles=this._projectlist.defaultStyles();	

	for (var bq = 0; bq < blockquote_elems.length; bq++) {
		if(blockquote_elems[bq].firstElementChild && this._projectlist.getPropValue(blockquote_elems[bq], 'float') == 'none'){
			if(blockquote_elems[bq].firstElementChild.nodeName=='P'){
				var p_styles = '';
				var para=blockquote_elems[bq].firstElementChild;

				var bQ_P_styles = '';
		 	    for (var si=0; si < styles.length; si++) {
		 	    	if(styles[si]!='float' && styles[si]!='width' && styles[si]!='height'){
		 	    		bQ_P_styles += styles[si]+':'+this._projectlist.getPropValue(blockquote_elems[bq], styles[si])+';';
		 	    	}		 	       
		 	    }
				para.setAttribute('style',bQ_P_styles);
				blockquote_elems[bq].parentElement.insertBefore(para,blockquote_elems[bq]);	
				if(blockquote_elems[bq].innerHTML.trim()==''){
					blockquote_elems[bq].parentElement.removeChild(blockquote_elems[bq]);
				}		    
			}
		}
	}
	
	return true;
};

cssChangesClass.prototype.setFontSizeProximanova= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	var pspans = allTags.querySelectorAll("p,span,li");
	var styles=this._projectlist.defaultStyles();	

	for (var ff = 0; ff < pspans.length; ff++) {
		if(pspans[ff]){
			var fontfamily=this._projectlist.getPropValue(pspans[ff], 'font-family');
			//console.log(fontfamily);
			if(fontfamily.indexOf('proximanova') > -1 && !pspans[ff].closest('header,table,h1,h2,h3,h4,h5,h6,figure,figcaption,caption,cite,exhibit')){
				pspans[ff].style.setProperty('font-size','9pt','important');
				pspans[ff].classList.add('mhhe-pod--para-9pt');
			}
		}		
	}
	
	return true;
};

cssChangesClass.prototype.progressMarginAdjustments= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	// .sidenote-icon1, 
	var progress_box=allTags.querySelectorAll(".sidenote-5, .sidenote-10");
	for(p=0; p < progress_box.length; p++){
		// && !progress_box[p].classList.contains('keyterm')
		if(progress_box[p].getElementsByTagName('h4').length > 0 ){
			if(progress_box[p].getElementsByTagName('h4')[0].getElementsByTagName('img').length == 0){
				var progress_h4_first=progress_box[p].getElementsByTagName('h4')[0];
				// var old_font_size=window.getComputedStyle(progress_h4_first).fontSize;
				old_font_size=24;
				var new_font_size=17.33;
				var margintosum=old_font_size/17.33;

				var oldMarginTop=window.getComputedStyle(progress_h4_first).marginTop;
				oldMarginTop=parseFloat(oldMarginTop);
				var newMarginTop=(oldMarginTop*margintosum).toFixed(2);

				var oldMarginRight=window.getComputedStyle(progress_h4_first).marginRight;
				oldMarginRight=parseFloat(oldMarginRight);
				var newMarginRight=(oldMarginRight*margintosum).toFixed(2);

				var oldMarginBottom=window.getComputedStyle(progress_h4_first).marginBottom;
				oldMarginBottom=parseFloat(oldMarginBottom);
				var newMarginBottom=(oldMarginBottom*margintosum).toFixed(2);

				var oldMarginLeft=window.getComputedStyle(progress_h4_first).marginLeft;
				oldMarginLeft=parseFloat(oldMarginLeft);
				var newMarginLeft=(oldMarginLeft*margintosum).toFixed(2);

				var margin=newMarginTop+'px '+newMarginRight+'px '+newMarginBottom+'px '+newMarginLeft+'px ';

				progress_box[p].getElementsByTagName('h4')[0].style.setProperty('margin',margin,'important');
			}
			
	    }
	}

	return true;
};

cssChangesClass.prototype.removeUnwantedClassNames= function(){
	var allTags = document.getElementById('hiddenfinalhtml').contentDocument;
	var checkClass = ['mhe-twentyfive-container','mhe-thirtyfive-container','mhe-fifty-container','mhe-sixtyfive-container','mhe-seventyfive-container','mhe-eightyfive-container','mhe-center-container'];

	var figureElems=allTags.querySelectorAll(".mhhe-pod--image-75to50-wrap,.mhhe-pod--image-100,.mhhe-pod--image-50-nowrap,.mhhe-pod--image-75,[class*=mhhe-pod--wid],.mhhe-pod--bigfig-bigcap,.mhhe-pod--1—column");
	for (var a = 0; a < figureElems.length; a++) {
		for (var cC = 0; cC < checkClass.length; cC++) {			
			if(figureElems[a].className.indexOf(checkClass[cC]) > -1) {
				figureElems[a].className=figureElems[a].className.replace(checkClass[cC],'no-'+checkClass[cC]);
			}else if(figureElems[a].querySelectorAll('.mhe-twentyfive-container,.mhe-thirtyfive-container,.mhe-fifty-container,.mhe-sixtyfive-container,.mhe-seventyfive-container,.mhe-eightyfive-container,.mhe-center-container').length > 0){
				var figure_img=figureElems[a].querySelectorAll('.mhe-twentyfive-container,.mhe-thirtyfive-container,.mhe-fifty-container,.mhe-sixtyfive-container,.mhe-seventyfive-container,.mhe-eightyfive-container,.mhe-center-container');
				for (var fi = 0; fi < figure_img.length; fi++) {
					if(figure_img[fi].className.indexOf(checkClass[cC]) > -1) {
						figure_img[fi].className=figure_img[fi].className.replace(checkClass[cC],'no-'+checkClass[cC]);
					}
				}
				figureElems[a].classList.add();
			}
		}	
	}
	return true;
};

cssChangesClass.prototype.fixCharacterSetIssues= function(){

	// var allelems=document.getElementById('hiddenfinalhtml').contentDocument.body.getElementsByTagName("*");
	// for (var y = 0, len = allelems.length; y < len; y++) {
	// 	if(allelems[y].classList.contains('number')){
	// 		console.log(allelems[y]);
	// 		var content = window.getComputedStyle(allelems[y], ':after').getPropertyValue('content');
	// 		// window.getComputedStyle(allelems[y], ':after').setPropertyValue('content',content);
	//     	console.log(content);
	//     	// debugger;
	//     	// progress_box[p].getElementsByTagName('h4')[0].style.setProperty('margin',margin,'important');
	// 	}

	// 	// var encodedStr = content.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
	// 	//    return '&#'+i.charCodeAt(0)+';';
	// 	// });
	//  // 	console.log(encodedStr);
	// }

	// return true;
};