import { Injectable, Input, Output, EventEmitter, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as _ from 'underscore';
import { EditorElementStruture } from './editorElementStructure.service';
import { htmlEncode } from 'js-htmlencode';
import { diPublicInInjector } from '@angular/core/src/render3/di';
import { faUser } from '@fortawesome/fontawesome-free-regular';
import { TypeModifier } from '@angular/compiler/src/output/output_ast';
import { userInfo } from 'os';
import { SelectorContext } from '@angular/compiler';
import { AppConfig } from 'src/app/app-config';
import { environment} from './../../../../../../environments/environment';
interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'MathJax', src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/mml-svg.js' }
];
declare var document: any;

@Injectable()
export class editorDomService {
  @Output() sendId = new EventEmitter<any>();
  @Output() selectIndividualElement = new EventEmitter<any>();
  element_id: any;

  public editorBar: Subject<any> = new Subject<any>();
  private newLineObject = new Subject<any>();
  chapterSub: any = new Subject();
  private scripts: any = {};
  public pub_sub: any = {
    startFromUniqID: '',
    elemType: '',
    DOMelement: '',
    paraStartFrom: '',
    LIstartValue: [],
    traverseCount: '',
    isSibling: false,
    resetId: '',
    tableObj: {
      firstThreeRows: '',
      lastThreeRows: '',
      inBetween: '',
      removeTill: '',
      objStartFrom: '',
      row_index: ''
    },
    minorColumn: [],
    breakCondition: false,
    objKey: ''
  }
  eventArray: any = [];
  sectionArray: any = [];
  iframeBody: any = '';
  sectionCount: number = 0;
  breakLoop: boolean = false;
  noBreak: boolean = false;
  isSave: boolean = false;
  public renderer: Renderer2;
  public subject = new Subject<any>()
  page_model: any = '';
  sec_temp: any = '';
  condition_return: boolean = false;
  secheight: number = 0;
  startIndex: boolean = false;
  listCondition: boolean = false;
  public isRecursive: any = false;
  isDestroy: boolean = false;
  clipboardData: any;
  getasideElement: any;
  viewerheight: number = 0;
  iframejson: any;
  iframecontentDoc: any;
  watchsectionCount: number = 0;
  newLineElement: any = [];
  elementArray: any = [];
  parentSection: any = [];
  th_arr: any;
  chapterOpen: boolean = false;
  cumulative_rowheight: any = '';
  APIUrl: any = '';
  removeElem: any;

  img_size: any = [
    {
      "key": 1,
      "name": "Icon",
      "size": {
        "width": "30px",
        "height": "30px"
      }
    },
    {
      "key": 2,
      "name": "Small",
      "size": {
        "width": "180px",
        "height": "150px"
      }
    },
    {
      "key": 3,
      "name": "Medium",
      "size": {
        "width": "390px",
        "height": "300px"
      }
    },
    {
      "key": 4,
      "name": "Large",
      "size": {
        "width": "600px",
        "height": "420px"
      }
    }
  ]

  img_position: any = [
    {
      "key": 1,
      "name": "Center",
      "position": "center",
      "size": {
        "Icon": "position: relative; left: 220px;",
        "Small": "position: relative; left: 160px;",
        "Medium": "position: relative; left: 60px;",
        "Large": "position: relative; left: 0px;"
      }
    },
    {
      "key": 2,
      "name": "Right",
      "position": "right",
      "size": {
        "Icon": "position: relative; left: 500px;",
        "Small": "position: relative; left: 375px;",
        "Medium": "position: relative; left: 163px;",
        "Large": "position: relative; left: 20px;"
      }
    },
    {
      "key": 3,
      "name": "Left",
      "position": "left",
      "size": {
        "Icon": "position: relative; left: -60px;",
        "Small": "position: relative; left: -60px;",
        "Medium": "position: relative; left: -60px;",
        "Large": "position: relative; left: -60px;"
      }
    }
  ]

  styleConfig: any = [
    {
      "id": 1,
      "group_id": 101,
      "name": "fontFamily",
      "type": "dropdown",
      "style": 'fontFamily',
      "option": ["times new roman", "sans-serif", "arial", "fantasy", "cursive"]
    },
    {
      "id": 2,
      "group_id": 102,
      "name": "fontSize",
      "type": "textbox",
      "style": 'fontSize',
      "max": 50
    },
    {
      "id": 3,
      "group_id": 103,
      "type": "array",
      "arrayOptions": [{
        "id": 3001,
        "name": "color",
        "type": "button",
        "style": 'color'
      },
      {
        "id": 3002,
        "name": "backgroundColor",
        "type": "button",
        "style": 'backgroundColor'
      }]
    },
    {
      "id": 4,
      "group_id": 104,
      "type": "array",
      "arrayOptions": [{
        "id": 4001,
        "name": "bold",
        "type": "button",
        "style": 'fontWeight',
      },
      {
        "id": 4002,
        "name": "italic",
        "type": "button",
        "style": 'fontStyle'
      },
      {
        "id": 4003,
        "name": "underline",
        "type": "button",
        "style": 'textDecoration'
      }]
    },
    {
      "id": 5,
      "group_id": 105,
      "name": "Text-Align",
      "type": "dropdown",
      "style": 'textAlign',
      "option": ['left', 'right', 'center', 'justify']
    },
    {
      "id": 6,
      "group_id": 106,
      "type": "array",
      "arrayOptions": [{
        "id": 6001,
        "name": "Size",
        "type": "dropdown",
        "style": 'img-size',
        "option": this.img_size
      },
      {
        "id": 6002,
        "name": "Position",
        "type": "dropdown",
        "style": 'img-position',
        "option": this.img_position
      }]
    }
  ]

