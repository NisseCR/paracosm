module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("docs/shared");
  eleventyConfig.addPassthroughCopy("docs/stories");

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");

  eleventyConfig.addGlobalData("baseUrl", baseUrl);

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

  eleventyConfig.addShortcode("audio", function (sceneId) {
    const id = String(sceneId || "").trim();
    if (!id) return "";
    return `<div class="story-audio-marker fade-child" data-audio-step="${id}" aria-hidden="true"></div>`;
  });

  eleventyConfig.addShortcode("ruler", function () {
    return `<div class="rule fade-child" aria-hidden="true"></div>`;
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