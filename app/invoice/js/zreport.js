function renderZreport(){
  getData('zreport',{}, function(err, res){
    // var list = res[0].receiptAmountList;
    // list = [...list, ...list, ...list];
    // res[0].receiptAmountList = list;

    // res = [...res, ...res];
    // res = [...res, ...res];
    // $('#zreport').html(template($('#Zreport_tmp').html(), {reports: res}));
    var firstPage = $('.page');
    let contentHeight = computeContentHeight(firstPage);
    renderPage(firstPage, res,contentHeight);
  })

  function renderPage(page, data,contentHeight){
    for(var i = 0, length = data.length; i < length; i++){
      var item = data[i];
      var len = item.receiptAmountList.length;
      if(len > 6){
        item.width = '33%'
      } else if(len > 3){
        item.width = '50%'
      } else {
        item.width = '100%'
      }
      var itemStr = template($('#Zreport_tmp').html(), item);
      var content = $(page).find('.list')
      content.append(itemStr);
      const listHeight = content.height();
      console.log(listHeight, contentHeight);
      if(listHeight > contentHeight){
        console.log(i);
        --i;
        console.log(i);
        content.find('.item').last().remove();
        var nextPage = addNewPage(page);
        page = nextPage;
      }
    }
  }

  function addNewPage(currentPage){
    var index = currentPage.attr('page-index');
    var newPage = currentPage.clone();
    var newIndex= index * 1 + 1;
    newPage.attr({'class': 'page', 'page-index': newIndex});
    newPage.addClass('page'+newIndex)
    newPage.find('.list').html('');
    newPage.find('.page_num').text(newIndex);
    currentPage.after(newPage);
    return newPage;
  }

  function computeContentHeight(page){
    var h = 0;
    var pageHeight = page.height();
    page.find('.header, .footer').map(function(i, item){
      h += $(item).height();
    })
    return pageHeight - h - 22;
  }
}