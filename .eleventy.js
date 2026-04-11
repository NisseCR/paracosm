module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("docs/shared");
  eleventyConfig.addPassthroughCopy("docs/stories");

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");

  eleventyConfig.addFilter("url", function (path) {
    if (!path) return path;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("//")) {
      return path;
    }

    if (!path.startsWith("/")) {
      return `${baseUrl}/${path}`.replace(/\/{2,}/g, "/");
    }

    return `${baseUrl}${path}`.replace(/\/{2,}/g, "/");
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