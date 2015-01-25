function parseQueryString(query) {
  var result = {};
  query.split('&').map(function(pair) {
    var opIndex = pair.indexOf('=');
    var name, value;
    if (opIndex >= 0) {
      name = decodeURIComponent(pair.substring(0, opIndex));
      value = decodeURIComponent(pair.substring(opIndex + 1));
    } else {
      name = decodeURIComponent(pair);
      value = '';
    }
    if (!result[name]) {
      result[name] = [];
    }
    result[name].push(value);
  });

  return result;
}

function notifyDownloadAvailable (xmlURL) {
  chrome.extension.sendMessage({"action": "download_available", params: { "site": "nhaccuatui", "xml_url": xmlURL } });
}

function parseFlashObject() {
  var retry = 10;
  var f = function() {
    var flashvars_tags = document.querySelectorAll('#flashPlayer object param[name=flashvars]');
    if (flashvars_tags.length > 0) {
      var flashvars = parseQueryString(flashvars_tags[0].value);
      if (flashvars['file'] && flashvars['file'].length > 0) {
        notifyDownloadAvailable(flashvars['file'][0]);
      }
    } else {
      retry--;
      if (retry > 0) {
        setTimeout(f, 1000);
      }
    }
  }
  f();
}

parseFlashObject();
