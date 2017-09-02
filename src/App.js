import React from 'react';

class HOCChildContent extends React.Component {
    static get propTypes() {
        return {
            inherited: React.PropTypes.number,
        };
    }

    constructor(props) {
        super(props);
        this.state = { owned: Date.now() };
    }

    render() {
        console.log(`HOCChildContent[${this.props.inherited}][${this.state.owned}]:render`);
        return (
            <div>
                <div>Inherited: {this.props.inherited}</div>
                <button type="button" onClick={() => this.setState({ owned: Date.now() })}>
                    Owned: {this.state.owned}
                </button>
            </div>
        );
    }
}

class HOCChild extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.node.isRequired,
            name: React.PropTypes.string.isRequired,
        };
    }

    render() {
        console.log(`HOCChild[${this.props.name}]:render`);
        return React.Children.only(this.props.children);
    }
}

class HOCParent extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.node.isRequired,
            name: React.PropTypes.string.isRequired,
            data: React.PropTypes.object,
        };
    }

    componentDidMount() {
        console.log(`HOCParent[${this.props.name}]:componentDidMount`);
        this.ping();
    }

    shouldComponentUpdate(nextProps) {
        console.log(`HOCParent[${this.props.name}]:shouldComponentUpdate`);
        const currData = this.props.data;
        const currName = this.props.name;
        const nextData = nextProps.data;
        const nextName = nextProps.name;
        if (nextName !== currName) { return true; }
        if (nextData[nextName] !== currData[currName]) { return true; }
        return false;
    }

    componentDidUpdate() {
        console.log(`HOCParent[${this.props.name}]:componentDidUpdate`);
        this.ping();
    }

    ping() {
        console.log('~~~~~PING~~~~~');
    }

    render() {
        console.log(`HOCParent[${this.props.name}]:render`);
        const { name, data } = this.props;
        const childrenArray = React.Children.toArray(this.props.children);
        const validChildren = childrenArray.filter(child => (child.type === HOCChild));
        const matchChildren = validChildren.filter(child => (child.props.name === data[name]));
        return React.Children.only(matchChildren[0]);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentName: 'parent1',
            childName: 'child1',
            inheritable: Date.now(),
            uninheritable: Date.now(),
        };
        this.onChangeParentName = this.onChangeParentName.bind(this);
        this.onChangeChildName = this.onChangeChildName.bind(this);
        this.onChangeInheritable = this.onChangeInheritable.bind(this);
        this.onChangeUninheritable = this.onChangeUninheritable.bind(this);
    }

    onChangeParentName() {
        this.setState({ parentName: this.state.parentName === 'parent1' ? 'parent2' : 'parent1' });
    }

    onChangeChildName() {
        this.setState({ childName: this.state.childName === 'child1' ? 'child2' : 'child1' });
    }

    onChangeInheritable() {
        this.setState({ inheritable: Date.now() });
    }

    onChangeUninheritable() {
        this.setState({ uninheritable: Date.now() });
    }

    render() {
        console.log('App:render');
        const { parentName, childName, inheritable, uninheritable } = this.state;
        return (
            <div>
                <div style={{ color: 'white', backgroundColor: 'steelblue' }}>
                    <button type="button" onClick={this.onChangeParentName}>
                        Parent: {parentName}
                    </button>
                    <button type="button" onClick={this.onChangeChildName}>
                        Child: {childName}
                    </button>
                    <button type="button" onClick={this.onChangeInheritable}>
                        Inheritable: {inheritable}
                    </button>
                    <button type="button" onClick={this.onChangeUninheritable}>
                        Uninheritable: {uninheritable}
                    </button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <HOCParent name={parentName} data={{ [parentName]: childName }}>
                        <HOCChild name="child1">
                            <div>
                                <span>child1</span>
                                <HOCChildContent inherited={inheritable} />
                            </div>
                        </HOCChild>
                        <HOCChild name="child2">
                            <div>
                                <span>child2</span>
                                <HOCChildContent inherited={inheritable} />
                            </div>
                        </HOCChild>
                    </HOCParent>
                </div>
            </div>
        );
    }
}

export default App;
