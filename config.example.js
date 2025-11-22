// Copy this file to config.js and fill with your CMS credentials.
// Contentful CDA tokens are designed to be public/read-only for client-side apps,
// but rotate them if exposed or abused.

window.CMS_CONFIG = {
    provider: 'contentful',
    spaceId: 'your_space_id',
    environment: 'master',
    token: 'your_content_delivery_api_token',
    blogContentType: 'blogPost',      // adjust to your blog content type ID
    portfolioContentType: 'project'   // adjust to your portfolio content type ID
};
