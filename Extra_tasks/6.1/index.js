const childrenNode = (node, li) => {
    let ul = document.createElement('ul');
    let chLi;
    node.children.forEach((ch) => {
        chLi = document.createElement('li');
        chLi.textContent = ch.value;
        ul.appendChild(chLi);
        li.appendChild(ul);
        if(ch.children) childrenNode(ch, chLi);
    });
};

const createList = (title, list) => {
    const Html = document.getElementsByTagName('body')[0];
    const fr = new DocumentFragment();
    const titleHtml = document.createElement('h2');
    titleHtml.textContent = title;
    fr.appendChild(titleHtml);

    let ul = document.createElement('ul');
    ul.id = 'list';
    let li;
    list.forEach((el) => {
        li = document.createElement('li');
        li.textContent = el.value;
        ul.appendChild(li);
        if(el.children) childrenNode(el, li);
    });
    fr.appendChild(ul);
    Html.append(fr);
};

const list = [
    {
        value: 'Пункт 1.',
        children: null,
    },
    {
        value: 'Пункт 2.',
        children: [
            {
                value: 'Подпункт 2.1.',
                children: null,
            },
            {
                value: 'Подпункт 2.2.',
                children: [
                    {
                        value: 'Подпункт 2.2.1.',
                        children: null,
                    },
                    {
                        value: 'Подпункт 2.2.2.',
                        children: null,
                    }
                ],
            },
            {
                value: 'Подпункт 2.3.',
                children: null,
            }
        ]
    },
    {
        value: 'Пункт 3.',
        children: null,
    }
];

function changeVisibility(el){
    el.style.display = (el.style.display !== 'none') ? 'none' : 'block';
}

function walkChildren(el){
    [...el.children].forEach((ch) => {
        changeVisibility(ch);
        if(ch.children) walkChildren(ch);
    });
}

function hiddenVsVisible(event){
    if(event.target.children){
        walkChildren(event.target);
    }
}

createList('my List', list);
document.querySelector('#list').addEventListener('click', hiddenVsVisible);
