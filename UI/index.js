const chat = function () {
    let count = 1;
    const generateId = () => (count++).toString();
    const messages = [
        {
            id: generateId(),
            text: 'It\'s very bad...',
            createdAt: new Date('2020-10-12T23:08:00'),
            author: 'Beriozko Maria',
            isPersonal: true,
            to: 'Grigorchik Ann'
        },
        {
            id: generateId(),
            text: 'Hello!',
            createdAt: new Date('2020-10-12T23:00:00'),
            author: 'Mironov Andrei',
            isPersonal: true,
            to: 'Beriozko Maria'
        },
        {
            id: generateId(),
            text: 'Hello. How are you doing ?',
            createdAt: new Date('2020-10-12T23:05:00'),
            author: 'Beriozko Maria',
            isPersonal: false
        },
        {
            id: generateId(),
            text: 'Hello! I\'m fine! I do my homework.',
            createdAt: new Date('2020-10-12T23:06:00'),
            author: 'Holubev Sergei',
            isPersonal: true,
            to: 'Beriozko Maria'
        },
        {
            id: generateId(),
            text: 'I\'m feel bad and I wont sleep....',
            createdAt: new Date('2020-10-12T23:07:00'),
            author: 'Grigorchik Ann',
            isPersonal: true,
            to: 'Beriozko Maria'
        },

    ];
    const dateComparatorDesc = (m1, m2) => (m2.createdAt - m1.createdAt);
    const checkFilter = (message, filterConfig, key) =>
        (key === 'dateFrom')
            ? (message.createdAt >= filterConfig[key])
            : (key === 'dateTo')
                ? (message.createdAt <= filterConfig[key])
                : message[key].toLowerCase().includes(filterConfig[key].toLowerCase());


    const getMessages = (skip = 0, top = 10, filterConfig = null) => {
        return Object
            .assign([], messages)
            .sort(dateComparatorDesc)
            .slice(skip, skip + top)
            .filter(message => filterConfig
                ? Object.keys(filterConfig).map(key =>
                    checkFilter(message, filterConfig, key))
                    .reduce((result, key) => result & key)
                : true
            )
    };

    const getMessage = (id) => messages.find(message => (message.id === id));

    const validateMessage = (msg) => !!Object.keys(msg).length && msg.id && msg.text && msg.createdAt && msg.author
        && (msg.text.length <= 200)
        && !messages.find(message => (message.id === msg.id));

    const addMessage = (msg) => {
        if (validateMessage(msg)) {
            messages.push(msg);
            return true;
        }
        return false;
    };

    const editMessage = (id, msg) => {
        delete msg.id;
        delete msg.author;
        delete msg.createdAt;
        const msgIndex = messages.findIndex((msg) => msg.id === id);
        if (msg?.text > 200) {
            return false;
        }
        Object.keys(msg).forEach(key =>
            messages[msgIndex][key] = msg[key]
        );
        return true;
    };
    const removeMessage = (id) => {
        const msgIndex = messages.findIndex(msg => msg.id === id);
        if(msgIndex === -1) {
            return false;
        }
        messages.splice(msgIndex, 1);
        return true;
    };

    return {
        messages,
        getMessages,
        getMessage,
        validateMessage,
        addMessage,
        editMessage,
        removeMessage
    }
}();
