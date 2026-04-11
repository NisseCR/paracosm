module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("docs/shared");
  eleventyConfig.addPassthroughCopy("docs/stories");

  const baseUrl = process.env.BASE_URL || "";

  eleventyConfig.addFilter("url", function (path) {
    if (!path) return path;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${baseUrl}${path}`.replace(/\/{2,}/g, "/").replace(":/", "://");
  });

  return {
    dir: {
      input: "docs",
      includes: "layouts",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};