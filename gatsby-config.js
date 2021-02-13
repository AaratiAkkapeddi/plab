module.exports = {
  siteMetadata: {
    title: "plab",
  },
  plugins: ["gatsby-plugin-sass",
  {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain remote schema Query type
        typeName: "ARENA",
        // // This is the field under which it's accessible
        fieldName: "arena",
        url: "https://api.are.na/graphql",
        headers: {
          "X-APP-TOKEN": `${process.env.REACT_APP_ARENA_KEY}`,
        },
      },
    },],
};
