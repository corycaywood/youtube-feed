//Youtube Feed Plugin
(function($) {
$.fn.youtubeFeed = function(options, callback){
	this.each(function(){
		
		//Options
		var settings = $.extend({
			count: 9,  //Number of videos to return (number per page if "pager" is set to true)
			key: null,   //API Key
			channelId: null,   //ID number of the channel to pull in
			pager: true,  //include Next and Previous page buttons to asynchronously load more videos
			prevPageText: 'Previous Page',   //Previous Page Text
			nextPageText: 'Next Page',    //Next Page Text
			autoplay: false,  //Append autoplay to video embed url
			pattern: '<div class="yt-placeholder">' +
						'<a href="{{VideoEmbedUrl}}" class="yt-url">' +
							'<img class="yt-thumb" src="{{Thumbnail}}">' +
						'</a>' +
					'</div>'
		}, options);
		
		var container = this;
		
		//Next/Prev Buttons initialize
		var currentPage = 1,
			totalPages = 0,
			pageToken = '';
		
		//ChannelId and API key are required - return with warning if not included
		if (settings.channelId === null) {
			console.warn('YoutubeFeed Error: You must provide a Channel Id');
			return false;
		}
		if (settings.key === null) {
			console.warn('YoutubeFeed Error: You must provide an API key');
			return false;
		}
		
		//Load feed
		loadFeed();
	
	
		/*******************************
		 Functions
		*******************************/
			
			/* Load Youtube Function
			*******************************/
			function loadFeed(){
				//Clear output div
				$(container).html('');
				//Load Youtube
				$.ajax({
					dataType: "json",
					url: 'https://www.googleapis.com/youtube/v3/search?key=' + settings.key + '&channelId=' + settings.channelId + '&part=snippet,id&order=date&maxResults=' + settings.count + pageToken,
					success: function(response) {
						console.log(response);
						//Create html element for each item returned
						$.each(response.items, function(i, item) {
							$(container).append(createHtmlElement(item));
						});
						//Create Next/Prev Buttons if enabled
						if (settings.pager) {
							$(container).append(creatNextPrevButtons(response));
						}
						//Callback
						if (typeof callback == "function") {
							callback();
						}
					}
				});
			}
			
			/* Create HTML element from json object
			*******************************/
			function createHtmlElement(item) {
				//Create Date
				var dateLong = new Date(item.snippet.publishedAt);
				
				//URL
				var urlEmbed,
					urlVideo,
					videoId;
				//Create URLs - Check if this item is the channel icon (not a video)
				if (item.id.kind  == 'youtube#channel') {
					urlEmbed = 'http://www.youtube.com/channel/' + item.id.channelId;
					urlVideo = 'http://www.youtube.com/channel/' + item.id.channelId;
				} else {
					urlEmbed = 'http://www.youtube.com/embed/' + item.id.videoId + (settings.autoplay ? '?autoplay=1' : '');
					urlVideo = 'http://www.youtube.com/watch?v=' + item.id.videoId;
				}
				
				//Add pattern and replace tokens
				var element = settings.pattern
					.replace(/\{\{Title\}\}/g, typeof item.snippet.title != "undefined" ? item.snippet.title: '')
					.replace(/\{\{VideoUrl\}\}/g, typeof item.id.videoId !== "undefined" ? urlVideo : '')
					.replace(/\{\{VideoEmbedUrl\}\}/g, typeof item.id.videoId !== "undefined" ? urlEmbed : '')
					.replace(/\{\{ThumbnailLarge\}\}/g, typeof item.snippet.thumbnails.high.url !== "undefined" ? item.snippet.thumbnails.high.url: '')
					.replace(/\{\{ThumbnailMedium\}\}/g, typeof item.snippet.thumbnails.medium.url !== "undefined" ? item.snippet.thumbnails.medium.url: '')
					.replace(/\{\{Thumbnail\}\}/g, typeof item.snippet.thumbnails.default.url !== "undefined" ? item.snippet.thumbnails.default.url: '')
					.replace(/\\{\{Description\}\}/g, typeof item.snippet.description != "undefined" ? item.snippet.description: '')
					.replace(/\{\{Date\}\}/g, typeof dateLong != "undefined" ? getFullDate(dateLong) : '')
					.replace(/\{\{Month\}\}/g, typeof dateLong != "undefined" ? getMonthFull(dateLong) : '')
					.replace(/\{\{MonthAbbreviation\}\}/g, typeof dateLong != "undefined" ? getMonthAbbr(dateLong) : '')
					.replace(/\{\{MonthNumeric\}\}/g, typeof dateLong != "undefined" ? getMonthNumeric(dateLong) : '')
					.replace(/\{\{DayOfTheMonth\}\}/g, typeof dateLong != "undefined" ? dateLong.getDate() : '')
					.replace(/\{\{DayOfTheWeek\}\}/g, typeof dateLong != "undefined" ? getDayLong(dateLong) : '')
					.replace(/\{\{DayOfTheWeekAbbreviation\}\}/g, typeof dateLong != "undefined" ? getDayAbbr(dateLong) : '')
					.replace(/\{\{Year\}\}/g, typeof dateLong != "undefined" ? dateLong.getFullYear() : '');
					
				//Add class if channel icon
				if (item.id.kind  == 'youtube#channel') {
					element = $(element);
					element.addClass('channel-item');
				}

				return element;
			}
		
			/* Next and previous button functions
			*******************************/
			function creatNextPrevButtons(data) {
				var buttons = $('<div>').addClass('yt-buttons');
				//Setup page numbers
				if (data.prevPageToken !== null || data.nextPageToken !== null){
					totalPages = Math.ceil(data.pageInfo.totalResults / data.pageInfo.resultsPerPage);
				}
				//Previous Button
				if (data.prevPageToken !== null) {
					$('<div>')
					.addClass('prev-btn')
					.html('<a href="#" data-href="' + data.prevPageToken + '">' + settings.prevPageText + '</a>')
					.on('click', changePage)
					.appendTo(buttons);
				}
				//Next Button
				if (data.nextPageToken !== null) {
					$('<div>')
					.addClass('next-btn')
					.html('<a href="#" data-href="' + data.nextPageToken + '">' + settings.nextPageText + '</a>')
					.on('click', changePage)
					.appendTo(buttons);
				}
				//Add Page numbers
				if(totalPages > 1){
					$('<div>').addClass('yt-page').html('Page <span class="yt-current-page">' + currentPage + '</span> of <span class="yt-total-pages">' + totalPages + '</span>').appendTo(buttons);
				}
				return buttons;
			}
				//Next/Prev Buttons Click Function
				function changePage(e){
					e.preventDefault();
					var token = $('a', this).data('href');
					pageToken = '&pageToken=' + token;
					loadFeed();
					if($(this).closest('div').hasClass('next-btn')){
						currentPage++;
					} else {
						currentPage--;
					}
				}
			
			/* Date Functions 
			*******************************/
				function getMonthFull(date) {
					switch (date.getMonth()) {
						case 0:
							return 'January';
						case 1:
							return 'February';
						case 2:
							return 'March';
						case 3:
							return 'April';
						case 4:
							return 'May';
						case 5:
							return 'June';
						case 6:
							return 'July';
						case 7:
							return 'August';
						case 8:
							return 'September';
						case 9:
							return 'October';
						case 10:
							return 'November';
						case 11:
							return 'December';
					}
				}
				function getMonthAbbr(date) {
					return getMonthFull(date).substring(0, 3);
				}
				function getMonthNumeric(date) {
					return date.getMonth() + 1;
				}
				function getDayLong(date) {
					switch (date.getDay()) {
						case 0:
							return 'Sunday';
						case 1:
							return 'Monday';
						case 2:
							return 'Tuesday';
						case 3:
							return 'Wednesday';
						case 4:
							return 'Thursday';
						case 5:
							return 'Friday';
						case 6:
							return 'Saturday';
					}
				}
				function getDayAbbr(date) {
					return getDayLong(date).substring(0, 3);
				}
				function getFullDate(date) {
					return getDayLong(date) + ', ' + getMonthFull(date) + ' ' + date.getDate() + ', ' + date.getFullYear();
				}
				
	});
};
}(jQuery));