import {
    Component,
    ViewChild,
    ElementRef,
    Renderer2,
    AfterViewInit,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';
import {
    HttpClient
} from '@angular/common/http';
import {
    observable,
    Subject
} from 'rxjs'
import {
    ProjectDataService
} from '../services/project-data.service';
import {
    editorHttpService
} from './editorFrame-services/editorHttp.service';
import {
    editorDomService
} from './editorFrame-services/editorDom.service';
import {
    editorJsonService
} from './editorFrame-services/editorJson.service';
import {
    EditorSaveService
} from './editorFrame-services/editorSave.service'
import {
    htmlEncode,
    htmlDecode
} from 'js-htmlencode';
import {
    Subscription
} from 'rxjs'
import {
    AppConfig
} from '../../../../app-config';
import {
    NgxSpinnerService
} from 'ngx-spinner';
import {
    DOCUMENT
} from "@angular/platform-browser";
import {
    Router,
    NavigationEnd,
    ActivatedRoute,
    NavigationExtras,
    NavigationStart
} from "@angular/router";
import {
    DomSanitizer
} from '@angular/platform-browser';
//import * as _ from 'underscore';
import * as _ from 'underscore';
import {
    ProcessPDFService
} from '../services/pdf/process-pdf.service';
import {
    ColorEvent
} from 'ngx-color';
import {
    MatSnackBar
} from '@angular/material/snack-bar';
import {
    NgbActiveModal,
    NgbModal,
    NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import {
    ModalboxComponent
} from '../../../../modalbox/modalbox.component';
import {
    MatPaginator,
    MatTableDataSource,
    MatSort
} from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare let MathJax: any;
@Component({
    selector: 'editor-html',
    templateUrl: './editor.component.html',
    styleUrls: ['./../../../../convert-chapters/convert-chapters.component.scss'],
    providers: [editorDomService],

})

export class EditorComponent implements AfterViewInit, OnInit {
    APIUrl;
    jsonformlogin;
    projectstandard;
    test_sectionarray;
    cellWidth;
    lineheight: number;
    matherrormsg = '';
    lineheightElement;
    cell;
    mathinput;
    targetnode;
    chapterFile = "http://172.24.175.33/princeXML_new/";
    tocContent;
    error = true;
    chaptersList;
    pdfSrc;
    pageVariable: any;
    projectName;
    chapterCount;
    editIcon = false;
    enableSave = true;
    checkgo: boolean = false;
    breakupJsonStatus: number = 0;
    project_id = "";
    tocData = {};
    viewer;
    contentdocument: any;
    firstload: number = 1;
    selectedElement;
    selectedToc;
    indexval;
    uploadURL: any;
    chapter: any;
    pageno: any;
    pagenoval: any;
    userrole;
    projectEditable: any;
    tocdetail: any;
    tocdetails: any;
    chapterDetails: any;
    previous_chapterDetails: any;
    currentChapter: any;
    routerSegments: Array < any > = [];
    routePath: any;
    projectCount;
    isReadOnly = true;
    enable_icon: boolean = false;
    isSave: boolean = false;
    saveflag: boolean = false;
    chapterinfo: any;
    button_disable: boolean = true;
    page_model: any = {
        sectionArray: [],
        iframeBody: '',
        sectionCount: 0,
        json: '',
        deleteArray: [],
        isRecursive: ''
    };
    trig: string = '';
    colors = ['#000000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB']
    public dialogRef: any;
    public IsEditOption: any;
    eventArray: any = [];
    actionBold;
    actionBlock;
    actionP;
    actionItalic;
    actionUnderline;
    actionStrike;
    actionSub;
    actionSuper;
    actionPageBreak;
    actionOl;
    actionUl;
    actionH1;
    actionIndent;
    actionStyle;
    actionH2;
    actionCreateLink;
    actionUnLink;
    actionTC;
    rightAllign;
    leftAllign;
    centerAllign;
    foreColor;
    colorPicker: boolean = false;
    activePage;
    isShowPageTitle: boolean = true;
    isTypeList: boolean;
    public contentDoc: any = '';
    public test_contentDoc: any = '';
    private htmlString: any = '';
    closeResult = '';
    isPageFirst: boolean = true;
    jumppage: number = 1;
    active: boolean = false;
    currentX;
    currentY;
    initialX;
    initialY;
    xOffset = 0;
    yOffset = 0;
    dragItem;
    fontsize: number;
    letterspace:number;
    pdfunderprocess: boolean = false;
    imagesize: number;
    imagepadding: number;
    imagemargin: number;
    imagemargin_l: number;
    imagemargin_r: number;
    imagemargin_t: number;
    imagemargin_b: number;
    img_style;
    mathpaddingTop: number;
    mathpaddingRight: number;
    mathpaddingBottom: number;
    mathpaddingLeft: number;
    startPageNumber: number;
    dataSource;
    displayedColumns = ['tocname', 'pagenumber', 'poptips_container', 'htmlstatus'];
    showMattable: boolean = true;
    showPreview: boolean = false;
    page_number;
    pop_tips;
    two_column;
    actionTHC;
    actionfloatLeft;
    actionfloatRight;
    myForm!: FormGroup;
    isExist = false;

    jsonArray: any = [
        {
          "name": "div",
          "description": "List Box",
          "displayField": "List Box",
          "type": "div",
          "data-uuid": "",
          "fields": [
            {
              "id": "section",
              "name": "section",
              "type": "section",
              "localized": false,
              "required": false,
              "validations": [],
              "disabled": false,
              "omitted": false,
              "content": true,
              "data": "",
              "fields": [
                {
                  "id": "heading",
                  "name": "heading",
                  "type": "header",
                  "localized": false,
                  "required": false,
                  "validations": [],
                  "disabled": false,
                  "omitted": false,
                  "content": true,
                  "data": "",
                  "fields": [
                    {
                      "id": "heading",
                      "name": "heading",
                      "type": "h4",
                      "localized": false,
                      "required": false,
                      "validations": [],
                      "disabled": false,
                      "omitted": false,
                      "content": false,
                      "data": ""
                    }
                  ]
                },
                {
                  "id": "paragraph",
                  "name": "paragraph",
                  "type": "p",
                  "localized": false,
                  "required": false,
                  "validations": [],
                  "disabled": false,
                  "omitted": false,
                  "content": false,
                  "data": ""
                },
                {
                  "id": "list",
                  "name": "list",
                  "type": "ol",
                  "localized": false,
                  "required": false,
                  "validations": [],
                  "disabled": false,
                  "omitted": false,
                  "content": true,
                  "data": "",
                  "fields": [
                    {
                      "id": "list",
                      "name": "list",
                      "type": "li",
                      "localized": false,
                      "required": false,
                      "validations": [],
                      "disabled": false,
                      "omitted": false,
                      "content": true,
                      "data": "",
                      "fields": [
                        {
                          "id": "paragraph",
                          "name": "paragraph",
                          "type": "p",
                          "localized": false,
                          "required": false,
                          "validations": [],
                          "disabled": false,
                          "omitted": false,
                          "content": false,
                          "data": ""
                        }
                      ]
                    },
                    {
                      "id": "list",
                      "name": "list",
                      "type": "li",
                      "localized": false,
                      "required": false,
                      "validations": [],
                      "disabled": false,
                      "omitted": false,
                      "content": true,
                      "data": "",
                      "fields": [
                        {
                          "id": "paragraph",
                          "name": "paragraph",
                          "type": "p",
                          "localized": false,
                          "required": false,
                          "validations": [],
                          "disabled": false,
                          "omitted": false,
                          "content": false,
                          "data": ""
                        }
                      ]
                    },
                    {
                      "id": "list",
                      "name": "list",
                      "type": "li",
                      "localized": false,
                      "required": false,
                      "validations": [],
                      "disabled": false,
                      "omitted": false,
                      "content": true,
                      "data": "",
                      "fields": [
                        {
                          "id": "paragraph",
                          "name": "paragraph",
                          "type": "p",
                          "localized": false,
                          "required": false,
                          "validations": [],
                          "disabled": false,
                          "omitted": false,
                          "content": false,
                          "data": ""
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "created": {
            "user": "",
            "date": "",
            "time": ""
          }
        },
        {
          "name": "section",
          "description": "Learning outcome",
          "displayField": "Box",
          "type": "section",
          "data-uuid": "",
          "fields": [
            {
              "id": "heading",
              "name": "heading",
              "type": "header",
              "localized": false,
              "required": false,
              "validations": [],
              "disabled": false,
              "omitted": false,
              "content": true,
              "data": "",
              "fields": [
                {
                  "id": "heading",
                  "name": "heading",
                  "type": "h4",
                  "localized": false,
                  "required": false,
                  "validations": [],
                  "disabled": false,
                  "omitted": false,
                  "content": false,
                  "data": ""
                }
              ]
            },
            {
              "id": "paragraph",
              "name": "paragraph",
              "type": "p",
              "localized": false,
              "required": false,
              "validations": [],
              "disabled": false,
              "omitted": false,
              "content": false,
              "data": ""
            }
          ],
          "created": {
            "user": "",
            "date": "",
            "time": ""
          }
        }
      ]
    
        selectedJson: any = [];
        fields: any = [];
        previewList: any = [];
        element: string = '';
        elementArray: any = [];

    @ViewChild('iframe') public iframeElement: ElementRef;
    @ViewChild('iframetest') public iframeElement_test: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(public http: HttpClient,
        private sanitizer: DomSanitizer,
        public renderer: Renderer2,
        public dataservice: ProjectDataService,
        public editorHttpService: editorHttpService,
        public editorDomService: editorDomService,
        public editorJsonService: editorJsonService,
        public editorSaveService: EditorSaveService,
        private appConfig: AppConfig,
        private spinner: NgxSpinnerService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private processpdfservice: ProcessPDFService,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private cdRef: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {

        //super(editorHttpService, editorDomService, editorJsonService, renderer)
        this.APIUrl = appConfig.config.apiURL;
        this.uploadURL = this.appConfig.config.uploadsURL;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("editor") != -1) {
                    this.viewer = false;
                } else {
                    this.viewer = true;
                }
            }
        });
    }

    ngOnInit() {

          this.myForm = this.formBuilder.group({
            title: [[], null],
            heading: [[], null],
            paragraph: [[], null],
            list: [[], null],
            content: [[], null],
            div: [[], null]
          });

        localStorage.setItem('breakuphtml', '');
        this.userrole = JSON.parse(localStorage.getItem('currentUser')).userrole;
        this.projectEditable = JSON.parse(localStorage.getItem('isEditable'));

        if((this.userrole == 1 || this.userrole == 2) || this.projectEditable){
            document.getElementById('editableFrame').classList.remove("restrictUser");
            this.isReadOnly = false;
        }
        else{
            document.getElementById('editableFrame').className = "restrictUser";
            this.isReadOnly = true;
        }
        if(localStorage.getItem('tocstatus') && localStorage.getItem('chapterid')){
            this.chapterlist();
        }
        this.onloadChapter();
        this.editorDomService.checkcellwidth.subscribe((data) => {
            this.cellWidth = parseInt(data.cellwidth);
            this.cell = data.cell;
            this.cell.style.width = this.cellWidth + '%';
            this.cdRef.detectChanges();
        });

        this.editorDomService.checkimagestyle.subscribe((data) => { 
            this.imagesize = Number((data.imagesize).split('px')[0]);
            this.imagepadding = Number((data.imagepadding).split('px')[0]);
            //this.imagemargin = Number((data.image_margin).split('px')[0]);
            this.imagemargin_l = Number((data.mar_left).split('px')[0]|| '0');
            this.imagemargin_r = Number((data.mar_right).split('px')[0]|| '0');
            this.imagemargin_t = Number((data.mar_top).split('px')[0]|| '0');
            this.imagemargin_b = Number((data.mar_bottom).split('px')[0]|| '0');
           
            this.img_style = data.element;
            this.cdRef.detectChanges();
        });

        this.editorDomService.checklineheight.subscribe((data) => {
            //this.lineheight = (parseFloat((data.checklineheight).split('px')[0])/16);  
            //this.lineheight = Number(this.lineheight.toFixed(2)); 
            this.fontsize = parseFloat((data.fontsize).split('px')[0]);
            this.letterspace = parseFloat((data.letterspacing).split('px')[0]);
            this.lineheight = (parseFloat((data.checklineheight).split('px')[0]) / this.fontsize);
            this.fontsize = Number(this.fontsize.toFixed(2));
            this.lineheight = Number(this.lineheight.toFixed(2));
            this.letterspace = Number(this.letterspace.toFixed(2));
            this.lineheightElement = data.element;
            this.cdRef.detectChanges();
        })
        this.editorDomService.matheditorinput.subscribe((data) => {
            this.mathinput = data.matheditorinput;
            this.targetnode = data.targetnode;
            this.matherrormsg = '';
            if ((data.padding).split(' ').length > 1) {
                this.mathpaddingTop = parseFloat(((data.padding).split(' ')[0]).split('px')[0]);
                this.mathpaddingRight = parseFloat(((data.padding).split(' ')[1]).split('px')[0]);
                this.mathpaddingBottom = parseFloat(((data.padding).split(' ')[2]).split('px')[0]);
                this.mathpaddingLeft = parseFloat(((data.padding).split(' ')[3]).split('px')[0]);
            } else {
                this.mathpaddingTop = 0;
                this.mathpaddingRight = 0;
                this.mathpaddingBottom = 0;
                this.mathpaddingLeft = 0;
            }

            this.cdRef.detectChanges();
        })
        this.editorDomService.load('MathJax');
        this.processpdfservice.pdfsubject.subscribe((data) => {
            if (data) {
                this.pdfunderprocess = false;
            } else {
                this.pdfunderprocess = true;
            }
            this.cdRef.detectChanges();
        })

        this.editorDomService.chapterSub.subscribe((data) => {
            if (data) {
                this.chapterinfo = data.chapterinfo;
            } 
        })

        if(localStorage.getItem('viewer') && localStorage.getItem('viewer') == 'true'){
            this.showMattable = false;  
        } 
    }

    addFields(data: any) {
        if (data.fields.length > 0) {
          this.isExist = true;
          this.selectedJson = data;
          
          // create uuid for json elements
          this.selectedJson["data-uuid"] = this.createUUID();
          this.generateHtmlTagId(this.selectedJson.fields);
    
          this.fields = data.fields;
          console.log("JsonData = ",this.selectedJson)
        }
      }
    
    generateHtmlTagId(data: any) {
    data.forEach((element: any) => {
        if(element.content){
        element.id = element.name+'-'+this.createUUID();
        this.generateHtmlTagId(element.fields);
        }
        else{
        element.id = element.name+'-'+this.createUUID();
        }
    });
    }

    saveChanges(jsonData: any) {
        this.element = '';
        this.element += '<' + jsonData.type + '>';
        this.recursiveList(jsonData.fields);
        this.element += '</' + jsonData.type + '>';
    
        jsonData.created.date = new Date().toLocaleDateString();
        jsonData.created.time = new Date().toLocaleTimeString();
    
        this.previewList.push(jsonData);
        this.isExist = false;
        this.elementArray.push(this.element);
    
        console.log("PreviewListData = ", this.previewList);
        console.log("Html = ", this.elementArray[this.elementArray.length - 1]);
    }

    recursiveList(data: any) {
    for (let i = 0; i <= data.length; i++) {
        if (i > 0 && data[i - 1].fields && data[i - 1].fields.length) {
        this.element += '</' + data[i - 1].type + '>';
        }

        if (i < data.length) {
        this.element += '<' + data[i].type + '>';

        if (data[i].content) {
            this.recursiveList(data[i].fields);
        }
        else {
            let name = data[i].name;
            let val = this.myForm.value[name];

            for (let j = 0; j < val.length; j++) {
            if (data[i].id == val[j].id) {
                data[i].data = val[j].data;
            }
            }

            this.element += data[i].data;
            this.element += '</' + data[i].type + '>';
        }
        }
    }
    }
    
    
    // generate uuid
    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    getData(data: any, fieldName: string) {
        let val = data ? data : '';
        this.myForm.value[fieldName].push(val);
    }

    ngOnDestroy() {
        console.log("yes destroyed");
    }
    ngAfterViewInit() {}

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    timeout = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    saved_pageno: number = 0;
    chapter_pagecount: number = 1;
    nodeToDelete: any = '';
    deletedArray: any = [];
    onDeleteNode = function () {
        this.page_model.deleteArray.push(this.nodeToDelete.getAttribute('uniqid'));
        this.nodeToDelete.parentNode.removeChild(this.nodeToDelete)
    }

    getprojectchapters(project) {
        this.dataservice.getProjectData(project).subscribe(data => {
            var response = JSON.parse(data);
            var extension = response.project_type;
            var folder = response.project_name;
            this.projectName = folder;
            this.dataservice.getTocData(folder, extension).subscribe(toc => {
                this.getContentList(toc, extension).then(
                    (val) => {
                        this.dataservice.getchapterstatus(project, val, folder, extension).subscribe(tocstatus => {
                            this.chaptersList = tocstatus;
                            this.chapterCount = this.chaptersList.length;
                            this.chaptersList[0].select = true;
                            this.dataSource = new MatTableDataSource < PeriodicElement > (this.chaptersList);
                            this.dataSource.paginator = this.paginator;
                        });
                    });
            })
        });
    }


    /**1st step to get html file  */
    getHTMLservice = async function (isSave) {
        let editableFrame = document.getElementById("editableFrame");
        let contentdocumenteditable;
        let projectstandard = localStorage.getItem('projectstandard');
        this.spinner.show();
        this.page_model.sectionArray = [];
        this.test_sectionarray = [];
        this.page_model.iframeBody = '',
            this.page_model.json = '';

        this.page_model.isRecursive = false;

        try {

            /*var iframe_test  = document.getElementById("editableFrame_test");
            var contentdocument_test = ( < HTMLIFrameElement > iframe_test).contentDocument;
            console.log(contentdocument_test.querySelectorAll('body'));
            contentdocument_test.querySelectorAll('body')[0].classList.add("pagebreak_spi_even");
            console.log(this.iframeElement_test);*/
            this.chapterDetails = JSON.parse(localStorage.getItem('chapterDetails'));
            this.startPageNumber = (this.chapterDetails.pc_startpage) ? this.chapterDetails.pc_startpage : this.startPageNumber;
            if (!isSave) {
                this.getpagebreakup(false);
            }

            this.contentDoc = this.iframeElement.nativeElement.contentDocument;
            let contentEdit;
            localStorage.getItem("editaccess") == '0' ? contentEdit = "false" : contentEdit = "true";

            this.contentDoc.body.setAttribute("contentEditable", contentEdit);
            this.contentDoc.body.setAttribute("data-gramm", false)


            if (this.page_model.sectionCount % 2 == 0)
                this.contentDoc.body.classList.add('pagebreak_spi_even')
            else
                this.contentDoc.body.classList.add('pagebreak_spi_odd')

            let responseData = await this.http.get(this.appConfig.config.apiURL + "/readfile", {
                params: {
                    'url': this.uploadURL + projectstandard + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.pc_name + '.html'
                }
            }).toPromise();

            let project_path = this.uploadURL + projectstandard + '/' + this.projectName;
            project_path = project_path.replace(new RegExp("./pod_assets/uploads/", "g"), "/pod_assets/uploads/");

            let data = await this.editorJsonService.createJSONfromHTML(responseData, this.contentDoc, false, this.appConfig.config.hostURL + project_path);

            for (let x in data) {
                await this.editorHttpService.creatJSONservice(data[x].data, this.contentDoc, data[x].fileName, this.uploadURL + projectstandard + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/');
            }
            for (let x in data) {
                if (data[x].fileName == 'editorHeadJSON') {
                    var datajson = (data[x].data) ? JSON.parse(data[x].data) : '';
                    await this.editorDomService.appendIframeHeadContent(datajson, this.contentDoc);
                   /* let tableidcss = '';
                    let formcss = '';
                    this.processpdfservice.tablesize = this.editorJsonService.tablesize;
                    for (var j = 0; j < this.editorJsonService.tableidarray.length; j++) {
                        formcss = '#' + this.editorJsonService.tableidarray[j] + ' *{padding: 1px !important;margin: 0 !important;text-indent: 0 !important;font-size:12px !important;} #' + this.editorJsonService.tableidarray[j] + ' th{ width:13%;}'; // #'+this.editorJsonService.tableidarray[j]+' td{ width:13%;}';
                        tableidcss = tableidcss + formcss;
                        formcss = '';
                    }
                    if (this.contentDoc && this.contentDoc.getElementById('tablecss')) {
                        this.contentDoc.getElementById('tablecss').remove();
                    }
                    var tablecss = document.createElement("style");
                    tablecss.innerHTML = tableidcss;
                    tablecss.id = 'tablecss';
                    this.contentDoc.head.append(tablecss);

                    let testframe = this.iframeElement_test.nativeElement.contentDocument;
                    if (testframe.getElementById('tablecss')) {
                        testframe.getElementById('tablecss').remove();
                    }
                    testframe.head.append(tablecss);*/
                } else {
                    this.page_model.json = JSON.parse(data[x].data);
                    let _data: any = '';
                    if (!this.breakupJsonStatus) {
                        this.test_contentDoc = this.iframeElement_test.nativeElement.contentDocument;
                        this.test_contentDoc.head.innerHTML = '';
                        this.test_contentDoc.body.innerHTML = '';
                        this.test_contentDoc.head.innerHTML = this.contentDoc.head.innerHTML;
                    }
                    this.page_model.sectionCount = this.saved_pageno;

                    if (!isSave) {
                        this.chapter_pagecount = 1;
                        if (!this.breakupJsonStatus) {
                            _data = await this.editorDomService.appendIframePageWiseContent(this.page_model, this.contentDoc, '',this.test_contentDoc);
                            this.test_contentDoc.body.innerHTML = this.contentDoc.body.innerHTML;
                            this.contentDoc.body.innerHTML = '';
                        }
                    } else {
                        //if(!this.breakupJsonStatus) {
                        this.test_contentDoc.body.innerHTML = this.contentDoc.body.innerHTML;
                        this.contentDoc.body.innerHTML = '';
                        _data = await this.editorDomService.appendIframePageWiseContent(this.page_model, this.test_contentDoc, '',this.test_contentDoc);
                        //}
                    }

                    if (this.test_sectionarray.length > 0) {
                        _data = {
                            sectionArray: this.test_sectionarray
                        };
                        this.page_model.sectionArray = this.test_sectionarray;
                    }

                    this.contentDoc.body.setAttribute('isbelongTo', 'page_' + this.saved_pageno);
                    if (!isSave) {
                        //if(!this.breakupJsonStatus){
                        this.contentDoc.body.innerHTML = _data.sectionArray[this.saved_pageno].outerHTML;
                        /*} else {
                        console.log(this.iframeElement_test.nativeElement.contentDocument.body.innerHTML);
                        console.log(this.iframeElement_test.nativeElement.contentDocument.body.innerHTML.firstChild);
                        }*/
                        this.contentDoc.body.onclick = this.editorDomService.mouseClickEvent;
                        this.contentDoc.body.onkeypress = this.editorDomService.onkeyPressEvent;
                        //this.contentDoc.body.onselectionchange = this.editorDomService.selectionchange;
                        // this.contentDoc.body.oncopy=this.editorDomService.copiedElement;
                        this.contentDoc.body.onpaste = this.editorDomService.pasteElement
                        // console.log(this.currentChapter.chapter_name!="remarks")
                        // console.log(this.currentChapter.chapter_name);
                        // this.chapter_pagecount=(this.currentChapter.chapter_name!="remarks")?this.contentDoc.body.querySelector('div').getAttribute("pagenum"):"";
                        //this.chapter_pagecount=(this.currentChapter.chapter_name!="remarks")?this.contentDoc.body.querySelector('div').getAttribute("pagenum"): '';
                        this.headerValue();

                        this.spinner.hide();
                    }


                    this.page_boolean_even = this.contentDoc.body.classList.contains('pagebreak_spi_odd') ? true : false;
                    this.isSave = true;
                    if (!this.breakupJsonStatus) {
                        await this.continousPagingFunction(_data);
                    }

                    if (this.break_continous) {
                        this.contentDoc.body.innerHTML = ''
                        this.page_model.sectionArray = [];
                        this.contentDoc.head.innerHTML = '';
                        this.changeHtml(this.test_toc, this.test_index)
                    } else {
                        this.page_model.sectionCount = this.saved_pageno;
                        this.button_disable = false;
                    }


                }
            }

            console.log('1st resolved')
            if (document.getElementById('editableFrame_test')) {
                let breakuphtml = this.iframeElement_test.nativeElement.contentDocument;
                let currentChapter = JSON.parse(localStorage.getItem('chapterDetails'));
                this.dataservice.createbreakuphtmlfile(currentChapter.folder, currentChapter.chapter_name, breakuphtml.head.innerHTML, breakuphtml.body.innerHTML).subscribe((res) => {}, error => {});
            }
           /* if (document.getElementById('hiddenfinalhtml') && !this.saveflag) {
                await this.processpdfservice.savefinalhtml(this.currentChapter);
            }*/

            this.createUniqIdHTML()

        } catch (error) {
            console.log(error)
        }
    }

    continousPagingFunction = async function (data) {
        if (this.isSave && (this.page_model.sectionArray[this.saved_pageno] != '' && this.page_model.sectionArray[this.saved_pageno] != undefined)) {
            //console.log(this.page_model,"page_model")
            if (this.contentDoc.body.innerHTML == '')
                this.contentDoc.body.innerHTML = this.page_model.sectionArray[this.saved_pageno].innerHTML;
            //  let section_elements = this.contentDoc.body.querySelectorAll('body > *');
            //  Array.prototype.slice.call(section_elements).map((e) => {
            //  e.addEventListener("click", this.editorDomService.mouseClickEvent);
            // })
            this.spinner.hide();
        }

        if (this.page_model.isRecursive) {

            if (this.page_model.sectionArray.length % 2 == 0) {
                this.test_contentDoc.body.classList.remove('pagebreak_spi_odd')
                this.test_contentDoc.body.classList.add('pagebreak_spi_even')
            } else {
                this.test_contentDoc.body.classList.remove('pagebreak_spi_even')
                this.test_contentDoc.body.classList.add('pagebreak_spi_odd')
            }

            let _data = await this.editorDomService.appendIframePageWiseContent(data, this.test_contentDoc, '',this.test_contentDoc);
            if (this.break_continous)
                return

            await this.continousPagingFunction(_data)
        } else {
            this.test_contentDoc.body.innerHTML = '';
            data.sectionArray.forEach((x) => {
                this.test_contentDoc.body.innerHTML += x.outerHTML;
            })
            this.changetablesize("editableFrame_test");

            if (!this.button_disable) {
                let breakuphtml = this.iframeElement_test.nativeElement.contentDocument;
                let prev = this.previous_chapterDetails;
                this.dataservice.createbreakuphtmlfile(prev.folder, prev.chapter_name, breakuphtml.head.innerHTML, breakuphtml.body.innerHTML).subscribe((res) => {}, error => {});
            }

            console.log('completed')
        }

        new Promise((resolve, reject) => {
            resolve(true)
        })
    }

    continousPagingFunctionNew = async function (data) {
        if (this.isSave && (this.page_model.sectionArray[this.saved_pageno] != '' && this.page_model.sectionArray[this.saved_pageno] != undefined)) {
            //console.log(this.page_model,"page_model")
            if (this.contentDoc.body.innerHTML == '')
                this.contentDoc.body.innerHTML = this.page_model.sectionArray[this.saved_pageno].innerHTML;
            this.spinner.hide();
        }

        if (this.page_model.isRecursive) {

            if (this.page_model.sectionArray.length % 2 == 0) {
                this.test_contentDoc.body.classList.remove('pagebreak_spi_odd')
                this.test_contentDoc.body.classList.add('pagebreak_spi_even')
            } else {
                this.test_contentDoc.body.classList.remove('pagebreak_spi_even')
                this.test_contentDoc.body.classList.add('pagebreak_spi_odd')
            }

            let _data = await this.editorDomService.appendIframePageWiseContentNew(data, this.test_contentDoc, '',this.test_contentDoc);
            if (this.break_continous)
                return

            await this.continousPagingFunctionNew(_data)
        } else {
            this.test_contentDoc.body.innerHTML = '';
            data.sectionArray.forEach((x) => {
                this.test_contentDoc.body.innerHTML += x.outerHTML;
            })
            this.changetablesize("editableFrame_test");

            if (!this.button_disable) {
                let breakuphtml = this.iframeElement_test.nativeElement.contentDocument;
                let prev = this.previous_chapterDetails;
                this.dataservice.createbreakuphtmlfile(prev.folder, prev.chapter_name, breakuphtml.head.innerHTML, breakuphtml.body.innerHTML).subscribe((res) => {}, error => {});
            }

            console.log('completed')
        }

        new Promise((resolve, reject) => {
            resolve(true)
        })
    }

    /** function to create mock html in test iframe */
    createUniqIdHTML = async function () {
        this.test_contentDoc = this.iframeElement_test.nativeElement.contentDocument;
        // try {
        //  this.test_contentDoc_head = this.test_contentDoc.head.innerHTML;
        //  this.test_contentDoc_body = this.test_contentDoc.body.innerHTML;
        //  this.test_contentDoc.body.innerHTML = '';
        //  this.test_contentDoc.head.innerHTML = '';
        //  let data: any = [{
        //      fileName: 'editorHeadJSON'
        //  }, {
        //      fileName: 'editorBodyJSON'
        //  }];
        //  for (let x in data) {
        //      data[x].data = await this.http.get(this.appConfig.config.apiURL + "/readfile", {
        //          params: {
        //              'url': this.uploadURL + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + data[x].fileName + ".json"
        //          }
        //      }).toPromise();
        //  }

        //  for (let x in data) {
        //      if (data[x].fileName == 'editorBodyJSON') {
        //          let test_data: any = {
        //              json: ''
        //          }
        //          test_data.json = JSON.parse(data[x].data)
        //          await this.editorSaveService.appendIframePageWiseContent(test_data, this.test_contentDoc, '', true, true)
        //      } else {
        //          await this.editorSaveService.appendIframeHeadContent(JSON.parse(data[x].data), this.test_contentDoc, true)
        //      }
        //  }
        let headdata = this.test_contentDoc.head.innerHTML;
        let bodydata = this.test_contentDoc.body.innerHTML;
        headdata = headdata.replace(new RegExp("../.././pod_assets/uploads/iframe.css", "g"), "../../../../iframe.css");
        headdata = headdata.replace(new RegExp(window.location.protocol+'//'+environment.pod_port+'/pod_assets/uploads/', "g"), "../../../../");
        bodydata = bodydata.replace(new RegExp(window.location.protocol+'//'+environment.pod_port+"/pod_assets/uploads/" + localStorage.getItem('projectstandard') + "/" + this.projectName + "/img/", "g"), "../../img/");
        await this.editorHttpService.createHtml({
            head: htmlEncode(headdata),
            body: htmlEncode(bodydata),
            url: this.uploadURL + localStorage.getItem('projectstandard') + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.chapter_name+'_print.html'
        });
        //  this.enable_icon = true;
        //  this.test_contentDoc.body.innerHTML = '';
        //  this.test_contentDoc.head.innerHTML = '';
        //  this.test_contentDoc.head.innerHTML = this.test_contentDoc_head;
        //  this.test_contentDoc.body.innerHTML = this.test_contentDoc_body;
        //  // this.spinner.hide();
        // } catch (error) {
        //  console.log(error)
        // }
    }


    
    /**page navigation */
    page_boolean_even: boolean = true;
    pageNavigation = async function (state) {
        this.isSave = false;
        this.editorDomService.eventArray && this.editorDomService.eventArray.map((elem) => {
            if (elem && elem.target.style) {
                elem.target.style.border = "";
                elem.target.style.boxShadow = "";
                elem.target.style.padding = ""
                elem.target.style.borderRadius = ""
            }
            if (elem && elem.target && elem.target.parentNode && elem.target.parentNode.style) {
                elem.target.parentNode.style.border = "";
                elem.target.parentNode.style.boxShadow = "";
                elem.target.parentNode.style.padding = ""
                elem.target.parentNode.style.borderRadius = ""
            }
            if (elem && elem.target && elem.target.parentNode && elem.target.parentNode.parentNode && elem.target.parentNode.parentNode.style) {
                elem.target.parentNode.parentNode.style.border = "";
                elem.target.parentNode.parentNode.style.border = "";
                elem.target.parentNode.parentNode.style.boxShadow = "";
                elem.target.parentNode.parentNode.style.padding = ""
                elem.target.parentNode.parentNode.style.borderRadius = ""
            }
        })

        if (this.editorDomService.newLineElement.length > 1) {
            for (var e of this.editorDomService.newLineElement) {
                e.style.border = "";
                e.style.boxShadow = "";
                e.style.padding = "";
                e.style.borderRadius = "";
            }
        }


        let breakElem = [];

        if (this.editorDomService.parentSection.length > 0) {
            for (var i = 0; i < this.editorDomService.parentSection.length; i++) {
                breakElem.push(this.editorDomService.parentSection[i]);
            }
        }

        breakElem.forEach(function (x) {
            if (x.parentNode != null) {
                if (x.parentNode.textContent == null || x.parentNode.textContent == "") {
                    x.parentNode.remove();
                }
            }
        });

        let editorSlide = document.getElementById("editor_newframe");
        if (editorSlide) {
            editorSlide.style.display = 'none';
        }
        let editorSlidetable = document.getElementById("editor_newframe_table");
        if (editorSlidetable) {
            editorSlidetable.style.display = 'none';
        }

        let editorSlideimage = document.getElementById("editor_newframe_image");
        if (editorSlideimage) {
            editorSlideimage.style.display = 'none';
        }

        let editorSlidemath = document.getElementById("matheditor_container");
        if (editorSlidemath) {
            editorSlidemath.style.display = 'none';
        }


        let _Id = this.contentDoc.body.hasAttribute('isbelongTo') ? JSON.parse(this.contentDoc.body.getAttribute('isbelongTo').split('_')[1]) : '';
        this.page_model.sectionArray[_Id].innerHTML = this.contentDoc.body.innerHTML;

        this.asideVisible = !this.asideVisible;
        if (state == 'next' && (_Id <= this.page_model.sectionArray.length - 1)) {

            _Id++;
            if (_Id == 1)
                this.chapter_pagecount = _Id;


            if (!this.page_model.isRecursive && (_Id == this.page_model.sectionArray.length - 1)) {
                this.isPageFirst = false;
            }

            if (!this.page_model.isRecursive && (_Id > this.page_model.sectionArray.length - 1))
                return

            this.spinner.show();


            if (this.page_model.sectionArray[_Id] != '' && this.page_model.sectionArray[_Id] != undefined) {
                if (_Id % 2 == 0) {
                    this.contentDoc.body.classList.remove('pagebreak_spi_odd')
                    this.contentDoc.body.classList.add('pagebreak_spi_even')
                    this.page_boolean_even = false;
                } else {
                    this.contentDoc.body.classList.remove('pagebreak_spi_even')
                    this.contentDoc.body.classList.add('pagebreak_spi_odd')
                    this.page_boolean_even = true;
                }

                this.page_model.sectionCount = _Id
                this.contentDoc.body.innerHTML = '';
                // this.contentDoc.body.onclick = this.editorDomService.mouseClickEvent;
                this.contentDoc.body.innerHTML = this.page_model.sectionArray[_Id].innerHTML;
                this.contentDoc.body.setAttribute('isbelongTo', 'page_' + _Id);
                //this.button_disable=false;
                this.chapter_pagecount++;
                this.jumppage = this.chapter_pagecount;
                this.isShowPageTitle = this.chapter_pagecount === 1 ? true : false;
                this.changetablesize("editableFrame");
                //this.page_model.sectionArray[_Id].innerHTML = this.contentDoc.body.innerHTML;
            } else {
                this._snackBar.open('PAGES ARE STILL IN PROGRESS', '', {
                    duration: 3000
                })
            }

        } else if (state == 'previous' && _Id > 0) {

            this.spinner.show();
            _Id--;


            if (this.page_model.sectionArray[_Id] != '' && this.page_model.sectionArray[_Id] != undefined) {
                if (_Id % 2 == 0) {
                    this.contentDoc.body.classList.remove('pagebreak_spi_odd')
                    this.contentDoc.body.classList.add('pagebreak_spi_even')
                    this.page_boolean_even = false;
                } else {
                    this.contentDoc.body.classList.remove('pagebreak_spi_even')
                    this.contentDoc.body.classList.add('pagebreak_spi_odd')
                    this.page_boolean_even = true;
                }
                this.contentDoc.body.innerHTML = '';
                this.page_model.sectionCount = _Id
                // this.contentDoc.body.onclick = this.editorDomService.mouseClickEvent;
                this.contentDoc.body.innerHTML = this.page_model.sectionArray[_Id].innerHTML;
                this.contentDoc.body.setAttribute('isbelongTo', 'page_' + _Id);
                this.chapter_pagecount--;
                this.jumppage = this.chapter_pagecount;
                this.isShowPageTitle = this.chapter_pagecount === 1 ? true : false;
                //this.button_disable=false;
                this.isPageFirst = true;
                console.log(this.isPageFirst);
            }
        } else if (state == 'gopage' && this.jumppage <= this.page_model.sectionArray.length) {
            this.jumppage = parseInt(this.jumppage)
            let jumppage = this.jumppage - 1;
            console.log(jumppage + '-----' + this.page_model.sectionArray.length);
            if (!this.page_model.isRecursive && (jumppage == this.page_model.sectionArray.length - 1)) {
                this.isPageFirst = false;
            } else {
                this.isPageFirst = true;
            }

            if (!this.page_model.isRecursive && (jumppage > this.page_model.sectionArray.length))
                return

            this.spinner.show();


            if (this.page_model.sectionArray[jumppage] != '' && this.page_model.sectionArray[jumppage] != undefined) {
                if (jumppage % 2 == 0) {
                    this.contentDoc.body.classList.remove('pagebreak_spi_odd')
                    this.contentDoc.body.classList.add('pagebreak_spi_even')
                    this.page_boolean_even = false;
                } else {
                    this.contentDoc.body.classList.remove('pagebreak_spi_even')
                    this.contentDoc.body.classList.add('pagebreak_spi_odd')
                    this.page_boolean_even = true;
                }

                this.page_model.sectionCount = jumppage
                this.contentDoc.body.innerHTML = '';
                // this.contentDoc.body.onclick = this.editorDomService.mouseClickEvent;
                this.contentDoc.body.innerHTML = this.page_model.sectionArray[jumppage].innerHTML;
                this.contentDoc.body.setAttribute('isbelongTo', 'page_' + jumppage);
                //this.button_disable=false;
                this.chapter_pagecount = this.jumppage;
                this.isShowPageTitle = this.jumppage === 1 ? true : false;
                this.changetablesize("editableFrame");
                this.page_model.sectionArray[jumppage].innerHTML = this.contentDoc.body.innerHTML;
                //  this.isPageFirst = (this.jumppage > 1) ? false : true;
            } else {
                this._snackBar.open('PAGES ARE STILL IN PROGRESS', '', {
                    duration: 3000
                })
            }
        }


        this.spinner.hide();
    }
    checkNode = function (node) {
        if (node.nodeType === 8 || node.nodeName.toLowerCase() == '#comment') {
            node.remove();
        } else if (node.parentNode.nodeType === 1) {
            return this.checkNode(node.parentNode);
        }

        return false;
    }


    /** function on save */
    onSaveHtml = async function (pdf) {
        this.saveflag = true;
        this.spinner.show();
        this.eventArrayHandler();
        this.test_contentDoc = this.iframeElement_test.nativeElement.contentDocument;

        let projectstandard = localStorage.getItem('projectstandard');
        let editorSlide = document.getElementById("editor_newframe");
        if (editorSlide) {
            editorSlide.style.display = 'none';
        }
        let editorSlidetable = document.getElementById("editor_newframe_table");
        if (editorSlidetable) {
            editorSlidetable.style.display = 'none';
        }

        let editorSlideimage = document.getElementById("editor_newframe_image");
        if (editorSlideimage) {
            editorSlideimage.style.display = 'none';
        }

        let editorSlidemath = document.getElementById("matheditor_container");
        if (editorSlidemath) {
            editorSlidemath.style.display = 'none';
        }
        let currentChapter = JSON.parse(localStorage.getItem('chapterDetails'));
        this.breakupJsonStatus = 0;
        this.dataservice.savebreakup(currentChapter.folder, currentChapter.chapter_name).subscribe((res) => {}, error => {});
        this.test_contentDoc.body.innerHTML = '';
        this.saved_pageno = this.contentDoc.body.hasAttribute('isbelongTo') ? JSON.parse(this.contentDoc.body.getAttribute('isbelongTo').split('_')[1]) : '';

        this.page_model.sectionArray.forEach((x) => {
            if (x.getAttribute('id').split('_')[1] == this.contentDoc.body.getAttribute('isbelongTo').split('_')[1]) {
                this.test_contentDoc.body.innerHTML += this.contentDoc.body.innerHTML;
            } else {
                this.test_contentDoc.body.innerHTML += x.innerHTML
            }
        })
        this.button_disable = true;
        let data = await this.editorJsonService.createSaveJSON(this.test_contentDoc.body);
        this.page_model.newData = data;
        await this.editorSaveService.appendIframePageWiseContent(this.page_model, this.contentDoc, '', '')
        let project_path = this.uploadURL + projectstandard + '/' + this.projectName;
        project_path = project_path.replace(new RegExp("./pod_assets/uploads/", "g"), "/pod_assets/uploads/");
        let modified_data = await this.editorJsonService.createJSONfromHTML(this.contentDoc.childNodes[0].innerHTML, this.test_contentDoc, true, this.appConfig.config.hostURL + project_path);
        await this.resetJSONHTML(modified_data);
        this.getHTMLservice(true);

        // console.log('data',data)

        // this.button_disable = true;
        // this.saved_pageno = this.contentDoc.body.hasAttribute('isbelongTo') ? JSON.parse(this.contentDoc.body.getAttribute('isbelongTo').split('_')[1]) : '';
        // this.page_model.sectionCount = 0;
        // this.spinner.show();
        // let url = this.uploadURL + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + 'editorUniqID.html';

        // let belongs_to: any = this.contentDoc.body.getAttribute('isbelongTo').split('_')[1];
        // this.page_model.sectionArray.forEach((x) => {
        //  if (x.getAttribute('id').split('_')[1] == this.contentDoc.body.getAttribute('isbelongTo').split('_')[1]) {
        //      while (x.firstChild) {
        //          x.removeChild(x.firstChild);
        //      }
        //      x.innerHTML = this.contentDoc.body.innerHTML;
        //  }
        // })

        // let responseData = await this.editorSaveService.mappingContent(this.contentDoc.body, this.test_contentDoc, this.contentDoc, url, this.page_model, pdf);
        // let project_path = this.uploadURL + this.projectName;
        // project_path = project_path.replace(new RegExp("../pod_assets/uploads/", "g"), "/pod_assets/uploads/");
        // let data = await this.editorJsonService.createJSONfromHTML(responseData.childNodes[0].innerHTML, this.test_contentDoc, true, this.appConfig.config.hostURL + project_path);
        // if (!pdf) {
        //  await this.resetJSONHTML(data);
        //  this.getHTMLservice(true);
        // } else {
        //  return new Promise((resolve, reject) => {
        //      resolve(data)
        //  })
        // }

    }

    resetJSONHTML = async function (data) {
        try {
            for (let x in data) {
                if (data[x].fileName == 'editorBodyJSON') {
                    let test_data: any = {
                        newData: ''
                    }
                    test_data.newData = data[x].data
                    await this.editorSaveService.appendIframePageWiseContent(test_data, this.test_contentDoc, '', true, true)
                } else {
                    await this.editorSaveService.appendIframeHeadContent(data[x].data, this.test_contentDoc, true)
                }
            }

            let test_headdata = this.test_contentDoc.head.innerHTML;
                test_headdata = test_headdata.replace(new RegExp(window.location.protocol+'//'+environment.pod_port+"/pod_assets/uploads/" + localStorage.getItem('projectstandard') + "/" + this.projectName + "/assets/", "g"), "../../assets/");
            test_headdata = test_headdata.replace(new RegExp("../.././pod_assets/uploads/iframe.css", "g"), "../../../../iframe.css");

            this.test_contentDoc.body.innerHTML = this.test_contentDoc.body.innerHTML.replace(new RegExp(window.location.protocol+'//'+environment.pod_port+"/pod_assets/uploads/" + localStorage.getItem('projectstandard') + "/" + this.projectName, "g"), "../..");

            await this.editorHttpService.createHtml({
                head: htmlEncode(test_headdata),
                body: htmlEncode(this.test_contentDoc.body.innerHTML),
                url: this.uploadURL + localStorage.getItem('projectstandard') + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.pc_name + '.html'
            });
            await this.editorHttpService.createHtml({
                head: htmlEncode(this.test_contentDoc.head.innerHTML),
                body: htmlEncode(this.test_contentDoc.body.innerHTML),
                url: this.uploadURL + localStorage.getItem('projectstandard') + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + 'editorUniqID.html'
            });
            return new Promise((resolve, reject) => {
                resolve('')
            })
        } catch (error) {
            console.log(error)
        }
    }


    generatePDF = async function () {
        this.pdfunderprocess = true;
        this.spinner.show();
        //let data = await this.onSaveHtml(true);
        //await this.appendBreakCondition(this.test_contentDoc);
        this.test_contentDoc.body.innerHTML = '';
        this.page_model.sectionArray.forEach((x) => {
            x.classList.add('break_condition')
            this.test_contentDoc.body.innerHTML += x.outerHTML;
        })
        // let test_data = this.test_contentDoc.body.querySelectorAll('[class=dynamicSection]')
        // test_data.forEach((x)=>{
        //  x.classList.add('break_condition')
        // })
        // await this.appendBreakCondition(this.test_contentDoc);
        /*console.log(typeof(this.test_contentDoc.head.innerHTML));
        var testhead = this.test_contentDoc.head.innerHTML;
        await this.editorHttpService.createHtml({
        head: htmlEncode(this.test_contentDoc.head.innerHTML),
        body: htmlEncode(this.test_contentDoc.body.innerHTML),
        url: this.uploadURL + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.pc_name + '.html'
        });*/
        await this.processpdfservice.test_generatePDF(this.currentChapter, 0);
        this.spinner.hide();
    }
    appendBreakCondition = async function (saveElement) {
        try {


            let array_Id: any = [];
            this.page_model.sectionArray.forEach((x) => {
                // array_Id.push(x.querySelector('[break=break_condition]'))
                array_Id.push(Array.from(x.querySelectorAll('*')).slice(-1).pop())
            })
            array_Id.forEach((x) => {
                let _Id = x.getAttribute('uniqid');
                saveElement.body.querySelector('[uniqid="' + _Id + '"]').classList.add('break_condition')
            })
            return new Promise((resolve, reject) => {
                resolve('')
            })

        } catch (err) {
            if (err)
                throw err
        }
    }
    /**
     * Menu side bar navigation function
     */
    test_toc: any = '';
    test_index: any = '';
    changeHtml_test = function (toc, index) {

        this.isPageFirst = true;
        this.jumppage = 1;
        let editorSlide = document.getElementById("editor_newframe");
        if (editorSlide) {
            editorSlide.style.display = 'none';
        }
        let editorSlidetable = document.getElementById("editor_newframe_table");
        if (editorSlidetable) {
            editorSlidetable.style.display = 'none';
        }

        let editorSlideimage = document.getElementById("editor_newframe_image");
        if (editorSlideimage) {
            editorSlideimage.style.display = 'none';
        }

        let editorSlidemath = document.getElementById("matheditor_container");
        if (editorSlidemath) {
            editorSlidemath.style.display = 'none';
        }
        this.test_toc = toc;
        this.test_index = index;

        this.break_continous = true;
        if (this.currentChapter.chapter_name == toc.chapter_name) {
            this.activatedRoute.params.subscribe(params => {
                new Promise((resolve, reject) => {
                    this.getProjectDetails(params, resolve);
                })
            });
        }
        //if(!this.button_disable){
        this.changeHtml(toc, index)
        //}

    }

    changeHtml = async function (toc, index) {
        // this.index=index;
        this.break_continous = false;
        this.button_disable = true;

        this.firstload += 1;
        let obj = this.routePath;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                'chaptername': toc.chapter_name,
                'pageno': this.pageVariable
            },
            skipLocationChange: true,
            replaceUrl: true
        };
        this.pageVariable = 1;

        this.selectedToc = toc;

        this.spinner.show();


        localStorage.setItem('chapterDetails', JSON.stringify(toc));
        this.chapterDetails = JSON.parse(localStorage.getItem('chapterDetails'));
        this.currentChapter = JSON.parse(localStorage.getItem('chapterDetails'));
        this.previous_chapterDetails = this.chapterDetails;
        localStorage.setItem('chapterid', toc.pc_id);
        this.chaptersList.forEach(function (value) {
            if (value.chapter_name == toc.chapter_name) {
                value.select = true;
            } else {
                value.select = false;
            }
        });
        // console.log(this.page_model);
        if (toc.pc_status == 0) {
            this.poptipOpen().then((result: any) => {
                if (result != `data`) {
                    this.pgno = result["page_number"];
                    this.pop_tip = result["poptip_c"];
                    this.twocolumn = result["twocolumn"];
                    this.processpdfservice.generateHtml(toc, index, this.pgno, this.pop_tip, this.twocolumn).subscribe(
                        data => {
                            this.tocdetails = data;
                            toc.html = true;
                            this.saved_pageno = 0;
                            this.getHTMLservice(false);
                        })
                } else {
                    this.onloadChapter();
                }
            });


        } else if (toc.pc_status == 1 || toc.pc_status == 2) {
            this.getpagebreakup(true);
            //this.getHTMLservice(false);
        }
    }

    getpagebreakup = function (callhtml) {
        this.dataservice.checkbreakuphtmlfile(this.chapterDetails.folder, this.chapterDetails.chapter_name).subscribe((response) => {
            let brkres = response.json();
            this.breakupJsonStatus = (brkres.length > 0) ? brkres[0].pc_breakup : '';
            localStorage.setItem('breakuphtml', this.breakupJsonStatus);
            if (this.breakupJsonStatus) {
                this.dataservice.readbreakuphtmlfile(this.chapterDetails.folder, this.chapterDetails.chapter_name).subscribe((responsehtml) => {
                    let res = responsehtml.json();
                    let responsehead = (res.head).replace(/\\/g, "");
                    let responsebody = (res.body).replace(/\\/g, "");
                    this.iframeElement_test.nativeElement.contentDocument.head.innerHTML = responsehead;
                    this.iframeElement_test.nativeElement.contentDocument.body.innerHTML = responsebody;
                    //this.iframeElement.nativeElement.contentDocument.body.innerHTML = 'hello';
                    let htmlCollection = [this.iframeElement_test.nativeElement.contentDocument.body][0].children
                    this.test_sectionarray = [].slice.call(htmlCollection);
                    this.saved_pageno = 0;
                }, error => {});
            } /*else { }*/
            if (callhtml) {
                this.getHTMLservice(false);
            }
        }, error => {});
    }


    /***copy */
    getContentList = function (content, type) {
        return new Promise((resolve, reject) => {
            this.tocContent = this.sanitizer.bypassSecurityTrustHtml(content);
            var elem = document.getElementById("tocContentHide");
            var contentsList;
            if (type == "epub") {
                contentsList = window.document.getElementsByTagName("content");
            } else {
                contentsList = window.document.getElementsByTagName("exhibit");
            }
            setTimeout(() => {
                resolve(contentsList);
            }, 100);
        });
    }

    getProjectDetails = async function (project, resolve) {
        this.project_id = project.id;

        await this.dataservice.getProjectData(project).subscribe(data => {
            let response = JSON.parse(data);

            let extension = response.project_type;
            let folder = response.project_name;
            this.projectName = folder;
            this.dataservice.getTocData(folder, extension).subscribe(toc => {

                this.getContentList(toc, extension).then(val => {

                    this.dataservice.getstandard(project, val, folder, extension).subscribe(standard => {
                        this.projectstandard = standard.json().standard;
                        localStorage.setItem('projectstandard', this.projectstandard);

                        this.dataservice.getchapterstatus(project, val, folder, extension).subscribe(tocstatus => {

                            localStorage.setItem('tocstatus', JSON.stringify(tocstatus));
                            this.chaptersList = tocstatus;
                            this.chapterCount = this.chaptersList.length;
                            this.dataSource = new MatTableDataSource < PeriodicElement > (this.chaptersList);
                            this.dataSource.paginator = this.paginator;
                            this.chapterDetails = JSON.parse(localStorage.getItem('chapterDetails'));
                            let arr = [],
                                ival;
                            // console.log(this.chapterDetails,this.currentChapter);
                            if (this.chapterDetails && this.chapterDetails.chapter_name != "" && typeof this.chapterDetails.chapter_name != "undefined") {

                                this.chaptersList.forEach((value, index) => {

                                    if (value.chapter_name == this.chapterDetails.chapter_name) {
                                        value.select = true;
                                        arr = value;
                                        ival = this.test_index = index;
                                        this.test_toc = value;
                                        this.currentChapter = value;
                                        if (value.pc_status == 0) {
                                            this.chapterDetails = '', this.currentChapter = ''
                                            let keyToremove = ["chapterDetails", "tocstatus", "chapterid"];
                                            keyToremove.forEach(k => localStorage.removeItem(k));
                                            this.onloadChapter();
                                        }

                                        localStorage.setItem('chapterid', value.pc_id);
                                        localStorage.setItem('convert_count', value.convert_count);
                                    }
                                });
                                // console.log(this.chapterDetails);
                                this.pdfSrc = this.uploadURL + this.chapterDetails.folder + "/s9ml/" + this.chapterDetails.chapter_name + "/" + this.chapterDetails.chapter_name + ".pdf";
                                //   this.editorservice.sendToc(arr);
                                this.selectedToc = arr;

                                // this.spinner.hide();
                                //   this.showEditor(this.currentChapter,ival);
                            } else {
                                let currentChapter = _.where(tocstatus, {
                                    'pc_status': 1
                                });
                                if (currentChapter && currentChapter.length) {
                                    this.currentChapter = currentChapter[0];

                                    this.indexval = ival;
                                    // this.spinner.hide();
                                    resolve('completed')
                                } else {
                                    this.currentChapter = this.chaptersList[0];
                                    // alert("Pdf is not available!");
                                }


                                this.currentChapter.select = true;
                                ival = 0;
                                this.pdfSrc = this.uploadURL + this.currentChapter.folder + "/s9ml/" + this.currentChapter.chapter_name + "/" + this.currentChapter.chapter_name + ".pdf";
                                //   this.editorservice.sendToc(this.currentChapter);
                                this.selectedToc = this.currentChapter;
                                // localStorage.setItem('chapterDetails', JSON.stringify(toc));
                                // this.chapterDetails = JSON.parse(localStorage.getItem('chapterDetails'));
                                // console.log(this.currentChapter);
                                localStorage.setItem('chapterDetails', JSON.stringify(this.currentChapter));
                                this.chapterDetails = this.currentChapter;
                                this.previous_chapterDetails = this.chapterDetails;

                                localStorage.setItem('chapterid', this.currentChapter.pc_id);
                                localStorage.setItem('convert_count', this.currentChapter.convert_count);

                                //setTimeout(() => {
                                // this.viewer = false;
                                // this.showEditor(this.currentChapter,ival)
                                //}, 2000);
                                this.indexval = ival;
                                this.spinner.hide();
                                if (currentChapter.length > 0) {
                                    resolve('completed')
                                } else {
                                    resolve('completed')
                                    //tocstatus[0].startPageNumber = 1;
                                    //Popup to select page no and poptip in initial chapter
                                    //this.changeHtml(this.currentChapter, 0);
                                    // this.processpdfservice.generateHtml(tocstatus[0], 0, 1, true, false).subscribe(
                                    //  data => {
                                    //      this.tocdetails = data;
                                    //      // toc.html=true;
                                    //      this.getHTMLservice(false);
                                    //      // 
                                    //  })
                                }
                            }

                        });
                    });
                });
            });


        });
    }

    textFormat(type, status, listType) {
        var tag;
        let formatType = type.toUpperCase();
        //const contentWindow = this.editorFramewindow.contentWindow;
        const contentWindow = this.iframeElement.nativeElement.contentWindow;

        if (contentWindow.getSelection) {
            this.selectedElement = contentWindow.getSelection().toString();
            var selection = contentWindow.getSelection();
            var range = selection.getRangeAt(0);
            if (formatType == "BOLD") {
                this.actionBold = status == true ? false : true;
                contentWindow.document.execCommand('bold', false, null);
            } else if (formatType == "BLOCK") {
                this.actionBlock = status == true ? false : true;
                contentWindow.document.execCommand('formatBlock', false, 'div');
            } else if (formatType == "P") {
                this.actionP = status == true ? false : true;
                contentWindow.document.execCommand('formatBlock', false, 'p');
            } else if (formatType == "ITALIC") {
                this.actionItalic = status == true ? false : true;
                contentWindow.document.execCommand('italic', false, null);
            } else if (formatType == "UNDERLINE") {
                this.actionUnderline = status == true ? false : true;
                contentWindow.document.execCommand('underline', false, null);
            } else if (formatType == "STRIKE") {
                this.actionStrike = status == true ? false : true;
                contentWindow.document.execCommand('strikeThrough', false, null);
            } else if (formatType == "SUPERSCRIPT") {
                this.actionSuper = status == true ? false : true;
                contentWindow.document.execCommand('superscript', false, null);
            } else if (formatType == "SUBSCRIPT") {
                this.actionSub = status == true ? false : true;
                contentWindow.document.execCommand('subscript', false, null);
            } else if (formatType == "H1") {
                this.actionH1 = status == true ? false : true;
                var highlight = contentWindow.getSelection().getRangeAt(0).toString();
                contentWindow.document.execCommand('insertHTML', false, "<h1>" + highlight + "</h1>");
            } else if (formatType == "H2") {
                this.actionH2 = status == true ? false : true;
                var highlight = contentWindow.getSelection().getRangeAt(0).toString();
                contentWindow.document.execCommand('insertHTML', false, "<h2>" + highlight + "</h2>");
            } else if (formatType == "CREATELINK") {
                this.actionCreateLink = status == true ? false : true;

                // this.dialogRef = this.dialog.open(modelDialogComponent,{
                //  height: '200px',
                //  width: '400px',
                //  data: {page:"createlink",createlink:window.location.protocol}
                // });
                //   this.dialogRef.afterClosed().subscribe(result => {
                //  if(result.status == "save"){
                //      this.createlink = result.createlink;
                //      if(this.createlink != ""){
                //          var highlight = contentWindow.getSelection().getRangeAt(0).toString();
                //          contentWindow.document.execCommand('insertHTML', false,'<a href="' + this.createlink + '" target="_blank">' + highlight + '</a>');
                //      }

                //  }

                //   });


            } else if (formatType === 'RIHGTALLIGN') {
                this.rightAllign = status == true ? false : true;
                contentWindow.document.execCommand("JustifyRight", false, "");
            } else if (formatType === 'LEFTALLIGN') {
                this.leftAllign = status == true ? false : true;
                contentWindow.document.execCommand("justifyLeft", false, "");
            } else if (formatType === 'CENTERALLIGN') {
                this.centerAllign = status == true ? false : true;
                contentWindow.document.execCommand("justifyCenter", false, "");
            } else if (formatType === 'FORECOLOR') {
                this.foreColor = status == true ? false : true;
                this.colorPicker = !this.colorPicker;
                // contentWindow.document.execCommand("ForeColor", false, "red");
            } else if (formatType == "UNLINK") {
                this.actionUnLink = status == true ? false : true;
                contentWindow.document.execCommand('unlink', false, false);
            } else if (formatType == "INDENT") {
                this.actionIndent = status == true ? false : true;
                contentWindow.document.execCommand('indent', false, null);
            } else if (formatType == "ORDEREDLIST") {
                this.actionOl = status == true ? false : true;
                var highlight = contentWindow.getSelection().getRangeAt(0).toString();
                var parentChild = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.offsetParent.localName;
                var closestOl = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.closest('ol');
                if (closestOl && closestOl.tagName.toLowerCase() === 'ol') {
                    switch (listType) {
                        case 'A':
                            {
                                closestOl.setAttribute('style', "list-style-type: upper-alpha");
                                break;
                            }
                        case 'a':
                            {
                                closestOl.setAttribute('style', "list-style-type: lower-alpha");
                                break;
                            }
                        case '1':
                            {
                                closestOl.setAttribute('style', "list-style-type: decimal");
                                break;
                            }
                    }
                } else {
                    if (parentChild == "ol" || parentChild == "ul") {
                        var node = document.createElement("LI"); // Create a <li> node
                        var textnode = document.createTextNode(highlight); // Create a text node
                        node.appendChild(textnode);
                        contentWindow.document.execCommand('delete'); // Delete the highlighted text
                        contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.offsetParent.appendChild(node);
                    } else {
                        contentWindow.document.execCommand('insertorderedlist', false, null);
                    }
                }
            }
            else if (formatType == "TWOCOLUMN") {
                
                var closestOl = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer;
                var col_class = "mhhe-pod--eoc-2col-list";
                
                if (closestOl && closestOl.tagName && (closestOl.tagName.toLowerCase() === 'ol' || closestOl.tagName.toLowerCase() === 'ul')) {
                    
                        this.actionTC = status == true ? false : true;
                       
                if(this.actionTC){
                    if(closestOl.classList.contains("mhhe-pod--eoc-3col-list")){
                        closestOl.classList.remove("mhhe-pod--eoc-3col-list");
                    }
                    closestOl.classList.add(col_class);
                    this.actionTHC = false;
                } else {
                    closestOl.classList.remove(col_class);
                }
            }
            }
            else if (formatType == "THREECOLUMN") {
                
                var closestOl = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer;
                var col_class = "mhhe-pod--eoc-3col-list";
                
                if (closestOl && closestOl.tagName && (closestOl.tagName.toLowerCase() === 'ol' || closestOl.tagName.toLowerCase() === 'ul')) {
                    
                        this.actionTHC = status == true ? false : true;
                       
                if(this.actionTHC){
                    if(closestOl.classList.contains("mhhe-pod--eoc-2col-list")){
                        closestOl.classList.remove("mhhe-pod--eoc-2col-list");
                    }
                    closestOl.classList.add(col_class);
                    this.actionTC = false;
                } else {
                    closestOl.classList.remove(col_class);
                }
            }
            }
            // else if (formatType == "ORDEREDLISTTYPEA") {
            //  this.actionOl = status == true ? false : true;
            //  var highlight = contentWindow.getSelection().getRangeAt(0).toString();
            //  var parentChild = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.offsetParent.localName;
            //  var closestOl = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.closest('ol');
            //  if(closestOl.tagName.toLowerCase() === 'ol') {
            //      closestOl.setAttribute('style', "list-style-type: lower-alpha")
            //  // if (parentChild == "ol" || parentChild == "ul") {
            //      // closestOl.setAttribute('type', 'A');
            //      // var node = document.createElement("LI"); // Create a <li> node
            //      // var textnode = document.createTextNode(highlight); // Create a text node
            //      // node.appendChild(textnode);
            //      // contentWindow.document.execCommand('delete'); // Delete the highlighted text
            //      // contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.offsetParent.appendChild(node);
            //  } else {
            //      contentWindow.document.execCommand('insertorderedlist', false, null);
            //  }
            // }
            else if (formatType == "UNORDEREDLIST") {
                this.actionUl = status == true ? false : true;
                var highlight = contentWindow.getSelection().getRangeAt(0).toString();
                var parentChild = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.offsetParent.localName;
                if (parentChild == "ol" || parentChild == "ul") {
                    var node = document.createElement("LI"); // Create a <li> node
                    var textnode = document.createTextNode(highlight); // Create a text node
                    node.appendChild(textnode);
                    contentWindow.document.execCommand('delete'); // Delete the highlighted text
                    contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.offsetParent.appendChild(node);

                } else {
                    contentWindow.document.execCommand('insertUnorderedList', false, null);
                }
            } else if (formatType == "INSERTHTML") {
                var highlight = contentWindow.getSelection().getRangeAt(0).toString();
                var lengthHighlight = contentWindow.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.attributes;

                if (lengthHighlight.length == 1 && (lengthHighlight[0].ownerElement.localName == "span" && lengthHighlight[0].ownerElement.className == "page-break")) {
                    contentWindow.document.execCommand('insertHTML', false, '<span>' + highlight + '</span>');
                } else {
                    contentWindow.document.execCommand('insertHTML', false, '<span class="page-break">' + highlight + '</span>');
                }

                this.actionPageBreak = status == true ? false : true;
            } else if (formatType == "STYLE") {
                this.actionStyle = status == true ? false : true;
                document.getElementById('styleEditor').style.display = 'inline';
            }  else if (formatType == "FLOATLEFT") {
                this.actionfloatLeft = status == true ? false : true;
                 if(this.actionfloatLeft){
                    this.lineheightElement.style.cssText = 'letter-spacing:' + this.letterspace+ 'px !important;float:left !important';
                   //this.lineheightElement.setAttribute('style', "float:left !important");
                   this.actionfloatRight = false;
                } else {
                    this.lineheightElement.style.removeProperty('float');
                    this.lineheightElement.style.cssText = 'letter-spacing:' + this.letterspace+ 'px !important';
                }
             
                
                 
            }else if (formatType == "FLOATRIGHT") {
                this.actionfloatRight = status == true ? false : true;
                
                if(this.actionfloatRight){
                   this.lineheightElement.style.cssText = 'letter-spacing:' + this.letterspace+ 'px !important;float:right !important';
                   this.actionfloatLeft = false;
                } else {
                    this.lineheightElement.style.removeProperty('float');
                    this.lineheightElement.style.cssText = 'letter-spacing:' + this.letterspace+ 'px !important';
                }
                
            }

        }
    }

    handleColor = ($event: ColorEvent) => {
        const contentWindow = this.iframeElement.nativeElement.contentWindow;
        if (contentWindow.getSelection) {
            contentWindow.document.execCommand("ForeColor", false, $event.color.hex);
            this.colorPicker = true;
        }
    }

    poptipOpen() {

        return new Promise(resolve => {
            this.modalService.open(ModalboxComponent, {
                backdrop: 'static'
            }).result.then((result) => {
                resolve(result)
            }, (reason) => {
                console.log(reason);
                //newly added
                this.chapterDetails = '', this.currentChapter = ''
                let keyToremove = ["chapterDetails", "tocstatus", "chapterid"];
                keyToremove.forEach(k =>
                    localStorage.removeItem(k));
                resolve(`data`);
                console.log(`Dismissed `);

            });
            //resolve('')
            //   setTimeout(() => resolve(this.pop_tip), 3000);
        })
    }

    onloadChapter() {
        this.spinner.show();
        let promise: any = '';
        this.activatedRoute.params.subscribe(params => {
            if (localStorage.getItem('tocstatus') && localStorage.getItem('chapterid')) {

                this.chaptersList = JSON.parse(localStorage.getItem('tocstatus'));
                let currentChapterid = localStorage.getItem('chapterid');
                this.currentChapter = _.where(this.chaptersList, {
                    'pc_id': Number(currentChapterid)
                })[0];
                // this.chapterDetails=this.currentChapter;
                this.currentChapter = this.currentChapter ? this.currentChapter : [];
                localStorage.setItem('chapterDetails', JSON.stringify(this.currentChapter));
                this.previous_chapterDetails = this.currentChapter;

                this.projectName = this.chaptersList[0].folder;
                this.chapterCount = this.chaptersList.length;
                this.currentChapter['select'] = true;
                // console.log("chapterDetails",this.chapterDetails);
                promise = new Promise((resolve, reject) => {
                    this.getProjectDetails(params, resolve);
                })


                this.getHTMLservice(false);
                // this.getHTMLservice(false);
                //  promise = new Promise((resolve, reject) => {
                //  resolve('completed')
                // })
                // console.log(this.chaptersList.indexOf( 'chapter01'));
            } else {
                promise = new Promise((resolve, reject) => {
                    this.getProjectDetails(params, resolve);
                })
            }

        });

        this.activatedRoute.url.subscribe(urlsegments => {
            urlsegments.forEach(segment => {
                this.routerSegments.push(segment.path);
            });
        });

        this.page_model.sectionCount = 0,
            promise.then((data) => {
                //this.getHTMLservice(false);
            })

        this.editorDomService.test_subject.subscribe((data) => {
            this.nodeToDelete = data;
        })

        this.editorDomService.list_subject.subscribe((data) => {
            this.isTypeList = data;
        })

        this.editorDomService.subject.subscribe((data) => {
            this.page_model.sectionArray = data.sectionArray;
            this.page_model.iframeBody = data.iframeBody,
                this.page_model.sectionCount = data.sectionCount,
                this.page_model.json = data.json;
            this.page_model.isRecursive = data.isRecursive

            if (this.page_model.isRecursive) {
                let section = this.renderer.createElement('section');
                this.renderer.setAttribute(section, 'id', 'section_' + this.page_model.sectionCount);
                this.renderer.addClass(section, 'dynamicSection');
                section.innerHTML = this.page_model.iframeBody.innerHTML;
                this.page_model.sectionArray.push(section);
                this.createUniqIdHTML()
            }

        })
        var pagesize = localStorage.getItem('pagesize');
        if (pagesize) {
            (document.querySelector('#editableFrame') as HTMLElement).style.width = pagesize.split(',')[0] + 'in';
            (document.querySelector('#editableFrame') as HTMLElement).style.height = pagesize.split(',')[1] + 'in';
            (document.querySelector('#editableFrame_test') as HTMLElement).style.width = pagesize.split(',')[0] + 'in';
            (document.querySelector('#editableFrame_test') as HTMLElement).style.height = pagesize.split(',')[1] + 'in';
            (document.querySelector('.viewer-part') as HTMLElement).style.width = (((parseFloat(pagesize.split(',')[0])) + 1).toString()) + 'in';
            (document.querySelector('.viewer-part') as HTMLElement).style.height = (((parseFloat(pagesize.split(',')[1])) + 1).toString()) + 'in';
            (document.querySelector('#hiddenfinalhtml') as HTMLElement).style.height = pagesize.split(',')[1] + 'in';
            let pwidth = (document.querySelector('#view-container') as HTMLElement).offsetWidth;
            (document.querySelector('#hiddenfinalhtml') as HTMLElement).style.width = pwidth + 'px';
        }
    }
    headerValue() {
        var ischapter;
        var chaptNum;
        var allTags = this.iframeElement_test.nativeElement.contentDocument
        if (allTags != '' && allTags != null) {
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
                }else if(allTags.getElementsByClassName("mhhe-chapter_opener-chapter_number").length > 0){
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
                        }

                    }
                }

                if (setchpno == true) {
                    break;
                }
            }
        } else {
            this.chapterinfo = "";
            ischapter = "";
        }
        return true;
    }

    editorClose = () => {
        this.eventArrayHandler();
        let editorSlide = document.getElementById("editor_newframe");
        if (editorSlide) {
            editorSlide.style.display = 'none';
        }

    }
    editorCloseTable = () => {
        this.eventArrayHandler();
        let editorTableSlide = document.getElementById("editor_newframe_table");
        if (editorTableSlide) {
            editorTableSlide.style.display = 'none';
        }
    }

    editorCloseImage = () => {
        this.eventArrayHandler();
        let editorImageSlide = document.getElementById("editor_newframe_image");
        if (editorImageSlide) {
            editorImageSlide.style.display = 'none';
        }
    }

    editorCloseMath = () => {
        this.eventArrayHandler();
        let output = document.getElementById('matheditor_output');
        output.innerHTML = '';
        let editorSlidemath = document.getElementById("matheditor_container");
        if (editorSlidemath) {
            editorSlidemath.style.display = 'none';
        }
    }
    eventArrayHandler = () => {
        this.editorDomService.eventArray && this.editorDomService.eventArray.map((elem) => {
            if (elem && elem.target) {
                elem.target.style.border = "";
                elem.target.style.boxShadow = "";
                elem.target.style.padding = ""
                elem.target.style.borderRadius = ""
            }
            if (elem && elem.target && elem.target.parentNode && elem.target.parentNode.style) {
                elem.target.parentNode.style.border = "";
                elem.target.parentNode.style.boxShadow = "";
                elem.target.parentNode.style.padding = ""
                elem.target.parentNode.style.borderRadius = ""
            }
            if (elem && elem.target && elem.target.parentNode && elem.target.parentNode.parentNode && elem.target.parentNode.parentNode.style) {
                elem.target.parentNode.parentNode.style.border = "";
                elem.target.parentNode.parentNode.style.border = "";
                elem.target.parentNode.parentNode.style.boxShadow = "";
                elem.target.parentNode.parentNode.style.padding = ""
                elem.target.parentNode.parentNode.style.borderRadius = ""
            }
        })
    }

    changeCellWidth(event) {
        this.cell.style.width = event + '%';
    }

    changeImageSize(event) {
        this.img_style.style.cssText = 'width:' + event + 'px !important; margin-left:' + this.imagemargin_l + 'px !important; margin-right:' + this.imagemargin_r + 'px !important; margin-top:' + this.imagemargin_t + 'px !important; margin-bottom:' + this.imagemargin_b + 'px !important; border: 2px solid rgb(31, 207, 20); padding:' + this.imagepadding + 'px !important';
    }

    changeImagePadding(event) {
        this.img_style.style.cssText = 'width:' + this.imagesize + 'px !important; border: 2px solid rgb(31, 207, 20); padding:' + event + 'px !important; margin-left:' + this.imagemargin_l + 'px !important; margin-right:' + this.imagemargin_r + 'px !important; margin-top:' + this.imagemargin_t + 'px !important; margin-bottom:' + this.imagemargin_b + 'px !important';
    }

    changeImageMarginLeft(event) {
        this.img_style.style.cssText = 'width:' + this.imagesize + 'px !important; border: 2px solid rgb(31, 207, 20); padding:' + this.imagepadding + 'px !important; margin-left:' + event + 'px !important; margin-right:' + this.imagemargin_r + 'px !important; margin-top:' + this.imagemargin_t + 'px !important; margin-bottom:' + this.imagemargin_b + 'px !important';
    }
    changeImageMarginRight(event) {
        this.img_style.style.cssText = 'width:' + this.imagesize + 'px !important; border: 2px solid rgb(31, 207, 20); padding:' + this.imagepadding + 'px !important; margin-left:' + this.imagemargin_l + 'px !important; margin-right:' + event + 'px !important; margin-top:' + this.imagemargin_t + 'px !important; margin-bottom:' + this.imagemargin_b + 'px !important';
    }
    changeImageMarginTop(event) {
        this.img_style.style.cssText = 'width:' + this.imagesize + 'px !important; border: 2px solid rgb(31, 207, 20); padding:' + this.imagepadding + 'px !important; margin-left:' + this.imagemargin_l + 'px !important; margin-right:' + this.imagemargin_r + 'px !important; margin-top:' + event + 'px !important; margin-bottom:' + this.imagemargin_b + 'px !important';
    }
    changeImageMarginBottom(event) {
        this.img_style.style.cssText = 'width:' + this.imagesize + 'px !important; border: 2px solid rgb(31, 207, 20); padding:' + this.imagepadding + 'px !important; margin-left:' + this.imagemargin_l + 'px !important; margin-right:' + this.imagemargin_r + 'px !important; margin-top:' + this.imagemargin_t + 'px !important; margin-bottom:' + event + 'px !important';
    }

    changeLineHeight(event) {
        //this.lineheightElement.style.lineHeight  = event;
        this.lineheightElement.style.setProperty('line-height', event, 'important');
        this.cdRef.detectChanges();
    }
    changeFontSize(event) {
        this.lineheightElement.style.cssText = 'font-size:' + event + 'px !important';
        //this.lineheightElement.style.lineHeight  = this.lineheight;
        this.lineheightElement.style.setProperty('line-height', this.lineheight, 'important');
    }
    changeletterspace(event) {
        this.lineheightElement.style.cssText = 'letter-spacing:' + event + 'px !important';
        //this.lineheightElement.style.lineHeight  = this.lineheight;
        //this.lineheightElement.style.setProperty('line-height', this.lineheight, 'important');
    }
    editmath() {
        this.matherrormsg = '';
    }
    changeMathpadding(event, type) {
        let renderele = Array.from(document.querySelectorAll < HTMLElement > ('#matheditor_output .MathJax'));
        if (renderele) {
            let resetvalue = 0;
            if (event > 15) {
                resetvalue = 15;
            } else if (event < -15) {
                resetvalue = -15;
            }
            if (resetvalue != 0) {
                if (type == 1) {
                    this.mathpaddingTop = resetvalue;
                } else if (type == 2) {
                    this.mathpaddingRight = resetvalue;
                } else if (type == 3) {
                    this.mathpaddingBottom = resetvalue;
                } else if (type == 4) {
                    this.mathpaddingLeft = resetvalue;
                }
            }
            renderele[0].style.cssText = 'margin:' + this.mathpaddingTop + 'px ' + this.mathpaddingRight + 'px ' + this.mathpaddingBottom + 'px ' + this.mathpaddingLeft + 'px !important;'
        }
        this.cdRef.detectChanges();
    }

    render_math() {
        this.matherrormsg = '';
        let input = (this.mathinput).trim();
        if (input.startsWith("<math") && input.endsWith("</math>") && (input.match(/<math/g) || []).length == 1) {
            let output = document.getElementById('matheditor_output');
            output.innerHTML = '';
            output.appendChild(MathJax.mathml2svg(input));
            MathJax.startup.document.clear();
            MathJax.startup.document.updateDocument();
            this.enableSave = false;
            let renderele = Array.from(document.querySelectorAll < HTMLElement > ('#matheditor_output mjx-container'));
            renderele[0].style.cssText = 'margin:' + this.mathpaddingTop + 'px ' + this.mathpaddingRight + 'px ' + this.mathpaddingBottom + 'px ' + this.mathpaddingLeft + 'px !important;';
            this.cdRef.detectChanges();
        } else {
            this.matherrormsg = 'Invalid MathML !';
        }
    }

    save_math() {
        this.enableSave = true;
        let targetnode = this.targetnode;
        targetnode.replaceWith(document.getElementById('matheditor_output').childNodes[0]);
        this.editorCloseMath();
    }

    checkpageno(e) {
        if (this.jumppage > 0 && this.jumppage <= this.page_model.sectionArray.length) {
            this.checkgo = false;
        } else {
            this.checkgo = true;
        }
    }
    checkpagenoGo(e){
        if(e.keyCode == 13) {
            this.checkpageno(e);
            this.pageNavigation('gopage');
        }
    }

    changetablesize(iframeid) {
        /*let iframe  = document.getElementById(iframeid);
        if(iframe) {
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
               // tablelist[i].style.transform = 'translate(-'+(scaleper/2)+'%,-'+(scaleper/2)+'%) scale('+scaleval+')';
                tablelist[i].style.transform = 'rotate(270deg)';
              }
                }
          }
        }*/
        /*let iframe  = document.getElementById(iframeid);
        if(iframe) {
            let contentdocument = ( < HTMLIFrameElement > iframe).contentDocument;
          let tablelist = contentdocument.querySelectorAll('table');
          if(tablelist.length > 0) {
             for(let i=0; i< tablelist.length; i++){
               let curwidth:any = window.getComputedStyle(tablelist[i], null).getPropertyValue("width");
               console.log(curwidth);
             }
          }
        }*/
    }

    changeTableFontSize(event, type) {
        /*let editableFrame  = document.getElementById("editableFrame");
       let contentdocument = (<HTMLIFrameElement> editableFrame).contentDocument;
       if((contentdocument.getElementsByTagName('head')[0].innerHTML).indexOf('id="customTable"') < 0) {
           let tablestyle = document.createElement("style");
           tablestyle.id = "customTable";
           contentdocument.getElementsByTagName('head')[0].append(tablestyle);
       }
        let size = parseFloat(window.getComputedStyle(this.cell, null).getPropertyValue("font-size"));  
        let tableElement = this.cell.closest('TABLE');
        let tableid = tableElement.attributes.id.value;
        if(type == 0) { 
            tableElement.style.cssText +=  'font-size:'+(size+1)+'px !important';   
            size = size+1;
        } else {    
            tableElement.style.cssText += 'font-size:'+(size-1)+'px !important';    
            size = size-1;
        }   
        let changeinstyle = '#'+tableid+' *{font-size: '+size+'px !important}'; 
        (contentdocument.getElementsByTagName('head')[0]).children.customTable.innerHTML += changeinstyle;*/

        let size = parseFloat(window.getComputedStyle(this.cell, null).getPropertyValue("font-size"));
        if (type == 0) {
            console.log((size + 1) + 'px');
            this.cell.style.cssText += 'font-size:' + (size + 1) + 'px !important';
        } else {
            console.log((size - 1) + 'px');
            this.cell.style.cssText += 'font-size:' + (size - 1) + 'px !important';
        }
    }

    alignText(event, type) {
        console.log(event)
        if (type == 0) {
            this.cell.style.cssText += 'text-align:left !important';
        } else if (type == 1) {
            this.cell.style.cssText += 'text-align:right !important';
        }
    }

    showViewer(toc, i) {
        this.showMattable = false;
        this.showPreview = false;
        localStorage.setItem('viewer', 'true');
        this.startPageNumber = toc.startPageNumber;
        this.changeHtml_test(toc, i);
    }

    // showProjectPreview = async function(toc, i) { 
    //     let projectstandard = localStorage.getItem('projectstandard');
    //     this.chapterDetails = JSON.parse(localStorage.getItem('chapterDetails'));
        
    //     let project_path = this.uploadURL + projectstandard + '/' + this.projectName;
    //     project_path = project_path.replace(new RegExp("./pod_assets/uploads/", "g"), "/pod_assets/uploads/");

    //     try{
    //         let responseData = await this.http.get(this.appConfig.config.apiURL + "/readfile", {
    //             params: {
    //                 'url': this.uploadURL + projectstandard + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.pc_name + '.html'
    //             }
    //         }).toPromise();

    //         let data = await this.editorJsonService.createCustomJSONfromHTML(responseData, this.contentDoc, this.appConfig.config.hostURL + project_path);

    //         console.log('customJSON = ',data);
    //         this.showMattable = false;
    //         this.showPreview = true;
    //         localStorage.setItem('viewer', 'false');
    //     }
    //     catch(error) {
    //         console.log(error);
    //     }
    // }

    showProjectPreview = async function(toc, i){
        let editableFrame = document.getElementById("editableFrame");
        let contentdocumenteditable;
        let projectstandard = localStorage.getItem('projectstandard');
        this.spinner.show();
        this.page_model.sectionArray = [];
        this.test_sectionarray = [];
        this.page_model.iframeBody = '',
        this.page_model.json = '';
        let isSave = true;

        this.page_model.isRecursive = false;

        this.chapterDetails = JSON.parse(localStorage.getItem('chapterDetails'));
        
        let project_path = this.uploadURL + projectstandard + '/' + this.projectName;
        project_path = project_path.replace(new RegExp("./pod_assets/uploads/", "g"), "/pod_assets/uploads/");

        try{
            this.startPageNumber = (this.chapterDetails.pc_startpage) ? this.chapterDetails.pc_startpage : this.startPageNumber;
            if (!isSave) {
                this.getpagebreakup(false);
            }

            this.contentDoc = this.iframeElement.nativeElement.contentDocument;
            let contentEdit;
            localStorage.getItem("editaccess") == '0' ? contentEdit = "false" : contentEdit = "true";

            this.contentDoc.body.setAttribute("contentEditable", contentEdit);
            this.contentDoc.body.setAttribute("data-gramm", false)


            if (this.page_model.sectionCount % 2 == 0)
                this.contentDoc.body.classList.add('pagebreak_spi_even')
            else
                this.contentDoc.body.classList.add('pagebreak_spi_odd')

            let responseData = await this.http.get(this.appConfig.config.apiURL + "/readfile", {
                params: {
                    'url': this.uploadURL + projectstandard + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.pc_name + '.html'
                }
            }).toPromise();

            let project_path = this.uploadURL + projectstandard + '/' + this.projectName;
            project_path = project_path.replace(new RegExp("./pod_assets/uploads/", "g"), "/pod_assets/uploads/");

            let data = await this.editorJsonService.createCustomJSONfromHTML(responseData, this.contentDoc, this.appConfig.config.hostURL + project_path);

            console.log('customJSON = ',data);

            for (let x in data) {
                await this.editorHttpService.creatJSONservice(data[x].data, this.contentDoc, data[x].fileName, this.uploadURL + projectstandard + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/');
            }
            for (let x in data) {
                if (data[x].fileName == 'editorHeadJSON') {
                    var datajson = (data[x].data) ? (typeof(data[x].data) == "object" ? data[x].data : JSON.parse(data[x].data)) : '';
                    await this.editorDomService.appendIframeHeadContentNew(datajson, this.contentDoc);
                } else {
                    this.page_model.json = typeof(data[x].data) == "object" ? data[x].data : JSON.parse(data[x].data);  
                    // this.page_model.json = JSON.parse(data[x].data);
                    let _data: any = '';
                    if (!this.breakupJsonStatus) {
                        this.test_contentDoc = this.iframeElement_test.nativeElement.contentDocument;
                        this.test_contentDoc.head.innerHTML = '';
                        this.test_contentDoc.body.innerHTML = '';
                        this.test_contentDoc.head.innerHTML = this.contentDoc.head.innerHTML;
                    }
                    this.page_model.sectionCount = this.saved_pageno;

                    if (!isSave) {
                        this.chapter_pagecount = 1;
                        if (!this.breakupJsonStatus) {
                            _data = await this.editorDomService.appendIframePageWiseContentNew(this.page_model, this.contentDoc, '',this.test_contentDoc);
                            this.test_contentDoc.body.innerHTML = this.contentDoc.body.innerHTML;
                            this.contentDoc.body.innerHTML = '';
                        }
                    } else {
                        this.test_contentDoc.body.innerHTML = this.contentDoc.body.innerHTML;
                        this.contentDoc.body.innerHTML = '';
                        _data = await this.editorDomService.appendIframePageWiseContentNew(this.page_model, this.test_contentDoc, '',this.test_contentDoc);
                    }

                    if (this.test_sectionarray.length > 0) {
                        _data = {
                            sectionArray: this.test_sectionarray
                        };
                        this.page_model.sectionArray = this.test_sectionarray;
                    }

                    this.contentDoc.body.setAttribute('isbelongTo', 'page_' + this.saved_pageno);
                    if (!isSave) {
                        
                        this.contentDoc.body.innerHTML = _data.sectionArray[this.saved_pageno].outerHTML;
                        
                        this.contentDoc.body.onclick = this.editorDomService.mouseClickEvent;
                        this.contentDoc.body.onkeypress = this.editorDomService.onkeyPressEvent;
                        this.contentDoc.body.onpaste = this.editorDomService.pasteElement;
                        this.headerValue();
                        this.spinner.hide();
                    }


                    this.page_boolean_even = this.contentDoc.body.classList.contains('pagebreak_spi_odd') ? true : false;
                    this.isSave = true;
                    if (!this.breakupJsonStatus) {
                        await this.continousPagingFunctionNew(_data);
                    }

                    if (this.break_continous) {
                        this.contentDoc.body.innerHTML = ''
                        this.page_model.sectionArray = [];
                        this.contentDoc.head.innerHTML = '';
                        this.changeHtml(this.test_toc, this.test_index)
                    } else {
                        this.page_model.sectionCount = this.saved_pageno;
                        this.button_disable = false;
                    }


                }
            }

            console.log('1st resolved')
            if (document.getElementById('editableFrame_test')) {
                let breakuphtml = this.iframeElement_test.nativeElement.contentDocument;
                let currentChapter = JSON.parse(localStorage.getItem('chapterDetails'));
                this.dataservice.createbreakuphtmlfile(currentChapter.folder, currentChapter.chapter_name, breakuphtml.head.innerHTML, breakuphtml.body.innerHTML).subscribe((res) => {}, error => {});
            }

            this.createUniqIdHTML()

            // let responseData = await this.http.get(this.appConfig.config.apiURL + "/readfile", {
            //     params: {
            //         'url': this.uploadURL + projectstandard + '/' + this.projectName + '/s9ml/' + this.currentChapter.chapter_name + '/' + this.currentChapter.pc_name + '.html'
            //     }
            // }).toPromise();

            // let data = await this.editorJsonService.createCustomJSONfromHTML(responseData, this.contentDoc, this.appConfig.config.hostURL + project_path);

            // console.log('customJSON = ',data);
            // this.showMattable = false;
            // this.showPreview = true;
            // localStorage.setItem('viewer', 'false');
        }
        catch(error) {
            console.log(error);
        }        
    }

    // Json form data
    jsonFormSubmit(data) {
		console.log(data.value);
	}	

    chapterlist() {
        this.showMattable = true;
        this.showPreview = false;
        localStorage.setItem('viewer', 'false');
        this.activatedRoute.params.subscribe(params => {
            this.getprojectchapters(params);
        });
    }
    downloadPdf(toc) {
        console.log("apirurl loaded as ->  ", this.appConfig.config);
        var url = this.uploadURL + localStorage.getItem('projectstandard') + '/' + toc.folder + '/s9ml/' + toc.chapter_name + '/' + toc.chapter_name + '.pdf';
        window.open(url);
    }
    generateHtmlpage(toc, index) {
        this.page_number = (document.getElementById('s_page_number' + index) as HTMLInputElement).value;
        this.pop_tips = (document.getElementById('s_poptips' + index) as HTMLInputElement).checked;
        this.two_column = (document.getElementById('s_twocolumn' + index) as HTMLInputElement).checked;
        if (this.page_number > 0) {
            var self = this;
            toc.enlargeHtml = true;
            this.createFile(toc, index, toc.startPageNumber, 'html', this.pop_tips, this.two_column).then(function (resolvestatus) {
                if (resolvestatus) {
                    toc.pc_status = '1';
                }
            });
        } else {
            alert('Start Page Number field is required!!' + index);
            (document.getElementById('s_page_number' + index) as HTMLInputElement).focus();
            return false;
        }
    }
    createFile(toc, index, page, filetype, pop_tips = false, two_column = false) {
        var self = this;
        let promise = new Promise(function (resolve, reject) {
            if (filetype == 'html') {
                self.startPageNumber = toc.startPageNumber;
                self.dataservice.savestartpage(toc.folder, toc.chapter_name,toc.startPageNumber).subscribe((res) => {}, error => {});
                self.processpdfservice.generateHtml(toc, index, page, pop_tips, two_column);
            } else {
                self.processpdfservice.generatePDF(toc, index);
            }
            resolve(true);
        });
        return promise;
    }
    pageNumNav(nav, toc) {
        if (nav == 0) {
            if (toc.startPageNumber == 0 || !toc.startPageNumber || toc.html) {
                return false;
            }
            toc.startPageNumber -= 1;
        } else {
            if (toc.html) {
                return false;
            }
            if (toc.startPageNumber) {
                toc.startPageNumber += 1;
            } else {
                toc.startPageNumber = 1;
            }

        }
    }
}
export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}