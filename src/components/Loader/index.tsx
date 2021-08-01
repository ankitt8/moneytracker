import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./styles.module.scss";

export default function Loader() {
  return (
    <div className={styles.loader}>
      <CircularProgress size={40} />
    </div>
  );
}
