import ApolloClient from 'apollo-boost';
import fetch from 'isomorphic-fetch'

export const client = new ApolloClient({
	uri: 'https://api.are.na/graphql',
	request: (operation) => {

	    operation.setContext({
	      headers: {
          "X-APP-TOKEN": ``,
          'X-AUTH-TOKEN': ``
          }
	    })
	 },
	fetch
})