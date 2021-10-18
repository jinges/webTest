function ajax(type, url, data, cb){
	$.ajax({
		type: type,
		url: url,
		data: data,
		contentType : 'application/json',
		dataType : 'json',
		success: function(res){
			if(res.code == 200){
				cb(null, res.data);
			} else {
				cb(res.errMsg);
			}
		}
	})
};

function getData (apiName ,params, cb){
	ajax('GET', apilist[apiName], params,cb)
}

function postData(apiName, params, cb){
	ajax('POST', apilist[apiName], params,cb)
}

function getParams(query){
	var search = window.location.search + '';
    if (search.charAt(0) != '?') {
        return 1;
    }
    else {
        search = search.replace('?', '').split('&');
        for (var i = 0; i < search.length; i++) {
            if (search[i].split('=')[0] == query) {
                return decodeURI(search[i].split('=')[1]);
            }
        }
        return undefined;
    }
}