const express = require('express');

const router = express.Router();

const util = require('util');

const fs = require('fs');

const { TWO_HUND, TALKER, UTF, FOUR_OH_FOUR, TWO_OH_ONE } = require('./consts');

const { tokenValid, nameValid, ageValid, talkValid, rateValid,
    watchedAtValid } = require('./validations/talkerValid');

const readFile = util.promisify(fs.readFile);

const writeFile = util.promisify(fs.writeFile);

router.get('/', async (_req, res) => {
    readFile(TALKER, UTF).then((data) => {
        res.status(TWO_HUND).json(JSON.parse(data));
    });
});

router.get('/search', tokenValid, async (req, res) => {
    const { q } = req.query;
    readFile(TALKER, UTF).then((data) => {
        const jsonData = JSON.parse(data);
        const filteredTalkers = jsonData.filter((t) => t.name.includes(q));
        if (!q || q === '') return res.status(TWO_HUND).json(jsonData);
        if (filteredTalkers.length === 0) return res.status(TWO_HUND).json([]);
        res.status(TWO_HUND).json(filteredTalkers);
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    readFile(TALKER, UTF).then((data) => {
        const jsonData = JSON.parse(data);
        const talker = jsonData.find((t) => t.id === parseInt(id, 10));
        if (talker) {
            res.status(TWO_HUND).send(talker); 
          } else {
            res.status(FOUR_OH_FOUR).json({ message: 'Pessoa palestrante não encontrada' });
          }
    });
});

router.post('/', tokenValid, nameValid, ageValid, talkValid, rateValid,
    watchedAtValid, async (req, res) => {
    const talker = req.body;
    readFile(TALKER, UTF).then((data) => {
        const jsonData = JSON.parse(data);
        const id = JSON.parse(data).length + 1;
        Object.assign(talker, { id });
        jsonData[id - 1] = talker;
    writeFile(TALKER, JSON.stringify(jsonData), UTF, (err) => {
        if (err) console.log('Error writing file:', err);
    });
    res.status(TWO_OH_ONE).json(talker);
    });
});

router.put('/:id', tokenValid, nameValid, ageValid, talkValid, rateValid,
watchedAtValid, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    readFile(TALKER, UTF).then((data) => {
        const jsonData = JSON.parse(data);
        let updateTalker = jsonData.find((t) => t.id === parseInt(id, 10));
    updateTalker = { id: parseInt(id, 10), name, age, talk };
    jsonData.forEach((el, index) => {
        if (el.id === updateTalker.id) {
            jsonData[index] = updateTalker;
        }
    });
    writeFile(TALKER, JSON.stringify(jsonData), UTF, (err) => {
      if (err) console.log('Error writing file:', err);
    });
    res.status(TWO_HUND).json(updateTalker);
    });
});

router.delete('/:id', tokenValid, async (req, res) => {
    const { id } = req.params;
    readFile(TALKER, UTF).then((data) => {
        const jsonData = JSON.parse(data);
    const update = jsonData.filter((el) => el.id !== parseInt(id, 10));
    writeFile(TALKER, JSON.stringify(update), UTF, (err) => {
        if (err) console.log('Error writing file:', err);
    });
    res.status(TWO_HUND).json({ message: 'Pessoa palestrante deletada com sucesso' });
    });
});

module.exports = router;