import { h, Component, Fragment as F } from 'preact';
import { Router } from 'preact-router';

import SideNav from './SideNav';
import './style.scss';


// Code-splitting is automated for routes
import Home from '../routes/home';
import Profile from '../routes/profile';
import Attributes from '../routes/JSCodeShaft/Attributes';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
		  <F>
				<SideNav />
			  <main>
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Profile path="/jscodeshaft/" />
						<Attributes path="/jscodeshaft/attributes/" />
						<Profile path="/profile/:user" />
					</Router>
			  </main>
      </F>
		);
	}
}
