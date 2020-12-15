import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import BaseHandler from '../../BaseHandler';
import { TOKEN } from '../../../config/application';

export default class AuthHandler extends BaseHandler {
    done() {
        const token = jwt.sign({
            _id: uuid(),
        }, TOKEN.secret, { expiresIn: TOKEN.expires });

        this.sendJson({
            data: {
                token,
            },
        });
    }
}

