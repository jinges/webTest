function initReceiptPage(){
  var queryId = getParams('queryId');
  getData('receipt',{queryId: queryId},function(err, res){
    console.log(res);
    var tpl = $('#dhamechaHeadOffice_tmp').html();
    $('#dhamechaHeadOffice').html(template(tpl, res.dhamechaHeadOffice));

    var tpl2 = $('#receiptInfo_tmp').html();
    $('#receiptInfo').html(template(tpl2, res.receiptInfo));
  })
}