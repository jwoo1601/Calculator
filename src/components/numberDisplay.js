import React, { useState } from 'react';
import '../style/numberDisplay.css'

const NumberDisplay = (props) => {    
    return (
        <div id={`number-display-${props.name}`} className="number-display">
            <div className="number-display-label">{props.label}</div>
            <div className="number-display-value">{props.value !== null? Number(props.value).toString(props.radix) : "Invalid Input"}</div>
        </div>
    );
};

export default NumberDisplay;