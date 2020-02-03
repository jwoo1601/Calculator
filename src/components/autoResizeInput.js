import React, { useState } from 'react';
import '../style/autoResizeInput.css';

const AutoResizeInput = (props) => {
    return (
        <div id={`auto-resize-input-${props.name}`} className="auto-resize-input">
            <input type="text" className="auto-resize-input-text" name="auto-resize-input-text" placeholder={props.default} required
              onChange={(e) => {
                  console.log(`radix: ${props.radix}, parsed: ${Number.parseInt(e.target.value, props.radix)}`)
                  props.setter({
                      value: Number.parseInt(e.target.value, props.radix),
                      text: e.target.value
                  });
                }}/>
        </div>
    );
};

export default AutoResizeInput;