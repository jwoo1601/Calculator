import React, { useState } from 'react';
import '../style/optionEntry.css';

const OptionEntry = (props) => {
    return (
        <div id={`option-entry-${props.name}`} className="option-entry">
            { props.label? <span className="option-entry-label">{props.label}</span> : null }

            <div className="option-entry-items">
                {
                    props.items.map((it, i) => {
                        return (
                            <label>
                                <input type="radio"
                                        key={`${props.name}-${i}`}
                                        name={props.name}
                                        value={it.value}
                                        defaultChecked={it.checked || false}
                                        required={true}
                                        onChange={e => {
                                            props.onSelectItem(it);
                                        }}/>
                                {it.text}
                            </label>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default OptionEntry;