import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { NhostProvider } from '@nhost/react';
import nhost from './utils/nhostClient.jsx';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client.jsx';

import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
	<NhostProvider nhost={nhost}>
		<ApolloProvider client={apolloClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ApolloProvider>
	</NhostProvider>
);
