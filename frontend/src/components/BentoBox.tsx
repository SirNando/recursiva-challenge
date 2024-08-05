import React from "react";
import { ReactNode } from "react";

import styles from "./BentoBox.module.css";

export default function BentoBox({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const childrenArray = React.Children.toArray(children);

  const groups: ReactNode[][] = [[], [], []];

  for (let i = 0; i < childrenArray.length; i++) {
    const child = childrenArray[i];
    const groupIndex = i % groups.length;
    groups[groupIndex].push(child);
  }

  return <ul className={styles.bentoBox}>{children}</ul>;
}
