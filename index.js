// will use cherrio (similar to jQuery)

const PORT = process.env.PORT || 8080
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const info = [
    {
        name: 'techcrunch',
        address: 'https://techcrunch.com/',
    },

    { 
        name: 'cnbc',
        address: 'https://www.cnbc.com/technology/',
    },

    {
        name: 'yc',
        address: 'https://news.ycombinator.com/'
    },

    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/uk/technology'
    }

]

const articles = []

info.forEach(info => {
    axios.get(info.address)
        .then(response => {

            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("")', html).each(function () {
                const title = $(this).text().trim();
                const url = $(this).attr('href');

                // Filter titles with (nums) or more words
                if (title.split(/\s+/).length >= 4) {
                    articles.push({
                        title,
                        url,
                        source: info.name
                    });
                }
            });
        })
        .catch(err => {
            console.error(`Error fetching ${info.address}:`, err);
        });
});

app.get('/', (req, res) => {
    res.json('Welcome to hell')
});


app.get('/news', (req, res) => {
    res.json(articles)
});

app.get('/news/:infoId', async (req, res) => {

    const infoId = req.params.infoId

    const infoAddress = info.filter(infos => infos.name == infoId)[0].address
    const infoName = info.filter(infos => infos.name == infoId)[0].name

    axios.get(infoAddress)
    .then(response => {

        const html = response.data;
        cheerio.load(html)
        const $ = cheerio.load(html)

        const specificArticles = []
        
        $('a:contains("")', html).each(function () {

            const title = $(this).text().trim()
            const url = $(this).attr('href')
            
            if (title.split(/\s+/).length >= 4){
                specificArticles.push({
                    title,
                    url: infoName + url,
                    source: infoId
                })
            }
        })
        res.json(specificArticles)

    }).catch(err => console.log(err))
})


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });

