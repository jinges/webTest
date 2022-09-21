function initInvoicePage(noPrint){
  var queryId = getParams('queryId') || 1;
  var queryType = getParams('queryType') || 'Invoice';
  getData('invoice',{queryId: queryId, queryType: queryType},function(err, res){
    var startTime = new Date().getTime();
    try{
      cutInvoiceData(res, noPrint, 0);
    } catch(e){
      console.log(e);
    }
    // console.log('用时：'+(new Date().getTime()-startTime));
  });
}

function cutInvoiceData(res, noPrint, index){
  debugger;
  var invoice = $('#invoice'+index);
  invoice.find('.page').not('section.page1').remove();
  var data = res.shift();
  renderInvocie(invoice, data);
  data = null;
  if(res.length){
    ++index;
    var lastInvoice = $('.invoicePage').last()
    var invoice = lastInvoice.clone();
    invoice.attr('id', 'invoice'+index);
    invoice.find('.invoice,.invoice_info,.count_total, .list tbody tr').remove()
    lastInvoice.after(invoice);
    cutInvoiceData(res, noPrint, index);
  } else if(!noPrint){
      window.JSBridge.pageFinished('test');
  }
}

function renderInvocie(invoice, data){
  var page = $(invoice).find('.page1');
  var content = page.find('.content');
  var invoice_tmp = $('#invoice_tmp').html();
  var invoiceStr = template(invoice_tmp, {
    invoice: data.invoice,
    business: data.business,
    customerId: data.orderInfo.customerId,
    customerRegisterNo: data.orderInfo.customerRegisterNo
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

  var rest_height = pagingFun(page, list, ch);

  totalInfo(data, invoice,rest_height);
  addWhitePage(invoice, page);
}

//补增空白页
function addWhitePage(invoice, page){
  var pageNum = $(invoice).find('.page').length;
  if(pageNum % 2){
    var whitePage = $(page).clone();
    whitePage.html('');
    whitePage.removeAttr('id');
    whitePage.attr({'class': 'page'});
    invoice.append(whitePage);
  }
}

function pagingFun(page, list, ch, step){
  step = step || 10;
  var items = list.splice(0, step);
  if(!items.length){
    return 0;
  }

  page.find('.content').find('.list tbody').append(invoiceRnder(items));
  var cth = page.find('.content').height();
  if((ch - cth) >= 200 && list.length){
    return pagingFun(page, list, ch, step);
  } else if(ch > (cth + 24) && list.length){
      return pagingFun(page, list, ch, 1);
  } else {
    if(cth > ch){
      page.find('.content').find('tr').last().remove();
      var lastRow = items.splice(-1);
      list.unshift(lastRow[0]);
    } 
    items = null;
    if(list.length){
      var nextPage = addNewPage(page);
      var ch = computeContentHeight(nextPage);
      return pagingFun(nextPage, list, ch);
    } else {
      return ch - cth
    }
  }
}

function addNewPage(currentPage){
  var index = currentPage.attr('data-index');
  var newPage = currentPage.clone();
  var newIndex= index * 1 + 1;
  newPage.attr({'class': 'page', 'data-index': newIndex});
  newPage.addClass('page'+newIndex)
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

function totalInfo(res, invoice, rest_height){
    //订单总计
    var lastPage = $(invoice).find('.page').last();
    var prevPage = null;
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
      totalInfo: res.itemTotalInfo,
      rateInfoList: rateInfoList,
      textDiscountList: res.textDiscountList
    })

    if(rest_height < 140){
      var nextPage = addNewPage(lastPage);
      nextPage.find('.list').remove();
      nextPage.find('.count_total tr').remove();
      prevPage = lastPage;
      lastPage = nextPage;
    }
    var content = lastPage.find('.content');
    content.append(totalStr);
    totalStr = null;
    var fristTr = content.find('.count_total').find('tr').first();
    if(!prevPage || fristTr.height() > rest_height){
      return false;
    }

    var copyTable = content.find('.count_total').clone();
    copyTable.find('tr').remove();
    prevPage.find('.content').append(copyTable);
    
    var ch = computeContentHeight(prevPage);
    cutTotalTable(lastPage, prevPage, ch)
}

function cutTotalTable(currentPage, prevPage, ch,content){
  var firstTr = currentPage.find('.count_total tr').first();
  var newTr = firstTr.clone();
  prevPage.find('.count_total tbody').prepend(newTr);
  firstTr.remove();
  if(!content){
    content = prevPage.find('.content');
  }
  // newTr.remove();
  var cth = content.height();
  if(cth < ch){
    cutTotalTable(currentPage, prevPage, ch, content)
  }
}