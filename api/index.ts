require('dotenv').config();

const express = require('express');
const cors = require('cors')
const app = express();

const path = require('path');


app.use(express.static('public'));

app.get('/', function (req, res) {
	res.send('Deployed')
});

app.use(cors({origin: 'https://create-react-app-latest-version.vercel.app'}))

var filesRead = 0;
const files = ['students.json', 'students2.json', 'students3.json']
const studentData = []

function searchStr (nameStr, limit) {
    nameStr = nameStr.toLowerCase()
    let results = []
    for(let i0=0; i0<studentData.length && results.length < limit; i0++){
        if(studentData[i0].name.toLowerCase().startsWith(nameStr)) {
            results.push(studentData[i0])
        }
    }

    for(let i0=0; i0<studentData.length && results.length< limit; i0++){
        if(studentData[i0].name.toLowerCase().includes(nameStr) && !results.find(it => it.name === studentData[i0].name)){
            results.push(studentData[i0])
        }
    }

    return results;
}
const fs = require('fs').promises;
app.get('/search/name/:nameStr/:limit', async(req, res) => {
    let nameStr = req.params.nameStr
    let limit = req.params.limit

    let results = searchStr(nameStr, limit)

    while(results.length < limit && filesRead < files.length){
        console.log(".....loading new file")

        let data = await fs.readFile(path.join(__dirname, '..', 'components', files[filesRead++]), 'utf8');
        let dataJSON = JSON.parse(data)
        studentData.push(...dataJSON)
        results = searchStr(nameStr, limit)
    }

    res.send(JSON.stringify(results))
})

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
