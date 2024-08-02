import { ReactElement } from "react";

export default function BentoLoader({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) {
  return (
    <li>
      <h3>{title}</h3>
      {children}
    </li>
  );
}
