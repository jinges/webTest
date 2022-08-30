
var HOST = '/cashierapp/web';//'http://51.195.136.75:9527/cashierapp/web';//'http://wx.fxswap.cn';//

var apilist = {
	receipt:  HOST+'/print/receipt',
	invoice: HOST+'/print/invoiceDetail',
	xzreding: HOST+'/print/xzreading',
	payoffreceipt: HOST+'/print/payoffReceipt',
	zreport: HOST+'/print/zReadingReport'
}

var loadCount = 0;