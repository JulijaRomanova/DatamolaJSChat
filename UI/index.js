let user = 'Beriozko Maria';

const Counter = (function () {
    let count = 1;
    const generateId = () => (count++).toString();
    return {
        generateId,
    };
}());

class Message {
    constructor(text = '', to = null, isPersonal = null, author = null, createdAt = null, id = null) {
        this._user = user;
        this._id = id || Counter.generateId();
        this._text = text;
        this._createdAt = createdAt || new Date();
        this._author = author || this.user;
        this.isPersonal = isPersonal ?? (!!to);
        this._to = to || '';
    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        try {
            if (this.id !== id) {
                throw new Error('Immutable field');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(createdAt) {
        try {
            if (this._createdAt !== createdAt) {
                throw new Error('Immutable field');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    get author() {
        return this._author;
    }

    set author(author) {
        try {
            if (this._author !== author) {
                throw new Error('Immutable field');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    set to(to) {
        if (to) {
            this._to = to;
            this.isPersonal = !!to;
        }
    }

    get to() {
        return this._to;
    }

    set text(text) {
        if (text) {
            this._text = text;
        }
    }

    get text() {
        return this._text;
    }

    editMessage(editObj = {}) {
        const { text, to } = editObj;
        this.to = to;
        this.text = text;
    }
}

class MessageList {
    constructor(messages) {
        this._messages = [];
        messages.forEach((msg) => (MessageList.validate(msg) ? this._messages.push(msg) : false));
        this._user = user;
    }

    addAll(msgs) {
        const noValidMsgs = [];
        msgs.forEach((msg) => (MessageList.validate(msg)
            ? this.messages.push(msg)
            : noValidMsgs.push(msg)));
        return noValidMsgs;
    }

    clear() {
        this.messages = [];
    }

    get messages() {
        return this._messages;
    }

    set messages(messages) {
        if (messages.length === 0) {
            this._messages = [];
        } else {
            messages.forEach((msg) => (MessageList.validate(msg)
                ? this._messages.push(msg) : false));
        }

    }

    set user(user) {
        this._user = user;
    }

    get user() {
        return this._user;
    }

    get(id) {
        return this._messages.find((message) => (message.id === id));
    }

    static validate(msg) {
        return !!msg.text && (msg.text.length <= 200);
    }

    add(msg) {
        const addMsg = new Message(msg.text, msg.to, msg.isPersonal);
        if (MessageList.validate(addMsg)) {
            this.messages.push(addMsg);
            return true;
        }
        return false;
    }

    _isUser(id, msgIndex) {
        return (this.user && (msgIndex !== -1) && (this.user === this.messages[msgIndex].author));
    }

    edit(id, msg) {
        const msgIndex = this.messages.findIndex((message) => message.id === id);
        if (!this._isUser(id, msgIndex)) return false;
        const elem = new Message({ ...this.messages[msgIndex] });
        elem.editMessage(msg);

        if (MessageList.validate(elem)) {
            this.messages[msgIndex].editMessage(elem);
            return true;
        }
        return false;
    }

    remove(id) {
        const msgIndex = this.messages.findIndex((message) => message.id === id);
        if (!this._isUser(id, msgIndex)) return false;
        this.messages.splice(msgIndex, 1);
        return true;
    }

    static _dateComparatorDesc(m1, m2) {
        return (m2.createdAt - m1.createdAt);
    }

    static _checkFilter(message, filterConfig, key) {
        switch (key) {
            case 'dateFrom':
                return message.createdAt >= filterConfig[key];
            case 'dateTo':
                return message.createdAt <= filterConfig[key];
            default:
                return message[key].toLowerCase().includes(filterConfig[key].toLowerCase());
        }
    }

    _abilityToView(message) {
        return (message.author === this.user || message.to === this.user || message.to === '');
    }

    getPage(skip = 0, top = 10, filterConfig = null) {
        return Object
            .assign([], this.messages)
            .filter((message) => this._abilityToView(message))
            .filter((message) => (filterConfig
                ? Object.keys(filterConfig)
                    .map((key) => MessageList._checkFilter(message, filterConfig, key))
                    .reduce((result, key) => result && key)
                : true))
            .sort(MessageList._dateComparatorDesc)
            .slice(skip, skip + top);
    }
}

class UserList {
    constructor(users, activeUsers) {
        this._users = users;
        this._activeUsers = activeUsers;
    }

    set users(users) {
        this._users = users;
    }

    get users() {
        return this._users;
    }

    set activeUsers(actUsers) {
        this._activeUsers = actUsers;
    }

    get activeUsers() {
        return this._activeUsers;
    }

    get noActiveUsers() {
        let noActiveUsers = Object.assign([], this.users);
        this.activeUsers.forEach((act) => {
            noActiveUsers.splice(noActiveUsers.indexOf(act), 1)
        });
        return noActiveUsers;
    }
}

class HeaderView {
    constructor(containerId) {
        this.containerId = containerId;
    }

    display(user) {
        const UserHeader = document.getElementById(this.containerId);
        UserHeader.innerText = user ? user.replace(' ', '\n') : 'No\nName';
    }
}

class MessagesView {
    constructor(containerId) {
        this.containerId = containerId;
    }

    static isMainUserMessage(msg) {
        return (msg.author === user)
            ? 'main-user-message'
            : 'other-message';
    }

    static isPersonalMessage(msg) {
        return msg.to === user
            ? 'special-message'
            : '';
    }

    static dNoTime(date) {
        return date.setHours(0, 0, 0, 0);
    }

    static formatDate(date) {
        const tmp = new Date(date.valueOf());
        const todayDate = new Date();
        if ((MessagesView.dNoTime(todayDate) - MessagesView.dNoTime(tmp)) === 0) {
            return date.toLocaleString().split(' ')[1];
        }
        return date.toLocaleString();
    }


    _addMessage(msg) {
        const msgTpl = document.getElementById('msg-template');
        const msgs = document.getElementById(this.containerId);
        const fr = new DocumentFragment();
        const el = msgTpl.content.cloneNode(true);
        el.querySelector('.message').id = msg.id;
        el.querySelector('.message').classList.add(MessagesView.isMainUserMessage(msg));
        if (msg.author === user) {
            el.querySelector('.message-edit').textContent = 'create';
            el.querySelector('.message-delete').textContent = 'close';
        }
        const isPersonalMsg = MessagesView.isPersonalMessage(msg);
        if (isPersonalMsg) el.querySelector('.message').classList.add(isPersonalMsg);
        el.querySelector('.short-name').textContent = msg.author.charAt(0);
        el.querySelector('.user-name').textContent = msg.author;
        el.querySelector('.text').textContent = msg.text;
        el.querySelector('.message-date').textContent = MessagesView.formatDate(msg.createdAt);
        fr.appendChild(el);
        msgs.prepend(fr);
    }

    _clearAllMessages() {
        const msgs = document.getElementById(this.containerId);
        while (msgs.firstChild) {
            msgs.removeChild(msgs.firstChild);
        }
    }

    display(msgs, oper) {
        switch (oper) {
            case 'addMsg':
                this._addMessage(msgs);
                break;
            default:
                this._clearAllMessages();
                msgs.forEach((msg) => {
                    this._addMessage(msg);
                });
                break;
        }

    }
}

class UsersView {
    constructor(containerId) {
        this.containerId = containerId;
    }

    _addUsers(list, isActive) {
        const userTpl = document.getElementById('user-template');
        const users = document.getElementById(this.containerId);
        const fr = new DocumentFragment();
        list.forEach((usr) => {
            if (usr !== user) {
                const el = userTpl.content.cloneNode(true);
                el.querySelector('.short-name').textContent = usr.charAt(0);
                el.querySelector('#user-name').textContent = usr;
                if (!isActive) el.querySelector('.create-new-mess').classList.add('no-visible');
                fr.appendChild(el);
            }
        });
        users.appendChild(fr);
    }

    display(noActiveUsers, activeUsers) {
        this._addUsers(activeUsers, true);
        this._addUsers(noActiveUsers, false);
    }

}

const mess = [
    new Message('It\'s very bad...', 'Grigorchik Ann', true,
        'Beriozko Maria', new Date('2020-10-12T23:08:00')),
    new Message('Hello!', 'Beriozko Maria', true,
        'Mironov Andrei', new Date('2020-10-12T23:00:00')),
    new Message('Hello. How are you doing ?', '', false,
        'Beriozko Maria', new Date('2020-10-12T23:05:00')),
    new Message('Hello! I\'m fine! I do my homework.', 'Beriozko Maria', true,
        'Holubev Sergei', new Date('2020-10-12T23:06:00')),
    new Message('I\'m feel bad and I wont sleep....', 'Beriozko Maria', true,
        'Grigorchik Ann', new Date('2020-10-12T23:07:00')),
    new Message('I think everything will be fine soon. We\'ll take a walk tomorrow.',
        'Grigorchik Ann', true,
        'Borisevich Daria', new Date('2020-10-12T23:10:00')),
    new Message('I would like to go to the cinema', '', false,
        'Gaponenko Arina', new Date('2020-10-12T23:09:00')),
    new Message('I think we\'ll go to cinema tomorrow. Kate, are you going with us?',
        '', false, 'Grigorchik Ann', new Date('2020-10-12T23:12:00')),
    new Message('Sure. Sergey and I will there!', 'Ivanova Katya', true,
        'Grigorchik Ann', new Date('2020-10-12T23:14:00')),
    new Message('Can we go to the theater ?', '', false,
        'Alhimenok Valeria', new Date('2020-10-12T23:15:00')),
    new Message('I was there just recently...', '', false,
        'Beriozko Maria', new Date('2020-10-12T23:16:00')),
    new Message('I like movies more than theater', '', false,
        'Holubev Sergei', new Date('2020-10-12T23:16:50')),
    new Message('Write + if you go to the cinema tomorrow at 19:00', '',
        false, 'Beriozko Maria', new Date('2020-10-12T23:17:00')),
    new Message('+', '', false,
        'Grigorchik Ann', new Date('2020-10-12T23:18:00')),
    new Message('+++', '', false,
        'Holubev Sergei', new Date('2020-10-12T23:17:30')),
    new Message('I\'m fine!\n+', '', false,
        'Gaponenko Arina', new Date('2020-10-12T23:19:00')),
    new Message('I\'m going.\n + ', '', false,
        'Mironov Andrei', new Date('2020-10-12T23:18:50')),
    new Message('+ :)', '', false,
        'Borisevich Daria', new Date('2020-10-12T23:20:00')),
    new Message('+', '', false,
        'Gaponenko Arina', new Date('2020-10-12T23:21:00')),
    new Message('Cool. +', '', false,
        'Ivanova Katya', new Date('2020-10-12T23:22:00')),
    new Message('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
];


const msgsModel = new MessageList(mess);
const userL = new UserList(['Gaponenko Arina', 'Grigorchik Ann', 'Alhimenok Valeria',
        'Beriozko Maria', 'Holubev Sergei', 'Mironov Andrei', 'Borisevich Daria', 'Ivanova Katya'],
    ['Beriozko Maria', 'Holubev Sergei', 'Mironov Andrei', 'Borisevich Daria']);

const vHeader = new HeaderView('user-header');
const vMessages = new MessagesView('msgs-container');
const vUsers = new UsersView('users');


const setCurrentUser = (user) => {
    msgsModel.user = user;
    vHeader.display(user)
};

const showMessages = (skip = 0, top = 20, filterConfig) => {
    vMessages.display(msgsModel.getPage(skip, top, filterConfig));
    const cont = document.getElementById('msgs-container');
    cont.lastElementChild.scrollIntoView({ block: 'end' });
};

const addMessage = (msg) => {
    if (msgsModel.add(msg)) {
        vMessages.display(msgsModel.getPage(0, 10));
    }
};
const editMessage = (id, msgEdit) => {
    if (msgsModel.edit(id, msgEdit)) {
        vMessages.display(msgsModel.getPage(0, 10));
    }
};
const removeMessage = (id) => {
    if (msgsModel.remove(id)) {
        vMessages.display(msgsModel.getPage(0, 10));
    }
};

const showUsers = () => {
    vUsers.display(userL.noActiveUsers, userL.activeUsers);
};

const changeVisibleUsers = () => {
    const users = document.getElementById('users');
    users.style.visibility = (users.style.visibility === 'visible') ? 'hidden' : 'visible';
};

setCurrentUser(user);
showMessages(0, 10);
addMessage(new Message('Tell me about all!', 'Grigorchik Ann', true,
   'Beriozko Maria', new Date()));
editMessage('3', { text: 'Hello. How are you?', to: 'Mironov Andrei' });
removeMessage('1');
user = 'Mironov Andrei';
setCurrentUser(user);
showMessages(0, 20);
editMessage('2', { text: 'Hello. How are you?' });
changeVisibleUsers();
showUsers();