  constructor(rendererFactory: RendererFactory2, public pdfEditorElementStruture: EditorElementStruture) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.subject.asObservable();
    this.pdfEditorElementStruture.subjecElement.subscribe((Obj) => {
      _.each(Obj, (x) => {
        this.pub_sub.hasOwnProperty(Obj)
      })
      this.pub_sub.startFromUniqID = Obj.startFromUniqID;
      this.pub_sub.DOMelement = Obj.DOMelement;
      this.pub_sub.elemType = Obj.elemType;
      this.pub_sub.siblingCounts = Obj.siblingCounts;
      this.pub_sub.isSibling = Obj.isSibling;
    })
    this.viewerheight = localStorage.getItem('pagesize') ? parseFloat((localStorage.getItem('pagesize')).split(',')[1]) * 96 - 60 : 910;
    this.watchsectionCount = 0;
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
    this.APIUrl = environment.pod_port;
  }

  ngOnDestroy() {
    this.isDestroy = true;
  }

  /** function to create iframe head wise elements */
  appendIframeHeadContent = async function (json, contentDoc) {
    this.pub_sub.minorColumn = [];
    let selectedIframe = localStorage.getItem('selectedIFrame');
    let projectstandard = localStorage.getItem('projectstandard');
    try {
      contentDoc.head.innerHTML = '';
      if (json != "") {
        this.iframejson = json
        this.iframecontentDoc = contentDoc
        let data = json;
        let _this = this;
        for (let key in data) {
          let elem_type = Object.keys(data[key])[0];
          let elem = _this.renderer.createElement(elem_type);
          if (elem_type == 'link' && (data[key][Object.keys(data[key])[0]][0]['attributes'][0].href).indexOf('iframe.css') > -1) {
            selectedIframe = selectedIframe ? selectedIframe : 'iframe';
            if(projectstandard == "ETS"){
              // data[key][Object.keys(data[key])[0]][0]['attributes'][0].href = "https://"+ this.APIUrl +"/pod_assets/uploads/iframe.css";    //server
              // data[key][Object.keys(data[key])[0]][0]['attributes'][0].href = window.location.protocol +"//"+ this.APIUrl +"/pod_assets/uploads/iframe.css";  
              data[key][Object.keys(data[key])[0]][0]['attributes'][0].href = window.location.protocol +"//"+ this.APIUrl +"/pod_assets/uploads/"+ selectedIframe +".css";  
            }
            else{
              data[key][Object.keys(data[key])[0]][0]['attributes'][0].href = "../../../pod_assets/uploads/iframe.css";
            }
          }
          let resdata = await this.createElementAttribute(elem, data[key][Object.keys(data[key])[0]][0]['attributes'][0]);
          _this.renderer.appendChild(contentDoc.head, resdata)
        }
      }
      new Promise((resolve, reject) => {
        resolve('DOM appended')
      })
    } catch (error) {
      console.log(error)
    }
    this.isRecursive = true;
    this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
  }
  
  iframe_body: any = '';
  
  /** 
   * function to create iframe body page wise elements 
   * json : json of the html
   * contentDoc: iframe 
   * pageNo: page no for next and previous event
   * state : boolean to break html page wise or append full html to DOM
   * save :  boolean for conditional attributes for uniqId etc
   * */
  appendIframePageWiseContent = async function (page_model, contentDoc, pageNo, testDoc) {
    this.iframe_body = contentDoc;
    this.sectionCount = page_model.sectionArray.length;
    this.breakLoop = false;
    this.noBreak = false;
    this.compress_object = false;
    this.condition_return = false;
    this.secheight = 0;
    this.startIndex = false;
    // this.enterLoop =false;
    this.isSave = false;
    contentDoc.body.innerHTML = '';
    this.iframeBody = contentDoc.body;
    this.sec_temp = '';
    this.page_sec = '';
    this.page_model = page_model;
    this.listCondition = false;
    this.minor_column = false;
    let page_sec_size = localStorage.getItem('pagesize');

    if (page_sec_size) {
      var p_height = parseInt(page_sec_size.split(',')[1]);
      var r_height = (p_height - 0.5) + 'in';
    }
    try {
      /*let breakupJsonStatus = localStorage.getItem('breakuphtml');
      if(!breakupJsonStatus) {*/

      let _this = this;
      this.sec_temp = this.renderer.createElement('section')
      this.sec_temp.setAttribute('id', 'section_' + this.sectionCount)
      this.sec_temp.setAttribute('class', 'rm_mrgn_0 editor-frame dynamicSection');
      // if(this.sectionCount != 0 || this.sectionCount != '0'){
      //   this.sec_temp.setAttribute('style', 'page-break-before: always');
      //   this.sec_temp.setAttribute('class', 'rm_mrgn_0 editor-frame dynamicSection pageCondition');
      // }
      this.page_sec = this.renderer.createElement('section');
      this.page_sec.setAttribute('page_section', true);
      // this.renderer.setStyle(this.sec_temp, 'display', 'inline-block')
      this.sec_temp.appendChild(this.page_sec);
      this.iframeBody.appendChild(this.sec_temp);
      if (this.sectionCount > 0) {
        /* let iframe  = document.getElementById("editableFrame");
         let contentdocument = ( < HTMLIFrameElement > iframe).contentDocument;
         let tablelist = contentdocument.querySelectorAll('table');
         if(tablelist.length > 0) {
         for(let i=0; i< tablelist.length; i++){
             let curwidth:any = window.getComputedStyle(tablelist[i], null).getPropertyValue("width");
             curwidth = parseFloat(curwidth.split('px')[0]);
             if(curwidth > 710) {
                  var differencewidth = curwidth - 710;
                 var scaleper = (differencewidth * 100) / curwidth;
                 var scaleval = (1/100)*scaleper;
                 scaleval = 1-scaleval;
                 tablelist[i].style.transform = 'translate(-'+(scaleper/2)+'%,-'+(scaleper/2)+'%) scale('+scaleval+')';
             }
         }}*/
      }
      for (let keyx in page_model.json) {
        if (this.pub_sub.startFromUniqID == '' && this.compress_object) {
          this.elementNotRemoveCondition(page_model.json, keyx)
          break;
        }
        let nextElement = parseInt(keyx) + 1;
        let prevElement = parseInt(keyx) - 1;
        let elem_test = await this.createElement('', page_model.json[keyx], this.page_sec, page_model.json, page_model.json[prevElement], page_model.json[nextElement], keyx, true);
        if (!this.condition_return && (this.pub_sub.elemType == 'pagebreakInside' || this.pub_sub.elemType == 'default')) {
          let key_1 = Object.keys(page_model.json[JSON.parse(keyx)])
          if (!page_model.json[keyx][key_1[0]][0].hasOwnProperty('attributes'))
            break;
          if (this.pub_sub.isSibling) {
            let value = this.pdfEditorElementStruture.checkElementExist(this.pub_sub, page_model.json, false, '', '', true)
            if (value) {
              this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, page_model.json[(value - 1)], this.sectionCount, '', '', false);
              page_model.json[0]['attributes'][0].isbelongto = '';
              this.condition_return = true;
              return
            }
          } else if (this.pub_sub.DOMelement && (page_model.json[keyx][key_1[0]][0]['attributes'][0].uniqid == this.pub_sub.startFromUniqID) && (page_model.json[JSON.parse(keyx)].hasOwnProperty(this.pub_sub.DOMelement.nodeName.toLowerCase()))) {
            this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, page_model.json[JSON.parse(keyx)], this.sectionCount, '', '', false);
            this.pub_sub.DOMelement = '';
            this.condition_return = true;
          }
        }
        if (this.breakLoop)
          break;
      }
      for (let keyx in page_model.json) {
        await this.pdfEditorElementStruture.resetJSON(page_model.json[keyx], this.isSave, this.sectionCount, this.pub_sub);
      }
      if (this.pub_sub.minorColumn.length >= 1)
        await this.minorColumn(this.pub_sub.minorColumn, contentDoc, true)
      
      this.page_sec.style.height = r_height;
      page_model.iframeBody = this.iframeBody;
      page_model.isRecursive = this.isRecursive;
      page_model.sectionArray.push(this.sec_temp);
      var allTags = this.sec_temp;
      var ischapter;
      var chaptNum;
      if (this.sectionCount == 2 && allTags != '' && allTags != null) {
        var headertags = allTags.getElementsByTagName('header');
        var styles = ["color", "font-family", "font-size", "line-height", "white-space", "padding", "display", "float", "border", "border-top", "border-right", "border-bottom", "border-left", "border-color", "border-width", "border-style", "padding-top", "padding-right", "padding-bottom", "padding-left", "width", "height", "font-weight", "margin-top", "margin-left", "margin-bottom", "margin-right", "text-decoration", "background-color", "background-image", "font-style", "position", "text-align", "vertical-align", "top", "left", "bottom", "right", "word-wrap"];
        var setchpno = false;

        for (var cn = 0; cn < headertags.length; cn++) {
          if (headertags[cn].getElementsByClassName("chapter-number").length > 0) {
            ischapter = headertags[cn].getElementsByClassName("chapter-number");
          } else if (headertags[cn].getElementsByClassName("number").length > 0) {
            ischapter = headertags[cn].getElementsByClassName("number");
          } else if (headertags[cn].getElementsByClassName("mhhe-chapter_opener-chapter_number").length > 0) {
            ischapter = headertags[cn].getElementsByClassName("mhhe-chapter_opener-chapter_number");
          } else if (allTags.getElementsByClassName("mhhe-chapter_opener-chapter_number").length > 0) {
            chaptNum = allTags.getElementsByClassName("mhhe-chapter_opener-chapter_number");
            ischapter = chaptNum[0].getElementsByClassName("mhhe-chapter_opener-chapter_number");
          }
          if (ischapter) {
            for (var hc = 0; hc < ischapter.length; hc++) {
              var cn_html = ischapter[hc].innerHTML.replace(/<\/?[^>]+(>|$)/g, "").toLowerCase();
              if (cn_html.indexOf('part') === -1) {
                var txt = 'Chapter';
                var cp_class = 'chp-no';
              } else {
                var txt = 'Part';
                var cp_class = 'part-no';
              }
              cn_html = cn_html.replace(txt, '').replace(/:/g, '');//.replace(/\s/g, '')
              if (headertags[cn].getElementsByClassName("mhhe-chapter_opener-chapter_title").length > 0) {
                ischapter = headertags[cn].getElementsByClassName("mhhe-chapter_opener-chapter_title");
                var cnew_html = ischapter[hc].innerHTML.replace(/<\/?[^>]+(>|$)/g, "");
              }

              if (headertags[cn]) {
                this.chapterinfo = cn_html + ': ' + cnew_html;
                setchpno = true;
                this.chapterSub.next({ 'chapterinfo': this.chapterinfo });
              }
            }
          }
          if (setchpno == true) {
            break;
          }
        }
      }
      // this.subject.next(page_model)
      return new Promise((resolve, reject) => {
        resolve(page_model)
      })
      // }
    } catch (error) {
      console.log(error)
    }
  }

  public minor_column: false;
  minorColumn = async function (array, contentDoc, checkMajorIdExist) {
    this.minor_column = true;
    if (checkMajorIdExist) {
      for (var i = 0; i < array.length; i++) {
        if ((contentDoc.body.getElementsByClassName(array[i].id).length == 0) && array[i].status == true) {
          let elem: any = contentDoc.body.querySelectorAll("[minor_id=" + array[i].id + "]");
          if (elem.length > 0) {
            elem.forEach((x) => {
              x.parentNode.removeChild(x)
              array[i].status = false;
            })
          } else {
            array[i].status = false;
          }
        }
      }
    } else {
      let rev_array = array;
      rev_array.reverse();
      for (var i = 0; i < rev_array.length; i++) {
        if (contentDoc.body.getElementsByClassName(rev_array[i].id).length > 0) {
          if (rev_array[i].status)
            return
          this.noBreak = true;
          this.breakLoop = false;
          let sec_temp = this.renderer.createElement('section')
          sec_temp.setAttribute('id', 'removable')
          await this.createElement(sec_temp, rev_array[i].data, '');
          let elem: any = rev_array[i].parentId == 'body' ? contentDoc.body : contentDoc.body.querySelectorAll("[uniqid='" + rev_array[i].parentId + "']")[0];
          let appendAtIndex: any = '';
          if (rev_array[i].afterElemId == '') {
            appendAtIndex = 0;
          } else {
            appendAtIndex = contentDoc.body.querySelectorAll("[uniqid='" + rev_array[i].parentId + "']")[0].childNodes ? Math.round(Array.from(contentDoc.body.querySelectorAll("[uniqid='" + rev_array[i].parentId + "']")[0].childNodes).indexOf(contentDoc.body.querySelectorAll("[uniqid='" + rev_array[i].afterElemId + "']")[0]) + 1) : 0;
          }
          elem.insertBefore(sec_temp.childNodes[0], elem.childNodes[appendAtIndex]);
          rev_array[i].status = true;
        }
      }
      new Promise((resolve, reject) => {
        resolve('')
      })
      rev_array.reverse()
    }
  }
  /** 
   * timeout function for delay rendering
   */
  timeout = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * image DOM rendering completion event trigger
   */
  imageRender = async function (event) {
    if (!event.complete) {
      await this.timeout(100)
      this.imageRender(event)
    }
    if (event.complete == true) {
      return new Promise((resolve, reject) => {
        resolve('completed')
      })
    }
  }
  /** 
   * function to start next page where it left from previous page
   */
  setStartValue = async function (element, data, key) {
    switch (element.nodeName.toLowerCase()) {
      case 'p':
      case 'span':
        if (Object.keys(data[key])[0] == 'text') {
          await this.appendTextNode(element, data[key][Object.keys(data[key])[0]], this.pub_sub.paraStartFrom);
          this.pub_sub.paraStartFrom = 0;
        }
        this.pub_sub.LIstartValue = []
        break;
      case 'li':

        this.pdfEditorElementStruture.list_service.listStructure(this.pub_sub, element, false, this.sectionCount, '', '')
        this.pub_sub.paraStartFrom = 0;
        break;
      default:
        // this.pub_sub.LIstartValue=[];
        if (Object.keys(data[key])[0] == 'text') {
          await this.appendTextNode(element, data[key][Object.keys(data[key])[0]], this.pub_sub.paraStartFrom);
          this.pub_sub.paraStartFrom = 0;
        }
        this.pub_sub.LIstartValue = []
    }
    // this.startIndex= false
    new Promise((resolve, reject) => {
      resolve('created')
    })
  }
  /** function to create element */
  createElement = async function (parent, json, contentDocBody, cdata, prev, next, index, count, state) {
    if (!this.isDestroy) {
      let elem_type: any = '';
      let element: any = '';
      let data: any = ''
      let c = 0;
      let sectionHeight: any = '';
      elem_type = Object.keys(json)[0];
      if (Object.keys(json)[0] == "table") {
        this.getasideElement = json;
      }
      if (Object.keys(json)[0] == "aside") {
        this.getasideElement = json;
      }
      if (json[elem_type][0]['attributes'][0].hasOwnProperty('isbelongTo') && !this.startIndex && !this.noBreak) {
        if (json[elem_type][0]['attributes'][0].isbelongTo != '')
          return parent ? parent : contentDocBody;
      }
      
      if (json[elem_type][0]['attributes'][0]['class'] != undefined && !this.noBreak) {
        if (json[elem_type][0]['attributes'][0]['class'].includes('minor-column')) {
          if (!this.pub_sub.minorColumn.some((x) => { return x.id == json[elem_type][0]['attributes'][0]['minor_id'] })) {
            this.pub_sub.minorColumn.push({
              'id': json[elem_type][0]['attributes'][0]['minor_id'],
              'data': json,
              'parentId': (parent != '' || parent != undefined) ? (parent.classList.contains('mhhe-pod--glos-par')) ? parent.parentNode.getAttribute('uniqid') : parent.getAttribute('uniqid') : 'body',
              'afterElemId': parent.childNodes.length > 0 ? parent.lastElementChild.getAttribute('uniqid') : '',
              'status': false
            })
          }
          return
        }
      }
      element = this.renderer.createElement(elem_type);
      element.setAttribute('isbelongTo', 'page_' + this.sectionCount);
      json[elem_type][0]['attributes'][0].isbelongTo = 'page_' + this.sectionCount;
      
      element.addEventListener('click', this.mouseClickEvent);
      element.addEventListener('keypress', this.onkeyPressEvent);
      element.addEventListener('paste', this.pasteElement);

      if (parent)
        this.renderer.appendChild(parent, element)
      else if (contentDocBody)
        contentDocBody.appendChild(element);
      data = json[elem_type];
      try {
        for (let key in data) {
          if (!this.breakLoop) {
            if (Object.keys(data[key])[0].toLowerCase() == 'attributes') {
              await this.createElementAttribute(element, data[key][Object.keys(data[key])[0]][0]);
              if (data[0]["attributes"][0].uniqid == this.pub_sub.startFromUniqID && !this.isSave) {
                await this.setStartValue(element, data, key)
              }
              if (element.nodeName.toLowerCase() == 'img') {
                await this.imageRender(element);
              }
              if (element.nodeName.toLowerCase() == 'figure') { //figure max height issue eg: bohm chapter 5 refer
                if (element.classList.contains("mhhe-pod--image-100"))
                  element.setAttribute("style", "max-height:100% !important");
              }
              if (element.nodeName.toLowerCase() == "span") { // span  bg color and color issue
                if (element.style.color == "rgb(0, 0, 0)" && element.style.backgroundColor == "rgb(0, 0, 0)") {
                  element.style.backgroundColor = "";
                }
              }
              if (element.nodeName.toLowerCase() == "img") {
                var newheight = this.sec_temp.getBoundingClientRect().height + element.offsetHeight;
                if (element.closest("figure") != null) {
                  if (Math.round(newheight) > this.viewerheight && element.closest("figure").classList.contains("mhhe-pod--image-75to50-wrap")) { 
                    this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
                    this.breakLoop = true;
                  }
                }
              }
              
              let composedHeight = Math.round(this.viewerheight / 5);
              let viewerReducedFeight = this.viewerheight - composedHeight;
              var elementoffsetHeight = parseInt(element.getAttribute('offsetheight'));
              var difference = function (a, b) { return Math.abs(a - b); }
              var sectionAttr = Math.round(this.sec_temp.offsetHeight) + elementoffsetHeight;
              var remain = difference(this.viewerheight, sectionAttr);

              /* vishnu - code to fix horizontal scroll bar issue in epub Feldman5e_YrLife_sn_e8702 - 13.11.2021 - start */
              if (element.nodeName.toLowerCase() == "h4") {
                if (element.parentNode) {
                  if (element.parentNode.nodeName.toLowerCase() == "header") {
                    if (element.parentNode.parentNode) {
                      if (element.parentNode.parentNode.nodeName.toLowerCase() == "section") {
                        if (element.parentNode.parentNode.parentNode) {
                          if (element.parentNode.parentNode.parentNode.nodeName.toLowerCase() == "aside" && element.parentNode.parentNode.parentNode.classList.contains("sidenote-2")) {
                            element.parentNode.parentNode.setAttribute("style", "overflow-x:hidden");
                          }
                        }
                      }
                    }
                  }
                }
              }
              /* vishnu - code to fix horizontal scroll bar issue in epub Feldman5e_YrLife_sn_e8702 - 13.11.2021 - end */

              /* vishnu - aside table tfooter append in the last row error fixed - 21.12.2021 - start */
              if (element.nodeName.toLowerCase() =='p' ) {
                if(element.previousElementSibling){
                  if(element.previousElementSibling.children.length > 0){
                    if (element.previousElementSibling.children[0].nodeName.toLowerCase() == 'table') {
                      if (element.previousElementSibling.children[0].lastElementChild.nodeName.toLowerCase() == 'tfoot') {                          
                          element.previousElementSibling.children[0].lastElementChild.remove();
                      }
                    }
                  }
                }                  
              }
              /* vishnu - aside table tfooter append in the last row error fixed - 21.12.2021 - end */

              // vishnu -table rotation table row break fix - start
              if (element.nodeName.toLowerCase() == "table" && element.classList.contains("tableLandscape")) {
                this.cumulative_rowheight = 0;
              }
              if (element.parentNode.parentNode.nodeName.toLowerCase() == "table" && element.parentNode.parentNode.classList.contains("tableLandscape")) {
                if (element.nodeName.toLowerCase() == 'tr' && element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName.toLowerCase() == 'aside') {
                  this.cumulative_rowheight += parseInt(element.getAttribute('offsetheight')); // vishnu - table rotation table row break fix for table size 5.5*8.5, 6*9, 6.375*9.125                 
                  if (this.cumulative_rowheight > ((element.parentNode.parentNode.parentNode.offsetWidth) - 31)) {
                    element.parentNode.parentNode.setAttribute("data-break", true);
                    var table = element.parentNode.parentNode;
                    var tableHeader = table.getElementsByTagName('thead');
                    if (tableHeader.length == 0) {
                      var tableHeader = table.getElementsByTagName('caption');
                      var tcap = true;
                    }
                    var tableFoot = table.getElementsByTagName('tfoot');
                    if (tableFoot.length == 0) {
                      var footer = table.createTFoot();
                      var row = footer.insertRow(0);
                      var cell = row.insertCell(0);
                      cell.innerHTML = "<b>To be continued...</b>";
                      var colvalue = 1;
                      if (!tcap) {
                        colvalue = tableHeader[0].children[0].childElementCount;
                      } else {
                        var tableBody = table.getElementsByTagName('tbody');
                        colvalue = tableBody[0].children[tableBody[0].children.length - 2].childElementCount;
                      }
                      cell.colSpan = colvalue;

                    }
                    this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
                    this.breakLoop = true;
                    this.pub_sub.rotateBreak = true;
                    this.totateTable = element.parentNode;
                  }
                }
              }
              // vishnu -table rotation table row break fix - end
              let bottomBox = false;
              if (element.nodeName.toLowerCase() == "section") {

                if (element.classList.contains('learning_outcome') || element.classList.contains('work_application')) {
                  bottomBox = true;
                }
              }
              if (element.nodeName.toLowerCase() == "aside" || bottomBox) {

                sectionHeight = Math.round(this.sec_temp.offsetHeight) + element.offsetHeight;
                var tempSectionHight = sectionHeight;
                let remainingSpace = difference(this.viewerheight, tempSectionHight);
                let compareHeight = Math.round(this.viewerheight * 8 / 100);
                let diffSpace = difference(remainingSpace, compareHeight);

                if (!this.noBreak && tempSectionHight > this.viewerheight || remainingSpace < compareHeight) {
                  // console.log("box element", Math.round(this.sec_temp.getBoundingClientRect().height), element)
                  this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
                  this.breakLoop = true;
                }
              }
              else {
                var viewerComputedHeight = Math.round(this.viewerheight - 21);
                if (element.nodeName.toLowerCase() == 'img' || (element.parentNode && element.parentNode.nodeName.toLowerCase() == "li")) {
                  viewerComputedHeight = this.viewerheight;
                }
                if (!this.noBreak && (Math.round(this.sec_temp.getBoundingClientRect().height) > viewerComputedHeight)) {
                  // console.log("element", Math.round(this.sec_temp.getBoundingClientRect().height), element)
                  this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
                  this.breakLoop = true;
                  element.setAttribute("break_element", true);

                }
              }
            } else if (Object.keys(data[key])[0].toLowerCase() == 'text') {

              if (data[0]["attributes"][0].uniqid == this.pub_sub.startFromUniqID && element.nodeName.toLowerCase() != "li") {

                await this.setStartValue(element, data, key)

              } else {
                await this.appendTextNode(element, data[key][Object.keys(data[key])[0]], this.pub_sub.paraStartFrom);
                //await this.timeout(50)
              }
              if (this.pub_sub.minorColumn.length >= 1 && !this.minor_column) {
                for (var i = 0; i < this.pub_sub.minorColumn.length; i++) {
                  if ((this.iframe_body.body.getElementsByClassName(this.pub_sub.minorColumn[i].id).length > 0) && this.pub_sub.minorColumn[i].status != true) {
                    await this.minorColumn(this.pub_sub.minorColumn, this.iframe_body, false)
                    this.minor_column = false;
                    this.noBreak = false;
                    this.breakLoop = false;
                  }
                }
              }
              if (element.classList.contains("step-info")) {
                if (!element.parentNode.children[0].classList.contains("step-title")) {
                  var newItem = document.createElement("DIV");
                  newItem.classList.add("step-title");
                  var textnode = document.createElement("P");
                  textnode.classList.add("class-empty");
                  element.parentNode.insertBefore(newItem, element.parentNode.firstChild);
                  newItem.parentNode.insertBefore(textnode, newItem.nextSibling);
                }
              }
              if (element.previousElementSibling) {
                if (element.previousElementSibling.classList.contains("break_the_page")) {
                  this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
                  this.breakLoop = true;
                }
              }

              var remainingText = this.viewerheight - Math.round(this.sec_temp.getBoundingClientRect().height);
              var viewerComputedHeight = Math.round(this.viewerheight - 21);
              if (element.parentNode && element.parentNode.nodeName.toLowerCase() == "li") {
                viewerComputedHeight = this.viewerheight;
              }
              if (!this.noBreak && Math.round(this.sec_temp.getBoundingClientRect().height) > viewerComputedHeight) {
                // console.log("text element", Math.round(this.sec_temp.getBoundingClientRect().height), element)
                let splitPara = false;
                
                this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub, splitPara);
                this.breakLoop = true;
              }
            } else {
              if (data[0]["attributes"][0].uniqid == this.pub_sub.startFromUniqID) {
                // startInsert = true;
                this.startIndex = true;
              }
              await this.timeout(25)
              if (element.classList.contains("step-info")) {
                if (!element.parentNode.children[0].classList.contains("step-title")) {
                  var newItem = document.createElement("DIV");
                  newItem.classList.add("step-title");
                  var textnode = document.createElement("P");
                  textnode.classList.add("class-empty");
                  element.parentNode.insertBefore(newItem, element.parentNode.firstChild);
                  newItem.parentNode.insertBefore(textnode, newItem.nextSibling);
                }
              }

              /* code for white space fix -- start */
              var difference = function (a, b) { return Math.abs(a - b); }
              var balh = difference(this.viewerheight, Math.round(this.sec_temp.getBoundingClientRect().height));
              var ne = parseInt(key) + 1;
              var pre = parseInt(key) - 1;

              if (element.getAttribute("rotate-section") && cdata[count + 1] && cdata[count + 1][Object.keys(cdata[count + 1])[0]][0]["attributes"][0].class != "empty mhhe-pod--header-previous") {
                if (cdata[count + 1]) {
                  var nxtElemHeight = parseInt(cdata[count + 1][Object.keys(cdata[count + 1])[0]][0]["attributes"][0].offsetHeight);
                  balh = balh + nxtElemHeight;
                }

                if (balh < this.viewerheight && state) {
                  element.removeAttribute("rotate-section");
                  await this.movecontent(element, cdata, prev, next, count);

                }
              }
              
              if ((element.nodeName.toLowerCase() == 'figure' || element.nodeName.toLowerCase() == 'div' || element.nodeName.toLowerCase() == 'ol') && element.previousElementSibling == null && element.parentNode && element.parentNode.parentNode && element.parentNode.nodeName.toLowerCase() == 'li' && (element.parentNode.parentNode.nodeName.toLowerCase() == "ol" || element.parentNode.parentNode.nodeName.toLowerCase() == "ul")) { //&& parseInt(element.parentNode.parentNode.getAttribute('start')) > 1  
                if (!element.previousElementSibling) {
                  element.parentNode.classList.add("hidden-marker");
                }
                if (element.parentNode.parentNode.parentElement && element.parentNode.parentNode.parentElement.getAttribute("text")) {
                  element.parentNode.parentNode.parentElement.firstChild.remove();
                }
              }
              if (element.parentNode && element.parentNode.classList.contains('learning_outcomes') && (element.nodeName.toLowerCase() == 'ol' || element.nodeName.toLowerCase() == 'ul')) {
                element.classList.add('mhhe-pod--eoc-2col-list');
              }
              if (element.getAttribute('id') == "data-uuid-5837bf46b8264f3fb0724dbf47547f5c") {
                element.classList.add('mhhe-pod--eoc-2col-list');
              }
              
              if (this.th_arr && this.th_arr.length > 0 && (this.th_arr[0].childNodes[0].children && this.th_arr[0].childNodes[0].children.length > 1 || this.th_arr[0].childNodes[0].classList && this.th_arr[0].childNodes[0].classList.contains("backgound_lightblue") || this.th_arr[0].nodeName.toLowerCase() == "caption") && element.nodeName.toLowerCase() == 'table' && this.pub_sub.tableObj && this.pub_sub.tableObj.objStartFrom > 1) {
                var arr = [].slice.call(this.th_arr);
                var cln = arr[0].cloneNode(true);
                element.appendChild(cln);
                this.th_arr = '';

              }

              if (this.rowElem && element.nodeName.toLowerCase() == 'tbody' && this.rowElem.children[0].children.length > 0) {
                if (this.rowElem.children[0].children[0].rowSpan > 1 && this.rowElem.children[0].children[0].rowSpan == 2) {
                  var cln1 = this.rowElem.children[0].cloneNode(true);
                  var cln2 = this.rowElem.children[1].cloneNode(true);

                  element.appendChild(cln1);
                  element.appendChild(cln2);

                }

                this.rowElem = '';
              }

              if (this.pub_sub.rotateBreak && element.nodeName.toLowerCase() == "table") {
                var tableHeader = this.totateTable.parentNode.getElementsByTagName('thead');
                if (tableHeader.length == 0) {
                  var tableHeader = this.totateTable.parentNode.getElementsByTagName('caption');
                }
                var arr = [].slice.call(tableHeader);
                var cln = arr[0].cloneNode(true);
                element.appendChild(cln);
                this.pub_sub.rotateBreak = false;
                this.cumulative_rowheight += parseInt(tableHeader[0].children[0].getAttribute('offsetheight'));
              }

              if (this.pub_sub.listBreak) {
                if (element.nodeName.toLowerCase() == 'li') {
                  if (this.pub_sub.breakElem.previousElementSibling) {
                    if (this.pub_sub.breakElem.previousElementSibling.nodeName.toLowerCase() == 'li' && this.pub_sub.LIstartValue.length > 0) {
                      element.parentNode.setAttribute('start', this.pub_sub.LIstartValue[0].value);
                    } else {
                      element.classList.add('hidden-marker');
                    }
                  } else if (!this.pub_sub.breakElem.previousElementSibling && this.pub_sub.breakElem.parentNode && this.pub_sub.breakElem.parentNode.nodeName.toLowerCase() == "li") {

                    element.parentNode.setAttribute('start', this.pub_sub.LIstartValue[0].value);
                  } else if (this.pub_sub.prevElem && this.pub_sub.prevElem.nodeName.toLowerCase() != "li" && this.pub_sub.LIstartValue.length > 0) {
                    element.parentNode.setAttribute('start', this.pub_sub.LIstartValue[0].value);
                    element.classList.add('hidden-marker');
                  }
                  else {
                    element.classList.add('hidden-marker');
                    if (this.pub_sub.LIstartValue > 0) {
                      element.parentNode.setAttribute('start', this.pub_sub.LIstartValue[0].value);
                    }
                  }

                  this.pub_sub.listBreak = '';
                  this.pub_sub.prevText = false;
                  this.pub_sub.breakElem = '';
                }
              }
              
              await this.createElement(element, data[key], '', data, data[pre], data[ne], data[ne + 1], ne, true);

              if (element.classList.contains("add_left_float")) {
                element.style.setProperty("float", "left", "important");
                var newNode = document.createElement("DIV");
                newNode.classList.add("clear");
                element.parentNode.insertBefore(newNode, element.nextSibling);

              } else if (element.classList.contains("add_right_float")) {
                element.style.setProperty("float", "right", "important");
                var newNode = document.createElement("DIV");
                newNode.classList.add("clear");
                element.parentNode.insertBefore(newNode, element.nextSibling);
              }
            }
          }
          
          let projectstandard = localStorage.getItem('projectstandard');

          if (this.breakLoop && !this.condition_return) {
            if (this.pub_sub.elemType == '' || this.pub_sub.elemType == null || this.pub_sub.elemType == undefined) {
              this.pdfEditorElementStruture.checkElementBreakCondition(element);
              this.condition_return = false;
              this.isRecursive = true;

              if (element.nodeName.toLowerCase() == 'caption' && element.parentNode.nodeName.toLowerCase() == 'table' &&
                element.parentNode.parentNode.nodeName.toLowerCase() == 'figure' && element.parentNode.parentNode.parentNode.nodeName.toLowerCase() == 'div' &&
                element.parentNode.parentNode.parentNode.classList.contains("scrobile_container")
              ) {
                this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
              }

              /////////// venkat - Page break condition for ETS component - 20/04/2022 - start
              /* Move elements(Page break) based on page height(line height). If Remaining elements height is greater than page height(line height), 
              Move current & remaining elements to the next page and remove the current element from previous page */
              if(projectstandard == 'ETS'){
                await this.findRootElement(element, '')
                if(this.removeElem && this.removeElem.pageBreak){
                  element = this.removeElem.element; 
                  this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                  this.pdfEditorElementStruture.checkElementBreakCondition(element);
                  this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
                }
              }
              ///////////////  venkat - Page break condition for ETS component - 20/04/2022 - end

              // vishnu - table rotation table row break fix for table size 5.5*8.5, 6*9, 6.375*9.125 - start
              if (element.nodeName.toLowerCase() == 'tr' && element.parentNode.parentNode.nodeName.toLowerCase() == 'table' &&
                element.parentNode.parentNode.classList.contains("tableLandscape") &&
                element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName.toLowerCase() == 'aside'
              ) {
              
                this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
              }
              // vishnu - table rotation table row break fix for table size 5.5*8.5, 6*9, 6.375*9.125 - end
            }
            if (this.pub_sub.elemType.split('_')[1] != 'dontRemove' && !this.condition_return) {
              switch (this.pub_sub.elemType.toLowerCase()) {
                case 'ol':
                case 'ul':
                case 'li':
                case 'list':

                  if (!this.listCondition) {
                    await this.pdfEditorElementStruture.list_service.checkListArray(this.pub_sub.DOMelement, this.sectionCount, this.pub_sub);
                    this.pub_sub.DOMelement = this.pub_sub.DOMelement.nodeName.toLowerCase() == 'ul' || this.pub_sub.DOMelement.nodeName.toLowerCase() == 'ol' ? this.pub_sub.DOMelement : '';
                    this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'list';
                    this.listCondition = true;
                  }
                  if (this.pub_sub.elemType == 'list' && (data[JSON.parse(key)].hasOwnProperty('li') || data[JSON.parse(key)].hasOwnProperty('ol') || data[JSON.parse(key)].hasOwnProperty('ul'))) {
                    if (this.pub_sub.LIstartValue[0] && this.pub_sub.LIstartValue[0].value == '1' && (element.nodeName.toLowerCase() == 'ol' || element.nodeName.toLowerCase() == 'ul') && Array.from(element.parentNode.childNodes).indexOf(element) > 0 && element.previousElementSibling && (element.previousElementSibling.nodeName.toLowerCase() == 'figcaption' || element.previousElementSibling.nodeName.toLowerCase() == 'header')) {
                      this.pub_sub.startFromUniqID = element.previousElementSibling.getAttribute('uniqid');
                      this.pub_sub.elemType = element.previousElementSibling.nodeName.toLowerCase();
                      this.pub_sub.DOMelement = element.previousElementSibling;
                      this.pub_sub.isSibling = true;
                      this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                      this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
                    } else if (element.nodeName.toLowerCase() == 'li' && element.parentNode.nodeName.toLowerCase() == 'ol' && !element.parentNode.classList.contains('list-step')) {

                      this.pub_sub.startFromUniqID = element.getAttribute('uniqid');
                      this.pub_sub.elemType = "list";
                      this.pub_sub.DOMelement = element;
                      this.pub_sub.isSibling = true;
                      this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                      this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
                    } else if (element.nodeName.toLowerCase() == 'div' || element.nodeName.toLowerCase() == 'ul' && element.previousElementSibling && element.previousElementSibling.nodeName.toLowerCase() == 'header' && element.previousElementSibling.children[0].nodeName.toLowerCase() != 'h3') {
                      element = element.parentNode;
                      this.pub_sub.startFromUniqID = element.getAttribute('uniqid');
                      this.pub_sub.elemType = element.nodeName.toLowerCase();
                      this.pub_sub.DOMelement = element;
                      this.pub_sub.isSibling = true;
                      this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                      this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
                    } else {
                      if (this.pub_sub.DOMelement == '') {

                        this.pdfEditorElementStruture.list_service.listStructure(this.pub_sub, element, true, this.sectionCount, data);
                      }
                      if (this.pub_sub.DOMelement && data[JSON.parse(key)].hasOwnProperty(this.pub_sub.DOMelement.nodeName.toLowerCase()) || this.pub_sub.DOMelement.nodeName.toLowerCase() == 'tr' || this.pub_sub.DOMelement.nodeName.toLowerCase() == 'div') {

                        if (this.pub_sub.DOMelement.nodeName.toLowerCase() == 'tr') {
                          this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
                          this.breakLoop = true;
                        } else {
                          this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, data[JSON.parse(key)], this.sectionCount, '', '', false);
                          this.condition_return = true;
                        }
                      }
                    }
                  }
                  if (this.pub_sub.elemType == 'list' && data[JSON.parse(key)].hasOwnProperty('text') && !element.parentNode.classList.contains("list_column")) {
                    if (element.parentNode.nodeName.toLowerCase() != 'li' && !element.parentNode.classList.contains("list_column")) {
                      element = element.parentNode;
                    }
                    var headElem = false;
                    if (element.parentNode.nodeName.toLowerCase() == 'li') {
                      if (element.parentNode.parentNode && element.parentNode.parentNode.previousElementSibling && element.parentNode.parentNode.previousElementSibling.nodeName.toLowerCase() == "header") {
                        element = element.parentNode.parentNode.previousElementSibling.parentNode;
                        headElem = true;
                      }
                    }
                    
                    this.pub_sub.startFromUniqID = element.getAttribute('uniqid');
                    this.pub_sub.elemType = element.nodeName.toLowerCase();
                    this.pub_sub.DOMelement = element;
                    this.pub_sub.isSibling = true;
                    this.pub_sub.breakElem = element;
                    if (element.previousElementSibling) {
                      this.pub_sub.prevElem = element.previousElementSibling;
                    }
                    if (element.parentNode.nodeName.toLowerCase() == 'li') {
                      this.pub_sub.listBreak = element.parentElement;
                    } else {
                      this.pub_sub.listBreak = element.parentNode.offsetParent;
                    }
                    if (headElem || element.parentNode.classList.contains("list_column")) {
                      this.pub_sub.listBreak = '';
                    }

                    this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                    this.pdfEditorElementStruture.removeElement(this.pub_sub, element, data[JSON.parse(key)], this.sectionCount, '', '', false);
                    
                  }
                  break;
                case 'table':
                case 'tbody':
                case 'tr':
                  this.pub_sub.elemType = 'table';
                  if (this.pub_sub.elemType == 'table') {
                    if (this.pub_sub.tableObj.firstThreeRows == '' && ((data[JSON.parse(key)].hasOwnProperty('tr')) || (data[JSON.parse(key)].hasOwnProperty('table'))))
                      this.pub_sub.tableObj = this.pdfEditorElementStruture.table_service.getElementInTable(this.pub_sub, data, JSON.parse(key))

                    if (this.pub_sub.tableObj.firstThreeRows) {
                      if (data[JSON.parse(key)].hasOwnProperty('table')) {

                        let temp_table = element.childNodes[Math.round((JSON.parse(key)) - 1)];
                    
                        if (temp_table.nodeName.toLowerCase() == 'table' && Array.from(temp_table.parentNode.childNodes).indexOf(temp_table) > 0 && temp_table.previousElementSibling.nodeName.toLowerCase() == 'figcaption') {
                          this.pub_sub.startFromUniqID = temp_table.previousElementSibling.getAttribute('uniqid');
                          this.pub_sub.elemType = temp_table.previousElementSibling.nodeName.toLowerCase();
                          this.pub_sub.DOMelement = temp_table.previousElementSibling;
                          this.pub_sub.isSibling = true;
                          this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                          this.pdfEditorElementStruture.removeElement(this.pub_sub, temp_table, data[JSON.parse(key)], this.sectionCount, '', '', false);
                        }
                        else if (temp_table.nodeName.toLowerCase() == 'table' && Array.from(temp_table.parentNode.childNodes).indexOf(temp_table) > 0 && temp_table.parentNode && temp_table.parentNode.parentNode && temp_table.parentNode.parentNode.nodeName.toLowerCase() == 'figure') {
                          temp_table = element.parentNode.parentNode;
                          this.pub_sub.startFromUniqID = temp_table.getAttribute('uniqid');
                          this.pub_sub.elemType = temp_table.nodeName.toLowerCase();
                          this.pub_sub.DOMelement = temp_table;
                          this.pub_sub.isSibling = false;
                          this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                        }

                        else {
                          this.pdfEditorElementStruture.table_service.formatTableStructure(this.pub_sub, element.childNodes[Math.round((JSON.parse(key)) - 1)], this.pub_sub.tableObj, '');
                          if (data[JSON.parse(key)].hasOwnProperty('table') && element.previousElementSibling && element.previousElementSibling.nodeName.toLowerCase() == "header" && element.parentNode && element.parentNode.nodeName.toLowerCase() == "aside" && Math.round(this.sec_temp.getBoundingClientRect().height) > (this.viewerheight - 96)) {
                            temp_table = element.parentNode;
                            this.pub_sub.startFromUniqID = temp_table.getAttribute('uniqid');
                            this.pub_sub.elemType = temp_table.nodeName.toLowerCase();
                            this.pub_sub.DOMelement = temp_table;
                            this.pub_sub.isSibling = false;
                            this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                          } else if (data[JSON.parse(key)].hasOwnProperty('table') && element.previousElementSibling && element.previousElementSibling.nodeName.toLowerCase() == "figcaption") {
                            temp_table = element.parentNode;
                            this.pub_sub.startFromUniqID = temp_table.getAttribute('uniqid');
                            this.pub_sub.elemType = temp_table.nodeName.toLowerCase();
                            this.pub_sub.DOMelement = temp_table;
                            this.pub_sub.isSibling = false;
                            this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                          }
                          else if (data[JSON.parse(key)].hasOwnProperty('table') && element.parentNode && element.parentNode.previousElementSibling && element.parentNode.previousElementSibling.nodeName.toLowerCase() == "header" && Math.round(this.sec_temp.getBoundingClientRect().height) > (this.viewerheight - 96)) {
                            if (element.parentNode.parentNode.parentNode.parentNode && element.parentNode.parentNode.parentNode.parentNode.nodeName.toLowerCase() == "aside") {
                              temp_table = element.parentNode.parentNode.parentNode.parentNode;
                            }
                            else {
                              temp_table = element.parentNode.parentNode;
                            }

                            this.pub_sub.startFromUniqID = temp_table.getAttribute('uniqid');
                            this.pub_sub.elemType = temp_table.nodeName.toLowerCase();
                            this.pub_sub.DOMelement = temp_table;
                            this.pub_sub.isSibling = false;
                            this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                          } else if (data[JSON.parse(key)].hasOwnProperty('table') && element.parentNode && element.parentNode.parentNode && (element.parentNode.parentNode.nodeName.toLowerCase() == "li" || element.parentNode.parentNode.nodeName.toLowerCase() == "figure") && Math.round(this.sec_temp.getBoundingClientRect().height) > (this.viewerheight - 96)) {
                            temp_table = element.parentNode.parentNode;
                            this.pub_sub.startFromUniqID = temp_table.getAttribute('uniqid');
                            this.pub_sub.elemType = temp_table.nodeName.toLowerCase();
                            this.pub_sub.DOMelement = temp_table;
                            this.pub_sub.isSibling = false;
                            this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';

                          } else if (data[JSON.parse(key)].hasOwnProperty('table') && element.previousElementSibling && element.previousElementSibling.nodeName.toLowerCase() == "header" && Math.round(this.sec_temp.getBoundingClientRect().height) > (this.viewerheight - 96)) {
                            if (element.parentNode.parentNode.parentNode.parentNode && element.parentNode.parentNode.parentNode.parentNode.nodeName.toLowerCase() == "aside") {
                              temp_table = element.parentNode.parentNode.parentNode.parentNode;
                            }
                            else {
                              temp_table = element.parentNode;
                            }
                            this.pub_sub.startFromUniqID = temp_table.getAttribute('uniqid');
                            this.pub_sub.elemType = temp_table.nodeName.toLowerCase();
                            this.pub_sub.DOMelement = temp_table;
                            this.pub_sub.isSibling = false;
                            this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                          }

                          this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, this.getasideElement, this.sectionCount, '', '', false);
                          this.condition_return = true;
                        }
                      }
                    } else if (this.pub_sub.tableObj.lastThreeRows) {
                      var table = element;
                      var tableHeader = table.getElementsByTagName('thead');
                      if (tableHeader.length == 0) {
                        var tableHeader = table.getElementsByTagName('caption');
                        var tcap = true;
                      }
                      this.th_arr = tableHeader;

                      var tableFoot = table.getElementsByTagName('tfoot');
                      if (tableFoot.length == 0) {
                        var footer = table.createTFoot();
                        var row = footer.insertRow(0);
                        var cell = row.insertCell(0);
                        cell.innerHTML = "<b>To be continued...</b>";
                        var colvalue = 1;
                        if (!tcap) {
                          colvalue = tableHeader[0].children[0].childElementCount;
                        } else {
                          var tableBody = table.getElementsByTagName('tbody');
                          colvalue = tableBody[0].children[tableBody[0].children.length - 2].childElementCount;
                        }
                        cell.colSpan = colvalue;

                      }
                      this.breakTable = element;

                      if (data[JSON.parse(key)].hasOwnProperty('tr') && this.pub_sub.tableObj.row_index == '')
                        this.pub_sub.tableObj.row_index = JSON.parse(key);
                      if (data[JSON.parse(key)].hasOwnProperty('tbody')) {
                        this.pub_sub = this.pdfEditorElementStruture.table_service.formatTableStructure(this.pub_sub, element.childNodes[Math.round((JSON.parse(key)) - 1)], this.pub_sub.tableObj, this.saveElement);
                        this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, data[JSON.parse(key)], this.sectionCount, this.pub_sub.tableObj.objStartFrom, '');
                        this.condition_return = true;
                      }
                    } else if (this.pub_sub.tableObj.inBetween) {
                      var table = element; //var rowElem;
                      if (element.nodeName.toLowerCase() == 'tbody') {
                        table = element.parentNode;
                        this.rowElem = element;
                      }


                      var tableHeader = table.getElementsByTagName('thead');
                      if (tableHeader.length == 0) {
                        var tableHeader = table.getElementsByTagName('caption');
                        var tcap = true;
                      }
                      this.th_arr = tableHeader;

                      var tableFoot = table.getElementsByTagName('tfoot');
                      if (tableFoot.length == 0) {
                        var footer = table.createTFoot();
                        var row = footer.insertRow(0);
                        var cell = row.insertCell(0);
                        cell.innerHTML = "<b>To be continued...</b>";
                        var colvalue = 1;
                        if (!tcap) {
                          colvalue = tableHeader[0].children[0].childElementCount;
                        } else {
                          var tableBody = table.getElementsByTagName('tbody');
                          colvalue = tableBody[0].children[tableBody[0].children.length - 2].childElementCount;
                        }
                        cell.colSpan = colvalue;

                      }

                      this.breakTable = element;
                      
                      if (data[JSON.parse(key)].hasOwnProperty('tr') && this.pub_sub.tableObj.row_index == '')
                        this.pub_sub.tableObj.row_index = JSON.parse(key);
                      if (data[JSON.parse(key)].hasOwnProperty('tbody')) {
                        let arr: any = [];
                        let temp_arr: any = [];
                        temp_arr = Array.from(element.childNodes);
                        arr = temp_arr.filter((x, count) => { return x.nodeName.toLowerCase() == 'tbody' });
                        if (this.pub_sub.startFromUniqID == '' && this.pub_sub.DOMelement == '')
                          this.pdfEditorElementStruture.table_service.formatTableStructure(this.pub_sub, element.childNodes[Math.round((JSON.parse(key)) - 1)], this.pub_sub.tableObj, arr[0].lastElementChild);
                        this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, data[JSON.parse(key)], this.sectionCount, this.pub_sub.tableObj.row_index, '');
                        this.pub_sub.tableObj.objStartFrom = this.pub_sub.tableObj.row_index
                        this.condition_return = true;
                      }
                    }
                  }
                  break;
                case 'p':

                case 'paragraph':
                  await this.pdfEditorElementStruture.paragraph_service.paragraphStructure(this.pub_sub, this.pub_sub.DOMelement, Math.round(this.sec_temp.getBoundingClientRect().height), data, this.sec_temp, this.sectionCount, '', '', false);
                  this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                  if (this.pub_sub.paraStartFrom != 0) {
                    this.pub_sub.elemType = '';
                    this.condition_return = true;
                  }
                  break;
                case 'figure':
                case 'figurecaption':
                  this.pub_sub.elemType = this.pdfEditorElementStruture.checkElementNotRemove(this.pub_sub.DOMelement, this.pub_sub.elemType)
                  this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                  break;
                case 'aside':
                case 'section':
                case 'header':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                  this.pub_sub.elemType = this.pdfEditorElementStruture.checkElementNotRemove(this.pub_sub.DOMelement, this.pub_sub.elemType)
                  this.pdfEditorElementStruture.checkPreviousElements_service.checkPreviousSibilings(this.pub_sub, this.pub_sub.DOMelement, this.sectionCount, true);
                  this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                  break;
                case 'pagebreakInside':
                case 'default':
                  this.pub_sub.elemType = this.pdfEditorElementStruture.checkElementNotRemove(this.pub_sub.DOMelement, this.pub_sub.elemType)
                  this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                  break;
                default:
                  if (this.pub_sub.DOMelement.parentNode != null) {
                    this.pub_sub.elemType = this.pdfEditorElementStruture.checkElementNotRemove(this.pub_sub.DOMelement, this.pub_sub.elemType)
                    if (element.nodeName.toLowerCase() == 'td' && element.children.length > 0 && element.children[0].nodeName.toLowerCase() == 'figure') {
                      while (element) {
                        if (element.nodeName.toLowerCase() == 'table')
                          break;
                        element = element.parentNode;
                      }

                      this.pub_sub.startFromUniqID = element.getAttribute('uniqid');
                      this.pub_sub.elemType = element.nodeName.toLowerCase();
                      this.pub_sub.DOMelement = element;
                      this.pub_sub.isSibling = false;

                    }

                    if (element.nodeName.toLowerCase() == 'i' && element.previousElementSibling && element.previousElementSibling.nodeName.toLowerCase() == 'b') {
                      this.pub_sub.startFromUniqID = element.parentNode.getAttribute('uniqid');
                      this.pub_sub.elemType = element.parentNode.nodeName.toLowerCase();
                      this.pub_sub.DOMelement = element.parentNode;
                      this.pub_sub.isSibling = false;
                    }
                    this.pub_sub.elemType = this.pub_sub.elemType.split('_')[1] == 'dontRemove' ? this.pub_sub.elemType : 'pagebreakInside';
                  }
                  break;
              }
              if (this.pub_sub.elemType.split('_')[1] == 'dontRemove') {
                this.pub_sub.DOMelement.classList.add('dont_remove')
                this.elementNotRemoveCondition(data, key)
              } else {
                if (this.pub_sub.elemType == 'pagebreakInside' || this.pub_sub.elemType == 'default') {
                  let key_1 = Object.keys(data[JSON.parse(key)])
                  if (!data[key][key_1[0]][0].hasOwnProperty('attributes'))
                    break;
                  if (this.pub_sub.isSibling) {
                    let value = this.pdfEditorElementStruture.checkElementExist(this.pub_sub, data, false, '', '', true)
                    if (value) {
                      this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, data[(value - 1)], this.sectionCount, '', '', false);
                      data[0]['attributes'][0].isbelongto = '';
                      this.pub_sub.elemType = '';
                      this.condition_return = true;
                      return
                    }
                  } else if (this.pub_sub.DOMelement && (data[key][key_1[0]][0]['attributes'][0].uniqid == this.pub_sub.startFromUniqID) && (data[JSON.parse(key)].hasOwnProperty(this.pub_sub.DOMelement.nodeName.toLowerCase())) && this.pub_sub.DOMelement.parentElement != null) {
                    this.pdfEditorElementStruture.removeElement(this.pub_sub, this.pub_sub.DOMelement, data[JSON.parse(key)], this.sectionCount, '', '', false);
                    this.pub_sub.DOMelement = '';
                    this.pub_sub.elemType = '';
                    this.condition_return = true;
                  }
                }
              }
            } else if (this.pub_sub.elemType.split('_')[1] == 'dontRemove' && !this.condition_return) {
              this.pub_sub.DOMelement.classList.add('dont_remove')
              this.elementNotRemoveCondition(data, key)
            }
           
            element.setAttribute('isbelongTo', "");

            break;
          }
          if (!this.breakLoop && !this.noBreak){
            /////// In ETS standard, remove hr elements in page beginning - start
            if(projectstandard == 'ETS' && element && element.nodeName.toLowerCase() == "hr" && !element.previousSibling){
              element.remove();
            }
            /////// In ETS standard, remove hr elements in page beginning - end
            this.isRecursive = false;
          }
        }
        return new Promise((resolve, reject) => {
          resolve(element)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  // It helps to find element(question & answer container) which has 'root-container' class.
  async findRootElement(elem, baseElem) {
    baseElem = (baseElem != "") ? baseElem : elem;
    
    if(elem.classList.contains("root-container")){
      let index = 0;
      if(elem.parentNode){
        for(let l = 1; l < elem.parentNode.children.length; l++){
          if(elem.parentNode.children[l].classList.contains('page-break')){
            index = (index == 0) ? l : index;
            l = elem.parentNode.children.length;
          }
        }
        
      }

      this.removeElem = {
        "element": (index == 0) ? elem : elem.parentElement.children[index],
        "pageBreak": true
      }
      return
    }
    else if(elem.nodeName.toLowerCase() == 'body'){
      this.removeElem = {
        "element": baseElem,
        "pageBreak": false
      }
      return 
    }
    else{
      await this.findRootElement(elem.parentNode, baseElem);
    }

  }

  movecontent = async function (element, cdata, prev, next, count, figure) {
    var firstIteration = true;
    var section_height = Math.round(this.sec_temp.getBoundingClientRect().height);
    var i = 1;
    while (cdata[count]) {

      if (firstIteration) {
        count = count + 1;
      } else {
        count = count;
      }
      next = cdata[count];
     
      if (Object.keys(cdata[count])[0] == "section") {
        var sdata = cdata[count][Object.keys(cdata[count])[0]];
        var c = 1;
        //var fi = true;
        while (sdata) {
          if (sdata[c]) {
            var attrh = parseInt(sdata[c][Object.keys(sdata[c])[0]][0]["attributes"][0].offsetHeight);
            section_height += attrh;
          }
          if (!sdata[c] || section_height > this.viewerheight) {
            break;
          }
          
          await this.createElement(element.parentNode, sdata[c], '', sdata, sdata[c - 1], sdata[c], sdata[c + 1], c, false);
          var indexobj = -1;
          var filteredObj = sdata.find(function (item, i) {
            if (item != undefined) {
              var itemkey = Object.keys(item)[0];
              if (itemkey != "attributes") {
                if (item[itemkey][0]["attributes"][0].id == sdata[c][Object.keys(sdata[c])[0]][0]["attributes"][0].id) {
                  indexobj = i;
                  return i;
                }
              }
            }
          });
          sdata.splice(indexobj, 1);
          //fi = false;
          c++;
        }
      }
    
      if (cdata[count]) {
        var attributeHeight = parseInt(cdata[count][Object.keys(cdata[count])[0]][0]["attributes"][0].offsetHeight);
        section_height += attributeHeight;
      }
      if (cdata[count] && cdata[count][Object.keys(cdata[count])[0]][1] && cdata[count][Object.keys(cdata[count])[0]][1]["text"] && cdata[count][Object.keys(cdata[count])[0]][1]["text"] == "Required") {
        break;
      }
      if (!cdata[count] || Object.keys(cdata[count])[0] == "section" || Object.keys(cdata[count])[0] == "div" || section_height > this.viewerheight) {
        break;
      }
      if (Math.round(this.sec_temp.getBoundingClientRect().height) > this.viewerheight) {
        this.pub_sub = this.pdfEditorElementStruture.resetObj(this.pub_sub);
        this.breakLoop = true;
      } else {
        await this.createElement(element.parentNode, cdata[count], '', cdata, cdata[count - 1], cdata[count], cdata[count + 1], count, false);
        var indexobj = -1;
        var filteredObj = cdata.find(function (item, i) {
          if (item != undefined) {
            var itemkey = Object.keys(item)[0];
            if (itemkey != "attributes") {
              if (item[itemkey][0]["attributes"][0].id == next[Object.keys(next)[0]][0]["attributes"][0].id) {
                indexobj = i;
                return i;
              }
            }
          }
        });
        cdata.splice(indexobj, 1);
        firstIteration = false;
      }
    }
    return new Promise((resolve, reject) => {
      resolve('')
    })
  }
  /**
   * function not to remove the element from current page.
   */
  elementNotRemoveCondition = function (data, key) {
    this.pub_sub.startFromUniqID = '';
    this.compress_object = true;
    if ((this.compress_object && (this.pub_sub.elemType.split('_')[1] == 'dontRemove' && (data[JSON.parse(key)].hasOwnProperty(this.pub_sub.DOMelement.nodeName.toLowerCase()))) || (data.length - 1) > key)) {
      this.pub_sub.startFromUniqID = '';
      let indx: any = Math.round(JSON.parse(key) + 1);
      for (var i = indx; i < data.length; i++) {
        if (this.pub_sub.startFromUniqID) {
          break
        }
        let key_1 = Object.keys(data[i]);
        if (key_1[0] != "#text" && key_1[0] != "SCRIPT") {
          this.pub_sub = this.pdfEditorElementStruture.SetStartValue(this.pub_sub, data[i][key_1[0]], true, '', '', this.uniqid, false);
          if (this.pub_sub.startFromUniqID)
            break;
        } else if (key_1[0] == "#text") {
          // if (data[Math.round(JSON.parse(key) + 1)][key_1[0]].trim() != "") {
          this.uniqid++;
          data[i][key_1[0]][0].isbelongto = '';
          data[i][key_1[0]][0].uniqid = 'element_' + this.uniqid;
          this.pub_sub.startFromUniqID = 'element_' + this.uniqid;
          this.condition_return = true;
          //}
        }
      }
      this.compress_object = this.pub_sub.startFromUniqID ? false : true;
      this.condition_return = this.pub_sub.startFromUniqID ? true : false;
      // return this.pub_sub.startFromUniqID?true:false;
    }
  }
  /** function to append textnode */
  appendTextNode = async function (element, text, startFromIndex) {
    let text_test: any = '';
    let val = !this.noBreak ? startFromIndex ? startFromIndex : 0 : 0;
    for (let i = val; i < text.length; i++) {
      text_test += text[i]
    }
    let textNode = this.renderer.createText(text_test);
    element.appendChild(textNode)
    if (startFromIndex != 0) {
      element.setAttribute('para', 'first_para')
    } // element.classList.add('first_para')
    //if(!this.isSave){
    element.setAttribute('text', text)
    //}
    return new Promise((resolve, reject) => {
      resolve(element)
    })
  }
  /** function to create element attributes and append text */
  createElementAttribute = async function (element, json, innerHtml) {
    try {
      let _this = this;
      //[0]['attributes'][0]
      for (let key in json) {
        if (key == 'computedStyles')
          continue
        if (json[key] != '' && json[key] != undefined)
          json[key] = json[key].replace('margin-left: 1.77in !important', '').replace('margin-left: auto !important', '').replace('margin-right: 1.77in !important', '').replace('margin-right: auto !important', '').replace("border: 1px solid black");
        element.setAttribute(key, json[key])
        if (json[key] == 'stylesheet')
          element.setAttribute('type', 'text/css')
        if (key == 'key')
          element.setAttribute('key', json[key]);
        if (key == 'is_component') 
          element.setAttribute('is_component', json[key]);
        if (innerHtml)
          element.innerHTML = innerHtml.text;

      }
      if (this.iframeBody) {
        if (this.iframeBody.classList.contains('pagebreak_spi_even')) {
          if ((element.nodeName.toLowerCase() != 'img' || element.nodeName.toLowerCase() != 'span') && element.style.hasOwnProperty('float')) {
            if (document.defaultView.getComputedStyle(element, null).getPropertyValue('float') == 'right') {
              element.style.float = 'left';
              element.style.marginRight = '1em';
            }
          }
        }
      }
      return new Promise((resolve, reject) => {
        resolve(element)
      })
    } catch (error) {
      console.log(error)
    }
  }
  /** DOM listener for element edit */
  public mouseEntereEvent = function (event) {
    event.stopImmediatePropagation();
  }
  public mouseLeaveEvent = function (event) {
    event.stopImmediatePropagation();
    event.target.removeEventListener('mousedown', this.mouseDownEvent)
  }
  public mouseDownEvent = function () {
  }
  /**DOM listener for element removal */
  public OnNodeRemovedFromDocument = function (event) {
    var option = event.target;
  }
  onKeyDownEvent = (event) => {
  }
  test_subject: any = new Subject();
  list_subject: any = new Subject();
  checkcellwidth: any = new Subject();
  checkimagestyle: any = new Subject();
  checklineheight: any = new Subject();
  matheditorinput: any = new Subject();

  mouseClickEvent = (event, listType) => {
    let editorSlide, tableWidth, cellWidth, cell, matheditor;
    event.stopImmediatePropagation();
    const mathJaxClass = ['mjx-char', 'MathJax_Preview', 'mjx-chtml', 'mjx-mrow', 'mrow', 'mstyle', 'math', 'equation', 'MathJax', 'mfrac', 'mn', 'svg'];
    
    const mathM = event.target.tagName.split('')[0];
    const olElement = event.target.closest('OL');
    const olElementTagName = olElement ? olElement.tagName.toLowerCase() : '';
    const ulElement = event.target.closest('UL');
    const ulElementTagName = ulElement ? ulElement.tagName.toLowerCase() : '';
    const tableElement = event.target.closest('TABLE');
    const tableElementTagName = tableElement ? tableElement.tagName.toLowerCase() : '';
    const imageElement = event.target.closest('IMG');

    document.getElementById("editor_newframe") ? document.getElementById("editor_newframe").style.display = 'none' : '';
    document.getElementById("editor_newframe_table") ? document.getElementById("editor_newframe_table").style.display = 'none' : '';
    document.getElementById("editor_newframe_image") ? document.getElementById("editor_newframe_image").style.display = 'none' : '';
    if (olElement || ulElement) {
      this.list_subject.next(false);
    } else {
      this.list_subject.next(true);
    }

    //let computedLineHeight = ([event.target][0].style.lineHeight) ? [event.target][0].style.lineHeight : '1.2';
    let lineHeightCur = window.getComputedStyle(event.target, null).getPropertyValue("line-height");
    let fontSizeCur = window.getComputedStyle(event.target, null).getPropertyValue("font-size");
    let letterspaceCur = window.getComputedStyle(event.target, null).getPropertyValue("letter-spacing");
    let computedLineHeight = (lineHeightCur) ? lineHeightCur : '19.2px';
    this.checklineheight.next({ 'checklineheight': computedLineHeight, 'element': event.target, 'fontsize': fontSizeCur, 'letterspacing': letterspaceCur });
    
    this.eventArray.push(event);
    this.eventArray.length > 1 && this.eventArray.map((elem) => {
      if (elem && elem.target.style) {
        elem.target.style.border = "";
        elem.target.style.boxShadow = "";
        elem.target.style.padding = "";
        elem.target.style.borderRadius = "";
        elem.target.style.borderRadius = "";

      }
      if (elem.target && elem.target.parentNode && elem.target.parentNode.style) {
        elem.target.parentNode.style.border = "";
        elem.target.parentNode.style.boxShadow = "";
        elem.target.parentNode.style.padding = "";
        elem.target.parentNode.style.borderRadius = "";
        elem.target.parentNode.style.borderRadius = "";

      }
      if (elem.target && elem.target.parentNode && elem.target.parentNode.parentNode && elem.target.parentNode.parentNode.style) {
        elem.target.parentNode.parentNode.style.border = "";
        elem.target.parentNode.parentNode.style.boxShadow = "";
        elem.target.parentNode.parentNode.style.padding = "";
        elem.target.parentNode.parentNode.style.borderRadius = "";
        elem.target.parentNode.parentNode.style.borderRadius = "";

      }
    })
    if (this.newLineElement.length > 1) {
      for (var newElem of this.newLineElement) {
        newElem.style.border = "";
        newElem.style.boxShadow = "";
        newElem.style.padding = "";
        newElem.style.borderRadius = "";
      }
    }
    let child_elem = ['SPAN', 'STRONG', 'BOLD', 'FONT', 'TR', 'TD', 'TH', 'I', 'B', 'U', 'SUP', 'SUB', 'OL', 'UL', 'LI']

    let Eframe = document.getElementById("editableFrame")
    let frameWindow = (<HTMLIFrameElement>Eframe).contentWindow;
    this.parentSection = frameWindow.document.getElementsByTagName("br");

    if (this.parentSection.length > 0) {
      for (var i = 0; i < this.parentSection.length; i++) {
        this.elementArray.push(this.parentSection[i]);
      }
    }

    this.elementArray.forEach(function (x) {
      if (x.parentNode != null) {
        if (x.parentNode.textContent == null || x.parentNode.textContent == "") {
          x.parentNode.remove();
        }
      }
    });

    /* If projectstandard is ETS then emit the element to selectIndividualElement method(editor.component.ts) using eventEmitter. 
    Otherwise call checkComponent method*/
    let projectstandard = localStorage.getItem('projectstandard');
    if(event.target && projectstandard == "ETS"){
      if(event.target.nodeName.toLowerCase() == 'li'){
        this.selectIndividualElement.emit(event.target.parentNode);
      }
      else{
        this.selectIndividualElement.emit(event.target);
      }
    }
    else{
      this.checkComponent(event.target);
    }
  }

  /* Find element which has an attribute "is_component" value is true(Recursivly check, until an attribute value is true) 
  then emit the element to sendId method(editor.component.ts) using eventEmitter. */
  checkComponent(event) {
    let isComponent = event.getAttribute("is_component");
    if(event.nodeName.toLowerCase() == 'table' || event.nodeName.toLowerCase() == 'mjx-container'){
      this.element_id = event.getAttribute('id');

        let data = {
          "id": this.element_id,
          "event": event,
          "tagName": event.nodeName.toLowerCase()
        }
        this.sendId.emit(data);
    }
    else if (isComponent) {
      let nextElem = event.nextElementSibling ? event.nextElementSibling.nodeName.toLowerCase() : '';
      let previousElem = event.previousElementSibling ? event.previousElementSibling.nodeName.toLowerCase() : '';
      let condition_1 = event.getAttribute('key') == 'p' ? ((nextElem != 'ul' && nextElem != 'ol') ?
        ((nextElem == 'p' || previousElem == 'p') ?
          ((event.parentElement.getAttribute('is_component') == "false") ? true : false) : true) : false) : true;

      let parentElem = event.parentElement ? event.parentElement.nodeName.toLowerCase() : '';
      let parentPrevElem = event.parentElement ? (event.parentElement.previousElementSibling ? event.parentElement.previousElementSibling.nodeName.toLowerCase() : '') : '';
      let parentNextElem = event.parentElement ? (event.parentElement.nextElementSibling ? event.parentElement.nextElementSibling.nodeName.toLowerCase() : '') : '';
      let condition_2 = event.getAttribute('key') == 'p' ? (parentElem == 'li' ? ((parentPrevElem != 'li' && parentNextElem != 'li') ? true : false) : true) : true;

      let level2_ParentElement = (event.parentElement && event.parentElement.parentElement) ? event.parentElement.parentElement.nodeName.toLowerCase() : '';
      let level3_ParentElement = (event.parentElement && event.parentElement.parentElement && event.parentElement.parentElement.parentElement) ? event.parentElement.parentElement.parentElement.nodeName.toLowerCase() : '';
      let condition_3 = (event.getAttribute('key') == 'p') ? ((parentElem == "li") ?
        ((level2_ParentElement == "ol" || level2_ParentElement == "ul") ?
          ((level3_ParentElement == "td" || level3_ParentElement == "th") ? true : false) : false) : false) : true;

      if (isComponent == 'true' && (condition_3 || (condition_1 && condition_2))) {
        this.element_id = event.getAttribute('id');

        let data = {
          "id": this.element_id,
          "event": event,
        }
        this.sendId.emit(data);
      }
      else {
        this.checkComponent(event.parentElement);
      }
    }
  }

  findComments = function (el) {
    var arr = [];
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType == 8 || node.nodeName.toLowerCase == '#comment') {
        node.remove();
      } else {
        arr.push.apply(arr, this.findComments(node));
      }
    }
    return arr;
  }
  onkeyPressEvent = (event) => {
    let x = document.getElementById("editableFrame")
    let u = (<HTMLIFrameElement>x).contentWindow;
    let ret;
    if (u.window.getSelection) {
      var range = u.window.getSelection().getRangeAt(0);
      ret = range.commonAncestorContainer.parentNode || u.document;
      if (event.keyCode == 13) {
        this.newLineElement = ret.parentNode.children;
      }
      if (ret.tagName.toLowerCase() == "p" && ret.parentNode.tagName.toLowerCase() == "li") {
        if (ret.previousSibling != null) {
          if (ret.previousSibling.childNode != undefined) {
            if (ret.previousSibling.childNode.getAttribute("uniqid") == ret.getAttribute("uniqid"))
              ret.setAttribute("uniqid", "");
          }
          else if (ret.previousSibling.tagName.toLowerCase() == "p") {
            if (ret.previousSibling.getAttribute("uniqid") == ret.getAttribute("uniqid") && ret.previousSibling.parentNode.getAttribute("uniqid") == ret.parentNode.getAttribute("uniqid")) {
              ret.setAttribute("uniqid", "");
              ret.parentNode.setAttribute("uniqid", "");
            }
          }
        }
        else if (ret.parentNode.previousSibling != null) {
          if (ret.parentNode.previousSibling.childNodes[0].getAttribute("uniqid") == ret.getAttribute("uniqid"))
            ret.setAttribute("uniqid", "");
        }
        if (ret.nextSibling != null) {
          if (ret.nextSibling.childNode.getAttribute("uniqid") == ret.getAttribute("uniqid"))
            ret.setAttribute("uniqid", "");
        }
        else if (ret.parentNode.nextSibling != null) {
          if (ret.parentNode.nextSibling.childNodes[0].getAttribute("uniqid") == ret.getAttribute("uniqid"))
            ret.setAttribute("uniqid", "");
        }

      }
      if (event.type == 'paste') {
        if (event.path[0].tagName !== 'BR') { //paste in same paragraph
          var attrObj = event.path[0].attributes;
          for (const variable in attrObj) {
            if (attrObj[variable].name == 'uniqid') {
              console.log(attrObj[variable].value);
            }
          }
        }
        if (event.path[0].tagName == 'BR') { //enter paste in new paragraph
          ret.setAttribute("uniqid", "");
          console.log('enter paste in new paragraph');
        }
        let iframe = document.getElementById("editableFrame");
        let contentdocument = (<HTMLIFrameElement>iframe).contentDocument;
        var all = contentdocument.getElementsByTagName('body');
        var fragmentLength = 2;
        for (var i = 1; i <= fragmentLength; i++) {
          this.findComments(all[0]);
        }
      }
      if (ret.previousSibling) {
        if (ret.previousSibling.getAttribute) {
          if (ret.previousSibling.getAttribute("uniqid") == ret.getAttribute("uniqid")) {
            ret.setAttribute("uniqid", "");
          }
        }
      }
      
      if (ret.nextSibling != null) {
        if (ret.nextSibling.getAttribute) {
          if (ret.nextSibling.getAttribute("uniqid") == ret.getAttribute("uniqid"))
            ret.setAttribute("uniqid", "");
        }
      } else if (ret.nextSibling == null) {
        return;
      }
    }
  }

  pasteElement = (event) => {
    var clipboarddata = event.clipboardData.getData('text/html');
    event.preventDefault();
    let x = document.getElementById("editableFrame")
    let u = (<HTMLIFrameElement>x).contentWindow;
    var text;
    var clp = (event.originalEvent || event).clipboardData;
    if (clp === undefined || clp === null) {
      text = event.originalEvent["clipboardData"].getData('text');
      if (text !== "") {
        text = text.replace(/<[^>]*>/g, "");
        if (window.getSelection) {
          var newNode = document.createElement("span");
          newNode.innerHTML = text;
          u.window.getSelection().getRangeAt(0).insertNode(newNode);
        }
      }
    } else {

      text = clp.getData('text/html');
      text = text.replace("^\"+|\"+$", "")
      if (text !== "") {
        text = text.replace(/uniqid\=\"([A-Za-z0-9 _]*)\"/g, '').trim();
        u.document.execCommand('insertHTML', false, text);

        this.onkeyPressEvent(event);
      }
    }
  }
  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }
  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
          script.onreadystatechange = () => {
            if (script.readyState === "loaded" || script.readyState === "complete") {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  //Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        let editableFrame = document.getElementById("editableFrame");
        let contentdocument = (<HTMLIFrameElement>editableFrame).contentDocument;
        contentdocument.getElementsByTagName('head')[0].append(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }
}