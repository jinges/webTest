function initInvoicePage(){
  var queryId = getParams('queryId') || 1;
  var queryType = getParams('queryType') || 'Invoice';
  getData('invoice',{queryId: queryId, queryType: queryType},function(err, res){
    
    for(var index = 0,len  = res.length; index < len; index++){
      if(index){
        console.log(index);
        debugger;
        var lastInvoice = $('.invoicePage').last()
        var invoice = lastInvoice.clone();
        invoice.attr('id', 'invoice'+index);
        invoice.find('.invoice,.invoice_info,.count_total, .list tbody tr').remove()
        lastInvoice.after(invoice);
      }
      var invoice = $('#invoice'+index);
      invoice.find('.page').not('section[id="page1"]').remove();
      var data = res[index];
      renderInvocie(invoice, data)
      data = null;
    }
  });
}

function renderInvocie(invoice, data){
  var page = $(invoice).find('#page1');
  var content = page.find('.content');
  var invoice_tmp = $('#invoice_tmp').html();
  var invoiceStr = template(invoice_tmp, {
    invoice: data.invoice,
    business: data.business
  });
  content.before(invoiceStr);
  invoiceStr = '';

  var orderInfo = $('#orderInfo_tmp').html();
  var orderInfoStr = template(orderInfo, data.orderInfo);
  content.before(orderInfoStr);
  orderInfoStr = null;
  
  //订单详情
  var list = data.invoiceDetailList;
  var ch = computeContentHeight(page);
  pagingFun(page, list, ch);

  totalInfo(data, invoice);
}

function pagingFun(page, list, ch, step){
  step = step || 10;
  var items = list.splice(0, step);
  var content = page.find('.content');
  if(!items.length){
    return false;
  }

  content.find('.list tbody').append(invoiceRnder(items));
  var cth = content.height();
  if((ch - cth) >= 200){
    pagingFun(page, list, ch, step);
  } else {
    if(ch > (cth + 24)){
      pagingFun(page, list, ch, 1);
    } else if(list.length){
      var nextPage = addNewPage(page);
      var ch = computeContentHeight(nextPage);
      pagingFun(nextPage, list, ch);
    }
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
  page.find('.header, .invoice, .invoice_info, .footer').map(function(i, item){
    h += $(item).height();
  })
  return pageHeight - h - 22;
}

function totalInfo(res, invoice){
    //订单总计
    var lastPage = $(invoice).find('.page').last();
    var content = lastPage.find('.content');
    var totalInfo_tmp = $('#totalInfo_tmp').html();
    var totalInfo = res.totalInfo;
    var rateInfoList = res.rateInfoList;
    rateInfoList[0]['lastTitle'] = 'Total Goods:';
    rateInfoList[0]['lastItem'] = '<span class="b">£'+totalInfo.totalGoods+'</span>';
    rateInfoList[1]['lastTitle'] = 'VAT:';
    rateInfoList[1]['lastItem'] = '<span class="b">£'+totalInfo.vat+'</span>';
    rateInfoList[2]['lastTitle'] = 'Total incl VAT:';
    rateInfoList[2]['lastItem'] = '<span class="b">£'+totalInfo.totalinclVAT+'</span>';

    var totalStr = template(totalInfo_tmp, {
      totalInfo: res.totalInfo,
      rateInfoList: rateInfoList
    })
    content.append(totalStr);
    totalStr = null;

    var cth = content.height();
    var ch = computeContentHeight(lastPage);
    if(cth > ch){
      var nextPage = addNewPage(lastPage);
      nextPage.find('.list').remove();
      nextPage.find('.count_total tr').remove();
      cutTotalTable(lastPage, nextPage, content, ch)
    }
}

function cutTotalTable(currentPage, nextPage,content, ch){
  var lastTr = currentPage.find('.count_total tr').last();
  var newTr = lastTr.clone();
  nextPage.find('.count_total tbody').prepend();
  lastTr.remove();
  newTr.remove();
  var cth = content.height();
  if(cth > ch){
    cutTotalTable(currentPage, nextPage, content, ch)
  }
}