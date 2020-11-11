const user = 'Maria Beriozko';

const counter = (function () {
    let count = 1;
    const generateId = () => (count++).toString();
    return {
        generateId
    }
})();

class Message {

    constructor(text = '', to = null,  isPersonal = null, author = null, createdAt = null, id = null) {
        this._id = id || counter.generateId();
        this._text = text;
        this._createdAt = createdAt || new Date();
        this._author = author || user;
        this.isPersonal = isPersonal ?? (!!to);
        this._to = to;
    }

    print() {
        console.log(`${this._id} ${this.to}`)
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
            if (this.id !== id)
                throw new Error('Immutable field');

        } catch (e) {
            console.log(e.message);
        }
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(createdAt) {
        if (this._createdAt !== createdAt)
            throw new Error('Immutable field');
    }

    get author() {
        return this._author;
    }

    set author(author) {
        if (this._author !== author)
            throw new Error('Immutable field');
    }

    set to(to) {
        if(to) {
            this._to = to;
            this.isPersonal = !!to;
        }
    }

    get to() {
        return this._to;
    }

    set text(text){
        if(text){
            this._text = text;
        }
    }
    get text(){
        return this._text;
    }

    editMessage(editObj = {}){
        let {text, to} = editObj;
        this.to = to;
        this.text = text;
    }
}

class MessageList {
    _messages = [];

    constructor(messages) {
        this._messages = messages;
    }

    get (id) {
        return this._messages.find((message) => (message.id === id));
    }

    static validate (msg) {
        return !!msg.text && (msg.text.length <= 200)
    }

    add (msg) {
        const addMsg = new Message(msg.text, msg.to, msg.isPersonal);
        if(MessageList.validate(addMsg)) {
            this._messages.push(addMsg);
            return true;
        }
        return false;
    }

    edit (id, msg)  {
        const elem = this._messages.find((message) => message.id === id);
        if (elem && MessageList.validate(elem)) {
            elem.editMessage(msg);
            return true;
        }
        return false;
    };


}

let m = new Message('abc');
m.print();
console.log(m);
m.id = '123';
console.log(m);
m.to = 'Alina';
console.log(m);


const mess = [
    new Message( 'It\'s very bad...', 'Grigorchik Ann', true,
        'Beriozko Maria', new Date('2020-10-12T23:08:00') ),
    new Message('Hello!', 'Beriozko Maria', true,
        'Mironov Andrei', new Date('2020-10-12T23:00:00')),
    new Message('Hello. How are you doing ?','', false,
        'Beriozko Maria', new Date('2020-10-12T23:05:00')),
    new Message('Hello! I\'m fine! I do my homework.','Beriozko Maria', true,
        'Holubev Sergei', new Date('2020-10-12T23:06:00')),
    new Message('I\'m feel bad and I wont sleep....','Beriozko Maria', true,
        'Grigorchik Ann', new Date('2020-10-12T23:07:00')),
    new Message('I think everything will be fine soon. We\'ll take a walk tomorrow.',
        'Grigorchik Ann', true,
        'Borisevich Daria', new Date('2020-10-12T23:10:00')),
    new Message('I would like to go to the cinema','', false,
        'Gaponenko Arina', new Date('2020-10-12T23:09:00')),
    new Message('I think we\'ll go to cinema tomorrow. Kate, are you going with us?',
        '', false, 'Grigorchik Ann', new Date('2020-10-12T23:12:00')),
    new Message('Sure. Sergey and I will there!','Ivanova Katya', true,
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
];

const messages = new MessageList(mess);
console.log(messages);
console.log(messages.get('2'));
messages.add({text: 'Good day, deer!', to: 'Grigorchik Ann'});
console.log(messages);
console.log(messages.edit('2', {text: 'Good morning, deer!'}));
console.log(messages.get('2'));
