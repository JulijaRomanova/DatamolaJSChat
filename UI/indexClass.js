class Message {
    _user = 'Maria Beriozko';

    get user() {
        return this._user;
    }

    set user(user){
        this._user = user;
    }
    _count = 1;

    _generateId = () => (this._count++).toString();

    constructor(text = '', to = null, id = null, createdAt = null, author = null, isPersonal = null) {
        this._id = id || this._generateId();
        this.text = text;
        this._createdAt = createdAt || new Date();
        this._author = author || this._user;
        this.isPersonal = isPersonal ?? !!to;
        this._to = to;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        try {
            if (this._id !== id)
                throw new Error('Immutable field');
        } catch (e) {
            console.log(e.message) ;
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
        this._to = to;
        this.isPersonal = !!to;
    }

    get to() {
        return this._to;
    }
}

let m = new Message('abc');
console.log(m);
m.id = '123';
console.log(m);
m.to = 'Alina';
console.log(m);
