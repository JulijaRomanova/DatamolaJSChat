let user = 'Beriozko Maria';


class Message {
    constructor(text = '', to = null, isPersonal = null, author = null, createdAt = null, id = null) {
        this._user = user;
        this._id = id || Message.generateMsgId();
        this._text = text;
        this._createdAt = createdAt || new Date();
        this._author = author || this.user;
        this.isPersonal = isPersonal ?? (!!to);
        this._to = to || '';
    }
    static generateMsgId(){
        return `msg-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(32)}`;
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

    editMessage(text, to) {
        this.to = to;
        this.text = text;
    }
}

class MessageList {
    constructor(messages) {
        this._messages = [];
        this._user = user;
        this.restore(messages);
    }

    addAll(msgs) {
        const noValidMsgs = [];
        let mess;
        msgs.forEach((msg) => {
            mess = new Message(msg._text, msg._to, msg.isPersonal,
                msg._author, new Date(msg._createdAt), msg._id);
            if (MessageList.validate(mess)) {
                this._messages.push(mess)
            } else {
                noValidMsgs.push(mess);
            }
        });
        this.save();
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

    add(text, to) {
        let addMsg = new Message(text, to);
        if (MessageList.validate(addMsg)) {
            this.messages.push(addMsg);
            this.save();
            return true;
        }
        return false;
    }

    _isUser(id, msgIndex) {
        return (this.user && (msgIndex !== -1) && (this.user === this.messages[msgIndex].author));
    }

    edit(id, text, to) {
        const msgIndex = this.messages.findIndex((message) => message.id === id);
        if (!this._isUser(id, msgIndex)) return false;
        const elem = new Message({ ...this.messages[msgIndex] });
        elem.editMessage(text, to);

        if (MessageList.validate(elem)) {
            this.messages[msgIndex].editMessage(text, to);
            this.save();
            return true;
        }
        return false;
    }

    remove(id) {
        const msgIndex = this.messages.findIndex((message) => message.id === id);
        if (!this._isUser(id, msgIndex)) return false;
        this.messages.splice(msgIndex, 1);
        this.save();
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

    lenghtShowMsgs(){
        return this.getPage(0, this.messages.length).length
    }

    save() {
        const serializedMsgs = JSON.stringify(this.messages);
        localStorage.setItem('Messages', serializedMsgs);
    }


    restore(mess) {
        const items = localStorage.getItem('Messages');
        try {
            this.clear();
            this.addAll(JSON.parse(items) || mess);
        } catch (e) {
            this.messages = [];
        }
    }
}

class UserList {
    constructor(users, activeUsers) {
        this._users = users;
        this._activeUsers = activeUsers;
        this.restore(users);
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

    isUser(userName){
        return this.users.includes(userName);
    }

    addUser(userName){
        this.users.push(userName);
        this.save();
    }

    static generateId(){
        return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(32);
    }

    save() {
        const serializedUsers = JSON.stringify(this.users);
        localStorage.setItem('Users', serializedUsers);
    }


    restore(users) {
        const items = localStorage.getItem('Users');
        try {
            this.users = (JSON.parse(items) || users);
        } catch (e) {
            this.users = [];
        }
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
        const msgId = msg.id.replace('msg-', '');
        el.querySelector('.message').classList.add(MessagesView.isMainUserMessage(msg));
        if (msg.author === user) {
            el.querySelector('.message-edit').id = `edit-${msgId}`;
            el.querySelector('.message-delete').id = `delete-${msgId}`;
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
                const usrId = UserList.generateId();
                const el = userTpl.content.cloneNode(true);
                el.querySelector('.short-name').textContent = usr.charAt(0);
                el.querySelector('#user-name').textContent = usr;
                if (!isActive) {
                    el.querySelector('.create-new-mess').classList.add('no-visible')
                } else { el.querySelector('.create-new-mess').id = `new-mess-${usrId}` }
                el.querySelector('.user').id = `user-${usrId}`;
                fr.appendChild(el);
            }
        });
        users.appendChild(fr);
    }

    _clearAllUsers() {
        const users = document.getElementById(this.containerId);
        while (users.firstChild) {
            users.removeChild(users.firstChild);
        }
    }

    visibleUsers(){
        const users = document.getElementById(this.containerId);
        users.style.visibility = (users.style.visibility === 'visible') ? 'hidden' : 'visible';
        return users.style.visibility;
    }
    display(noActiveUsers, activeUsers) {
        this._clearAllUsers();
        if(this.visibleUsers() === 'visible') {
            this._addUsers(activeUsers, true);
            this._addUsers(noActiveUsers, false);
        }
    }

}

class ChatController{
    constructor(msgs, users, activeUsers){
        this.skip = 0;
        this.top = 10;
        this.mMsgs = new MessageList(msgs);
        this.vMsgs = new MessagesView('msgs-container');
        this.mUsers = new UserList(users, activeUsers);
        this.vUsers = new UsersView('users');
        this.vHeader = new HeaderView('user-header');

        this.doFilter = this.doFilter.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.addSpecialMessage = this.addSpecialMessage.bind(this);
        this.usersVsFilters = this.usersVsFilters.bind(this);
        this.editRemoveMsg = this.editRemoveMsg.bind(this);
        this.getMore = this.getMore.bind(this);
        this.login = this.login.bind(this);

        document.forms.login.addEventListener('submit', this.login);
        document.querySelector('#second-btn-log').addEventListener('click', this.login);
        const msgsContainer = document.querySelector('#msgs-container');
        msgsContainer.addEventListener('click', this.editRemoveMsg);
        msgsContainer.addEventListener('scroll', this.getMore);
        const sender = document.getElementById('sender');
        sender.addEventListener('click', this.addMessage);

        document.getElementById('addition-btn').addEventListener('click',this.usersVsFilters);
        document.body.addEventListener('keydown', this.addMessage);
        document.querySelector('.users').addEventListener('click', this.addSpecialMessage);

        document.forms.filters.addEventListener('submit', this.doFilter);
    }

