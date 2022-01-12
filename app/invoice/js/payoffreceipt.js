function payoffReceiptInit(){
  var queryId = getParams('queryId') || 1;
  getData('payoffreceipt',{queryId: queryId},function(err, rows){
    var list = ['dhamechaHeadOffice','receiptInfo','paymentTotalInfo','paymentTotalInfo','iouSummary','pendingSummary'];
    
    for(var index = 0,len = rows.length; index < len; index++) {
      if(index){
        var lastPage = $('.page').last()
        var page = lastPage.clone();
        page.attr('id', 'page'+index);
        lastPage.after(page);
      }
      debugger;
      var page = rows[index];
      for(var item of list) {
        var temp = (item == 'pendingSummary'? item +'2': item);
        console.log(temp,item);
        $('#page'+index).find('#'+item).html(template($('#'+temp+'_tmp').html(), page[item]));
      }
    }
  })
}