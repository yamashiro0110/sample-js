(function () {
  /*
   *
   *  :: cookies.js ::
   *
   *  ユニコード全般をサポートする、Cookieリーダー/ライターです。
   *
   *  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
   *
   *  This framework is released under the GNU Public License, version 3 or later.
   *  http://www.gnu.org/licenses/gpl-3.0-standalone.html
   *
   *  文法:
   *
   *  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
   *  * docCookies.getItem(name)
   *  * docCookies.removeItem(name[, path], domain)
   *  * docCookies.hasItem(name)
   *  * docCookies.keys()
   *
   */
  var docCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey)
        .replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey)
          .replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\="))
        .test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
        .split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };

  function nowPlusHours(hours) {
    var now = new Date();
    now.setHours(now.getHours() + hours);
    return now.toUTCString();
  }

  function updateCookie(params) {
    var cookieName = params.cookie_name;
    var cookieDomain = params.cookie_domain;
    var existCookieValue = docCookies.getItem(cookieName);
    console.log('exists cookie', params, existCookieValue);

    docCookies.removeItem(cookieName);
    console.log('remove cookie. cookieName:%s, docCookies.hasItem:%s', cookieName, docCookies.hasItem(cookieName));

    var cookieExpiresDate = nowPlusHours(24 * 7);
    docCookies.setItem(cookieName, cookieExpiresDate.toString(), cookieExpiresDate, '/', cookieDomain, false);
    console.log('update cookie', params, docCookies.getItem(cookieName));
  }

  function createCookie(params) {
    var cookieName = params.cookie_name;
    var cookieDomain = params.cookie_domain;
    var cookieExpiresDate = nowPlusHours(24 * 7);
    docCookies.setItem(cookieName, cookieExpiresDate.toString(), cookieExpiresDate, '/', cookieDomain, false);
    console.log('create cookie', params, docCookies.getItem(cookieName));
  }

  var cookieName = 'sample_js_cookie';
  var domainParts = location.hostname.split('.').reverse();
  console.log('domainParts', domainParts);

  var domain = "";

  var cookiesByName = docCookies.keys('sample_js');
  console.log('cookiesByName', cookiesByName);

  // TODO: cookie name of process
  // cookiesByName.forEach((value, num) => {
    for (var index = 0; index < domainParts.length; index++) {
      var domainPart = domainParts[index];

      if (domain === "") {
        domain += '.' + domainParts[index];
        console.log('continue. domain is empty...', domain, domainPart);
        continue;
      }

      domain = '.' + domainPart + domain;
      console.log('add domainPart. domainPart:%s, domain:%s', domainPart, domain);

      if (docCookies.hasItem(cookieName)) {
        updateCookie({
          "cookie_name": cookieName,
          "cookie_domain": domain
        });
      } else {
        createCookie({
          "cookie_name": cookieName,
          "cookie_domain": domain
        });
      }
    }
  // });

})();
