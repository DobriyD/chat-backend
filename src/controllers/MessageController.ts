import express from 'express';
import { MessageModel } from "../models";

class MessageController {

    index(req: express.Request, res: express.Response) {
        const dialogId: string = req.query.dialog;

        MessageModel.find()
            .or([{ dialog: dialogId }])
            .populate(["dialog"])
            .exec(function (err, messages) {
                if (err) {
                    return res.status(404).json({
                        message: "Messages not Found"
                    });
                }
                return res.json(messages)
            });

    }
    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        MessageModel.findByIdAndRemove({_id: id})
            .then((message) => {
                if (message) {
                    res.json({
                        message: `Message deleted`
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: "Message not found",
                });
            });
        };

    getMe() {
        //...TODO
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            text: req.body.text,
            user: req.body.user,
            dialog: req.body.dialog_id,
        };
        const message = new MessageModel(postData);

        message.save().then((obj: any) => {
        res.json(obj);
    }).catch(reason => {
        res.json(reason)
    })

    }
}

export default MessageController;