    setCurrentUser (userMain) {
        this.mUsers.user = userMain;
        this.vHeader.display(userMain);
        user = userMain;
    };

    static noIsUsers(){
        document.querySelector('#first-btn-log').innerText = 'Sign Up';
        document.querySelector('#second-btn-log').innerText = 'Login';
        document.querySelector('#rep-pass-block').style.visibility = 'visible';
    }
    static addNewUser(){
        const userName = document.forms.login.name.value;
        if(userName) this.mUsers.addUser(userName);
        document.querySelector('#first-btn-log').innerText = 'Login';
        document.querySelector('#second-btn-log').innerText = 'Sign Up';
        document.querySelector('#rep-pass-block').style.visibility = 'hidden';
    }

    login(event){
        event.preventDefault();
        if(event.target.id !== 'login' && event.target.id !== 'second-btn-log') return;
        const user = document.forms.login.name.value;
        if(event.target.id === 'login' && this.mUsers.isUser(user)){
            document.querySelector('.login').style.display = 'none';
            document.querySelector('.main-page').style.display = 'flex';
            this.setCurrentUser(user);
            this.showMessages(this.skip, this.top);
        } else if (document.querySelector('#second-btn-log').outerText === 'Sign Up'){
            ChatController.noIsUsers();
        } else if(document.querySelector('#second-btn-log').outerText === 'Login'){
            ChatController.addNewUser();
        }

    }
    showMessages(skip = 0, top = 10, filterConfig) {
        this.vMsgs.display(this.mMsgs.getPage(skip, top, filterConfig));
        const cont = document.getElementById('msgs-container');
        cont.scrollTop = cont.scrollHeight;
    }

    addSpecialMessage(event){
        if(event.currentTarget.id !== 'users') return;
        document.querySelector('.to').textContent = `To: ${event.target.parentNode.children[1].textContent}`;
        document.querySelector('.to').style.visibility = 'visible';
        this.vUsers.visibleUsers();
    }

