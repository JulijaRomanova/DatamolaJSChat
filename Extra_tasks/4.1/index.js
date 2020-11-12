class Node {
    constructor(value, next = null) {
        this._value = value;
        this._next = next;
    }

    set value(value) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    set next(next) {
        this._next = next;
    }

    get next() {
        return this._next;
    }
}

class List {
    constructor(value) {
        this._root = new Node(value, null);
        this.length = 1;
    }

    set root(root) {
        this._root = root;
    }

    get root() {
        return this._root;
    }

    _getLast(node) {
        if (node.next) {
            return this._getLast(node.next);
        }
        return node;
    }

    _getNode(i) {
        let node = this.root;
        while (i > 0) {
            i--;
            node = node.next;
        }
        return node;
    }

    _existI(i) {
        return (i >= 0 && i < this.length);
    }

    addNode(value, i) {
        if (!!(i + 1) && !this._existI(i)) return false;
        if (!!(i + 1) && this._existI(i)) {
            let nextAfterI = this._getNode(i).next;
            this._getNode(i).next = new Node(value, nextAfterI);
            this.length += 1;
            return true;
        }
        this._getLast(this.root).next = new Node(value);
        this.length++;
        return true;

    }

    removeNode(i) {
        if (this.length === 1 || !this._existI(i)) return false;
        if (i !== undefined) {
            this._getNode(i - 1).next = this._getNode(i).next;
            this.length--;
            return true;
        }
        this._getNode(this.length - 2).next = null;
        this.length--;
        return true;
    }

    print() {
        let list = [];
        let node = this.root;
        list.push(node.value);
        while (node.next) {
            node = node.next;
            list.push(node.value);
        }
        console.log(list.join(', '));
    }
}

const list = new List(1);
console.log(list);
console.log('Result remove (i = 0):', list.removeNode(0));
console.log('Result remove without i:', list.removeNode());
console.log('Result add (value = 2, i = 0):', list.addNode(2, 0));
list.print();
console.log('Result add (value = 5):', list.addNode(5));
list.print();
console.log('Result add (value = 10, i = 3):', list.addNode(10, 3));
list.print();
console.log('Result remove (i = 4):', list.removeNode(4));
console.log('Result remove (i = 1):', list.removeNode(1));
list.print();


