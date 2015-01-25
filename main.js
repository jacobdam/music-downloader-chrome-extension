function downloadFromNhaccuatui(xml_url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", xml_url, true);
  console.log(xml_url)
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.responseText) {
        var xml = (new DOMParser).parseFromString(xhr.responseText, "text/xml");
        var parsed_files = parseResponseXML(xml);
        // console.log(parsed_files);
        downloadMusicFiles(parsed_files);
      }
      
    }
  }
  xhr.send();
}

function parseResponseXML(xml_doc)
{
  var result = [];
  var tracks = xml_doc.querySelectorAll('tracklist track', "text/xml");
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    var file = {};
    file.title = track.querySelector('title').textContent;
    file.url = track.querySelector('location').textContent;
    file.performer = track.querySelector('creator').textContent;
    file.info = track.querySelector('info').textContent;
    result.push(file);
  }
  console.log(tracks)

  return result;
}

function downloadMusicFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    // console.log(file.url);
    chrome.downloads.download({
      url: file.url
    });
  }
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "download_available") {
    if (sender.tab) {
      chrome.pageAction.show(sender.tab.id);
      chrome.pageAction.onClicked.addListener(function() {
        downloadFromNhaccuatui(request.params['xml_url'])
      });
    }
  }
});
