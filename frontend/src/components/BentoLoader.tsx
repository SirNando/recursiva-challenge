import { ReactElement } from "react";
import styles from "./BentoLoader.module.css";
export default function BentoLoader({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) {
  return (
    <li className={styles.bentoLoader}>
      <h3>{title}</h3>
      {children}
    </li>
  );
}
