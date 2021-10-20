function initInvoicePage(){
  
  var queryId = getParams('queryId') || 1;
  var queryType = getParams('queryType') || 'Invoice';

  getData('invoice',{queryId: queryId, queryType: queryType},function(err, res){
    var firstPage = $('#page1');
    var content = firstPage.find('.content');
    
    var invoice_tmp = $('#invoice_tmp').html();
    content.before(template(invoice_tmp, {
      invoice: res.invoice,
      business: res.business
    }));

    var orderInfo = $('#orderInfo_tmp').html();
    content.before(template(orderInfo, res.orderInfo));

    //订单详情
    var list = res.invoiceDetailList;
    list = list.concat(list);
    list = list.concat(list);
    list = list.concat(list);
    list = list.concat(list);

    var ch = computeContentHeight(firstPage);
    pagingFun(firstPage, list, ch);

  });
}

function pagingFun(page, list, ch){
  var items = list.splice(0, 1);
  var content = page.find('.content');
  content.find('tbody').append(invoiceRnder(items));
  var cth = content.height();
  if(list.length <= 0){
    return false;
  }
  if((ch - cth) > 20){
    pagingFun(page, list, ch);
  } else {
    var newPage = addNewPage(page);
    var ch = computeContentHeight(newPage);
    if((ch - cth) < 20){
      list.unshift(items);
    } 
    pagingFun(newPage, list, ch);
  }
}

function addNewPage(currentPage){
  var index = currentPage.attr('data-index');
  var newPage = currentPage.clone();
  var newIndex= index * 1 + 1;
  newPage.attr({'id': 'page'+newIndex, 'data-index': newIndex});
  newPage.find('.invoice, .invoice_info').remove();
  newPage.find('.list tbody tr').remove();
  newPage.find('.page_num').text(newIndex);
  currentPage.after(newPage);
  return newPage;
}

function invoiceRnder(list){
  var invoiceDetailList = $('#invoiceDetailList_tmp').html();
  return template(invoiceDetailList, {invoiceDetailList:list});
}

function computeContentHeight(page){
  var h = 0;
  var pageHeight = page.height();
  page.find('.header,.footer,.invoice,.invoice_info').map(function(i, item){
    h += $(item).height();
  })
  return pageHeight - h - 22;
}

function totalInfo(content, res){
    //订单总计
    var totalInfo_tmp = $('#totalInfo_tmp').html();
    var totalInfo = res.totalInfo;
    var rateInfoList = res.rateInfoList;
    rateInfoList[0]['lastTitle'] = 'Total Goods:';
    rateInfoList[0]['lastItem'] = '<span class="b">£'+totalInfo.totalGoods+'</span>';
    rateInfoList[1]['lastTitle'] = 'VAT:';
    rateInfoList[1]['lastItem'] = '<span class="b">£'+totalInfo.vat+'</span>';
    rateInfoList[2]['lastTitle'] = 'Total incl VAT:';
    rateInfoList[2]['lastItem'] = '<span class="b">£'+totalInfo.totalinclVAT+'</span>';

    content.append(template(totalInfo_tmp, {
      totalInfo: res.totalInfo,
      rateInfoList: rateInfoList
    }));
}