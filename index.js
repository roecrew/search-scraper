const request = require('request');
const cheerio = require('cheerio');
const argv = require('minimist')(process.argv.slice(2), {});

var options = {url: 'https://kgsearch.googleapis.com/v1/entities:search?query=' + argv._[0] + '&key=AIzaSyAaBLhs1pKLTQyGD8CT0N4CSeqM2q-6G7s&limit=1&indent=True'};
var psoptions = {url: 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=' + argv._[0] + '&strategy=mobile&key=AIzaSyAaBLhs1pKLTQyGD8CT0N4CSeqM2q-6G7s'};
var wikioptions = {url: 'https://en.wikipedia.org/wiki/' + argv._[0]};

if(argv.t){options.url+='&types='+argv.t};

request(options, function(error, response, html) {
	if(!error) {
		var $ = cheerio.load(html);
		//console.log(html);
		if(JSON.parse(html).itemListElement[0] !== undefined) {
			if(JSON.parse(html).itemListElement[0].result.detailedDescription !== undefined) {
				console.log('\n'+JSON.parse(html).itemListElement[0].result.detailedDescription.articleBody+'\n');
			}
		}
	}
});

if(argv._[0].indexOf('http://') > -1 || argv._[0].indexOf('https://') > -1) {
	request(psoptions, function(error, response, html) {
		if(!error) {
			//console.log(html);
			var json = JSON.parse(html);
			console.log('\nSpeed: '+json.ruleGroups.SPEED.score+'/100\nUsability:'+json.ruleGroups.USABILITY.score+'/100\n');
		}
	});
}

request(wikioptions, function(error, response, html) {
	var $ = cheerio.load(html);
	console.log($('.mw-parser-output p').eq(0).text());
});