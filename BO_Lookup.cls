public with sharing class BO_Lookup {

    @AuraEnabled(cacheable=true)
    public static List<sObject> search(String searchTerm, String myObject, String filter) {
        String myQuery = null;
                System.debug('searchTerm : '+searchTerm);
                System.debug('myObject : '+myObject);
                System.debug('filter : '+filter);

        if(filter != null && filter != ''){
            if(myObject == 'Price__c'){
                myQuery = 'Select Id, Price_ID__c from '+myObject+' Where Price_ID__c != NULL AND Price_ID__c Like  \'%' + searchTerm + '%\' AND '+filter;
       
            }else{
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' AND '+filter+' LIMIT  5';
       
            }
        }
        else {
            if(searchTerm == null || searchTerm == ''){
                if(myObject == 'Price__c'){
                myQuery = 'Select Id, Price_ID__c from '+myObject+' Where Price_ID__c != NULL AND LastViewedDate != NULL ORDER BY LastViewedDate DESC ';

                }else{
                myQuery = 'Select Id, Name from '+myObject+' Where LastViewedDate != NULL ORDER BY LastViewedDate DESC LIMIT 10';

                }
            }
            else {
                if(myObject == 'Price__c'){
                myQuery = 'Select Id, Price_ID__c from '+myObject+' Where Price_ID__c != NULL AND Price_ID__c Like  \'%' + searchTerm + '%\' ';

                }else{
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';

                }
            }
        }
        List<sObject> lookUpList = database.query(myQuery);
        System.debug('lookUpList : '+lookUpList);
        return lookUpList;
    }
}