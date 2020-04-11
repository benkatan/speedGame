import React from 'react';

import './home.style.scss';

export default class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            show: false,
            playGrid: [],
            currentValue: null,
            clock: 0.0,
            isFinished: false
        }

        this.interval = null;
        this.numberOfDives = 50;
    }

    componentDidMount() {
        this.setDivNumbers(0);
    }

    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
        return array;
    }

    setDivNumbers(startNumber) {
        const items = [];
        let numbers = [];

        for (let index = startNumber; index < startNumber + (this.numberOfDives / 2); index++) {
            numbers.push(index + 1);
        }


        numbers = this.shuffle(numbers);

        for (let index = 0; index < numbers.length; index++) {
            items.push(
                <div key={index + startNumber} className='squre1' onClick={(event) => this.handleNumberClick(event, index, numbers[index])}>
                    {numbers[index]}
                </div>
            )
        }

        this.setState({ playGrid: items }, () => {
            console.log(this.state.playGrid);
        });
    }

    replaceItem(index, value) {
        const item = <div key={this.numberOfDives - index - 1} className='squre1' onClick={(event) => this.handleNumberClick(event, this.numberOfDives - index - 1, this.numberOfDives - value + 1)}>
            {this.numberOfDives - value + 1}
        </div>

        const items = this.state.playGrid;
        items.splice(index, 1, item);
        this.setState({ playGrid: items });
    }

    removeItem(event) {
        event.target.classList.add('remove');
    }

    handleNumberClick(event, index, value) {
        console.log('handle number click');
        if (!this.state.currentValue) {
            this.startClock();
            if (value == 1) {
                this.setState({ currentValue: 1 });
                this.replaceItem(index, value);

            }
        } else {

            if (value == this.numberOfDives) {
                this.stopClock();
                this.setState({ isFinished: true });
                this.removeItem(event, index, value);
                return;
            }


            if (this.state.currentValue + 1 == value) {
                this.setState({ currentValue: value });

                if (value <= this.numberOfDives / 2) {

                    this.replaceItem(index, value);
                    if (value == (this.numberOfDives / 2)) {
                        this.setDivNumbers(value);
                    }
                } else {
                    this.removeItem(event, index, value);
                }
            }
        }
    }

    reset() {
        this.stopClock();
        this.setState({
            show: false,
            playGrid: [],
            currentValue: null,
            clock: 0.0,
            isFinished: false
        }, () => {
            this.setDivNumbers(0);
        });

    }

    startClock = () => {
        const S = new Date();
        this.interval = setInterval(() => {
            this.setState({ clock: (new Date() - S) / 1e3 });
        }, 10);
    }

    stopClock() {
        clearInterval(this.interval);
    }

    render() {
        const { playGrid, clock, isFinished } = this.state;
        return (
            <div className="home-warraper animated fadeIn">
                <div className='clock'>
                    {clock}
                </div>
                <div className='reset-btn'>
                    <button onClick={() => this.reset()}> Reset</button>
                </div>
                <div className='grid'>{playGrid}</div>

                {
                    isFinished ?
                        <div>
                            <h1>Your score: {clock} seconds</h1>
                        </div> : null
                }

            </div>
        )
    }
}
