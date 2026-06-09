export const updateSEO = ({ title, description, keywords, ogTitle, ogDescription }) => {
  if (title) {
    document.title = title;
  }

  const setMetaTag = (selector, attribute, value) => {
    if (!value) return;
    let tag = document.querySelector(`meta[${selector}]`);
    if (!tag) {
      tag = document.createElement('meta');
      const [attrName, attrVal] = selector.split('=');
      tag.setAttribute(attrName, attrVal.replace(/['"]/g, ''));
      document.head.appendChild(tag);
    }
    tag.setAttribute(attribute, value);
  };

  if (description) setMetaTag("name='description'", 'content', description);
  if (keywords) setMetaTag("name='keywords'", 'content', keywords);
  if (ogTitle || title) setMetaTag("property='og:title'", 'content', ogTitle || title);
  if (ogDescription || description) setMetaTag("property='og:description'", 'content', ogDescription || description);
};
