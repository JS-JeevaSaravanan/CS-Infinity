
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language?utm_source=chatgpt.com


  Accept-Language: ta-IN, en;q=0.7

This instructs the API to return content in Tamil (`ta-IN`) if available, or English (`en`) as a fallback.​

​In the `Accept-Language` HTTP header, the `q` value (short for "quality value") indicates the client's preference for specific languages. The values range from 0 to 1, where 1 represents the highest preference.


https://stackoverflow.com/questions/73826800/google-business-api-only-receive-the-original-review-without-translation?utm_source=chatgpt.com


You can actually set the `Accept-Language` on the request header, so they won't be translated to your account language, but kept in the language you believe is the original language.

For example, I'm authenticating with my own account, my account language is set to English, but reviews are mostly in Spanish. To avoid translation to English when retrieving reviews, you can set the header to accept Spanish first this way:

```javascript
const resp = await oauth2Client.request({
  url: `https://mybusiness.googleapis.com/v4/${account.name}/${location.name}/reviews?pageSize=2`,
  headers: { 'Accept-Language': 'es, en;q=0.7' },
});
```