    addMessage(event) {
        if(event.target.id !== 'sender' && !(event.key === 'Enter' && event.shiftKey)) return;
        const textArea = document.getElementsByTagName('textarea')[0];
        let to = document.querySelector('.to');
        let toText = to.textContent.replace('To: ', '');
        const editMode = document.querySelector('.edit-mode');
        if(editMode.style.display === 'block'){
            this.editMsg(editMode.id.replace('edit-mode', 'msg'), textArea.value, toText);
            editMode.style.display = 'none';
        } else if (textArea.value && this.mMsgs.add(textArea.value, toText)) {
            this.vMsgs.display(this.mMsgs.getPage(this.skip, this.top));
            const cont = document.getElementById('msgs-container');
            cont.scrollTop = cont.scrollHeight;
        }
        to.style.visibility = 'hidden';
        textArea.value = '';
    }

    removeMsg(event){
        if (this.mMsgs.remove(event.target.id.replace('delete','msg'))) {
            this.vMsgs.display(this.mMsgs.getPage(this.skip, this.top));
        }
    }
    editMsg(id, text, to){
        if (this.mMsgs.edit(id, text, to)) {
            this.vMsgs.display(this.mMsgs.getPage(this.skip, this.top));
        }
    }

    editRemoveMsg(event) {
        if(event.target.className.includes('message-edit')){
            const partId = event.target.id.replace('edit','');
            const idMsg = `msg${partId}`;
            document.querySelector('.edit-mode').style.display = 'block';
            document.querySelector('.edit-mode').id = `edit-mode${partId}`;
            document.querySelector('textarea').value = this.mMsgs.get(idMsg).text;
            document.querySelector('.to').style.visibility = 'visible';
            document.querySelector('.to').textContent = `To: ${this.mMsgs.get(idMsg).to}`;
        } else if(event.target.className.includes('message-delete')){
            this.removeMsg(event);
        }
    }


    usersVsFilters(event){
        if(event.target.id  === 'btn-users' || event.target.parentElement.id === 'btn-users') {
            this.vUsers.display(this.mUsers.noActiveUsers, this.mUsers.activeUsers);
        } else if (event.target.id  === 'btn-filters' || event.target.parentElement.id === 'btn-filters'){
            const filters = document.querySelector('.filters');
            filters.style.visibility = (filters.style.visibility === 'visible') ? 'hidden' : 'visible';
        }
    }

    static fillFilterConfig(author, text, date){
        const filterConfig = {};
        if(author) filterConfig.author = author;
        if(text) filterConfig.text = text;
        if(date) {
            const choice = new Date(date);
            filterConfig.dateFrom = new Date(choice.setHours(0,0,0,0));
            filterConfig.dateTo = new Date(choice.getFullYear(),
                choice.getMonth(), choice.getDate() + 1);
        }
        return filterConfig;
    }
    doFilter(event){
        event.preventDefault();
        const author = event.currentTarget.userName.value;
        const text = event.currentTarget.textMsg.value;
        const date = event.currentTarget.dateMsg.value;
        const filterConfig = ChatController.fillFilterConfig(author, text, date);
        document.forms.filters.reset();
        this.vMsgs.display(this.mMsgs.getPage(this.skip, this.top, filterConfig));
        document.querySelector('.filters').style.visibility = 'hidden';

    }

    getMore(){
        const cont = document.getElementById('msgs-container');
        if(cont.scrollTop === 0){
            if(this.mMsgs.lenghtShowMsgs() > this.top) {
                this.top += 10;
                cont.style['scroll-behavior'] = 'smooth';
                this.vMsgs.display(this.mMsgs.getPage(this.skip, this.top));
                cont.scrollTop = cont.offsetHeight;
            }
        }
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

const users = ['Gaponenko Arina', 'Grigorchik Ann', 'Alhimenok Valeria',
    'Beriozko Maria', 'Holubev Sergei', 'Mironov Andrei', 'Borisevich Daria', 'Ivanova Katya'];
const activeUsers = ['Beriozko Maria', 'Holubev Sergei', 'Mironov Andrei', 'Borisevich Daria'];

const Controller = new ChatController(mess, users, activeUsers);
