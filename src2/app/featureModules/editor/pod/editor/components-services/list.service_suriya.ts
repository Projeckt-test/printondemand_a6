import { Injectable, Injector } from '@angular/core';
import { _ } from 'underscore';
import { element } from '@angular/core/src/render3';

@Injectable({providedIn:'root'})


export class ListService{
    constructor(){

    }

    public checkListArray = async function(elem,sectionCount,obj){
        let Arr:any=[];
        let copy_elem = elem;
        if(obj.LIstartValue.length>0){
            while(copy_elem){
                if(copy_elem.nodeName.toLowerCase() == 'li'){
                    let _id:any = copy_elem.parentNode.getAttribute('id');
                    let temp = obj.LIstartValue.filter((x,count)=>{ return x.uuid == _id });
                    if(temp.length>0)
                        Arr.push(temp[0])
                }else if(copy_elem.parentNode.id=='section_'+sectionCount){
                    break;
                }
                copy_elem = copy_elem.parentNode
            }
            obj.LIstartValue =[];
        }
        
        

        try{
            while(elem){
                if(elem.nodeName.toLowerCase() == 'li'){

                    if(elem.parentNode.getAttribute('start')!=null && !isNaN(elem.parentNode.getAttribute("start")) && parseInt(elem.parentNode.getAttribute("start"))>1)
                         obj.LIstartValue.push({'value':parseInt(elem.parentNode.getAttribute("start"))+Math.round((Array.from(elem.parentNode.children).indexOf(elem))),'uuid':elem.parentNode.getAttribute('id')})
                     else
                        {
                
                         var incr_li;
                         Array.from(elem.parentNode.children).indexOf(elem)==1 && elem.parentNode.classList.contains("mhhe-pod--eoc-2col-list") && document.getElementById("editableFrame_test").getBoundingClientRect().height > 900?incr_li=0 : incr_li=1;
                         
                 
                         obj.LIstartValue.push({'value':(isNaN(elem.parentNode.getAttribute('start'))|| elem.parentNode.getAttribute('start')==null)?Math.round((Array.from(elem.parentNode.children).indexOf(elem))+incr_li):elem.parentNode.getAttribute('start'),'uuid':elem.parentNode.getAttribute('id')})
                    // Arr.push(Math.round((Array.from(elem.parentNode.children).indexOf(elem))+1))
                }}else if(elem.parentNode.id=='section_'+sectionCount){
                    break;
                }
    
                elem = elem.parentNode
            }
            if(Arr.length>0){

                Arr.forEach((x,count)=>{
                    let elem:any =  obj.LIstartValue.filter((y,count)=>{return y.uuid == x.uuid})
                    if(elem.length>0){
                        // let val:any = obj.LIstartValue[obj.LIstartValue.indexOf(elem)]['value']
                       
                        //console.log(obj.LIstartValue[obj.LIstartValue.indexOf(elem[0])].value,".....",obj.LIstartValue[obj.LIstartValue.indexOf(elem[0])],"......",obj.LIstartValue);
                        obj.LIstartValue[obj.LIstartValue.indexOf(elem[0])].value = Math.round(parseInt(obj.LIstartValue[obj.LIstartValue.indexOf(elem[0])].value))
                    //obj.LIstartValue[obj.LIstartValue.indexOf(elem[0])].value = Math.round(parseInt(obj.LIstartValue[obj.LIstartValue.indexOf(elem[0])].value))
                    }

                    // obj.LIstartValue[count].value =  obj.LIstartValue[count]['uuid'] == x.uuid?Math.round(obj.LIstartValue[count].value+ x.value):obj.LIstartValue[count].value;
                    // obj.LIstartValue.push(x);
                })
            }
            return new Promise((resolve,reject)=>{
                resolve('completed')
            });
        } catch(err){
            console.log(err)
        }
    }
    public listStructure = async function(Obj,elem,isCheck,sectionCount,childjson){
        

        if(isCheck){
            let lisArrCount:any=[];
            _.each(childjson,(x)=>{
                if(x.hasOwnProperty('li'))
                    lisArrCount.push(x.hasOwnProperty('li'))
            })
            if(lisArrCount.length > 2){                
                Obj.startFromUniqID = elem.lastElementChild.getAttribute('uniqid');
                Obj.DOMelement = elem.lastElementChild; 
            }else{

                while(elem){
                     if(elem.nodeName.toLowerCase() == 'ul' || elem.nodeName.toLowerCase() == 'ol' && elem.parentNode.nodeName.toLowerCase() != 'td' && elem.parentNode.nodeName.toLowerCase() != 'li' || elem.parentNode.nodeName.toLowerCase() == 'tr')
                        break;

                    Obj.traverseCount++;
                    elem = elem.parentNode;
                }
                Obj.startFromUniqID = elem.children.length>0?elem.children[0].getAttribute('uniqid'):elem.getAttribute('uniqid');
                // Obj.DOMelement = elem.children.length>0?elem.children[0]:elem;
                if(elem.parentNode.nodeName.toLowerCase() == 'tr') {  
                    Obj.DOMelement = elem.parentNode;    
                } else {    
                    Obj.DOMelement = elem;    
                }
                
                
            }     
        }else{
            let count=0;
            while(elem){
                if(elem.nodeName.toLowerCase() == 'ul' || elem.nodeName.toLowerCase() == 'ol'){
                    if(elem.getAttribute('id') == Obj.LIstartValue[count]['uuid']){
                        elem.setAttribute('start',Obj.LIstartValue[count]['value']) 
                          if(Obj.LIstartValue[count]['value']>1 && (Obj.LIstartValue.length-1)==count && Obj.LIstartValue.length>1) {
                   
                            elem.children[0].setAttribute('style','list-style:none;'); 

                             if(elem.children[0].nodeName.toLowerCase() == 'li' && elem.classList.contains("list-step")) {
                              
                              var newItem = document.createElement("DIV");
                              newItem.classList.add("step-title");
                              var textnode = document.createElement("P");
                              textnode.classList.add("class-empty");
                                 if(elem.children[0].children[0]) {
                                     if(!elem.children[0].children[0].classList.contains("step-title")) {
                                         elem.children[0].insertBefore(newItem, elem.children[0].firstChild);
                                         newItem.parentNode.insertBefore(textnode, newItem.nextSibling);
                                     }
                                 }
 
                              }
            
                        }
   
                    }
                    // elem.setAttribute('start',Obj.LIstartValue[count])
                    count++
                }else if(elem.parentNode.id=='section_'+sectionCount){
                    // Obj.LIstartValue=[];
                    break;
                }
                elem = elem.parentNode
            }
        }
        if(isCheck)
            return Obj;

    }
}