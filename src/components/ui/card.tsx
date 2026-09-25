import { FC, ReactNode } from 'react';

import './card.css';

type Props = {
    className: string;
    children: ReactNode;
};

const Card: (FC<Props>) = ({ className, children }): React.JSX.Element => {
    return <div className={'card ' + className}>{children}</div>;
}

export default Card;