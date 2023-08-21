import React from 'react';

import './Card.css';

type Props = {
    className: string;
    children: any;
};

const Card: (React.FC<Props>) = ({ className, children }): JSX.Element => {
    return <div className={'card ' + className}>{children}</div>;
}

export default Card;