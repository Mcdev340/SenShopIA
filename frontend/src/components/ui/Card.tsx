import type { HTMLAttributes, ReactNode } from "react";

interface CardPartProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardPart({ children, ...props }: CardPartProps) {
  return <div {...props}>{children}</div>;
}

// Correction: les quatre exports nommés utilisés par les formulaires sont maintenant disponibles.
export function Card({ children, ...props }: CardPartProps) {
  return <div {...props}>{children}</div>;
}

export function CardBody(props: CardPartProps) {
  return <CardPart {...props} />;
}
export function CardHeader(props: CardPartProps) {
  return <CardPart {...props} />;
}
export function CardFooter(props: CardPartProps) {
  return <CardPart {...props} />;
}

export default Card;
