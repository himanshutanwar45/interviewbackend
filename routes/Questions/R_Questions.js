const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const M_Questions = require('../../models/Interview/M_Questions')
const M_UsersQuestion = require('../../models/Interview/M_UsersQuestion')
const M_CreateUser = require('../../models/Login/M_CreateUser')
const fetchuser = require('../../middleware/fetchuser')

//Route 1  :::::::Add new Questions :::::::::POST :: '/api/questions/addquestions' 
router.post('/addquestions', [
    body('question', 'Enter Question').isLength({ min: 5 }),
    body('answer', 'Enter Answer').isLength({ min: 5 })
], fetchuser ,async (req, res) => {
    let success = false;

    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.status(200).json({ success, error: result.errors[0].msg })
    }

    try {
        const { question, answer, types } = req.body

        if (types === '-1') {
            return res.status(200).json({ success, error: `Please select correct type` })
        }

        const updateEntry = {
            isAnswered: "Answer Available"
        };

        const updatedQuestion = await M_UsersQuestion.findOneAndUpdate({ questions: question }, { $set: updateEntry }, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ success, error: 'Question not found in users question collection' });
        }

        await M_Questions.insertMany({
            questions: question,
            answers: answer,
            types: types
        })

        res.send({ success: true, error: "Operation Successfully" })

    } catch (error) {
        res.status(500).json({ success, error: `Contact Admin ${error.message}` });
    }
})


//Route 2 :::::::::::::::::Get All Question :::::::: POST: '/api/questions/getquestion'
router.post('/getquestions', async (req, res) => {
    try {
        const { types } = req.body

        const query = {
            types: types
        }

        const result = await M_Questions.find(query).sort({ createdDate: 1 })

        res.send(result)


    } catch (error) {
        res.status(500).json({ success, error: `Contact Admin ${error.message}` });
    }
})


//Route 3 :::::::::::::::Add Users Questions ::::::::POST '/api/questions/adduserquestions'
router.post('/adduserquestions', [
    body('question', 'Enter Questions').isLength({ min: 1 })
], fetchuser, async (req, res) => {
    let success = false;

    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.status(200).json({ success, error: result.errors[0].msg })
    }

    try {
        const { question, types } = req.body

        const currentUser = req.user.id

        if (types === '-1') {
            return res.status(200).json({ success, error: `Please select correct type` })
        }

        await M_UsersQuestion.insertMany({
            questions: question,
            types: types,
            isAnswered: "",
            link: "",
            createdBy: currentUser,
            updatedBy: currentUser
        })

        res.send({ success: true, error: "Operation Successfully" })

    } catch (error) {
        res.status(500).json({ success, error: `Contact Admin ${error.message}` });
    }
})


//Router 4 ::::::::::::::Get Users questions ::::::::POST '/api/question/getuserquestions'
router.post('/getuserquestions', fetchuser, async (req, res) => {
    try {

        const { types } = req.body;

        const currentUser = req.user.id;

        const query = {
            types: types,
            createdBy: currentUser
        }

        const result = await M_UsersQuestion.find(query).sort({ createdDate: 'desc' });

        res.send(result);

    } catch (error) {
        res.status(500).json({ success, error: `Contact Admin ${error.message}` });
    }
})


//Router 5 ::::::::::::::Get All Users questions ::::::::POST '/api/question/getuserquestions'
router.post('/getalluserquestions', fetchuser, async (req, res) => {
    let success = false;
    try {
        const { types } = req.body;

        const query = {
            types: types,
            isAnswered: { $eq: "" }
        };

        const allUserQuestions = [];

        const results = await M_UsersQuestion.find(query);

        for (let i = 0; i < results.length; i++) { 

            const userId = results[i].createdBy;

            const user = await M_CreateUser.findById(userId);

            if (user) {
                allUserQuestions.push({
                    types: results[i].types,
                    questions: results[i].questions,
                    userName: user.name 
                });
            }
        }

        res.send(allUserQuestions);

    } catch (error) {
        res.status(500).json({ success, error: `Contact Admin ${error.message}` });
    }

})



module.exports = router;