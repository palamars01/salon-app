import { ReactNode } from 'react';

interface Props {
  modal: ReactNode;
  children: ReactNode;
}

export default function ServiceLayout({ modal, children }: Props) {
  return (
    <section id="service-management" style={{ height: '100%' }}>
      {modal}
      {children}
    </section>
  );
}
