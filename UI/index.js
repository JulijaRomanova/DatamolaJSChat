let user = '';
const address = 'https://jslabdb.datamola.com';


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
        return (msg.to === user && user !== '')
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
        el.querySelector('.message').id = `msg-${msg.id}`;
        el.querySelector('.message').classList.add(MessagesView.isMainUserMessage(msg));
        if (msg.author === user) {
            el.querySelector('.message-edit').id = `edit-${msg.id}`;
            el.querySelector('.message-delete').id = `delete-${msg.id}`;
            el.querySelector('.message-edit').textContent = 'create';
            el.querySelector('.message-delete').textContent = 'close';
        }
        const isPersonalMsg = MessagesView.isPersonalMessage(msg);
        if (isPersonalMsg) el.querySelector('.message').classList.add(isPersonalMsg);
        el.querySelector('.short-name').textContent = msg.author.trim().charAt(0);
        el.querySelector('.user-name').textContent = msg.author;
        el.querySelector('.text').textContent = msg.text;
        if(msg.to && msg.to !== user) el.querySelector('.to-name').textContent = `To: ${msg.to}`;
        el.querySelector('.message-date').textContent = MessagesView.formatDate(new Date(msg.createdAt));
        fr.appendChild(el);
        msgs.prepend(fr);
    }

    _clearAllMessages() {
        const msgs = document.getElementById(this.containerId);
        while (msgs.firstChild) {
            msgs.removeChild(msgs.firstChild);
        }
    }

    display(msgs) {
        this._clearAllMessages();
        msgs.forEach((msg) => {
            this._addMessage(msg);
        });
    }
}

class UsersView {
    constructor(containerId) {
        this.containerId = containerId;
    }

    static generateId(){
        return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(32);
    }

