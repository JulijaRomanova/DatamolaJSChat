// eslint-disable-next-line no-unused-vars
const chat = (function () {
  let count = 1;
  const generateId = () => (count++).toString();
  const currentAuthor = 'Beriozko Maria';

  const messages = [
    {
      id: generateId(),
      text: 'It\'s very bad...',
      createdAt: new Date('2020-10-12T23:08:00'),
      author: 'Beriozko Maria',
      isPersonal: true,
      to: 'Grigorchik Ann',
    },
    {
      id: generateId(),
      text: 'Hello!',
      createdAt: new Date('2020-10-12T23:00:00'),
      author: 'Mironov Andrei',
      isPersonal: true,
      to: 'Beriozko Maria',
    },
    {
      id: generateId(),
      text: 'Hello. How are you doing ?',
      createdAt: new Date('2020-10-12T23:05:00'),
      author: 'Beriozko Maria',
      isPersonal: false,
    },
    {
      id: generateId(),
      text: 'Hello! I\'m fine! I do my homework.',
      createdAt: new Date('2020-10-12T23:06:00'),
      author: 'Holubev Sergei',
      isPersonal: true,
      to: 'Beriozko Maria',
    },
    {
      id: generateId(),
      text: 'I\'m feel bad and I wont sleep....',
      createdAt: new Date('2020-10-12T23:07:00'),
      author: 'Grigorchik Ann',
      isPersonal: true,
      to: 'Beriozko Maria',
    },
    {
      id: generateId(),
      text: 'I think everything will be fine soon. We\'ll take a walk tomorrow.',
      createdAt: new Date('2020-10-12T23:10:00'),
      author: 'Borisevich Daria',
      isPersonal: true,
      to: 'Grigorchik Ann',
    },
    {
      id: generateId(),
      text: 'I would like to go to the cinema',
      createdAt: new Date('2020-10-12T23:09:00'),
      author: 'Gaponenko Arina',
    },
    {
      id: generateId(),
      text: 'I think we\'ll go to cinema tomorrow. Kate, are you going with us?',
      createdAt: new Date('2020-10-12T23:12:00'),
      author: 'Grigorchik Ann',
    },
    {
      id: generateId(),
      text: 'Sure. Sergey and I will there!',
      createdAt: new Date('2020-10-12T23:14:00'),
      author: 'Grigorchik Ann',
      isPersonal: true,
      to: 'Ivanova Katya',
    },
    {
      id: generateId(),
      text: 'Can we go to the theater ?',
      createdAt: new Date('2020-10-12T23:15:00'),
      author: 'Alhimenok Valeria',
    },
    {
      id: generateId(),
      text: 'I was there just recently...',
      createdAt: new Date('2020-10-12T23:16:00'),
      author: 'Beriozko Maria',
    },
    {
      id: generateId(),
      text: 'I like movies more than theater',
      createdAt: new Date('2020-10-12T23:16:50'),
      author: 'Holubev Sergei',
    },
    {
      id: generateId(),
      text: 'Write + if you go to the cinema tomorrow at 19:00',
      createdAt: new Date('2020-10-12T23:17:00'),
      author: 'Beriozko Maria',
    },
    {
      id: generateId(),
      text: '+',
      createdAt: new Date('2020-10-12T23:18:00'),
      author: 'Grigorchik Ann',
    },
    {
      id: generateId(),
      text: '+++',
      createdAt: new Date('2020-10-12T23:17:30'),
      author: 'Holubev Sergei',
    },
    {
      id: generateId(),
      text: 'I\'m fine!\n+',
      createdAt: new Date('2020-10-12T23:19:00'),
      author: 'Gaponenko Arina',
    },
    {
      id: generateId(),
      text: 'I\'m going.\n + ',
      createdAt: new Date('2020-10-12T23:18:50'),
      author: 'Mironov Andrei',
    },
    {
      id: generateId(),
      text: '+ :)',
      createdAt: new Date('2020-10-12T23:20:00'),
      author: 'Borisevich Daria',
    },
    {
      id: generateId(),
      text: '+',
      createdAt: new Date('2020-10-12T23:21:00'),
      author: 'Gaponenko Arina',
    },
    {
      id: generateId(),
      text: 'Cool. +',
      createdAt: new Date('2020-10-12T23:22:00'),
      author: 'Ivanova Katya',
    },
  ];
  const dateComparatorDesc = (m1, m2) => (m2.createdAt - m1.createdAt);
  const checkFilter = (message, filterConfig, key) => ((key === 'dateFrom')
    ? (message.createdAt >= filterConfig[key])
    : (key === 'dateTo')
      ? (message.createdAt <= filterConfig[key])
      : message[key].toLowerCase().includes(filterConfig[key].toLowerCase()));

  const getMessages = (skip = 0, top = 10, filterConfig = null) => Object
    .assign([], messages)
    .filter((message) => (filterConfig
      ? Object.keys(filterConfig).map((key) => checkFilter(message, filterConfig, key))
        .reduce((result, key) => result && key)
      : true))
    .sort(dateComparatorDesc)
    .slice(skip, skip + top);

  const getMessage = (id) => messages.find((message) => (message.id === id));

  const validateMessage = (msg) => !!msg.text && (msg.text.length <= 200);

  const addMessage = (msg) => {
    if (validateMessage(msg)) {
      msg.id = generateId();
      msg.author = currentAuthor;
      msg.createdAt = new Date();
      messages.push(msg);
      return true;
    }
    return false;
  };

  const editObj = {
    text: (elem, text) => {
        elem.text = text;
    },
    to: (elem, to) => {
        elem.to = to;
        elem.isPersonal = true;
    },
    isPersonal: (elem, isPersonal) => {
        elem.isPersonal = isPersonal;
        if (!isPersonal) {
            elem.to = '';
        }
    },
  };

  const editMessage = (id, msg) => {
    const msgIndex = messages.findIndex((message) => message.id === id);
    const elem = { ...messages[msgIndex] };
    Object.keys(msg).every((key) => editObj[key](elem, msg[key]));
    if (validateMessage(elem)) {
      messages[msgIndex] = elem;
      return true;
    }
    return false;
  };
  const removeMessage = (id) => {
    const msgIndex = messages.findIndex((msg) => msg.id === id);
    if (msgIndex === -1) {
      return false;
    }
    messages.splice(msgIndex, 1);
    return true;
  };
    /* eslint-disable no-alert, no-console */
  console.log('getMessages with out parameters\n', getMessages());
  console.log('getMessages(10,10)\n', getMessages(10, 10));
  console.log('getMessages(0, 10, {author: \'Maria\',\n'
        + '            dateFrom: new Date(\'2020-10-12T23:00:00\'),\n'
        + '            dateTo: new Date(\'2020-10-12T23:07:00\')})\n', getMessages(0, 10,
    {
      author: 'Maria',
      dateFrom: new Date('2020-10-12T23:00:00'),
      dateTo: new Date('2020-10-12T23:07:00'),
    }));

  console.log('getMessage(\'2\')', getMessage('2'));

  const newMsg = {
    id: generateId(),
    text: 'New message',
    createdAt: new Date('2020-10-12T23:17:00'),
    author: 'Beriozko Maria',
  };
  const badMsg = {
    id: generateId(),
    text: 'Write + if you go to the cinema tomorrow at 19:00 Write + if you go to the cinema tomorrow at 19:00 Write + if you go to the cinema tomorrow at 19:00 Write + if you go to the cinema tomorrow at 19:00 Write + if you go to the cinema tomorrow at 19:00 Write + if you go to the cinema tomorrow at 19:00 Write + if you go to the cinema tomorrow at 19:00',
    createdAt: new Date('2020-10-12T23:17:00'),
    author: 'Beriozko Maria',
  };

  console.log('Validate message with length of text more than 200\n', validateMessage(badMsg));
  console.log('Validate message\n', validateMessage(newMsg));

  console.log('Add not valid message\n', addMessage(badMsg));
  console.log('Add valid message\n', addMessage(newMsg));
  console.log(getMessages(0, 10));

  console.log('Edit message', editMessage('2', { text: 'Hello. Today is a beautiful day!' }));
  console.log(getMessage('2'));

  console.log('Remove message', removeMessage('3'));
  console.log(messages);
    /* eslint-enable no-alert, no-console */

  return {
    messages,
    getMessages,
    getMessage,
    validateMessage,
    addMessage,
    editMessage,
    removeMessage,
  };
}());
