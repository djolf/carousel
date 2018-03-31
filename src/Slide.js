import React, {Component} from 'react';
import './Slide.css';

class Slide extends Component {
    render() {
        const {image,link} = this.props;
        return (
            <div className='slide'>
                <img src={image.large} alt={image.id}/>
            </div>
        )
    }
}

export default Slide;