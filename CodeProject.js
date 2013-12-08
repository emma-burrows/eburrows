// Retrieves CodeProject articles by feeding an author RSS 
// into the Google Feed API - this is to prevent the cross-domain
// issues I experienced when I first tested this in Firefox behind 
// a corporate proxy
function getCodeProjectArticles(url, callback) {
  $.ajax({
    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    success: function (data) {
      var feed = data.responseData.feed;
      var articles = [];
      $(feed.entries).each(function (index, article) {
          article = {
            title: article.title,
            link: article.link,
            description: article.content,
            pubDate: article.pubDate,
            author: article.author
          }
          articles.push(article);
      });
      callback(articles);
    },
    error: function (xhr, status, error) {
      alert(error);
    }
  });
}