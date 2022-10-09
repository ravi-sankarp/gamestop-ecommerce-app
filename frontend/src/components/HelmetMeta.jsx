import { Helmet } from 'react-helmet';

function HelmetMeta({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keyword"
        content={keywords}
      />
    </Helmet>
  );
}
HelmetMeta.defaultProps = {
  title: 'Welcome to Gamestop',
  description: 'We sell the best gaming utilities at affordable price',
  keywords: 'gaming,buy gaming products,cheap gaming,gaming utilities'
};

export default HelmetMeta;
