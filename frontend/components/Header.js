import React from 'react';
import Head from 'next/head';
import stylesheet from '../src/styles/style.scss';

import {SITE_TITLE,SITE_DESCRIPTION} from '../utils/const';


const Header = () => (
  <div>
    <Head>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: stylesheet }}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta 
        name="Description" 
        content={SITE_DESCRIPTION}
      />      
      <title>{SITE_TITLE}</title>
    </Head>
  </div>
);

export default Header;
