import React, { useState, useCallback } from "react";
import OptionEntry from "./optionEntry";
import AutoResizeInput from "./autoResizeInput";
import NumberDisplay from "./numberDisplay";
import "../style/main.css";

const NUMBER_LIMITS = {
  signed: {
    "8": [-128, 127],
    "16": [-32768, 32767],
    "32": [-2147483648, 2147483647],
    "64": [-9223372036854775808, 9223372036854775807]
  },

  unsigned: {
    "8": [0, 255],
    "16": [0, 65535],
    "32": [0, 4294967295],
    "64": [0, 18446744073709551615]
  },

  check: function(num, signedness, numBits) {
    const [min, max] = this[signedness][numBits];

    return num >= min && num <= max;
  }
};

const ViewMain = () => {
  const [numBitsItems, setNumBitsItems] = useState([
    {
      value: 8,
      text: "8 bits",
      checked: true
    },

    {
      value: 16,
      text: "16 bits"
    },

    {
      value: 32,
      text: "32 bits"
    },

    {
      value: 64,
      text: "64 bits"
    }
  ]);

  const [signednessItems, setSignednessItems] = useState([
    {
      value: "signed",
      text: "Signed"
    },
    {
      value: "unsigned",
      text: "Unsigned",
      checked: true
    }
  ]);

  const [inputTypeItems, setInputTypeItems] = useState([
    {
      value: 2,
      text: "Binary",
      pattern: /^[+-]?[01]+$/
    },
    {
      value: 8,
      text: "Octal",
      pattern: /^[+-]?[0-7]+$/
    },
    {
      value: 10,
      text: "Decimal",
      pattern: /^[+-]?[0-9]+$/,
      checked: true
    },
    {
      value: 16,
      pattern: /^[+-]?[0-9a-fA-F]+$/,
      text: "Hexadecimal"
    }
  ]);

  const [inputOpItems, setInputOpItems] = useState([
    {
      name: "add",
      text: "+",
      op: (a, b) => a + b
    },
    {
      name: "sub",
      text: "-",
      op: (a, b) => a - b
    },
    {
      name: "mul",
      text: "×",
      op: (a, b) => a * b
    },
    {
      name: "div",
      text: "÷",
      op: (a, b) => a / b
    },
    {
      name: "mod",
      text: "mod",
      op: (a, b) => a % b
    }
  ]);

  const [number1, setNumber1] = useState({
    value: 0,
    text: "0"
  });
  const [number2, setNumber2] = useState({
    value: 0,
    text: "0"
  });
  const [selectedInputOp, setSelectedInputOp] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState({
    "num-bits": numBitsItems.find(it => it.checked),
    signedness: signednessItems.find(it => it.checked),
    "input-type": inputTypeItems.find(it => it.checked)
  });

  function onSelectItem(optionName, selectedItem) {
    setSelectedOptions(selectedOptions => {
      let newSelectedOptions = { ...selectedOptions };
      newSelectedOptions[optionName] = selectedItem;

      return newSelectedOptions;
    });
  }

  let validInput = true,
    errorDesc;
  if (
    !(
      NUMBER_LIMITS.check(
        number1.value,
        selectedOptions["signedness"].value,
        selectedOptions["num-bits"].value.toString()
      ) &&
      NUMBER_LIMITS.check(
        number2.value,
        selectedOptions["signedness"].value,
        selectedOptions["num-bits"].value.toString()
      )
    )
  ) {
    validInput = false;
    errorDesc = "Numbers out of range";
  }
  if (
    selectedOptions["signedness"].value === "unsigned" &&
    (number1.value < 0 || number2.value < 0)
  ) {
    validInput = false;
    errorDesc = "Negative numbers are not allowed in unsigned number system";
  }
  if (
    !(
      selectedOptions["input-type"].pattern.test(number1.text) &&
      selectedOptions["input-type"].pattern.test(number2.text)
    )
  ) {
    validInput = false;
    errorDesc = `Invalid digit for ${selectedOptions["input-type"].text} representation`;
  }

  /*
    const { N, Z, V, C, result } = nativeModule.getRegisterFlags({
        numBits: selectedOptions["num-bits"].value,
        signedness: selectedOptions["signedness"].value,
        operand1: number1.value,
        operand2: number2.value,
        op: inputOpItems[selectedInputOp].name
    });

    console.log(`N: ${N}, Z: ${Z}, V: ${V}, C: ${C}, result: ${result}`); */

  return (
    <div className="view-main">
      <div className="view-main-options">
        <OptionEntry
          name="num-bits"
          label="Number of bits"
          items={numBitsItems}
          onSelectItem={it => onSelectItem("num-bits", it)}
        ></OptionEntry>
        <OptionEntry
          name="signedness"
          label="Signedness"
          items={signednessItems}
          onSelectItem={it => onSelectItem("signedness", it)}
        ></OptionEntry>
        <OptionEntry
          name="input-type"
          label="Input type"
          items={inputTypeItems}
          onSelectItem={it => onSelectItem("input-type", it)}
        ></OptionEntry>
      </div>

      {errorDesc ? (
        <div className="view-main-input-error-desc">{errorDesc}</div>
      ) : null}

      <div className="view-main-inputs">
        <AutoResizeInput
          name="number1"
          default="value1"
          setter={setNumber1}
          radix={selectedOptions["input-type"].value}
        ></AutoResizeInput>

        <div
          className="view-main-input-op"
          draggable="false"
          onClick={() => {
            if (selectedInputOp == inputOpItems.length - 1) {
              setSelectedInputOp(0);
            } else {
              setSelectedInputOp(selectedInputOp => selectedInputOp + 1);
            }
          }}
        >
          {inputOpItems[selectedInputOp].text}
        </div>
        <AutoResizeInput
          name="number2"
          default="value2"
          setter={setNumber2}
          radix={selectedOptions["input-type"].value}
        ></AutoResizeInput>
      </div>

      <div className="view-main-outputs">
        {[
          ["bin", 2],
          ["oct", 8],
          ["dec", 10],
          ["hex", 16]
        ].map(([label, radix]) => (
          <NumberDisplay
            name={label}
            radix={radix}
            label={label.toUpperCase()}
            value={
              validInput
                ? inputOpItems[selectedInputOp].op(number1.value, number2.value)
                : null
            }
          ></NumberDisplay>
        ))}

        <div></div>
      </div>
    </div>
  );
};

export default ViewMain;
