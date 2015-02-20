// iLoveCoding.org homework for "Learn Node JS in a Week: Day 6"
// https://ilovecoding.org/courses/learn-node-js-in-a-week/scraper/

// dependencies
var cheerio = require('cheerio'),
    request = require('request'),
    fs      = require('fs');

// page to be scraped
var craigPage = 'http://philadelphia.craigslist.org';

// output file
var outputFile = 'output.json';

// scrape
scrape(craigPage, outputFile);

function scrape(page, output) {
    
    var allJSONdata = [];
    
    request(page + '/search/eng', function(err, res, html){
        if(!err && res.statusCode == 200) {
            var $ = cheerio.load(html);
            var allRecords = $('p.row');
            
            allRecords.each(function(index, element){
                var title       = $(element).find('a.hdrlnk').text();
                var location    = $(element).find('small').text();
                var link        = $(element).find('a.hdrlnk').attr('href');
                
                if (link.substring(0,4) != 'http') {
                    link = page + link;
                }
                            
                var tempData = {
                    title: title,
                    location: location,
                    link: link
                };

                allJSONdata.push(tempData);
            });
            
            saveData();
        }
        
        function saveData() {
            fs.writeFile(output, JSON.stringify(allJSONdata), function(err){
                if(err) throw err;
                console.log(page + ' has been scraped to ' + output);
            });
        }
        
    });
    
}