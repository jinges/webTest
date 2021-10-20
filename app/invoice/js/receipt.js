function initReceiptPage(){
  var queryId = getParams('queryId') || 1;
  getData('receipt',{queryId: queryId},function(err, res){
    var list = ['dhamechaHeadOffice','receiptInfo','invoiceTotalInfo','paymentTotalInfo','paymentTotalInfo','iouSummary'];
    for(var item of list) {
      console.log(res[item]);
      $('#'+item).html(template($('#'+item+'_tmp').html(), res[item]));
    }
  })
}