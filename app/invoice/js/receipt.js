function initReceiptPage(noPrint){
  var queryId = getParams('queryId') || 1;
  getData('receipt',{queryId: queryId},function(err, rows){
    var list = ['dhamechaHeadOffice','receiptInfo', 'cashChange', 'payDetailList','invoiceTotalInfo','paymentTotalInfo','paymentTotalInfo','iouSummary','pendingSummary'];
    
    for(var index = 0,len = rows.length; index < len; index++) {
      if(index){
        var lastPage = $('.page').last()
        var page = lastPage.clone();
        page.attr('id', 'page'+index);
        lastPage.after(page);
      }
      var page = rows[index];
      for(var item of list) {
        var data = page[item];
        if('payDetailList' == item){
          data = {payDetailList: data}
        }
        if(item == 'cashChange' && !page[item]){
          continue;
        }
        if(item == 'pendingSummary'){
          data = page['iouSummary']
        }
        $('#page'+index).find('#'+item).html(template($('#'+item+'_tmp').html(), data));
      }
    }
    
    ++loadCount;
    if(!noPrint || (loadCount > 1 && noPrint)){
      window.JSBridge.pageFinished('test');
    }
  })
}