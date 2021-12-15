import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Router } from 'lib/routes';
import Sidebar from './sidebar';
import Visualization from './visualization';

import LoadingSpinner from 'components/loading-spinner';

const Tool = ({ serializedState, restoring, restoreState }) => {
  const [loading, setLoading] = useState(false);

  // When the component is mounted, we restore its state from the URL
  useEffect(() => {
    restoreState();
  }, [restoreState]);

  // Each time the serialized state of the component changes, we update the URL
  useEffect(() => {
    Router.replaceRoute('home', { state: serializedState });
  }, [serializedState]);

  // When we init the app, we also want to initialize the layers that need to do so
  useEffect(() => {
    // TODO: implement initialization logic or remove this
    setLoading(false);
  }, []);

  return (
    <div className="c-tool">
      {(loading || restoring) && <LoadingSpinner />}
      {!loading && !restoring && (
        <>
          <Sidebar />
          <Visualization />
        </>
      )}
    </div>
  );
};

Tool.propTypes = {
  serializedState: PropTypes.string.isRequired,
  restoring: PropTypes.bool.isRequired,
  restoreState: PropTypes.func.isRequired,
};

export default Tool;
