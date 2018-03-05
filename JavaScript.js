var requri = 'https://api.github.com/users/emma-burrows';

$(document).ready(function () {

  getGitInfo(requri, writeGitInfo);

});

// GITHUB
function writeGitInfo(gitinfo) {
  $('#profile').attr('href', gitinfo.profile);
  $('#avatar').attr('src', gitinfo.avatar);

  if (gitinfo.reponum > 0) {
    $("#repos > ul").remove();
    var outhtml = '<strong>' + gitinfo.reponum + ' repositories:</strong>';
    getGitRepos(requri + '/repos', function (repos) {
      var forked = repos.forked,
          notforked = repos.notforked;

      outhtml += '<p>Projects I created:</p> <ul>';

      $.each(notforked, function (index) {
        outhtml += '<li><a href="' + notforked[index].html_url + '" target="_blank">' + notforked[index].name + '</a> - ' + notforked[index].description + '</li>';
      });
      outhtml += '</ul>';

      outhtml += '<p>Other projects I have collaborated on or forked for training or research purposes:</p> <ul>';

      $.each(forked, function (index) {
        outhtml += '<li><a href="' + forked[index].html_url + '" target="_blank">' + forked[index].name + '</a> - ' + forked[index].description + '</li>';
      });
      outhtml += '</ul>';
      $('#repos').append(outhtml);
    });
  }
}

// Performs an ajax call to get basic info from the GitHub API
function getGitInfo(requri, callback) {
  $.ajax({
    url: requri,
    dataType: "json",
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
    dataType: "json",
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
