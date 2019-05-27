import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import WPAPI from 'wpapi';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import Menu from '../components/Menu';
import Config from '../config';

var apiRootJSON = require( '../utils/wp-json.json' );

const wp = new WPAPI({ 
  endpoint: Config.apiUrl,
  routes: apiRootJSON.routes
});

const headerImageStyle = {
  marginTop: 50,
  marginBottom: 50,
};

const tokenExpired = () => {
  if (process.browser) {
    localStorage.removeItem(Config.AUTH_TOKEN);
  }
  wp.setHeaders('Authorization', '');
  Router.push('/login');
};

class Index extends Component {
  state = {
    id: '',
  };

  static async getInitialProps() {
    try {
      const [page, blocks] = await Promise.all([
        wp
          .pages()
          .slug('welcome')
          .embed()
          .then(data => {
            return data[0];
          }),
        wp
          .pages()
          .id(9)
          .blocks(),
      ]);

      return { page, blocks };
    } catch (err) {
      if (err.data.status === 403) {
        tokenExpired();
      }
    }

    return null;
  }

  componentDidMount() {
    const token = localStorage.getItem(Config.AUTH_TOKEN);
    if (token) {
      wp.setHeaders('Authorization', `Bearer ${token}`);
      wp.users()
        .me()
        .then(data => {
          const { id } = data;
          this.setState({ id });
        })
        .catch(err => {
          if (err.data.status === 403) {
            tokenExpired();
          }
        });
    }
  }

  render() {
    const { id } = this.state;
    const { blocks, headerMenu, page } = this.props;
    const fblocks = blocks.map(block => {
      return (
        <div>
          <p>Block here</p>
        </div>
      );
    });
/*     const fpages = pages.map(ipage => {
      return (
        <ul key={ipage.slug}>
          <li>
            <Link
              as={`/page/${ipage.slug}`}
              href={`/post?slug=${ipage.slug}&apiRoute=page`}
            >
              <a>{ipage.title.rendered}</a>
            </Link>
          </li>
        </ul>
      );
    }); */
    return (
      <Layout>
        <Menu menu={headerMenu} />
        <img
          src="/static/images/wordpress-plus-react-header.png"
          width="815"
          alt="logo"
          style={headerImageStyle}
        />
        <h1>{page.title.rendered}</h1>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: page.content.rendered,
          }}
        />
        <h2>Blocks</h2>
        {fblocks}
{/*         <h2>Pages</h2>
        {fpages} */}
        {id ? (
          <div>
            <h2>You Are Logged In</h2>
            <p>
              Your user ID is <span>{id}</span>, retrieved via an authenticated
              API query.
            </p>
          </div>
        ) : (
          <div>
            <h2>You Are Not Logged In</h2>
            <p>
              The frontend is not making authenticated API requests.{' '}
              <a href="/login">Log in.</a>
            </p>
          </div>
        )}
        <h2>Where You're At</h2>
        <p>
          You are looking at the REST API-powered React frontend. Be sure to
          also check out the{' '}
          <a href="http://localhost:3001/">GraphQL-powered frontend</a>.
        </p>
      </Layout>
    );
  }
}

export default PageWrapper(Index);
