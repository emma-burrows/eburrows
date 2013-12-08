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

