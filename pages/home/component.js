import React from 'react';

import StaticPage from 'layout/static-page';
import Tool from 'components/tool';

const HomePage = () => {
  return (
    <StaticPage className="p-home">
      <Tool />
    </StaticPage>
  );
};

export default HomePage;
