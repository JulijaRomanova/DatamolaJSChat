const user = 'Beriozko Maria';

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
            if (this.id !== id) { throw new Error('Immutable field'); }
        } catch (e) {
            console.log(e.message);
        }
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(createdAt) {
        try {
            if (this._createdAt !== createdAt) { throw new Error('Immutable field'); }
        } catch (e) {
            console.log(e.message);
        }
    }

    get author() {
        return this._author;
    }

    set author(author) {
        try {
            if (this._author !== author) { throw new Error('Immutable field'); }
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
        msgs.filter((msg) => (MessageList.validate(msg)
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
        if(messages.length === 0){
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

    static _abilityToView(message) {
        return (message.author === this.user || message.to === this.user || message.to === '');
    }

    getPage(skip = 0, top = 10, filterConfig = null) {
        return Object
            .assign([], this.messages)
            .filter((message) => MessageList._abilityToView(message))
            .filter((message) => (filterConfig
                ? Object.keys(filterConfig)
                    .map((key) => MessageList._checkFilter(message, filterConfig, key))
                    .reduce((result, key) => result && key)
                : true))
            .sort(MessageList._dateComparatorDesc)
            .slice(skip, skip + top);
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
try {
    const messages = new MessageList(mess);
    console.log('All msgs: ', messages);

    console.log('Change id = 1');
    messages.get('1').id = 'Bad id';
    console.log('Get with id =\'2\'', messages.get('2'));

    console.log('Add message with parameters {text: \'Good day, deer!\', to: \'Grigorchik Ann\'}');
    messages.add({ text: 'Good day, deer!', to: 'Grigorchik Ann' });
    console.log(messages.get('22'));

    console.log('Edit with author !== user');
    console.log(messages.edit('2', { text: 'Good morning, deer!' }));
    console.log(messages.get('2'));

    console.log('Edit with author === user');
    console.log(messages.edit('3', { text: 'Good morning, deer!' }));
    console.log(messages.get('3'));

    console.log('Remove msg with id = 2 and user !== author');
    console.log(messages.remove('2'));
    console.log(messages.get('2'));

    console.log('Remove msg with id = 3 and user === author');
    console.log(messages.remove('3'));
    console.log(messages.get('3'));

    console.log('filterConfig{ text: \'+\', dateTo: new Date(\'2020-11-10T23:16:50\')}',
        messages.getPage(0, 10, { text: '+', dateTo: new Date('2020-11-10T23:16:50') }));

    console.log('Clear');
    messages.clear();
    console.log(messages);

    console.log('addAll. No valid messages:', messages.addAll(mess));
    console.log(messages);
} catch (e) {
    console.log(e.message);
}
