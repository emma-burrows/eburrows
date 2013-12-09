var requri = 'https://api.github.com/users/emma-burrows',
    codeproject = 'http://www.codeproject.com/WebServices/ArticleRSS.aspx?amid=761050',
    codeschool = 'https://www.codeschool.com/users/124271.json';

$(document).ready(function () {

  collapsibleH1();

  getGitInfo(requri, writeGitInfo);

  getCodeProjectArticles(codeproject, writeCodeProject);

  getCompletedCodeSchool(codeschool, writeCodeSchool);

});

function collapsibleH1() {
  var allH1 = $('#bodydiv section h1');

  allH1
    .prepend('<span>▲</span>')
    .attr('title', 'Click to collapse');

  $('#bodydiv section h1').click(function (event) {
    var content = $(this).next('.content'),
        h1 = $(this);

    if (content.is(':hidden')) {
      content.slideDown('slow');
      h1.children('span').remove();
      h1.prepend('<span>▲</span>')
        .attr('title', 'Click to collapse');
    }
    else {
      content.slideUp('slow');
      h1.children('span').remove();
      h1.prepend('<span>▼</span>')
        .attr("title", 'Click to expand');
    }
    // Stop the link click from doing its normal thing
    event.preventDefault();
  });
}

function writeGitInfo(gitinfo) {
  $('#profile').attr('href', gitinfo.profile);
  $('#avatar').attr('src', gitinfo.avatar);

  if (gitinfo.reponum > 0) {

    var outhtml = '<strong>' + gitinfo.reponum + ' repositories:</strong>';
    getGitRepos(requri + '/repos', function (repos) {
      var forked = repos.forked,
          notforked = repos.notforked;

      outhtml += '<p>Projects I created:</p> <ul>';

      $.each(notforked, function (index) {
        outhtml += '<li><a href="' + notforked[index].html_url + '" target="_blank">' + notforked[index].name + '</a> - ' + notforked[index].description + '</li>';
      });
      outhtml += '</ul>';

      outhtml += '<p>Other projects I have collaborated on:</p> <ul>';

      $.each(forked, function (index) {
        outhtml += '<li><a href="' + forked[index].html_url + '" target="_blank">' + forked[index].name + '</a> - ' + forked[index].description + '</li>';
      });
      outhtml += '</ul>';
      $('#repos').html(outhtml);
    });
  }
  else {
    $('#repos').html('<i>Could not retrieve any repos</i>');
  }
}

// Performs an ajax call to get basic info from the GitHub API
function getGitInfo(requri, callback) {
  $.ajax({
    url: requri,
    complete: function (xhr) {
      var gitinfo = {
        avatar: xhr.responseJSON.avatar_url,
        profile: xhr.responseJSON.html_url,
        reponum: xhr.responseJSON.public_repos
      }
      callback(gitinfo);
    }
  });
}

// Gets repository info from GitHub, as two objects: forked and notforked
// to distinguish between my own repos and ones I've collaborated on
function getGitRepos(requri, callback) {
  $.ajax({
    url: requri,
    complete: function (xhr) {
      var json = xhr.responseJSON;
      forked = $.grep(json, function (el, idx) {
        return el.fork;
      })

      notforked = $.grep(json, function (el, idx) {
        return !el.fork;
      })
      var repos = {
        forked: forked,
        notforked: notforked
      }
      callback(repos);
    }
  });
}


// CODE PROJECT
function writeCodeProject(articles) {
  var html = '';
  $.each(articles, function (index, article) {
    html += '<li><p><a href="' + article.link + '">' + article.title + '</a><br/>' + article.description + '</li>';
  });
  $('#codeproject').empty().append(html);
}

// Retrieves CodeProject articles by feeding an author RSS 
// into the Google Feed API - this is to prevent the cross-domain
// issues I experienced when I first tested this in Firefox behind 
// a corporate proxy
// However, even with this method, either CodeProject or Google occasionally 
// lop off the ?amid=xxx, so that we only get the latest article feed - 
// so I need to check that the articles are actually mine
function getCodeProjectArticles(url, callback) {
  $.ajax({
    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    success: function (data) {
      var feed = data.responseData.feed;

      var articles = [];
      $(feed.entries).each(function (index, article) {
        if (/Emma Burrows/.test(article.author)) {
          article = {
            title: article.title,
            link: article.link,
            description: article.content,
            pubDate: article.pubDate,
            author: article.author
          }
          articles.push(article);
        }
      });
      callback(articles);
    },
    error: function (xhr, status, error) {
      articles = [
        article = {
          title: "ABC",
          link: "http://foo",
          description: "123"
        },
        article = {
          title: "DEF",
          link: "http://bar",
          description: "456"
        }
      ]
      callback(articles);
    }
  });
}


// CODE SCHOOL
function writeCodeSchool(courses) {
  var html = '';
  $.each(courses, function (index, course) {
    html += '<li><p><a href="' + course.link + '"><img width="20px" src="' + course.badge + '" alt="' + course.title + '"/>' + course.title + '</a></li>';
  });
  $('#codeschool').empty().append(html);
}

// Retrieves CodeSchool completed course 
function getCompletedCodeSchool(url, callback) {
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function (codeschool) {
      var courses = codeschool.courses.completed;
      var completed = [];
      $(courses).each(function (index, course) {
        course = {
          title: course.title,
          badge: course.badge,
          link: course.url
        }
        completed.push(course);
      });
      callback(completed);
    }
  });
}
