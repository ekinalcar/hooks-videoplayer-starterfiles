import React from "react";
import StyledNightmode from "./styles/StyledNightmode";

const NightMode = ({ nightMode, handleOnChange }) => (
  <StyledNightmode>
    <span>NightMode : </span>
    <label className="switch">
      <input type="checkbox" checked={nightMode} onChange={handleOnChange} />
      <span className="slider round" />
    </label>
  </StyledNightmode>
);

export default NightMode;
