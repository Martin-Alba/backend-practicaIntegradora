import { Router } from "express";
import msgModel from "../dao/models/messages.model.js";
const router = Router()

router.get('/', async (req, res) => {
    const messages = await msgModel.find().lean().exec()
    res.render('chat', {
        messages
    })
})

router.post('/', async (req, res) => {
    const msgNew = req.body
    const msgSend = new msgModel(msgNew)
    await msgSend.save()
})

export default router