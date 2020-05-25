import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CustomSelect from "../CustomSelect";
import "./TimeFrameSelect.scss";

/**
 * @typedef {import('../CustomSelect/CustomSelect').OptionType} OptionType
 * @type {Array<OptionType>} timeframes
 */
const timeframes = [
  { label: "Last month", val: "0" },
  { label: "Last 90 days", val: "1" },
  { label: "Last year", val: "2" },
];

/**
 * @typedef {Object} TimeFrameSelectPropTypes
 * @property {function} onChange Callback that delegate timeframe changes to caller.
 */

/**
 * Provides sorting options for providers.
 *
 * @param {TimeFrameSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const TimeFrameSelect = (props) => {
  const { onChange } = props;
  const [val, setVal] = useState(timeframes[1].val);

  /**
   * Selected option state change handler.
   *
   * @param {String} newValue New selected value.
   *
   * @returns {Void} None.
   */
  const handleChange = (newValue) => {
    setVal(newValue);
    onChange(newValue);
  };

  return (
    <Box className="selectTimeFrame">
      <CustomSelect
        label="Analytics Timeframe"
        onChange={handleChange}
        options={timeframes}
        value={val}
      />
    </Box>
  );
};

export default TimeFrameSelect;
