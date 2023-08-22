import { FC, ReactNode } from 'react';

import './Card.css';

type Props = {
    className: string;
    children: ReactNode;
};

const Card: (FC<Props>) = ({ className, children }): JSX.Element => {
    return <div className={'card ' + className}>{children}</div>;
}

export default Card;