    _addUsers(list) {
        const userTpl = document.getElementById('user-template');
        const users = document.getElementById(this.containerId);
        const fr = new DocumentFragment();
        list.forEach((usr) => {
            if (usr.name && usr.name !== user) {
                const usrId = UsersView.generateId();
                const el = userTpl.content.cloneNode(true);
                el.querySelector('.short-name').textContent = usr.name.charAt(0);
                el.querySelector('#user-name').textContent = usr.name;
                el.querySelector('.user').id = `user-${usrId}`;
                if (!usr.isActive) {
                    el.querySelector('.create-new-mess').classList.add('no-visible');
                    fr.appendChild(el);
                } else {
                    el.querySelector('.create-new-mess').id = `new-mess-${usrId}`;
                    fr.prepend(el)
                }
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

    renewUsers(users){
        this._clearAllUsers();
        this._addUsers(users);
    }

    display() {
        this.visibleUsers()
    }

}
 class ChatApiService{
    constructor(address){
        this.address = address;
    }
    static _getRequestOption( m, h, b){
        let reqOption = {
            method: m,
            headers: h,
            redirect: 'follow'
        };
        if(b){
            reqOption.body = b;
        }
        return reqOption;
    }

    static _getFormDataLogin(name, pass){
        let formData = new FormData();
        formData.append('name', name);
        formData.append('pass', pass);
        return formData;
    }
    static _getHeader(name, value){
        let h = new Headers();
        h.append(name, value);
        return h;
    }
     _makeRequest(url, method, headers, body = ''){
         console.log(url);
        let r = fetch(`${this.address}${url}`, ChatApiService._getRequestOption(method, headers, body));

        console.log(r);
         return r;
     }

    registration(name, pass){
        return this._makeRequest('/auth/register', 'POST',
            ChatApiService._getHeader('Registration', 'Bearer some.token'),
            ChatApiService._getFormDataLogin(name, pass));
    }

    login(name, pass){

        let l =  this._makeRequest('/auth/login', 'POST',
            ChatApiService._getHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`),
            ChatApiService._getFormDataLogin(name, pass));

        return l;
    }

    logout(){
    console.log('token', sessionStorage.getItem('token'));
        return this._makeRequest('/auth/logout', 'POST',
            ChatApiService._getHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`));
    }

    editMessage(id, msgEditString){

        let h = ChatApiService._getHeader('Authorization',
            `Bearer ${sessionStorage.getItem('token')}`);
        h.append('Content-Type', 'application/json');

        return this._makeRequest(`/messages/${id}`, 'PUT',
            h, msgEditString);
    }

    removeMessage(id){
        return this._makeRequest(`/messages/${id}`, 'DELETE',
            ChatApiService._getHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`));
    }

    addMessage(msgString){
        let h = ChatApiService._getHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
        h.append('Content-Type', 'application/json');

        return this._makeRequest('/messages', 'POST',
            h, msgString);
    }
    getUsers() {
        return this._makeRequest('/users', 'GET',
            ChatApiService._getHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`));

    }
    getMessages(skip, top){
        console.log(sessionStorage.getItem('token'));
        return this._makeRequest(`/messages?skip=${skip}&top=${top}`, 'GET',
            ChatApiService._getHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`));

    }
 }
class ChatController{
    constructor(){
        this.skip = 0;
        this.top = 10;
        this.api = new ChatApiService(address);
        this.vMsgs = new MessagesView('msgs-container');
        this.vUsers = new UsersView('users');
        this.vHeader = new HeaderView('user-header');
        this.useFilter = false;
        this.setCurrentUser(user);

        this.doFilter = this.doFilter.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.addSpecialMessage = this.addSpecialMessage.bind(this);
        this.usersVsFilters = this.usersVsFilters.bind(this);
        this.editRemoveMsg = this.editRemoveMsg.bind(this);
        this.getMore = this.getMore.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.loginFromChat = this.loginFromChat.bind(this);
        this.toMainPage = this.toMainPage.bind(this);

        document.forms.login.addEventListener('submit', this.login);
        document.querySelector('#second-btn-log').addEventListener('click', this.login);
        document.querySelector('.btn-logout').addEventListener('click', this.loginFromChat);
        document.querySelector('.btn-logout').addEventListener('click', this.logout);
        document.querySelector('#to-main-page').addEventListener('click', this.toMainPage);
        const msgsContainer = document.querySelector('#msgs-container');
        msgsContainer.addEventListener('click', this.editRemoveMsg);
        msgsContainer.addEventListener('scroll', this.getMore);
        const sender = document.getElementById('sender');
        sender.addEventListener('click', this.addMessage);

        document.getElementById('addition-btn').addEventListener('click',this.usersVsFilters);
        document.body.addEventListener('keydown', this.addMessage);
        document.querySelector('.users').addEventListener('click', this.addSpecialMessage);

        document.forms.filters.addEventListener('submit', this.doFilter);
        setInterval(this.showMessages.bind(this), 300000);
        this.TimeoutRenewUsers.bind(this)();
    }

    loginFromChat(event){
        event.preventDefault();
        const tId = event.target.id;
        if(tId !== 'login-logout' && document.querySelector(`#${tId}`).textContent !== 'Login') return;
        document.querySelector('.login').style.display = 'flex';
        document.querySelector('.main-page').style.display = 'none';
        document.querySelector('.btn-logout').style.display = 'none';
        this.top = 10;
        document.querySelector('#msgs-container').style['scroll-behavior'] = 'auto';
        event.stopImmediatePropagation()
    }
    logout(){
        console.log('2');
        this.api.logout().then((r) => {
            console.log(r);
            if(r.ok){
                document.querySelector('.login').style.display = 'flex';
                document.querySelector('.main-page').style.display = 'none';
                document.querySelector('.btn-logout').style.display = 'none';
                this.top = 10;
                document.querySelector('#msgs-container').style['scroll-behavior'] = 'auto';
                user = '';
                this.setCurrentUser(user);
                sessionStorage.setItem('token', '');
            }
        })

    }

    static mainPageNoUser(){
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.main-page').style.display = 'flex';
        document.querySelector('#addition-btn').style.display = 'none';
        document.querySelector('.send-message-container').style.display = 'none';
        document.querySelector('.edit-to-mode').style.display = 'none';
    }
    static mainPageUser(){
        document.querySelector('#addition-btn').style.display = 'flex';
        document.querySelector('.send-message-container').style.display = 'flex';
        document.querySelector('.btn-logout').textContent = 'Logout';
        document.querySelector('.edit-to-mode').style.display = 'flex';
    }

    toMainPage(event){
        if(event.target.id  === 'to-main-page' || event.target.parentElement.id === 'to-main-page'){
            document.forms.login.reset();
            ChatController.mainPageNoUser();
            const log = document.querySelector('.btn-logout');
            log.style.display = 'flex';
            log.textContent = 'Login';
            this.setCurrentUser(user);
            this.showMessages();
            ChatController.doScrollBottom();
        }
    }

    setCurrentUser (userMain) {
        this.vHeader.display(userMain);
        user = userMain;
    };

    static noIsUsers(){
        document.querySelector('#first-btn-log').innerText = 'Sign Up';
        document.querySelector('#second-btn-log').innerText = 'Login';
        document.querySelector('#rep-pass-block').style.visibility = 'visible';
    }
    addNewUser(){
        document.querySelector('#first-btn-log').innerText = 'Login';
        document.querySelector('#second-btn-log').innerText = 'Sign Up';
        document.querySelector('#rep-pass-block').style.visibility = 'hidden';
    }

    login(event){
        event.preventDefault();
        if(event.target.id !== 'login' && event.target.id !== 'second-btn-log') return;
        const us = document.forms.login.name.value;
        const pass = document.forms.login.pass.value;
        const repPass = document.forms.login['rep-pass'].value;
        const isSignUp = us && pass && (pass === repPass);
        this.api.login(us, pass).then((response) => response.json())
            .then((result) => console.log('token1', result.token));
        if(event.target.id === 'login' && document.querySelector('#second-btn-log').outerText === 'Sign Up' && us && pass){
            this.api.login(us, pass).then((r) => {
                if(r.ok){
                    console.log(r);
                    document.forms.login.reset();
                    document.querySelector('.login').style.display = 'none';
                    document.querySelector('.main-page').style.display = 'flex';
                    document.querySelector('.btn-logout').style.display = 'flex';
                    ChatController.mainPageUser();
                    this.setCurrentUser(us);
                }
                return r.json();
            }).then((json) => {
                sessionStorage.setItem('token', json.token);
                (async() => {
                    await this.showMessages();
                    ChatController.doScrollBottom();
                })();
            })
                .catch((e) => console.log('error', e.message));

        } else if (document.querySelector('#second-btn-log').outerText === 'Sign Up'){
            ChatController.noIsUsers();
        } else if(document.querySelector('#second-btn-log').outerText === 'Login'){
            if(event.target.id === 'second-btn-log') this.addNewUser();
            else {
                this.api.registration(us, pass).then(r => {
                    if (r.ok) {
                        this.addNewUser();
                    }
                });
            }

        }

    }

    static doScrollBottom(){
        const cont = document.getElementById('msgs-container');
        cont.scrollTop = cont.scrollHeight;
    }

    showMessages() {
        return this.api.getMessages(this.skip, this.top)
            .then((r) => r.json())
            .then((data) => {
                this.vMsgs.display(data);
            });
    }

    addSpecialMessage(event){
        if(event.currentTarget.id !== 'users') return;
        document.querySelector('#to').textContent = `To: ${event.target.parentNode.children[1].textContent}`;
        document.querySelector('#to').style.visibility = 'visible';
        this.vUsers.visibleUsers();
    }

    addMessage(event) {
        if(event.target.id !== 'sender' && !(event.key === 'Enter' && event.shiftKey)) return;
        const textArea = document.getElementsByTagName('textarea')[0];
        let to = document.querySelector('#to');
        let toText = to.textContent.replace('To: ', '');
        const editMode = document.querySelector('.edit-mode');
        if(editMode.style.display === 'block'){
            this.editMsg(editMode.id.replace('edit-mode-', ''), textArea.value, toText);
            editMode.style.display = 'none';
        } else if (textArea.value) {
            let msg = {
                text: textArea.value,
                isPersonal: !!toText,
                to: toText
            };
            console.log(JSON.stringify(msg));
            this.api.addMessage(JSON.stringify(msg))
                .then(() => { this.showMessages(); ChatController.doScrollBottom(); })
                .catch((e) => console.log(e));
        }
        to.style.visibility = 'hidden';
        to.textContent = '';
        textArea.value = '';
    }

    removeMsg(event){
        this.api.removeMessage(event.target.id.replace('delete-',''))
            .then(() => this.showMessages())
            .catch((e) => console.log(e.message));
    }
    editMsg(id, textMsg, toMsg){
        let editMsg = {
            text: textMsg,
            isPersonal: !!toMsg
        };
        if(editMsg.isPersonal) editMsg.to = toMsg;
        this.api.editMessage(id, JSON.stringify(editMsg))
            .then(() => this.showMessages())
            .catch((e) => console.log(e.message));
    }

    editRemoveMsg(event) {
        if(event.target.className.includes('message-edit')){
            const partId = event.target.id.replace('edit','');
            const idMsg = `msg${partId}`;
            const msg = document.querySelector(`#${idMsg}`);
            document.querySelector('.edit-mode').style.display = 'block';
            document.querySelector('.edit-mode').id = `edit-mode${partId}`;
            document.querySelector('textarea').value = msg.querySelector('.text').textContent;
            document.querySelector('#to').style.visibility = 'visible';
            document.querySelector('#to').textContent = `${msg.querySelector('.to').textContent}`;
        } else if(event.target.className.includes('message-delete')){
            this.removeMsg(event);
        }
    }
    TimeoutRenewUsers() {
        this.api.getUsers()
            .then((r) => r.json())
            .then((data) => this.vUsers.renewUsers(data))
            .catch('Err');
        setTimeout(this.TimeoutRenewUsers.bind(this), 600000);
    }

    usersVsFilters(event){
        if(event.target.id  === 'btn-users' || event.target.parentElement.id === 'btn-users') {
            this.vUsers.display();
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
        this.useFilter = !MessageList.isEmptyFieldsFC(filterConfig);
        document.forms.filters.reset();
        const top = this.useFilter ? this.mMsgs.lenghtShowMsgs() : this.top;
        (async() => {
            await this.showMessages(this.skip, top, filterConfig);
            ChatController.doScrollBottom();
        })();
        document.querySelector('.filters').style.visibility = 'hidden';

    }

    getMore(){
        const cont = document.getElementById('msgs-container');
        if(cont.scrollTop === 0 && cont.scrollHeight > cont.clientHeight && !this.useFilter){
            this.top += 10;
            cont.style['scroll-behavior'] = 'smooth';
            this.showMessages();
            cont.scrollTop = cont.offsetHeight;
        }
    }

}


const Controller = new ChatController();
