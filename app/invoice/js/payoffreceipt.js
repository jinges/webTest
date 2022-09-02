function payoffReceiptInit(){
  var queryId = getParams('queryId') || 1;
  getData('payoffreceipt',{queryId: queryId},function(err, rows){
    var list = ['dhamechaHeadOffice','receiptInfo','changeTotalPaid', 'payDetailList','paymentTotalInfo','iouSummary','pendingSummary'];
    
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
        var data = page[item];
        if('payDetailList' == item){
          data = {payDetailList: data}
        }
        $('#page'+index).find('#'+item).html(template($('#'+temp+'_tmp').html(), data));
      }
    }
    
    window.JSBridge.pageFinished('test');
  })
}