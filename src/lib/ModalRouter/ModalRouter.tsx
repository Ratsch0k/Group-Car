import React from 'react';
import ModalRedirect from './ModalRedirect';
import ModalCheck from './ModalCheck';

/**
 * The modal router which handles routing for modals by using the parameter
 * `modal` of the url to determine the modal route.
 * @param props Props of the component. Only containing the children
 */
const ModalRouter: React.FC = (props) => {
  return (
    <ModalRedirect>
      <ModalCheck>
        {props.children}
      </ModalCheck>
    </ModalRedirect>
  );
};

export default ModalRouter;
