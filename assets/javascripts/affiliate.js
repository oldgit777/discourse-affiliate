(function() {

  var universalCode = {
    'amazon.co.uk': 'tag=',
    'amazon.com': 'tag=pragmatentrep-20',
    'amazon.de': 'tag=',
    'amazon.fr': 'tag=pragmaticentrepreneurs-21',
    'javari.co.uk': 'tag=',
    'javari.de': 'tag=',
    'javari.fr': 'tag=pragmaticentrepreneurs-21',
    'amazonsupply.com': 'tag=',
    'amazonwireless.com': 'tag=',
    'endless.com': 'tag=',
    'digitalocean.com': 'refcode=fdc7761ea776'
  };

  var addTagToEnd = function (url) {
    var link, match, match2, match3, tag, domain;
    domain = url.split("/")[2];
    if (!domain)  { return url; }
    for (link in universalCode) {
      tag = universalCode[link];
      if (!(domain === link || domain.substring(domain.length - link.length - 1) === '.' + link)) {
        continue;
      }
      if (!(link && tag)) {
        return url; //no change
      }
      match = tag.match(/([a-zA-Z0-9\-]+)=([a-zA-Z0-9\-]+)/);
      if (!match) { //if tag is not configured
        return url; //no change
      }
      match2 = new RegExp(match[1] + '=([a-zA-Z0-9\-]*)');
      if (url.search(match2) > -1) { // if the url already contains a tag
        match3 = url.match(match2);
        if (!match3[1]) { // if the tag value is empty
          url = url.replace(match2, match[1] + '=' + match[2]); // replace it by our value
        }
        return url;
      }
      if (url.substring(url.length, url.length - 1) === '/') {
        url += '?' + match[1] + '=' + match[2];
        return url;
      }
      if (url.match(/(\?)/)) {
        url += '&' + match[1] + '=' + match[2];
      } else {
        url += '/?' + match[1] + '=' + match[2];
      }
      return url;
    }
    return url;
  };

  Discourse.Dialect.on("parseNode", function(event) {
    var node = event.node;

    // We only care about links
    if (node[0] !== 'a')  { return; }

    node[1].href = addTagToEnd(node[1].href);
  });

})();
