import express from 'express';
import { DialogModel, MessageModel } from "../models";

class DialogController {

    index(req: express.Request, res: express.Response) {
        const authorId: string = req.query.authorId;

        DialogModel.find({ author: authorId })
            // .or([{author: id}])
            .populate(["author", "partner"])
            .exec(function (err, dialogs) {
                if (err) {
                    return res.status(404).json({
                        message: "Dialog not Found"
                    });
                }
                return res.json(dialogs)
            });

    }

    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        DialogModel.findByIdAndRemove({_id: id})
            .then((dialog) => {
                if (dialog) {
                    res.json({
                        message: `Dialog deleted`
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: "Dialog not found",
                });
            });
    };

    getMe() {
        //...TODO
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        };
        const dialog = new DialogModel(postData);

        dialog.save().then((dialogObj: any) => {
            const message = new MessageModel({
                text: req.body.text,
                dialog: dialogObj._id,
                user: req.body.author
            });

            message.save().then(() => {
                res.json(dialogObj);
            }).catch(reason => {
                res.json(reason)
            });
        }).catch((err) => {
            res.json({
                status: 'error',
                message: err
            });
        });
    }
}

export default DialogController;
