const models = require('../models');
const Domo = models.Domo;

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.level) {
        return res.status(400).json({ error: 'Name, age, and level are all required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'Am error occured making domo!' });
    }
};

const getStats = async (req, res) => {
    try {
        const ownerId = req.session.account._id;
        const domos = await Domo.find({ owner: ownerId }).select('level');

        const totalDomos = domos.length;
        const totalLevels = domos.reduce((sum, d) => sum + d.level, 0);

        return res.json({ totalDomos, totalLevels });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'Error fetching statistics ' });
    }
};

const makerPage = (req, res) => {
    return res.render('app');
};

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age level').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    getStats,
};