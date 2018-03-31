import React, {Component} from 'react';
import './Carousel.css';
import Slide from './Slide';

class Carousel extends Component {

    constructor() {
        super();
        this.onResize = this
            .onResize
            .bind(this);

        this.state = {
            images: [],
            hidden: '',
            currentIndex: 0,
            leftIndex: 0,
            rightIndex: 0
        };
        this.allowAnimate = true;
    }

    scrollTo(element, to, duration, scrollDirection) {
        var start = element[scrollDirection],
            change = to - start,
            increment = 1000 / 60;

        var animateScroll = function (elapsedTime) {
            this.allowAnimate = false;
            elapsedTime += increment;
            var position = this.easeInOut(elapsedTime, start, change, duration);
            element[scrollDirection] = position;
            if (elapsedTime < duration) {
                window.requestAnimationFrame(animateScroll.bind(null, elapsedTime));
            } else {
                this.allowAnimate = true;
            }
        }.bind(this);

        animateScroll(0);
        window.requestAnimationFrame(animateScroll.bind(null, 0));
    }

    easeInOut(currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    onResize() {
        this.hideButtons();
    }

    componentDidMount() {
        fetch('https://api.myjson.com/bins/1wqfa').then(response => {
            return response.json();
        }).then(data => {
            let images = data.map((img) => {
                return (<Slide key={img.id} link={img.link} image={img.image}/>)
            })
            this.setState({
                images: images,
                leftIndex: images.length - 1,
                rightIndex: 1
            });
        }).catch(error => console.error(error));

        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    hideButtons() {
        let hidden;
        if (window.innerWidth <= 1500) {
            hidden = 'hidden';
        } else {
            hidden = '';
        }
        if (this.state.hidden !== hidden) {
            this.setState({hidden});
        }
    }

    setLeftIndex(current) {
        if (current === 0) {
            return this.state.images.length - 1;
        } else {
            return current - 1;
        }
    }

    setRightIndex(current) {
        if (current === this.state.images.length - 1) {
            return 0;
        } else {
            return current + 1;
        }
    }

    handleLeftNav(e) {
        if (this.allowAnimate) {
            const {carouselViewport, leftButton, rightButton} = this.refs;
            let widthOfimage = 960;
            let numOfSlides = 1;
            if (this.state.currentIndex === 0) {
                let currentIndex = this.state.images.length - 1;
                numOfSlides = -1 * (this.state.images.length - 1);
                this.setState({
                    currentIndex: currentIndex,
                    leftIndex: this.setLeftIndex(currentIndex),
                    rightIndex: this.setRightIndex(currentIndex)
                });
            } else {
                let currentIndex = this.state.currentIndex - 1;
                this.setState({
                    currentIndex: currentIndex,
                    leftIndex: this.setLeftIndex(currentIndex),
                    rightIndex: this.setRightIndex(currentIndex)
                });
            }
            let newPos = carouselViewport.scrollLeft - (widthOfimage * numOfSlides);
            this.scrollTo(carouselViewport, newPos, 500, 'scrollLeft');
            this.scrollTo(leftButton, widthOfimage, 500, 'scrollLeft');
            this.scrollTo(rightButton, widthOfimage, 500, 'scrollLeft');
        }

    }

    handleRightNav(e) {
        if (this.allowAnimate) {
            const {carouselViewport, leftButton, rightButton} = this.refs;
            let widthOfimage = 960;
            let numOfSlides = 1;
            if (this.state.currentIndex === this.state.images.length - 1) {
                let currentIndex = 0;
                numOfSlides = -1 * this.state.images.length - 1;
                this.setState({
                    currentIndex: currentIndex,
                    leftIndex: this.setLeftIndex(currentIndex),
                    rightIndex: this.setRightIndex(currentIndex)
                });
            } else {
                let currentIndex = this.state.currentIndex + 1;
                this.setState({
                    currentIndex: currentIndex,
                    leftIndex: this.setLeftIndex(currentIndex),
                    rightIndex: this.setRightIndex(currentIndex)
                });
            }
            let newPos = carouselViewport.scrollLeft + (widthOfimage * numOfSlides);
            this.scrollTo(carouselViewport, newPos, 500, 'scrollLeft');
            this.scrollTo(leftButton, widthOfimage, 500, 'scrollLeft');
            this.scrollTo(rightButton, widthOfimage, 500, 'scrollLeft');
        }
    }

    render() {
        return (
            <div className="carousel-container">
                <button
                    className={`carousel-nav carousel-left-nav ${this.state.hidden}`}
                    onClick={this
                    .handleLeftNav
                    .bind(this)}
                    ref='leftButton'>{this.state.images[this.state.leftIndex]}</button>

                <div className="carousel-viewport" ref="carouselViewport">{this.state.images}</div>

                <button
                    className={`carousel-nav carousel-right-nav ${this.state.hidden}`}
                    onClick={this
                    .handleRightNav
                    .bind(this)}
                    ref='rightButton'>{this.state.images[this.state.rightIndex]}</button>
            </div>
        )
    }
}

export default Carousel;