function initReceiptPage(){
  var queryId = getParams('queryId') || 1;
  getData('receipt',{queryId: queryId},function(err, rows){
    var list = ['dhamechaHeadOffice','receiptInfo','invoiceTotalInfo','paymentTotalInfo','paymentTotalInfo','iouSummary'];
    
    for(var index = 0,len = rows.length; index < len; index++) {
      if(index){
        var lastPage = $('.page').last()
        var page = lastPage.clone();
        page.attr('id', 'page'+index);
        lastPage.after(page);
      }
      var page = rows[index];
      for(var item of list) {
        $('#page'+index).find('#'+item).html(template($('#'+item+'_tmp').html(), page[item]));
      }
    }
  })
}