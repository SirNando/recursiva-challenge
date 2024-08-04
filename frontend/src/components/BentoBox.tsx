import { ReactNode } from "react";

import styles from "./BentoBox.module.css";

export default function BentoBox({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return <ul className={styles.bentoBox}>{children}</ul>;
}
