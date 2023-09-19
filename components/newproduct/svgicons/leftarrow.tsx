import React from "react";
import styles from "../../../styles/svg/svg.module.scss";
const LeftArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={styles.arrowbutton}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M11.828 12l2.829 2.828-1.414 1.415L9 12l4.243-4.243 1.414 1.415L11.828 12z" />
    </svg>
  );
};

export default LeftArrow;
