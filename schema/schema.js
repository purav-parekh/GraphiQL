const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const axios = require("axios");

const str = { type: GraphQLString };
const num = { type: GraphQLInt };

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: str,
    name: str,
    description: str,
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        console.log(parentValue);
        return axios
          .get(`http://localhost:3000/users?companyId=${parentValue.id}`)
          .then((res) => res.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: str,
    firstName: str,
    age: num,
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: str },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((res) => res.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: str },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
