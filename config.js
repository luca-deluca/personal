// Copy this file to config.js and fill with your CMS credentials.
// Contentful CDA tokens are designed to be public/read-only for client-side apps,
// but rotate them if exposed or abused.

window.CMS_CONFIG = {
    provider: 'contentful',
    spaceId: 'jswbl20ont5to6',
    environment: 'master',
    token: '3NAw8biYBa53qkicJVSqPzc1uPXms5dTglfdKUrlhMI',
    blogContentType: 'blogPost',      // adjust to your blog content type ID
    portfolioContentType: 'project'   // adjust to your portfolio content type ID
};
