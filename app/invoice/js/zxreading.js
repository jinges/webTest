function initReadingPage(){
  
	var salesType = getParams('sales_type');
  var pathName = window.location.pathname;
  getData('xzreding',{salesType: salesType,pathName: pathName},function(err, res){
    var cashierInfo = res.cashierInfo
    if(pathName.indexOf('x_reading') > -1){
      cashierInfo.loginoff = true;
      cashierInfo.showDate = false;
    } else {
      cashierInfo.showDate = true;
      cashierInfo.loginoff = false;
    }

    $('#cashierInfo').html(template($('#cashierInfo_tmp').html(), cashierInfo));

    var countInfoData = {invoiceAmountInfo: res.invoiceAmountInfo,invoiceCountInfo: res.invoiceCountInfo};
    $('#countInfo tr').last().html(template($('#countInfo_tmp').html(),countInfoData));
    
    $('#salesReconciliation').html(template($('#salesReconciliation_tmp').html(),res.salesReconciliation));

    $('#x_salesReconciliation').html(template($('#x_salesReconciliation_tmp').html(),res.salesReconciliation));

    $('#paidList').html(template($('#paidList_tmp').html(),{paidList: res.paidList}));
    window.JSBridge.pageFinished('test');
  })
}
