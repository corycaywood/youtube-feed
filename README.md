# YouTube Feed Plugin

This is a jQuery plugin that can be used to pull in a patternized feed of YouTube videos from a certain username. In order to use this plugin, you will need to create a key for the YouTube Data API on the [Google Developers Console](https://console.developers.google.com).

You will also need to find the ID number for the username which you wish to pull in, which you can do by using the included `tools.html` file.

To use this plugin, include [jQuery](https://jquery.com/) and the `youtubeFeed.min.js` script in your html file, and then use the following function to call it on document ready. You will also need to include a div on your page where the feed will be placed. In the example below, the photos would be placed in the div with a class of `youtube-feed`.

```javascript
jQuery(function($){
	jQuery('.youtube-feed').youtubeFeed({
		//ID of the channel to pull in
		channelId: 'ChannelIdHere', 
		//API Key
		key: 'ApiKeyHere', 
		//Number of videos to return (number per page if "pager" is set to true)
		count: 9, 
		//include Next and Previous page buttons to asynchronously load more videos
		pager: true, 
		//Previous Page Text
		prevPageText: 'Previous Page',
		//Next Page Text
		nextPageText: 'Next Page',
		//Append autoplay to video embed url
		autoplay: false,
		//HTML pattern for the output
		pattern: '<div class="yt-placeholder">' +
					'<a href="{{VideoEmbedUrl}}" class="yt-url">' +
						'<img class="yt-thumb" src="{{Thumbnail}}">' +
					'</a>' +
				'</div>'
	},
	function(){
		//Optional callback
		console.log('youtube loaded');
	});
});
```

## Pattern Tokens

The HMTL output for each item that is returned can be defined using the `pattern` attribute in the function call. The following tokens can be used in the pattern:

| Token | Example Output</div>
| --- | --- |
| {{Title}} | Content Title}} |
| {{Description}} | Description text. |
| {{VideoUrl}} | http://www.youtube.com/watch?v=videoId |
| {{VideoEmbedUrl}} | http://www.youtube.com/embed/videoId |
| {{Thumbnail}} | https://i.ytimg.com/vi/120x90.jpg |
| {{ThumbnailMedium | https://i.ytimg.com/vi/320x180.jpg |
| {{ThumbnailLarge}} | https://i.ytimg.com/vi/480x360.jpg|
| {{Date}} | Monday, April 11, 2016 |
| {{Month}} | April |
| {{MonthAbbreviation}} | Apr |
| {{MonthNumeric}} | 4 |
| {{DayOfTheMonth}} | 11 |
| {{DayOfTheWeek}} | Monday |
| {{DayOfTheWeekAbbreviation}} | Mon |
| {{Year}} | 2016 |


