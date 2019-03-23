# introduction

uajs is a `navigator.userAgent` parser. You can use it to distract browser name, browser version, OS name, OS version from a userAgent string. 

# features

- browsers: chrome/firefox/safari/Internet explorer/edge
- OS: windows/macos/ios/android/linux

# usage

```javascript
let result = UserAgentParser.parse("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:52.0) Gecko/20100101 Firefox/52.0");
console.log(result);
// Here, result is an instance of UserAgentDescriptor
// you can use result.name/version/os/osv to get detail information.
```

