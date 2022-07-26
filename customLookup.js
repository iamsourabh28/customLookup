import lookUp from '@salesforce/apex/BO_Lookup.search';
import { api, LightningElement, track, wire } from 'lwc';


export default class customLookUp extends LightningElement {

    @api objName;
    @api iconName;
    @api filter = '';
    @api searchPlaceholder='Search';
    @api value;
    @api serialNumber;
    @api fieldName;
    @track selectedName;
    @track records;
    @track isValueSelected;
    @track blurTimeout;
    @track recordNumber;
    isPrice = false;

    searchTerm;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

connectedCallback() {
    console.log('Id :',this.value);
    console.log('serialNumber :',this.serialNumber);
    console.log('fieldName :',this.fieldName);
    this.recordNumber = this.serialNumber;
    if(this.objName == 'Account'){
        this.filter = "RecordType.Name = 'Ship-To Account'";
    }else if(this.objName == 'Price__c'){
        this.isPrice = true;
    }

    if(this.value){
        this.isValueSelected = true;
        this.selectedName = this.fieldName;
        console.log('recordNumber : ',this.recordNumber);
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail: this.recordNumber +' '+this.value });
        this.dispatchEvent(valueSelectedEvent);
        
    }
}
    @wire(lookUp, {searchTerm : '$searchTerm', myObject : '$objName', filter : '$filter'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }


    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;

        let selectedDataNumber = event.currentTarget.dataset.number;
        console.log('dataset : ',event.currentTarget.dataset.name);
        console.log('dataset : ',event.currentTarget.dataset.name);
        console.log('selectedDataNumber : ',selectedDataNumber);
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail: selectedDataNumber +' '+ selectedId});
        this.dispatchEvent(valueSelectedEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }           
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    handleRemovePill() {
        this.isValueSelected = false;
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail: this.recordNumber +' ' });
        this.dispatchEvent(valueSelectedEvent);
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }

}