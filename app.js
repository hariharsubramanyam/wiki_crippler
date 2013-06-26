var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    child = require('child_process');

var app = express(),
    config = null;

fs.readFile('serverconfig.json', { 'encoding': 'utf8' }, function(err, data) {
  if (err) throw err;
  config = JSON.parse(data);

  setupExpress(function() {
    if (config.hostname !== '') {
      console.log('Listening on port ' + config.port + ' and hostname '
        + config.hostname);
      app.listen(config.port, config.hostname);
    } else {
      console.log('Listening on port ' + config.port);
      app.listen(config.port);
    }
  });

});

function setupExpress(cb) {
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/Public'));

  app.get('/api/mission', function(req, res) {
    var wikiURL = getWikiURL(req.query.title);
    isValidPage(wikiURL, function(err, isValid) {
      res.set('Content-Type', 'application/json');
      if (err || !isValid) {
        res.send('{"success": "false"}');
      } else {
        getLinks(wikiURL, function(err, jsonObject) {
          if (err) {
            console.err(err);
            res.send('{"success": "false"}');
          } else {
            res.send(JSON.stringify({
              'success': 'true',
              'goals': jsonObject.goals
            }));
          }
        });
      }
    });
  });
  app.get('/api/fetchpage', function(req, res){
	request(req.query.url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		    console.log("Success");
		    res.set('Content-Type', 'application/json');
		    res.send('{"success": "true", "data": ' + body + "}");
		}
		else {
			console.log("Error");
			res.set('Content-Type', 'application/json');
			res.send('{"success: "false"}');
		}
	});
});

  cb();
}

function getPageContents(wikiPageURL, cb) {
  request(req.query.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(null, body);
    }
    else {
      cb(error || '404 encountered');
    }
  });
}

function getWikiURL(pageTitle) {
  return 'http://www.wikipedia.org/wiki/' + pageTitle.replace(' ', '_');
}

function isValidPage(wikiPageURL, cb) {
  getPageContents(function(err, pageContents) {
    if (!err) {
      cb(null, !/Wikipedia does not have an article with this exact name/.search(
        pageContents));
    } else {
      cb(err);
    }
  });
}

function getRandomPath(endPoint, cb) {
  // Michael Wu's stuff
  cb(null, '{"hello": "world", "endpoint": "' + endPoint + '"}');
}

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function getPathLinks(pageTitle, cb) {
  child.exec('WikiCrawler.py', function(err, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.err('stderr: ' + stderr);
    if (err !== null) {
      console.log('exec error: ' + error);
      cb(err);
    } else {
      cb(null, JSON.parse(stdout));
    }
  });
}
