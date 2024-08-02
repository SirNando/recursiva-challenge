import { ReactNode } from "react";

export default function BentoBox({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return <ul>{children}</ul>;
}
