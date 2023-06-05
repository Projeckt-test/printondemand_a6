import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { editorJsonService } from './../editorFrame-services/editorJson.service';
import { editorDomService } from './../editorFrame-services/editorDom.service';
import { DialogData } from '../editor.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-style-dialog',
  templateUrl: './edit-style-dialog.component.html',
  styleUrls: ['./edit-style-dialog.component.scss']
})
export class EditStyleDialogComponent implements OnInit {

  current_element: any;
  curElem_str: any;
  fontFamilyOption: any;
  inputStyleList: any = [];

  fontFamily: any;
  fontSize: any;
  fontColor: any;
  fontBgColor: any;
  fontBold: any;
  fontItalic: any;
  fontUnderline: any;
  fontLeftAlign: any;
  fontRightAlign: any;
  fontJustify: any;
  textAlign: any;
  isImage = false;

  myForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditStyleDialogComponent>, private modalService: NgbModal,
    @Inject(MAT_DIALOG_DATA) private data: DialogData, private formBuilder: FormBuilder, private editorDomService: editorDomService,
    private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar, private editorJsonService: editorJsonService) {
      this.current_element = data["element"];
      this.curElem_str = data["element"].outerHTML;
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    document.body.setAttribute("class", "edit-sidebar");
    this.inputStyleList = this.editorDomService.styleConfig;
    this.isImage = (this.current_element.nodeName.toLowerCase() == 'img') ? true : false;
    // this.fontFamilyOption = this.editorDomService.styleConfig[0].option;
    // this.fontFamily = window.getComputedStyle(this.current_element).fontFamily;
    
    // this.getStyleData();
    this.myForm = this.formBuilder.group({
      dropDownField: [[], null],
      textBoxField: [[], null],
      buttonField: [[], null],
    });
  }

  getData(event, field){
    // if(field == 'buttonField'){
    //   this.inputStyleList.forEach(element => {
    //     if(element.id == event.id){
    //       element.isSelected = event.data;
    //     }
    //     else if(event.group_id == 105 && element.group_id == event.group_id){
    //       element.isSelected = false;
    //     }
    //   });
    // }
    // console.log(event);
  }

  /*  Temporarily save the element style changes in html. */
  saveChanges() {
    let id = this.current_element.getAttribute('id');
    let styleList = this.current_element.getAttribute('style');
    let data = {
      "id": id,
      "styleList": styleList
    }
    this.dialogRef.close(data);
  }

  /*  Close the edit option and revert temporary changes in html. */
  closeDialog(): void {
    this.current_element.outerHTML = this.curElem_str;
    this.dialogRef.close();
  }

}
