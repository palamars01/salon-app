import { ReactNode } from 'react';

interface Props {
  modal: ReactNode;
  children: ReactNode;
}

export default function SalonLayout({ modal, children }: Props) {
  return (
    <section id="salon-dashboard">
      {modal}
      {children}
    </section>
  );
}
